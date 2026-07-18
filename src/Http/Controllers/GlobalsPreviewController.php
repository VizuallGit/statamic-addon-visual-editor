<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\User;

/**
 * Holds the unsaved values of a global set while it's being edited beside Live
 * Preview, so the preview render can use them instead of what's on disk.
 *
 * The values are kept per session (the preview render is a separate front-end
 * request from the same browser) and expire on their own, so nothing can leak
 * into anyone else's preview — or outlive the editing session for long.
 */
class GlobalsPreviewController
{
    public static function cacheKey(Request $request): string
    {
        return 'sve-globals-preview.'.$request->session()->getId();
    }

    public function store(Request $request)
    {
        $user = User::current();

        abort_unless($user, 403);

        $handle = (string) $request->input('handle');
        $set = GlobalSet::findByHandle($handle);

        abort_unless($set, 404);
        abort_unless($user->can('edit', $set), 403);

        $key = static::cacheKey($request);
        $overrides = Cache::get($key, []);

        $overrides[$handle] = $request->input('values', []);

        Cache::put($key, $overrides, now()->addHour());

        return response()->json(['ok' => true]);
    }

    /** Editing finished — the preview goes back to the saved globals. */
    public function clear(Request $request)
    {
        abort_unless(User::current(), 403);

        Cache::forget(static::cacheKey($request));

        return response()->json(['ok' => true]);
    }
}
