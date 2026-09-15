<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * The classes the site's built stylesheet already carries.
 *
 * Kept as a reader for tests and diagnostics. The bake does not skip these:
 * `{{ sve_tw }}` is pushed after `site.css`, so omitting a `max-md:` variant
 * that the build already has lets an unprefixed rule in the bake win.
 */
class TailwindBuilt
{
    /**
     * @return list<string>
     */
    public static function classes(): array
    {
        $names = [];

        foreach (static::stylesheets() as $path) {
            foreach (static::classesIn((string) file_get_contents($path)) as $name) {
                $names[$name] = true;
            }
        }

        return array_keys($names);
    }

    /**
     * The built CSS for the site's Tailwind entry — the file itself when the
     * entry is a stylesheet, plus any sheet it pulls in.
     *
     * @return list<string>
     */
    protected static function stylesheets(): array
    {
        $build = rtrim((string) config(
            'statamic-visual-editor.tailwind.build',
            public_path('build')
        ), '/\\');

        $manifest = static::manifest($build);

        if ($manifest === null) {
            return [];
        }

        $key = static::entryKey();
        $entry = $key === null ? null : ($manifest[$key] ?? null);

        if (! is_array($entry)) {
            return [];
        }

        $files = array_merge(
            [$entry['file'] ?? null],
            is_array($entry['css'] ?? null) ? $entry['css'] : []
        );

        $paths = [];

        foreach ($files as $file) {
            if (! is_string($file) || ! str_ends_with($file, '.css')) {
                continue;
            }

            $path = $build.'/'.ltrim($file, '/');

            if (is_file($path)) {
                $paths[] = $path;
            }
        }

        return $paths;
    }

    /**
     * @return array<string, mixed>|null
     */
    protected static function manifest(string $build): ?array
    {
        foreach ([$build.'/.vite/manifest.json', $build.'/manifest.json'] as $path) {
            if (! is_file($path)) {
                continue;
            }

            $data = json_decode((string) file_get_contents($path), true);

            if (is_array($data)) {
                return $data;
            }
        }

        return null;
    }

    /**
     * The manifest names entries by their path from the project root, which is
     * exactly what the Tailwind entry is configured as.
     */
    protected static function entryKey(): ?string
    {
        $path = TailwindTheme::path();

        if ($path === null) {
            return null;
        }

        $base = rtrim(str_replace('\\', '/', base_path()), '/').'/';
        $path = str_replace('\\', '/', $path);

        return str_starts_with($path, $base) ? substr($path, strlen($base)) : null;
    }

    /**
     * The class names a stylesheet's selectors mention.
     *
     * Selectors only: the scan walks to each `{` and reads what came before
     * it, so declarations — where `background:#0a0` looks a lot like a class —
     * are never read, and at-rule preludes are skipped by their `@`.
     *
     * Names come back the way they were written in the markup, not the way CSS
     * escapes them: `.hover\:bg-red-500:hover` is `hover:bg-red-500`, and
     * `.\32 xl\:flex` is `2xl:flex`. That is what the compiler compares
     * against.
     *
     * @return list<string>
     */
    public static function classesIn(string $css): array
    {
        $css = (string) preg_replace('!/\*.*?\*/!s', '', $css);
        $css = (string) preg_replace('/"[^"\n]*"|\'[^\'\n]*\'/', '""', $css);

        $names = [];
        $length = strlen($css);
        $start = 0;

        for ($i = 0; $i < $length; $i++) {
            $char = $css[$i];

            if ($char !== '{' && $char !== '}' && $char !== ';') {
                continue;
            }

            if ($char === '{') {
                $prelude = trim(substr($css, $start, $i - $start));

                if ($prelude !== '' && $prelude[0] !== '@') {
                    foreach (static::classesInSelector($prelude) as $name) {
                        $names[$name] = true;
                    }
                }
            }

            $start = $i + 1;
        }

        return array_keys($names);
    }

    /**
     * @return list<string>
     */
    protected static function classesInSelector(string $selector): array
    {
        if (! preg_match_all('/\.((?:\\\\[0-9a-fA-F]{1,6} ?|\\\\.|[A-Za-z0-9_\x80-\xFF-])+)/s', $selector, $matches)) {
            return [];
        }

        $names = [];

        foreach ($matches[1] as $raw) {
            $name = static::unescape($raw);

            if ($name !== '') {
                $names[] = $name;
            }
        }

        return $names;
    }

    /**
     * CSS escapes a class name two ways: a backslash in front of the character,
     * and — for a leading digit, which an identifier may not start with — a hex
     * code followed by a space. `2xl:flex` is written `\32 xl\:flex`.
     */
    protected static function unescape(string $name): string
    {
        return (string) preg_replace_callback(
            '/\\\\([0-9a-fA-F]{1,6}) ?|\\\\(.)/s',
            function (array $m): string {
                if (($m[2] ?? '') !== '') {
                    return $m[2];
                }

                $code = (int) hexdec($m[1]);

                return $code > 0 ? mb_chr($code, 'UTF-8') : '';
            },
            $name
        );
    }
}
