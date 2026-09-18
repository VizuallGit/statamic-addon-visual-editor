<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers\SavedSectionsController;

use Statamic\Facades\Entry;

/**
 * The collection saved sections live in, and one entry in it or a 404.
 * Moved verbatim out of SavedSectionsController in WP7d.
 */
final class Store
{
    /** The collection saved sections live in — configurable, never assumed. */
    public static function collection(): string
    {
        return config('statamic-visual-editor.saved_sections.collection', 'saved_sections');
    }

    /** The saved section, or a 404 — never another collection's entry. */
    public static function findOrFail(string $id): \Statamic\Contracts\Entries\Entry
    {
        $entry = Entry::find($id);

        abort_unless($entry && $entry->collectionHandle() === static::collection(), 404);

        return $entry;
    }
}
