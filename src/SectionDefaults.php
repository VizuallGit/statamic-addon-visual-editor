<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\Fieldtypes\ResponsiveFieldtype;
use Statamic\Facades\Fieldset;
use Statamic\Fields\Field;
use Statamic\Fields\Fields;
use Statamic\Support\Str;

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
 */
class SectionDefaults
{
    /**
     * The default section for a set handle, ready to be rendered as a
     * page-builder row, or null when no such set exists.
     */
    public static function for(string $handle): ?array
    {
        if (! $config = static::setConfig($handle)) {
            return null;
        }

        $values = static::resolve($config['fields'] ?? [], $handle);

        return array_merge($values, [
            'id' => static::id($handle),
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
     * Field handle => raw default value, with imported fieldsets resolved.
     *
     * `Fields` is what does the resolving: a set's fields may be written as
     * `field: content_block.content_block` or `import:`, and handing the raw YAML
     * to it is what turns those into real fields with their configured defaults.
     */
    protected static function resolve(array $items, string $path): array
    {
        $values = [];

        foreach ((new Fields($items))->all() as $field) {
            $value = static::defaultFor($field, $path.'.'.$field->handle());

            // Nothing to store: leave the key out entirely rather than writing a
            // null, so Antlers falls through to whatever the partial does for a
            // missing value.
            if ($value === null || $value === [] || $value === '') {
                continue;
            }

            $values[$field->handle()] = $value;
        }

        return $values;
    }

    /** One field's default, recursing into the fieldtypes that nest fields. */
    protected static function defaultFor(Field $field, string $path): mixed
    {
        $default = $field->defaultValue();
        $config = $field->config();
        $type = $field->type();

        // The wrapping happens when a blueprint is read, not when a fieldset is
        // listed: screenshots resolve defaults from the YAML as written. A
        // `sve_responsive` field is still its original type there, so its default
        // is the inner value — but the partial reads `padding.laptop.padding`.
        // Nest it the way an inserted section stores it, or the picture has no
        // padding at all.
        if ($type === 'responsive') {
            $nested = static::resolve($config['fields'] ?? [], $path.'.'.ResponsiveFieldtype::base());

            return $nested === [] ? null : [ResponsiveFieldtype::base() => $nested];
        }

        // Grid: `default:` holds the rows; each row's own fields supply the rest.
        if ($type === 'grid' && is_array($default)) {
            $default = static::rows($default, fn ($row, $index) => array_merge(
                static::resolve($config['fields'] ?? [], $path.'.'.$index),
                $row,
            ), $path);
        }

        // Replicator / Bard: each row names its set, and that set's fields
        // supply the row's defaults. Count lives beside `default` so the
        // checkbox fieldtype never has to store duplicate types.
        if ($type === 'replicator' && is_array($default)) {
            $default = FromTheStart::expand($default, $field->get(FromTheStart::KEY));
        }

        if (in_array($type, ['replicator', 'bard'], true) && is_array($default)) {
            $default = static::rows($default, function ($row, $index) use ($config, $path) {
                if (empty($row['type']) || ! is_string($row['type'])) {
                    return $row;
                }

                $fields = static::setFieldsIn($config['sets'] ?? [], $row['type']);

                return array_merge(static::resolve($fields, $path.'.'.$index), $row);
            }, $path);
        }

        // Group: one row's worth of nested fields, no list involved.
        if ($type === 'group') {
            $nested = static::resolve($config['fields'] ?? [], $path);

            $default = array_merge($nested, is_array($default) ? $default : []);
        }

        return static::wrapResponsive($field, $default);
    }

    /**
     * Puts a `sve_responsive` field's default under the base breakpoint, matching
     * how the value is stored once the field has been wrapped in `responsive`.
     */
    protected static function wrapResponsive(Field $field, mixed $value): mixed
    {
        if ($value === null || $value === [] || $value === '') {
            return $value;
        }

        if (empty($field->get(ResponsiveFields::KEY))) {
            return $value;
        }

        if (is_array($value) && array_intersect(array_keys($value), ResponsiveFieldtype::handles())) {
            return $value;
        }

        return [ResponsiveFieldtype::base() => [$field->handle() => $value]];
    }

    /**
     * Maps a list of default rows through $filler and gives each a stable id.
     *
     * The ids are derived from the path, not random: the section data is part of
     * the preview's fingerprint, and a fresh random id on every run would make
     * every preview permanently stale. Rows need an id at all because block
     * partials scope their CSS on it (`scope="{{ id }}"`).
     */
    protected static function rows(array $rows, callable $filler, string $path): array
    {
        $filled = [];

        foreach (array_values($rows) as $index => $row) {
            $row = $filler(is_array($row) ? $row : [], $index);

            if (empty($row['id'])) {
                $row['id'] = static::id($path.'.'.$index);
            }

            $filled[] = $row;
        }

        return $filled;
    }

    /** The `fields` of one set inside a replicator/bard `sets` config, flat or grouped. */
    protected static function setFieldsIn(array $sets, string $handle): array
    {
        if (isset($sets[$handle]['fields'])) {
            return $sets[$handle]['fields'];
        }

        foreach ($sets as $group) {
            if (isset($group['sets'][$handle]['fields'])) {
                return $group['sets'][$handle]['fields'];
            }
        }

        return [];
    }

    /**
     * The set definition for a handle, from the page-builder fieldset.
     *
     * Searched by handle across every group, since a project may file its section
     * types under any number of them ("Hero", "Content", …).
     */
    public static function setConfig(string $handle): ?array
    {
        foreach (static::allSets() as $setHandle => $config) {
            if ($setHandle === $handle) {
                return $config;
            }
        }

        return null;
    }

    /**
     * Every set the page-builder field defines: handle => set config.
     *
     * @return array<string, array>
     */
    public static function allSets(): array
    {
        $field = config('statamic-visual-editor.previews.field', 'page_sections');

        if (! $fieldset = Fieldset::find($field)) {
            return [];
        }

        $sets = [];
        static::collect($fieldset->contents(), $sets);

        return $sets;
    }

    /** Recursively collects set definitions, whatever shape the replicator config has. */
    protected static function collect($node, array &$sets): void
    {
        if (! is_array($node)) {
            return;
        }

        if (isset($node['sets']) && is_array($node['sets'])) {
            foreach ($node['sets'] as $group) {
                foreach (($group['sets'] ?? []) as $handle => $set) {
                    if (is_array($set) && (isset($set['display']) || isset($set['fields']))) {
                        $sets[$handle] = $set;
                    }
                }
            }
        }

        foreach ($node as $value) {
            static::collect($value, $sets);
        }
    }

    /** A short, stable id for a row at a given path. */
    protected static function id(string $path): string
    {
        return Str::lower(substr(md5('sve-preview:'.$path), 0, 12));
    }
}
