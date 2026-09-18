<?php

namespace MarioHamann\StatamicVisualEditor\SectionDefaults;

use MarioHamann\StatamicVisualEditor\Fieldtypes\ResponsiveFieldtype;
use MarioHamann\StatamicVisualEditor\FromTheStart;
use MarioHamann\StatamicVisualEditor\ResponsiveFields;
use Statamic\Fields\Field;
use Statamic\Fields\Fields;
use Statamic\Support\Str;

/**
 * The default values of one set, resolved field by field — nested sets,
 * rows, and responsive fields wrapped the way the form stores them.
 * Moved verbatim out of SectionDefaults in WP7d.
 */
final class Values
{
    /**
     * Field handle => raw default value, with imported fieldsets resolved.
     *
     * `Fields` is what does the resolving: a set's fields may be written as
     * `field: content_block.content_block` or `import:`, and handing the raw YAML
     * to it is what turns those into real fields with their configured defaults.
     */
    public static function resolve(array $items, string $path): array
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

        $out = [ResponsiveFieldtype::base() => [$field->handle() => $value]];

        // `sve_defaults` er startværdier pr. skærmstørrelse. De læses samme
        // sted som fieldtypen læser dem, ellers viser billedet noget andet end
        // det man får når sektionen indsættes — og det er den slags forskel
        // der koster en time at finde.
        $perBreakpoint = $field->get('sve_defaults');

        if (is_array($perBreakpoint)) {
            foreach ($perBreakpoint as $breakpoint => $breakpointValue) {
                if (! in_array($breakpoint, ResponsiveFieldtype::handles(), true)) {
                    continue;
                }

                if ($breakpointValue === null || $breakpointValue === '' || $breakpointValue === []) {
                    continue;
                }

                $out[$breakpoint] = [$field->handle() => $breakpointValue];
            }
        }

        return $out;
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

    /** A short, stable id for a row at a given path. */
    public static function id(string $path): string
    {
        return Str::lower(substr(md5('sve-preview:'.$path), 0, 12));
    }
}
