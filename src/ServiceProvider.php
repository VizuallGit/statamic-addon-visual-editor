<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Foundation\Http\Middleware\TrimStrings;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\Commands\GenerateSetPreviews;
use MarioHamann\StatamicVisualEditor\Commands\Install;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\LibraryAccess;
use MarioHamann\StatamicVisualEditor\SectionTypes;
use MarioHamann\StatamicVisualEditor\Fieldtypes\AutoUuidFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\LibraryScanFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\ResponsiveFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\ColumnSpanFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\IconButtonGroupFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\Replicator;
use MarioHamann\StatamicVisualEditor\Fieldtypes\BardDefaultFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\DefaultSetsFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\UniqueSetsFieldtype;
use Illuminate\Support\Facades\Route;
use MarioHamann\StatamicVisualEditor\Http\Controllers\CollectionEntriesController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\CreateEntryController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\GlobalsPreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\LibraryScanController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedSectionPreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedSectionsController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedTemplatePreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedTemplatesController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionDefaultsPreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionMetaController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionPreviewController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTypesController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SetPreviewsController;
use MarioHamann\StatamicVisualEditor\Http\Middleware\DisableViteHotReload;
use MarioHamann\StatamicVisualEditor\Http\Middleware\EagerImagesInPreview;
use MarioHamann\StatamicVisualEditor\Http\Middleware\HideStoresFromCollectionsList;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectBridgeScript;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectEditButton;
use MarioHamann\StatamicVisualEditor\Http\Controllers\GlobalSectionStashController;
use MarioHamann\StatamicVisualEditor\Http\Middleware\OverrideGlobalSectionsInPreview;
use MarioHamann\StatamicVisualEditor\Http\Middleware\OverrideGlobalsInPreview;
use MarioHamann\StatamicVisualEditor\Http\Middleware\RegisterPanelVisibility;
use Statamic\Facades\Collection;
use Statamic\Facades\CP\Nav;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;
use Statamic\Facades\User;
use MarioHamann\StatamicVisualEditor\Listeners\InjectVisualIdIntoBlueprint;
use MarioHamann\StatamicVisualEditor\Listeners\RefreshPreviews;
use MarioHamann\StatamicVisualEditor\Listeners\StripVisualIds;
use MarioHamann\StatamicVisualEditor\Listeners\WrapResponsiveFields;
use MarioHamann\StatamicVisualEditor\Modifiers\IsDefault;
use MarioHamann\StatamicVisualEditor\Tags\VisualEdit;
use MarioHamann\StatamicVisualEditor\Tags\ResponsiveCss;
use Statamic\Events\AddonSettingsSaved;
use Statamic\Events\BlueprintSaved;
use Statamic\Events\EntryBlueprintFound;
use Statamic\Events\EntryDeleted;
use Statamic\Events\EntrySaved;
use Statamic\Events\EntrySaving;
use Statamic\Events\FieldsetSaved;
use Statamic\Events\GlobalVariablesBlueprintFound;
use Statamic\Events\GlobalVariablesSaved;
use Statamic\Events\GlobalVariablesSaving;
use Statamic\Facades\Utility;
use Statamic\Providers\AddonServiceProvider;
use Statamic\Statamic;

class ServiceProvider extends AddonServiceProvider
{
    protected $fieldtypes = [
        AutoUuidFieldtype::class,
        LibraryScanFieldtype::class,
        ResponsiveFieldtype::class,
        ColumnSpanFieldtype::class,
        IconButtonGroupFieldtype::class,
        UniqueSetsFieldtype::class,
        DefaultSetsFieldtype::class,
        BardDefaultFieldtype::class,
        // ⚠️ Overtager Statamics egen `replicator`-handle — handlen udledes
        // af klassenavnet. ALT replicator-arbejde i CP'et går igennem den.
        Replicator::class,
    ];

    protected $tags = [
        VisualEdit::class,
        ResponsiveCss::class,
    ];

    protected $modifiers = [
        IsDefault::class,
    ];

