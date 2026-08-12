<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Foundation\Vite as LaravelVite;
use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\LivePreviewVite;
use MarioHamann\StatamicVisualEditor\PreviewHost;
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
 * Swapping the container binding rather than calling `Vite::useHotFile()` is the
 * point. Statamic's `{{ vite }}` tag clones the container instance and calls
 * `useHotFile(null)` on the clone whenever the tag has no `hot` parameter — and
 * `hotFile()` falls back to the real `public/hot` when the path is null, so the
 * setting is not merely lost, it is inverted. `LivePreviewVite` answers from the
 * class instead of from state, which a clone carries with it.
 *
 * Same condition as InjectBridgeScript on purpose — the dev client must be gone
 * from precisely the documents the bridge takes over.
 *
 * The preview render routes get the same treatment, for a different reason. A
 * screenshot has to show the site as it is built and deployed. Resolved through
 * the dev server, a preview taken while `npm run dev` runs would carry whatever
 * the working tree happened to hold, and one taken while it does not would carry
 * no CSS at all — an unstyled screenshot, which is what "the previews look
 * broken" turns out to mean. Reading from the build manifest makes a preview
 * reproducible and makes `npm run build` the moment the design changes, which is
 * exactly what the fingerprint watches.
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
        if ($this->isPreviewRender($request) || (Features::editorEnabled() && $this->isLivePreview($request))) {
            app()->instance(
                LaravelVite::class,
                LivePreviewVite::lock(app(LaravelVite::class), storage_path('framework/'.static::HOT_FILE))
            );
        }

        return $next($request);
    }

    protected function isLivePreview(Request $request): bool
    {
        return $request->isLivePreview();
    }

    /**
     * One of the addon's own render routes, the ones a screenshot is taken of.
     *
     * Not gated on `editorEnabled()`, unlike the Live Preview case: previews are
     * generated for the Add Set picker, which is Statamic's own and works whether
     * the editor is switched on or not.
     */
    protected function isPreviewRender(Request $request): bool
    {
        return PreviewHost::isRenderRequest($request);
    }
}
