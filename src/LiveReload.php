<?php

namespace MarioHamann\StatamicVisualEditor;

use FilesystemIterator;
use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTemplateController\Persist;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * Live reload for the public site. A developer edits the site's files on the
 * server — VS Code over SSH, Site Files, the dock — and the page they have
 * open reloads itself, the way `npm run dev` does on a laptop.
 *
 * Everything is read from the files; nothing has to tell this class about a
 * save, so every way of writing a file is covered by the same check.
 *
 * Two signatures go to the page:
 * - `markup`: every file under the markup folders (views, lang) — path,
 *   mtime and size. A changed, added or removed template changes it.
 * - `build`: public/build/manifest.json. The site's CSS and JS reach a page
 *   only through the build, so it changes when the build wrote new files.
 * The page carries both from the moment it was rendered and reloads when
 * either differs.
 *
 * The build is the server's own (`SiteBuild::run`). It starts when the files
 * Vite reads — views (Tailwind scans them), css, js — changed since the last
 * attempt: one at a time, only once the files have rested a moment and the
 * last build is a few seconds behind, and never twice for the same files —
 * a build that failed or never finished waits for the next save.
 */
final class LiveReload
{
    /** The last build this class started: the sources it saw and the result. */
    protected const ATTEMPT = 'sve-live-reload:attempt';

    /** The markup signature the static cache was last flushed for. */
    protected const FLUSHED = 'sve-live-reload:flushed';

    /**
     * Seconds the sources must rest before a build. The dock saves on every
     * keystroke; a build per pause in the typing would keep a shared server
     * busy all session. The page still reloads for the markup at once.
     */
    protected const QUIET = 2;

    /** Seconds between the end of one build and the start of the next. */
    protected const GAP = 5;

    /**
     * What a page is rendered with. The middleware puts it in the page; the
     * page compares every status against it.
     *
     * @return array{markup: string, build: string}
     */
    public static function page(): array
    {
        clearstatcache();

        return [
            'markup' => static::scan(static::dirs('markup'))['sig'],
            'build' => static::buildSignature(),
        ];
    }

    /**
     * What the poll answers. `stale` and `sources` are for the controller,
     * which starts the build after the response is sent.
     *
     * @return array{markup: string, build: string, building: bool, error: array{reason: string, output: ?string}|null, stale: bool, sources: string}
     */
    public static function status(): array
    {
        clearstatcache();

        $markup = static::scan(static::dirs('markup'));
        $sources = static::scan(static::dirs('sources'));
        $attempt = Cache::get(self::ATTEMPT);
        $attempt = is_array($attempt) ? $attempt : null;

        static::flushWhenChanged($markup['sig']);

        $building = static::building();

        return [
            'markup' => $markup['sig'],
            'build' => static::buildSignature(),
            'building' => $building,
            // While a build runs, its attempt is recorded as unfinished.
            'error' => $building ? null : static::error($sources['sig'], $attempt),
            'stale' => static::stale($sources, $attempt),
            'sources' => $sources['sig'],
        ];
    }

