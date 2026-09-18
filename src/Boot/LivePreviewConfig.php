<?php

namespace MarioHamann\StatamicVisualEditor\Boot;

use MarioHamann\StatamicVisualEditor\LivePreviewSectionScope;
use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Foundation\Http\Middleware\TrimStrings;
use Statamic\Facades\Cascade;
use MarioHamann\StatamicVisualEditor\Breakpoints;
use Statamic\Statamic;

/**
 * How Live Preview and the addon's own routes behave at request level.
 *
 * Moved out of ServiceProvider::bootAddon() verbatim in WP7a. `register()` is
 * what ran there before the translations were loaded; `devices()` must run
 * after them (see its comment), so the provider calls it separately.
 */
final class LivePreviewConfig
{
    public static function register(): void
    {
        // `/!/sve/…` carries a publish form's values, not visitor input. Bard
        // keeps a space as its own string (`{type: text, text: " "}`); Laravel's
        // TrimStrings would eat it. Every addon route must skip this — a new
        // site must not add anything in AppServiceProvider.
        TrimStrings::skipWhen(fn ($request) => $request->is('!/sve/*'));
        ConvertEmptyStringsToNull::skipWhen(fn ($request) => $request->is('!/sve/*'));

        // The injected preview script (resources/js/preview.js) hot-reloads the
        // preview itself via Alpine.morph. Disable Statamic's built-in hot
        // reload so the two never morph the same document concurrently —
        // double-morph races corrupt the DOM and reset the scroll position.
        config(['statamic.live_preview.hot_reload_contents' => false]);

        // Busting ?t= on every <script type=module> forces Vite/site.js to
        // re-execute after each morph → full iframe reload ("Reload site?").
        config(['statamic.live_preview.force_reload_js_modules' => false]);


        Cascade::hydrated(function ($cascade) {
            $request = request();

            if (! $request->isLivePreview()) {
                return;
            }

            LivePreviewSectionScope::limitCascade(
                $cascade,
                LivePreviewSectionScope::idsFromRequest($request)
            );
        });
    }

    /** After the translations are loaded — the device names are translated. */
    public static function devices(): void
    {
            // The device buttons ARE the breakpoints. Two lists — one in
            // config/statamic/live_preview.php and one in the responsive field —
            // is how a site ends up previewing a width it never wrote CSS for.
            // Whatever `Breakpoints` says wins, so adding a size adds its button.
            //
            // Below the line above, and that is not tidiness: the names on those
            // buttons are translations, and Laravel caches an empty result for a
            // namespace it is asked about before it has been told where it lives.
            // One early lookup and every `sve::` string on the page is a raw key.
            config(['statamic.live_preview.devices' => Breakpoints::devices()]);
    }
}
