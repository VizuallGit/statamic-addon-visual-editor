<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\PreviewRefresher;
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
 * Cheap enough to call on a timer: answering "stale?" is a fingerprint
 * comparison, so no browser starts unless something actually changed, and the
 * work itself is handed to the same detached process a save would start — the
 * request returns immediately either way.
 *
 * One endpoint for both the 5s tick and the button, because they want the same
 * thing. The caller decides how often to ask.
 *
 * `retry` is the button: it forgets the "failed" and "drew nothing" memos, so
 * those sections are tried again, and starts the run without the throttle.
 * `probe` only answers — the panel asks once on open, to show why a card has
 * no picture, and that must not start a browser.
 */
class PreviewTickController extends Controller
{
    /** Statuses that mean "the picture no longer matches the thing". */
    protected const NEEDS_SHOT = ['stale', 'missing'];

    /** Statuses that mean "no picture is coming", each a reason a card can show. */
    protected const BLOCKED = ['no_source', 'failed', 'renders_nothing', 'excluded'];

    /** Statuses held by a memo that a retry clears. */
    protected const MEMOED = ['failed', 'renders_nothing'];

    public function __invoke(Request $request, SetPreviewGenerator $generator): JsonResponse
    {
        // This one starts a process, so it is gated like the other writing
        // endpoints: a signed-in Control Panel user, and only where the site has
        // the panel this belongs to.
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('sections'), 403);

        $retry = $request->boolean('retry');
        $probe = $request->boolean('probe');
        $running = (bool) Cache::get('sve-previews:running', false);

        $targets = $generator->targets();

        if ($retry) {
            $memoed = array_keys(array_filter(
                $targets,
                fn ($target) => in_array($target['status'], static::MEMOED, true),
            ));

            foreach ($memoed as $handle) {
                Cache::forget(Targets::failedKey($handle));
                Cache::forget(Targets::emptyKey($handle));
            }

            // Without their memos those sections read as stale or missing.
            if ($memoed !== []) {
                $targets = $generator->targets();
            }
        }

        $stale = collect($targets)
            ->filter(fn ($target) => in_array($target['status'], static::NEEDS_SHOT, true))
            ->keys()
            ->all();

        $blocked = collect($targets)
            ->filter(fn ($target) => in_array($target['status'], static::BLOCKED, true))
            ->map(fn ($target) => $target['status'])
            ->all();

        // Throttled, not bare: a tick every 5s must never mean a browser every
        // 5s. The run reads fingerprints when it starts, so a dropped kick loses
        // nothing — and `failed`/`renders_nothing` are not counted above, so a
        // section that can never be photographed does not keep asking forever.
        // A retry is somebody pressing the button: it starts now.
        if ($stale !== [] && ! $running && ! $probe) {
            $retry ? PreviewRefresher::kick() : PreviewRefresher::kickThrottled();
        }

        return response()->json([
            'stale' => count($stale),
            'handles' => $stale,
            'running' => $running,
            'blocked' => (object) $blocked,
        ]);
    }
}
