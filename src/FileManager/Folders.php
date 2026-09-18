<?php

namespace MarioHamann\StatamicVisualEditor\FileManager;

/**
 * Create, rename and delete a folder inside the root.
 *
 * A folder that holds something this tool cannot see (a `.php` file, a
 * dotfile, an excluded folder) is never moved or deleted: the screen must
 * never take away more than it showed.
 * Moved verbatim out of FileManager in WP7d.
 */
final class Folders
{
    /**
     * Make an empty folder. It has no files yet, so it will not show in the
     * tree until something is put in it — the caller is told the path back so
     * it can offer "new file here" straight away.
     *
     * @return array{path: string}|null
     */
    public static function createFolder(string $relative): ?array
    {
        $rel = Root::normalizeFolder($relative);

        if (! $rel) {
            return null;
        }

        $root = realpath(Root::root());

        if (! $root) {
            return null;
        }

        $path = $root.'/'.$rel;

        if (is_dir($path) || file_exists($path)) {
            return null;
        }

        if (! Root::insideRoot(dirname($path), $root, allowRoot: true)) {
            return null;
        }

        if (! mkdir($path, 0775, true) && ! is_dir($path)) {
            return null;
        }

        return ['path' => $rel];
    }

    /**
     * Rename or move a folder, with everything under it.
     *
     * Refused when it holds something this tool cannot see — same rule as
     * deleting. A move that carries along files the screen never showed is a
     * move nobody agreed to.
     *
     * @return array{path: string}|null
     */
    public static function renameFolder(string $from, string $to): ?array
    {
        $source = Root::existingFolder($from);
        $rel = Root::normalizeFolder($to);

        if (! $source || ! $rel) {
            return null;
        }

        $stats = static::folderStats($from);

        if (! $stats || $stats['hidden'] > 0) {
            return null;
        }

        $root = realpath(Root::root());

        if (! $root) {
            return null;
        }

        $target = $root.'/'.$rel;

        if (file_exists($target) && str_replace('\\', '/', realpath($target) ?: $target) !== $source) {
            return null;
        }

        // Moving a folder inside itself would take the tree with it.
        if (str_starts_with(str_replace('\\', '/', $target).'/', $source.'/')) {
            return null;
        }

        $dir = dirname($target);

        if (! Root::insideRoot($dir, $root, allowRoot: true)) {
            return null;
        }

        if (! is_dir($dir) && ! mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return null;
        }

        return rename($source, $target) ? ['path' => $rel] : null;
    }

    /**
     * What a folder holds, so the browser can say "12 files" before asking.
     *
     * Counts only the files this tool can see — an excluded folder underneath
     * is not something the confirmation should promise to delete, because
     * `deleteFolder()` refuses to.
     *
     * @return array{path: string, files: int, hidden: int}|null
     */
    public static function folderStats(string $relative): ?array
    {
        $path = Root::existingFolder($relative);

        if (! $path) {
            return null;
        }

        $files = 0;
        $hidden = 0;

        foreach (Root::walk($path) as $child) {
            if (is_dir($child)) {
                continue;
            }

            if (Root::visible(basename($child)) && Root::extensionOk($child)) {
                $files++;
            } else {
                $hidden++;
            }
        }

        return [
            'path' => Root::relativeFrom($path),
            'files' => $files,
            'hidden' => $hidden,
        ];
    }

    /**
     * Remove a folder and everything under it.
     *
     * Refused outright when it holds something this tool cannot see — a `.php`
     * file, a dotfile, an excluded folder. Deleting through this screen must
     * never take away more than the screen showed.
     */
    public static function deleteFolder(string $relative): bool
    {
        $path = Root::existingFolder($relative);

        if (! $path) {
            return false;
        }

        $stats = static::folderStats($relative);

        if (! $stats || $stats['hidden'] > 0) {
            return false;
        }

        foreach (Root::walk($path) as $child) {
            if (is_dir($child)) {
                continue;
            }

            if (! unlink($child)) {
                return false;
            }
        }

        // Deepest first, so a directory is empty by the time its turn comes.
        $dirs = [];

        foreach (Root::walk($path) as $child) {
            if (is_dir($child)) {
                $dirs[] = $child;
            }
        }

        usort($dirs, fn ($a, $b) => strlen($b) <=> strlen($a));

        foreach ($dirs as $dir) {
            @rmdir($dir);
        }

        return rmdir($path);
    }
}
