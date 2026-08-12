<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\PreviewHost;
use Symfony\Component\HttpFoundation\Response;

/**
 * Loads every image at once in a preview render, so the screenshot has them.
 *
 * `loading="lazy"` is right for the site and wrong for a camera. A browser holds
 * a lazy image back until it approaches the viewport, and a section photographed
 * on its own is mostly below the fold — so the picture comes out with holes where
 * the images should be, or with some of them, depending on how the timing fell.
 * Which is the difference between "the previews look broken sometimes" and a
 * preview you can trust.
 *
 * Only the signed render routes are touched. The site's own pages keep lazy
 * loading exactly as written.
 */
class EagerImagesInPreview
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! PreviewHost::isRenderRequest($request)) {
            return $response;
        }

        $content = $response->getContent();

        if (! is_string($content) || ! str_contains($content, 'loading=')) {
            return $response;
        }

        $response->setContent(preg_replace(
            '/\bloading=(["\'])lazy\1/i',
            'loading=$1eager$1',
            $content
        ));

        return $response;
    }
}
