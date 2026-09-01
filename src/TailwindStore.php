<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * Compiled Tailwind utilities for a section type.
 *
 * The template dock bakes HTML-pane classes here so the Antlers partial stays
 * markup. `{{ sve_tw }}` reads this file and pushes onto `style_push` — same
 * head stack as the CSS pane, not a <style> in the section, not Vite.
 */
class TailwindStore
{
    public static function directory(): string
    {
        return (string) config(
            'statamic-visual-editor.tailwind.store',
            resource_path('visual-editor/tw')
        );
    }

    public static function path(string $handle): ?string
    {
        $handle = str_replace('\\', '/', trim($handle));

        if ($handle === '' || str_contains($handle, '..') || str_starts_with($handle, '/')) {
            return null;
        }

        if (! preg_match('/^[A-Za-z0-9][A-Za-z0-9_\/.-]*$/', $handle)) {
            return null;
        }

        return static::directory().DIRECTORY_SEPARATOR.str_replace('.', '/', $handle).'.css';
    }

    public static function read(string $handle): string
    {
        $path = static::path($handle);

        if ($path === null || ! is_file($path)) {
            return '';
        }

        return trim((string) file_get_contents($path));
    }

    public static function has(string $handle): bool
    {
        return static::read($handle) !== '';
    }

    public static function write(string $handle, string $css): void
    {
        $path = static::path($handle);

        if ($path === null) {
            return;
        }

        $css = trim($css);

        if ($css === '') {
            if (is_file($path)) {
                @unlink($path);
            }

            return;
        }

        $dir = dirname($path);

        if (! is_dir($dir) && ! @mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return;
        }

        file_put_contents($path, $css."\n");
    }
}
