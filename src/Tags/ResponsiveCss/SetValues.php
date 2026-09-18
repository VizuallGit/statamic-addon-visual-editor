<?php

namespace MarioHamann\StatamicVisualEditor\Tags\ResponsiveCss;

use MarioHamann\StatamicVisualEditor\Fieldtypes\ResponsiveFieldtype as Responsive;
use Statamic\Fields\Value;
use Statamic\Fields\Values;

/**
 * Reading one field's value per breakpoint out of a set: the raw row, the
 * responsive shape, and the inner value at a breakpoint.
 * Moved verbatim out of ResponsiveCss in WP7d.
 */
final class SetValues
{
    /** @return array<string, mixed> */
    public static function setToArray(mixed $set): array
    {
        if ($set instanceof Values) {
            $all = $set->all();

            return is_array($all) ? $all : iterator_to_array($all);
        }

        if ($set instanceof Value) {
            return static::setToArray($set->value());
        }

        if (is_array($set)) {
            $type = $set['type'] ?? null;

            return array_merge($set, [
                'type' => $type instanceof Value ? $type->value() : $type,
            ]);
        }

        return [];
    }

    public static function responsiveValue(mixed $value): mixed
    {
        if ($value instanceof Value) {
            if ($value->fieldtype()?->handle() !== Responsive::handle()) {
                return null;
            }

            return $value->value();
        }

        if (! is_array($value)) {
            return null;
        }

        $keys = array_keys($value);

        return array_intersect($keys, Responsive::handles()) ? $value : null;
    }

    public static function innerAt(mixed $augmented, string $breakpoint, string $handle): mixed
    {
        if ($augmented instanceof Values) {
            $bucket = $augmented[$breakpoint] ?? null;

            if ($bucket instanceof Values || is_array($bucket)) {
                return $bucket[$handle] ?? null;
            }

            return $bucket;
        }

        if (is_array($augmented)) {
            $bucket = $augmented[$breakpoint] ?? null;

            if (is_array($bucket) && array_key_exists($handle, $bucket)) {
                return $bucket[$handle];
            }

            return $bucket;
        }

        return null;
    }
}
