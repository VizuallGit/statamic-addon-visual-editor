<?php

namespace MarioHamann\StatamicVisualEditor\Tags\Resolve;

use Illuminate\Support\Facades\Log;
use MarioHamann\StatamicVisualEditor\IconResolver;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\BlueprintFields;

/**
 * Which icon a field or a set carries, found in the blueprint. Pure lookups,
 * moved verbatim out of Tags\VisualEdit in WP7b.
 */
final class Icons
{
    /** Walks the blueprint for a field with this handle and returns its `icon`. */
    public static function findFieldIcon($node, string $fieldHandle, int $depth = 0): ?string
    {
        if ($depth > 14 || ! is_array($node)) {
            return null;
        }

        foreach (($node['tabs'] ?? []) as $tab) {
            if ($found = static::findFieldIcon($tab, $fieldHandle, $depth + 1)) {
                return $found;
            }
        }

        foreach (($node['sections'] ?? []) as $section) {
            if ($found = static::findFieldIcon($section, $fieldHandle, $depth + 1)) {
                return $found;
            }
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            if (isset($item['import'])) {
                $fieldset = \Statamic\Facades\Fieldset::find($item['import']);

                if ($fieldset && $found = static::findFieldIcon($fieldset->contents(), $fieldHandle, $depth + 1)) {
                    return $found;
                }

                continue;
            }

            $handle = (string) ($item['handle'] ?? '');
            $field = $item['field'] ?? null;

            if (is_string($field)) {
                $referenced = BlueprintFields::resolveFieldReference($field);
                $field = $referenced ? array_merge($referenced, (array) ($item['config'] ?? [])) : null;
            }

            if (! is_array($field)) {
                continue;
            }

            if ($handle === $fieldHandle && ! empty($field['icon'])) {
                return (string) $field['icon'];
            }

            foreach (BlueprintFields::flattenReplicatorSets($field['sets'] ?? []) as $set) {
                if ($found = static::findFieldIcon($set, $fieldHandle, $depth + 1)) {
                    return $found;
                }
            }

            if (isset($field['fields']) && $found = static::findFieldIcon($field, $fieldHandle, $depth + 1)) {
                return $found;
            }
        }

        return null;
    }

    /** Walks the blueprint for a set with this handle and returns its `icon`. */
    public static function findSetIcon($node, string $setHandle, int $depth = 0): ?string
    {
        if ($depth > 14 || ! is_array($node)) {
            return null;
        }

        foreach (($node['tabs'] ?? []) as $tab) {
            if ($found = static::findSetIcon($tab, $setHandle, $depth + 1)) {
                return $found;
            }
        }

        foreach (($node['sections'] ?? []) as $section) {
            if ($found = static::findSetIcon($section, $setHandle, $depth + 1)) {
                return $found;
            }
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            if (isset($item['import'])) {
                $fieldset = \Statamic\Facades\Fieldset::find($item['import']);

                if ($fieldset && $found = static::findSetIcon($fieldset->contents(), $setHandle, $depth + 1)) {
                    return $found;
                }

                continue;
            }

            $field = $item['field'] ?? null;

            // Same as collectFieldsByHandle: a referenced field keeps its sets in
            // the `config` override, so it has to be resolved before descending.
            if (is_string($field)) {
                $referenced = BlueprintFields::resolveFieldReference($field);

                $field = $referenced ? array_merge($referenced, (array) ($item['config'] ?? [])) : null;
            }

            if (! is_array($field)) {
                continue;
            }

            foreach (BlueprintFields::flattenReplicatorSets($field['sets'] ?? []) as $handle => $set) {
                if ((string) $handle === $setHandle && ! empty($set['icon'])) {
                    return (string) $set['icon'];
                }

                if ($found = static::findSetIcon($set, $setHandle, $depth + 1)) {
                    return $found;
                }
            }

            if (isset($field['fields']) && $found = static::findSetIcon($field, $setHandle, $depth + 1)) {
                return $found;
            }
        }

        return null;
    }

    /**
     * The SVG behind an icon name, or empty when there is none to find.
     *
     * Filenames from Statamic's set or a registered custom Icon::set are looked
     * up on disk. Anything else — Iconify, emoji — is left for the preview under
     * `data-sid-icon`.
     */
    public static function resolveIconMarkup(string $icon): string
    {
        try {
            return IconResolver::markup($icon) ?? '';
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to read icon '.$icon, ['exception' => $e]);

            return '';
        }
    }
}
