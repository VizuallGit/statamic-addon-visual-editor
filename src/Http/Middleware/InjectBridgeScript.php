<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\PreviewHost;
use Symfony\Component\HttpFoundation\Response;

class InjectBridgeScript
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! Features::editorEnabled()) {
            return $response;
        }

        if (! $this->isLivePreview($request)) {
            return $response;
        }

        if (! method_exists($response, 'getContent') || ! method_exists($response, 'setContent')) {
            return $response;
        }

        $content = $response->getContent();

        if ($content === false) {
            return $response;
        }

        $pos = strrpos($content, '</body>');

        if ($pos === false) {
            return $response;
        }

        $tags = collect($this->scriptEntries($request))
            ->map(fn ($entry) => $this->resolveScriptUrl($entry))
            ->map(fn ($url) => '<script type="module" src="'.e($url).'"></script>')
            ->implode('');

        $content = substr_replace($content, $tags.'</body>', $pos, strlen('</body>'));

        $response->setContent($this->injectHead($content));

        return $response;
    }

    /**
     * The built entries this preview document loads.
     *
     * `sve_view` marks a view frame: one of the breakpoint overview's sizes
     * side by side. It must morph like the preview, so it keeps preview.js,
     * but it is only looked at, never edited — without the bridge there are
     * no badges, no hover, no toolbar and no clicks back to the Control Panel.
     * Only its presence counts; the value is the frame's size (`sve_view=mobile`),
     * which gives each frame a URL of its own.
     */
    protected function scriptEntries(Request $request): array
    {
        return $request->query('sve_view') !== null
            ? ['resources/js/preview.js']
            : ['resources/js/bridge.js', 'resources/js/preview.js'];
    }

    /**
     * Everything the bridge needs in <head>, in one pass.
     *
     * The bridge data is not optional — without it the preview has no strings and
     * no idea which tools are switched on — so it goes in whether or not the
     * animation suppression that follows it is wanted.
     */
    protected function injectHead(string $content): string
    {
        $pos = stripos($content, '</head>');

        if ($pos === false) {
            return $content;
        }

        return substr_replace(
            $content,
            $this->bridgeData().$this->viteFullReloadGuard().$this->entranceAnimationGuard().'</head>',
            $pos,
            strlen('</head>')
        );
    }

    /**
     * The preview runs as a front-end request and can't reach the CP's config, so
     * what it needs rides along in the document: its strings, already resolved to
     * the CP user's language (see Boot\ControlPanelScript::strings()), and the map of
     * which tools are on — the bridge must know before it offers one (stepping
     * into the header, say).
     */
    protected function bridgeData(): string
    {
        $flags = JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT;

        $strings = json_encode(
            \MarioHamann\StatamicVisualEditor\Boot\ControlPanelScript::strings(),
            $flags | JSON_UNESCAPED_UNICODE
        );

        $features = json_encode(Features::map(), $flags);

        return <<<HTML
        <script>window.__sveStrings = {$strings}; window.__sveFeatures = {$features};</script>
        HTML."\n";
    }

    /**
     * Classic script in <head>, before the deferred `@vite/client` module opens
     * its socket. Vite `full-reload` would white-flash this iframe (and paint
     * every section again). Swallow it. CSS `update` is left to the client.
     * HTML morphs in place from the dock — one section, no reload.
     */
    protected function viteFullReloadGuard(): string
    {
        return <<<'HTML'
        <script>
        (function () {
            function parse(event) {
                try {
                    return typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                } catch (e) {
                    return null;
                }
            }
            try {
                location.reload = function () {};
            } catch (e) {}
            var Orig = window.WebSocket;
            if (!Orig || Orig.__svePreviewGuarded) return;
            function wrap(ws) {
                if (!ws || ws.__svePreviewGuarded) return;
                ws.__svePreviewGuarded = true;
                ws.addEventListener('message', function (event) {
                    var data = parse(event);
                    if (!data || data.type !== 'full-reload') return;
                    event.stopImmediatePropagation();
                }, true);
            }
            window.WebSocket = function (url, protocols) {
                var ws = protocols === undefined ? new Orig(url) : new Orig(url, protocols);
                wrap(ws);
                return ws;
            };
            window.WebSocket.prototype = Orig.prototype;
            window.WebSocket.__svePreviewGuarded = true;
            Object.setPrototypeOf(window.WebSocket, Orig);
        })();
        </script>
        HTML;
    }

    /**
     * Stops the page's entrance animations from replaying every time the preview
     * loads. Durations are collapsed rather than removed, so animations still run
     * (and still apply their end state — elements that animate up from opacity 0
     * would otherwise stay invisible), they just finish within a frame.
     *
     * Only the first moments are collapsed: the class is dropped once the page has
     * loaded, so anything the visitor scrolls to afterwards animates normally.
     */
    protected function entranceAnimationGuard(): string
    {
        if (! config('statamic-visual-editor.suppress_entrance_animations', true)) {
            return '';
        }

        return <<<'HTML'
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
            var root = document.documentElement;
            root.classList.add('sve-noanim');
            var released = false;
            function release() {
                if (released) return;
                released = true;
                // One frame of grace so whatever ran on load has settled.
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () { root.classList.remove('sve-noanim'); });
                });
            }
            addEventListener('load', release);
            setTimeout(release, 3000);
        })();
        </script>
        HTML;
    }

    protected function isLivePreview(Request $request): bool
    {
        return $request->isLivePreview() || PreviewHost::isCollectionViewPreview($request);
    }

    protected function resolveScriptUrl(string $entry): string
    {
        return \MarioHamann\StatamicVisualEditor\BuiltAssets::url($entry);
    }
}
