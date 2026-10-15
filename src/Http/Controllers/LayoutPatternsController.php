<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\LayoutPatterns;
use Statamic\Facades\User;

/**
 * The layout's Patterns: list them, drop one in, delete the header or footer.
 * Writes files in resources/ — the same gate as making a section type.
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

    public function destroy(Request $request)
    {
        abort_unless(User::current()?->can('configure fields'), 403);

        $kind = (string) $request->input('kind');
        abort_unless(in_array($kind, ['header', 'footer'], true), 400);

        LayoutPatterns::clear($kind);

        return response()->json(['ok' => true, 'patterns' => LayoutPatterns::describe()]);
    }
}
