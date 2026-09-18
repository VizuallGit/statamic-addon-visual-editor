<?php

namespace MarioHamann\StatamicVisualEditor\Tags\Resolve;

use MarioHamann\StatamicVisualEditor\FieldsetFields;

/**
 * Walking a blueprint: fields by handle, set and replicator config, the type
 * chain down to a row. Pure lookups — no tag state — moved verbatim out of
 * Tags\VisualEdit in WP7b.
 */
final class BlueprintFields
{
    /** @var array<string, list<array{handle?: string, config?: array, set?: string, chain?: array}>> */
    private static array $fieldsByHandle = [];

    /**
     * Same walk as {@see collectFieldsByHandle}, once per handle per request.
     *
     * @return  list<array{handle?: string, config?: array, set?: string, chain?: array}>
     */
    public static function fieldsByHandle($blueprint, string $handle, ?string $fieldType = null): array
    {
        $key = spl_object_id($blueprint).'|'.$handle.'|'.($fieldType ?? '*');

        if (isset(self::$fieldsByHandle[$key])) {
            return self::$fieldsByHandle[$key];
        }

        $matches = [];
        static::collectFieldsByHandle($blueprint->contents(), $handle, $matches, $fieldType);

        return self::$fieldsByHandle[$key] = $matches;
    }

    /**
     * Recursively collects every field with the given handle in a
     * blueprint/fieldset field tree, resolving `import` references. Each match is
     * recorded as ['config' => <field config>, 'set' => <nearest enclosing set
     * handle or ''>] so the caller can prefer the one in the current set type.
     *
     * $fieldType narrows the search to one fieldtype (e.g. 'bard'); null keeps
     * every match, which is what the sibling-control lookup needs.
     *
     * $node is any structure that may contain a `fields` array (tabs, sections,
     * sets, grids, groups).
     */
    public static function collectFieldsByHandle($node, string $handle, array &$matches, ?string $fieldType = null, string $enclosingSet = '', int $depth = 0, array $setChain = []): void
    {
        if ($depth > 14 || ! is_array($node)) {
            return;
        }

        // Tabs (assoc: name => tab).
        foreach (($node['tabs'] ?? []) as $tab) {
            static::collectFieldsByHandle($tab, $handle, $matches, $fieldType, $enclosingSet, $depth + 1, $setChain);
        }

        // Sections (list).
        foreach (($node['sections'] ?? []) as $section) {
            static::collectFieldsByHandle($section, $handle, $matches, $fieldType, $enclosingSet, $depth + 1, $setChain);
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            // Import reference — resolve the fieldset and recurse into it.
            if (isset($item['import'])) {
                $fieldset = \Statamic\Facades\Fieldset::find($item['import']);

                if ($fieldset) {
                    static::collectFieldsByHandle($fieldset->contents(), $handle, $matches, $fieldType, $enclosingSet, $depth + 1, $setChain);
                }

                continue;
            }

            $field = $item['field'] ?? null;

            // A field can also reference a fieldset field ("basic_blocks.blocks")
            // and override parts of it in `config`. Resolve it into the config it
            // stands for, so both the match below and the descent into its sets
            // work exactly as they do for an inline field — the overridden sets
            // are where a referenced replicator's own fields actually live.
            if (is_string($field)) {
                $referenced = static::resolveFieldReference($field);

                $field = $referenced ? array_merge($referenced, (array) ($item['config'] ?? [])) : null;
            }

            if (! is_array($field)) {
                continue;
            }

            // Case-insensitive: a handle is typed twice — once when the field is
            // created in the Control Panel, once in the template that names it —
            // and `Font_size` against `font_size` is a mismatch no one can see.
            // Nothing legitimate distinguishes two fields by capitals alone, so
            // the looser comparison costs nothing and answers the likelier intent.
            if (strcasecmp((string) ($item['handle'] ?? ''), $handle) === 0 && ($fieldType === null || ($field['type'] ?? null) === $fieldType)) {
                // `chain` is every set handle on the way down, outermost first —
                // ['featured_section/style_2', 'item']. The nearest set alone is
                // not enough to tell two fields apart: half a dozen sections name
                // a set `item`, and each of them has its own `text`.
                $matches[] = [
                    // The handle as the blueprint spells it, which is not always
                    // how the template spelled it — the comparison above ignores
                    // case, and a value is written back under this name, not the
                    // one that was typed. `font_size` writing to `Font_size` is
                    // the difference between a control that works and one that
                    // silently saves into a field nobody reads.
                    'handle' => (string) ($item['handle'] ?? ''),
                    'config' => $field,
                    'set' => $enclosingSet,
                    'chain' => $setChain,
                ];
            }

            // Grid/group nested fields.
            if (isset($field['fields'])) {
                static::collectFieldsByHandle($field, $handle, $matches, $fieldType, $enclosingSet, $depth + 1, $setChain);
            }

            // Replicator/Bard set groups: sets => [group => ['sets' => [handle => ['fields' => ...]]]].
            foreach (($field['sets'] ?? []) as $group) {
                foreach (($group['sets'] ?? []) as $setHandle => $set) {
                    // Descend into every set, tagging matches with this set handle
                    // so the caller can prefer the one matching the current type.
                    static::collectFieldsByHandle($set, $handle, $matches, $fieldType, (string) $setHandle, $depth + 1, [...$setChain, (string) $setHandle]);
                }
            }
        }
    }

    /** The field config behind a "fieldset.field" reference, or null. */
    public static function resolveFieldReference(string $reference): ?array
    {
        $segments = explode('.', $reference);
        $fieldHandle = array_pop($segments);
        $fieldset = \Statamic\Facades\Fieldset::find(implode('.', $segments));

        if (! $fieldset) {
            return null;
        }

        foreach (FieldsetFields::of($fieldset) as $item) {
            if (($item['handle'] ?? null) === $fieldHandle && is_array($item['field'] ?? null)) {
                return $item['field'];
            }
        }

        return null;
    }

    /** Flattens grouped set config (`sets: { group: { sets: {...} } }`) to handle => set. */
    public static function flattenReplicatorSets(array $sets): array
    {
        $first = reset($sets);

        if (is_array($first) && isset($first['sets'])) {
            $out = [];

            foreach ($sets as $group) {
                foreach (($group['sets'] ?? []) as $handle => $set) {
                    $out[$handle] = $set;
                }
            }

            return $out;
        }

        return $sets;
    }

    /** Depth-first walk collecting each row's `type` on the way to $uid. */
    public static function typeChainTo(array $node, string $uid, array $chain = [], int $depth = 0): ?array
    {
        if ($depth > 14) {
            return null;
        }

        foreach ($node as $value) {
            if (! is_array($value)) {
                continue;
            }

            $isRow = isset($value['type']) || isset($value['id']) || isset($value['_id']);
            $next = $isRow && isset($value['type']) ? [...$chain, (string) $value['type']] : $chain;

            if ($isRow && in_array($uid, [
                $value['id'] ?? null,
                $value['_id'] ?? null,
                $value['_visual_id'] ?? null,
            ], true)) {
                return $next;
            }

            if ($found = static::typeChainTo($value, $uid, $next, $depth + 1)) {
                return $found;
            }
        }

        return null;
    }

}
