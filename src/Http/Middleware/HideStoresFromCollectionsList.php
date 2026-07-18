<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Takes the editor's own stores off the Control Panel's Collections page.
 *
 * The nav can be extended, so moving them out of the sidebar is supported and
 * clean (see the ServiceProvider). This page is not: it is an Inertia component,
 * and its list is built inside Statamic's own controller as a prop. There is no
 * view to compose and no filter to hook — and permissions can't do it either,
 * because the filter short-circuits on `configure collections`, which every super
 * user has.
 *
 * So the response is rewritten on the way out. That means this depends on the
 * shape of somebody else's prop, and it is the first thing to check if the
 * Collections page ever looks wrong after a Statamic upgrade. It is written to
 * fail open: anything unexpected and it leaves the response exactly as it found
 * it, so the worst case is the two rows coming back — never a broken page.
 */
class HideStoresFromCollectionsList
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $request->routeIs('statamic.cp.collections.index')) {
            return $response;
        }

        $stores = [
            config('statamic-visual-editor.saved_sections.collection', 'saved_sections'),
            config('statamic-visual-editor.templates.collection', 'saved_templates'),
        ];

        // The listing table asks for its rows as JSON; the page itself arrives as
        // an Inertia payload. Same list, two shapes.
        if ($response instanceof JsonResponse) {
            return $this->filterJson($response, $stores);
        }

        return $this->filterInertiaPage($response, $stores);
    }

    /** `{ data: [ … ], meta: … }` — the table's own fetch. */
    protected function filterJson(JsonResponse $response, array $stores): Response
    {
        $payload = $response->getData(true);

        if (isset($payload['data']) && is_array($payload['data'])) {
            $payload['data'] = $this->reject($payload['data'], $stores);
        }

        // An Inertia visit answers as JSON too, with the props nested.
        if (isset($payload['props']['collections']) && is_array($payload['props']['collections'])) {
            $payload['props']['collections'] = $this->reject($payload['props']['collections'], $stores);
        }

        return $response->setData($payload);
    }

    /** The first load: the payload rides in `data-page` on the app element. */
    protected function filterInertiaPage(Response $response, array $stores): Response
    {
        $html = $response->getContent();

        if (! is_string($html) || ! str_contains($html, 'data-page=')) {
            return $response;
        }

        $replaced = preg_replace_callback(
            '/data-page="([^"]*)"/',
            function ($matches) use ($stores) {
                $page = json_decode(html_entity_decode($matches[1], ENT_QUOTES), true);

                if (! is_array($page) || ! isset($page['props']['collections']) || ! is_array($page['props']['collections'])) {
                    return $matches[0]; // not the shape we know — leave it alone
                }

                $page['props']['collections'] = $this->reject($page['props']['collections'], $stores);

                return 'data-page="'.htmlspecialchars(json_encode($page), ENT_QUOTES).'"';
            },
            $html,
            1
        );

        return $replaced === null ? $response : $response->setContent($replaced);
    }

    /** Statamic keys each row by the collection handle. */
    protected function reject(array $rows, array $stores): array
    {
        return array_values(array_filter(
            $rows,
            fn ($row) => ! (is_array($row) && in_array($row['id'] ?? null, $stores, true))
        ));
    }
}
