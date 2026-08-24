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
 * Keeps Vite's HMR client out of Live Preview and screenshot documents.
 *
 * The documents still resolve CSS/JS from the Vite server while `npm run dev`
 * (or `npm run dev:previews`) is running — a new utility class must not wait
 * for `npm run build`. What is stripped is `@vite/client`: that script
 * full-reloads the page on a watched file, and the preview is not a page you
 * reload. preview.js morphs it in place; a reload throws the editor out of
 * whatever it was in the middle of and can surface Chrome's "Reload site?".
 *
 * Screenshot routes get the same treatment so `sve:previews --watch` beside
 * Vite photographs what the working tree actually looks like, not the last
 * production build.
 *
 * Swapping the container binding rather than calling `Vite::useHotFile()` is
 * the point. Statamic's `{{ vite }}` tag clones the container instance and
 * calls `useHotFile(null)` on the clone whenever the tag has no `hot`
 * parameter. `LivePreviewVite` answers from the class, which a clone carries.
 *
 * Same condition as InjectBridgeScript on purpose — the client must be gone
 * from precisely the documents the bridge takes over.
 */
class DisableViteHotReload
{
    public function handle(Request $request, Closure $next): Response
    {
        // Before $next(): the view renders inside it, and by then @vite has
        // already decided. isLivePreview() reads the token straight off the
        // query string or the X-Statamic-Token header, so it answers correctly
        // this early — no middleware has to have run first.
        if ($this->isPreviewRender($request) || (Features::editorEnabled() && $this->isLivePreview($request))) {
            $vite = app(LaravelVite::class);

            if (! $vite instanceof LivePreviewVite) {
                app()->instance(
                    LaravelVite::class,
                    LivePreviewVite::lock($vite, $vite->hotFile())
                );
            }
        }

        $response = $next($request);

        if ($this->isPreviewRender($request) || (Features::editorEnabled() && $this->isLivePreview($request))) {
            $this->stripClientFromResponse($response);
        }

        return $response;
    }

    protected function stripClientFromResponse(Response $response): void
    {
        if (! method_exists($response, 'getContent') || ! method_exists($response, 'setContent')) {
            return;
        }

        $content = $response->getContent();

        if (! is_string($content) || ! str_contains($content, '@vite/client')) {
            return;
        }

        $response->setContent(LivePreviewVite::stripClientScript($content));
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
