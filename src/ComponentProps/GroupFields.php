<?php

namespace MarioHamann\StatamicVisualEditor\ComponentProps;

use MarioHamann\StatamicVisualEditor\PropFields;

/**
 * A group, as the Control Panel's own fields.
 *
 * A group that repeats is Statamic's Replicator with one set — rows added,
 * removed, dragged and switched off the way they are everywhere else in the
 * Control Panel — folded as an accordion: every row shut to its one-line
 * preview, and opening one shuts the others. A grid stays open row by row,
 * and four rows of four fields filled the whole column. One that does not
 * repeat is Statamic's Group. Neither is drawn here: the fields inside are the
 * same fields every other prop is turned into, nested in the fieldtype
 * Statamic already has for nesting them.
 *
 * Both directions go a field at a time through `PropFields`, so a picture in a
 * row is the same URL a picture prop is, and rich text the same HTML.
 */
final class GroupFields
{
    /** The one set a list's rows are. A replicator row names its set. */
    private const SET = 'row';

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
                'type' => 'replicator',
                'display' => $label,
                'hide_display' => true,
                'collapse' => 'accordion',
                'previews' => true,
                'fullscreen' => false,
                'button_label' => __('sve::messages.component_props_add_row'),
                'sets' => [
                    'main' => [
                        'display' => $label,
                        'sets' => [
                            self::SET => ['display' => $label, 'fields' => $fields],
                        ],
                    ],
                ],
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

        $off = array_flip($value['off']);
        $rows = [];

        foreach ($value['rows'] as $at => $row) {
            $out = [];

            foreach (static::fields($prop) as $field) {
                $out[$field['handle']] = PropFields::toPublish($field, (string) ($row[$field['handle']] ?? ''));
            }

            // A replicator row names its set, and says whether it is on.
            $rows[] = static::repeats($prop) ? ['type' => self::SET, 'enabled' => ! isset($off[$at]), ...$out] : $out;
        }

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
        $off = [];

        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }

            $clean = [];

            foreach ($fields as $field) {
                $clean[$field['handle']] = PropFields::toParam($field, $row[$field['handle']] ?? null);
            }

            if (($row['enabled'] ?? true) === false) {
                $off[] = count($out);
            }

            $out[] = $clean;
        }

        $filled = array_filter($out, fn (array $row) => implode('', $row) !== '');

        if (! static::repeats($prop) && $filled === []) {
            return '';
        }

        return GroupValue::encode(array_column($fields, 'handle'), $out, static::repeats($prop), $off);
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
