<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;
use MarioHamann\StatamicVisualEditor\Features;
use Symfony\Component\HttpFoundation\Response;

/**
 * Keeps Vite's dev client out of the Live Preview document.
 *
 * With `npm run dev` running, Laravel's `@vite` directive emits @vite/client,
 * which full-reloads the page whenever a watched file changes. The preview is
 * not a page you reload: preview.js morphs it in place, and a reload throws the
 * editor out of whatever it was in the middle of — a header being edited, an
 * open global section — and can surface Chrome's "Reload site?" prompt.
 *
 * Pointing Vite at a hot file that does not exist makes it resolve assets from
 * the build manifest instead, exactly as in production. Only for this request:
 * the dev server keeps running and the front end outside the preview still hot
 * reloads normally.
 *
 * Same condition as InjectBridgeScript on purpose — the dev client must be gone
 * from precisely the documents the bridge takes over.
 */
class DisableViteHotReload
{
    /**
     * A name nothing writes. Vite treats an absent hot file as "not running",
     * which is the whole mechanism — if this ever names a real file, the dev
     * client comes back.
     */
    protected const HOT_FILE = 'vite-live-preview.hot';

    public function handle(Request $request, Closure $next): Response
    {
        // Before $next(): the view renders inside it, and by then @vite has
        // already decided. isLivePreview() reads the token straight off the
        // query string or the X-Statamic-Token header, so it answers correctly
        // this early — no middleware has to have run first.
        if (Features::editorEnabled() && $this->isLivePreview($request)) {
            Vite::useHotFile(storage_path('framework/'.static::HOT_FILE));
        }

        return $next($request);
    }

    protected function isLivePreview(Request $request): bool
    {
        return $request->isLivePreview();
    }
}
