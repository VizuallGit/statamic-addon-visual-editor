<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * Resolve an Antlers `{{ partial src }}` to view files the dock can open.
 *
 * `{type}` (or any `{name}`) means every `.antlers.html` in that folder.
 * Paths stay under `resources/views`.
 */
class DockPartial
{
    /**
     * @return list<array{label: string, type: string, path: string}>
     */
    public static function resolve(string $src): array
    {
        $src = static::normalizeSrc($src);

        if ($src === null) {
            return [];
        }

        if (static::hasToken($src)) {
            return static::listFolder($src);
        }

        $item = static::oneFile($src);

        return $item ? [$item] : [];
    }

    public static function normalizeSrc(string $src): ?string
    {
        $src = str_replace('\\', '/', trim($src));
        $src = preg_replace('/\.(antlers\.html|blade\.php)$/i', '', $src) ?? $src;
        $src = trim($src, '/');

        if ($src === '' || str_contains($src, '..') || str_starts_with($src, '/')) {
            return null;
        }

        if (! preg_match('#^[A-Za-z0-9_{}][A-Za-z0-9_{}/.-]*$#', $src)) {
            return null;
        }

        return $src;
    }

    public static function hasToken(string $src): bool
    {
        return (bool) preg_match('/\{[A-Za-z_][A-Za-z0-9_]*\}/', $src);
    }

    /**
     * @return list<array{label: string, type: string, path: string}>
     */
    protected static function listFolder(string $src): array
    {
        $prefix = static::folderPrefix($src);

        if ($prefix === null) {
            return [];
        }

        $dir = static::firstExistingDir($prefix);
        $views = realpath(resource_path('views'));

        if ($dir === null || ! is_string($views)) {
            return [];
        }

        $out = [];

        foreach (scandir($dir) ?: [] as $name) {
            if (! str_ends_with($name, '.antlers.html')) {
                continue;
            }

            $real = realpath($dir.DIRECTORY_SEPARATOR.$name);

            if (! is_string($real) || ! is_file($real) || ! str_starts_with($real, $views.DIRECTORY_SEPARATOR)) {
                continue;
            }

            $item = static::itemFromAbsolute($real, $views);

            if ($item !== null) {
                $out[] = $item;
            }
        }

        usort($out, fn (array $a, array $b) => strnatcasecmp($a['label'], $b['label']));

        return $out;
    }

    /**
     * @return array{label: string, type: string, path: string}|null
     */
    protected static function oneFile(string $src): ?array
    {
        $full = static::firstExistingFile($src);
        $views = realpath(resource_path('views'));

        if ($full === null || ! is_string($views)) {
            return null;
        }

        $real = realpath($full);

        if (! is_string($real) || ! str_starts_with($real, $views.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return static::itemFromAbsolute($real, $views);
    }

    /**
     * @return array{label: string, type: string, path: string}|null
     */
    protected static function itemFromAbsolute(string $real, string $views): ?array
    {
        $rel = substr($real, strlen($views) + 1);
        $view = preg_replace('/\.antlers\.html$/', '', str_replace('\\', '/', $rel)) ?? '';

        if ($view === '') {
            return null;
        }

        return [
            'label' => basename($view),
            'type' => CollectionViewFile::PREFIX.$view,
            'path' => SectionTemplate::relative($real),
        ];
    }

    protected static function folderPrefix(string $src): ?string
    {
        $cut = preg_replace('/\{[A-Za-z_][A-Za-z0-9_]*\}.*$/', '', $src) ?? '';
        $cut = trim($cut, '/');

        return $cut === '' ? null : $cut;
    }

    /**
     * @return list<string>
     */
    protected static function candidates(string $rel): array
    {
        $rel = trim($rel, '/');

        if (str_starts_with($rel, 'partials/')) {
            return [resource_path('views/'.$rel)];
        }

        return [
            resource_path('views/partials/'.$rel),
            resource_path('views/'.$rel),
        ];
    }

    protected static function firstExistingFile(string $src): ?string
    {
        foreach (static::candidates($src) as $base) {
            $file = $base.'.antlers.html';

            if (is_file($file)) {
                return $file;
            }
        }

        return null;
    }

    protected static function firstExistingDir(string $prefix): ?string
    {
        foreach (static::candidates($prefix) as $dir) {
            if (is_dir($dir)) {
                return $dir;
            }
        }

        return null;
    }
}
