<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\DockGhost;
use MarioHamann\StatamicVisualEditor\Features;

/**
 * Grey text for the dock's HTML pane: the file around the caret in, the text
 * to offer there out. Writes nothing — the browser shows it, and only the
 * author's Tab puts it in the pane.
 *
 * The section's fields come in on the request because they are the Data
 * button's rows, which the dock already has; the house rules and the
 * example section are read server-side.
 */
class DockGhostController
{
    public function store(Request $request)
    {
        abort_unless(Features::allows('template_dock') && Features::allows('dock_ghost'), 403);

        $fields = $request->input('fields', []);

        $out = DockGhost::complete([
            'before' => (string) $request->input('before', ''),
            'after' => (string) $request->input('after', ''),
            'section' => (string) $request->input('section', ''),
            'fields' => is_array($fields) ? array_values(array_filter($fields, 'is_array')) : [],
        ]);

        if (! $out['ok']) {
            return response()->json([
                'message' => ($out['message'] ?? '') ?: __('sve::messages.dock_ghost_error'),
            ], $out['status'] ?? 502);
        }

        return response()->json([
            'ok' => true,
            'text' => $out['text'],
            'ms' => $out['ms'],
        ]);
    }
}
