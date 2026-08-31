<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Http\Request;
use Statamic\Contracts\Entries\Entry as EntryContract;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Symfony\Component\HttpFoundation\Response;

/**
 * The page a preview is rendered inside.
 *
 * A section template needs a real page around it — the layout, the globals, the
 * theme's CSS variables — so a published entry is borrowed as the shell and its
 * page-builder field swapped, in memory only, for the sections being previewed.
 *
 * The template is forced to the collection's own, and that is the part worth
 * knowing about: an entry may override its template (a home page that lists
 * something above its sections, say), and rendering the shell with that override
 * puts markup in front of the section being photographed. The generator captures
 * `main > *` — the first child — so it would photograph the override and every
 * preview on the site would come out showing the same wrong thing.
 */
class PreviewHost
{
    /**
     * Renders the given page-builder rows in the shell, as a front-end response.
     *
     * @param  EntryContract|null  $host  The entry to render inside. Pass the
     *                                    section's own entry where there is one:
     *                                    a section may read from the page around
     *                                    it (its title, its taxonomy), and any
     *                                    other shell would render that wrong.
     */
    public static function respond(Request $request, array $sections, ?EntryContract $host = null): Response
    {
        $host ??= static::page();

        abort_unless($host, 404);

        $host->blueprint();

        $field = config('statamic-visual-editor.previews.field', 'page_sections');

        $host->set($field, array_values($sections));

        if ($template = static::template()) {
            $host->template($template);
        }

        $response = $host->toResponse($request);

        // Belt and braces on top of the signature. These renders are a page's
        // sections without the page — duplicate content with no canonical — and
        // nothing should ever index them. They are unreachable without a
        // signature and unlinked from anywhere, so no crawler can find one; this
        // covers the case where a signed URL is pasted somewhere public before it
        // expires.
        $response->headers->set('X-Robots-Tag', 'noindex, nofollow, noarchive');

        return $response;
    }

    /**
     * Whether this request is one of the addon's preview renders — the documents a
     * screenshot is taken of.
     *
     * Matched on the path, not the route name, so middleware can ask before
     * routing has happened (`DisableViteHotReload` has to wrap Vite before the view
     * renders) and so it still answers for a request that ends up 404ing.
     */
    public static function isRenderRequest(Request $request): bool
    {
        $path = $request->decodedPath();

        // Cheapest possible first answer. This is asked on every front-end
        // request the site serves, and all but a handful are settled by these
        // eight characters.
        if (! str_starts_with($path, '!/sve/')) {
            return false;
        }

        return (bool) preg_match('#^!/sve/[a-z-]*preview#', $path);
    }

    /**
     * Live Preview of a collection index/show view — same document the dock
     * remorphs after a save. Not a screenshot route.
     */
    public static function isCollectionViewPreview(Request $request): bool
    {
        return str_starts_with($request->decodedPath(), '!/sve/collection-view-preview/');
    }

    /** Any published entry of the previews collection — purely a rendering shell. */
    public static function page(): ?EntryContract
    {
        $collection = config('statamic-visual-editor.previews.collection', 'pages');

        return Entry::query()
            ->where('collection', $collection)
            ->where('site', Site::default()->handle())
            ->where('published', true)
            ->first();
    }

    /**
     * The template to render the shell with: the configured one, else the
     * collection's — never the host entry's own, see the class docblock.
     */
    protected static function template(): ?string
    {
        if ($template = config('statamic-visual-editor.previews.template')) {
            return $template;
        }

        $collection = config('statamic-visual-editor.previews.collection', 'pages');

        return Collection::findByHandle($collection)?->template();
    }
}
