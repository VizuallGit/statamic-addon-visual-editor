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
            substr_replace($content, Widget::html(LiveReload::page(), $this->builtUrl('resources/js/live-reload-morph.js'), $this->tailwindUrl()).'</body>', $pos, strlen('</body>'))
        );

        return $response;
    }

    /**
     * The dock's Tailwind compiler, for a class the site's build has not made
     * yet. Its theme route is the dock's (`template_dock`), so only people who
     * have the dock get it; the others wait for the build as before.
     */
    protected function tailwindUrl(): ?string
    {
        return Features::allows('template_dock') ? $this->builtUrl('resources/js/tw-compile.js') : null;
    }

    /**
     * A file from the addon's build: Alpine's morph for the button, the dock's
     * compiler. A build without it leaves the button doing without — a reload,
     * a wait for the site's build.
     */
    protected function builtUrl(string $entry): ?string
    {
        try {
            return BuiltAssets::url($entry);
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
