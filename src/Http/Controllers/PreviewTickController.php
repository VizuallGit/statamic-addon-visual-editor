<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\Commands\GenerateSetPreviews;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\PreviewRefresher;
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
 * Cheap enough to call on a timer: answering "stale?" is a fingerprint
 * comparison, so no browser starts unless something actually changed, and the
 * work itself is handed to the same detached process a save would start — the
 * request returns immediately either way.
 *
 * One endpoint for both the 5s tick and the button. The button sends `force`:
 * every picture is retaken, current or not (PreviewRefresher::regenerate), and
 * the panel keeps asking until `running` is false, then shows what failed.
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

        if ($request->boolean('force')) {
            // Marked before the process exists: it takes a second to boot, and
            // a tick in that second must not read "nothing running" as done.
            Cache::put(GenerateSetPreviews::QUEUED, true, static::QUEUED_SECONDS);
            Cache::forget(GenerateSetPreviews::ERRORS);

            PreviewRefresher::regenerate();

            return response()->json(['stale' => 0, 'handles' => [], 'running' => true, 'errors' => []]);
        }

        $running = (bool) Cache::get('sve-previews:running', false)
            || (bool) Cache::get(GenerateSetPreviews::QUEUED, false);

        $errors = (array) Cache::get(GenerateSetPreviews::ERRORS, []);

        // `_` is the machine, not a section: the last run could not start a
        // browser at all. Until somebody presses the button again, nothing is
        // counted as waiting — the panel would wait on it forever, and every
        // tick would start another run that fails the same way.
        $stale = isset($errors['_']) ? [] : collect($generator->targets())
            ->filter(fn ($target) => in_array($target['status'], static::NEEDS_SHOT, true))
            ->keys()
            ->all();

        // Throttled, not bare: a tick every 5s must never mean a browser every
        // 5s. The run reads fingerprints when it starts, so a dropped kick loses
        // nothing — and `failed`/`renders_nothing` are not counted above, so a
        // section that can never be photographed does not keep asking forever.
        if ($stale !== [] && ! $running) {
            PreviewRefresher::kickThrottled();
        }

        return response()->json([
            'stale' => count($stale),
            'handles' => $stale,
            'running' => $running,
            // What the last full run could not photograph, and why — so the
            // button can say it rather than leave the old pictures standing.
            'errors' => (object) ($running ? [] : $errors),
        ]);
    }
}
