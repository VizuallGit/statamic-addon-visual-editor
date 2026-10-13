<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\Commands\GenerateSetPreviews;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\PreviewRefresher;
use MarioHamann\StatamicVisualEditor\PreviewStatus;
use MarioHamann\StatamicVisualEditor\SetPreview\Targets;
use MarioHamann\StatamicVisualEditor\SetPreviewGenerator;
use Statamic\Facades\User;

/**
 * "Is anything out of date, and if so, go fix it" — for the Patterns panel.
 *
 * The automatic refreshes hang on Control Panel save events (see
 * Listeners\RefreshPreviews), which is exactly why editing an Antlers partial or
 * a fieldset in an editor leaves the thumbnails behind: a file on disk fires no
 * event. This is the panel's way of noticing that on its own.
 *
 * Only what changed is ever retaken: "stale" is a fingerprint comparison
 * (PreviewFingerprint), so a theme colour or font makes every picture stale,
 * an edit to one section's template makes that one stale, and a picture
 * nothing touched is left alone. The work is handed to the same detached
 * process a save would start; the request returns at once.
 *
 * Three ways to ask, one answer (`stale`, `running`, `errors`):
 *
 * - plain — the automatic check, once a minute while Live Preview is open:
 *   starts a run (throttled) when something is stale.
 * - `update` — the save button: starts a run now, retrying what failed last
 *   time, and says so from the first answer (`running`) until it is done.
 * - `probe` — following a run, or painting the button: never starts one.
 */
class PreviewTickController extends Controller
{
    /** Statuses that mean "the picture no longer matches the thing". */
    protected const NEEDS_SHOT = ['stale', 'missing'];

    /** How long a started run may take to boot before the panel stops waiting for it. */
    protected const QUEUED_SECONDS = 90;

    public function __invoke(Request $request, SetPreviewGenerator $generator): JsonResponse
    {
        // This one starts a process, so it is gated like the other writing
        // endpoints: a signed-in Control Panel user, and only where the site has
        // the panel this belongs to.
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('sections'), 403);

        $running = (bool) Cache::get('sve-previews:running', false)
            || (bool) Cache::get(GenerateSetPreviews::QUEUED, false);

        if ($request->boolean('update') && ! $running) {
            return $this->update($generator);
        }

        $errors = (array) Cache::get(GenerateSetPreviews::ERRORS, []);

        // `_` is the machine, not a section: the last run could not start a
        // browser at all. Until somebody presses the button again, nothing is
        // counted as waiting — the panel would wait on it forever, and every
        // tick would start another run that fails the same way.
        $stale = isset($errors['_']) ? [] : $this->stale($generator);

        // Throttled, not bare: the run reads fingerprints when it starts, so a
        // dropped kick loses nothing — and `failed`/`renders_nothing` are not
        // counted, so a section that can never be photographed does not keep
        // asking forever.
        if ($stale !== [] && ! $running && ! $request->boolean('probe') && PreviewRefresher::kickThrottled()) {
            // Followed by the panel from this answer on, like the button's run.
            Cache::put(GenerateSetPreviews::QUEUED, true, static::QUEUED_SECONDS);
            $running = true;
        }

        return response()->json([
            'stale' => count($stale),
            'handles' => $stale,
            'running' => $running,
            // Off: the site turned automatic refreshes off, and the panel
            // offers the save button only.
            'auto' => (bool) config('statamic-visual-editor.previews.auto', true),
            // What the last full run could not photograph, and why — so the
            // button can say it rather than leave the old pictures standing.
            'errors' => (object) ($running ? [] : $errors),
        ]);
    }

    /**
     * The save button: what is out of date — and what failed last time, since
     * somebody is asking in so many words — is retaken now. Nothing out of
     * date means nothing runs, and the answer says so.
     */
    protected function update(SetPreviewGenerator $generator): JsonResponse
    {
        foreach ($generator->targets() as $handle => $target) {
            if ($target['status'] === 'failed') {
                Cache::forget(Targets::failedKey($handle));
            }
        }

        Cache::forget(GenerateSetPreviews::ERRORS);

        $stale = $this->stale($generator);

        if ($stale !== []) {
            // Marked before the process exists: it takes a second to boot, and
            // a tick in that second must not read "nothing running" as done.
            Cache::put(GenerateSetPreviews::QUEUED, true, static::QUEUED_SECONDS);

            PreviewRefresher::update();
        }

        return response()->json([
            'stale' => count($stale),
            'handles' => $stale,
            'running' => $stale !== [],
            'auto' => (bool) config('statamic-visual-editor.previews.auto', true),
            'errors' => (object) [],
        ]);
    }

    /**
     * Everything whose picture no longer matches it: the section types, and
     * the saved sections and compositions (a theme change reaches those too).
     *
     * @return list<string>
     */
    protected function stale(SetPreviewGenerator $generator): array
    {
        $types = collect($generator->targets())
            ->filter(fn ($target) => in_array($target['status'], static::NEEDS_SHOT, true))
            ->keys();

        return $types->merge(PreviewStatus::staleEntries())->values()->all();
    }
}
