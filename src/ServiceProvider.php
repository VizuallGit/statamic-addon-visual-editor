<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Routing\Events\RouteMatched;
use Illuminate\Support\Facades\Event;
use MarioHamann\StatamicVisualEditor\Commands\GenerateSetPreviews;
use MarioHamann\StatamicVisualEditor\Commands\Install;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\LibraryAccess;
use MarioHamann\StatamicVisualEditor\Fieldtypes\AutoUuidFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\LibraryScanFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\ResponsiveDefaultsFieldtype;
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
use MarioHamann\StatamicVisualEditor\Fieldtypes\TemplatePropsFieldtype;
use MarioHamann\StatamicVisualEditor\BuiltAssets;
use MarioHamann\StatamicVisualEditor\Boot\ControlPanelScript;
use MarioHamann\StatamicVisualEditor\Boot\LivePreviewConfig;
use MarioHamann\StatamicVisualEditor\Boot\Routes;
use MarioHamann\StatamicVisualEditor\Boot\StoreCollections;
use MarioHamann\StatamicVisualEditor\Boot\Utilities;
use MarioHamann\StatamicVisualEditor\Http\Middleware\DisableStaticCacheInLivePreview;
use MarioHamann\StatamicVisualEditor\Http\Middleware\DisableViteHotReload;
use MarioHamann\StatamicVisualEditor\Http\Middleware\EagerImagesInPreview;
use MarioHamann\StatamicVisualEditor\Http\Middleware\HideStoresFromCollectionsList;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectBridgeScript;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectEditButton;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectSchema;
use MarioHamann\StatamicVisualEditor\Http\Middleware\OverrideGlobalSectionsInPreview;
use MarioHamann\StatamicVisualEditor\Http\Middleware\OverrideGlobalsInPreview;
use MarioHamann\StatamicVisualEditor\Http\Middleware\RegisterPanelVisibility;
use MarioHamann\StatamicVisualEditor\Listeners\ExpandFromTheStart;
use MarioHamann\StatamicVisualEditor\Listeners\InjectVisualIdIntoBlueprint;
use MarioHamann\StatamicVisualEditor\Listeners\InjectTemplatePropsIntoBlueprint;
use MarioHamann\StatamicVisualEditor\Listeners\UseLiteSections;
use MarioHamann\StatamicVisualEditor\Listeners\RefreshPreviews;
use MarioHamann\StatamicVisualEditor\Listeners\PurgeCollectionViewTemplates;
use MarioHamann\StatamicVisualEditor\Listeners\ScaffoldCollectionViewTemplates;
use MarioHamann\StatamicVisualEditor\Listeners\SeedCollectionRouting;
use MarioHamann\StatamicVisualEditor\Listeners\ScopeTemplatePreviewAs;
use MarioHamann\StatamicVisualEditor\Listeners\StripVisualIds;
use MarioHamann\StatamicVisualEditor\Listeners\WrapResponsiveFields;
use MarioHamann\StatamicVisualEditor\Modifiers\IsDefault;
use MarioHamann\StatamicVisualEditor\Tags\VisualEdit;
use MarioHamann\StatamicVisualEditor\Tags\ResponsiveCss;
use MarioHamann\StatamicVisualEditor\Tags\SveTw;
use MarioHamann\StatamicVisualEditor\Tags\SveProp;
use MarioHamann\StatamicVisualEditor\Tags\SveDefaults;
use Statamic\Events\AddonSettingsSaved;
use Statamic\Events\BlueprintSaved;
use Statamic\Events\CollectionCreating;
use Statamic\Events\CollectionDeleted;
use Statamic\Events\CollectionSaved;
use Statamic\Events\EntryBlueprintFound;
use Statamic\Events\EntryDeleted;
use Statamic\Events\EntrySaved;
use Statamic\Events\EntrySaving;
use Statamic\Events\FieldsetSaved;
use Statamic\Events\GlobalVariablesBlueprintFound;
use Statamic\Events\GlobalVariablesSaved;
use Statamic\Events\GlobalVariablesSaving;
use Statamic\Providers\AddonServiceProvider;
use Statamic\Contracts\View\Antlers\Parser as AntlersParser;
use Statamic\Statamic;

class ServiceProvider extends AddonServiceProvider
{
    protected $fieldtypes = [
        AutoUuidFieldtype::class,
        LibraryScanFieldtype::class,
        ResponsiveFieldtype::class,
        ResponsiveDefaultsFieldtype::class,
        ColumnSpanFieldtype::class,
        IconButtonGroupFieldtype::class,
        UniqueSetsFieldtype::class,
        GlobalsPickerFieldtype::class,
        ToolbarAccessFieldtype::class,
        DefaultSetsFieldtype::class,
        BardDefaultFieldtype::class,
        TemplatePropsFieldtype::class,
        // ⚠️ Overtager Statamics egen `replicator`-handle — handlen udledes
        // af klassenavnet. ALT replicator-arbejde i CP'et går igennem den.
        Replicator::class,
        SveLiteSections::class,
    ];

