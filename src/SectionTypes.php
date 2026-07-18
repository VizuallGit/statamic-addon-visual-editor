<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Collection;
use Statamic\Facades\Fieldset;

/**
 * The page-builder's section types, for the visual "Add section" picker: each
 * type's handle, display name, preview image and default field values.
 *
 * The defaults are computed the same way Statamic applies them when you add a
 * set (each field's `default`), so inserting a section from the picker starts
 * with the same content it would from the native picker — but without touching
 * the native picker at all, so we can position and theme it ourselves.
 */
class SectionTypes
{
    public static function map(): array
    {
        $handle = config('statamic-visual-editor.previews.field', 'page_sections');
        $fieldset = Fieldset::find($handle);

        if (! $fieldset) {
            return [];
        }

        $sets = $fieldset->contents()['fields'][0]['field']['sets'] ?? [];
        $images = SetPreviewImages::map();
        $exclude = (array) config('statamic-visual-editor.previews.exclude', []);

        $types = [];

        foreach ($sets as $group) {
            foreach (($group['sets'] ?? []) as $setHandle => $set) {
                if (($set['hide'] ?? false) === true || in_array($setHandle, $exclude, true)) {
                    continue;
                }

                $types[] = [
                    'handle' => $setHandle,
                    'display' => $set['display'] ?? $setHandle,
                    'image_url' => $images[$setHandle] ?? null,
                    'defaults' => static::defaults($handle, $setHandle),
                ];
            }
        }

        return $types;
    }

    /**
     * The default field values for one set type, keyed by field handle. Resolved
     * from the entry blueprint (imports and nested sets already flattened), field
     * by field so one that can't produce a default doesn't sink the rest.
     */
    protected static function defaults(string $field, string $setHandle): array
    {
        $collection = Collection::findByHandle(
            config('statamic-visual-editor.previews.collection', 'pages')
        );

        $blueprint = $collection?->entryBlueprint();

        if (! $blueprint) {
            return [];
        }

        $replicator = $blueprint->fields()->all()->get($field);

        if (! $replicator) {
            return [];
        }

        $setFields = $replicator->fieldtype()->fields($setHandle) ?? null;

        if (! $setFields) {
            return [];
        }

        $defaults = [];

        foreach ($setFields->all() as $handle => $f) {
            try {
                $value = $f->defaultValue();

                if ($value !== null && $value !== '' && $value !== []) {
                    $defaults[$handle] = $value;
                }
            } catch (\Throwable $e) {
                // Skip a field whose default can't be resolved.
            }
        }

        return $defaults;
    }
}
