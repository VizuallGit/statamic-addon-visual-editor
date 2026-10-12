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
 *
 * Except the editor's requests that never write a template (NEVER_MARKUP).
 * Some come by themselves — Patterns asks every five seconds while it is
 * open — and stamped, one in the air when a file was saved from outside made
 * that save the editor's own: Live Preview then showed nothing at all, no
 * paint and no render (measured on Cuben, 12 October 2026).
 */
final class RecordEditorWrite
{
    /**
     * Paths under `/!/sve/` whose requests write no template and are sent by
     * a timer, not a click: Patterns' staleness tick, Live Preview's stashes
     * of unsaved globals and global sections, the comments' pruning (with the
     * rest of the comments routes). A route missing here is stamped as before
     * — the safe side for the dock, whose own saves must never come back to
     * it as someone else's.
     */
    private const NEVER_MARKUP = [
        'previews/tick',
        'globals-preview',
        'global-section-stash',
        'comments/',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethodSafe() || $this->writesNoMarkup($request)) {
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

    private function writesNoMarkup(Request $request): bool
    {
        $path = ltrim($request->path(), '/');

        foreach (self::NEVER_MARKUP as $prefix) {
            if (str_starts_with($path, '!/sve/'.$prefix)) {
                return true;
            }
        }

        return false;
    }
}
