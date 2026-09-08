<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\File;

/**
 * Earlier versions of the Antlers files the dock writes.
 *
 * The editor's own undo dies with the page: reload the Control Panel and a
 * morning's work has no way back. This is the copy that survives — kept next
 * to the comments, because it is this site's data and not the addon's.
 *
 * What is stored is the file *before* each write, so restoring an entry puts
 * you back to how it looked at that moment. The dock saves on every keystroke,
 * so writes are coalesced: one version per `COALESCE` seconds of editing, and
 * nothing at all while the text is unchanged. After a quiet spell the next
 * keystroke stores the untouched file, which is the version anyone actually
 * comes looking for.
 */
class TemplateHistory
{
    /** At most one version per this many seconds of editing. */
    public const COALESCE = 45;

    /**
     * Versions kept per file. Older ones are pruned on write.
     *
     * A busy hour of editing writes one every 45 seconds, so 40 was half a
     * working day. At roughly 5 KB a version this is a couple of megabytes
     * per section at worst, for something you only miss when you need it.
     */
    public const KEEP = 300;

    public static function root(): string
    {
        return storage_path('statamic-visual-editor/history');
    }

    public static function dir(string $path): string
    {
        return static::root().'/'.static::key($path);
    }

    /** The file as it stands now, kept before something overwrites it. */
    public static function record(string $path): void
    {
        if (! is_file($path)) {
            return;
        }

        $contents = (string) file_get_contents($path);

        if (trim($contents) === '') {
            return;
        }

        $dir = static::dir($path);
        $newest = static::files($dir)[0] ?? null;

        if ($newest !== null) {
            if (time() - static::timeOf($newest) < static::COALESCE) {
                return;
            }

            if ((string) @file_get_contents($newest) === $contents) {
                return;
            }
        }

        if (! File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        File::put($dir.'/'.static::stamp().'.html', $contents);
        static::prune($dir);
    }

    /**
     * @return list<array{id: string, at: int, bytes: int}> newest first
     */
    public static function entries(string $path): array
    {
        $out = [];

        foreach (static::files(static::dir($path)) as $file) {
            $out[] = [
                'id' => pathinfo($file, PATHINFO_FILENAME),
                'at' => static::timeOf($file),
                'bytes' => (int) @filesize($file),
            ];
        }

        return $out;
    }

    public static function read(string $path, string $id): ?string
    {
        if (! preg_match('/^\d{1,20}$/', $id)) {
            return null;
        }

        $file = static::dir($path).'/'.$id.'.html';

        return is_file($file) ? (string) file_get_contents($file) : null;
    }

    /** One folder per file, named after where the file lives in the site. */
    protected static function key(string $path): string
    {
        $relative = SectionTemplate::relative($path);
        $safe = trim((string) preg_replace('/[^A-Za-z0-9._-]+/', '_', $relative), '_');

        return $safe !== '' ? $safe : 'template';
    }

    /** Milliseconds, so two writes in the same second cannot collide. */
    protected static function stamp(): string
    {
        return (string) (int) round(microtime(true) * 1000);
    }

    protected static function timeOf(string $file): int
    {
        return (int) floor(((int) pathinfo($file, PATHINFO_FILENAME)) / 1000);
    }

    /**
     * @return list<string> absolute paths, newest first
     */
    protected static function files(string $dir): array
    {
        if (! is_dir($dir)) {
            return [];
        }

        $files = glob($dir.'/*.html') ?: [];

        usort($files, fn ($a, $b) => static::timeOf($b) <=> static::timeOf($a));

        return array_values($files);
    }

    protected static function prune(string $dir): void
    {
        foreach (array_slice(static::files($dir), static::KEEP) as $old) {
            @unlink($old);
        }
    }
}
