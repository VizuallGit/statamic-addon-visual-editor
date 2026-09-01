<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * The site's own stylesheets under `resources/css`.
 *
 * Live Preview's style manager reads and writes these files. `site.css` is
 * the Vite entry; other files only reach the page if that file imports them.
 * `cp.css` is Control Panel CSS and stays out of the tree.
 */
class SiteCss
{
    public const ENTRY = 'site.css';

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

    public static function read(string $relative): ?array
    {
        $path = static::existingPath($relative);

        if (! $path) {
            return null;
        }

        $rel = static::relativeFrom($path);

        return [
            'path' => $rel,
            'css' => (string) file_get_contents($path),
            'imported' => $rel === self::ENTRY || static::isImported($rel),
        ];
    }

    public static function write(string $relative, string $css): ?array
    {
        $path = static::existingPath($relative);

        if (! $path) {
            return null;
        }

        file_put_contents($path, $css);

        $rel = static::relativeFrom($path);

        return [
            'path' => $rel,
            'ok' => true,
            'imported' => $rel === self::ENTRY || static::isImported($rel),
        ];
    }

    /**
     * Create an empty stylesheet and, unless it is `site.css` itself,
     * append an `@import` to the entry so Vite actually loads it.
     */
    public static function create(string $relative): ?array
    {
        $rel = static::normalize($relative, creating: true);

        if (! $rel || static::excluded($rel) || static::existingPath($rel)) {
            return null;
        }

        $path = static::root().'/'.$rel;
        $dir = dirname($path);

        if (! is_dir($dir) && ! mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return null;
        }

        if (file_exists($path)) {
            return null;
        }

        file_put_contents($path, "/* {$rel} */\n");

        if ($rel !== self::ENTRY) {
            static::ensureImport($rel);
        }

        return static::read($rel);
    }

    public static function ensureImport(string $relative): bool
    {
        $rel = static::normalize($relative);

        if (! $rel || $rel === self::ENTRY || static::excluded($rel)) {
            return false;
        }

        if (static::isImported($rel)) {
            return true;
        }

        $entry = static::existingPath(self::ENTRY);

        if (! $entry) {
            return false;
        }

        $css = (string) file_get_contents($entry);
        $line = static::importLine($rel);
        $patched = static::insertImport($css, $line);

        if ($patched === $css) {
            return false;
        }

        file_put_contents($entry, $patched);

        return true;
    }

    public static function isImported(string $relative): bool
    {
        $rel = static::normalize($relative);

        if (! $rel) {
            return false;
        }

        $entry = static::existingPath(self::ENTRY);

        if (! $entry) {
            return false;
        }

        $css = (string) file_get_contents($entry);
        $stem = preg_replace('/\.css$/', '', $rel);

        foreach ([$rel, $stem] as $needle) {
            if (
                str_contains($css, '"./'.$needle.'"')
                || str_contains($css, "'./".$needle."'")
            ) {
                return true;
            }
        }

        return false;
    }

    public static function root(): string
    {
        $configured = config('statamic-visual-editor.site_css.root');

        return is_string($configured) && $configured !== ''
            ? rtrim($configured, '/')
            : resource_path('css');
    }

    public static function relativeRoot(): string
    {
        $root = str_replace('\\', '/', static::root());
        $base = str_replace('\\', '/', base_path());

        if (str_starts_with($root, $base.'/')) {
            return ltrim(substr($root, strlen($base)), '/');
        }

        return 'resources/css';
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

            if (! str_ends_with(strtolower($name), '.css') || static::excluded($rel)) {
                continue;
            }

            $items[] = [
                'type' => 'file',
                'path' => $rel,
                'name' => $name,
                'imported' => $rel === self::ENTRY || static::isImported($rel),
            ];
        }

        usort($items, function (array $a, array $b) {
            if ($a['type'] !== $b['type']) {
                return $a['type'] === 'dir' ? -1 : 1;
            }

            if (($a['name'] ?? '') === self::ENTRY) {
                return -1;
            }

            if (($b['name'] ?? '') === self::ENTRY) {
                return 1;
            }

            return strnatcasecmp($a['name'] ?? '', $b['name'] ?? '');
        });

        return array_values($items);
    }

    public static function existingPath(string $relative): ?string
    {
        $rel = static::normalize($relative);

        if (! $rel || static::excluded($rel)) {
            return null;
        }

        $root = realpath(static::root());

        if (! $root) {
            return null;
        }

        $full = realpath($root.'/'.$rel);

        if (! $full || ! is_file($full) || ! str_starts_with($full, $root.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return $full;
    }

    public static function normalize(string $relative, bool $creating = false): ?string
    {
        $relative = str_replace('\\', '/', trim($relative));
        $relative = ltrim($relative, '/');

        if ($relative === '' || str_contains($relative, '..') || str_contains($relative, '//')) {
            return null;
        }

        if ($creating && ! str_ends_with(strtolower($relative), '.css')) {
            if (! preg_match('/^[A-Za-z0-9][A-Za-z0-9_\-\/]*$/', $relative)) {
                return null;
            }

            $relative .= '.css';
        }

        if (! preg_match('/^[A-Za-z0-9][A-Za-z0-9_\-\/]*\.css$/', $relative)) {
            return null;
        }

        return $relative;
    }

    protected static function excluded(string $relative): bool
    {
        $name = basename($relative);
        $list = config('statamic-visual-editor.site_css.exclude', ['cp.css']);

        return in_array($name, (array) $list, true);
    }

    protected static function relativeFrom(string $path): string
    {
        $root = realpath(static::root()) ?: static::root();
        $path = str_replace('\\', '/', $path);
        $root = str_replace('\\', '/', $root);

        return ltrim(substr($path, strlen($root)), '/');
    }

    protected static function importLine(string $relative): string
    {
        $stem = preg_replace('/\.css$/', '', $relative);
        $layer = str_starts_with($relative, 'utilities/')
            ? 'utilities'
            : (str_starts_with($relative, 'compositions/') ? 'compositions' : 'base');

        return '@import "./'.$stem.'" layer('.$layer.');';
    }

    protected static function insertImport(string $css, string $line): string
    {
        if (preg_match_all('/^@import[^\n]*$/m', $css, $matches, PREG_OFFSET_CAPTURE)) {
            $last = $matches[0][array_key_last($matches[0])];
            $at = $last[1] + strlen($last[0]);

            return substr($css, 0, $at)."\n".$line.substr($css, $at);
        }

        return $line."\n".$css;
    }
}
