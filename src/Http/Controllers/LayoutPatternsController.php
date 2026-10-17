<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\LayoutPatterns;
use Statamic\Facades\User;
use Statamic\View\View;

/**
 * The layout's Patterns: list them, drop one in, and draw one alone for its
 * card's preview. Writes files in resources/ — the same gate as making a
 * section type.
 */
class LayoutPatternsController
{
    public function index()
    {
        abort_unless(User::current(), 403);

        return response()->json(['ok' => true, 'patterns' => LayoutPatterns::describe()]);
    }

    public function store(Request $request)
    {
        abort_unless(User::current()?->can('configure fields'), 403);

        $kind = (string) $request->input('kind');
        $handle = (string) $request->input('pattern');
        $error = $kind === 'section'
            ? LayoutPatterns::addSection($handle)
            : (in_array($kind, ['header', 'footer'], true) ? LayoutPatterns::place($kind, $handle, $request->boolean('replace')) : 'unknown');

        return response()->json(['ok' => $error === null, 'error' => $error, 'patterns' => LayoutPatterns::describe()], $error ? 422 : 200);
    }

    /**
     * One pattern, drawn as the site draws it — inside the site's own layout,
     * so its CSS, fonts and theme are all there — with everything around it
     * hidden: the card shows the pattern, not the page.
     */
    public function preview(Request $request)
    {
        abort_unless(User::current(), 403);

        $view = LayoutPatterns::view((string) $request->query('kind'), (string) $request->query('pattern'));
        abort_unless($view, 404);

        $html = app(View::class)
            ->template('sve::layout-pattern-preview')
            ->layout(config('statamic.system.layout', 'layout'))
            ->with(['sve_pattern' => $view])
            ->render();

        $only = '<style>body *{visibility:hidden!important}'
            .'[data-sve-pattern-preview],[data-sve-pattern-preview] *{visibility:visible!important}'
            .'[data-sve-pattern-preview]{position:absolute!important;top:0;left:0;right:0;z-index:2147483647}'
            .'html,body{overflow:hidden!important}</style>';

        $html = str_contains($html, '</head>') ? str_replace('</head>', $only.'</head>', $html) : $only.$html;

        return response($html)
            ->header('X-Robots-Tag', 'noindex, nofollow, noarchive')
            ->header('Cache-Control', 'no-store');
    }
}
