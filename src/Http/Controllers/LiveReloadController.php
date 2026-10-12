<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\LiveReload;
use Statamic\Facades\User;

/**
 * The live-reload button's poll: has a template or the build changed since
 * the page was rendered?
 *
 * When the site's sources are newer than its build, the build starts *after*
 * this response is sent (PHP-FPM finishes the request first), so the poll
 * answers at once and the page can reload for the markup while the CSS is
 * still being built. The next polls see `building` until it is done.
 */
class LiveReloadController
{
    public function __invoke()
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('live_reload'), 403);

        $status = LiveReload::status();

        if ($status['stale'] && ! $status['building']) {
            $sources = $status['sources'];
            app()->terminating(fn () => LiveReload::build($sources));
            $status['building'] = true;
        }

        unset($status['stale'], $status['sources']);

        return response()->json($status)->header('Cache-Control', 'no-store');
    }
}
