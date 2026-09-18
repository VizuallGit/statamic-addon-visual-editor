<?php

namespace MarioHamann\StatamicVisualEditor\DataVars;

use Statamic\Fields\Field;
use Statamic\Fields\Fields;

/**
 * A field list flattened into pickable rows: one row per variable name, with
 * what is nested inside grids and replicators, and a short preview of the value.
 * Moved verbatim out of DataVars in WP7d.
 */
final class Rows
{
    /** Fields that are looped over rather than printed. */
    public const LOOP_TYPES = [
        'assets',
        'grid',
        'replicator',
        'list',
        'entries',
        'terms',
        'users',
        'taxonomy',
        'collections',
        'array',
        'table',
    ];

    /** A single asset field prints one file; the loop is still how you reach `url`. */
    public const ASSET_TYPES = ['assets'];

    /**
     * Fieldtypes that draw something in the Control Panel and store nothing —
     * a tab, a divider, a preview of another field. There is no variable to
     * write for them, so listing them is only noise.
     *
     * Statamic's own are recognised by `localizable() === false`. Addon ones
     * often set no flags at all, so `data_vars.skip` in the config takes the
     * rest without a release here.
     */
    public const SKIP_TYPES = [
        'section',
        'tab',
        'revealer',
        'spacer',
        'html',
        'import',
    ];

    /** Whether a field is worth offering as something to print. */
    protected static function skip(Field $field): bool
    {
        $type = $field->type();

        if (in_array($type, static::SKIP_TYPES, true)) {
            return true;
        }

        if (in_array($type, (array) config('statamic-visual-editor.data_vars.skip', []), true)) {
            return true;
        }

        return $field->fieldtype()?->localizable() === false;
    }

    /**
     * A field list, flattened, with what is nested inside grids and replicators.
     *
     * The nested rows are what makes this worth having: `list` on its own says
     * nothing, and the `icon` inside it is the handle you were looking for. They
     * carry their parent so the menu can show where they live, and print as the
     * bare handle — which is correct, because you write them inside the loop.
     *
     * @return list<array<string, mixed>>
     */
    public static function walk(array $fields, int $depth = 0, string $parent = '', string $prefix = ''): array
    {
        return static::walkAll(new Fields($fields), $depth, $parent, $prefix);
    }

    /**
     * The same, for a Fields instance — what a blueprint hands back.
     *
     * @return list<array<string, mixed>>
     */
    public static function walkAll(Fields $fields, int $depth = 0, string $parent = '', string $prefix = '', array $values = []): array
    {
        if ($depth > 2) {
            return [];
        }

        $out = [];

        foreach ($fields->all() as $handle => $field) {
            if (str_starts_with($handle, '_') || static::skip($field)) {
                continue;
            }

            $config = $field->config();
            $type = $field->type();

            // A group is a path, not a loop: its fields are reached as
            // `link.url` from wherever the group itself is reachable. So it
            // contributes a prefix and no row of its own.
            if ($type === 'group') {
                $out = array_merge($out, static::walkAll(
                    new Fields($config['fields'] ?? []),
                    $depth + 1,
                    $parent,
                    $prefix.$handle.'.',
                    is_array($values[$handle] ?? null) ? $values[$handle] : []
                ));

                continue;
            }

            $row = static::row($prefix.$handle, $field, $values[$handle] ?? null);

            if ($parent !== '') {
                $row['parent'] = $parent;
            }

            $out[] = $row;

            // A loop is the other kind: its fields print as bare handles, but
            // only inside it, so they carry where they live instead of a path.
            $inside = trim($parent === '' ? $prefix.$handle : $parent.' › '.$prefix.$handle);

            if ($type === 'grid') {
                $out = array_merge($out, static::walk($config['fields'] ?? [], $depth + 1, $inside));

                continue;
            }

            if ($type === 'replicator') {
                foreach (static::flattenSets($config['sets'] ?? []) as $name => $set) {
                    $out = array_merge($out, static::walk(
                        $set['fields'] ?? [],
                        $depth + 1,
                        $inside.' › '.$name
                    ));
                }
            }
        }

        return static::dedupe($out);
    }

    /**
     * One row per variable name. Sets repeat `headline` and `text` constantly,
     * and three identical rows in the menu is three ways to pick the same thing.
     */
    protected static function dedupe(array $rows): array
    {
        $seen = [];
        $out = [];

        foreach ($rows as $row) {
            $key = $row['var'].'|'.($row['parent'] ?? '');

            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;
            $out[] = $row;
        }

        return $out;
    }

    /**
     * An entry's fields without the page builder inside them.
     *
     * The builder is what the Section tab is for, and it is the biggest field on
     * the blueprint by a wide margin — every set, every row, unfolded. Left in,
     * it buries the handful of fields the tab exists to show.
     *
     * @param  list<array<string, mixed>>  $rows
     * @return list<array<string, mixed>>
     */
    public static function withoutPageBuilder(array $rows): array
    {
        $skip = (string) config('statamic-visual-editor.previews.field', 'page_sections');

        return array_values(array_filter(
            $rows,
            fn ($row) => $row['var'] !== $skip && ! str_starts_with((string) ($row['parent'] ?? ''), $skip)
        ));
    }

    /** Sets may be grouped; the handles are one flat namespace either way. */
    public static function flattenSets(array $sets): array
    {
        $out = [];

        foreach ($sets as $handle => $config) {
            if (isset($config['sets']) && is_array($config['sets'])) {
                $out += static::flattenSets($config['sets']);

                continue;
            }

            $out[$handle] = $config;
        }

        return $out;
    }

    /** One pickable row: what to write, what it is, and what is in it. */
    protected static function row(string $var, Field $field, mixed $value = null): array
    {
        $type = $field->type();

        $row = [
            'var' => $var,
            'label' => $field->display() ?: $var,
            'type' => $type,
        ];

        // Only what is true is sent. A row carrying `loop: false` and
        // `value: null` reads, in the menu's code, exactly like one that says
        // nothing — and costs a field on every row to say it.
        if (in_array($type, static::LOOP_TYPES, true)) {
            $row['loop'] = true;
        }

        $preview = $value === null ? '' : static::preview($value);

        if ($preview !== '') {
            $row['value'] = $preview;
        }

        return $row;
    }

    /** A value shortened to something that fits on one row of a menu. */
    public static function preview(mixed $value): string
    {
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if (is_scalar($value)) {
            $text = trim(preg_replace('/\s+/', ' ', (string) $value));

            return mb_strlen($text) > 60 ? mb_substr($text, 0, 60).'…' : $text;
        }

        if (is_array($value)) {
            return count($value).' ×';
        }

        return '';
    }
}
