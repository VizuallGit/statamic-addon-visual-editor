<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\BuiltAssets;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Serves the addon's own Vite build. Preview and overlay must not depend
 * on a published copy under public/vendor — that copy is what went missing.
 *
 * The files are hashed, so a year of `immutable` is right. For the loads
 * that revalidate anyway — a hard reload, DevTools with its cache off — the
 * response carries an ETag and Last-Modified, and a matching request gets a
 * 304 with no body instead of the chunk again.
 */
class BuiltAssetController
{
    public function show(Request $request, string $path): Response
    {
        $path = str_replace('\\', '/', $path);

        if (! BuiltAssets::isAllowed($path)) {
            abort(404);
        }

        $file = BuiltAssets::root().'/'.$path;

        if (! is_file($file)) {
            abort(404);
        }

        $response = new BinaryFileResponse($file, 200, [
            'Content-Type' => $this->mime($file),
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);

        $response->setAutoEtag();
        $response->setAutoLastModified();
        $response->isNotModified($request);

        return $response;
    }

    protected function mime(string $file): string
    {
        return match (strtolower((string) pathinfo($file, PATHINFO_EXTENSION))) {
            'js' => 'text/javascript; charset=utf-8',
            'css' => 'text/css; charset=utf-8',
            'json' => 'application/json; charset=utf-8',
            'map' => 'application/json; charset=utf-8',
            default => 'application/octet-stream',
        };
    }
}
