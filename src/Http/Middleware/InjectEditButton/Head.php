<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware\InjectEditButton;

/**
 * What goes into `<head>` before first paint: the no-animation flag after a
 * save, and the guard that swallows Vite's `full-reload` while the editor
 * overlay is open.
 * Moved verbatim out of InjectEditButton in WP7d.
 */
final class Head
{
    /**
     * Sits in <head> so it runs before the first paint.
     *
     * The no-anim flag: when we come back from the editor after a save the page
     * has to reload to show the new content, and this stops every entrance
     * animation from replaying on the way in. Durations are collapsed rather
     * than removed so animations still apply their end state.
     *
     * The Vite wrap: a classic script here runs before the deferred
     * `@vite/client` module opens its socket. Swallow `full-reload` while
     * `html.sve-editing` so `npm run dev` does not tear the overlay down.
     * CSS `update` messages are not touched.
     */
    public static function head(string $content): string
    {
        $pos = stripos($content, '</head>');

        if ($pos === false) {
            return $content;
        }

        $head = <<<'HTML'
        <style id="sve-noanim">
            html.sve-noanim,
            html.sve-noanim *:not(#sve-edit-button) {
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
        /* Classic script in <head>, before the deferred @vite/client module
           opens its socket. overlay-host.js loads too late to wrap that socket.
           Swallow full-reload while the editor overlay is open; CSS HMR `update`
           is left alone so npm run dev still paints new utilities. */
        (function () {
            function overlayOpen() {
                return document.documentElement.classList.contains('sve-editing');
            }
            function isFullReload(event) {
                try {
                    var data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                    return !!(data && data.type === 'full-reload');
                } catch (e) {
                    return false;
                }
            }
            try {
                var reload = location.reload.bind(location);
                location.reload = function () {
                    if (!overlayOpen()) return reload.apply(this, arguments);
                };
            } catch (e) {}
            var Orig = window.WebSocket;
            if (!Orig || Orig.__sveGuarded) return;
            function wrap(ws) {
                if (!ws || ws.__sveGuarded) return;
                ws.__sveGuarded = true;
                ws.addEventListener('message', function (event) {
                    if (overlayOpen() && isFullReload(event)) event.stopImmediatePropagation();
                }, true);
            }
            window.WebSocket = function (url, protocols) {
                var ws = protocols === undefined ? new Orig(url) : new Orig(url, protocols);
                wrap(ws);
                return ws;
            };
            window.WebSocket.prototype = Orig.prototype;
            window.WebSocket.__sveGuarded = true;
            Object.setPrototypeOf(window.WebSocket, Orig);
        })();
        </script>
        HTML;

        return substr_replace($content, $head.'</head>', $pos, strlen('</head>'));
    }
}
