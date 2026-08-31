<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\PreviewHost;
use Statamic\StaticCaching\Cacher;
use Statamic\StaticCaching\Cachers\NullCacher;
use Statamic\StaticCaching\StaticCacheManager;
use Symfony\Component\HttpFoundation\Response;

/**
 * Live Preview (and addon preview renders) never read or write Statamic's
 * static cache. The public site keeps whatever strategy is in `.env` — typically
 * `half`.
 *
 * Statamic already skips cache when a token is on the request. This rebinds the
 * cacher to `null` for the rest of the request so a half/full frontend cannot
 * serve a cached page into the iframe, or store a one-section preview HTML as
 * the public page.
 */
class DisableStaticCacheInLivePreview
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->shouldDisable($request)) {
            return $next($request);
        }

        $app = app();

        $app->bind(Cacher::class, fn () => new NullCacher);

        try {
            return $next($request);
        } finally {
            $app->bind(Cacher::class, function ($app) {
                return $app[StaticCacheManager::class]->driver();
            });
        }
    }

    protected function shouldDisable(Request $request): bool
    {
        if ($request->isLivePreview()) {
            return true;
        }

        return PreviewHost::isRenderRequest($request)
            || PreviewHost::isCollectionViewPreview($request);
    }
}
