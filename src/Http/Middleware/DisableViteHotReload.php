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
 * Locks Vite's hot file for Live Preview, and strips the HMR client from
 * screenshot documents only.
 *
 * Live Preview must keep `@vite/client`. CSS `update` is how a newly written
 * utility shows up in the iframe while `npm run dev` is running, without a
 * reload. InjectBridgeScript swallows `full-reload` so that client does not
 * throw the editor out. Screenshots are a still frame — they must not sit on
 * HMR, or `sve:previews --watch` beside Vite photographs a document that is
 * about to reload.
 *
 * Swapping the container binding rather than calling `Vite::useHotFile()` is
 * the point. Statamic's `{{ vite }}` tag clones the container instance and
 * calls `useHotFile(null)` on the clone whenever the tag has no `hot`
 * parameter. `LivePreviewVite` answers from the class, which a clone carries.
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

        if ($this->isPreviewRender($request)) {
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
     * Not gated on the editor: previews are generated for the Add Set picker,
     * which is Statamic's own and works whether the editor is switched on or not.
     */
    protected function isPreviewRender(Request $request): bool
    {
        return PreviewHost::isRenderRequest($request);
    }
}
