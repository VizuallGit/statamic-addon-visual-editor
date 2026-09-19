<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Collection;
use Statamic\Facades\Fieldset;
use Statamic\Facades\User;

/**
 * The page-builder's section types, for the visual "Add section" picker: each
 * type's handle, display name, fieldset group, preview image and default field
 * values. Groups follow the replicator set tabs in the page_sections fieldset.
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

        $sets = (FieldsetFields::of($fieldset)[0] ?? [])['field']['sets'] ?? [];
        $images = SetPreviewImages::map();
        $exclude = (array) config('statamic-visual-editor.previews.exclude', []);

        // Deleting a type edits the fieldset in the repository, so it is the
        // developer permission that decides — not the one for editing pages.
        $canDelete = (bool) User::current()?->can('configure fields');

        $types = [];

        foreach ($sets as $groupKey => $group) {
            if (! is_array($group) || ! isset($group['sets']) || ! is_array($group['sets'])) {
                continue;
            }

            $groupDisplay = $group['display'] ?? (string) $groupKey;

            foreach ($group['sets'] as $setHandle => $set) {
                if (($set['hide'] ?? false) === true || in_array($setHandle, $exclude, true)) {
                    continue;
                }

                // Empty Statamic placeholders (`New Set` with no fields) are not
                // insertable section types — they would otherwise get their own card.
                // A static section has no fields on purpose, and says so.
                $static = ($set['static'] ?? false) === true;

                if (! $static && empty($set['fields'] ?? [])) {
                    continue;
                }

                // Narrowed to what the site already uses — unless the site never
                // asked for that, or a super admin is asking.
                if (! LibraryAccess::allowsType($setHandle)) {
                    continue;
                }

                $types[] = [
                    'handle' => $setHandle,
                    'display' => $set['display'] ?? $setHandle,
                    // Which fieldset holds this section's fields, so the editor
                    // can open it without a second round trip. Read from the
                    // import rather than derived from the handle: the two are
                    // not the same word on every site — `featured_section/…`
                    // imports `featured_sections.…` here.
                    'fieldset' => static::importOf($set),
                    'group' => (string) $groupKey,
                    'group_display' => $groupDisplay,
                    // Markup only: the tree draws no fields icon on it.
                    'static' => $static,
                    'image_url' => $images[$setHandle] ?? null,
                    'defaults' => static::defaults($handle, $setHandle),
                    'can_delete' => $canDelete,
                ];
            }
        }

        return $types;
    }

    /**
     * The fieldset a set imports its fields from, or null when it declares them
     * inline. First import wins: a set built from several is rare, and the one
     * an author means by "this section's fields" is the one it leads with.
     */
    protected static function importOf(array $set): ?string
    {
        foreach (($set['fields'] ?? []) as $field) {
            $import = is_array($field) ? ($field['import'] ?? null) : null;

            if (is_string($import) && $import !== '') {
                return $import;
            }
        }

        return null;
    }

    /**
     * The default field values for one set type, keyed by field handle. Resolved
     * from the entry blueprint (imports and nested sets already flattened), field
     * by field so one that can't produce a default doesn't sink the rest.
     */
    protected static function defaults(string $field, string $setHandle): array
    {
        if (! $setFields = static::setFields($field, $setHandle)) {
            return [];
        }

        $defaults = [];

        foreach ($setFields->all() as $handle => $f) {
            try {
                $value = $f->defaultValue();

                if ($f->type() === 'replicator' && is_array($value)) {
                    $value = FromTheStart::expand($value, $f->get(FromTheStart::KEY));
                }

                if ($value !== null && $value !== '' && $value !== []) {
                    $defaults[$handle] = $value;
                }
            } catch (\Throwable $e) {
                // Skip a field whose default can't be resolved.
            }
        }

        return $defaults;
    }

    /**
     * One set type's fields, resolved off the entry blueprint so that imports and
     * field references are already flattened — a section that imports its design
     * tabby from a shared fieldset reads the same as one declaring it inline.
     */
    protected static function setFields(string $field, string $setHandle): ?\Statamic\Fields\Fields
    {
        $collection = Collection::findByHandle(
            config('statamic-visual-editor.previews.collection', 'pages')
        );

        $replicator = $collection?->entryBlueprint()?->fields()->all()->get($field);

        return $replicator?->fieldtype()->fields($setHandle) ?: null;
    }
}
