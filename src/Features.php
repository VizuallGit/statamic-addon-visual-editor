<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Addon;
use Statamic\Facades\YAML;

/**
 * Which parts of the editor this site gets.
 *
 * Two sources, in order: the toggles saved on the addon's settings screen win,
 * and config/statamic-visual-editor.php answers for everything they don't cover.
 *
 * The saved values are read *raw* — as they sit in the file — rather than through
 * Settings::get(), which would fill every untouched key with the blueprint's own
 * default and leave the config file with nothing left to say. Absent means
 * "unanswered here", so a site can be shipped with defaults in config and still
 * be adjusted per-installation without editing PHP.
 */
class Features
{
    /** The addon's package name — how the settings repository files it. */
    protected const ADDON_ID = 'statamic-addon/visual-editor';

    /**
     * Keys that must stay off when neither settings nor config mention them.
     *
     * `enabled()` treats an unknown key as on, so a dangerous new toggle would
     * light up on sites that have not merged the config yet. List those here.
     */
    protected const DEFAULT_OFF = [
        'psi',
        'template_dock',
        'site_css',
        'tailwind_dock',
        'component_props',
        'ai_panel',
        'ai_text',
        'dock_ghost',
        'schema',
        'file_manager',
        'live_reload',
        'live_reload_instant',
        'collection_templates',
        'previews_autowatch',
        'site_canvas',
        'build_mode',
    ];

    /** Every toggle, in the order the settings screen shows them. */
    public const KEYS = [
        'panel',
        'page_activity',
        // The Live Preview top bar's "all screen sizes" button. On unless the
        // settings or config say false: closed, it is one button and nothing else.
        'breakpoint_overview',
        // The site canvas (demo): templates and pages as frames on one surface
        // in Live Preview, a click making one the page being edited. Off until
        // the owner has seen it; closed, it is one button and nothing else.
        'site_canvas',
        // Build mode (preview): a Content | Build switch in the Live Preview top
        // bar; Build puts the Build panel (Add | Style) in the left column. Who
        // gets it is its own list (build_mode_access), and the HTML dock goes
        // with it (TOGETHER). Off until the owner says on; off, nothing of it
        // is drawn or loaded.
        'build_mode',
        'pages',
        'globals',
        'sections',
        'listview',
        'outline',
        'performance',
        'psi',
        // The top bar's X-ray switch: grid, flex and box outlines over the preview.
        // On unless the settings or config say false; off, the icon is gone.
        'xray',
        // The top bar's design overlay: a screenshot per page and size over the preview.
        'design_overlay',
        'html_tree',
        'inline_edit',
        'open_in_preview',
        // A Live Preview button in the Control Panel's top bar, on every CP
        // page: opens the front page in Live Preview. On unless the settings
        // or config say false; off, it is one button and nothing else.
        'home_preview_button',
        'template_dock',
        'site_css',
        'file_manager',
        // A button on the public site that reloads the page when the site's
        // files change on the server. Off by default; super admins.
        'live_reload',
        // Live Preview paints a section partial saved outside the editor at
        // once, through the dock (dock:take-file), when its file is open
        // there. Off: the server's render alone — lighter for both ends.
        'live_reload_instant',
        'collection_templates',
        'tailwind_dock',
        'component_props',
        'ai_panel',
        'ai_text',
        // Grey text at the caret in the dock's HTML pane, from Claude. Costs
        // per request on the site's own Anthropic key, so off until the
        // settings say on; it lives in the dock, so it follows the dock's
        // audience.
        'dock_ghost',
        'schema',
        // The Bard styles popup in the top bar; it needs the bard-style addon v1.1+.
        'bard_styles',
        'comments',
        'library_page',
        'library_custom',
        'library_global',
        'library_templates',
        'library_in_use_only',
        'previews_autowatch',
        'chrome_header',
        'chrome_footer',
    ];

    /** Cached per request: the settings file is read from disk. */
    protected static ?array $map = null;

    /**
     * The saved settings, cached per request like the map. Statamic's addon
     * settings take 45–50 ms per read on the server (measured on Cuben, a
     * 3 KB file), and editorEnabled() is asked by five middlewares on every
     * front-end request: 220 ms of every page, a visitor's too.
     */
    protected static ?array $saved = null;

    /**
     * The full on/off map, ready to hand to the browser.
     *
     * @return array<string, bool>
     */
    public static function map(): array
    {
        if (static::$map !== null) {
            return static::$map;
        }

        $saved = static::saved();

        $map = [];

        foreach (static::KEYS as $key) {
            $map[$key] = array_key_exists($key, $saved)
                ? (bool) $saved[$key]
                : (bool) config(
                    "statamic-visual-editor.features.{$key}",
                    ! in_array($key, static::DEFAULT_OFF, true)
                );

            if (! SundayAug30::enabled() && $key === 'html_tree') {
                $map[$key] = false;
            }
        }

        return static::$map = $map;
    }

    /** Is one feature on? Unknown keys are on — a typo shouldn't hide the editor. */
    public static function enabled(string $key): bool
    {
        return static::map()[$key] ?? true;
    }

    /**
     * Toggles that are on only together: Build writes the HTML dock's file,
     * and the dock is only in Build. Either off, both are off for everyone.
     */
    protected const TOGETHER = [
        'build_mode' => 'template_dock',
        'template_dock' => 'build_mode',
    ];

