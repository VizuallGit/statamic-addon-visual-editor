<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers\SavedSectionsController;

use Illuminate\Support\Str;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;

/**
 * A saved section's rows: as the publish form wants them, as they are
 * stored, and with ids on every row.
 * Moved verbatim out of SavedSectionsController in WP7d.
 */
final class Rows
{
    /** The page-builder field a section is stored in (shared with the previews config). */
    public static function field(): string
    {
        return config('statamic-visual-editor.previews.field', 'page_sections');
    }

    /**
     * Turns Control Panel values into storage values, the way an ordinary entry
     * save does.
     *
     * The section arrives as the publish form holds it, and the two shapes are not
     * the same: an assets field carries `assets::photo.jpg` in the form and
     * `photo.jpg` on disk. Writing the form's shape straight into an entry — which
     * `Entry::data()` does, since it never sees a fieldtype — leaves a value
     * nothing can resolve afterwards. The section then renders with no image at
     * all, which is what a preview of it shows: an empty frame.
     *
     * Running it through the page-builder field is the same pass Statamic makes on
     * every save, and it recurses through the sets, so every fieldtype gets its
     * own say rather than this having to know about assets in particular.
     */
    public static function processed(array $sections, string $collection): array
    {
        $field = Collection::findByHandle($collection)
            ?->entryBlueprint()
            ?->field(static::field());

        if (! $field) {
            return $sections;
        }

        try {
            $value = $field->setValue($sections)->process()->value();
        } catch (\Throwable $e) {
            // A missing asset makes Statamic throw here. Keeping the raw values is
            // better than refusing the save: the section is still saved, and the
            // worst of it is a preview drawn without the picture that has gone.
            return $sections;
        }

        return is_array($value) ? $value : $sections;
    }

    /**
     * Storage values → Control Panel values, so a custom insert can be dropped
     * into the publish form. The inverse of processed().
     *
     * Saved YAML has `id` (not `_id`) and asset paths as stored on disk. The
     * Replicator keys field meta by `_id`; without this pass the sidebar has
     * values it cannot render.
     */
    public static function forPublishForm(?array $section, string $collection): ?array
    {
        if (! $section) {
            return $section;
        }

        $field = Collection::findByHandle($collection)
            ?->entryBlueprint()
            ?->field(static::field());

        if (! $field) {
            return $section;
        }

        try {
            $value = $field->fieldtype()->preProcess([$section]);
        } catch (\Throwable $e) {
            return $section;
        }

        return is_array($value) && isset($value[0]) && is_array($value[0])
            ? $value[0]
            : $section;
    }

    /** The raw first section stored on a saved-section entry. */
    public static function sectionOf(\Statamic\Contracts\Entries\Entry $entry): ?array
    {
        $sections = $entry->value(static::field());

        return is_array($sections) && isset($sections[0]) ? $sections[0] : null;
    }

    /**
     * Every replicator/grid row needs a stable `id` for preview scope attributes.
     */
    public static function ensureRowIds(mixed $node): mixed
    {
        if (is_array($node)) {
            $isList = array_is_list($node);

            foreach ($node as $key => $value) {
                $node[$key] = static::ensureRowIds($value);
            }

            if (! $isList
                && isset($node['type'])
                && is_string($node['type'])
                && $node['type'] !== ''
                && empty($node['id'])
                && empty($node['_id'])
                && (array_key_exists('enabled', $node) || array_key_exists('blocks', $node) || str_contains($node['type'], '/'))
            ) {
                $node['id'] = Str::lower(Str::random(12));
            }
        }

        return $node;
    }
}
