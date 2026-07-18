<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Fieldset;

/**
 * How many rows each repeatable field will take.
 *
 * The preview's "+" and "−" on an orderable row add and remove items in the
 * form, and they have to honour the same limits the Control Panel does — a grid
 * capped at four rows must stay capped at four. The blueprint is the only place
 * that knows, so the limits are collected once and handed to the CP script.
 *
 * Keyed by "<set type>.<field handle>" (e.g. "hero/custom.benefits"), because the
 * same handle turns up in several sets with different limits. A bare handle is
 * also stored as a fallback.
 */
class RowLimits
{
    /** Grids count rows, replicators count sets — same idea, different keys. */
    protected const LIMIT_KEYS = [
        'min' => ['min_rows', 'min_sets'],
        'max' => ['max_rows', 'max_sets'],
    ];

    public static function map(): array
    {
        $handle = config('statamic-visual-editor.previews.field', 'page_sections');

        if (! $fieldset = Fieldset::find($handle)) {
            return [];
        }

        $limits = [];

        static::collect($fieldset->contents(), $limits);

        return $limits;
    }

    protected static function collect($node, array &$limits, string $setType = '', int $depth = 0): void
    {
        if ($depth > 12 || ! is_array($node)) {
            return;
        }

        foreach (($node['tabs'] ?? []) as $tab) {
            static::collect($tab, $limits, $setType, $depth + 1);
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            if (isset($item['import'])) {
                if ($fieldset = Fieldset::find($item['import'])) {
                    static::collect($fieldset->contents(), $limits, $setType, $depth + 1);
                }

                continue;
            }

            $field = $item['field'] ?? null;

            if (! is_array($field)) {
                continue;
            }

            static::record($item['handle'] ?? null, $field, $setType, $limits);

            // Grids and groups nest their own fields.
            if (isset($field['fields'])) {
                static::collect($field, $limits, $setType, $depth + 1);
            }

            // Replicator/Bard sets: each set becomes the type for what's inside it.
            foreach (($field['sets'] ?? []) as $group) {
                foreach (($group['sets'] ?? []) as $handle => $set) {
                    static::collect($set, $limits, (string) $handle, $depth + 1);
                }
            }
        }
    }

    protected static function record(?string $handle, array $field, string $setType, array &$limits): void
    {
        if (! $handle || ! in_array($field['type'] ?? null, ['grid', 'replicator'])) {
            return;
        }

        $limit = [];

        foreach (static::LIMIT_KEYS as $bound => $keys) {
            foreach ($keys as $key) {
                if (isset($field[$key]) && $field[$key] !== '') {
                    $limit[$bound] = (int) $field[$key];
                    break;
                }
            }
        }

        if (! $limit) {
            return;
        }

        $limits[$handle] = $limit;

        if ($setType !== '') {
            $limits[$setType.'.'.$handle] = $limit;
        }
    }
}
