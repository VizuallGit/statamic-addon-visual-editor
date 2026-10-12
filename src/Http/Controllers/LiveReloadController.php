<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\LiveReload;
use Statamic\Facades\User;

/**
 * The live-reload poll: has a template or the build changed since the page
 * was rendered? Asked by the public page's button and by Live Preview.
 *
 * A poll that names the signatures it holds (`?markup=…&build=…`) is held
 * open until something differs or the hold is over (LiveReload::await); one
 * that names none is answered at once, as before the hold existed.
 *
 * When the site's sources are newer than its build, the build starts *after*
 * this response is sent (PHP-FPM finishes the request first), so the poll
 * answers at once and the page can reload for the markup while the CSS is
 * still being built. The next polls see `building` until it is done.
 */
class LiveReloadController
{
    public function __invoke(Request $request)
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('live_reload'), 403);

        $session = $request->hasSession() ? $request->session()->getId() : null;
        $have = $this->have($request);

        if ($have === null) {
            $status = LiveReload::status($session);
        } else {
            $status = LiveReload::await($have, $session);
            $this->readSessionAgain($request);
        }

        if ($status['stale'] && ! $status['building']) {
            $sources = $status['sources'];
            app()->terminating(fn () => LiveReload::build($sources));
            $status['building'] = true;
        }

        unset($status['stale'], $status['sources']);

        return response()->json($status)->header('Cache-Control', 'no-store');
    }

    /**
     * The signatures the page holds, when it names both. `build` is '' while
     * the site has no build, and the web group's ConvertEmptyStringsToNull
     * hands that over as null — still a signature, or such a site would never
     * be held and its tabs would ask ten times a second.
     *
     * @return array{markup: string, build: string}|null
     */
    private function have(Request $request): ?array
    {
        if (! $request->query->has('markup') || ! $request->query->has('build')) {
            return null;
        }

        $markup = $request->query('markup');
        $build = $request->query('build');

        foreach ([$markup, $build] as $value) {
            if ($value !== null && ! is_string($value)) {
                return null;
            }
        }

        return ['markup' => (string) $markup, 'build' => (string) $build];
    }

    /**
     * Laravel writes the whole session back when a request ends, as the
     * request read it when it began. After a hold of seconds that copy is
     * old: whatever another request wrote meanwhile — the Control Panel's
     * site switch, a flash message, `last_activity` — would be overwritten
     * with what was there before. This poll writes nothing of its own, so it
     * reads the session again and what goes back is current, as it was when
     * the poll answered at once.
     */
    private function readSessionAgain(Request $request): void
    {
        if (! $request->hasSession()) {
            return;
        }

        $session = $request->session();
        $session->flush();
        $session->start();
    }
}
