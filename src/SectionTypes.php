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
    /** Group key for the fields that sit outside any tab — named client-side. */
    public const CONTENT_GROUP = '__content';

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
                    'groups' => static::groups($handle, $setHandle),
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
        if (! $setFields = static::setFields($field, $setHandle)) {
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

    /**
     * How a set's fields divide into the section panel's segmented control.
     *
     * Two ways to draw the line, both read off the fieldset rather than
     * configured a second time here:
     *
     *  - a `tab` field starts a group, and every field after it belongs to that
     *    group until the next one. It stores nothing, so marking up an existing
     *    section costs no migration — the fieldset stays flat and every field
     *    keeps its handle and its path.
     *  - a `tabby` is a group on its own, since it already gathers its fields.
     *
     * Anything outside both — the plain content fields — is collected into a
     * leading group the client names, because it is the one group the fieldset
     * never gives a name to.
     *
     * `display` comes from the field, so renaming it to "Design" renames the
     * segment, and adding another `tab` adds another segment with no change on
     * either side.
     */
    protected static function groups(string $field, string $setHandle): array
    {
        if (! $setFields = static::setFields($field, $setHandle)) {
            return [];
        }

        $groups = [];
        $loose = [];
        $open = null;

        foreach ($setFields->all() as $handle => $f) {
            // Hidden fields never reach the panel, and a group made only of them
            // would be a segment opening on nothing. The editor's own _visual_id
            // is exactly that: injected into every set, ahead of the author's
            // first tab, so without this every section grew an empty first tab.
            if ($f->visibility() === 'hidden') {
                continue;
            }

            $type = $f->type();

            if ($type === 'tab') {
                $groups[] = ['handle' => $handle, 'display' => $f->display() ?: $handle, 'fields' => []];
                $open = array_key_last($groups);

                continue;
            }

            if ($type === 'tabby') {
                // Self-contained: its own fields are inside it, so the group is
                // the one field. It also closes any open `tab` run — a tabby
                // after a tab marker reads as its own thing, not as its content.
                $groups[] = ['handle' => $handle, 'display' => $f->display() ?: $handle, 'fields' => [$handle]];
                $open = null;

                continue;
            }

            if ($open === null) {
                $loose[] = $handle;
            } else {
                $groups[$open]['fields'][] = $handle;
            }
        }

        if (! $groups) {
            return [];
        }

        if ($loose) {
            // No display: only the client knows what language to name it in.
            array_unshift($groups, ['handle' => static::CONTENT_GROUP, 'display' => null, 'fields' => $loose]);
        }

        return $groups;
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
