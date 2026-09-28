<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\PageBuilderBlueprint;
use Statamic\Facades\Collection;
use Statamic\Facades\User;
use Statamic\Fields\Blueprint;

/**
 * The page-builder's section types, for the visual "Add section" picker: each
 * type's handle, display name, fieldset group, preview image and default field
 * values. Groups follow the replicator set tabs of the page's sections field.
 *
 * Which field that is, and which file its list is written in, is the page's
 * blueprint's to say ({@see SectionField}); without one, the pages collection's
 * page builder — the `page_sections` fieldset on this site.
 *
 * The defaults are computed the same way Statamic applies them when you add a
 * set (each field's `default`), so inserting a section from the picker starts
 * with the same content it would from the native picker — but without touching
 * the native picker at all, so we can position and theme it ourselves.
 */
class SectionTypes
{
    public static function map(?Blueprint $blueprint = null): array
    {
        $blueprint ??= static::defaultBlueprint();
        $handle = $blueprint ? SectionField::of($blueprint) : SectionField::fallback();
        $list = $blueprint ? SectionField::listOf($blueprint) : SectionList::fallback();
        $contents = $list->read();
        $sets = $contents === null ? null : $list->sets($contents);

        if ($sets === null) {
            return [];
        }

        $images = SetPreviewImages::map();
        $exclude = (array) config('statamic-visual-editor.previews.exclude', []);

        // Deleting a type edits the fieldset in the repository, so it is the
        // developer permission that decides — not the one for editing pages.
        $canDelete = (bool) User::current()?->can('configure fields');
        $isSuper = (bool) User::current()?->isSuper();

        $types = [];

        foreach ($sets as $groupKey => $group) {
            if (! is_array($group) || ! isset($group['sets']) || ! is_array($group['sets'])) {
                continue;
            }

            $groupDisplay = $group['display'] ?? (string) $groupKey;

            foreach ($group['sets'] as $setHandle => $set) {
                if (in_array($setHandle, $exclude, true)) {
                    continue;
                }

                // Kept out of the picker (`hide`): an editor never sees it. A
                // super admin's list carries it, flagged, so the tree can name
                // the rows it draws — the Patterns panel leaves it out for
                // everyone.
                $hidden = ($set['hide'] ?? false) === true;

                if ($hidden && ! $isSuper) {
                    continue;
                }

                // A static section has no fields on purpose. Empty Statamic
                // placeholders (`New Set` with no fields) are not insertable
                // section types — they would otherwise get their own card.
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
                    'image_url' => $images[$setHandle] ?? null,
                    'defaults' => static::defaults($blueprint, $handle, $setHandle),
                    'can_delete' => $canDelete,
                    // Markup only, nothing for an editor to fill in.
                    'static' => $static,
                    // Out of the picker; only a super admin is told.
                    'hidden' => $hidden,
                ];
            }
        }

        return $types;
    }

    /**
     * Every group of the page builder, in fieldset order — with or without
     * sections in it. The type map carries a group only on the sets it holds,
     * so a group just made in the fieldset had no chip in the library and no
     * place in the "New section" dialog until a section existed in it.
     *
     * @return list<array{handle: string, display: string, static: bool}>
     */
    public static function groups(?Blueprint $blueprint = null): array
    {
        $blueprint ??= static::defaultBlueprint();
        $list = $blueprint ? SectionField::listOf($blueprint) : SectionList::fallback();
        // The file, not the repository's copy: the repository memoises a
        // fieldset for the whole request, so a group made a moment ago in this
        // same request (storeGroup answers with the list) would be missing.
        $contents = $list->read();
        $sets = $contents === null ? null : $list->sets($contents);

        if ($sets === null) {
            return [];
        }

        $groups = [];

        foreach ($sets as $groupKey => $group) {
            if (! is_array($group) || ! isset($group['sets']) || ! is_array($group['sets'])) {
                continue;
            }

            $groups[] = [
                'handle' => (string) $groupKey,
                'display' => (string) ($group['display'] ?? $groupKey),
                'static' => (string) $groupKey === SectionTypeMaker::STATIC_GROUP,
            ];
        }

        return $groups;
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
    protected static function defaults(?Blueprint $blueprint, string $field, string $setHandle): array
    {
        if (! $setFields = static::setFields($blueprint, $field, $setHandle)) {
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
    protected static function setFields(?Blueprint $blueprint, string $field, string $setHandle): ?\Statamic\Fields\Fields
    {
        $replicator = $blueprint?->fields()->all()->get($field);

        return $replicator?->fieldtype()->fields($setHandle) ?: null;
    }

    /** The pages collection's page builder: the list a page with no blueprint to go by gets. */
    protected static function defaultBlueprint(): ?Blueprint
    {
        return PageBuilderBlueprint::for(Collection::findByHandle(
            config('statamic-visual-editor.previews.collection', 'pages')
        ));
    }
}