    protected $tags = [
        VisualEdit::class,
        ResponsiveCss::class,
        SveTw::class,
        SveProp::class,
        SveDefaults::class,
    ];

    protected $modifiers = [
        IsDefault::class,
    ];

    protected $listen = [
        CollectionCreating::class => [
            SeedCollectionRouting::class,
        ],
        CollectionSaved::class => [
            ScaffoldCollectionViewTemplates::class,
        ],
        CollectionDeleted::class => [
            PurgeCollectionViewTemplates::class,
        ],
        EntryBlueprintFound::class => [
            ScopeTemplatePreviewAs::class,
            InjectVisualIdIntoBlueprint::class,
            InjectTemplatePropsIntoBlueprint::class,
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
            InjectTemplatePropsIntoBlueprint::class,
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
            // Before Statamic's static-cache middleware: Live Preview must not
            // read or write `half`/`full`. The public site keeps `.env`.
            DisableStaticCacheInLivePreview::class,
            // First of the rest: it has to decide before the view renders, unlike
            // the others, which rewrite the response on the way back out.
            DisableViteHotReload::class,
            EagerImagesInPreview::class,
            InjectBridgeScript::class,
            InjectEditButton::class,
            InjectSchema::class,
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
    // and kill every field in the Control Panel). Served from
    // public/vendor/{packageName()}/js/ — that is visual-editor, not
    // statamic-addon/visual-editor. registerScript() copies source → public
    // on boot so a path-repo edit actually reaches the CP (Statamic otherwise
    // keeps serving the last vendor:publish copy, cache-busted only by version).
    //
    // Fourteen more used to be here; they live in resources/js/side/ and are
    // part of addon.js since WP6a/b. What stays is what a module cannot do:
    // Iconify's fieldtype captures `fetch` when its own module evaluates
    // (`let K = fetch` in its build), so dedupe-cp-fetch must have replaced
    // window.fetch before that — a classic script runs while the page is
    // parsed, a module only after. The paint script is proven on its own by
    // tests/browser/instant-paint.mjs. disable-publish-stack-pin went in
    // WP6c: the observer it neutralised was in an old addon.js and no longer
    // exists in any build. A standalone script never import()s a build file
    // by name.
    //
    //   dedupe-cp-fetch           — one GET for iconify/config and colour swatches
    //   dock-instant-preview        — paint HTML-dock classes into LP before morph
    protected $scripts = [
        __DIR__.'/../resources/js/dedupe-cp-fetch.js',
        __DIR__.'/../resources/js/dock-instant-preview.js',
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
        if (! SundayAug30::enabled()) {
            $this->scripts = array_values(array_filter(
                $this->scripts,
                fn (string $path) => ! str_ends_with($path, 'field-prop.js')
                    && ! str_ends_with($path, 'collection-preset-scaffold.js')
            ));
        }

        parent::register();

        // Stache caches entries in Laravel's file store, which only unserializes
        // classes on the allowlist. Without this they come back incomplete and
        // Live Preview stays hidden.
        class_exists(CollectionTemplateEntry::class);
        $this->registerSerializableClasses([CollectionTemplateEntry::class]);

        Event::listen(EntryBlueprintFound::class, [WrapResponsiveFields::class, 'handle']);

        // `:handle ?? default` in a section template becomes Antlers the
        // runtime can render. Official preparser hook — not a wrap of Engine.
        if (SundayAug30::enabled()) {
            $this->app->extend(AntlersParser::class, function ($parser) {
                if (method_exists($parser, 'preparse')) {
                    $parser->preparse([TemplateProps::class, 'compile']);
                }

                return $parser;
            });
        }
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

        // The files the editor writes on the server go into Statamic's git
        // commits — see GitSync for why that matters on a git-deployed site.
        GitSync::register();

        // After every addon has registered tags, so Iconify's `iconify` handle
        // is already there. A name in `{{ iconify:icon }}` becomes SVG. Not in
        // `$tags`: that folder is autoloaded, and this class extends Iconify.
        Event::listen(RouteMatched::class, function () {
            IconifyDefault::registerTag();
        });

        LivePreviewConfig::register();

        ControlPanelScript::register();

        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'sve');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'sve');

        // After the translations are loaded — the device names are translated;
        // see LivePreviewConfig::devices().
        LivePreviewConfig::devices();

        StoreCollections::register();

        Routes::register();

        Utilities::register();

        // After every other EntryBlueprintFound listener: visual id, responsive
        // wrap and "from the start" must see `type: replicator` first. YAML on
        // disk stays replicator; only the Live Preview form is swapped.
        Event::listen(EntryBlueprintFound::class, [UseLiteSections::class, 'handle']);
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
