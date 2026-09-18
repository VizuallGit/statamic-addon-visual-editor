<?php

namespace MarioHamann\StatamicVisualEditor\Boot;

use Illuminate\Support\Facades\Route;
use MarioHamann\StatamicVisualEditor\Http\Controllers\AiChatController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\AiCopyController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\BuiltAssetController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\ChromePrefsController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\CollectionEntriesController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\CollectionPresetController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\CommentsController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\ComponentController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\CreateEntryController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\DataVarsController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\EntryActivityController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\FileManagerController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\LibraryScanController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\LinkTargetsController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\PageSpeedController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\PreviewTickController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\PropFieldsController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedSectionsController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedTemplatesController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SchemaController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionMetaController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTemplateController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTypesController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SiteCssController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\TemplatePropsController;
use Statamic\Facades\Site;

/**
 * The editor's ordinary `/!/sve/…` endpoints: library, section types, meta,
 * dock reads, AI, comments, schema, prefs. Split out of Boot\Routes in WP7c,
 * verbatim.
 */
final class EditorRoutes
{
    public static function register(): void
    {
        Route::middleware('web')->group(function () {
            Route::get('/!/sve/build/{path}', [BuiltAssetController::class, 'show'])
                ->where('path', '.*')
                ->name('sve.build');

            // Saved sections (reusable section templates).
            Route::get('/!/sve/saved-sections', [SavedSectionsController::class, 'index'])
                ->name('sve.saved-sections.index');
            Route::post('/!/sve/saved-sections', [SavedSectionsController::class, 'store'])
                ->name('sve.saved-sections.store');
            Route::post('/!/sve/saved-sections/{id}/preview', [SavedSectionsController::class, 'regeneratePreview'])
                ->name('sve.saved-sections.preview');
            // Where a section is in use — asked before the delete, so the confirm
            // can name the pages that lose it.
            Route::get('/!/sve/saved-sections/{id}/usage', [SavedSectionsController::class, 'usage'])
                ->name('sve.saved-sections.usage');
            Route::delete('/!/sve/saved-sections/{id}', [SavedSectionsController::class, 'destroy'])
                ->name('sve.saved-sections.destroy');

            // Page compositions (a whole page's sections, saved to drop on another).
            Route::get('/!/sve/templates', [SavedTemplatesController::class, 'index'])
                ->name('sve.templates.index');
            Route::post('/!/sve/templates', [SavedTemplatesController::class, 'store'])
                ->name('sve.templates.store');
            Route::delete('/!/sve/templates/{id}', [SavedTemplatesController::class, 'destroy'])
                ->name('sve.templates.destroy');

            // The site's own section types, with preview images as they are on
            // disk — the library asks on open, so a regenerated preview shows
            // without reloading the Control Panel.
            Route::get('/!/sve/section-types', [SectionTypesController::class, 'index'])
                ->name('sve.section-types.index');

            // The handle travels as a query parameter, never a path segment — set
            // handles hold slashes (`hero/style_1`), and a route parameter would
            // swallow them.
            Route::get('/!/sve/section-types/usage', [SectionTypesController::class, 'usage'])
                ->name('sve.section-types.usage');
            Route::delete('/!/sve/section-types', [SectionTypesController::class, 'destroy'])
                ->name('sve.section-types.destroy');

            // Making one. Sits next to the delete on purpose: both write the
            // page-builder fieldset in the repository, and both are gated on
            // `configure fields` rather than on being able to edit a page.
            Route::post('/!/sve/section-types', [SectionTypesController::class, 'store'])
                ->name('sve.section-types.store');

            // Fresh meta + defaults for a set, so a picker-inserted section also
            // renders in the CP's own section list (see SectionMetaController).
            Route::get('/!/sve/section-meta', SectionMetaController::class)
                ->name('sve.section-meta');

            // Patterns' own staleness check: cheap enough for a timer, and it
            // starts the generator itself when a file edit left the thumbnails
            // behind (no CP save event fires for that).
            Route::post('/!/sve/previews/tick', PreviewTickController::class)
                ->name('sve.previews.tick');

            // Same query-parameter pattern as section-types: handles hold slashes.
            Route::get('/!/sve/components', [ComponentController::class, 'index'])
                ->name('sve.components.index');
            Route::get('/!/sve/section-template/partials', [SectionTemplateController::class, 'partials'])
                ->name('sve.section-template.partials');
            Route::get('/!/sve/section-template/history', [SectionTemplateController::class, 'history'])
                ->name('sve.section-template.history');
            Route::get('/!/sve/section-template/history/entry', [SectionTemplateController::class, 'historyEntry'])
                ->name('sve.section-template.history.entry');
            Route::get('/!/sve/section-template', [SectionTemplateController::class, 'show'])
                ->name('sve.section-template.show');
            Route::get('/!/sve/site-css', [SiteCssController::class, 'index'])
                ->name('sve.site-css.index');
            Route::get('/!/sve/site-css/classes', [SiteCssController::class, 'classes'])
                ->name('sve.site-css.classes');
            Route::get('/!/sve/site-css/file', [SiteCssController::class, 'show'])
                ->name('sve.site-css.show');
            // The site's own code files (Utilities > Site Files). Off by default;
            // FileManager decides which paths exist at all.
            Route::get('/!/sve/file-manager', [FileManagerController::class, 'index'])
                ->name('sve.file-manager.index');
            Route::get('/!/sve/file-manager/file', [FileManagerController::class, 'show'])
                ->name('sve.file-manager.show');
            Route::get('/!/sve/file-manager/folder', [FileManagerController::class, 'folder'])
                ->name('sve.file-manager.folder');

            // What Google says about a page, and what its real visitors met.
            // Slow on purpose: Lighthouse loads the page several times.
            Route::get('/!/sve/pagespeed', PageSpeedController::class)
                ->name('sve.pagespeed');

            Route::get('/!/sve/template-props', TemplatePropsController::class)
                ->name('sve.template-props');

            Route::get('/!/sve/data-vars', DataVarsController::class)
                ->name('sve.data-vars');
            Route::get('/!/sve/tailwind-theme', [SectionTemplateController::class, 'theme'])
                ->name('sve.tailwind-theme');
            Route::get('/!/sve/component-props', [SectionTemplateController::class, 'componentProps'])
                ->name('sve.component-props');

            // Where a link prop can point. Fetched once per dock session, not
            // per component: the answer is the same for every one of them.
            Route::get('/!/sve/link-targets', LinkTargetsController::class)
                ->name('sve.link-targets');

            // A component's fields as the Control Panel's own fields, and the
            // way back from what the form holds to what the call carries.
            Route::get('/!/sve/prop-fields', [PropFieldsController::class, 'show'])
                ->name('sve.prop-fields');
            Route::post('/!/sve/prop-fields', [PropFieldsController::class, 'store'])
                ->name('sve.prop-fields.store');

            Route::post('/!/sve/ai-chat', [AiChatController::class, 'store'])
                ->name('sve.ai-chat');

            // Copy suggestions for one text field, written against the page's
            // keywords. Separate from ai-chat: this one never writes anything,
            // and it answers with a list of strings rather than with markup.
            Route::post('/!/sve/ai-copy', [AiCopyController::class, 'store'])
                ->name('sve.ai-copy');
            Route::get('/!/sve/ai-copy/keywords', [AiCopyController::class, 'keywords'])
                ->name('sve.ai-copy.keywords');

            // Structured data (schema.org JSON-LD) for this page and the site.
            Route::get('/!/sve/schema', [SchemaController::class, 'show'])
                ->name('sve.schema.show');
            Route::post('/!/sve/schema', [SchemaController::class, 'store'])
                ->name('sve.schema.store');

            Route::post('/!/sve/chrome-prefs', [ChromePrefsController::class, 'update'])
                ->name('sve.chrome-prefs.update');
            Route::delete('/!/sve/chrome-prefs', [ChromePrefsController::class, 'destroy'])
                ->name('sve.chrome-prefs.destroy');

            Route::get('/!/sve/entry-activity/{entry}', EntryActivityController::class)
                ->name('sve.entry-activity');

            Route::get('/!/sve/comments/{entry}', [CommentsController::class, 'index'])
                ->name('sve.comments.index');
            Route::post('/!/sve/comments/{entry}', [CommentsController::class, 'store'])
                ->name('sve.comments.store');
            Route::post('/!/sve/comments/{entry}/prune', [CommentsController::class, 'prune'])
                ->name('sve.comments.prune');
            Route::post('/!/sve/comments/{entry}/{comment}/replies', [CommentsController::class, 'reply'])
                ->name('sve.comments.reply');
            Route::patch('/!/sve/comments/{entry}/{comment}', [CommentsController::class, 'update'])
                ->name('sve.comments.update');
            Route::delete('/!/sve/comments/{entry}/{comment}', [CommentsController::class, 'destroy'])
                ->name('sve.comments.destroy');

            // The snapshot behind a narrowed library: what the site was using when
            // the scan was last run, and the button on the settings screen that
            // runs it again.
            Route::get('/!/sve/library-scan', [LibraryScanController::class, 'show'])
                ->name('sve.library-scan.show');
            Route::post('/!/sve/library-scan', [LibraryScanController::class, 'store'])
                ->name('sve.library-scan.store');

            Route::post('/!/sve/collection-presets/apply', CollectionPresetController::class)
                ->name('sve.collection-presets.apply');

            // Entries to jump to from the preview's collection picker.
            Route::get('/!/sve/collections/{collection}/entries', CollectionEntriesController::class)
                ->name('sve.collection-entries');

            // …and making a new one without leaving it.
            Route::post('/!/sve/collections/{collection}/entries', CreateEntryController::class)
                ->name('sve.create-entry');
        });
    }
}
