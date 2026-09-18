<?php

namespace MarioHamann\StatamicVisualEditor\FileManager;

/**
 * Which paths the file manager may touch at all.
 *
 * Three separate walls, because any one of them can be got round on its own:
 *   - the extension whitelist decides what a file may be called;
 *   - `realpath()` decides where it may actually sit, after symlinks;
 *   - the excluded folders never appear in the tree at all.
 * Moved verbatim out of FileManager in WP7d.
 */
final class Root
{
    /** Refuse to load anything a browser has no business editing. */
    public const MAX_BYTES = 2000000;

    /**
     * Extensions this opens, creates and deletes. Everything else is invisible.
     *
     * `.php` is absent on purpose: a PHP file under `resources` is still a file
     * this server will execute.
     */
    public const EXTENSIONS = [
        'html',
        'css',
        'js',
        'mjs',
        'vue',
        'md',
        'yaml',
        'yml',
        'json',
        'svg',
        'txt',
    ];

    /**
     * Folders that are built output, someone else's bookkeeping — or a way in.
     *
     * `users` is the one that is not obvious: it holds `roles.yaml` and
     * `groups.yaml`, so a named non-super person given this screen could write
     * themselves a super role and walk out with the site. Statamic has its own
     * screen for both files, behind its own permission. Take it out of the
     * config list if you want it back.
     */
    public const DEFAULT_EXCLUDE = [
        'dist',
        'boost',
        'stubs',
        'node_modules',
        'vendor',
        'users',
    ];

    public static function root(): string
    {
        $configured = config('statamic-visual-editor.file_manager.root');

        return is_string($configured) && $configured !== ''
            ? rtrim(str_replace('\\', '/', $configured), '/')
            : str_replace('\\', '/', resource_path());
    }

    /** The root as the site says it — `resources`, for the header. */
    public static function relativeRoot(): string
    {
        $root = str_replace('\\', '/', static::root());
        $base = str_replace('\\', '/', base_path());

        if (str_starts_with($root, $base.'/')) {
            return ltrim(substr($root, strlen($base)), '/');
        }

        return basename($root);
    }

    /** @return list<string> */
    public static function excluded(): array
    {
        $list = config('statamic-visual-editor.file_manager.exclude', static::DEFAULT_EXCLUDE);

        return array_values(array_filter(array_map('strval', (array) $list)));
    }

    /**
     * Absolute path of an existing, editable file — or null.
     *
     * `realpath()` after the string checks, so a symlink pointing out of the
     * root is caught even though its name looks harmless.
     */
    public static function existingPath(string $relative): ?string
    {
        $rel = static::normalize($relative);

        if (! $rel) {
            return null;
        }

        $root = realpath(static::root());

        if (! $root) {
            return null;
        }

        $full = realpath($root.'/'.$rel);

        if (! $full || ! is_file($full) || ! static::insideRoot($full, $root)) {
            return null;
        }

        return str_replace('\\', '/', $full);
    }

    /** Absolute path of an existing folder inside the root — or null. */
    public static function existingFolder(string $relative): ?string
    {
        $rel = static::normalizeFolder($relative);

        if (! $rel) {
            return null;
        }

        $root = realpath(static::root());

        if (! $root) {
            return null;
        }

        $full = realpath($root.'/'.$rel);

        if (! $full || ! is_dir($full) || ! static::insideRoot($full, $root)) {
            return null;
        }

        return str_replace('\\', '/', $full);
    }

    /**
     * A relative file path this tool accepts, or null.
     *
     * Rejects traversal, absolute paths, dotfiles, excluded folders and any
     * extension outside the whitelist — before the filesystem is touched.
     */
    public static function normalize(string $relative): ?string
    {
        $rel = static::normalizeFolder($relative);

        if (! $rel || ! static::extensionOk($rel)) {
            return null;
        }

        return $rel;
    }

    /** The same rules minus the extension check — for folders. */
    public static function normalizeFolder(string $relative): ?string
    {
        $relative = str_replace('\\', '/', trim($relative));
        $relative = ltrim($relative, '/');

        if ($relative === '' || str_contains($relative, '//')) {
            return null;
        }

        $segments = explode('/', $relative);

        foreach ($segments as $segment) {
            if ($segment === '' || ! static::visible($segment)) {
                return null;
            }

            // Letters, digits, dot, underscore, dash. No spaces, no colons, no
            // anything a shell or a URL would read as punctuation.
            if (! preg_match('/^[A-Za-z0-9][A-Za-z0-9._-]*$/', $segment)) {
                return null;
            }

            if (in_array($segment, static::excluded(), true)) {
                return null;
            }
        }

        return implode('/', $segments);
    }

    /** Not a dotfile, not `.` or `..`. */
    public static function visible(string $name): bool
    {
        return $name !== '' && ! str_starts_with($name, '.');
    }

    public static function extensionOk(string $path): bool
    {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        return in_array($ext, static::EXTENSIONS, true);
    }

    /**
     * Is this absolute path inside the root?
     *
     * Compared with the separator appended so `/resources-old` cannot pass for
     * `/resources`. The root itself is only allowed where a parent folder is
     * what is being checked.
     */
    public static function insideRoot(string $path, string $root, bool $allowRoot = false): bool
    {
        $path = str_replace('\\', '/', $path);
        $root = str_replace('\\', '/', $root);

        if ($allowRoot && $path === $root) {
            return true;
        }

        return str_starts_with($path, $root.'/');
    }

    /**
     * Everything under a folder, files and folders both.
     *
     * @return list<string>
     */
    public static function walk(string $dir): array
    {
        $out = [];

        foreach (@scandir($dir) ?: [] as $name) {
            if ($name === '.' || $name === '..') {
                continue;
            }

            $full = $dir.'/'.$name;
            $out[] = $full;

            if (is_dir($full)) {
                $out = [...$out, ...static::walk($full)];
            }
        }

        return $out;
    }

    public static function relativeFrom(string $path): string
    {
        $root = realpath(static::root()) ?: static::root();
        $path = str_replace('\\', '/', $path);
        $root = str_replace('\\', '/', $root);

        return ltrim(substr($path, strlen($root)), '/');
    }
}
