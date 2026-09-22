<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Spatie\Browsershot\Browsershot;
use Symfony\Component\Process\ExecutableFinder;
use Symfony\Component\Process\Process;

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
    /**
     * The browser Browsershot launches: it runs puppeteer with `headless:
     * 'shell'`, and that mode wants puppeteer's own build of the shell.
     */
    public const BROWSER = 'chrome-headless-shell';

    /**
     * Where puppeteer keeps its browsers — the same cache its installer
     * fills, so what this class fetches is what Browsershot finds. PHP-FPM may
     * run without HOME; the process user's home is asked for then.
     */
    public static function cacheDir(): string
    {
        if ($env = getenv('PUPPETEER_CACHE_DIR')) {
            return rtrim($env, '/');
        }

        return rtrim(static::home(), '/').'/.cache/puppeteer';
    }

    protected static function home(): string
    {
        if ($home = getenv('HOME')) {
            return $home;
        }

        if (function_exists('posix_getpwuid') && function_exists('posix_geteuid')) {
            return (string) (posix_getpwuid(posix_geteuid())['dir'] ?? '');
        }

        return '';
    }

    /** Any build of the shell in the cache — puppeteer picks its own from there. */
    public static function browserInstalled(): bool
    {
        $dir = static::cacheDir().'/'.static::BROWSER;

        return is_dir($dir) && glob($dir.'/*') !== [];
    }

    /**
     * Fetch the browser with puppeteer's own installer, the way `npx puppeteer
     * browsers install` does — but from here, so a site made from the starter
     * kit photographs its sections without anybody logging in to run it.
     * Puppeteer downloads the browser in a postinstall script that
     * `ignore-scripts=true` (the kit's .npmrc) skips, and a puppeteer upgrade
     * pins a new build; both leave the cache without one.
     *
     * Idempotent: an installed build is recognised and skipped by the
     * installer. One at a time, so two runs do not download side by side.
     * Returns true when the browser is there afterwards.
     */
    public static function install(): bool
    {
        $cli = base_path('node_modules/puppeteer/lib/puppeteer/node/cli.js');

        if (! is_file($cli)) {
            return false;
        }

        $node = (new ExecutableFinder)->find('node', null, ['/usr/local/bin', '/usr/bin', '/opt/homebrew/bin']);

        if (! $node) {
            Log::warning('[sve] previews: node was not found, so the browser could not be installed');

            return false;
        }

        $lock = Cache::lock('sve-previews:browser-install', 900);

        if (! $lock->get()) {
            return static::browserInstalled();
        }

        try {
            $env = array_filter([
                'HOME' => static::home(),
                'PUPPETEER_CACHE_DIR' => getenv('PUPPETEER_CACHE_DIR') ?: null,
                'PATH' => getenv('PATH') ?: null,
            ]);
            $process = new Process([$node, $cli, 'browsers', 'install', static::BROWSER], base_path(), $env, null, 900);

            $process->run();

            if ($process->isSuccessful() && static::browserInstalled()) {
                Log::info('[sve] previews: installed '.static::BROWSER.' into '.static::cacheDir());

                return true;
            }

            Log::warning('[sve] previews: could not install '.static::BROWSER.': '.trim($process->getErrorOutput() ?: $process->getOutput()));

            return false;
        } finally {
            $lock->release();
        }
    }

    /** Did this failure say the browser is missing — the one failure a fetch fixes? */
    public static function isMissingBrowser(\Throwable $e): bool
    {
        for ($error = $e; $error; $error = $error->getPrevious()) {
            if (preg_match('/Could not find chrome/i', $error->getMessage())) {
                return true;
            }
        }

        return false;
    }

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

        if (! static::browserInstalled()) {
            return trans('sve::messages.previews_no_browser', ['browser' => static::BROWSER]);
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
