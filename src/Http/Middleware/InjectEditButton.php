<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
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
        if (! Features::editorEnabled()) {
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
        $host = e($this->resolveScriptUrl('resources/js/overlay-host.js'));

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
            @media print { #sve-edit-button { display: none; } }
        </style>
        <script type="module" src="{$host}"></script>
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

            // Module scripts are deferred — hold the click until overlay-host binds.
            button.addEventListener('click', function (event) {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                event.preventDefault();
                button.setAttribute('data-loading', '');
                window.__sveWantEditor = true;
            });
        })();
        </script>
        HTML;
    }

    protected function resolveScriptUrl(string $entry): string
    {
        $fallback = asset('vendor/visual-editor/'.basename($entry));
        $manifestPath = public_path('vendor/visual-editor/build/manifest.json');

        if (file_exists($manifestPath)) {
            $manifest = json_decode((string) file_get_contents($manifestPath), true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($manifest)) {
                $resolved = $manifest[$entry] ?? null;
                if ($resolved && isset($resolved['file'])) {
                    return asset('vendor/visual-editor/build/'.$resolved['file']);
                }
            }
        }

        return $fallback;
    }
}
