<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Addon;

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
        'template_dock',
        'tailwind_dock',
        'ai_panel',
        'open_first_section',
    ];

    /**
     * Still in KEYS and JS, but never on. Page Settings is the empty-panel
     * default; Focus panel already does one-section-at-a-time.
     */
    protected const PARKED_OFF = [
        'open_first_section',
    ];

    /** Every toggle, in the order the settings screen shows them. */
    public const KEYS = [
        'panel',
        'page_activity',
        'pages',
        'globals',
        'sections',
        'listview',
        'outline',
        'inline_edit',
        'focus_panel',
        'open_first_section',
        'open_in_preview',
        'template_dock',
        'tailwind_dock',
        'ai_panel',
        'comments',
        'library_page',
        'library_custom',
        'library_global',
        'library_templates',
        'library_in_use_only',
        'chrome_header',
        'chrome_footer',
    ];

    /** Cached per request: the settings file is read from disk. */
    protected static ?array $map = null;

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

            if (in_array($key, static::PARKED_OFF, true)) {
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
     * Is this tool on *and* allowed for the current user?
     *
     * Site toggle first, then toolbar access (everyone / super / named people).
     * Unknown keys follow `enabled()` — a typo should not hide the editor.
     */
    public static function allows(string $key, ?\Statamic\Contracts\Auth\User $user = null): bool
    {
        if (! static::enabled($key)) {
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
    }

    /**
     * The toggles as saved on the settings screen, or [] if never saved.
     *
     * Guarded: this runs from a middleware on every front-end request, and an
     * addon that isn't registered (or a settings file that has gone missing)
     * must fall through to config rather than take the site down.
     */
    protected static function saved(): array
    {
        try {
            return Addon::get(static::ADDON_ID)?->settings()->raw() ?? [];
        } catch (\Throwable) {
            return [];
        }
    }
}
