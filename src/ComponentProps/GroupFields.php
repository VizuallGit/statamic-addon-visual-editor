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
    /** The one set a list without block types has. A replicator row names its set. */
    private const SET = 'row';

    public static function config(array $prop, string $label): array
    {
        if (static::repeats($prop)) {
            $sets = [];

            foreach (static::sets($prop) as $set) {
                $sets[$set['handle']] = [
                    'display' => $set['label'] ?? $label,
                    'fields' => static::configs($set['fields']),
                ];
            }

            return [
                'type' => 'replicator',
                'display' => $label,
                'hide_display' => true,
                'collapse' => 'accordion',
                'previews' => true,
                'fullscreen' => false,
                'button_label' => __('sve::messages.component_props_add_row'),
                'sets' => ['main' => ['display' => $label, 'sets' => $sets]],
            ];
        }

        return [
            'type' => 'group',
            'display' => $label,
            'hide_display' => true,
            'fullscreen' => false,
            'fields' => static::configs(static::fields($prop)),
        ];
    }

    /** The written string, as the rows — or the one row — the fieldtype wants. */
    public static function toPublish(array $prop, string $raw): mixed
    {
        $value = GroupValue::decode($raw);

        if ($value === null) {
            return null;
        }

        if (! static::repeats($prop)) {
            return isset($value['rows'][0]) ? static::row(static::fields($prop), $value['rows'][0], 'toPublish') : null;
        }

        $off = array_flip($value['off']);
        $rows = [];

        foreach ($value['rows'] as $at => $row) {
            $set = static::setOf($prop, $row[GroupValue::TYPE] ?? null);

            // A replicator row names its set, and says whether it is on.
            $rows[] = [
                'type' => $set['handle'],
                'enabled' => ! isset($off[$at]),
                ...static::row($set['fields'], $row, 'toPublish'),
            ];
        }

        return $rows;
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
        if (! static::repeats($prop)) {
            $row = is_array($value) ? static::row(static::fields($prop), $value, 'toParam') : [];

            if (implode('', $row) === '') {
                return '';
            }

            return GroupValue::encode(GroupValue::names(static::fields($prop)), [$row], false);
        }

        $typed = static::declaredSets($prop) !== [];
        $out = [];
        $off = [];

        foreach (is_array($value) ? array_values($value) : [] as $row) {
            if (! is_array($row)) {
                continue;
            }

            $set = static::setOf($prop, $row['type'] ?? null);
            $clean = static::row($set['fields'], $row, 'toParam');

            if ($typed) {
                $clean = [GroupValue::TYPE => $set['handle'], ...$clean];
            }

            if (($row['enabled'] ?? true) === false) {
                $off[] = count($out);
            }

            $out[] = $clean;
        }

        $declared = static::declaredSets($prop);

        return GroupValue::encode(
            GroupValue::names(static::fields($prop), $declared),
            $out,
            true,
            $off,
            array_column($declared, 'handle')
        );
    }

    /** One row's fields, each through the conversion every other prop of its kind goes through. */
    private static function row(array $fields, array $row, string $way): array
    {
        $out = [];

        foreach ($fields as $field) {
            $out[$field['handle']] = $way === 'toPublish'
                ? PropFields::toPublish($field, (string) ($row[$field['handle']] ?? ''))
                : PropFields::toParam($field, $row[$field['handle']] ?? null);
        }

        return $out;
    }

    /** The Control Panel fields for a list of props, each saying its own name. */
    private static function configs(array $fields): array
    {
        $out = [];

        foreach ($fields as $field) {
            $config = PropFields::config($field);

            // The panel draws its own label beside the group, and only there.
            // Inside a row, each field has to say what it is.
            $config['hide_display'] = false;
            $out[] = ['handle' => $field['handle'], 'field' => $config];
        }

        return $out;
    }

    /**
     * The kinds of row a list has: its block types, or — without any — the
     * one kind its own fields make.
     *
     * @return list<array{handle: string, label: ?string, fields: list<array<string, mixed>>}>
     */
    private static function sets(array $prop): array
    {
        return static::declaredSets($prop) ?: [['handle' => self::SET, 'label' => null, 'fields' => static::fields($prop)]];
    }

    /** The set a row is: the one it names, or the first. */
    private static function setOf(array $prop, mixed $type): array
    {
        $sets = static::sets($prop);

        foreach ($sets as $set) {
            if ($set['handle'] === $type) {
                return $set;
            }
        }

        return $sets[0];
    }

    /** @return list<array{handle: string, label: ?string, fields: list<array<string, mixed>>}> */
    private static function declaredSets(array $prop): array
    {
        if (! static::repeats($prop)) {
            return [];
        }

        $out = [];

        foreach (is_array($prop['sets'] ?? null) ? $prop['sets'] : [] as $set) {
            if (is_array($set) && ($set['handle'] ?? '') !== '') {
                $out[] = [
                    'handle' => (string) $set['handle'],
                    'label' => isset($set['label']) ? (string) $set['label'] : null,
                    'fields' => static::valid(is_array($set['fields'] ?? null) ? $set['fields'] : []),
                ];
            }
        }

        return $out;
    }

    /** @return list<array<string, mixed>> */
    private static function fields(array $prop): array
    {
        return static::valid(is_array($prop['fields'] ?? null) ? $prop['fields'] : []);
    }

    /** @return list<array<string, mixed>> */
    private static function valid(array $fields): array
    {
        return array_values(array_filter($fields, fn ($field) => is_array($field) && ($field['handle'] ?? '') !== ''));
    }

    private static function repeats(array $prop): bool
    {
        return ($prop['repeat'] ?? false) === true;
    }
}
