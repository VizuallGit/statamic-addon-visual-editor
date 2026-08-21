<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\GridIcon;
use MarioHamann\StatamicVisualEditor\IconifyDefault;
use MarioHamann\StatamicVisualEditor\PanelVisibility;
use MarioHamann\StatamicVisualEditor\ReplicatorSettings;
use MarioHamann\StatamicVisualEditor\ResponsiveFields;

/**
 * Adds CP field-config extras once per Control Panel request.
 *
 * Per request rather than at boot, for one reason: the labels. The Control Panel
 * speaks the language its user picked, and that language is chosen by a
 * middleware — long after the addon booted, where a translated string would
 * resolve to whatever the site's default happens to be. Registering here, behind
 * that middleware, is what lets a Danish editor read a Danish label.
 *
 * Registering twice is free: the config fields are merged by key, so the second
 * pass overwrites the first with the same thing.
 */
class RegisterPanelVisibility
{
    public function handle(Request $request, Closure $next)
    {
        PanelVisibility::register();
        GridIcon::register();
        ResponsiveFields::register();
        ReplicatorSettings::register();
        IconifyDefault::register();

        return $next($request);
    }
}
