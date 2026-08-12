<?php

namespace MarioHamann\StatamicVisualEditor;

use Spatie\Browsershot\Browsershot;

/**
 * The headless browser the previews are photographed with, in one place.
 *
 * It exists mostly for its error messages. Browsershot reports a missing browser
 * as a 40-line Node stack trace inside a failed-process exception, which a utility
 * page shows as "error" and nobody reads — so a site can sit for months with every
 * preview silently unbuilt, showing hand-made screenshots that no longer match the
 * design. The two ways this actually fails both have a one-line fix, and this
 * turns them into that line.
 */
class PreviewBrowser
{
    /** Photographs $selector on $url into $path. Throws with a readable message. */
    public static function shoot(string $url, string $selector, string $path): void
    {
        $width = (int) config('statamic-visual-editor.previews.width', 1440);
        $delay = (int) config('statamic-visual-editor.previews.delay', 1500);

        // How many device pixels per CSS pixel. Two gives a crisp picture on a
        // retina screen, and costs it: four times the pixels to rasterise, encode
        // and write, on every shot of every run.
        //
        // Whole numbers only — Browsershot types deviceScaleFactor as int, so a
        // fraction is coerced silently and a config asking for 0.55 gets 1
        // without complaint. Below 1 is therefore not a thing that can be asked
        // for here; a smaller file than 1× needs resampling after the capture.
        //
        // Not to be confused with the window width, which decides the *layout*:
        // narrow that and a two-column section stacks, which is a different
        // picture rather than a smaller one.
        $scale = max(1, (int) config('statamic-visual-editor.previews.scale', 2));

        try {
            Browsershot::url($url)
                ->setNodeModulePath(base_path('node_modules/'))
                ->ignoreHttpsErrors()
                ->windowSize($width, (int) round($width * 0.7))
                ->deviceScaleFactor($scale)
                ->waitUntilNetworkIdle()
                // Wait for the thing itself, rather than for long enough that it
                // has probably happened. The delay used to cover webfont loading
                // as well as animation, so shortening it to speed a run up
                // photographed the site in a fallback serif — a preview that is
                // wrong in the one way nobody checks, because it still looks like
                // a page. Asking the document when its fonts are ready is both
                // exact and quicker than the number it replaces.
                ->waitForFunction('document.fonts ? document.fonts.status === "loaded" : true', null, 5000)
                ->delay($delay) // let entrance animations finish before capturing
                ->select($selector)
                ->save($path);
        } catch (\Throwable $e) {
            // Nothing matched the selector: the section rendered no markup at all.
            // Its own kind of outcome, not a failure of the browser — a section
            // whose template is wrapped in `{{ if columns }}` draws nothing until
            // it has columns, and the caller can go looking for a better subject.
            if (str_contains($e->getMessage(), 'did not match any elements')) {
                throw new EmptyRenderException($url);
            }

            throw new \RuntimeException(static::explain($e->getMessage()), 0, $e);
        }
    }

    /**
     * Why a screenshot cannot be taken here, or null when one can.
     *
     * Deliberately cheap — a directory check, no process started — so the utility
     * page and the generator can both ask before doing any work.
     */
    public static function problem(): ?string
    {
        if (! is_dir(base_path('node_modules/puppeteer'))) {
            return trans('sve::messages.previews_no_puppeteer');
        }

        return null;
    }

    /**
     * Turns the two failures that actually happen into the command that fixes
     * them, and leaves anything else alone (trimmed — the untouched text is a
     * Node stack trace).
     */
    protected static function explain(string $message): string
    {
        if (str_contains($message, "Cannot find module 'puppeteer'")) {
            return trans('sve::messages.previews_no_puppeteer');
        }

        // Puppeteer pins an exact browser build and downloads it in a postinstall
        // script — which `ignore-scripts=true` in an .npmrc (Statamic's own
        // starter kits ship one) skips, and which a puppeteer upgrade invalidates.
        if (preg_match('/Could not find (chrome[a-z-]*)/i', $message, $match)) {
            return trans('sve::messages.previews_no_browser', ['browser' => $match[1]]);
        }

        return \Illuminate\Support\Str::limit(trim(preg_replace('/\s+/', ' ', $message)), 300);
    }
}