    protected $listen = [
        EntryBlueprintFound::class => [
            InjectVisualIdIntoBlueprint::class,
            // Den rigtige registrering står i `register()` ovenfor, hvor den
            // kommer FØR de to her — se noten der om hvorfor rækkefølgen
            // afgøres et andet sted end i det her array. Den her linje er
            // Statamics egen auto-opdagelse, som fyrer igen bagefter uden at
            // gøre noget: et felt der allerede er pakket ind, røres ikke.
            WrapResponsiveFields::class,
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
        // The settings screen saves and then re-renders in the same request —
        // without this it would show the map resolved before the save.
        AddonSettingsSaved::class => [
            [Features::class, 'flush'],
            // The library limit reads those settings and settles its answer once
            // per request — without this the screen would re-render on the map
            // it resolved before the save.
            [LibraryAccess::class, 'flush'],
        ],
        // Everything that can make a preview image out of date. Cheap by design:
        // the run these ask for compares fingerprints and starts no browser when
        // nothing has actually changed. See the listener for what's watched.
        EntrySaved::class => [
            RefreshPreviews::class,
        ],
        EntryDeleted::class => [
            RefreshPreviews::class,
        ],
        FieldsetSaved::class => [
            RefreshPreviews::class,
        ],
        BlueprintSaved::class => [
            RefreshPreviews::class,
        ],
        GlobalVariablesSaved::class => [
            RefreshPreviews::class,
        ],
    ];

    protected $middlewareGroups = [
        'web' => [
            // First: it has to decide before the view renders, unlike the rest,
            // which rewrite the response on the way back out.
            DisableViteHotReload::class,
            EagerImagesInPreview::class,
            InjectBridgeScript::class,
            InjectEditButton::class,
            OverrideGlobalsInPreview::class,
            OverrideGlobalSectionsInPreview::class,
        ],
        'statamic.cp.authenticated' => [
            HideStoresFromCollectionsList::class,
            RegisterPanelVisibility::class,
        ],
    ];

    protected $stylesheets = [
        __DIR__.'/../resources/css/addon.css',
    ];

    protected $commands = [
        GenerateSetPreviews::class,
        Install::class,
    ];

    /**
     * The responsive wrap has to reach the blueprint before anything else does.
     *
     * `_visual_id` injection and "Where is this edited?" both rewrite each field
     * as they walk past it, and a field wrapped in `responsive` is a different
     * shape than the raw one — so which of the two goes first decides what the
     * other one sees. In the site this was moved from, the wrap went first.
     *
     * It cannot be ordered from `$listen`: Statamic scans `src/Listeners` and
     * registers everything it finds there *before* that array is read
     * (AddonServiceProvider::getEventListeners), so a listener class always
     * lands behind the discovered ones. Registered here instead, in `register()`,
     * which runs before any provider boots — and therefore before the scan.
     *
     * The discovered registration still happens and fires again afterwards.
     * That is harmless: `apply()` returns a field untouched once it is already
     * `responsive`, so the second pass has nothing left to do.
     */
    public function register()
    {
        parent::register();

        Event::listen(EntryBlueprintFound::class, [WrapResponsiveFields::class, 'handle']);
    }

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

        // Busting ?t= on every <script type=module> forces Vite/site.js to
        // re-execute after each morph → full iframe reload ("Reload site?").
        config(['statamic.live_preview.force_reload_js_modules' => false]);


        // Provide the set preview-image map to the CP script. Bound to the CP
        // scripts partial so it only runs on Control Panel page renders (not the
        // front-end), and after routing so the blueprints are resolvable.
        View::composer('statamic::partials.scripts', function () {
            $setMeta = SetMeta::all();

            Statamic::provideToScript([
                'svePreviewImages' => SetPreviewImages::map(),
                'sveGlobalSets' => $this->globalSets(),
                'sveRowLimits' => RowLimits::map(),
                'sveSectionTypes' => SectionTypes::map(),
                // What each set calls itself — the name, icon and instructions the
                // focus panel puts at the top. Set config never reaches the
                // rendered form, so it travels with the rest of the settings.
                'sveSetMeta' => $setMeta['sets'],
                'sveGridMeta' => $setMeta['grids'],
                // Handles the client must not assume: everything it builds (field
                // paths, the global-section row, the CP link to a source entry)
                // comes from config, so the addon works on any site as installed.
                'sveSectionField' => config('statamic-visual-editor.previews.field', 'page_sections'),
                'sveSavedSectionsCollection' => config('statamic-visual-editor.saved_sections.collection', 'saved_sections'),
                'sveGlobalSectionSet' => config('statamic-visual-editor.saved_sections.set', 'global_section'),
                'sveChrome' => config('statamic-visual-editor.chrome', []),
                'sveHiddenGlobalsTabs' => $this->hiddenGlobalsTabs(),
                // Whether the editor runs here at all, and which of its tools this
                // site gets (Addons > Statamic Visual Editor).
                'sveEnabled' => Features::editorEnabled(),
                'sveFeatures' => Features::map(),
                // Every on-screen string, in the CP user's own language.
                'sveStrings' => static::strings(),
                'sveCollections' => $this->pickerCollections(),
                // The collections whose entries open in the preview rather than
                // the publish form (Addons > Statamic Visual Editor).
                'sveOpenInPreview' => $this->openInPreviewCollections(),
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
        });

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
            });

        Route::middleware('web')->group(function () {

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

            // Page templates (a whole page's sections, saved to drop on another).
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

            // Fresh meta + defaults for a set, so a picker-inserted section also
            // renders in the CP's own section list (see SectionMetaController).
            Route::get('/!/sve/section-meta', SectionMetaController::class)
                ->name('sve.section-meta');

            // The snapshot behind a narrowed library: what the site was using when
            // the scan was last run, and the button on the settings screen that
            // runs it again.
            Route::get('/!/sve/library-scan', [LibraryScanController::class, 'show'])
                ->name('sve.library-scan.show');
            Route::post('/!/sve/library-scan', [LibraryScanController::class, 'store'])
                ->name('sve.library-scan.store');

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
            ->view('sve::utilities.set-previews', fn () => PreviewStatus::all())
            ->title('Section Previews')
            ->navTitle('Section Previews')
            ->icon('assets')
            ->description(__('sve::messages.previews_intro'))
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
            $collections = collect($stores)
                ->map(fn ($handle) => Collection::findByHandle($handle))
                ->filter(); // whatever is not installed on this site is nothing to move

            if ($collections->isEmpty()) {
                return;
            }

            /*
             * Statamic's own Nav::remove() matches a child by its display name, and
             * two collections are free to share a title — renaming a store to
             * something the site already uses would pull the site's own collection
             * out of the list along with it. The show URL carries the handle, so it
             * can only ever match the one store.
             */
            $urls = $collections->map->showUrl()->all();

            if ($parent = $nav->find('Content', 'Collections')) {
                if ($children = $parent->resolveChildren()->children()) {
                    $parent->children($children->reject(fn ($child) => in_array($child->url(), $urls, true)));
                }
            }

            $collections->each(function ($collection) use ($nav) {
                $nav->content($collection->title())
                    ->url($collection->showUrl())
                    ->icon($collection->icon() ?: 'content-writing')
                    ->can('view', $collection);
            });
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

    /**
     * The collections a click lands in the preview rather than the form.
     *
     * Filtered down to the ones that can actually be previewed. A collection
     * without a route has no page to render, so Statamic draws no Live Preview
     * button — an entry there would sit behind the cover waiting for something
     * that is never coming. Named or not, those open the ordinary editor.
     *
     * @return array<int, string>
     */
    protected function openInPreviewCollections(): array
    {
        if (! Features::enabled('open_in_preview')) {
            return [];
        }

        $chosen = Features::setting('open_in_preview_collections', []);

        if (! is_array($chosen) || $chosen === []) {
            return [];
        }

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        return collect($chosen)
            ->filter(fn ($handle) => (bool) Collection::findByHandle($handle)?->route($site))
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

    /**
     * Tabs the docked Theme Settings panel leaves out, as the labels they carry
     * on screen.
     *
     * Configured by handle, resolved here to labels: the panel has only the
     * rendered publish form to work with — the tab buttons in it carry their
     * display text and nothing that names the blueprint tab — so the matching
     * has to happen on the label. Doing the lookup server-side is what keeps the
     * config honest (a handle, stable) and the match right in every language (a
     * label, as the blueprint actually spells it).
     *
     * @return array<string, array<int, string>>  global set handle => lowercased labels
     */
    protected function hiddenGlobalsTabs(): array
    {
        $hidden = (array) config('statamic-visual-editor.chrome.hidden_tabs', []);

        if (! $hidden) {
            return [];
        }

        $map = [];

        // One set or one per half — the tabs to leave out are named the same way
        // either way, so every set that carries a half gets the same treatment.
        foreach ($this->chromeGlobalHandles() as $handle) {
            if (! $set = GlobalSet::findByHandle($handle)) {
                continue;
            }

            $tabs = $set->blueprint()?->contents()['tabs'] ?? [];
            $labels = [];

            foreach ($hidden as $tab) {
                if (! isset($tabs[$tab])) {
                    continue; // renamed or removed since it was configured
                }

                // No `display` means Statamic titleises the handle for the tab button.
                $labels[] = Str::lower($tabs[$tab]['display'] ?? Str::title(str_replace('_', ' ', $tab)));
            }

            if ($labels) {
                $map[$handle] = $labels;
            }
        }

        return $map;
    }

    /**
     * Every global set holding a half of the site frame, deduplicated.
     *
     * `chrome.global` names one set for both; `chrome.header.global` and
     * `chrome.footer.global` name one each. Configuring both is allowed and
     * answers with the two specific ones — the shared key is then the fallback
     * for a half that names none.
     *
     * @return array<int, string>
     */
    protected function chromeGlobalHandles(): array
    {
        $shared = config('statamic-visual-editor.chrome.global');

        $handles = collect(['header', 'footer'])
            ->map(fn ($half) => config("statamic-visual-editor.chrome.{$half}.global") ?: $shared)
            ->filter()
            ->all();

        return array_values(array_unique($handles ?: [$shared ?: 'theme_settings']));
    }

    protected $vite = [
        'input' => [
            'resources/js/addon.js',
        ],
        'publicDirectory' => 'resources/dist',
    ];
}
