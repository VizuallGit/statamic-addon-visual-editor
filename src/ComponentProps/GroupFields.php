<?php

namespace MarioHamann\StatamicVisualEditor\ComponentProps;

use MarioHamann\StatamicVisualEditor\PropFields;

/**
 * A group, as the Control Panel's own fields.
 *
 * A group that repeats is Statamic's Grid — rows added, removed and dragged
 * the way they are everywhere else in the Control Panel. One that does not is
 * Statamic's Group. Neither is drawn here: the fields inside are the same
 * fields every other prop is turned into, nested in the fieldtype Statamic
 * already has for nesting them.
 *
 * Both directions go a field at a time through `PropFields`, so a picture in a
 * row is the same URL a picture prop is, and rich text the same HTML.
 */
final class GroupFields
{
    public static function config(array $prop, string $label): array
    {
        $fields = [];

        foreach (static::fields($prop) as $field) {
            $config = PropFields::config($field);

            // The panel draws its own label beside the group, and only there.
            // Inside a row, each field has to say what it is.
            $config['hide_display'] = false;
            $fields[] = ['handle' => $field['handle'], 'field' => $config];
        }

        if (static::repeats($prop)) {
            return [
                'type' => 'grid',
                'display' => $label,
                'hide_display' => true,
                // One field above the next: the panel is narrow, and a table
                // of columns in it would be a row of slivers.
                'mode' => 'stacked',
                'fullscreen' => false,
                'fields' => $fields,
            ];
        }

        return [
            'type' => 'group',
            'display' => $label,
            'hide_display' => true,
            'fullscreen' => false,
            'fields' => $fields,
        ];
    }

    /** The written string, as the rows — or the one row — the fieldtype wants. */
    public static function toPublish(array $prop, string $raw): mixed
    {
        $value = GroupValue::decode($raw);

        if ($value === null) {
            return null;
        }

        $rows = array_map(function (array $row) use ($prop) {
            $out = [];

            foreach (static::fields($prop) as $field) {
                $out[$field['handle']] = PropFields::toPublish($field, (string) ($row[$field['handle']] ?? ''));
            }

            return $out;
        }, $value['rows']);

        return static::repeats($prop) ? $rows : ($rows[0] ?? null);
    }

    /**
     * The fieldtype's answer, as the one string the call carries.
     *
     * A group with every field empty is written as nothing, because that is
     * what an empty text prop means too: whatever the component falls back to.
     * A list with no rows is not: it is the last row deleted, and writing
     * nothing would bring the component's own rows back in its place. Rows a
     * place has not changed are left out by the controller, which knows the
     * component's.
     */
    public static function toParam(array $prop, mixed $value): string
    {
        $fields = static::fields($prop);
        $rows = static::repeats($prop)
            ? (is_array($value) ? array_values($value) : [])
            : (is_array($value) ? [$value] : []);
        $out = [];

        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }

            $clean = [];

            foreach ($fields as $field) {
                $clean[$field['handle']] = PropFields::toParam($field, $row[$field['handle']] ?? null);
            }

            $out[] = $clean;
        }

        $filled = array_filter($out, fn (array $row) => implode('', $row) !== '');

        if (! static::repeats($prop) && $filled === []) {
            return '';
        }

        return GroupValue::encode(array_column($fields, 'handle'), $out, static::repeats($prop));
    }

    /** @return list<array<string, mixed>> */
    private static function fields(array $prop): array
    {
        return array_values(array_filter(
            is_array($prop['fields'] ?? null) ? $prop['fields'] : [],
            fn ($field) => is_array($field) && ($field['handle'] ?? '') !== ''
        ));
    }

    private static function repeats(array $prop): bool
    {
        return ($prop['repeat'] ?? false) === true;
    }
}
