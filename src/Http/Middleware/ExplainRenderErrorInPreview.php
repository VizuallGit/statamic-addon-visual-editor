<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Http\Middleware\ExplainRenderErrorInPreview\Words;
use MarioHamann\StatamicVisualEditor\PreviewHost;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * When the page cannot render in Live Preview, say why in words.
 *
 * A template with a `{{ if }}` that never closes, or a word Antlers takes
 * for a modifier, ends as an exception page in the preview: a class name, a
 * trace, sixty vendor frames. The designer who typed the template learns
 * nothing from it. Laravel hangs the exception it rendered on the response
 * (`withException`), so on the way out this swaps the page for one that says
 * what is missing and where — `Words` does the reading — and keeps the
 * technical details folded underneath.
 *
 * Live Preview only, and only a response that carries an exception: the
 * public site and every working preview pass through untouched. The status
 * stays what it was; the preview shows the body either way.
 *
 * Last in the `web` group, so it runs first on the way out and the others
 * see the plain page as they would any preview document.
 */
class ExplainRenderErrorInPreview
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! Features::editorEnabled() || ! $this->isLivePreview($request)) {
            return $response;
        }

        $exception = $this->exceptionOf($response);

        if (! $exception || ! method_exists($response, 'setContent')) {
            return $response;
        }

        $response->setContent(Words::html($exception));
        $response->headers->set('Content-Type', 'text/html; charset=UTF-8');

        return $response;
    }

    protected function exceptionOf(Response $response): ?Throwable
    {
        $exception = $response->exception ?? null;

        return $exception instanceof Throwable ? $exception : null;
    }

    protected function isLivePreview(Request $request): bool
    {
        return $request->isLivePreview() || PreviewHost::isCollectionViewPreview($request);
    }
}
