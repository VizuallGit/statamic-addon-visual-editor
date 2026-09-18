<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware\InjectEditButton;

use Statamic\Statamic;

/**
 * The "Rediger" button itself — markup, styles and the script that reveals
 * it after paint and warms Live Preview.
 * Moved verbatim out of InjectEditButton in WP7d.
 */
final class Button
{
    public static function button($entry): string
    {
        $edit = $entry->editUrl();
        $joiner = str_contains($edit, '?') ? '&' : '?';
        $url = e($edit.$joiner.'live-preview=1');
        $hostJson = json_encode(
            static::resolveScriptUrl('resources/js/overlay-host.js'),
            JSON_UNESCAPED_SLASHES
        );

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
            /* Hidden until the front end has painted. Then it fades in and
               overlay-host.js starts warming Live Preview in the background. */
            #sve-edit-button {
                position: fixed; top: 16px; right: 16px; z-index: 2147483000;
                display: inline-flex; align-items: center;
                padding: 9px; border-radius: 999px;
                background: #18181b; color: #fff; text-decoration: none;
                font: 500 13px/1 ui-sans-serif, system-ui, -apple-system, sans-serif;
                box-shadow: 0 4px 16px rgba(0,0,0,.28);
                opacity: 0; pointer-events: none; transform: translateY(8px);
            }
            #sve-edit-button[data-ready] {
                opacity: .9; pointer-events: auto; transform: none;
            }
            #sve-edit-button span {
                max-width: 0; opacity: 0; overflow: hidden; white-space: nowrap;
                transition: max-width .18s ease, opacity .18s ease, margin-left .18s ease;
            }
            #sve-edit-button[data-ready]:hover { opacity: 1; transform: translateY(-1px); padding: 9px 14px 9px 11px; }
            #sve-edit-button[data-ready]:hover span { max-width: 160px; opacity: 1; margin-left: 7px; }
            #sve-edit-button[data-loading] { pointer-events: none; opacity: .75; }
            #sve-edit-button[data-loading] svg { animation: sve-spin 1s linear infinite; }
            @keyframes sve-spin { to { transform: rotate(360deg); } }
            @media print { #sve-edit-button { display: none; } }
        </style>
        <script>
        (function () {
            var button = document.getElementById('sve-edit-button');
            if (!button) return;

            var hostUrl = {$hostJson};

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

            function solidBackground(el) {
                if (!el) return null;
                var colour = getComputedStyle(el).backgroundColor;
                if (!colour || colour === 'transparent' || /rgba\(0,\s*0,\s*0,\s*0\)/.test(colour)) return null;
                return colour;
            }

            function backgroundInView() {
                var el = document.elementFromPoint(Math.floor(innerWidth / 2), 4);
                for (var i = 0; el && i < 12; i++) {
                    var colour = solidBackground(el);
                    if (colour) return colour;
                    el = el.parentElement;
                }
                return null;
            }

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
            button.addEventListener('pointerenter', rememberBackground);
            button.addEventListener('click', rememberBackground);

            // Capture so @view-transition cannot follow the href into the CP.
            button.addEventListener('click', function (event) {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                event.preventDefault();
                button.setAttribute('data-loading', '');
                window.__sveWantEditor = true;
            }, true);

            function loadOverlayHost() {
                if (document.querySelector('script[data-sve-overlay-host]')) return;
                var s = document.createElement('script');
                s.type = 'module';
                s.src = hostUrl;
                s.setAttribute('data-sve-overlay-host', '');
                document.head.appendChild(s);
            }

            function reveal() {
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        setTimeout(function () {
                            function ready() {
                                button.setAttribute('data-ready', '');
                                loadOverlayHost();
                            }

                            // CSS transitions are killed by sve-noanim and by
                            // prefers-reduced-motion. Web Animations still run.
                            if (typeof button.animate !== 'function') {
                                ready();
                                return;
                            }

                            var anim = button.animate(
                                [
                                    { opacity: 0, transform: 'translateY(8px)' },
                                    { opacity: 0.9, transform: 'translateY(0px)' }
                                ],
                                { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
                            );

                            var done = function () {
                                try { anim.cancel(); } catch (e) {}
                                ready();
                            };

                            if (anim.finished) anim.finished.then(done, done);
                            else anim.onfinish = done;
                        }, 400);
                    });
                });
            }

            function whenPainted() {
                var go = function () {
                    if (document.fonts && document.fonts.ready) {
                        document.fonts.ready.then(reveal, reveal);
                    } else {
                        reveal();
                    }
                };
                if (document.readyState === 'complete') go();
                else addEventListener('load', go, { once: true });
            }

            whenPainted();
        })();
        </script>
        HTML;
    }

    protected static function resolveScriptUrl(string $entry): string
    {
        return \MarioHamann\StatamicVisualEditor\BuiltAssets::url($entry);
    }
}
