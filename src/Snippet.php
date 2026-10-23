<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * A snippet: one Antlers file under `resources/snippets`, in the same HTML /
 * CSS / JS shape the template dock already reads.
 *
 * Nothing renders these files. They are library entries the dock inserts into
 * the open template at the cursor, so the file is built with
 * `SectionTemplate::join()` and read back with `split()` — the section shape,
 * without a Tailwind key and without starting locked.
 */
class Snippet
{
    public static function directory(): string
    {
        return resource_path('snippets');
    }

    /** Lowercase, no slashes — one flat folder, so a name cannot walk out of it. */
    public static function normalizeName(string $name): ?string
    {
        $name = strtolower(trim(str_replace(['\\', ' ', '-'], ['/', '_', '_'], $name)));
        $name = preg_replace('/\.(antlers\.html|blade\.php)$/', '', $name) ?? $name;
        $name = preg_replace('/[^a-z0-9_]/', '', $name) ?? '';
        $name = trim($name, '_');

        if ($name === '' || strlen($name) > 60 || ! preg_match('/^[a-z]/', $name)) {
            return null;
        }

        return $name;
    }

    public static function path(string $name): string
    {
        return static::directory().'/'.$name.'.antlers.html';
    }

    public static function exists(string $name): bool
    {
        return is_file(static::path($name));
    }

    /**
     * @return array{name: string, html: string, css: string, js: string}|null
     */
    public static function read(string $name): ?array
    {
        if (! is_file(static::path($name))) {
            return null;
        }

        $parts = SectionTemplate::split((string) file_get_contents(static::path($name)), '');

        return [
            'name' => $name,
            'html' => (string) $parts['html'],
            'css' => (string) $parts['css'],
            'js' => (string) $parts['js'],
        ];
    }

    /**
     * Every snippet on this site, by name.
     *
     * @return list<array{name: string, html: bool, css: bool, js: bool, hint: string}>
     */
    public static function all(): array
    {
        $dir = static::directory();

        if (! is_dir($dir)) {
            return [];
        }

        $out = [];

        foreach (scandir($dir) ?: [] as $file) {
            if (! str_ends_with($file, '.antlers.html')) {
                continue;
            }

            $name = substr($file, 0, -strlen('.antlers.html'));

            // The folder is the site's own, so it can hold files this addon
            // never made. A name it could not have written is still a snippet
            // worth offering — it just cannot be addressed by a bad name.
            if (static::normalizeName($name) !== $name) {
                continue;
            }

            $parts = static::read($name);

            if ($parts === null) {
                continue;
            }

            $out[] = [
                'name' => $name,
                'html' => trim($parts['html']) !== '',
                'css' => trim($parts['css']) !== '',
                'js' => trim($parts['js']) !== '',
                'hint' => static::hint($parts['html'], $parts['css']),
            ];
        }

        usort($out, fn (array $a, array $b) => strnatcasecmp($a['name'], $b['name']));

        return $out;
    }

    /**
     * @return array{name: string, path: string, html: bool, css: bool, js: bool}|null
     */
    public static function write(string $name, string $html, string $css, string $js): ?array
    {
        $dir = static::directory();

        if (! is_dir($dir) && ! @mkdir($dir, 0755, true) && ! is_dir($dir)) {
            return null;
        }

        // A snippet has no Tailwind key and must not start locked, so both the
        // section handle and the Tailwind handle stay empty.
        $contents = SectionTemplate::join([
            'html' => $html,
            'css' => $css,
            'js' => $js,
            'locked' => false,
        ], '', '');

        if (file_put_contents(static::path($name), $contents) === false) {
            return null;
        }

        GitSync::after('snippet '.$name);

        return [
            'name' => $name,
            'path' => SectionTemplate::relative(static::path($name)),
            'html' => trim($html) !== '',
            'css' => trim($css) !== '',
            'js' => trim($js) !== '',
        ];
    }

    /** The first line the library list can show under the name. */
    private static function hint(string $html, string $css): string
    {
        $source = trim($html) !== '' ? $html : $css;

        foreach (preg_split('/\R/', $source) ?: [] as $line) {
            $line = trim($line);

            if ($line !== '') {
                return mb_substr($line, 0, 80);
            }
        }

        return '';
    }
}
