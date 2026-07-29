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

    /** Every toggle, in the order the settings screen shows them. */
    public const KEYS = [
        'panel',
        'pages',
        'globals',
        'sections',
        'inline_edit',
        'library_page',
        'library_custom',
        'library_global',
        'library_templates',
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
                : (bool) config("statamic-visual-editor.features.{$key}", true);
        }

        return static::$map = $map;
    }

    /** Is one feature on? Unknown keys are on — a typo shouldn't hide the editor. */
    public static function enabled(string $key): bool
    {
        return static::map()[$key] ?? true;
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