    /**
     * Is this tool on *and* allowed for the current user?
     *
     * Site toggle first, then toolbar access (everyone / super / named people).
     * Unknown keys follow `enabled()` — a typo should not hide the editor.
     */
    public static function allows(string $key, ?\Statamic\Contracts\Auth\User $user = null): bool
    {
        if (! static::enabled($key) || (isset(static::TOGETHER[$key]) && ! static::enabled(static::TOGETHER[$key]))) {
            return false;
        }

        return ToolbarAccess::allows($key, $user);
    }

    /**
     * The feature map as this Control Panel user should see it.
     *
     * Same keys as `map()`. A tool that is on for the site but not for this
     * user comes back false, so the browser can keep using `sveFeatures`
     * without a second list.
     *
     * @return array<string, bool>
     */
    public static function visible(?\Statamic\Contracts\Auth\User $user = null): array
    {
        $map = static::map();

        foreach (ToolbarAccess::KEYS as $key) {
            $map[$key] = static::allows($key, $user);
        }

        return $map;
    }

    /**
     * Is the editor itself switched on?
     *
     * Separate from the feature map because it gates the addon as a whole,
     * including the bridge script that the features never get a say in.
     */
    public static function editorEnabled(): bool
    {
        $saved = static::saved();

        return array_key_exists('enabled', $saved)
            ? (bool) $saved['enabled']
            : (bool) config('statamic-visual-editor.enabled', true);
    }

    /**
     * A saved setting that is not one of the on/off toggles.
     *
     * The map casts everything to a boolean, which is right for a switch and
     * wrong for anything else — a list of user groups would come back as `true`.
     * Read on the same terms as the map: what the settings screen saved wins,
     * then config, then the caller's default.
     */
    public static function setting(string $key, mixed $default = null): mixed
    {
        $saved = static::saved();

        return array_key_exists($key, $saved)
            ? $saved[$key]
            : config("statamic-visual-editor.features.{$key}", $default);
    }

    /**
     * Handles the Globals menu hides until the settings screen says otherwise.
     *
     * Header and footer are edited by clicking them on the page. Listing them
     * in the globe menu as well is a second door to the same room — off until
     * this site turns them on. The shared theme set is never in this list.
     *
     * @return list<string>
     */
    public static function globalsPickerOffByDefault(): array
    {
        $cfg = config('statamic-visual-editor.chrome', []);
        $shared = $cfg['global'] ?? 'theme_settings';

        return collect([
            $cfg['header']['global'] ?? null,
            $cfg['footer']['global'] ?? null,
            'header',
            'footer',
        ])
            ->filter(fn ($handle) => is_string($handle) && $handle !== '' && $handle !== $shared)
            ->unique()
            ->values()
            ->all();
    }

    /**
     * Keep the global sets the globe menu should list.
     *
     * Null / missing setting = the default (everything except header/footer).
     * An empty array is a real choice: show none.
     *
     * @param  list<array{handle: string, title?: string, url?: string}>  $sets
     * @return list<array{handle: string, title?: string, url?: string}>
     */
    public static function filterGlobalsPicker(array $sets): array
    {
        $allowed = static::setting('globals_picker');
        $off = static::globalsPickerOffByDefault();

        if (! is_array($allowed)) {
            return array_values(array_filter(
                $sets,
                fn ($set) => ! in_array($set['handle'] ?? '', $off, true)
            ));
        }

        return array_values(array_filter(
            $sets,
            fn ($set) => in_array($set['handle'] ?? '', $allowed, true)
        ));
    }

    /** Forget the cached map — for tests, and after the settings screen saves. */
    public static function flush(): void
    {
        static::$map = null;
        static::$saved = null;
    }

    /**
     * The toggles as saved on the settings screen, or [] if never saved.
     *
     * Read from the file the way Statamic's own FileSettingsRepository::find
     * reads it — `YAML::file($path)->parse()` — and not through
     * `$addon->settings()->raw()`. Those are the same values: raw() is the
     * parsed YAML, untouched. But building the Settings object around them
     * runs Antlers::parse over every value and every one of the blueprint's
     * 73 defaults: 48 ms, on every request, a visitor's too (five middlewares
     * ask editorEnabled()). The file itself parses in under a millisecond.
     *
     * Guarded: this runs from a middleware on every front-end request, and an
     * addon that isn't registered (or a settings file that has gone missing)
     * must fall through to config rather than take the site down.
     */
    protected static function saved(): array
    {
        if (static::$saved !== null) {
            return static::$saved;
        }

        try {
            $path = static::settingsPath();

            return static::$saved = $path !== null && is_file($path)
                ? (array) YAML::file($path)->parse()
                : [];
        } catch (\Throwable) {
            return [];
        }
    }

    /**
     * Where Statamic keeps this addon's saved settings: FileSettings::path().
     * Spelled out here so the file can be read without building a Settings
     * object; tests/FeaturesTest holds it against Statamic's own answer, so a
     * Statamic that moves the file fails the suite instead of silently
     * leaving every toggle on its default.
     */
    public static function settingsPath(): ?string
    {
        $slug = Addon::get(static::ADDON_ID)?->slug();

        return $slug ? resource_path("addons/{$slug}.yaml") : null;
    }
}
