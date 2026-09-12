<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Statamic\Facades\User;

/**
 * The pages a link prop can point at.
 *
 * A prop value is a partial parameter, and a parameter is a string — so what a
 * link prop holds is the page's URL, not a reference to it. That is the whole
 * reason this list exists: nobody should have to remember that "Om os" lives
 * at `/om-os`, and a URL typed from memory is a URL that is wrong.
 *
 * Only collections that have a route are asked. An entry in a collection with
 * no route has no URL to give, so offering it would be offering a dead link.
 */
class LinkTargetsController
{
    /** Enough to fill a menu. A site past this needs a search field, not a list. */
    protected const LIMIT = 300;

    public function __invoke()
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('template_dock'), 403);

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        $handles = Collection::all()
            ->filter(fn ($collection) => (bool) $collection->route($site))
            ->map->handle()
            ->values()
            ->all();

        if ($handles === []) {
            return response()->json(['pages' => []]);
        }

        $pages = Entry::query()
            ->whereIn('collection', $handles)
            ->where('site', $site)
            ->limit(static::LIMIT)
            ->get()
            ->map(fn ($entry) => [
                'title' => $entry->value('title') ?: $entry->slug(),
                'url' => $entry->url(),
                'collection' => $entry->collection()->handle(),
            ])
            // A draft still has a URL and is still worth pointing at; an entry
            // whose route came out empty is not.
            ->filter(fn ($page) => is_string($page['url']) && $page['url'] !== '')
            ->sortBy('title', SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();

        return response()->json(['pages' => $pages]);
    }
}
