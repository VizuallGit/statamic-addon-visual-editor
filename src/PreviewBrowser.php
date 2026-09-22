<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\Browsershot\Browsershot;
use Symfony\Component\Process\ExecutableFinder;
use Symfony\Component\Process\Process;

/**
 * The headless browser the previews are photographed with, in one place.
 *
 * A site owns its browser. Puppeteer's build of the shell lands under the site's
 * own storage/, and on a Debian/Ubuntu server the system libraries it loads and
 * a stock server lacks are fetched — as packages, without root — and unpacked
 * next to it; the browser starts with LD_LIBRARY_PATH pointing there. Nothing is
 * installed on the machine, so a site made from the starter kit photographs its
 * sections from the first save, and a site that is deleted takes its browser
 * with it.
 *
 * It also exists for its error messages. Browsershot reports a missing browser
 * as a 40-line Node stack trace inside a failed-process exception, which a
 * utility page shows as "error" and nobody reads — so a site can sit for months
 * with every preview silently unbuilt. The failures that actually happen each
 * have one line here.
 */
class PreviewBrowser
{
    /**
     * The browser Browsershot launches: it runs puppeteer with `headless:
     * 'shell'`, and that mode wants puppeteer's own build of the shell.
     */
    public const BROWSER = 'chrome-headless-shell';

    /** Under storage/: the browser (puppeteer/) and its libraries (libs/). */
    public const DIR = 'app/sve-browser';

    protected const LOCK = 'sve-previews:browser-install';

    /**
     * Libraries the shell loads that a stock server does without, and the
     * package each lives in — newest naming first (Ubuntu 24.04 gave a batch a
     * t64 suffix). What this misses is guessed from the soname and checked
     * against apt, so a new library is a warning in the log, not a dead end.
     */
    protected const PACKAGES = [
        'libatk-1.0.so.0' => ['libatk1.0-0t64', 'libatk1.0-0'],
        'libatk-bridge-2.0.so.0' => ['libatk-bridge2.0-0t64', 'libatk-bridge2.0-0'],
        'libatspi.so.0' => ['libatspi2.0-0t64', 'libatspi2.0-0'],
        'libcups.so.2' => ['libcups2t64', 'libcups2'],
        'libasound.so.2' => ['libasound2t64', 'libasound2'],
        'libgbm.so.1' => ['libgbm1'],
        'libpango-1.0.so.0' => ['libpango-1.0-0'],
        'libpangocairo-1.0.so.0' => ['libpangocairo-1.0-0'],
        'libcairo.so.2' => ['libcairo2'],
        'libXcomposite.so.1' => ['libxcomposite1'],
        'libXdamage.so.1' => ['libxdamage1'],
        'libXfixes.so.3' => ['libxfixes3'],
        'libXrandr.so.2' => ['libxrandr2'],
        'libXrender.so.1' => ['libxrender1'],
        'libXi.so.6' => ['libxi6'],
        'libXtst.so.6' => ['libxtst6'],
        'libXext.so.6' => ['libxext6'],
        'libX11.so.6' => ['libx11-6'],
        'libX11-xcb.so.1' => ['libx11-xcb1'],
        'libxcb.so.1' => ['libxcb1'],
        'libxkbcommon.so.0' => ['libxkbcommon0'],
        'libnss3.so' => ['libnss3'],
        'libnssutil3.so' => ['libnss3'],
        'libsmime3.so' => ['libnss3'],
        'libnspr4.so' => ['libnspr4'],
        'libplc4.so' => ['libnspr4'],
        'libplds4.so' => ['libnspr4'],
        'libdrm.so.2' => ['libdrm2'],
        'libexpat.so.1' => ['libexpat1'],
        'libdbus-1.so.3' => ['libdbus-1-3'],
        'libglib-2.0.so.0' => ['libglib2.0-0t64', 'libglib2.0-0'],
        'libgobject-2.0.so.0' => ['libglib2.0-0t64', 'libglib2.0-0'],
        'libgio-2.0.so.0' => ['libglib2.0-0t64', 'libglib2.0-0'],
        'libgmodule-2.0.so.0' => ['libglib2.0-0t64', 'libglib2.0-0'],
        'libwayland-server.so.0' => ['libwayland-server0'],
        'libfontconfig.so.1' => ['libfontconfig1'],
        'libfreetype.so.6' => ['libfreetype6'],
        'libharfbuzz.so.0' => ['libharfbuzz0b'],
        'libpixman-1.so.0' => ['libpixman-1-0'],
        'libpng16.so.16' => ['libpng16-16t64', 'libpng16-16'],
        'libudev.so.1' => ['libudev1'],
    ];

