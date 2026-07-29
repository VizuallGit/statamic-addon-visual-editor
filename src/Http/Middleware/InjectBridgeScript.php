<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
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

        $tags = collect(['resources/js/bridge.js', 'resources/js/preview.js'])
            ->map(fn ($entry) => $this->resolveScriptUrl($entry))
            ->map(fn ($url) => '<script type="module" src="'.e($url).'"></script>')
            ->implode('');

        $content = substr_replace($content, $tags.'</body>', $pos, strlen('</body>'));

        $response->setContent($this->injectHead($content));

        return $response;
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
            $this->bridgeData().$this->entranceAnimationGuard().'</head>',
            $pos,
            strlen('</head>')
        );
    }

    /**
     * The preview runs as a front-end request and can't reach the CP's config, so
     * what it needs rides along in the document: its strings, already resolved to
     * the CP user's language (see ServiceProvider::strings()), and the map of
     * which tools are on — the bridge must know before it offers one (stepping
     * into the header, say).
     */
    protected function bridgeData(): string
    {
        $flags = JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT;

        $strings = json_encode(
            \MarioHamann\StatamicVisualEditor\ServiceProvider::strings(),
            $flags | JSON_UNESCAPED_UNICODE
        );

        $features = json_encode(Features::map(), $flags);

        return <<<HTML
        <script>window.__sveStrings = {$strings}; window.__sveFeatures = {$features};</script>
        HTML."\n";
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
        return $request->isLivePreview();
    }

    protected function resolveScriptUrl(string $entry): string
    {
        $fallback = asset('vendor/visual-editor/'.basename($entry));

        $manifestPath = public_path('vendor/visual-editor/build/manifest.json');

        if (file_exists($manifestPath)) {
            $manifest = json_decode((string) file_get_contents($manifestPath), true);
            if (json_last_error() !== JSON_ERROR_NONE || ! is_array($manifest)) {
                return $fallback;
            }

            $resolved = $manifest[$entry] ?? null;

            if ($resolved && isset($resolved['file'])) {
                return asset('vendor/visual-editor/build/'.$resolved['file']);
            }
        }

        return $fallback;
    }
}
