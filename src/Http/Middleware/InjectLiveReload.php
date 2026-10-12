<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\BuiltAssets;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectLiveReload\Widget;
use MarioHamann\StatamicVisualEditor\LiveReload;
use RuntimeException;
use Statamic\Statamic;
use Symfony\Component\HttpFoundation\Response;

/**
 * Puts the live-reload button on front-end pages for the people the settings
 * name (`live_reload` + `live_reload_access`, super admins by default).
 *
 * STATIC CACHING: same place as InjectEditButton — the `web` group wraps
 * Statamic's static-cache middleware, so the button is added on the way out
 * of a miss *and* of a hit and never reaches the cache. With the `full`
 * strategy PHP does not run for cached pages and there is no button.
 *
 * Not while `npm run dev` runs: Vite reloads the page itself then.
 */
class InjectLiveReload
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $this->shouldInject($request, $response)) {
            return $response;
        }

        $content = $response->getContent();
        $pos = strrpos($content, '</body>');

        if ($pos === false) {
            return $response;
        }

        $response->setContent(
            substr_replace($content, Widget::html(LiveReload::page(), $this->morphUrl()).'</body>', $pos, strlen('</body>'))
        );

        return $response;
    }

    /**
     * Alpine's morph for the button, from the addon's build. A build without
     * it (older than the button's morph) leaves the button reloading the page.
     */
    protected function morphUrl(): ?string
    {
        try {
            return BuiltAssets::url('resources/js/live-reload-morph.js');
        } catch (RuntimeException) {
            return null;
        }
    }

    protected function shouldInject(Request $request, Response $response): bool
    {
        if (! Features::editorEnabled()) {
            return false;
        }

        if (! $request->isMethod('GET') || Statamic::isCpRoute() || $request->isLivePreview()) {
            return false;
        }

        // A performance reading weighs the page a visitor gets.
        if ($request->query('sve_perf') !== null) {
            return false;
        }

        if ($response->getStatusCode() !== 200) {
            return false;
        }

        if (! str_contains((string) $response->headers->get('Content-Type'), 'text/html')) {
            return false;
        }

        if (LiveReload::hot()) {
            return false;
        }

        // Last: the only check that reads the signed-in user.
        return Features::allows('live_reload');
    }
}
