<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * After a Cursor agent run, drop writes outside the allowlist — but only
 * files the agent itself just changed. Already-dirty site files (addon
 * settings, content, assets) stay as the user left them.
 */
class AiWriteGuard
{
    public const MAX_SNAPSHOT_BYTES = 200000;

    /**
     * @return array<string, string|false>
     */
    public static function snapshot(): array
    {
        $out = [];

        foreach (static::changedRelativePaths() as $path) {
            if (AiFiles::allowed($path)) {
                continue;
            }

            $full = static::absolute($path);

            if (! is_file($full) || filesize($full) > static::MAX_SNAPSHOT_BYTES) {
                $out[$path] = false;

                continue;
            }

            $out[$path] = (string) file_get_contents($full);
        }

        return $out;
    }

    /**
     * Contents of every allowed AI file, so Write mode can undo the agent.
     *
     * @return array<string, string|false>
     */
    public static function snapshotAllowed(): array
    {
        $out = [];

        foreach (static::allowedFiles() as $relative => $full) {
            if (! is_file($full) || filesize($full) > static::MAX_SNAPSHOT_BYTES) {
                $out[$relative] = false;

                continue;
            }

            $out[$relative] = (string) file_get_contents($full);
        }

        ksort($out);

        return $out;
    }

    /**
     * Undo agent writes under the allowlist. Files that were already dirty
     * before the run stay as the user left them — Write must not revert a
     * template they were editing in the dock while the agent thought.
     *
     * @param  array<string, string|false>  $before
     * @param  list<string>  $dirtyBefore
     */
    public static function restoreAllowed(array $before, array $dirtyBefore = []): void
    {
        $dirty = [];

        foreach ($dirtyBefore as $path) {
            $dirty[str_replace('\\', '/', $path)] = true;
        }

        $now = [];

        foreach (static::allowedFiles() as $relative => $full) {
            $now[$relative] = $full;

            if (! array_key_exists($relative, $before)) {
                static::discardFile($full);
                static::pruneEmptyDirs(dirname($full));

                continue;
            }

            if ($before[$relative] === false || isset($dirty[$relative])) {
                continue;
            }

            $current = is_file($full) ? (string) file_get_contents($full) : '';

            if ($current !== $before[$relative]) {
                file_put_contents($full, $before[$relative]);
            }
        }

        foreach ($before as $relative => $contents) {
            if (! is_string($contents) || isset($now[$relative]) || isset($dirty[$relative])) {
                continue;
            }

            $path = AiFiles::resolve($relative, false);

            if ($path) {
                file_put_contents($path, $contents);
            }
        }
    }

    /**
     * @param  array<string, string|false>  $before
     */
    public static function restore(array $before): void
    {
        foreach (static::changedRelativePaths() as $path) {
            if (AiFiles::allowed($path)) {
                continue;
            }

            $full = static::absolute($path);

            if (array_key_exists($path, $before)) {
                if (is_string($before[$path])) {
                    file_put_contents($full, $before[$path]);
                }

                continue;
            }

            static::discard($path, $full);
        }
    }

    /**
     * @return list<string>
     */
    public static function changedRelativePaths(): array
    {
        $lines = [];

        exec('git -C '.escapeshellarg(base_path()).' status --porcelain -uall', $lines);

        $out = [];

        foreach ($lines as $line) {
            $path = static::gitPath($line);

            if ($path !== null) {
                $out[] = $path;
            }
        }

        return $out;
    }

    public static function gitPath(string $line): ?string
    {
        if (strlen($line) < 4) {
            return null;
        }

        $path = trim(substr($line, 3));

        if (str_contains($path, ' -> ')) {
            $path = trim((string) substr($path, strrpos($path, ' -> ') + 4));
        }

        $path = trim($path, '"');

        return $path !== '' && ! str_contains($path, '..') ? $path : null;
    }

    protected static function discard(string $relative, string $absolute): void
    {
        if (is_file($absolute)) {
            static::discardFile($absolute);

            return;
        }

        exec('git -C '.escapeshellarg(base_path()).' restore --worktree --staged -- '.escapeshellarg($relative).' 2>/dev/null');
    }

    /**
     * @return array<string, string>
     */
    protected static function allowedFiles(): array
    {
        $out = [];

        foreach (AiFiles::roots() as $root) {
            if (! is_dir($root)) {
                continue;
            }

            $iter = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS)
            );

            foreach ($iter as $file) {
                if (! $file->isFile()) {
                    continue;
                }

                $full = $file->getPathname();
                $relative = str_replace('\\', '/', SectionTemplate::relative($full));

                if (AiFiles::allowed($relative)) {
                    $out[$relative] = $full;
                }
            }
        }

        return $out;
    }

    protected static function discardFile(string $absolute): void
    {
        if (is_file($absolute)) {
            @unlink($absolute);
        }
    }

    protected static function pruneEmptyDirs(string $dir): void
    {
        $roots = [];

        foreach (AiFiles::roots() as $root) {
            $real = realpath($root);

            if ($real) {
                $roots[$real] = true;
            }
        }

        while ($dir !== '' && is_dir($dir)) {
            $real = realpath($dir);

            if ($real === false || isset($roots[$real])) {
                break;
            }

            $entries = @scandir($dir);

            if ($entries === false || count(array_diff($entries, ['.', '..'])) > 0) {
                break;
            }

            $parent = dirname($dir);
            @rmdir($dir);
            $dir = $parent;
        }
    }

    protected static function absolute(string $relative): string
    {
        return base_path(str_replace('/', DIRECTORY_SEPARATOR, $relative));
    }
}
