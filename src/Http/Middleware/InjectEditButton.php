<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectEditButton\Button;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectEditButton\Head;
use Statamic\Facades\Data;
use Statamic\Facades\Site;
use Statamic\Facades\User;
use Statamic\Statamic;
use Symfony\Component\HttpFoundation\Response;

/**
 * Shows a small "Rediger" button on the front end for signed-in users who may
 * edit the current page. It links straight into the entry's Live Preview.
 *
 * STATIC CACHING: this middleware lives in the `web` group, which is route
 * middleware, while Statamic's static-cache middleware runs as *controller*
 * middleware (`statamic.web`) — so we always wrap it. On a cache miss the clean
 * page is cached first and we add the button on the way out; on a cache hit the
 * cached HTML bubbles back out through us and we add the button then. The button
 * therefore never ends up in the cache and anonymous visitors never see it, which
 * makes this safe with the `half` strategy.
 *
 * (With the `full` strategy the web server serves files directly and PHP never
 * runs, so no server-side injection is possible at all.)
 *
 * This middleware keeps the decision (`shouldInject`, `resolveEntry`) and
 * the injection; the HTML it injects lives in `InjectEditButton\Head` and
 * `InjectEditButton\Button`. Split in WP7d, code moved verbatim.
 */
class InjectEditButton
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $this->shouldInject($request, $response)) {
            return $response;
        }

        if (! $entry = $this->resolveEntry($request)) {
            return $response;
        }

        $user = User::current();

        if (! $user || ! $user->can('edit', $entry)) {
            return $response;
        }

        $content = $response->getContent();
        $pos = strrpos($content, '</body>');

        if ($pos === false) {
            return $response;
        }

        $content = substr_replace($content, Button::button($entry).'</body>', $pos, strlen('</body>'));

        $response->setContent(Head::head($content));

        return $response;
    }

    protected function shouldInject(Request $request, Response $response): bool
    {
        if (! Features::editorEnabled()) {
            return false;
        }

        if (! config('statamic-visual-editor.edit_button', true)) {
            return false;
        }

        if (! $request->isMethod('GET') || Statamic::isCpRoute() || $request->isLivePreview()) {
            return false;
        }

        // A performance reading. The button is only ever shown to signed-in
        // editors, so leaving it in would weigh a page no visitor is served —
        // and it is the panel doing the asking, not a person browsing.
        if ($request->query('sve_perf') !== null) {
            return false;
        }

        if ($response->getStatusCode() !== 200) {
            return false;
        }

        return str_contains((string) $response->headers->get('Content-Type'), 'text/html');
    }

    /** The entry behind the current URL, or null when the URL isn't an entry. */
    protected function resolveEntry(Request $request)
    {
        $path = $request->path();
        $uri = $path === '/' ? '/' : '/'.ltrim($path, '/');

        $data = Data::findByUri($uri, Site::current()->handle());

        if (! $data) {
            return null;
        }

        // Pages in a structure wrap the entry — unwrap so permissions resolve.
        if (method_exists($data, 'entry') && ($entry = $data->entry())) {
            return $entry;
        }

        return $data;
    }
}
