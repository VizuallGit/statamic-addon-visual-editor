<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\PageTransitionSettings;
use Statamic\Facades\User;

/**
 * «Whole site» in Build → Animation → Page transition: how every page
 * changes to the next (PageTransitionSettings). `saved` false: nothing is
 * set yet and the site's own CSS decides; the settings shown are what that is.
 */
class PageTransitionSettingsController
{
    public function show()
    {
        $this->authorizeBuild();

        $saved = PageTransitionSettings::read();

        return response()->json([
            'saved' => $saved !== null,
            'settings' => $saved ?? PageTransitionSettings::DEFAULTS,
        ]);
    }

    public function update(Request $request)
    {
        $this->authorizeBuild();

        $settings = $request->input('settings');

        abort_unless(is_array($settings), 422);

        return response()->json([
            'ok' => true,
            'saved' => true,
            'settings' => PageTransitionSettings::write($settings),
        ]);
    }

    private function authorizeBuild(): void
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('template_dock'), 403);
    }
}
