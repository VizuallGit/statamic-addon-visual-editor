<?php

namespace MarioHamann\StatamicVisualEditor\SectionTemplate;

/**
 * Where a section partial lives on disk.
 *
 * The handle comes from the replicator set (`hero/style_2`); the path is
 * always under the section-partials directory (header/footer under their own
 * partials folders), never anywhere else — `..` and absolute paths are refused.
 * Moved verbatim out of SectionTemplate in WP7d.
 */
final class Paths
{
    public static function directory(): string
    {
        return (string) config(
            'statamic-visual-editor.templates.partials',
            resource_path('views/partials/page_sections')
        );
    }

    /**
     * Page sections live under `templates.partials`. Header/footer chrome
     * uses `header/style_1` → `views/partials/header/style_1.antlers.html`.
     *
     * @return array{base: string, rel: string}|null
     */
    protected static function locate(string $handle): ?array
    {
        $handle = str_replace('\\', '/', trim($handle));

        if ($handle === '' || str_contains($handle, '..') || str_starts_with($handle, '/')) {
            return null;
        }

        if (! preg_match('/^[A-Za-z0-9][A-Za-z0-9_\/.-]*$/', $handle)) {
            return null;
        }

        if (preg_match('#^(header|footer)/(.+)$#', $handle, $m)) {
            return [
                'base' => resource_path('views/partials/'.$m[1]),
                'rel' => $m[2],
            ];
        }

        return [
            'base' => static::directory(),
            'rel' => $handle,
        ];
    }

    /**
     * Real path to write the partial, creating parent folders. Null when the
     * handle is unsafe. The file itself does not have to exist yet.
     */
    public static function writablePath(string $handle): ?string
    {
        $located = static::locate($handle);

        if ($located === null) {
            return null;
        }

        $base = $located['base'];

        if (! is_dir($base) && ! @mkdir($base, 0775, true) && ! is_dir($base)) {
            return null;
        }

        $baseReal = realpath($base);

        if ($baseReal === false) {
            return null;
        }

        $candidate = $baseReal.DIRECTORY_SEPARATOR.str_replace('.', '/', $located['rel']).'.antlers.html';
        $dir = dirname($candidate);

        if (! is_dir($dir) && ! @mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return null;
        }

        $dirReal = realpath($dir);

        if ($dirReal === false) {
            return null;
        }

        if ($dirReal !== $baseReal && ! str_starts_with($dirReal, $baseReal.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return $candidate;
    }

    public static function path(string $handle): ?string
    {
        $located = static::locate($handle);

        if ($located === null) {
            return null;
        }

        $base = realpath($located['base']);

        if ($base === false) {
            return null;
        }

        $candidate = $base.DIRECTORY_SEPARATOR.str_replace('.', '/', $located['rel']).'.antlers.html';

        if (! is_file($candidate)) {
            return null;
        }

        $real = realpath($candidate);

        if ($real === false || ! str_starts_with($real, $base.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return $real;
    }

    public static function relative(string $absolute): string
    {
        $root = realpath(base_path()) ?: base_path();

        if (str_starts_with($absolute, $root.DIRECTORY_SEPARATOR)) {
            return substr($absolute, strlen($root) + 1);
        }

        return $absolute;
    }

    public static function handleFromAbsolute(string $absolute): ?string
    {
        $real = realpath($absolute);

        if ($real === false || ! str_ends_with($real, '.antlers.html')) {
            return null;
        }

        foreach (['header', 'footer'] as $chrome) {
            $chromeBase = realpath(resource_path('views/partials/'.$chrome));

            if ($chromeBase && str_starts_with($real, $chromeBase.DIRECTORY_SEPARATOR)) {
                $rel = substr($real, strlen($chromeBase) + 1);
                $rel = preg_replace('/\.antlers\.html$/', '', str_replace('\\', '/', $rel)) ?? '';

                return $rel !== '' ? $chrome.'/'.$rel : null;
            }
        }

        $base = realpath(static::directory());

        if ($base === false || $real === $base || ! str_starts_with($real, $base.DIRECTORY_SEPARATOR)) {
            return null;
        }

        $rel = substr($real, strlen($base) + 1);
        $rel = preg_replace('/\.antlers\.html$/', '', str_replace('\\', '/', $rel)) ?? '';

        return $rel !== '' ? $rel : null;
    }
}
