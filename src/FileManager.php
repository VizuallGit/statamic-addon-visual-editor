<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * The site's own code files, browsable from the Control Panel.
 *
 * The template dock and the style manager each open one folder — a section's
 * Antlers file, a stylesheet. This is the same idea widened to everything under
 * `resources`: views, css, js, lang. Saving writes the file on this server.
 *
 * Deliberately *not* the whole project. `app/`, `routes/`, `config/`, `.env`,
 * `composer.json` and `vendor/` are the server's own wiring, and editing them
 * from a browser is remote code execution with extra steps — one compromised
 * super-admin session and the site is someone else's. `content/` is left out
 * too: Statamic has its own screens for it, and writing the raw YAML behind the
 * Stache's back puts the cache out of step with the disk.
 *
 * Three separate walls, because any one of them can be got round on its own:
 *   - the extension whitelist decides what a file may be called;
 *   - `realpath()` decides where it may actually sit, after symlinks;
 *   - the excluded folders never appear in the tree at all.
 */
class FileManager
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

    /**
     * @return array{root: string, tree: list<array<string, mixed>>}
     */
    public static function listing(): array
    {
        $root = static::root();

        return [
            'root' => static::relativeRoot(),
            'tree' => is_dir($root) ? static::scan($root, '') : [],
        ];
    }

    /**
     * @return array{path: string, name: string, contents: string, language: string}|null
     */
    public static function read(string $relative): ?array
    {
        $path = static::existingPath($relative);

        if (! $path) {
            return null;
        }

        // A file this big is not something anyone means to edit by hand, and
        // handing it to the browser costs both ends real memory.
        if (filesize($path) > static::MAX_BYTES) {
            return null;
        }

        $rel = static::relativeFrom($path);

        return [
            'path' => $rel,
            'name' => basename($rel),
            'contents' => (string) file_get_contents($path),
            'language' => static::language($rel),
        ];
    }

    /**
     * @return array{path: string, ok: bool}|null
     */
    public static function write(string $relative, string $contents): ?array
    {
        $path = static::existingPath($relative);

        if (! $path) {
            return null;
        }

        if (file_put_contents($path, $contents) === false) {
            return null;
        }

        return [
            'path' => static::relativeFrom($path),
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
        $rel = static::normalize($relative);

        if (! $rel || static::existingPath($rel)) {
            return null;
        }

        $root = realpath(static::root());

        if (! $root) {
            return null;
        }

        $path = $root.'/'.$rel;
        $dir = dirname($path);

        if (! static::insideRoot($dir, $root, allowRoot: true)) {
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
     * Make an empty folder. It has no files yet, so it will not show in the
     * tree until something is put in it — the caller is told the path back so
     * it can offer "new file here" straight away.
     *
     * @return array{path: string}|null
     */
    public static function createFolder(string $relative): ?array
    {
        $rel = static::normalizeFolder($relative);

        if (! $rel) {
            return null;
        }

        $root = realpath(static::root());

        if (! $root) {
            return null;
        }

        $path = $root.'/'.$rel;

        if (is_dir($path) || file_exists($path)) {
            return null;
        }

        if (! static::insideRoot(dirname($path), $root, allowRoot: true)) {
            return null;
        }

        if (! mkdir($path, 0775, true) && ! is_dir($path)) {
            return null;
        }

        return ['path' => $rel];
    }

    public static function delete(string $relative): bool
    {
        $path = static::existingPath($relative);

        return $path ? unlink($path) : false;
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
        $path = static::existingFolder($relative);

        if (! $path) {
            return null;
        }

        $files = 0;
        $hidden = 0;

        foreach (static::walk($path) as $child) {
            if (is_dir($child)) {
                continue;
            }

            if (static::visible(basename($child)) && static::extensionOk($child)) {
                $files++;
            } else {
                $hidden++;
            }
        }

        return [
            'path' => static::relativeFrom($path),
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
        $path = static::existingFolder($relative);

        if (! $path) {
            return false;
        }

        $stats = static::folderStats($relative);

        if (! $stats || $stats['hidden'] > 0) {
            return false;
        }

        foreach (static::walk($path) as $child) {
            if (is_dir($child)) {
                continue;
            }

            if (! unlink($child)) {
                return false;
            }
        }

        // Deepest first, so a directory is empty by the time its turn comes.
        $dirs = [];

        foreach (static::walk($path) as $child) {
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
    protected static function visible(string $name): bool
    {
        return $name !== '' && ! str_starts_with($name, '.');
    }

    protected static function extensionOk(string $path): bool
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
    protected static function insideRoot(string $path, string $root, bool $allowRoot = false): bool
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
    protected static function walk(string $dir): array
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

    /**
     * The editable tree. Folders whose whole contents are invisible are left
     * out — an empty branch is noise, not information.
     *
     * @return list<array<string, mixed>>
     */
    protected static function scan(string $dir, string $prefix): array
    {
        $items = [];

        foreach (@scandir($dir) ?: [] as $name) {
            if (! static::visible($name) || in_array($name, static::excluded(), true)) {
                continue;
            }

            $rel = $prefix === '' ? $name : $prefix.'/'.$name;
            $full = $dir.'/'.$name;

            if (is_link($full)) {
                continue;
            }

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

            if (! static::extensionOk($name)) {
                continue;
            }

            $items[] = [
                'type' => 'file',
                'path' => $rel,
                'name' => $name,
                'language' => static::language($rel),
            ];
        }

        usort($items, function (array $a, array $b) {
            if ($a['type'] !== $b['type']) {
                return $a['type'] === 'dir' ? -1 : 1;
            }

            return strnatcasecmp($a['name'] ?? '', $b['name'] ?? '');
        });

        return array_values($items);
    }

    /**
     * Which CodeMirror mode opens this file.
     *
     * Antlers is HTML with braces in it, so it gets the HTML mode — the same
     * choice the template dock already makes.
     */
    public static function language(string $relative): string
    {
        $name = strtolower(basename($relative));
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));

        if (str_ends_with($name, '.antlers.html') || $ext === 'html' || $ext === 'svg' || $ext === 'vue') {
            return 'html';
        }

        return match ($ext) {
            'css' => 'css',
            'js', 'mjs', 'json' => 'javascript',
            'yaml', 'yml' => 'yaml',
            default => 'text',
        };
    }

    protected static function relativeFrom(string $path): string
    {
        $root = realpath(static::root()) ?: static::root();
        $path = str_replace('\\', '/', $path);
        $root = str_replace('\\', '/', $root);

        return ltrim(substr($path, strlen($root)), '/');
    }
}
