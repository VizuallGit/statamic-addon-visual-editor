<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware\InjectLiveReload;

/**
 * The live-reload button: markup, styles and the poll.
 *
 * It sits at the top left, level with the "Rediger" button at the top right.
 * A dot says what it is doing — green on, grey off, amber building, red when
 * the build failed (the tooltip says why and the console has the build's
 * output). A click switches it off and on for this browser (localStorage
 * `sve-live-reload`). Signed out, it asks again every 30 s.
 *
 * The poll sends the signatures the page was rendered with, and the server
 * holds the request until one differs or 25 seconds have passed
 * (LiveReload::await). An answer with nothing new is asked again at once,
 * never sooner than 100 ms after the last request began, so a server that
 * answers at once cannot turn it into a loop. The server looks every 50 ms,
 * so a saved template is seen within about 50–100 ms.
 *
 * New markup is not a page load. The poll names the page, renders it itself
 * when the markup changed and answers with its HTML (the held process is
 * booted and warm: 140–260 ms from a save to the new HTML on Cuben, where the
 * page's own fetch took 1.4 s); without it the button fetches the page. It
 * morphs that HTML into the standing page with Alpine's morph (live-reload-morph.js,
 * imported once the button is on — `$morph` is its URL), so the scroll
 * position, an open menu and every Alpine state stay where they are. Only what
 * the server sent is touched: the <body>'s top-level elements as they stood
 * before any script ran, in which only the smallest element whose HTML
 * changed is morphed (a section, a heading; never its unchanged neighbours),
 * and the texts of the <style> tags in <head>, replaced in place. What scripts
 * add at run time (the editor's overlay, a teleported dialog) and the two
 * buttons are left alone. A morph does not run scripts, so the page reloads as
 * before when it cannot be a morph: a new build, other <script> tags, <style>
 * tags in <head> or stylesheet links than the page was served with (a
 * `script_push` in a section is one), other <body> attributes or top-level
 * elements, no Alpine or no morph, a fetch that fails or a morph that throws.
 * A CSS change still waits for the server's build: the sources rest two
 * seconds, Vite builds, and the new manifest reloads the page.
 *
 * Nothing is asked while the tab is hidden or the editor overlay is open (an
 * open overlay is a Live Preview session; reloading would end it); it looks
 * again a second later. The answer's `own` is Live Preview's business: this
 * page follows any change.
 */
