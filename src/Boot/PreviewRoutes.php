<?php

namespace MarioHamann\StatamicVisualEditor\Boot;

use Illuminate\Support\Facades\Route;
use MarioHamann\StatamicVisualEditor\Http\Controllers\CollectionViewPreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedSectionPreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedTemplatePreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionDefaultsPreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionPreviewController;
use Statamic\Statamic;

/**
 * Routes that render a page or a section for a picture or for Live Preview:
 * the signed section previews and the Live Preview targets of the editor's
 * own collections. Split out of Boot\Routes in WP7c, verbatim.
 */
final class PreviewRoutes
{
    public static function register(): void
    {
        // Signed, short-lived route that renders a page with only one section in
        // it — the preview generator screenshots that. Registered explicitly:
        // Statamic only auto-loads an addon's routes/ files for the root app.
        Route::middleware(['web', 'signed'])->group(function () {
            Route::get('/!/sve/section-preview/{entry}/{section}', [SectionPreviewController::class, 'show'])
                ->name('sve.section-preview');

            // A section type on its own, drawn with its default values — what the
            // picker inserts, and so what its preview image should be a picture
            // of. The handle rides in `?type=`, since set handles hold slashes.
            Route::get('/!/sve/section-defaults-preview', SectionDefaultsPreviewController::class)
                ->name('sve.section-defaults-preview');

            // Renders a saved section on its own, for its preview screenshot.
            Route::get('/!/sve/saved-section-preview/{id}', [SavedSectionPreviewController::class, 'show'])
                ->name('sve.saved-section-preview');

            // The same for a page template — every section in it, in one render.
            Route::get('/!/sve/saved-template-preview/{id}', [SavedTemplatePreviewController::class, 'show'])
                ->name('sve.saved-template-preview');
        });

        // Live Preview target for the Global sections collection. Both groups are
        // needed, the same pair Statamic's own FrontendController runs on: `web`
        // for the session (the route is gated on a CP user) and `statamic.web`
        // for the token middleware, which substitutes the entry being edited —
        // that's what makes the preview show unsaved changes as they're typed.
        Route::middleware(['web', 'statamic.web'])->group(function () {
            Route::get('/!/sve/global-section-preview/{id}', [SavedSectionPreviewController::class, 'livePreview'])
                ->name('sve.global-section-preview');

            Route::get('/!/sve/collection-view-preview/{id}', CollectionViewPreviewController::class)
                ->name('sve.collection-view-preview');
        });
    }
}
