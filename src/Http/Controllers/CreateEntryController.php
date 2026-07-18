<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Statamic\Contracts\Entries\Entry as EntryContract;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Statamic\Facades\User;

/**
 * Creates an entry from inside Live Preview, from nothing but a title and a slug.
 *
 * The Control Panel's own create screen is a full form, and going there means
 * leaving the preview — which is the one thing this whole picker exists to avoid.
 * A new page has nothing on it worth filling in from a form anyway: you make it,
 * you land in it, and you build it visually from there.
 *
 * Deliberately not validated against the blueprint. Required fields are about a
 * finished page, and this one is a starting point — the entry is created bare and
 * the editor fills it in. Statamic's own save path applies validation when you
 * actually save it.
 */
class CreateEntryController
{
    public function __invoke(Request $request, string $collection)
    {
        $user = User::current();

        abort_unless($user, 403);

        $handle = Collection::findByHandle($collection);

        abort_unless($handle, 404);
        abort_unless($user->can('create', [EntryContract::class, $handle]), 403);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
        ]);

        $site = Site::selected()?->handle() ?? Site::default()->handle();
        $slug = Str::slug($data['slug'] ?: $data['title']);

        if ($slug === '') {
            return response()->json(['message' => __('sve::messages.slug_invalid')], 422);
        }

        // A clash would be rejected on save with a message from deep inside
        // Statamic; caught here it's answerable in the dialog that asked.
        $taken = Entry::query()
            ->where('collection', $collection)
            ->where('site', $site)
            ->where('slug', $slug)
            ->count() > 0;

        if ($taken) {
            return response()->json(['message' => __('sve::messages.slug_taken', ['slug' => $slug])], 422);
        }

        $entry = Entry::make()
            ->collection($handle)
            ->locale($site)
            ->slug($slug)
            ->published($handle->defaultPublishState())
            ->data(['title' => $data['title']]);

        // A dated collection has nowhere to put an entry without one, and it
        // decides the URL — so it can't be left for later.
        if ($handle->dated()) {
            $entry->date(now());
        }

        $entry->save();

        return response()->json(['id' => $entry->id()]);
    }
}
