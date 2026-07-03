<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InjectBridgeScript
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! config('statamic-visual-editor.enabled', true)) {
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

        $response->setContent(substr_replace($content, $tags.'</body>', $pos, strlen('</body>')));

        return $response;
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
