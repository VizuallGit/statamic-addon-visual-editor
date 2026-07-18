<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Statamic\Facades\Entry;
use Statamic\Facades\User;

/**
 * Holds a saved section's unsaved values while it's being edited in the panel
 * beside a page's Live Preview, so the page's preview can render the section as
 * it's being typed rather than as it sits on disk.
 *
 * Mirrors GlobalsPreviewController: kept per session (the preview render is a
 * separate front-end request from the same browser) and expiring on its own, so
 * an in-progress edit can never leak into anyone else's preview or outlive the
 * editing session by much.
 */
class GlobalSectionStashController
{
    public static function cacheKey(Request $request): string
    {
        return 'sve-global-sections.'.$request->session()->getId();
    }

    public function store(Request $request)
    {
        $user = User::current();

        abort_unless($user, 403);

        $id = (string) $request->input('id');
        $entry = Entry::find($id);
        $collection = config('statamic-visual-editor.saved_sections.collection', 'saved_sections');

        abort_unless($entry && $entry->collectionHandle() === $collection, 404);
        abort_unless($user->can('edit', $entry), 403);

        $key = static::cacheKey($request);
        $stash = Cache::get($key, []);

        $stash[$id] = $request->input('values', []);

        Cache::put($key, $stash, now()->addHour());

        return response()->json(['ok' => true]);
    }

    /** Editing finished — the preview goes back to the saved section. */
    public function clear(Request $request)
    {
        abort_unless(User::current(), 403);

        Cache::forget(static::cacheKey($request));

        return response()->json(['ok' => true]);
    }
}
