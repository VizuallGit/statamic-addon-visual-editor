<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\PageSpeed;
use Statamic\Facades\User;

/**
 * One page, run through Google PageSpeed Insights, trimmed to what the panel
 * shows. The Control Panel never talks to Google itself — the key stays here.
 *
 * Locked to this site's own addresses. The endpoint takes a URL, so without
 * that it would be a signed-in scanner for any site on the web, paid for out of
 * this site's quota.
 */
class PageSpeedController
{
    public function __invoke(Request $request)
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('performance') && PageSpeed::enabled(), 403);

        $url = (string) $request->query('url', '');

        abort_unless(filter_var($url, FILTER_VALIDATE_URL) && PageSpeed::isOwnUrl($url), 422);

        if (! PageSpeed::isPublicHost($url)) {
            return response()->json([
                'ok' => false,
                'reason' => 'local',
            ]);
        }

        return response()->json(PageSpeed::run(
            $url,
            (string) $request->query('strategy', 'mobile'),
            $request->boolean('fresh')
        ));
    }
}
