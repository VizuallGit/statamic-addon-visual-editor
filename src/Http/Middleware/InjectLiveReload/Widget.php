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
 * holds the request until one differs or three seconds have passed
 * (LiveReload::await). An answer with nothing new is asked again at once,
 * never sooner than 100 ms after the last request began, so a server that
 * answers at once cannot turn it into a loop. The server looks every 100 ms:
 * a template saved in this browser's editor is seen within about 100 ms,
 * one saved from outside it (Cursor over SSH) within about 150–250 ms,
 * since the server looks a second time before calling a change foreign.
 * The reload after that is the browser's own page load. A CSS change still
 * waits for the server's build: the sources rest two seconds, Vite builds,
 * and the new manifest reloads the page.
 *
 * Nothing is asked while the tab is hidden or the editor overlay is open (an
 * open overlay is a Live Preview session; reloading would end it); it looks
 * again a second later. The answer's `own` is Live Preview's business: this
 * page reloads on any change.
 */
final class Widget
{
    /** @param  array{markup: string, build: string}  $page */
    public static function html(array $page): string
    {
        $reasons = [];

        foreach (['no-node', 'no-vite', 'failed', 'no-manifest', 'locked'] as $reason) {
            $reasons[$reason] = __("sve::messages.theme_utilities_reason_{$reason}");
        }

        $config = json_encode([
            'url' => '/!/sve/live-reload',
            'markup' => $page['markup'],
            'build' => $page['build'],
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
            function pollUrl() {
                return cfg.url + '?markup=' + encodeURIComponent(cfg.markup) + '&build=' + encodeURIComponent(cfg.build);
            }

            function poll() {
                timer = null;
                if (!enabled()) { paint('off'); return; }
                if (document.hidden || editing() || busy) { schedule(1000); return; }

                busy = true;
                started = Date.now();
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
                            reload();
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
