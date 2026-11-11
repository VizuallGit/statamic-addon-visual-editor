<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\PageTransitionSettings;
use Statamic\Statamic;
use Symfony\Component\HttpFoundation\Response;

/**
 * The site's page transitions as Build → Animation → Page transition →
 * «Whole site» set them (PageTransitionSettings): one `<style>` at the end of
 * every page's <head>, on the public site and in Live Preview alike.
 *
 * Nothing is saved: nothing is added, the site's own CSS decides. Never on a
 * Control Panel page or an action route (`/!/…`), only on a 200 HTML page.
 *
 * A page with a `view-transition-name` in its markup also gets
 * resources/animation/page-transition-list.js in <head>: on a list, only the
 * card that was clicked flies (CSS cannot know which one it was). The only
 * script page transitions put on the site.
 *
 * Listed after InjectBridgeScript, so it writes first on the way out and the
 * bridge's Live Preview guard (`navigation: none` unless the user turned page
 * transitions on there) lands after this and wins.
 */
class InjectPageTransitions
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $request->isMethod('GET') || Statamic::isCpRoute() || str_starts_with($request->path(), '!/')) {
            return $response;
        }

        if ($response->getStatusCode() !== 200 || ! str_contains((string) $response->headers->get('Content-Type'), 'text/html')) {
            return $response;
        }

        $content = $response->getContent();
        $pos = is_string($content) ? stripos($content, '</head>') : false;

        if ($pos === false) {
            return $response;
        }

        $css = PageTransitionSettings::css(PageTransitionSettings::read());
        $add = ($css !== '' ? '<style id="sve-page-transitions">'.$css.'</style>' : '')
            .(str_contains($content, 'view-transition-name') ? '<script id="sve-page-transitions-list">'.static::listScript().'</script>' : '');

        if ($add === '') {
            return $response;
        }

        $response->setContent(substr_replace($content, $add, $pos, 0));

        return $response;
    }

    public static function listScript(): string
    {
        return trim((string) file_get_contents(__DIR__.'/../../../resources/animation/page-transition-list.js'));
    }
}
