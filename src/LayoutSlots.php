<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Str;
use Statamic\Facades\Entry;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;
use Statamic\Fields\Field;

/**
 * The layout's places: one header, one footer, and the global sections drawn
 * under every page's content.
 *
 * Each place is a Replicator on a global set (`statamic-visual-editor.layout`,
 * written `set.field`). A header is a set on the header's Replicator — a
 * fieldset and a partial, the same as a page section — so what the Patterns
 * panel offers for the header is that Replicator's sets, and what it says is in
 * use is the row saved there.
 *
 * Header and footer hold one row. Adding while one is there is refused rather
 * than replacing it: taking the current one away is its own, deliberate step.
 * The sections place holds any number of global sections, each once.
 */
final class LayoutSlots
{
    /** The places, in the order the panel shows them. */
    public const SLOTS = ['header', 'footer', 'sections'];

    /** Places that hold a single row. */
    public const SINGLE = ['header', 'footer'];

    /** The set a global section is placed with — the page builder's own, drawn by its partial. */
    public const SECTION_SET = 'global_section';

    /** Where a place is stored: `['set' => 'site_head', 'field' => 'header']`, or null. */
    public static function target(string $slot): ?array
    {
        if (! in_array($slot, self::SLOTS, true)) {
            return null;
        }

        $spec = config("statamic-visual-editor.layout.{$slot}");

        if (! is_string($spec) || ! preg_match('/^([A-Za-z0-9_-]+)\.([A-Za-z0-9_]+)$/', $spec, $m)) {
            return null;
        }

        return ['set' => $m[1], 'field' => $m[2]];
    }

    /** The place's Replicator, when its global set has one under that name. */
    public static function field(string $slot): ?Field
    {
        $target = static::target($slot);
        $set = $target ? GlobalSet::findByHandle($target['set']) : null;
        $field = $set?->blueprint()?->field($target['field']);

        return $field && $field->type() === 'replicator' ? $field : null;
    }

    /**
     * The place's sets, flattened out of their groups: what can go there.
     *
     * A set without fields is offered too — a header with an empty fieldset
     * is a header still to be built, not a placeholder to hide.
     *
     * @return list<array{handle: string, display: string, icon: ?string}>
     */
    public static function types(string $slot): array
    {
        $sets = static::field($slot)?->config()['sets'] ?? [];
        $types = [];

        foreach (is_array($sets) ? $sets : [] as $key => $group) {
            // Grouped (`{group: {sets: {…}}}`), as Statamic writes them, or flat.
            $inner = is_array($group['sets'] ?? null) ? $group['sets'] : [$key => $group];

            foreach ($inner as $handle => $set) {
                if (! is_array($set) || ($set['hide'] ?? false) === true) {
                    continue;
                }

                $types[] = [
                    'handle' => (string) $handle,
                    'display' => (string) ($set['display'] ?? Str::title(str_replace(['/', '_'], ' ', (string) $handle))),
                    'icon' => isset($set['icon']) ? (string) $set['icon'] : null,
                ];
            }
        }

        return $types;
    }

    /** The rows saved in a place, as stored. */
    public static function rows(string $slot, ?string $site = null): array
    {
        $target = static::target($slot);
        $rows = $target ? static::variables($target['set'], $site)?->get($target['field']) : null;

        return array_values(array_filter(
            is_array($rows) ? $rows : [],
            fn ($row) => is_array($row) && is_string($row['type'] ?? null)
        ));
    }

    /** The type of the one row in a header or footer place, or null when it is empty. */
    public static function current(string $slot, ?string $site = null): ?string
    {
        return static::rows($slot, $site)[0]['type'] ?? null;
    }

    /**
     * Every place the site has, as the panel draws it: what can go there, and
     * what is there now.
     *
     * @return array<string, array>
     */
    public static function describe(?string $site = null): array
    {
        $out = [];

        foreach (self::SLOTS as $slot) {
            if (! static::field($slot)) {
                continue;
            }

            $rows = static::rows($slot, $site);

            $out[$slot] = $slot === 'sections'
                ? ['single' => false, 'rows' => array_map(fn ($row) => [
                    'id' => (string) ($row['id'] ?? ''),
                    'entry' => static::entryId($row),
                ], $rows)]
                : ['single' => true, 'types' => static::types($slot), 'rows' => array_map(fn ($row) => [
                    'id' => (string) ($row['id'] ?? ''),
                    'type' => $row['type'],
                ], $rows)];
        }

        return $out;
    }

    /**
     * Put something in a place: a set handle for the header or the footer, a
     * saved section's id for the sections. Null when it landed, otherwise why
     * not — `taken`, `unknown`, `twice`, `missing`.
     */
    public static function add(string $slot, string $value, ?string $site = null): ?string
    {
        $target = static::target($slot);
        $variables = $target && static::field($slot) ? static::variables($target['set'], $site) : null;

        if (! $variables) {
            return 'missing';
        }

        $rows = static::rows($slot, $site);
        $id = Str::random(8);

        if ($slot === 'sections') {
            $entry = Entry::find($value);

            if (! $entry || $entry->collectionHandle() !== 'saved_sections') {
                return 'unknown';
            }

            if (in_array($value, array_map([static::class, 'entryId'], $rows), true)) {
                return 'twice';
            }

            $rows[] = ['id' => $id, 'type' => self::SECTION_SET, self::SECTION_SET => $value, 'enabled' => true];
        } else {
            if ($rows !== []) {
                return 'taken';
            }

            if (! in_array($value, array_column(static::types($slot), 'handle'), true)) {
                return 'unknown';
            }

            $rows = [['id' => $id, 'type' => $value, 'enabled' => true]];
        }

        $variables->set($target['field'], $rows)->save();

        return null;
    }

    /** Take a row out of a place. False when there was no such row. */
    public static function remove(string $slot, string $rowId, ?string $site = null): bool
    {
        $target = static::target($slot);
        $variables = $target ? static::variables($target['set'], $site) : null;
        $rows = static::rows($slot, $site);
        $kept = array_values(array_filter($rows, fn ($row) => (string) ($row['id'] ?? '') !== $rowId));

        if (! $variables || count($kept) === count($rows)) {
            return false;
        }

        $variables->set($target['field'], $kept)->save();

        return true;
    }

    /** The global set handle a place is stored on. */
    public static function setOf(string $slot): ?string
    {
        return static::target($slot)['set'] ?? null;
    }

    /** The saved section a sections row points at — stored as an id, or a one-item list. */
    private static function entryId(array $row): ?string
    {
        $value = $row[self::SECTION_SET] ?? null;

        if (is_array($value)) {
            $value = $value[0] ?? null;
        }

        return is_string($value) && $value !== '' ? $value : null;
    }

    private static function variables(string $handle, ?string $site)
    {
        $set = GlobalSet::findByHandle($handle);
        $site ??= Site::selected()?->handle() ?? Site::default()->handle();

        return $set ? ($set->in($site) ?? $set->inDefaultSite()) : null;
    }
}
