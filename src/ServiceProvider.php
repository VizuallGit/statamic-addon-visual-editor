<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Foundation\Http\Middleware\TrimStrings;
use Illuminate\Routing\Events\RouteMatched;
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
use MarioHamann\StatamicVisualEditor\Fieldtypes\SveLiteSections;
use MarioHamann\StatamicVisualEditor\Fieldtypes\BardDefaultFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\DefaultSetsFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\GlobalsPickerFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\ToolbarAccessFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\UniqueSetsFieldtype;
use Illuminate\Support\Facades\Route;
use MarioHamann\StatamicVisualEditor\BuiltAssets;
use MarioHamann\StatamicVisualEditor\Http\Controllers\AiChatController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\BuiltAssetController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\ChromePrefsController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\CommentsController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\CollectionEntriesController;
use MarioHamann\StatamicVisualEditor\Http\Controllers\EntryActivityController;
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
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTemplateController;
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
use Statamic\Facades\Entry;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;
use Statamic\Facades\User;
use MarioHamann\StatamicVisualEditor\Listeners\ExpandFromTheStart;
use MarioHamann\StatamicVisualEditor\Listeners\InjectVisualIdIntoBlueprint;
use MarioHamann\StatamicVisualEditor\Listeners\UseLiteSections;
use MarioHamann\StatamicVisualEditor\Listeners\RefreshPreviews;
use MarioHamann\StatamicVisualEditor\Listeners\StripVisualIds;
use MarioHamann\StatamicVisualEditor\Listeners\WrapResponsiveFields;
use MarioHamann\StatamicVisualEditor\Modifiers\IsDefault;
use MarioHamann\StatamicVisualEditor\Tags\VisualEdit;
use MarioHamann\StatamicVisualEditor\Tags\ResponsiveCss;
use MarioHamann\StatamicVisualEditor\Tags\SveTw;
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
        GlobalsPickerFieldtype::class,
        ToolbarAccessFieldtype::class,
        DefaultSetsFieldtype::class,
        BardDefaultFieldtype::class,
        // ⚠️ Overtager Statamics egen `replicator`-handle — handlen udledes
        // af klassenavnet. ALT replicator-arbejde i CP'et går igennem den.
        Replicator::class,
        SveLiteSections::class,
    ];

    protected $tags = [
        VisualEdit::class,
        ResponsiveCss::class,
        SveTw::class,
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
            ExpandFromTheStart::class,
            UseLiteSections::class,
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

    // Own files, never inlined into Blade (Vue `{{ }}` would compile as PHP
    // and kill every field in the Control Panel). Not bundled into addon.js —
    // they run on every CP page and must not wrap Statamic's field Vue.
    // Served from public/vendor/{packageName()}/js/ — that is visual-editor,
    // not statamic-addon/visual-editor. registerScript() copies source → public
    // on boot so a path-repo edit actually reaches the CP (Statamic otherwise
    // keeps serving the last vendor:publish copy, cache-busted only by version).
    //
    //   disable-publish-stack-pin — keep the publish stack from pinning over LP
    //   dedupe-cp-fetch           — one GET for iconify/config and colour swatches
    //   default-sets-count        — "from the start" count on replicator config
    //   iconify-hide-remove       — hide Iconify's remove when the field is empty
    //   icon-button-group-iconify — Iconify picker inside button-group options
    //   responsive-hide-label     — hide inner labels inside a responsive wrap
    //   grid-keep-table           — keep Grid as a table (not stacked cards)
    //   grid-collapse             — collapse Grid rows in the sidebar
    //   section-meta-prefetch     — prefetch set meta (library, Search Sets hover, solo +)
    //   inserter-reveal           — keep the "+" visible under a newly added block
    //   toolbar-look              — trial 4px radius, no outline/shadow on edit toolbar
    //   library-drop-focus        — after a library drop, zoom in on the new section
    //   lite-sections             — mount one page_sections row in Live Preview
    protected $scripts = [
        __DIR__.'/../resources/js/disable-publish-stack-pin.js',
        __DIR__.'/../resources/js/dedupe-cp-fetch.js',
        __DIR__.'/../resources/js/default-sets-count.js',
        __DIR__.'/../resources/js/iconify-hide-remove.js',
        __DIR__.'/../resources/js/icon-button-group-iconify.js',
        __DIR__.'/../resources/js/responsive-hide-label.js',
        __DIR__.'/../resources/js/grid-keep-table.js',
        __DIR__.'/../resources/js/grid-collapse.js',
        __DIR__.'/../resources/js/section-meta-prefetch.js',
        __DIR__.'/../resources/js/inserter-reveal.js',
        __DIR__.'/../resources/js/toolbar-look.js',
        __DIR__.'/../resources/js/library-drop-focus.js',
        __DIR__.'/../resources/js/lite-sections.js',
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

    /**
     * Keep public/vendor copies of $scripts in sync with the addon source, and
     * cache-bust on file contents. Statamic's default only publishes on install
     * and busts on package version.
     */
    public function registerScript(string $path)
    {
        $name = $this->getAddon()->packageName();
        $filename = pathinfo($path, PATHINFO_FILENAME);
        $dest = public_path("vendor/{$name}/js/{$filename}.js");

        $this->publishes([
            $path => $dest,
        ], $this->getAddon()->slug());

        if (is_file($path)) {
            $dir = dirname($dest);
            if (! is_dir($dir)) {
                @mkdir($dir, 0755, true);
            }
            if (is_dir($dir) && is_writable($dir) && (! is_file($dest) || md5_file($path) !== md5_file($dest))) {
                @copy($path, $dest);
            }
        }

        $bust = is_file($path) ? md5_file($path) : md5($this->getAddon()->version());
        Statamic::script($name, "{$filename}.js?v={$bust}");
    }

    /**
     * Samme som registerScript: Statamics default kopierer kun ved install og
     * bust'er på pakkeversion, så en path-repo-ændring i addon.css aldrig
     * nåede CP'et — hide_display så ud som om den var slået fra.
     */
    public function registerStylesheet(string $path)
    {
        $name = $this->getAddon()->packageName();
        $filename = pathinfo($path, PATHINFO_FILENAME);
        $dest = public_path("vendor/{$name}/css/{$filename}.css");

        $this->publishes([
            $path => $dest,
        ], $this->getAddon()->slug());

        if (is_file($path)) {
            $dir = dirname($dest);
            if (! is_dir($dir)) {
                @mkdir($dir, 0755, true);
            }
            if (is_dir($dir) && is_writable($dir) && (! is_file($dest) || md5_file($path) !== md5_file($dest))) {
                @copy($path, $dest);
            }
        }

        $bust = is_file($path) ? md5_file($path) : md5($this->getAddon()->version());
        Statamic::style($name, "{$filename}.css?v={$bust}");
    }

    public function bootAddon()
    {
        // Statamic only auto-merges an addon's config for the root app, so a
        // vendored addon never gets it. Merge it explicitly so config() reads
        // (e.g. the preview generator settings) resolve.
        $this->mergeConfigFrom(__DIR__.'/../config/statamic-visual-editor.php', 'statamic-visual-editor');

        // Put back any hashed chunk addon.js still names, then refuse a
        // silent blank toolbar. public/vendor is a pointer, not a second build.
        BuiltAssets::recover();
        BuiltAssets::linkForControlPanel();

        // After every addon has registered tags, so Iconify's `iconify` handle
        // is already there. A name in `{{ iconify:icon }}` becomes SVG. Not in
        // `$tags`: that folder is autoloaded, and this class extends Iconify.
        Event::listen(RouteMatched::class, function () {
            IconifyDefault::registerTag();
        });

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


        // Provide the set preview-image map to the CP script. Bound to the CP
        // scripts partial so it only runs on Control Panel page renders (not the
        // front-end), and after routing so the blueprints are resolvable.
        View::composer('statamic::partials.scripts', function () {
            $setMeta = SetMeta::all();

            Statamic::provideToScript([
                'svePreviewImages' => SetPreviewImages::map(),
                'sveGlobalSets' => $this->globalSets(),
                'sveGlobalsPicker' => Features::setting('globals_picker'),
                'sveGlobalsPickerOff' => Features::globalsPickerOffByDefault(),
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
                // Id → { title, section_type } for global rows in the block tree,
                // so a referenced section can name itself by what it actually is
                // rather than by the "Global section" set.
                'sveSavedSectionLabels' => $this->savedSectionLabels(),
                'sveChrome' => config('statamic-visual-editor.chrome', []),
                'sveUserId' => User::current()?->id(),
                'sveChromePrefs' => is_array($chrome = User::current()?->getPreference('sve_chrome')) ? $chrome : [],
                'sveHiddenGlobalsTabs' => $this->hiddenGlobalsTabs(),
                // Whether the editor runs here at all, and which of its tools this
                // site gets (Addons > Statamic Visual Editor).
                'sveEnabled' => Features::editorEnabled(),
                'sveFeatures' => Features::visible(),
                'sveAiReady' => AiChat::ready(),
                'sveComments' => $this->commentsPayload(),
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

                // Antlers whitespace at the edges of a partial is layout, not
                // noise — TrimStrings would eat the blank lines a template
                // author just put back.
                Route::post('/!/sve/section-template', [SectionTemplateController::class, 'update'])
                    ->name('sve.section-template.update');
                Route::post('/!/sve/section-template/lock', [SectionTemplateController::class, 'lock'])
                    ->name('sve.section-template.lock');
            });

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

            // Fresh meta + defaults for a set, so a picker-inserted section also
            // renders in the CP's own section list (see SectionMetaController).
            Route::get('/!/sve/section-meta', SectionMetaController::class)
                ->name('sve.section-meta');

            // Same query-parameter pattern as section-types: handles hold slashes.
            Route::get('/!/sve/section-template', [SectionTemplateController::class, 'show'])
                ->name('sve.section-template.show');
            Route::get('/!/sve/tailwind-theme', [SectionTemplateController::class, 'theme'])
                ->name('sve.tailwind-theme');

            Route::post('/!/sve/ai-chat', [AiChatController::class, 'store'])
                ->name('sve.ai-chat');

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

        // After every other EntryBlueprintFound listener: visual id, responsive
        // wrap and "from the start" must see `type: replicator` first. YAML on
        // disk stays replicator; only the Live Preview form is swapped.
        Event::listen(EntryBlueprintFound::class, [UseLiteSections::class, 'handle']);
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
        return Stores::all();
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
     * What each saved (global) section calls itself, keyed by entry id.
     *
     * A page holds only a reference. The block tree names the row by the source's
     * section type ("Hero style 5") rather than by the reference set ("Global
     * section"), and this map is how it looks that up without a round-trip.
     *
     * @return array<string, array{title: string, section_type: string}>
     */
    protected function savedSectionLabels(): array
    {
        $handle = config('statamic-visual-editor.saved_sections.collection', 'saved_sections');

        if (! Collection::findByHandle($handle)) {
            return [];
        }

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        try {
            return Entry::query()
                ->where('collection', $handle)
                ->where('site', $site)
                ->get()
                ->mapWithKeys(fn ($entry) => [
                    $entry->id() => [
                        'title' => (string) ($entry->value('title') ?? ''),
                        'section_type' => (string) ($entry->value('section_type') ?? ''),
                    ],
                ])
                ->all();
        } catch (\Throwable) {
            return [];
        }
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
     * Who is commenting from this Control Panel session.
     *
     * Gated by the comments toggle and toolbar access. Everyone else gets an
     * empty payload so the comments script never paints a mode it cannot save.
     */
    protected function commentsPayload(): array
    {
        $user = User::current();

        if (! $user || ! Features::editorEnabled() || ! Features::allows('comments')) {
            return ['enabled' => false];
        }

        $name = trim((string) ($user->name() ?: $user->email() ?: 'User'));

        return [
            'enabled' => true,
            'user' => [
                'id' => $user->id(),
                'name' => $name,
                'initials' => $user->initials() ?: strtoupper(mb_substr($name, 0, 1)),
            ],
        ];
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

    /**
     * Statamic's default publishes a copy to public/vendor. That copy is
     * what went missing when overlay-host was rebuilt alone. Do not publish.
     * The Control Panel reads the addon's dist through a symlink.
     */
    public function registerVite($config)
    {
        $name = $this->getAddon()->packageName();
        $directory = $this->getAddon()->directory();

        if (is_string($config) || ! is_array($config) || array_is_list($config)) {
            $config = ['input' => $config];
        }

        $publicDirectory = $config['publicDirectory'] ?? 'public';
        $buildDirectory = $config['buildDirectory'] ?? 'build';
        $hotFile = $config['hotFile'] ?? "{$directory}{$publicDirectory}/hot";

        Statamic::vite($name, [
            'hotFile' => $hotFile,
            'buildDirectory' => "vendor/{$name}/{$buildDirectory}",
            'input' => $config['input'],
        ]);
    }
}
