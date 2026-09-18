<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTemplateController;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\TailwindCompile;
use MarioHamann\StatamicVisualEditor\TailwindStore;
use Statamic\Facades\StaticCache;

/**
 * What happens after a save: the baked Tailwind CSS is written and the
 * static cache is flushed so visitors see the change.
 * Moved verbatim out of SectionTemplateController in WP7d.
 */
final class Persist
{
    /** Only when the site caches at all; a failure to clear is reported, not fatal. */
    public static function flushStaticCache(): void
    {
        if (! config('statamic.static_caching.strategy')) {
            return;
        }

        try {
            StaticCache::flush();
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * CSS for `{{ sve_tw }}` on the public site — no Vite, no `npm run dev`.
     *
     * The dock already ran Tailwind's own engine in the Control Panel. That
     * sheet is written here on every environment, including production, so a
     * site developed on the server gets the same utilities as Live Preview.
     * Node on the server is only the fallback when the dock did not send CSS
     * (an older tab). Spawning Node on every keystroke is not the paint path.
     */
    /** @return bool|null null when there was nothing to persist; false when the CSS did not reach disk */
    public static function persistTw(string $twHandle, string $html, Request $request): ?bool
    {
        if (! Features::enabled('tailwind_dock') || $twHandle === '') {
            return null;
        }

        $tw = $request->input('tw');

        if ($request->exists('tw') && is_string($tw)) {
            return TailwindStore::write($twHandle, $tw);
        }

        if (app()->environment('local')) {
            return null;
        }

        try {
            return TailwindStore::write($twHandle, TailwindCompile::fromHtml($html));
        } catch (\Throwable $e) {
            report($e);

            return false;
        }
    }
}
