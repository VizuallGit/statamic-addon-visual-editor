<?php

namespace MarioHamann\StatamicVisualEditor\DockGhost;

use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\Background;
use MarioHamann\StatamicVisualEditor\DockGhost;
use Statamic\Facades\User;

/**
 * One question to the dock's AI, answered in the background.
 *
 * On the Cursor key an answer takes 13–26 s, and the web server ends a
 * request at 30 s — the demo's nginx and PHP-FPM both, server-wide, and
 * not ours to change. So the web request only starts the work: it writes
 * the question to a small JSON file, starts `artisan sve:ghost-job {id}` as
 * a detached process no web server can end, and answers at once with the
 * id. The worker writes the answer into the same file; the browser asks
 * for it (`/!/sve/dock-ghost/job/{id}`) until it is there.
 *
 * The worker is started by `Background`.
 *
 * A file is `{kind, request, user, state, started}`, and once done also
 * `{result, finished}`. Files older than KEEP are swept when the next job
 * starts.
 */
final class Job
{
    /** `complete` is grey text, `edit` is ⌘K. */
    public const KINDS = ['complete', 'edit'];

    /** Seconds a job file is kept. */
    public const KEEP = 600;

    /** Seconds a job may stay pending before it counts as lost: the runner's own deadline is 185 s. */
    public const STALE = 200;

    public static function directory(): string
    {
        return storage_path('statamic-visual-editor/ghost-jobs');
    }

    /** Writes the job, starts its worker and returns its id. */
    public static function start(string $kind, array $request): string
    {
        $id = (string) Str::uuid();
        $user = (string) User::current()?->id();

        static::sweep();
        static::write($id, [
            'kind' => in_array($kind, static::KINDS, true) ? $kind : 'complete',
            'request' => $request,
            'user' => $user,
            'state' => 'pending',
            'started' => static::now(),
        ]);

        DockGhost::claim($user, $kind, $id);

        Background::artisan('sve:ghost-job', $id);

        return $id;
    }

    /** The job, or null when there is none by that id (or the id is not one). */
    public static function read(string $id): ?array
    {
        if (! preg_match('/^[0-9a-f-]{36}$/', $id) || ! is_file(static::path($id))) {
            return null;
        }

        $job = json_decode((string) @file_get_contents(static::path($id)), true);

        return is_array($job) ? $job : null;
    }

    /** The worker's answer, in DockGhost::complete()'s / edit()'s shape. */
    public static function finish(string $id, array $result): void
    {
        $job = static::read($id);

        if ($job === null) {
            return;
        }

        static::write($id, ['state' => 'done', 'result' => $result, 'finished' => static::now()] + $job);
    }

    /** Still pending after STALE: its worker is gone. */
    public static function stale(array $job): bool
    {
        return ($job['state'] ?? '') !== 'done' && static::now() - (int) ($job['started'] ?? 0) > static::STALE * 1000;
    }

    /** Job files older than KEEP, gone. */
    public static function sweep(): void
    {
        foreach (glob(static::directory().'/*') ?: [] as $path) {
            if (is_file($path) && filemtime($path) < time() - static::KEEP) {
                @unlink($path);
            }
        }
    }

    protected static function path(string $id): string
    {
        return static::directory().'/'.$id.'.json';
    }

    /** Whole or not at all: the browser may read the file while the worker writes it. */
    protected static function write(string $id, array $job): void
    {
        $dir = static::directory();

        if (! is_dir($dir) && ! @mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return;
        }

        $tmp = static::path($id).'.'.getmypid().'.tmp';

        file_put_contents($tmp, json_encode($job, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        rename($tmp, static::path($id));
    }

    /** Milliseconds. */
    protected static function now(): int
    {
        return (int) floor(microtime(true) * 1000);
    }
}
