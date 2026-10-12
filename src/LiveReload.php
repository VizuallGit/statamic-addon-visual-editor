<?php

namespace MarioHamann\StatamicVisualEditor;

use FilesystemIterator;
use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTemplateController\Persist;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * Live reload for the public site and for Live Preview. A developer edits the
 * site's files on the server — VS Code or Cursor over SSH, Site Files, the
 * dock — and the page they have open follows, the way `npm run dev` does on a
 * laptop.
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
 * The poll is held open (`await`). The page sends the signatures it holds;
 * the request looks again every TICK ms and answers the moment one differs,
 * or after HOLD seconds with nothing to say. A save is seen within about a
 * tick, not at the next poll a second later, and an idle tab costs one
 * request per hold instead of one a second.
 *
 * One thing is told rather than read: which saves were the editor's own.
 * Live Preview already shows what the dock or Site Files just wrote; what it
 * has to react to is a save made outside the editor. `RecordEditorWrite`
 * stamps every write through the editor's own routes (`writing`, `wrote`),
 * and the answer says whether the markup as it stands is one of them (`own`).
 * The public page's button does not ask: it reloads on any change.
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
     * An editor write under way: whose session, and since when. Stamped by
     * RecordEditorWrite before the route runs; one slot for everybody.
     */
    protected const WRITING = 'sve-live-reload:writing';

    /** The editor's last finished write: whose session, when, and the markup it left. */
    protected const OWN = 'sve-live-reload:own';

    /**
     * Seconds a poll that names its signatures is held open. Long enough that
     * an idle tab asks rarely; short enough to stay far below PHP's execution
     * limit, and for a build that should start to wait no longer than this.
     * Read through hold(), which the config can override.
     */
    public const HOLD = 3.0;

    /**
     * Milliseconds between two looks while a poll is held. One look is a stat
     * of every markup and source file (about 2 ms for a site of 300 files).
     * Read through tick(), which the config can override.
     */
    public const TICK = 100;

    /**
     * Milliseconds a change that does not look like the editor's waits for a
     * second look before it is answered as a save from outside. See await().
     */
    protected const GRACE = 150;

    /**
     * Seconds a write under way counts for its session. The dock's save
     * compiles Tailwind after the template is on disk, which can take a
     * second; a worker killed mid-request must not make every later save
     * look like the editor's for good.
     */
    protected const WRITE_WINDOW = 15;

    /** Seconds after a finished write in which any change still counts as it. */
    protected const SETTLE = 0.5;

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
     * What the poll answers, at once. `stale` and `sources` are for the
     * controller, which starts the build after the response is sent. `own`
     * is for Live Preview (see own()); `css` is the built stylesheet's href,
     * so Live Preview can swap it in when `build` changes instead of
     * reloading a page it must not leave.
     *
     * @return array{markup: string, build: string, building: bool, error: array{reason: string, output: ?string}|null, own: bool, css: ?string, stale: bool, sources: string}
     */
    public static function status(?string $session = null): array
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
            'own' => static::own($markup['sig'], $session),
            'css' => SiteBuild::entryCss(),
            'stale' => static::stale($sources, $attempt),
            'sources' => $sources['sig'],
        ];
    }

    /**
     * The poll, held open: `status()`, answered as soon as there is something
     * to say about the signatures the page holds — the markup or the build
     * differs, or a build should start (the controller starts it after this
     * answer, so it must not wait out the hold) — or when the hold is over.
     *
     * A markup change that is not the editor's own gets a second look a GRACE
     * later before it is answered. The "writing" stamp is one slot for every
     * session and any finished write ends it, so when two editor requests
     * overlap — two editors, or the dock's save beside a panel's — a poll can
     * see a file before the request that wrote it has stamped it as its own.
     * The second look gives that request a moment to finish. It answers
     * either way, with `own` as it stands then; nothing is adopted, so the
     * page learns the new signature from this answer.
     *
     * Holds no lock: Laravel's session drivers take none, and the controller
     * reads the session again after the hold (see LiveReloadController).
     *
     * @param  array{markup: string, build: string}  $have  the signatures the page holds
     * @param  float|null  $hold  seconds; null reads hold()
     * @param  int|null  $tickMs  milliseconds between looks; null reads tick()
     * @return array{markup: string, build: string, building: bool, error: array{reason: string, output: ?string}|null, own: bool, css: ?string, stale: bool, sources: string}
     */
    public static function await(array $have, ?string $session, ?float $hold = null, ?int $tickMs = null): array
    {
        $hold ??= static::hold();
        $tickMs ??= static::tick();
        $until = microtime(true) + $hold;
        $graced = false;

        while (true) {
            $status = static::status($session);
            $markupChanged = $status['markup'] !== $have['markup'];

            if ($markupChanged && ! $status['own'] && ! $graced) {
                $graced = true;
                usleep(self::GRACE * 1000);

                continue;
            }

            if ($markupChanged
                || $status['build'] !== $have['build']
                || ($status['stale'] && ! $status['building'])) {
                return $status;
            }

            $left = $until - microtime(true);

            if ($left <= 0) {
                return $status;
            }

            usleep((int) round(min($tickMs / 1000, $left) * 1_000_000));
        }
    }

    /**
     * An editor write is starting (RecordEditorWrite, before the route runs).
     * Sixty seconds in the cache is only a ceiling; own() reads it for
     * WRITE_WINDOW seconds at most.
     */
    public static function writing(?string $session): void
    {
        Cache::put(self::WRITING, ['session' => $session, 'at' => microtime(true)], 60);
    }

    /**
     * An editor write has finished well (RecordEditorWrite, after a 2xx): the
     * markup as it stands now is this session's own.
     */
    public static function wrote(?string $session): void
    {
        clearstatcache();

        Cache::forever(self::OWN, [
            'sig' => static::scan(static::dirs('markup'))['sig'],
            'session' => $session,
            'at' => microtime(true),
        ]);
    }

    /**
     * An editor write has ended without success (RecordEditorWrite, after
     * anything but a 2xx). Nothing is recorded as the editor's, and the
     * session's "writing" stamp goes: left standing, it would make every save
     * from outside in the next WRITE_WINDOW seconds look like the editor's.
     * A refused save that did change a file then reads as a change from
     * outside, and Live Preview renders it — late is allowed, wrong is not.
     */
    public static function writeFailed(?string $session): void
    {
        $writing = Cache::get(self::WRITING);

        if (is_array($writing) && ($writing['session'] ?? null) === $session) {
            Cache::forget(self::WRITING);
        }
    }

    /**
     * Is the markup as it stands this session's own editor write? A request
     * without a session is never matched to an editor. Any one of three:
     *
     * (a) The markup is exactly what this session's last finished write left
     *     behind. The usual case: the dock's autosave wrote the template, the
     *     request ended, the poll sees the file as the stamp recorded it.
     * (b) A write of this session is under way: stamped at its start, not yet
     *     at its end. The dock's save writes the template and then compiles
     *     Tailwind in the same request, which can take a second; the poll sees
     *     the new file in between. Bounded by WRITE_WINDOW, and ended by any
     *     finished write stamped after it — from then on (a) answers.
     * (c) This session's write finished a moment ago (SETTLE). Work the save
     *     set off after its response — an `afterResponse` job, a terminating
     *     callback — can touch a file once the stamp was taken.
     *
     * What this cannot tell apart: a save from outside that lands while the
     * same session's editor request is running counts as the editor's. The
     * window is that request's length.
     */
    public static function own(string $markup, ?string $session): bool
    {
        if ($session === null) {
            return false;
        }

        $own = Cache::get(self::OWN);
        $own = is_array($own) ? $own : null;
        $writing = Cache::get(self::WRITING);
        $writing = is_array($writing) ? $writing : null;
        $now = microtime(true);
        $mine = $own !== null && ($own['session'] ?? null) === $session;

        if ($mine && ($own['sig'] ?? null) === $markup) {
            return true;
        }

        if ($writing !== null
            && ($writing['session'] ?? null) === $session
            && $now - (float) ($writing['at'] ?? 0) < self::WRITE_WINDOW
            && ($own === null || (float) ($own['at'] ?? 0) < (float) $writing['at'])) {
            return true;
        }

        return $mine && $now - (float) ($own['at'] ?? 0) < self::SETTLE;
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

    /**
     * HOLD, unless `live_reload.hold` (seconds) says otherwise — the tests
     * hold for a fraction of a second.
     */
    protected static function hold(): float
    {
        return max(0.0, (float) config('statamic-visual-editor.live_reload.hold', self::HOLD));
    }

    /** TICK, unless `live_reload.tick_ms` says otherwise; never under 10 ms. */
    protected static function tick(): int
    {
        return max(10, (int) config('statamic-visual-editor.live_reload.tick_ms', self::TICK));
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
