<?php

namespace MarioHamann\StatamicVisualEditor\Tags\Resolve;

/**
 * A set's config by handle, and the replicator field inside it: the two
 * recursive walks the insert control and the dock's picker need. Split out of
 * BlueprintFields in WP7c, verbatim.
 */
final class ReplicatorLookups
{
    /** A replicator set's own config, by set handle, anywhere in the tree. */
    public static function findSetConfig($node, string $setHandle, int $depth = 0): ?array
    {
        if ($depth > 14 || ! is_array($node)) {
            return null;
        }

        foreach (($node['tabs'] ?? []) as $tab) {
            if ($found = static::findSetConfig($tab, $setHandle, $depth + 1)) {
                return $found;
            }
        }

        foreach (($node['sections'] ?? []) as $section) {
            if ($found = static::findSetConfig($section, $setHandle, $depth + 1)) {
                return $found;
            }
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            if (isset($item['import'])) {
                $fieldset = \Statamic\Facades\Fieldset::find($item['import']);

                if ($fieldset && $found = static::findSetConfig($fieldset->contents(), $setHandle, $depth + 1)) {
                    return $found;
                }

                continue;
            }

            $field = $item['field'] ?? null;

            if (! is_array($field)) {
                continue;
            }

            foreach (($field['sets'] ?? []) as $group) {
                foreach (($group['sets'] ?? []) as $handle => $set) {
                    if ((string) $handle === $setHandle) {
                        return $set;
                    }

                    if ($found = static::findSetConfig($set, $setHandle, $depth + 1)) {
                        return $found;
                    }
                }
            }

            if (isset($field['fields']) && $found = static::findSetConfig($field, $setHandle, $depth + 1)) {
                return $found;
            }
        }

        return null;
    }

    /** The config of the replicator with this handle, found anywhere in the tree. */
    public static function findReplicatorConfig($node, string $handle, int $depth = 0): ?array
    {
        if ($depth > 14 || ! is_array($node)) {
            return null;
        }

        foreach (($node['tabs'] ?? []) as $tab) {
            if ($found = static::findReplicatorConfig($tab, $handle, $depth + 1)) {
                return $found;
            }
        }

        foreach (($node['sections'] ?? []) as $section) {
            if ($found = static::findReplicatorConfig($section, $handle, $depth + 1)) {
                return $found;
            }
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            if (isset($item['import'])) {
                $fieldset = \Statamic\Facades\Fieldset::find($item['import']);

                if ($fieldset && $found = static::findReplicatorConfig($fieldset->contents(), $handle, $depth + 1)) {
                    return $found;
                }

                continue;
            }

            $field = $item['field'] ?? null;

            if (! is_array($field)) {
                continue;
            }

            if (($item['handle'] ?? null) === $handle && isset($field['sets'])) {
                return $field;
            }

            foreach (($field['sets'] ?? []) as $group) {
                foreach (($group['sets'] ?? []) as $set) {
                    if ($found = static::findReplicatorConfig($set, $handle, $depth + 1)) {
                        return $found;
                    }
                }
            }

            if (isset($field['fields']) && $found = static::findReplicatorConfig($field, $handle, $depth + 1)) {
                return $found;
            }
        }

        return null;
    }
}
