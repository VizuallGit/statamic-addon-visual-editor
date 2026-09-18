<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\SectionDefaults\Sets;
use MarioHamann\StatamicVisualEditor\SectionDefaults\Values;

/**
 * A section type's default values, as raw storable data — the same section the
 * Add Set picker inserts when you click it.
 *
 * This is what a "Page" tab preview is a picture of. Screenshotting a real
 * instance found on some page shows that page's content, which is exactly what
 * you do NOT get when you drop the section: you get the defaults. So the preview
 * is built from the defaults, and dragging a section in holds no surprise.
 *
 * Defaults are resolved recursively. `default:` on a Grid gives the rows, but the
 * fields inside each row carry their own defaults, which Statamic fills in only
 * when the Control Panel creates the row — so a raw `[{}, {}, {}]` would render
 * as three empty rows. Here each row is filled from its own fields, at every
 * depth, so what renders is what the editor would see in the form.
 *
 * This class is the entry point other code calls; the resolving lives in
 * `SectionDefaults\Values` and the set lookup in `SectionDefaults\Sets`.
 * Split in WP7d, code moved verbatim.
 */
class SectionDefaults
{
    /**
     * The default section for a set handle, ready to be rendered as a
     * page-builder row, or null when no such set exists.
     */
    public static function for(string $handle): ?array
    {
        if (! $config = Sets::setConfig($handle)) {
            return null;
        }

        $values = Values::resolve($config['fields'] ?? [], $handle);

        return array_merge($values, [
            'id' => Values::id($handle),
            'type' => $handle,
            'enabled' => true,
        ]);
    }

    /**
     * Whether this section has anything to show. A set whose every field is empty
     * by default screenshots as a blank strip — for those, and only those, the
     * generator falls back to a real instance on the site.
     */
    public static function hasContent(?array $section): bool
    {
        if (! $section) {
            return false;
        }

        foreach ($section as $key => $value) {
            if (in_array($key, ['id', 'type', 'enabled'], true)) {
                continue;
            }

            if (! static::isEmpty($value)) {
                return true;
            }
        }

        return false;
    }

    protected static function isEmpty(mixed $value): bool
    {
        if (is_array($value)) {
            foreach ($value as $item) {
                if (! static::isEmpty($item)) {
                    return false;
                }
            }

            return true;
        }

        return $value === null || $value === '' || $value === false;
    }

    /**
     * The set definition for a handle, from the page-builder fieldset.
     *
     * @see Sets::setConfig()
     */
    public static function setConfig(string $handle): ?array
    {
        return Sets::setConfig($handle);
    }

    /**
     * Every set the page-builder field defines: handle => set config.
     *
     * @see Sets::allSets()
     */
    public static function allSets(): array
    {
        return Sets::allSets();
    }
}
