<?php

namespace MarioHamann\StatamicVisualEditor\SiteCss;

use MarioHamann\StatamicVisualEditor\GitSync;

/**
 * The style manager's file operations: listing, read, write, create,
 * delete, rename.
 * Moved verbatim out of SiteCss in WP7d.
 */
final class Files
{
    /**
     * @return array{root: string, tree: list<array<string, mixed>>}
     */
    public static function listing(): array
    {
        $root = Root::root();

        return [
            'root' => Root::relativeRoot(),
            'tree' => is_dir($root) ? static::scan($root, '') : [],
        ];
    }

    public static function read(string $relative): ?array
    {
        $path = Root::existingPath($relative);

        if (! $path) {
            return null;
        }

        $rel = Root::relativeFrom($path);

        return [
            'path' => $rel,
            'css' => (string) file_get_contents($path),
            'imported' => $rel === Root::ENTRY || Imports::isImported($rel),
        ];
    }

    public static function write(string $relative, string $css): ?array
    {
        $path = Root::existingPath($relative);

        if (! $path) {
            return null;
        }

        file_put_contents($path, $css);
        GitSync::after('site CSS');

        $rel = Root::relativeFrom($path);

        return [
            'path' => $rel,
            'ok' => true,
            'imported' => $rel === Root::ENTRY || Imports::isImported($rel),
        ];
    }

    /**
     * Create an empty stylesheet and, unless it is `site.css` itself,
     * append an `@import` to the entry so Vite actually loads it.
     */
    public static function create(string $relative): ?array
    {
        $rel = Root::normalize($relative, creating: true);

        if (! $rel || Root::excluded($rel) || Root::existingPath($rel)) {
            return null;
        }

        $path = Root::root().'/'.$rel;
        $dir = dirname($path);

        if (! is_dir($dir) && ! mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return null;
        }

        if (file_exists($path)) {
            return null;
        }

        file_put_contents($path, "/* {$rel} */\n");
        GitSync::after('site CSS file created');

        if ($rel !== Root::ENTRY) {
            Imports::ensureImport($rel);
        }

        return static::read($rel);
    }

    /**
     * Delete a stylesheet, and take its `@import` out of the entry with it.
     *
     * `site.css` itself is refused: it is the Vite entry, and a site without one
     * has no stylesheet at all.
     */
    public static function delete(string $relative): bool
    {
        $path = Root::existingPath($relative);

        if (! $path) {
            return false;
        }

        $rel = Root::relativeFrom($path);

        if ($rel === Root::ENTRY) {
            return false;
        }

        // Import first: a file removed from disk while the entry still names it
        // breaks the build, and that is the half nobody would think to check.
        Imports::removeImport($rel);

        if (! unlink($path)) {
            return false;
        }

        GitSync::after('site CSS file removed');

        return true;
    }

    /**
     * Rename a stylesheet, and rewrite the `@import` that names it.
     *
     * @return array{path: string, css: string, imported: bool}|null
     */
    public static function rename(string $from, string $to): ?array
    {
        $source = Root::existingPath($from);
        $rel = Root::normalize($to, creating: true);

        if (! $source || ! $rel || Root::excluded($rel)) {
            return null;
        }

        $was = Root::relativeFrom($source);

        if ($was === Root::ENTRY || $rel === Root::ENTRY) {
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

        $dir = dirname($target);

        if (! is_dir($dir) && ! mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return null;
        }

        $wasImported = Imports::isImported($was);

        if (! rename($source, $target)) {
            return null;
        }

        GitSync::after('site CSS file renamed');

        Imports::removeImport($was);

        if ($wasImported) {
            Imports::ensureImport($rel);
        }

        return static::read($rel);
    }

    /**
     * @return list<array<string, mixed>>
     */
    protected static function scan(string $dir, string $prefix): array
    {
        $items = [];
        $entries = @scandir($dir) ?: [];

        foreach ($entries as $name) {
            if ($name === '.' || $name === '..' || str_starts_with($name, '.')) {
                continue;
            }

            $rel = $prefix === '' ? $name : $prefix.'/'.$name;
            $full = $dir.'/'.$name;

            if (is_dir($full)) {
                $children = static::scan($full, $rel);

                if ($children === []) {
                    continue;
                }

                $items[] = [
                    'type' => 'dir',
                    'path' => $rel,
                    'name' => $name,
                    'children' => $children,
                ];

                continue;
            }

            if (! str_ends_with(strtolower($name), '.css') || Root::excluded($rel)) {
                continue;
            }

            $items[] = [
                'type' => 'file',
                'path' => $rel,
                'name' => $name,
                'imported' => $rel === Root::ENTRY || Imports::isImported($rel),
            ];
        }

        usort($items, function (array $a, array $b) {
            if ($a['type'] !== $b['type']) {
                return $a['type'] === 'dir' ? -1 : 1;
            }

            if (($a['name'] ?? '') === Root::ENTRY) {
                return -1;
            }

            if (($b['name'] ?? '') === Root::ENTRY) {
                return 1;
            }

            return strnatcasecmp($a['name'] ?? '', $b['name'] ?? '');
        });

        return array_values($items);
    }
}
