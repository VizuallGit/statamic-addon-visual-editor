<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use MarioHamann\StatamicVisualEditor\BuiltAssets;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Serves the addon's own Vite build. Preview and overlay must not depend
 * on a published copy under public/vendor — that copy is what went missing.
 */
class BuiltAssetController
{
    public function show(string $path): Response
    {
        $path = str_replace('\\', '/', $path);

        if (! BuiltAssets::isAllowed($path)) {
            abort(404);
        }

        $file = BuiltAssets::root().'/'.$path;

        if (! is_file($file)) {
            abort(404);
        }

        return new BinaryFileResponse($file, 200, [
            'Content-Type' => $this->mime($file),
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
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
