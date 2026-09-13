<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SchemaStore;
use Statamic\Facades\URL;

/**
 * Writes the page's structured data in before `</body>`.
 *
 * On the rendered site, for everyone — a search engine is the audience, so it
 * cannot be gated on being logged in. Skipped in Live Preview: the preview is
 * for seeing the page, and JSON-LD has nothing to see.
 *
 * The JSON is re-encoded from a parsed value when it is saved (see
 * SchemaStore::validate), and `</` is escaped on the way out so a string inside
 * the data can never close the script tag early.
 */
class InjectSchema
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (! Features::enabled('schema') || ! $this->wantsHtml($response)) {
            return $response;
        }

        // Live Preview and the editor's own preview routes render the page for
        // a person, not for a crawler.
        if ($request->query('live-preview') || str_starts_with($request->path(), '!/sve/')) {
            return $response;
        }

        $blocks = SchemaStore::forPage($this->entryId($request));

        if ($blocks === []) {
            return $response;
        }

        $content = $response->getContent();

        if (! is_string($content) || ! str_contains($content, '</body>')) {
            return $response;
        }

        $tags = '';

        foreach ($blocks as $json) {
            $safe = str_replace(['</', '<!--'], ['<\/', '<\!--'], $json);
            $tags .= "\n<script type=\"application/ld+json\">".$safe."</script>";
        }

        $position = strrpos($content, '</body>');

        $response->setContent(
            substr($content, 0, $position).$tags."\n".substr($content, $position)
        );

        return $response;
    }

    /** The entry this URL rendered, so its own block can be found. */
    protected function entryId(Request $request): ?string
    {
        $data = $request->route()?->parameter('data');

        if (is_object($data) && method_exists($data, 'id')) {
            return (string) $data->id();
        }

        // Statamic resolves the entry into the view, not always into the route.
        $uri = '/'.ltrim($request->path(), '/');
        $entry = \Statamic\Facades\Entry::findByUri($uri === '//' ? '/' : $uri);

        return $entry?->id() ? (string) $entry->id() : null;
    }

    protected function wantsHtml($response): bool
    {
        if (! method_exists($response, 'getContent') || ! method_exists($response, 'headers')) {
            return false;
        }

        $type = $response->headers->get('Content-Type', '');

        return $type === '' || str_contains($type, 'text/html');
    }
}
