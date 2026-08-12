<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Collection;
use Statamic\Facades\Fieldset;
use Statamic\Support\Str;

/**
 * What every Replicator set calls itself: its display name, its icon and the line
 * of instructions written under it.
 *
 * The focus panel names what you clicked at the top of the editor — a section, a
 * block inside one, a row inside that — and none of it is in the rendered form.
 * Statamic draws a set's display name in the header bar the focus view hides, and
 * never draws the icon or the instructions at all: they are set *config*, and
 * config stops at the server. So it is collected here, once per request, and
 * handed to the browser with the rest of the addon's configuration.
 *
 * Keyed by set handle rather than by path: the same block is the same block
 * wherever it is used, and a page builder that imports one fieldset into twenty
 * sections would otherwise repeat itself twenty times.
 */
class SetMeta
{
    /** How far the walk follows nesting before it decides the blueprint is looping. */
    protected const MAX_DEPTH = 20;

    /**
     * Every set the page builder can reach, by handle.
     *
     * @return array<string, array{display: string, icon: ?string, instructions: ?string}>
     */
    public static function map(): array
    {
        $map = [];
        $seen = [];

        // The entry blueprint first: it is the page builder as an editor actually
        // meets it, with every field reference already in place.
        $collection = Collection::findByHandle(
            config('statamic-visual-editor.previews.collection', 'pages')
        );

        if ($contents = $collection?->entryBlueprint()?->contents()) {
            static::walk($contents, $map, $seen);
        }

        // …then the page-builder fieldset on its own, for the sets a blueprint can
        // hold without ever naming: a saved section's own copy of the field, the
        // sets hidden from the picker.
        $fieldset = Fieldset::find(
            config('statamic-visual-editor.previews.field', 'page_sections')
        );

        if ($fieldset) {
            static::walk($fieldset->contents(), $map, $seen);
        }

        return $map;
    }

    /**
     * Walks any slice of blueprint/fieldset config, collecting sets wherever they
     * turn up: a top-level Replicator, a Bard inside a block, a Replicator nested
     * in a set two levels down. Imports are followed once each — a fieldset that
     * imports itself (directly or in a ring) would otherwise never bottom out.
     *
     * @param  array<string, mixed>  $node
     * @param  array<string, array>  $map    collected meta, by set handle
     * @param  array<string, true>   $seen   fieldset handles already followed
     */
    protected static function walk(array $node, array &$map, array &$seen, int $depth = 0): void
    {
        if ($depth > static::MAX_DEPTH) {
            return;
        }

        if (isset($node['import']) && is_string($node['import']) && ! isset($seen[$node['import']])) {
            $seen[$node['import']] = true;

            if ($imported = Fieldset::find($node['import'])) {
                static::walk($imported->contents(), $map, $seen, $depth + 1);
            }
        }

        if (isset($node['sets']) && is_array($node['sets'])) {
            foreach (static::flatten($node['sets']) as $handle => $set) {
                if (! is_array($set)) {
                    continue;
                }

                static::record($map, (string) $handle, $set);
                static::walk($set, $map, $seen, $depth + 1);
            }
        }

        foreach ($node as $key => $value) {
            // Already walked above, and walking it again as a plain array would
            // read every set's own `sets` key as a set of its own.
            if ($key === 'sets' || ! is_array($value)) {
                continue;
            }

            static::walk($value, $map, $seen, $depth + 1);
        }
    }

    /**
     * Files one set — without overwriting an answer an earlier pass already had.
     *
     * A handle can be declared more than once (a block imported into two sections,
     * one of which names an icon and the other doesn't). First non-empty wins, key
     * by key, so the fullest description of a set is the one that survives.
     *
     * @param  array<string, array>  $map
     * @param  array<string, mixed>  $set
     */
    protected static function record(array &$map, string $handle, array $set): void
    {
        $current = $map[$handle] ?? ['display' => null, 'icon' => null, 'instructions' => null];

        $map[$handle] = [
            'display' => $current['display'] ?: ($set['display'] ?? null) ?: Str::title(Str::deslugify(basename($handle))),
            'icon' => $current['icon'] ?: static::icon($set['icon'] ?? null),
            'instructions' => $current['instructions'] ?: ($set['instructions'] ?? null),
        ];
    }

    /**
     * An icon the panel can draw without asking anyone.
     *
     * A set picked from Statamic's own icon list stores the file's name (`h1`,
     * `fieldtype-bard`) — a name that means nothing outside the Control Panel's
     * Vue components, and the focus header is raw DOM. Resolving it to the SVG
     * itself here is what lets the header draw it; anything else (an Iconify name,
     * an emoji, pasted markup, or a custom set filename still unknown to disk)
     * is left exactly as written for the client to recognise.
     */
    protected static function icon(?string $name): ?string
    {
        return IconResolver::forPanel($name);
    }

    /**
     * Flattens Statamic's grouped set config (`sets: { group: { sets: {…} } }`) to
     * a flat `handle => set` map. Ungrouped config is already flat — v3-era
     * fieldsets and hand-written ones both still occur.
     *
     * @param  array<string, mixed>  $sets
     * @return array<string, mixed>
     */
    protected static function flatten(array $sets): array
    {
        $flat = [];

        foreach ($sets as $handle => $value) {
            if (is_array($value) && isset($value['sets']) && is_array($value['sets'])) {
                $flat += $value['sets'];

                continue;
            }

            $flat[$handle] = $value;
        }

        return $flat;
    }
}
