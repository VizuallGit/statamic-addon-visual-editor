<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\DockGhost;
use MarioHamann\StatamicVisualEditor\DockGhost\Job;
use MarioHamann\StatamicVisualEditor\DockGhost\Usage;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\User;

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
 *
 * On the Cursor key an answer takes longer than the web server lets a
 * request live, so `store` and `edit` start a background job instead
 * (DockGhost\Job) and answer 202 with its id; `job` gives the answer once it
 * is written, in the same shape. Claude answers in the request itself.
 */
class DockGhostController
{
    public function store(Request $request)
    {
        $this->authorize();

        $fields = $this->fields($request) + [
            'mode' => (string) $request->input('mode', 'line'),
        ];

        if (DockGhost::provider() === 'cursor') {
            return $this->started('complete', $fields);
        }

        return $this->answer(DockGhost::complete($fields));
    }

    public function edit(Request $request)
    {
        $this->authorize();

        $fields = $this->fields($request) + [
            'instruction' => (string) $request->input('instruction', ''),
            'selection' => (string) $request->input('selection', ''),
        ];

        if (DockGhost::provider() === 'cursor') {
            // Said at once, not after a job: nothing would be asked anyway.
            if ($problem = DockGhost::editProblem($fields)) {
                return $this->answer($problem);
            }

            return $this->started('edit', $fields);
        }

        return $this->answer(DockGhost::edit($fields));
    }

    /** A background job's answer once it is written; `pending` until then. Only its own author may ask. */
    public function job(string $id)
    {
        $this->authorize();

        $job = Job::read($id);

        abort_unless($job !== null, 404);
        abort_unless(($job['user'] ?? '') === (string) User::current()?->id(), 403);

        if (Job::stale($job)) {
            return $this->done(['ok' => false, 'status' => 502, 'message' => __('sve::messages.dock_ghost_error')]);
        }

        if (($job['state'] ?? '') !== 'done') {
            return response()->json(['ok' => true, 'state' => 'pending']);
        }

        return $this->done((array) ($job['result'] ?? []) + ['ok' => false]);
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

    protected function started(string $kind, array $fields)
    {
        return response()->json(['ok' => true, 'job' => Job::start($kind, $fields)], 202);
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

    /** A job's answer: as answer() gives it, marked done so the browser stops asking. */
    protected function done(array $out)
    {
        $response = $this->answer($out);

        return $response->setData((array) $response->getData(true) + ['state' => 'done']);
    }
}
