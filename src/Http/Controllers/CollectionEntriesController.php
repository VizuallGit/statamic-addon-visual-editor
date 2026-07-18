<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Statamic\Facades\User;

/**
 * The entries you can jump to from inside Live Preview.
 *
 * Fetched per collection rather than shipped with the page: a site's entries can
 * run to thousands, and the picker only ever needs the one collection you've
 * just opened.
 */
class CollectionEntriesController
{
    /** Enough to fill a picker; past this, the search field is the better tool. */
    protected const LIMIT = 500;

    public function __invoke(Request $request, string $collection)
    {
        $user = User::current();

        abort_unless($user, 403);

        $handle = Collection::findByHandle($collection);

        abort_unless($handle, 404);
        abort_unless($user->can('edit', $handle), 403);

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        $entries = Entry::query()
            ->where('collection', $collection)
            ->where('site', $site)
            ->limit(static::LIMIT)
            ->get()
            ->map(fn ($entry) => [
                'id' => $entry->id(),
                // Fall back to the slug: a title is only required by convention.
                'title' => $entry->value('title') ?: $entry->slug(),
                'published' => (bool) $entry->published(),
            ])
            ->sortBy('title', SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();

        return response()->json(['entries' => $entries]);
    }
}