final class Widget
{
    /**
     * @param  array{markup: string, build: string}  $page
     * @param  string|null  $morph  URL of the built live-reload-morph.js; without it new markup reloads the page
     */
    public static function html(array $page, ?string $morph = null): string
    {
        $reasons = [];

        foreach (['no-node', 'no-vite', 'failed', 'no-manifest', 'locked'] as $reason) {
            $reasons[$reason] = __("sve::messages.theme_utilities_reason_{$reason}");
        }

        $config = json_encode([
            'url' => '/!/sve/live-reload',
            'markup' => $page['markup'],
            'build' => $page['build'],
            'morph' => $morph,
            'strings' => [
                'on' => __('sve::messages.live_reload_on'),
                'off' => __('sve::messages.live_reload_off'),
                'building' => __('sve::messages.live_reload_building'),
                'reloading' => __('sve::messages.live_reload_reloading'),
                'error' => __('sve::messages.live_reload_error'),
                'offline' => __('sve::messages.live_reload_offline'),
                'signedout' => __('sve::messages.live_reload_signedout'),
                'reasons' => $reasons,
            ],
        ], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        $label = e(__('sve::messages.live_reload_on'));

        return <<<HTML
        <button type="button" id="sve-live-reload" data-state="on" title="{$label}" aria-label="{$label}" aria-pressed="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M8 16H3v5"></path>
            </svg>
            <span class="sve-lr-dot"></span>
        </button>
        <style>
            #sve-live-reload {
                position: fixed; top: 1rem; left: 1rem; z-index: 2147483000;
                display: inline-flex; align-items: center; justify-content: center;
                width: 2.0625rem; height: 2.0625rem; margin: 0; padding: 0;
                border: 0; border-radius: 999px; line-height: 1;
                background: #18181b; color: #fff; cursor: pointer;
                box-shadow: 0 0.25rem 1rem rgba(0,0,0,.28); opacity: .9;
            }
            #sve-live-reload:hover { opacity: 1; }
            #sve-live-reload svg { display: block; width: 0.9375rem; height: 0.9375rem; }
            #sve-live-reload .sve-lr-dot {
                position: absolute; top: 0.1875rem; right: 0.1875rem;
                width: 0.5rem; height: 0.5rem; border-radius: 50%;
                background: #22c55e; box-shadow: 0 0 0 2px #18181b;
            }
            #sve-live-reload[data-state="off"] svg { opacity: .5; }
            #sve-live-reload[data-state="off"] .sve-lr-dot { background: #71717a; }
            #sve-live-reload[data-state="building"] .sve-lr-dot,
            #sve-live-reload[data-state="reloading"] .sve-lr-dot { background: #f59e0b; }
            #sve-live-reload[data-state="building"] svg { animation: sve-lr-spin 1s linear infinite; }
            #sve-live-reload[data-state="error"] .sve-lr-dot { background: #ef4444; }
            #sve-live-reload[data-state="offline"] .sve-lr-dot,
            #sve-live-reload[data-state="signedout"] .sve-lr-dot { background: #a1a1aa; }
            @keyframes sve-lr-spin { to { transform: rotate(360deg); } }
            @media (prefers-reduced-motion: reduce) { #sve-live-reload svg { animation: none !important; } }
            @media print { #sve-live-reload { display: none; } }
        </style>
        <script>
        (function () {
            var cfg = {$config};
            var button = document.getElementById('sve-live-reload');
            if (!button) return;

            var KEY = 'sve-live-reload';
            // The least time between the starts of two requests. The server
            // holds each one until something changes; this only keeps a
            // server that answers at once from being asked in a loop.
            var FLOOR = 100;
            var timer = null;
            var busy = false;
            var started = 0;
            var lastOutput = null;

            function enabled() {
                try { return localStorage.getItem(KEY) !== 'off'; } catch (e) { return true; }
            }

            function paint(state, detail) {
                var label = cfg.strings[state] || '';
                if (detail) label = label.replace(':reason', detail);
                button.setAttribute('data-state', state);
                button.setAttribute('aria-pressed', state === 'off' ? 'false' : 'true');
                button.setAttribute('aria-label', label);
                button.title = label;
            }

            // An open editor overlay is a Live Preview session.
            function editing() {
                return document.documentElement.classList.contains('sve-editing');
            }

            function reload() {
                paint('reloading');
                // InjectEditButton's <head> script reads this flag and keeps
                // entrance animations from replaying. Only set when it is there.
                if (document.getElementById('sve-noanim')) {
                    try { sessionStorage.setItem('sve-noanim', '1'); } catch (e) {}
                }
                location.reload();
            }

            // --- New markup as a morph --------------------------------------

            // The <body>'s top-level elements up to the injected buttons; the
            // buttons, and what scripts append after them, are not the page.
            function contentOf(body) {
                var nodes = [];
                for (var el = body.firstElementChild; el; el = el.nextElementSibling) {
                    if (el.id === 'sve-live-reload' || el.id === 'sve-edit-button') break;
                    nodes.push(el);
                }
                return nodes;
            }

            function attributesOf(el) {
                var list = [];
                for (var i = 0; i < el.attributes.length; i++) list.push(el.attributes[i].name + '=' + el.attributes[i].value);
                return list.sort().join(' ');
            }

            // What a morph cannot bring along: the <body>'s own attributes, the
            // scripts (a morph runs none), the stylesheet links and the <style>
            // tags of <head> as tags (their texts are swapped in place). A page
            // that differs here is reloaded.
            function frameOf(doc, nodes) {
                var parts = [attributesOf(doc.body)];
                function add(el) {
                    if (el.tagName === 'LINK') parts.push('link ' + el.getAttribute('href'));
                    else if (el.tagName === 'STYLE') parts.push('style ' + attributesOf(el));
                    else parts.push('script ' + (el.getAttribute('type') || '') + ' ' + (el.getAttribute('src') || el.textContent));
                }
                Array.prototype.forEach.call(doc.head.querySelectorAll('script, style, link[rel~="stylesheet"]'), add);
                nodes.forEach(function (node) {
                    if (node.tagName === 'SCRIPT') add(node);
                    Array.prototype.forEach.call(node.querySelectorAll('script'), add);
                });
                return parts.join('\\n');
            }

            // The page as the server sent it. This script runs at the end of
            // <body>, before Alpine and the site's deferred scripts, so the
            // elements still hold the server's HTML. Kept as text: a copy of
            // the elements would load every image again.
            var served = (function () {
                var nodes = contentOf(document.body);
                return {
                    nodes: nodes,
                    old: null,
                    html: nodes.map(function (el) { return el.outerHTML; }),
                    frame: frameOf(document, nodes),
                    styles: Array.prototype.slice.call(document.head.querySelectorAll('style')),
                    title: document.title,
                };
            })();

            // The server's previous elements, parsed (inert: nothing loads)
            // the first time they are needed.
            function oldNodes() {
                if (!served.old) {
                    var body = new DOMParser().parseFromString('<!doctype html><body>' + served.html.join('') + '</body>', 'text/html').body;
                    served.old = Array.prototype.slice.call(body.children);
                }
                return served.old;
            }

            var morphReady = null;

            // Alpine's morph, once. Asked for as soon as the button is on, so
            // it is there before the first save.
            function loadMorph() {
                if (!morphReady) {
                    morphReady = (cfg.morph ? import(cfg.morph) : Promise.reject(new Error('no morph')))
                        .then(function () {
                            if (!window.Alpine || typeof window.Alpine.morph !== 'function') throw new Error('no Alpine.morph');
                        });
                    // Not there (no Alpine yet, a failed request): ask again next time.
                    morphReady.catch(function () { morphReady = null; });
                }
                return morphReady;
            }

            function parsePage(html) {
                if (html.indexOf('</body>') === -1) throw new Error('no </body>');
                return new DOMParser().parseFromString(html, 'text/html');
            }

            // The page's new HTML: what the poll rendered, or the page's own
            // fetch when the answer has none (an older server, a render that
            // was not a page).
            function newPage(status) {
                if (typeof status.html === 'string') return Promise.resolve(status.html).then(parsePage);
                return fetch(location.href, { credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'text/html' } })
                    .then(function (response) {
                        if (!response.ok || response.redirected) throw new Error(String(response.status));
                        return response.text();
                    })
                    .then(parsePage);
            }

            // The <style> tags in <head>, swapped as preview.js's syncHeadStyles
            // swaps them: a changed text replaced, an unchanged one left alone.
            // Tag for tag in place, so the cascade keeps its order around the
            // stylesheet links (the frame holds the tags themselves). Only the
            // server's: a style a script added stays.
            function syncHeadStyles(next) {
                var nextStyles = next.head.querySelectorAll('style');
                served.styles.forEach(function (style, i) {
                    var text = nextStyles[i].textContent;
                    if (style.textContent !== text) style.textContent = text;
                });
            }

            // An element's own children in order: tags for elements, the text
            // itself for text and comments.
            function shapeOf(el) {
                var parts = [];
                for (var n = el.firstChild; n; n = n.nextSibling) parts.push(n.nodeType === 1 ? '<' + n.tagName : n.nodeType + ':' + n.nodeValue);
                return parts.join('\\n');
            }

            function tagsOf(el) {
                var tags = [];
                for (var c = el.firstElementChild; c; c = c.nextElementSibling) tags.push(c.tagName);
                return tags.join(' ');
            }

            // Brings `live` from what the server sent before (`old`) to what it
            // sends now (`next`), morphing only the smallest element that
            // changed: down through elements whose own attributes and children
            // stayed (and whose children no script added to or took away),
            // past every unchanged sibling. A section next to the changed one
            // keeps a dialog a script filled. Alpine.morph with a string morphs
            // against its first element, so each element is its own string
            // (preview.js morphs a section the same way).
            function patch(live, old, next) {
                if (old.outerHTML === next.outerHTML || next.tagName === 'SCRIPT') return;
                if (next.tagName === 'TEMPLATE' || attributesOf(old) !== attributesOf(next) || shapeOf(old) !== shapeOf(next) || tagsOf(live) !== tagsOf(old)) {
                    window.Alpine.morph(live, next.outerHTML);
                    return;
                }
                for (var l = live.firstElementChild, o = old.firstElementChild, n = next.firstElementChild; n; l = l.nextElementSibling, o = o.nextElementSibling, n = n.nextElementSibling) {
                    patch(l, o, n);
                }
            }

            // Morphs the fetched page into this one, or throws before touching
            // anything when it has to be a reload.
            function morphInto(next) {
                var nodes = contentOf(next.body);
                var old = oldNodes();

                if (!next.getElementById('sve-live-reload')) throw new Error('not the same page');
                if (frameOf(next, nodes) !== served.frame) throw new Error('scripts, links or <body> changed');
                if (nodes.length !== served.nodes.length || old.length !== nodes.length) throw new Error('top-level elements changed');
                nodes.forEach(function (node, i) {
                    if (node.tagName !== served.nodes[i].tagName || node.tagName !== old[i].tagName || !served.nodes[i].isConnected) throw new Error('top-level elements changed');
                });
                served.styles.forEach(function (style) {
                    if (style.parentNode !== document.head) throw new Error('a <head> style was taken away');
                });

                syncHeadStyles(next);
                if (next.title !== served.title) document.title = served.title = next.title;

                nodes.forEach(function (node, i) { patch(served.nodes[i], old[i], node); });
                served.old = nodes;
            }

            // New markup: the page's new HTML morphed in, or a reload when it
            // cannot be.
            function update(status) {
                paint('reloading');
                Promise.all([loadMorph(), newPage(status)])
                    .then(function (done) {
                        // Opened the editor or switched off while it fetched:
                        // catch up later, as a poll would.
                        if (editing() || !enabled()) { busy = false; paint(enabled() ? 'on' : 'off'); schedule(0); return; }
                        morphInto(done[1]);
                        cfg.markup = status.markup;
                        busy = false;
                        if (status.error) showError(status.error);
                        else paint(status.building ? 'building' : 'on');
                        schedule(0);
                    })
                    .catch(function (error) {
                        console.info('[live reload] reloading: ' + (error && error.message));
                        reload();
                    });
            }

            function schedule(ms) {
                clearTimeout(timer);
                timer = setTimeout(poll, ms);
            }

            function showError(error) {
                var reason = cfg.strings.reasons[error.reason] || error.reason;
                var output = error.output ? String(error.output).replace(/\\x1b\\[[0-9;]*m/g, '').trim() : '';
                if (output && output !== lastOutput) {
                    lastOutput = output;
                    console.warn('[live reload] ' + reason + '\\n' + output);
                }
                paint('error', output ? reason + '\\n\\n' + output.slice(0, 400) : reason);
            }

            // What the page holds, so the server waits until it differs. Asked
            // as XHR: a plain GET would become the session's "previous URL",
            // where a redirect back from the Control Panel then lands.
            // `page`: the poll renders this page itself when the markup changes
            // and answers with its HTML (LiveReloadController\PageRender).
            function pollUrl() {
                return cfg.url + '?markup=' + encodeURIComponent(cfg.markup) + '&build=' + encodeURIComponent(cfg.build)
                    + '&page=' + encodeURIComponent(location.pathname + location.search);
            }

            function poll() {
                timer = null;
                if (!enabled()) { paint('off'); return; }
                if (document.hidden || editing() || busy) { schedule(1000); return; }

                busy = true;
                started = Date.now();
                loadMorph();
                fetch(pollUrl(), { credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
                    .then(function (response) {
                        if (response.status === 401 || response.status === 403) return { refused: true };
                        if (!response.ok) throw new Error(String(response.status));
                        return response.json();
                    })
                    .then(function (status) {
                        busy = false;
                        // Signed out (or no longer allowed): ask again now and then,
                        // so signing in in another tab brings it back.
                        if (status.refused) { paint('signedout'); schedule(30000); return; }
                        if (!enabled()) { paint('off'); return; }
                        if ((status.markup !== cfg.markup || status.build !== cfg.build) && !editing()) {
                            // New CSS or JS from the build: only a page load brings it.
                            if (status.build !== cfg.build) { reload(); return; }
                            busy = true;
                            update(status);
                            return;
                        }
                        if (status.error) showError(status.error);
                        else paint(status.building ? 'building' : 'on');
                        // Nothing new: ask again — the server holds the next one.
                        schedule(Math.max(0, FLOOR - (Date.now() - started)));
                    })
                    .catch(function () {
                        busy = false;
                        paint('offline');
                        schedule(3000);
                    });
            }

            button.addEventListener('click', function (event) {
                event.preventDefault();
                var next = !enabled();
                try { localStorage.setItem(KEY, next ? 'on' : 'off'); } catch (e) {}
                if (next) {
                    paint('on');
                    schedule(0);
                } else {
                    clearTimeout(timer);
                    paint('off');
                }
            });

            if (enabled()) {
                paint('on');
                schedule(1000);
            } else {
                paint('off');
            }
        })();
        </script>
        HTML;
    }
}