    /**
     * Build the site for the sources signature `status()` saw.
     *
     * Runs after the poll's response is sent. A second poll that asks while
     * this runs finds the lock taken and returns; one that comes after finds
     * the attempt recorded for the same sources and returns too.
     *
     * @param  (callable(): array{ok: bool, reason?: string, output?: string})|null  $run  the build; tests pass their own
     */
    public static function build(string $sources, ?callable $run = null): void
    {
        $lock = @fopen(static::lockPath(), 'c');

        if ($lock === false) {
            return;
        }

        if (! flock($lock, LOCK_EX | LOCK_NB)) {
            fclose($lock);

            return;
        }

        try {
            $attempt = Cache::get(self::ATTEMPT);

            if (is_array($attempt) && ($attempt['sig'] ?? null) === $sources) {
                return;
            }

            // Recorded before it starts: a build that never returns — the
            // process timeout throws, PHP-FPM ends the worker — stays a failed
            // attempt for these sources instead of being started again by the
            // next poll, and the next poll after that, for as long as a tab
            // is open.
            Cache::forever(self::ATTEMPT, [
                'sig' => $sources,
                'ok' => false,
                'reason' => 'failed',
                'output' => 'The build did not finish.',
                'at' => time(),
            ]);

            $before = static::buildSignature();

            try {
                $result = ($run ?? [SiteBuild::class, 'run'])();
            } catch (\Throwable $e) {
                report($e);
                $result = ['ok' => false, 'reason' => 'failed', 'output' => $e->getMessage()];
            }

            Cache::forever(self::ATTEMPT, [
                'sig' => $sources,
                'ok' => (bool) ($result['ok'] ?? false),
                'reason' => $result['reason'] ?? null,
                'output' => $result['output'] ?? null,
                'at' => time(),
            ]);

            // The site's CSS is inlined into its pages, so a cached page keeps
            // the old CSS until the cache lets go of it.
            if (($result['ok'] ?? false) && static::buildSignature() !== $before) {
                Persist::flushStaticCache();
            }
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }

    /**
     * `npm run dev` is running: Vite serves the CSS and reloads the page
     * itself, and builds nothing into public/build.
     */
    public static function hot(): bool
    {
        return is_file(public_path('hot'));
    }

    /** Is a build of ours running right now? */
    public static function building(): bool
    {
        $lock = @fopen(static::lockPath(), 'c');

        if ($lock === false) {
            return false;
        }

        $free = flock($lock, LOCK_EX | LOCK_NB);

        if ($free) {
            flock($lock, LOCK_UN);
        }

        fclose($lock);

        return ! $free;
    }

    /**
     * Does the build lag behind the sources?
     *
     * After the first attempt the answer is "have the sources changed since",
     * which holds however Vite stamps the manifest. Before it — a fresh cache —
     * the manifest's own mtime is the only record of the last build.
     *
     * @param  array{sig: string, newest: int}  $sources
     * @param  array<string, mixed>|null  $attempt
     */
    protected static function stale(array $sources, ?array $attempt): bool
    {
        if (static::hot()) {
            return false;
        }

        if ($sources['newest'] > time() - self::QUIET) {
            return false;
        }

        if ($attempt !== null) {
            if (time() - (int) ($attempt['at'] ?? 0) < self::GAP) {
                return false;
            }

            return ($attempt['sig'] ?? null) !== $sources['sig'];
        }

        $manifest = @filemtime(static::manifestPath());

        return $manifest === false || $sources['newest'] > $manifest;
    }

    /**
     * The failed attempt for exactly these sources, or null. A save after a
     * failure clears it: the next build is on its way.
     *
     * @param  array<string, mixed>|null  $attempt
     * @return array{reason: string, output: ?string}|null
     */
    protected static function error(string $sources, ?array $attempt): ?array
    {
        if ($attempt === null || ($attempt['ok'] ?? true) || ($attempt['sig'] ?? null) !== $sources) {
            return null;
        }

        return [
            'reason' => (string) ($attempt['reason'] ?? 'failed'),
            'output' => isset($attempt['output']) ? (string) $attempt['output'] : null,
        ];
    }

    /**
     * A changed template is in the static cache as the page it rendered
     * before — the reload would show the old page. Flush once per change.
     * A fresh cache (after a deploy or cache:clear) only records where the
     * templates stand: nothing is known to have changed.
     */
    protected static function flushWhenChanged(string $markup): void
    {
        $flushed = Cache::get(self::FLUSHED);

        if ($flushed === $markup) {
            return;
        }

        if ($flushed !== null) {
            Persist::flushStaticCache();
        }

        Cache::forever(self::FLUSHED, $markup);
    }

    /**
     * Path, mtime and size of every file under the folders, and the newest
     * mtime. Dotfiles (editor swap files, .DS_Store) are left out.
     *
     * @param  list<string>  $dirs
     * @return array{sig: string, newest: int}
     */
    protected static function scan(array $dirs): array
    {
        $rows = [];
        $newest = 0;

        foreach ($dirs as $dir) {
            if (! is_dir($dir)) {
                continue;
            }

            $files = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS)
            );

            foreach ($files as $file) {
                if (! $file->isFile() || str_starts_with($file->getFilename(), '.')) {
                    continue;
                }

                $mtime = (int) $file->getMTime();
                $newest = max($newest, $mtime);
                $rows[] = $file->getPathname().':'.$mtime.':'.$file->getSize();
            }
        }

        sort($rows);

        return ['sig' => md5(implode("\n", $rows)), 'newest' => $newest];
    }

    /**
     * The folders behind a signature. `markup` decides when the page reloads;
     * `sources` decides when the site is built.
     *
     * @return list<string>
     */
    protected static function dirs(string $kind): array
    {
        $defaults = [
            'markup' => [resource_path('views'), lang_path()],
            'sources' => [resource_path('views'), resource_path('css'), resource_path('js')],
        ];

        $dirs = config("statamic-visual-editor.live_reload.{$kind}");

        return array_values(array_filter(
            is_array($dirs) ? array_map('strval', $dirs) : $defaults[$kind],
            fn ($dir) => $dir !== ''
        ));
    }

    protected static function buildSignature(): string
    {
        return (string) (@md5_file(static::manifestPath()) ?: '');
    }

    protected static function manifestPath(): string
    {
        return public_path('build/manifest.json');
    }

    protected static function lockPath(): string
    {
        return storage_path('framework/sve-live-reload.lock');
    }
}
