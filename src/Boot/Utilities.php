<?php

namespace MarioHamann\StatamicVisualEditor\Boot;

use MarioHamann\StatamicVisualEditor\PreviewStatus;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SetPreviewsController;
use Statamic\Facades\CP\Nav;
use Statamic\Facades\Utility;
use Statamic\Statamic;

/**
 * The addon's Utility pages (Section Previews, Site Files) and who sees them
 * in the nav.
 *
 * Moved out of ServiceProvider::bootAddon() verbatim in WP7a.
 */
final class Utilities
{
    public static function register(): void
    {
        // Utility page with a button to (re)generate the Add Set picker preview
        // images by screenshotting the rendered sections.
        Utility::register('set-previews')
            ->view('sve::utilities.set-previews', fn () => PreviewStatus::all())
            ->title('Section Previews')
            ->navTitle('Section Previews')
            ->icon('assets')
            ->description(__('sve::messages.previews_intro'))
            ->routes(function ($router) {
                $router->post('generate', [SetPreviewsController::class, 'generate'])->name('generate');
            });

        // The addon's own Utility page: the site's code files. (The AI chat
        // outside Live Preview is not a page — it floats in the corner of every
        // CP screen instead; see resources/js/ai-launcher.js.)
        //
        // Registered through Utility::extend() so the callback runs wherever
        // Statamic boots the repository. One of those places is routes/cp.php,
        // which calls Utility::routes() while routes are being *registered* —
        // long before any middleware, so there is no signed-in user yet. The
        // condition here is therefore the site-wide toggle, which needs none:
        // Features::allows() would answer false for want of a user, no route
        // would be built, and the page would 404 for everybody while still
        // showing in the nav (the middleware boots the repository a second
        // time, when there *is* a user).
        //
        // Who may open it is settled per request instead: Statamic's own
        // `can:access <handle> utility` middleware on the route, and the
        // Features::allows() check in the view closure below, which runs when
        // the page is asked for.
        Utility::extend(function () {
            if (Features::enabled('file_manager')) {
                Utility::register('site-files')
                    ->view('sve::utilities.site-files', function () {
                        abort_unless(Features::allows('file_manager'), 403);

                        return [];
                    })
                    ->title(__('sve::messages.files_title'))
                    ->navTitle(__('sve::messages.files_title'))
                    ->icon('folder-edit')
                    ->description(__('sve::messages.files_intro'));
            }
        });

        static::hideUtilitiesFromNav();
    }

    /**
     * Take the addon's Utility page back out of the nav for people who may
     * not open it.
     *
     * The route has to exist for the whole site — it is built before anyone has
     * signed in — so "may this person use it" is answered here instead, where
     * there is a user to ask about. Statamic matches a nav child by its display
     * name, and the URL is the only thing that can name one page and no other.
     *
     * The Utilities index page can still list a page this user will be refused:
     * Statamic builds that list from the `access <handle> utility` permission
     * alone, and clicking through gives them the 403 the view closure raises.
     * A tool the site has switched off is never registered at all, so that case
     * does not arise.
     */
    protected static function hideUtilitiesFromNav(): void
    {
        Nav::extend(function ($nav) {
            // Only pages that were registered: a feature the site has switched
            // off has no nav item to take away. The URL is built the way
            // Utility::url() builds it, off the index route, so nothing here
            // depends on a named route that may not exist.
            $hidden = collect([
                'site-files' => 'file_manager',
            ])
                ->filter(fn ($feature) => Features::enabled($feature) && ! Features::allows($feature))
                ->keys()
                ->map(fn ($slug) => cp_route('utilities.index').'/'.$slug)
                ->all();

            if ($hidden === []) {
                return;
            }

            if (! $parent = $nav->find('Tools', 'Utilities')) {
                return;
            }

            if ($children = $parent->resolveChildren()->children()) {
                $parent->children($children->reject(fn ($child) => in_array($child->url(), $hidden, true)));
            }
        });
    }
}
