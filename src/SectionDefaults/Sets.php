<?php

namespace MarioHamann\StatamicVisualEditor\SectionDefaults;

use Statamic\Facades\Fieldset;

/**
 * Every set of the page-builder field, flattened, and one set's config.
 * Moved verbatim out of SectionDefaults in WP7d.
 */
final class Sets
{
    /**
     * The set definition for a handle, from the page-builder fieldset.
     *
     * Searched by handle across every group, since a project may file its section
     * types under any number of them ("Hero", "Content", …).
     */
    public static function setConfig(string $handle): ?array
    {
        foreach (static::allSets() as $setHandle => $config) {
            if ($setHandle === $handle) {
                return $config;
            }
        }

        return null;
    }

    /**
     * Every set the page-builder field defines: handle => set config.
     *
     * @return array<string, array>
     */
    public static function allSets(): array
    {
        $field = config('statamic-visual-editor.previews.field', 'page_sections');

        if (! $fieldset = Fieldset::find($field)) {
            return [];
        }

        $sets = [];
        static::collect($fieldset->contents(), $sets);

        return $sets;
    }

    /** Recursively collects set definitions, whatever shape the replicator config has. */
    protected static function collect($node, array &$sets): void
    {
        if (! is_array($node)) {
            return;
        }

        if (isset($node['sets']) && is_array($node['sets'])) {
            foreach ($node['sets'] as $group) {
                foreach (($group['sets'] ?? []) as $handle => $set) {
                    if (is_array($set) && (isset($set['display']) || isset($set['fields']))) {
                        $sets[$handle] = $set;
                    }
                }
            }
        }

        foreach ($node as $value) {
            static::collect($value, $sets);
        }
    }
}
