<?php

namespace MarioHamann\StatamicVisualEditor\Boot;

use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Foundation\Http\Middleware\TrimStrings;
use Illuminate\Support\Facades\Route;
use MarioHamann\StatamicVisualEditor\Http\Controllers\ComponentController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\FileManagerController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\GlobalSectionStashController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\GlobalsPreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTemplateController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SiteCssController;
use Statamic\Statamic;

/**
 * Routes that carry a publish form's values or a template's text and must not
 * be trimmed on the way in — see the comment inside. Split out of Boot\Routes
 * in WP7c, verbatim.
 */
final class DockRoutes
{
    public static function register(): void
    {
        // Stashes the globals being edited beside Live Preview, so the preview
        // render can use them before they're saved.
        //
        // A publish form's values are carried on these two routes, and Laravel's
        // `web` group would take them apart on the way in: TrimStrings strips the
        // edges off every string, and ConvertEmptyStringsToNull turns what is left
        // of a whitespace-only one into null. In a Bard value the space between
        // two styled words IS a string of its own — `{type: text, text: " "}` —
        // and so is the space at the end of `"Indtast "`. Trimmed, the words run
        // into each other: "Indtast din overhs" comes back "Indtastdinoverhs", but
        // only where somebody has coloured a word, and only in the preview, since
        // the value itself is never touched. Statamic hits the same wall and
        // answers it the same way — it skips Laravel's TrimStrings for the whole
        // Control Panel and runs a Bard-aware one there instead (see
        // Statamic\Http\Middleware\CP\TrimStrings). These routes are the Control
        // Panel by another name: nothing on them is user input to be tidied up,
        // it is a form's values on their way to being rendered.
        Route::middleware('web')
            ->withoutMiddleware([TrimStrings::class, ConvertEmptyStringsToNull::class])
            ->group(function () {
                Route::post('/!/sve/globals-preview', [GlobalsPreviewController::class, 'store'])
                    ->name('sve.globals-preview.store');
                Route::post('/!/sve/globals-preview/clear', [GlobalsPreviewController::class, 'clear'])
                    ->name('sve.globals-preview.clear');

                // Same idea for a global section being edited in the side panel: the
                // page's preview renders what's being typed, not what's on disk.
                Route::post('/!/sve/global-section-stash', [GlobalSectionStashController::class, 'store'])
                    ->name('sve.global-section-stash.store');
                Route::post('/!/sve/global-section-stash/clear', [GlobalSectionStashController::class, 'clear'])
                    ->name('sve.global-section-stash.clear');

                // Antlers whitespace at the edges of a partial is layout, not
                // noise — TrimStrings would eat the blank lines a template
                // author just put back.
                Route::post('/!/sve/section-template', [SectionTemplateController::class, 'update'])
                    ->name('sve.section-template.update');
                Route::post('/!/sve/section-template/lock', [SectionTemplateController::class, 'lock'])
                    ->name('sve.section-template.lock');

                // A component carries markup out of a section, so the same
                // whitespace rule applies to it.
                Route::post('/!/sve/component', [ComponentController::class, 'store'])
                    ->name('sve.component.store');
                Route::post('/!/sve/site-css', [SiteCssController::class, 'update'])
                    ->name('sve.site-css.update');
                Route::post('/!/sve/site-css/create', [SiteCssController::class, 'store'])
                    ->name('sve.site-css.store');
                Route::post('/!/sve/file-manager/file', [FileManagerController::class, 'update'])
                    ->name('sve.file-manager.update');
                Route::post('/!/sve/file-manager/rename', [FileManagerController::class, 'rename'])
                    ->name('sve.file-manager.rename');
                Route::post('/!/sve/file-manager/file/create', [FileManagerController::class, 'store'])
                    ->name('sve.file-manager.store');
                Route::post('/!/sve/file-manager/folder/create', [FileManagerController::class, 'storeFolder'])
                    ->name('sve.file-manager.store-folder');
                Route::delete('/!/sve/file-manager/file', [FileManagerController::class, 'destroy'])
                    ->name('sve.file-manager.destroy');
                Route::delete('/!/sve/file-manager/folder', [FileManagerController::class, 'destroyFolder'])
                    ->name('sve.file-manager.destroy-folder');

                Route::post('/!/sve/site-css/rename', [SiteCssController::class, 'rename'])
                    ->name('sve.site-css.rename');
                Route::delete('/!/sve/site-css', [SiteCssController::class, 'destroy'])
                    ->name('sve.site-css.destroy');

                Route::post('/!/sve/site-css/import', [SiteCssController::class, 'import'])
                    ->name('sve.site-css.import');
            });
    }
}
