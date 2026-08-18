<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SectionTemplate;
use MarioHamann\StatamicVisualEditor\TailwindTheme;
use Statamic\Facades\User;

/**
 * Read and write a section type's Antlers partial from Live Preview.
 *
 * Super admin and the settings toggle both have to be on. The file is the
 * shared template for every page that uses the type — which is why editors
 * never see the dock.
 */
class SectionTemplateController
{
    public function show(Request $request)
    {
        $this->authorize();

        $handle = (string) $request->query('type', '');
        $path = SectionTemplate::path($handle);

        abort_unless($path, 404);

        $parts = SectionTemplate::split((string) file_get_contents($path));

        return response()->json([
            'type' => $handle,
            'path' => SectionTemplate::relative($path),
            'html' => $parts['html'],
            'css' => $parts['css'],
            'js' => $parts['js'],
        ]);
    }

    public function theme()
    {
        $this->authorize();

        return response()->json([
            'css' => TailwindTheme::css(),
        ]);
    }

    public function update(Request $request)
    {
        $this->authorize();

        $handle = (string) $request->input('type', '');
        $html = $request->input('html');
        $css = $request->input('css');
        $js = $request->input('js');

        abort_unless(is_string($html) && is_string($css) && is_string($js), 422);

        $path = SectionTemplate::path($handle);

        abort_unless($path, 404);

        $meta = SectionTemplate::split((string) file_get_contents($path));
        $tw = $request->input('tw');
        $contents = SectionTemplate::join([
            'html' => $html,
            'css' => $css,
            'js' => $js,
            'tw' => Features::enabled('tailwind_dock') && is_string($tw)
                ? $tw
                : ($meta['tw'] ?? ''),
            'html_tag' => $meta['html_tag'],
            'css_tag' => $meta['css_tag'],
            'js_tag' => $meta['js_tag'],
        ]);

        file_put_contents($path, $contents);

        return response()->json([
            'ok' => true,
            'path' => SectionTemplate::relative($path),
        ]);
    }

    protected function authorize(): void
    {
        abort_unless(User::current()?->isSuper(), 403);
        abort_unless(Features::enabled('template_dock'), 403);
    }
}
