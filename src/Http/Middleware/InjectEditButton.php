<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Statamic\Facades\Data;
use Statamic\Facades\Site;
use Statamic\Facades\User;
use Statamic\Statamic;
use Symfony\Component\HttpFoundation\Response;

/**
 * Shows a small "Rediger" button on the front end for signed-in users who may
 * edit the current page. It links straight into the entry's Live Preview.
 *
 * STATIC CACHING: this middleware lives in the `web` group, which is route
 * middleware, while Statamic's static-cache middleware runs as *controller*
 * middleware (`statamic.web`) — so we always wrap it. On a cache miss the clean
 * page is cached first and we add the button on the way out; on a cache hit the
 * cached HTML bubbles back out through us and we add the button then. The button
 * therefore never ends up in the cache and anonymous visitors never see it, which
 * makes this safe with the `half` strategy.
 *
 * (With the `full` strategy the web server serves files directly and PHP never
 * runs, so no server-side injection is possible at all.)
 */
class InjectEditButton
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $this->shouldInject($request, $response)) {
            return $response;
        }

        if (! $entry = $this->resolveEntry($request)) {
            return $response;
        }

        $user = User::current();

        if (! $user || ! $user->can('edit', $entry)) {
            return $response;
        }

        $content = $response->getContent();
        $pos = strrpos($content, '</body>');

        if ($pos === false) {
            return $response;
        }

        $content = substr_replace($content, $this->button($entry).'</body>', $pos, strlen('</body>'));

        $response->setContent($this->head($content));

        return $response;
    }

    /**
     * Sits in <head> so it runs before the first paint: when we come back from the
     * editor after a save the page has to reload to show the new content, and this
     * stops every entrance animation from replaying on the way in. Durations are
     * collapsed rather than removed so animations still apply their end state.
     */
    protected function head(string $content): string
    {
        $pos = stripos($content, '</head>');

        if ($pos === false) {
            return $content;
        }

        $head = <<<'HTML'
        <style id="sve-noanim">
            html.sve-noanim, html.sve-noanim *, html.sve-noanim *::before, html.sve-noanim *::after {
                animation-duration: 1ms !important;
                animation-delay: 0ms !important;
                transition-duration: 1ms !important;
                transition-delay: 0ms !important;
            }
        </style>
        <script>
        (function () {
            var flag;
            try { flag = sessionStorage.getItem('sve-noanim'); sessionStorage.removeItem('sve-noanim'); } catch (e) {}
            if (!flag) return;

            var root = document.documentElement;
            root.classList.add('sve-noanim');

            var released = false;
            function release() {
                if (released) return;
                released = true;
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () { root.classList.remove('sve-noanim'); });
                });
            }
            addEventListener('load', release);
            setTimeout(release, 3000);
        })();
        </script>
        HTML;

        return substr_replace($content, $head.'</head>', $pos, strlen('</head>'));
    }

    protected function shouldInject(Request $request, Response $response): bool
    {
        if (! config('statamic-visual-editor.enabled', true)) {
            return false;
        }

        if (! config('statamic-visual-editor.edit_button', true)) {
            return false;
        }

        if (! $request->isMethod('GET') || Statamic::isCpRoute() || $request->isLivePreview()) {
            return false;
        }

        if ($response->getStatusCode() !== 200) {
            return false;
        }

        return str_contains((string) $response->headers->get('Content-Type'), 'text/html');
    }

    /** The entry behind the current URL, or null when the URL isn't an entry. */
    protected function resolveEntry(Request $request)
    {
        $path = $request->path();
        $uri = $path === '/' ? '/' : '/'.ltrim($path, '/');

        $data = Data::findByUri($uri, Site::current()->handle());

        if (! $data) {
            return null;
        }

        // Pages in a structure wrap the entry — unwrap so permissions resolve.
        if (method_exists($data, 'entry') && ($entry = $data->entry())) {
            return $entry;
        }

        return $data;
    }

    protected function button($entry): string
    {
        $url = e($entry->editUrl().'?live-preview=1');

        return <<<HTML
        <a href="{$url}" id="sve-edit-button" title="Rediger denne side i Live Preview">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
            </svg>
            <span>Rediger</span>
        </a>
        <style>
            /* Resting state is the icon alone — a page you're reading shouldn't
               have a button shouting at it. The label unfurls on hover, so it
               only asks for attention once you've gone looking for it. */
            #sve-edit-button {
                position: fixed; top: 16px; right: 16px; z-index: 2147483000;
                display: inline-flex; align-items: center;
                padding: 9px; border-radius: 999px;
                background: #18181b; color: #fff; text-decoration: none;
                font: 500 13px/1 ui-sans-serif, system-ui, -apple-system, sans-serif;
                box-shadow: 0 4px 16px rgba(0,0,0,.28);
                opacity: .9; transition: opacity .15s ease, transform .15s ease, padding .18s ease;
            }
            #sve-edit-button span {
                max-width: 0; opacity: 0; overflow: hidden; white-space: nowrap;
                transition: max-width .18s ease, opacity .18s ease, margin-left .18s ease;
            }
            #sve-edit-button:hover { opacity: 1; transform: translateY(-1px); padding: 9px 14px 9px 11px; }
            #sve-edit-button:hover span { max-width: 160px; opacity: 1; margin-left: 7px; }
            #sve-edit-button[data-loading] { pointer-events: none; opacity: .75; }
            #sve-edit-button[data-loading] svg { animation: sve-spin 1s linear infinite; }
            @keyframes sve-spin { to { transform: rotate(360deg); } }

            /* The editor itself: a full-screen frame that lives on top of the page.
               opacity (not display/visibility) — a frame that isn't rendered can be
               laid out at the wrong size, and Live Preview measures the viewport as
               it mounts.

               A class rather than an id: changing page inside the editor boots a
               second one of these beside the first and only swaps once it has
               painted, so there are briefly two on the page. */
            .sve-edit-overlay {
                position: fixed; inset: 0; width: 100%; height: 100%;
                border: 0; margin: 0; z-index: 2147483200;
                opacity: 0; pointer-events: none;
            }
            .sve-edit-overlay[data-open] { opacity: 1; pointer-events: auto; }
            html.sve-editing { overflow: hidden; }
            html.sve-editing #sve-edit-button { display: none; }

            /* Cross-fade the site and the editor. The site declares
               `@view-transition { navigation: auto }`, but that's cross-document —
               this is a same-document transition and needs its own timing. */
            html.sve-morphing::view-transition-old(root),
            html.sve-morphing::view-transition-new(root) {
                animation-duration: 380ms;
                animation-timing-function: cubic-bezier(.4, 0, .2, 1);
            }

            @media print { #sve-edit-button, .sve-edit-overlay { display: none; } }
        </style>
        <script>
        (function () {
            var button = document.getElementById('sve-edit-button');
            if (!button) return;

            // A site that opts into cross-document view transitions
            // (@view-transition) leaves Statamic's CP half-rendered when you
            // navigate into it. Skipping the transition for CP navigations is the
            // only thing that lets the CP boot — opting the CP in too was tried
            // and breaks it just the same. Everything else on the site keeps its
            // transitions.
            addEventListener('pageswap', function (e) {
                var to = (e.activation && e.activation.entry && e.activation.entry.url) || '';
                if (e.viewTransition && to.indexOf('/cp/') !== -1) {
                    e.viewTransition.skipTransition();
                }
            });

            // Hand the page's background colour to the CP so it can cover itself
            // in the same colour while Live Preview boots — the editor UI is then
            // never seen and the jump feels like it stays on the site.
            // <body> is often transparent (the colour sits on <html> or a wrapper),
            // so fall back until we find a real one.
            function solidBackground(el) {
                if (!el) return null;
                var colour = getComputedStyle(el).backgroundColor;
                if (!colour || colour === 'transparent' || /rgba\(0,\s*0,\s*0,\s*0\)/.test(colour)) return null;
                return colour;
            }

            // Prefer the colour actually filling the top of the viewport — that's
            // what the eye is on when the click happens, so covering with it is
            // what makes the jump read as seamless.
            function backgroundInView() {
                var el = document.elementFromPoint(Math.floor(innerWidth / 2), 4);
                for (var i = 0; el && i < 12; i++) {
                    var colour = solidBackground(el);
                    if (colour) return colour;
                    el = el.parentElement;
                }
                return null;
            }

            // Stash it where the CP can read it. Deliberately NOT a query param:
            // the link's URL has to stay identical for the browser's prerender
            // (below) to be reused on click.
            function rememberBackground() {
                try {
                    localStorage.setItem(
                        'sve-lp-bg',
                        backgroundInView()
                            || solidBackground(document.body)
                            || solidBackground(document.documentElement)
                            || '#ffffff'
                    );
                } catch (e) { /* private mode */ }
            }

            rememberBackground();
            // Refresh on hover and on click — the visitor may have scrolled, and
            // the cover should match whatever they're actually looking at.
            button.addEventListener('pointerenter', rememberBackground);
            button.addEventListener('click', rememberBackground);

            // ---- The editor overlay -------------------------------------------
            // We never navigate away. The Control Panel boots inside a full-screen
            // frame on top of this page, and we cross-fade to it once Live Preview
            // has actually painted. The site stays alive underneath, so coming back
            // is instant and nothing on it re-animates.
            //
            // (This also side-steps the cross-document problem entirely: navigating
            // from a page with @view-transition into the CP leaves the CP's Inertia
            // app half-booted, whether the transition runs or is skipped.)

            var target = button.getAttribute('href');
            var frame = null;
            var next = null;     // a second editor, booting another page behind this one
            var nextTimer = null;
            var ready = false;   // Live Preview has painted inside the frame
            var open = false;    // the overlay is on screen
            var wanted = false;  // clicked while it was still booting
            var saved = false;   // something was saved — the page below is stale
            var root = document.documentElement;

            function editor(src) {
                var el = document.createElement('iframe');
                el.className = 'sve-edit-overlay';
                el.title = 'Live Preview';
                el.src = src;
                document.body.appendChild(el);
                return el;
            }

            function boot() {
                if (frame) return;
                frame = editor(target);
            }

            // Changing page from inside the editor, by exactly the route the button
            // itself takes: boot the next page hidden, leave the one you're looking
            // at alone, and swap only once the new one says it has painted. Anything
            // that covers or fakes the old page in the meantime reads as a page
            // change of its own — which is the whole thing this avoids.
            function goto(url) {
                if (!open || !frame) return;
                if (next) next.remove();
                clearTimeout(nextTimer);

                next = editor(url);

                // Never strand the editor on a page that never comes: hand it back
                // and let it move itself the ordinary way.
                nextTimer = setTimeout(function () {
                    if (!next) return;
                    next.remove();
                    next = null;
                    tell(frame, 'lp-goto-failed');
                }, 20000);
            }

            function tell(el, type) {
                try {
                    el.contentWindow.postMessage({ source: 'statamic-visual-editor', type: type }, location.origin);
                } catch (e) {}
            }

            function morph(update) {
                if (!document.startViewTransition) { update(); return; }
                root.classList.add('sve-morphing');
                document.startViewTransition(update).finished
                    .catch(function () {})
                    .then(function () { root.classList.remove('sve-morphing'); });
            }

            function show() {
                if (open || !frame) return;
                open = true;
                // A history entry, so Back closes the editor instead of leaving the site.
                try { history.pushState({ sveEditing: true }, '', location.href); } catch (e) {}
                morph(function () {
                    frame.setAttribute('data-open', '');
                    root.classList.add('sve-editing');
                });
            }

            function close(fromHistory, target) {
                if (!open) return;
                open = false;
                button.removeAttribute('data-loading');

                // Where the front end should end up. Live Preview may have moved to
                // another entry since the overlay opened, so the page sitting under
                // it can be the wrong one — land on the entry you were actually on.
                var dest = null;
                if (target) {
                    try {
                        var u = new URL(target, location.origin);
                        if (u.origin === location.origin) dest = u;
                    } catch (e) {}
                }

                var elsewhere = dest && dest.pathname !== location.pathname;

                // A real front-end load is needed when the page underneath is stale
                // (something was saved) or simply the wrong page (you navigated). The
                // instant reveal below is only right when neither is true.
                if (saved || elsewhere) {
                    // Detach the editor before leaving: unloading with the frame still
                    // in it lets the CP's beforeunload handlers put up a "changes you
                    // made may not be saved" prompt — about changes that were just
                    // saved. A detached iframe can never show that prompt.
                    frame.remove();
                    frame = null;
                    ready = false;

                    if (elsewhere) {
                        // A fresh page, so its entrance animations should play.
                        location.href = dest.href;
                    } else {
                        // Same page, refreshed for the saved content. Hold the
                        // animations back so the reload reads as the content simply
                        // being there.
                        try { sessionStorage.setItem('sve-noanim', '1'); } catch (e) {}
                        location.reload();
                    }
                    return;
                }

                if (!fromHistory) {
                    try { history.back(); } catch (e) {}
                }

                morph(function () {
                    frame.removeAttribute('data-open');
                    root.classList.remove('sve-editing');
                });
            }

            // Boot on hover, so the click lands on an editor that is already up.
            button.addEventListener('pointerenter', boot);
            button.addEventListener('focus', boot);

            button.addEventListener('click', function (event) {
                // Leave modified clicks (new tab, new window) alone.
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                if (!document.body) return;

                event.preventDefault();
                boot();

                if (ready) { show(); return; }

                // Still booting: hold here rather than showing a blank editor. The
                // page stays fully visible and interactive in the meantime.
                wanted = true;
                button.setAttribute('data-loading', '');
            });

            addEventListener('message', function (event) {
                if (event.origin !== location.origin) return;

                var from = frame && event.source === frame.contentWindow ? 'frame'
                         : next && event.source === next.contentWindow ? 'next'
                         : null;
                if (!from) return;

                var data = event.data;
                if (!data || data.source !== 'statamic-visual-editor') return;

                if (data.type === 'lp-goto') {
                    // Same origin only: this hands a URL straight to an iframe src.
                    var url;
                    try { url = new URL(String(data.url), location.origin); } catch (e) { return; }
                    if (from === 'frame' && url.origin === location.origin) goto(url.href);
                    return;
                }

                if (data.type === 'lp-ready') {
                    if (from === 'next') {
                        // The new page has painted. Swap it in for the one on screen
                        // and drop that one — a single cross-fade, with no moment in
                        // between where neither is there.
                        clearTimeout(nextTimer);
                        var old = frame;
                        frame = next;
                        next = null;
                        morph(function () {
                            frame.setAttribute('data-open', '');
                            if (old) old.remove();
                        });
                        return;
                    }

                    ready = true;
                    button.removeAttribute('data-loading');
                    if (wanted) { wanted = false; show(); }
                } else if (data.type === 'lp-saved') {
                    saved = true;
                } else if (data.type === 'lp-leaving') {
                    // A save is on its way. In dev, Vite's full-reload may replace
                    // this page before anything else arrives — flag now so that
                    // reload also skips the entrance animations.
                    try { sessionStorage.setItem('sve-noanim', '1'); } catch (e) {}
                } else if (data.type === 'lp-close') {
                    close(false, data.url);
                }
            });

            addEventListener('popstate', function (event) {
                // Only a real Back press should close the editor. Frames inside it
                // (the globals panel) add and remove their own session-history
                // entries, and the browser traverses the joint history to keep up —
                // which fires popstate here without the user going anywhere. Our
                // own entry still carries the flag, so that case is recognisable.
                if (event.state && event.state.sveEditing) return;

                if (open) close(true);
            });

            // If the editor never comes up, fall back to a plain navigation rather
            // than leaving someone staring at a spinner.
            setTimeout(function () {
                if (wanted && !ready) { wanted = false; rememberBackground(); location.href = target; }
            }, 20000);
        })();
        </script>
        HTML;
    }
}
