<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\View;
use MarioHamann\StatamicVisualEditor\Commands\GenerateSetPreviews;
use MarioHamann\StatamicVisualEditor\SectionTypes;
use MarioHamann\StatamicVisualEditor\Fieldtypes\AutoUuidFieldtype;
use Illuminate\Support\Facades\Route;
use MarioHamann\StatamicVisualEditor\Http\Controllers\CollectionEntriesController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\CreateEntryController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\GlobalsPreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedSectionPreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedSectionsController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedTemplatePreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedTemplatesController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionMetaController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionPreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SetPreviewsController;
use MarioHamann\StatamicVisualEditor\Http\Middleware\HideStoresFromCollectionsList;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectBridgeScript;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectEditButton;
use MarioHamann\StatamicVisualEditor\Http\Controllers\GlobalSectionStashController;
use MarioHamann\StatamicVisualEditor\Http\Middleware\OverrideGlobalSectionsInPreview;
use MarioHamann\StatamicVisualEditor\Http\Middleware\OverrideGlobalsInPreview;
use Statamic\Facades\Collection;
use Statamic\Facades\CP\Nav;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;
use Statamic\Facades\User;
use MarioHamann\StatamicVisualEditor\Listeners\InjectVisualIdIntoBlueprint;
use MarioHamann\StatamicVisualEditor\Listeners\StripVisualIds;
use MarioHamann\StatamicVisualEditor\Tags\VisualEdit;
use Statamic\Events\EntryBlueprintFound;
use Statamic\Events\EntrySaving;
use Statamic\Events\GlobalVariablesBlueprintFound;
use Statamic\Events\GlobalVariablesSaving;
use Statamic\Facades\Utility;
use Statamic\Providers\AddonServiceProvider;
use Statamic\Statamic;

class ServiceProvider extends AddonServiceProvider
{
    protected $fieldtypes = [
        AutoUuidFieldtype::class,
    ];

    protected $tags = [
        VisualEdit::class,
    ];

    protected $listen = [
        EntryBlueprintFound::class => [
            InjectVisualIdIntoBlueprint::class,
        ],
        GlobalVariablesBlueprintFound::class => [
            InjectVisualIdIntoBlueprint::class,
        ],
        EntrySaving::class => [
            StripVisualIds::class,
        ],
        GlobalVariablesSaving::class => [
            StripVisualIds::class,
        ],
    ];

    protected $middlewareGroups = [
        'web' => [
            InjectBridgeScript::class,
            InjectEditButton::class,
            OverrideGlobalsInPreview::class,
            OverrideGlobalSectionsInPreview::class,
        ],
        'statamic.cp.authenticated' => [
            HideStoresFromCollectionsList::class,
        ],
    ];

    protected $commands = [
        GenerateSetPreviews::class,
    ];

