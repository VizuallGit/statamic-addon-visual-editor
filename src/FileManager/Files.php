<?php

namespace MarioHamann\StatamicVisualEditor\FileManager;

/**
 * Read, write, create, rename and delete one file inside the root.
 * Moved verbatim out of FileManager in WP7d.
 */
final class Files
{
    /**
     * @return array{path: string, name: string, contents: string, language: string}|null
     */
    public static function read(string $relative): ?array
    {
        $path = Root::existingPath($relative);

        if (! $path) {
            return null;
        }

        // A file this big is not something anyone means to edit by hand, and
        // handing it to the browser costs both ends real memory.
        if (filesize($path) > Root::MAX_BYTES) {
            return null;
        }

        $rel = Root::relativeFrom($path);

        return [
            'path' => $rel,
            'name' => basename($rel),
            'contents' => (string) file_get_contents($path),
            'language' => Tree::language($rel),
        ];
    }

    /**
     * @return array{path: string, ok: bool}|null
     */
    public static function write(string $relative, string $contents): ?array
    {
        $path = Root::existingPath($relative);

        if (! $path) {
            return null;
        }

        if (file_put_contents($path, $contents) === false) {
            return null;
        }

        return [
            'path' => Root::relativeFrom($path),
            'ok' => true,
        ];
    }

    /**
     * Make an empty file. The folder above it is created if it is missing —
     * "views/partials/new/thing.antlers.html" is one step, not three.
     *
     * @return array{path: string, name: string, contents: string, language: string}|null
     */
    public static function create(string $relative): ?array
    {
        $rel = Root::normalize($relative);

        if (! $rel || Root::existingPath($rel)) {
            return null;
        }

        $root = realpath(Root::root());

        if (! $root) {
            return null;
        }

        $path = $root.'/'.$rel;
        $dir = dirname($path);

        if (! Root::insideRoot($dir, $root, allowRoot: true)) {
            return null;
        }

        if (! is_dir($dir) && ! mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return null;
        }

        if (file_exists($path) || file_put_contents($path, '') === false) {
            return null;
        }

        return static::read($rel);
    }

    /**
     * Rename or move a file. The target folder is created if it is missing, so
     * this doubles as "move into a new folder".
     *
     * @return array{path: string, name: string, contents: string, language: string}|null
     */
    public static function rename(string $from, string $to): ?array
    {
        $source = Root::existingPath($from);
        $rel = Root::normalize($to);

        if (! $source || ! $rel) {
            return null;
        }

        $root = realpath(Root::root());

        if (! $root) {
            return null;
        }

        $target = $root.'/'.$rel;

        // Refused rather than silently overwriting whatever is already called
        // that. Case-only renames on a case-insensitive disk are the exception:
        // there the target *is* the source.
        if (file_exists($target) && str_replace('\\', '/', realpath($target) ?: $target) !== $source) {
            return null;
        }

        $dir = dirname($target);

        if (! Root::insideRoot($dir, $root, allowRoot: true)) {
            return null;
        }

        if (! is_dir($dir) && ! mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return null;
        }

        return rename($source, $target) ? static::read($rel) : null;
    }

    public static function delete(string $relative): bool
    {
        $path = Root::existingPath($relative);

        return $path ? unlink($path) : false;
    }
}
