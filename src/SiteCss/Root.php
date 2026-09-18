<?php

namespace MarioHamann\StatamicVisualEditor\SiteCss;

/**
 * Where the site's stylesheets live and which relative paths are accepted.
 * Moved verbatim out of SiteCss in WP7d.
 */
final class Root
{
    public const ENTRY = 'site.css';

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

    public static function excluded(string $relative): bool
    {
        $name = basename($relative);
        $list = config('statamic-visual-editor.site_css.exclude', ['cp.css']);

        return in_array($name, (array) $list, true);
    }

    public static function relativeFrom(string $path): string
    {
        $root = realpath(static::root()) ?: static::root();
        $path = str_replace('\\', '/', $path);
        $root = str_replace('\\', '/', $root);

        return ltrim(substr($path, strlen($root)), '/');
    }
}