    public function bootAddon()
    {
        // Statamic only auto-merges an addon's config for the root app, so a
        // vendored addon never gets it. Merge it explicitly so config() reads
        // (e.g. the preview generator settings) resolve.
        $this->mergeConfigFrom(__DIR__.'/../config/statamic-visual-editor.php', 'statamic-visual-editor');

        // The injected preview script (resources/js/preview.js) hot-reloads the
        // preview itself via Alpine.morph. Disable Statamic's built-in hot
        // reload so the two never morph the same document concurrently —
        // double-morph races corrupt the DOM and reset the scroll position.
        config(['statamic.live_preview.hot_reload_contents' => false]);

        // Provide the set preview-image map to the CP script. Bound to the CP
        // scripts partial so it only runs on Control Panel page renders (not the
        // front-end), and after routing so the blueprints are resolvable.
        View::composer('statamic::partials.scripts', function () {
            Statamic::provideToScript([
                'svePreviewImages' => SetPreviewImages::map(),
                'sveGlobalSets' => $this->globalSets(),
                'sveRowLimits' => RowLimits::map(),
                'sveSectionTypes' => SectionTypes::map(),
                // Handles the client must not assume: everything it builds (field
                // paths, the global-section row, the CP link to a source entry)
                // comes from config, so the addon works on any site as installed.
                'sveSectionField' => config('statamic-visual-editor.previews.field', 'page_sections'),
                'sveSavedSectionsCollection' => config('statamic-visual-editor.saved_sections.collection', 'saved_sections'),
                'sveGlobalSectionSet' => config('statamic-visual-editor.saved_sections.set', 'global_section'),
                // Every on-screen string, in the CP user's own language.
                'sveStrings' => static::strings(),
                'sveCollections' => $this->pickerCollections(),
            ]);
        });

        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'sve');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'sve');

        $this->moveStoresOutOfCollections();

        // Signed, short-lived route that renders a page with only one section in
        // it — the preview generator screenshots that. Registered explicitly:
        // Statamic only auto-loads an addon's routes/ files for the root app.
        Route::middleware(['web', 'signed'])->group(function () {
            Route::get('/!/sve/section-preview/{entry}/{section}', [SectionPreviewController::class, 'show'])
                ->name('sve.section-preview');

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
        });

        // Stashes the globals being edited beside Live Preview, so the preview
        // render can use them before they're saved.
        Route::middleware('web')->group(function () {
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

            // Saved sections (reusable section templates).
            Route::get('/!/sve/saved-sections', [SavedSectionsController::class, 'index'])
                ->name('sve.saved-sections.index');
            Route::post('/!/sve/saved-sections', [SavedSectionsController::class, 'store'])
                ->name('sve.saved-sections.store');
            Route::post('/!/sve/saved-sections/{id}/preview', [SavedSectionsController::class, 'regeneratePreview'])
                ->name('sve.saved-sections.preview');

            // Page templates (a whole page's sections, saved to drop on another).
            Route::get('/!/sve/templates', [SavedTemplatesController::class, 'index'])
                ->name('sve.templates.index');
            Route::post('/!/sve/templates', [SavedTemplatesController::class, 'store'])
                ->name('sve.templates.store');

            // Fresh meta + defaults for a set, so a picker-inserted section also
            // renders in the CP's own section list (see SectionMetaController).
            Route::get('/!/sve/section-meta', SectionMetaController::class)
                ->name('sve.section-meta');

            // Entries to jump to from the preview's collection picker.
            Route::get('/!/sve/collections/{collection}/entries', CollectionEntriesController::class)
                ->name('sve.collection-entries');

            // …and making a new one without leaving it.
            Route::post('/!/sve/collections/{collection}/entries', CreateEntryController::class)
                ->name('sve.create-entry');
        });

        // Utility page with a button to (re)generate the Add Set picker preview
        // images by screenshotting the rendered sections.
        Utility::register('set-previews')
            ->view('sve::utilities.set-previews', fn () => ['sets' => SetPreviewImages::map()])
            ->title('Section Previews')
            ->navTitle('Section Previews')
            ->icon('assets')
            ->description('Regenerér preview-billeder til "Add Set"-pickeren ved at screenshotte sektionerne.')
            ->routes(function ($router) {
                $router->post('generate', [SetPreviewsController::class, 'generate'])->name('generate');
            });
    }

    /**
     * Gives the two editor stores their own place in the Control Panel nav, beside
     * Globals, instead of sitting among the site's real collections.
     *
     * They are collections underneath — that is what gives them blueprints, Live
     * Preview, permissions and revisions for free — but they are not content anyone
     * browses to. Listing them next to Pages and Events invites editing a fragment
     * as though it were a page.
     *
     * Nothing is renamed or moved on disk: this only changes where the link sits.
     * Note the Collections *index page* still lists them — Statamic builds that from
     * every collection you can view, and there is no hidden flag to set.
     */
    /** The editor's own collections: stores of fragments, not content you browse. */
    protected static function stores(): array
    {
        return [
            config('statamic-visual-editor.saved_sections.collection', 'saved_sections'),
            config('statamic-visual-editor.templates.collection', 'saved_templates'),
        ];
    }

    protected function moveStoresOutOfCollections(): void
    {
        $stores = static::stores();

        Nav::extend(function ($nav) use ($stores) {
            foreach ($stores as $handle) {
                if (! $collection = Collection::findByHandle($handle)) {
                    continue; // not installed on this site — nothing to move
                }

                // Statamic lists collections by title, so that is the child to pull.
                $nav->remove('Content', 'Collections', $collection->title());

                $nav->content($collection->title())
                    ->url($collection->showUrl())
                    ->icon($collection->icon() ?: 'content-writing')
                    ->can('view', $collection);
            }
        });
    }

    /**
     * The global sets this user may edit — the Live Preview picker lists these.
     *
     * The URL is the *variables* screen (globals.variables.edit), not the set's
     * own edit screen: the latter configures the blueprint and sites, while the
     * panel needs the form with the actual values in it.
     */
    /**
     * The editor's strings, in the language the Control Panel user picked.
     *
     * Deliberately the *user's* locale, not the app's: the preview renders as a
     * front-end request, where the locale is the site's — so a Danish-speaking
     * editor on an English site (or the other way round) would get the wrong half
     * of the interface. English is the base; a language only overrides what it
     * actually translates.
     */
    public static function strings(): array
    {
        $locale = User::current()?->preferredLocale() ?? config('app.locale');

        return array_merge(
            (array) trans('sve::messages', [], 'en'),
            (array) trans('sve::messages', [], $locale),
        );
    }

    /**
     * The collections offered in the preview's collection picker.
     *
     * All of them, not only the previewable ones: jumping straight to "new blog
     * post" is worth having even where there's no page to show. `previewable`
     * says which can actually open in Live Preview — that needs a route, and an
     * entry without one has no page to render. The flag is computed, not
     * configured, so a collection starts previewing itself the day it's given a
     * route. Permission-filtered: the picker offers what you may edit.
     */
    protected function pickerCollections(): array
    {
        if (! $user = User::current()) {
            return [];
        }

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        return Collection::all()
            ->filter(fn ($collection) => $user->can('edit', $collection))
            // The editor's own stores are not somewhere you navigate to. They hold
            // fragments — a section, a stack of sections — and neither can ever be
            // previewed as a page, so they would only ever sit in this list greyed
            // out as "no preview". You reach them from the sections panel, which is
            // where they mean something.
            ->reject(fn ($collection) => in_array($collection->handle(), static::stores(), true))
            ->map(fn ($collection) => [
                'handle' => $collection->handle(),
                'title' => $collection->title(),
                'previewable' => (bool) $collection->route($site),
                'createUrl' => $collection->createEntryUrl($site),
            ])
            ->sortBy('title', SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();
    }

    protected function globalSets(): array
    {
        if (! $user = User::current()) {
            return [];
        }

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        return GlobalSet::all()
            ->filter(fn ($set) => $user->can('edit', $set))
            ->map(function ($set) use ($site) {
                $variables = $set->in($site) ?? $set->in(Site::default()->handle());

                return $variables ? [
                    'handle' => $set->handle(),
                    'title' => $set->title(),
                    'url' => $variables->editUrl(),
                ] : null;
            })
            ->filter()
            ->values()
            ->all();
    }

    protected $vite = [
        'input' => [
            'resources/js/addon.js',
        ],
        'publicDirectory' => 'resources/dist',
    ];
}
