<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\Boot\ScriptChrome;
use MarioHamann\StatamicVisualEditor\LayoutSlots;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;
use Statamic\Facades\User;

/**
 * The layout's places for the Patterns panel: read them, put a header, a
 * footer or a global section in, take one out. {@see LayoutSlots}
 *
 * A write is a save of the global set, as pressing Save on it would be — it
 * reaches every page at once, the way an edit to the layout file in the dock
 * does. Who may write is who may edit that global set.
 */
class LayoutSlotsController
{
    public function index(Request $request)
    {
        abort_unless(User::current(), 403);

        return response()->json(['slots' => LayoutSlots::describe(static::site($request))]);
    }

    public function store(Request $request)
    {
        $slot = (string) $request->input('slot', '');
        $value = trim((string) $request->input('value', ''));

        static::authorize($slot);
        abort_if($value === '', 400);

        $error = LayoutSlots::add($slot, $value, static::site($request));

        if ($error !== null) {
            return response()->json(['error' => $error, 'slots' => LayoutSlots::describe(static::site($request))], 422);
        }

        return static::changed($request, $slot);
    }

    public function destroy(Request $request)
    {
        $slot = (string) $request->input('slot', '');
        $id = (string) $request->input('id', '');

        static::authorize($slot);
        abort_if($id === '', 400);

        if (! LayoutSlots::remove($slot, $id, static::site($request))) {
            return response()->json(['error' => 'gone', 'slots' => LayoutSlots::describe(static::site($request))], 422);
        }

        return static::changed($request, $slot);
    }

    /**
     * What changed, and the dock's file for each half: a header that changed
     * set is drawn by another partial, and the dock opens that one next time
     * you step into the header.
     *
     * The unsaved values this session last typed into that global set are
     * dropped from Live Preview's override: they were typed into the rows that
     * were there before, and would draw over what was just saved.
     */
    private static function changed(Request $request, string $slot)
    {
        if ($request->hasSession() && ($handle = LayoutSlots::setOf($slot))) {
            $key = GlobalsPreviewController::cacheKey($request);
            $overrides = Cache::get($key, []);

            if (is_array($overrides) && array_key_exists($handle, $overrides)) {
                unset($overrides[$handle]);
                Cache::put($key, $overrides, now()->addHour());
            }
        }

        ScriptChrome::flush();

        return response()->json([
            'ok' => true,
            'slots' => LayoutSlots::describe(static::site($request)),
            'chrome_templates' => ScriptChrome::templates(),
        ]);
    }

    private static function authorize(string $slot): void
    {
        $user = User::current();
        $set = ($handle = LayoutSlots::setOf($slot)) ? GlobalSet::findByHandle($handle) : null;

        abort_unless($user && $set, 403);
        abort_unless($user->can('edit', $set), 403);
    }

    private static function site(Request $request): string
    {
        $site = (string) $request->input('site', '');

        return Site::get($site)?->handle() ?? Site::selected()?->handle() ?? Site::default()->handle();
    }
}
