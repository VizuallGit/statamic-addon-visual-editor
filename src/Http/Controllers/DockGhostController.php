<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\DockGhost;
use MarioHamann\StatamicVisualEditor\DockGhost\Usage;
use MarioHamann\StatamicVisualEditor\Features;

/**
 * The AI in the dock's HTML pane: grey text at the caret (`store`), ⌘K for a
 * selection or the caret (`edit`), and what it has cost this month (`usage`).
 * Writes nothing to the site — the browser shows the text, and only the
 * author's Tab or Enter puts it in the pane.
 *
 * The section's fields come in on the request because they are the Data
 * button's rows, which the dock already has; so do the suggestions this
 * author took lately, which live with their preferences. The house rules,
 * tokens and example section are read server-side.
 */
class DockGhostController
{
    public function store(Request $request)
    {
        $this->authorize();

        return $this->answer(DockGhost::complete($this->fields($request) + [
            'mode' => (string) $request->input('mode', 'line'),
        ]));
    }

    public function edit(Request $request)
    {
        $this->authorize();

        return $this->answer(DockGhost::edit($this->fields($request) + [
            'instruction' => (string) $request->input('instruction', ''),
            'selection' => (string) $request->input('selection', ''),
        ]));
    }

    public function usage()
    {
        $this->authorize();

        return response()->json(['ok' => true] + Usage::month());
    }

    protected function authorize(): void
    {
        abort_unless(Features::allows('template_dock') && Features::allows('dock_ghost'), 403);
    }

    /** What every request carries: the file around the caret, the section, its fields, the author's taken suggestions. */
    protected function fields(Request $request): array
    {
        $list = fn (string $key) => is_array($request->input($key)) ? array_values(array_filter($request->input($key), 'is_array')) : [];

        return [
            'before' => (string) $request->input('before', ''),
            'after' => (string) $request->input('after', ''),
            'section' => (string) $request->input('section', ''),
            'fields' => $list('fields'),
            'taken' => $list('taken'),
        ];
    }

    protected function answer(array $out)
    {
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
