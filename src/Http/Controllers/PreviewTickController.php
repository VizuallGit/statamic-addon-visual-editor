<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;
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
 * One endpoint for both the 5s tick and the button, because they want the same
 * thing. The caller decides how often to ask.
 */
class PreviewTickController extends Controller
{
    /** Statuses that mean "the picture no longer matches the thing". */
    protected const NEEDS_SHOT = ['stale', 'missing'];

    public function __invoke(SetPreviewGenerator $generator): JsonResponse
    {
        // This one starts a process, so it is gated like the other writing
        // endpoints: a signed-in Control Panel user, and only where the site has
        // the panel this belongs to.
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('sections'), 403);

        $running = (bool) Cache::get('sve-previews:running', false);

        $stale = collect($generator->targets())
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
        ]);
    }
}