    /**
     * Where the browser lives: the site's own storage/, unless the machine
     * points puppeteer somewhere with PUPPETEER_CACHE_DIR. Site-local on
     * purpose — one site cannot break another's previews, and nothing has to be
     * shared with the deploy user's home, which PHP-FPM may not even know.
     */
    public static function cacheDir(): string
    {
        if ($env = getenv('PUPPETEER_CACHE_DIR')) {
            return rtrim($env, '/');
        }

        return storage_path(static::DIR.'/puppeteer');
    }

    /** Where the fetched system libraries are unpacked. */
    public static function libsDir(): string
    {
        return storage_path(static::DIR.'/libs');
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

    /**
     * The shell's binary — the newest build in the cache, as puppeteer lays it
     * out: {cache}/chrome-headless-shell/{platform}-{build}/chrome-headless-shell-{platform}/chrome-headless-shell.
     * Handed to Browsershot outright, so the browser found is the browser run,
     * whichever build puppeteer happens to pin today.
     */
    public static function executable(): ?string
    {
        $dir = static::cacheDir().'/'.static::BROWSER;
        $found = array_filter(glob($dir.'/*/'.static::BROWSER.'-*/'.static::BROWSER) ?: [], 'is_file');

        usort($found, fn ($a, $b) => version_compare(static::buildOf($a), static::buildOf($b)));

        return $found ? end($found) : null;
    }

    /** "linux-153.0.8010.36" → "153.0.8010.36". */
    protected static function buildOf(string $bin): string
    {
        $platform = basename(dirname($bin, 2));

        return ($at = strrpos($platform, '-')) === false ? $platform : substr($platform, $at + 1);
    }

    public static function browserInstalled(): bool
    {
        return static::executable() !== null;
    }

    /**
     * Fetch the browser with puppeteer's own installer, the way `npx puppeteer
     * browsers install` does — but from here, into the site, so a site made
     * from the starter kit photographs its sections without anybody logging in
     * to run it. Puppeteer downloads the browser in a postinstall script that
     * `ignore-scripts=true` (the kit's .npmrc) skips, and a puppeteer upgrade
     * pins a new build; both leave the cache without one. On Linux the
     * libraries the shell then turns out to lack are fetched as well.
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

        $node = static::find('node');

        if (! $node) {
            Log::warning('[sve] previews: node was not found, so the browser could not be installed');

            return false;
        }

        $lock = Cache::lock(static::LOCK, 900);

        if (! $lock->get()) {
            return static::browserInstalled();
        }

        try {
            $process = new Process([$node, $cli, 'browsers', 'install', static::BROWSER], base_path(), static::env([
                'PUPPETEER_CACHE_DIR' => static::cacheDir(),
            ]), null, 900);

            $process->run();

            $bin = static::executable();

            if (! $process->isSuccessful() || ! $bin) {
                Log::warning('[sve] previews: could not install '.static::BROWSER.': '.trim($process->getErrorOutput() ?: $process->getOutput()));

                return false;
            }

            Log::info('[sve] previews: installed '.static::BROWSER.' into '.static::cacheDir());

            if (PHP_OS_FAMILY === 'Linux') {
                static::fetchLibraries($bin);
            }

            return true;
        } finally {
            $lock->release();
        }
    }

    /**
     * Fetch the system libraries the installed shell cannot load. Linux only;
     * the browser has to be there. Returns true when the shell loads cleanly
     * afterwards.
     */
    public static function installLibraries(): bool
    {
        if (PHP_OS_FAMILY !== 'Linux' || ! ($bin = static::executable())) {
            return false;
        }

        $lock = Cache::lock(static::LOCK, 900);

        if (! $lock->get()) {
            return static::missingLibraries($bin) === [];
        }

        try {
            return static::fetchLibraries($bin);
        } finally {
            $lock->release();
        }
    }

    /**
     * What the shell says it cannot load, package by package, without root:
     * `apt-get download` writes the .deb where it is run, `dpkg -x` unpacks it
     * where it is told, and neither touches the machine. The packages are the
     * ones the sonames map to plus what apt says those depend on — minus what
     * is installed already, and with an alternative counted as met when any of
     * its options is. Asked again until `ldd` finds nothing missing, so a
     * fetched library's own dependency is caught on the next round.
     */
    protected static function fetchLibraries(string $bin): bool
    {
        $missing = static::missingLibraries($bin);

        if ($missing === []) {
            return true;
        }

        foreach (['apt-get', 'apt-cache', 'dpkg', 'dpkg-query'] as $tool) {
            if (! static::find($tool)) {
                Log::warning('[sve] previews: the browser lacks '.implode(', ', $missing).', and without '.$tool.' (Debian/Ubuntu) they cannot be fetched into the site');

                return false;
            }
        }

        $installed = static::installedPackages();
        $have = static::extractedPackages();

        for ($round = 1; $round <= 4 && $missing !== []; $round++) {
            [$wanted, $unknown] = static::packagesFor($missing, fn (string $name) => static::aptKnows($name));

            if ($unknown) {
                Log::warning('[sve] previews: no package found for '.implode(', ', $unknown).' — add it to PreviewBrowser::PACKAGES');
            }

            $packages = array_values(array_diff(static::withDependencies($wanted, $installed + $have), array_keys($have)));

            if ($packages === []) {
                break;
            }

            $got = static::download($packages);

            if ($got === []) {
                break;
            }

            $have += array_fill_keys($got, true);
            static::rememberExtracted(array_keys($have));

            $missing = static::missingLibraries($bin);
        }

        if ($missing === []) {
            Log::info('[sve] previews: fetched the browser\'s libraries into '.static::libsDir().' ('.count($have).' packages)');

            return true;
        }

        Log::warning('[sve] previews: the browser still lacks '.implode(', ', $missing).' after fetching what apt offers');

        return false;
    }

    /** Sonames `ldd` reports as not found, with the site's libraries in the path. */
    public static function missingLibraries(string $bin): array
    {
        if (! ($ldd = static::find('ldd'))) {
            return [];
        }

        $process = new Process([$ldd, $bin], null, static::env(array_filter(['LD_LIBRARY_PATH' => static::libraryPath()])), null, 60);
        $process->run();

        return static::parseLdd($process->getOutput());
    }

    /** The "=> not found" lines of an ldd listing, as sonames. */
    public static function parseLdd(string $output): array
    {
        preg_match_all('/^\s*(\S+)\s*=>\s*not found/m', $output, $matches);

        return array_values(array_unique($matches[1]));
    }

    /**
     * The packages for a list of sonames — the first candidate apt knows for
     * each — and the sonames nothing was found for.
     *
     * @return array{0: string[], 1: string[]}
     */
    public static function packagesFor(array $sonames, callable $known): array
    {
        $packages = $unknown = [];

        foreach ($sonames as $soname) {
            foreach (static::candidates($soname) as $candidate) {
                if (in_array($candidate, $packages, true) || $known($candidate)) {
                    $packages[] = $candidate;

                    continue 2;
                }
            }

            $unknown[] = $soname;
        }

        return [array_values(array_unique($packages)), $unknown];
    }

    /**
     * Package names a soname may live in: the table first, then Debian's
     * naming convention (libfoo.so.3 → libfoo3, with and without a t64 suffix).
     */
    public static function candidates(string $soname): array
    {
        $guesses = [];

        if (preg_match('/^(.+?)\.so(?:\.(\d+))?/', $soname, $m)) {
            $base = strtolower($m[1]);
            $version = $m[2] ?? '';

            foreach (['', 't64'] as $suffix) {
                $guesses[] = $base.$version.$suffix;

                if ($version !== '') {
                    $guesses[] = $base.'-'.$version.$suffix;
                }
            }
        }

        return array_values(array_unique(array_merge(static::PACKAGES[$soname] ?? [], $guesses)));
    }

    /**
     * $packages plus everything they depend on that $satisfied does not cover.
     *
     * @param  array<string, true>  $satisfied  installed or already fetched
     */
    protected static function withDependencies(array $packages, array $satisfied): array
    {
        $queue = array_values(array_diff($packages, array_keys($satisfied)));
        $result = [];

        while ($queue) {
            $result = array_merge($result, $queue);
            $known = $satisfied + array_fill_keys($result, true);

            $process = new Process(array_merge([static::find('apt-cache'), 'depends', '--no-recommends', '--no-suggests', '--no-conflicts', '--no-breaks', '--no-replaces', '--no-enhances'], $queue), null, static::env(), null, 120);
            $process->run();

            $queue = array_values(array_diff(static::parseDepends($process->getOutput(), $known), array_keys($known)));
            $queue = array_values(array_filter($queue, fn (string $name) => static::aptKnows($name)));
        }

        return array_values(array_unique($result));
    }

    /**
     * The dependencies an `apt-cache depends` listing asks for and $satisfied
     * does not meet. Alternatives (`|Depends:` lines and the plain line that
     * ends the group) are met by any member; otherwise the first is taken.
     * Virtual packages (`<name>`) are skipped: their providers are installed
     * things like libc.
     *
     * @param  array<string, true>  $satisfied
     */
    public static function parseDepends(string $output, array $satisfied): array
    {
        $needed = [];
        $group = [];

        foreach (preg_split('/\R/', $output) as $line) {
            if (! preg_match('/^\s*(\|?)(?:Pre)?Depends:\s*(\S+)/', $line, $m)) {
                continue;
            }

            [, $pipe, $name] = $m;
            $name = preg_replace('/:[a-z0-9-]+$/', '', $name);

            if (! str_starts_with($name, '<')) {
                $group[] = $name;
            }

            if ($pipe === '|') {
                continue;
            }

            if ($group !== [] && ! array_intersect_key(array_fill_keys($group, true), $satisfied)) {
                $needed[] = $group[0];
            }

            $group = [];
        }

        return array_values(array_unique($needed));
    }

    /** @return array<string, true> every package dpkg has installed */
    protected static function installedPackages(): array
    {
        $process = new Process([static::find('dpkg-query'), '-W', '-f=${Package} ${db:Status-Status}\n'], null, static::env(), null, 60);
        $process->run();

        preg_match_all('/^(\S+) installed$/m', $process->getOutput(), $matches);

        return array_fill_keys($matches[1], true);
    }

    protected static function aptKnows(string $package): bool
    {
        $process = new Process([static::find('apt-cache'), 'show', '--no-all-versions', $package], null, static::env(), null, 60);
        $process->run();

        return $process->isSuccessful() && str_contains($process->getOutput(), 'Package: ');
    }

    /**
     * Download $packages and unpack them under libs/. Returns the names that
     * were unpacked — apt fetches what it can and reports the rest, and a
     * stale package list (apt-get update needs root) is the usual reason.
     */
    protected static function download(array $packages): array
    {
        $tmp = storage_path(static::DIR.'/deb-'.uniqid());
        @mkdir($tmp, 0775, true);
        @mkdir(static::libsDir(), 0775, true);

        $process = new Process(array_merge([static::find('apt-get'), 'download'], $packages), $tmp, static::env(), null, 600);
        $process->run();

        if (! $process->isSuccessful()) {
            Log::warning('[sve] previews: apt-get download: '.trim($process->getErrorOutput() ?: $process->getOutput()));
        }

        $got = [];

        foreach (glob($tmp.'/*.deb') ?: [] as $deb) {
            $extract = new Process([static::find('dpkg'), '-x', $deb, static::libsDir()], null, static::env(), null, 120);
            $extract->run();

            if ($extract->isSuccessful()) {
                $got[] = explode('_', basename($deb))[0];
            } else {
                Log::warning('[sve] previews: dpkg -x '.basename($deb).': '.trim($extract->getErrorOutput()));
            }

            @unlink($deb);
        }

        @rmdir($tmp);

        return $got;
    }

    /** @return array<string, true> packages unpacked into libs/ so far */
    protected static function extractedPackages(): array
    {
        $file = static::libsDir().'/.packages';

        return is_file($file) ? array_fill_keys(array_filter(array_map('trim', file($file))), true) : [];
    }

    protected static function rememberExtracted(array $packages): void
    {
        @file_put_contents(static::libsDir().'/.packages', implode("\n", $packages)."\n");
    }

    /**
     * LD_LIBRARY_PATH for the browser: every library directory under libs/,
     * ahead of whatever the environment already had. Null when nothing was
     * fetched, so a machine with its own libraries runs untouched.
     */
    public static function libraryPath(): ?string
    {
        $libs = static::libsDir();
        $dirs = array_merge(
            glob($libs.'/usr/lib/*-linux-gnu') ?: [],
            glob($libs.'/lib/*-linux-gnu') ?: [],
            array_filter([$libs.'/usr/lib', $libs.'/lib'], 'is_dir'),
        );

        if ($dirs === []) {
            return null;
        }

        if ($existing = getenv('LD_LIBRARY_PATH')) {
            $dirs[] = $existing;
        }

        return implode(':', array_unique($dirs));
    }

    /** Did this failure say the browser is missing — the one failure a fetch fixes? */
    public static function isMissingBrowser(\Throwable $e): bool
    {
        return static::says($e, '/Could not find chrome/i');
    }

    /** Did this failure say the browser lacks a system library? */
    public static function isMissingLibrary(\Throwable $e): bool
    {
        return static::says($e, '/error while loading shared libraries|cannot open shared object file/i');
    }

    /**
     * Put right what this failure says is missing — the browser, or a library
     * it loads — and report whether a second attempt is worth it.
     */
    public static function repair(\Throwable $e): bool
    {
        if (static::isMissingBrowser($e)) {
            return static::install();
        }

        if (static::isMissingLibrary($e)) {
            return static::installLibraries();
        }

        return false;
    }

    protected static function says(\Throwable $e, string $pattern): bool
    {
        for ($error = $e; $error; $error = $error->getPrevious()) {
            if (preg_match($pattern, $error->getMessage())) {
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
            $shot = Browsershot::url($url)
                ->setNodeModulePath(base_path('node_modules/'));

            // The site's own browser, by path — puppeteer would otherwise look
            // for its pinned build in the deploy user's home.
            if ($bin = static::executable()) {
                $shot->setChromePath($bin);
            }

            // The fetched libraries reach the browser process through its
            // environment. Browsershot lets the PHP process's own environment
            // win over this, so a machine that sets LD_LIBRARY_PATH for PHP-FPM
            // keeps its own.
            if ($libraries = static::libraryPath()) {
                $shot->setEnvironmentOptions(['LD_LIBRARY_PATH' => $libraries]);
            }

            // Chrome's sandbox wants either a setuid helper or unprivileged user
            // namespaces, and Ubuntu 24.04 turns the latter off — the browser
            // then refuses to start at all ("No usable sandbox!"). It only ever
            // photographs this site's own pages, so it runs without one on Linux.
            if (PHP_OS_FAMILY === 'Linux') {
                $shot->noSandbox();
            }

            $shot
                ->ignoreHttpsErrors()
                ->windowSize($width, (int) round($width * 0.7))
                ->deviceScaleFactor($scale)
                // "Idle" with up to two connections still open, not none: an
                // autoplaying video streams for as long as the page is up, and
                // with the strict setting a section that has one never loads —
                // the navigation times out at 30 s and the preview fails.
                ->waitUntilNetworkIdle(false)
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
     * Turns the failures that actually happen into the line that explains them,
     * and leaves anything else alone (trimmed — the untouched text is a Node
     * stack trace).
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

        if (preg_match('/loading shared libraries: ([^\s:]+)/', $message, $match)) {
            return trans('sve::messages.previews_no_libraries', ['library' => $match[1]]);
        }

        return Str::limit(trim(preg_replace('/\s+/', ' ', $message)), 300);
    }

    protected static function find(string $tool): ?string
    {
        return (new ExecutableFinder)->find($tool, null, ['/usr/local/bin', '/usr/bin', '/bin', '/opt/homebrew/bin']);
    }

    /** Environment for the processes above: a PATH, a HOME and plain-C output to parse. */
    protected static function env(array $extra = []): array
    {
        return array_filter([
            'HOME' => static::home(),
            'PATH' => getenv('PATH') ?: '/usr/local/bin:/usr/bin:/bin',
            'LC_ALL' => 'C',
            'DEBIAN_FRONTEND' => 'noninteractive',
        ] + $extra);
    }
}
