<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\LiveReload;
use Symfony\Component\HttpFoundation\Response;

/**
 * Stamps every write the editor makes through its own `/!/sve/…` routes, so
 * live reload can tell the editor's saves from saves made outside it.
 *
 * Live Preview already renders what the dock's autosave, Site Files, a saved
 * component or a new section type just wrote. What it has to notice by
 * itself is a file saved from Cursor or VS Code over SSH, a deploy, any other
 * process. The poll's answer says which it is (`own`, see LiveReload::own),
 * and this is where the editor's side of that comes from: one middleware on
 * both route groups, so a write route added later is covered without
 * anybody remembering to stamp it.
 *
 * A request that does not write (GET, HEAD, OPTIONS: `isMethodSafe`) passes
 * untouched — the poll itself is one of them. Every other request is stamped
 * "writing" for its session before the route runs; after it, a 2xx stamps
 * the markup as it stands as the session's own, anything else takes the
 * "writing" stamp away again. A route that wrote no template is stamped all
 * the same: the markup it leaves is the markup it found, unless a save from
 * outside landed while it ran — the one case LiveReload::own() cannot tell.
 */
final class RecordEditorWrite
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethodSafe()) {
            return $next($request);
        }

        $session = $request->hasSession() ? $request->session()->getId() : null;

        LiveReload::writing($session);

        $response = $next($request);

        if ($response->isSuccessful()) {
            LiveReload::wrote($session);
        } else {
            LiveReload::writeFailed($session);
        }

        return $response;
    }
}
