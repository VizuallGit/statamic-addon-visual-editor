<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\PageSpeed;
use MarioHamann\StatamicVisualEditor\RenderProfile;
use Statamic\Facades\User;

/**
 * One page, rendered here with a stopwatch on every template — the
 * performance panel's "Server" tab.
 *
 * Locked to this site's own addresses like the PageSpeed endpoint, and to the
 * same people: it renders a page twice on the server for whoever asks.
 */
class RenderProfileController
{
    public function __invoke(Request $request)
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('performance'), 403);

        $url = (string) $request->query('url', '');

        abort_unless(filter_var($url, FILTER_VALIDATE_URL) && PageSpeed::isOwnUrl($url), 422);

        set_time_limit(60);

        return response()->json(RenderProfile::run($url));
    }
}
