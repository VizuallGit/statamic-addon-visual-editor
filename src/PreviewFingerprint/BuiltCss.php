<?php

namespace MarioHamann\StatamicVisualEditor\PreviewFingerprint;

/**
 * The site's build, as far as a preview picture is concerned.
 *
 * The build manifest used to sit in the shared design hash, so every build of
 * the site's CSS made every preview stale. A server that builds after each
 * template save (live reload does) built eight times on Cuben in one day —
 * every picture retaken each time, for a class one section had gained.
 *
 * A Tailwind build is additive: a class gets its own rule, and markup that
 * does not use the class looks the same with or without it. So a section's
 * fingerprint carries the classes its own files use that the build has a rule
 * for, and the build that adds a class retakes the pictures of the sections
 * using it and no other. What the build is made from — `resources/css`, the
 * theme settings — stays in the design hash: an edit there is a change for
 * everybody. So do the built scripts, by name; Vite names a file after its
 * content, so a script that changed is a new name.
 */
final class BuiltCss
{
    /** @var array<string, mixed>|null */
    protected static ?array $manifest = null;

    /** @var array<string, true>|null */
    protected static ?array $classes = null;

    /** @var array<string, list<string>> absolute file => its words, read once per pass */
    protected static array $words = [];

    /** Drops the per-request cache — for the long-running generate command. */
    public static function flush(): void
    {
        static::$manifest = null;
        static::$classes = null;
        static::$words = [];
    }

    /** Vite's manifest for the site's build. */
    public static function manifestPath(): string
    {
        return public_path('build/manifest.json');
    }

    /**
     * Every class the built CSS has a rule for.
     *
     * @return array<string, true>
     */
    public static function classes(): array
    {
        if (static::$classes !== null) {
            return static::$classes;
        }

        $classes = [];

        foreach (static::files('css') as $file) {
            $css = @file_get_contents(public_path('build/'.$file));

            if (is_string($css)) {
                $classes += static::classesIn($css);
            }
        }

        return static::$classes = $classes;
    }

    /**
     * The built scripts, by their content-hashed names.
     *
     * @return list<string>
     */
    public static function scripts(): array
    {
        return static::files('js');
    }

    /**
     * Of the words in these files and this data, the ones the build has a
     * class rule for — the way Tailwind itself finds candidates: any word,
     * wherever it stands, so a class in an Antlers parameter, an Alpine
     * binding or a stored field value counts as well (the site's CSS scans
     * `content/` too).
     *
     * @param  array<int, string>  $files  absolute paths
     * @param  array<mixed>  $data  the section's own values
     * @return list<string> sorted
     */
    public static function usedBy(array $files, array $data = []): array
    {
        $classes = static::classes();

        if ($classes === []) {
            return [];
        }

        $used = [];
        $lists = array_map(fn ($file) => static::wordsOf($file), $files);
        $lists[] = static::words((string) json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

        foreach ($lists as $words) {
            foreach ($words as $word) {
                if (isset($classes[$word])) {
                    $used[$word] = true;
                }
            }
        }

        $used = array_keys($used);
        sort($used);

        return $used;
    }

    /** @return list<string> */
    protected static function wordsOf(string $file): array
    {
        if (! isset(static::$words[$file])) {
            $text = @file_get_contents($file);

            static::$words[$file] = is_string($text) ? array_values(array_unique(static::words($text))) : [];
        }

        return static::$words[$file];
    }

    /** @return list<string> */
    protected static function words(string $text): array
    {
        return preg_split('/[\s"\'`<>={}]+/', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [];
    }

    /**
     * The class names in a stylesheet, unescaped: `.md\:flex` is `md:flex`,
     * `.\32xl\:grid` is `2xl:grid`. A decimal (`0.5rem`) reads as a class
     * too; that costs nothing, since only words a section uses are looked up.
     *
     * @return array<string, true>
     */
    public static function classesIn(string $css): array
    {
        preg_match_all('/\.((?:\\\\[0-9a-fA-F]{1,6} ?|\\\\[^\r\n\f0-9a-fA-F]|[A-Za-z0-9_-])+)/', $css, $matches);

        $classes = [];

        foreach ($matches[1] as $raw) {
            $classes[static::unescape($raw)] = true;
        }

        return $classes;
    }

    protected static function unescape(string $raw): string
    {
        return preg_replace_callback(
            '/\\\\(?:([0-9a-fA-F]{1,6}) ?|(.))/s',
            fn ($match) => ($match[1] ?? '') !== '' ? mb_chr(hexdec($match[1])) : $match[2],
            $raw,
        );
    }

    /**
     * The manifest's files with one extension, entries and their CSS alike.
     *
     * @return list<string> relative to public/build, sorted
     */
    protected static function files(string $extension): array
    {
        $files = [];

        foreach (static::manifest() as $entry) {
            if (! is_array($entry)) {
                continue;
            }

            foreach (array_merge([$entry['file'] ?? null], (array) ($entry['css'] ?? [])) as $file) {
                if (is_string($file) && str_ends_with($file, '.'.$extension)) {
                    $files[$file] = true;
                }
            }
        }

        $files = array_keys($files);
        sort($files);

        return $files;
    }

    /** @return array<string, mixed> */
    protected static function manifest(): array
    {
        if (static::$manifest !== null) {
            return static::$manifest;
        }

        $path = static::manifestPath();
        $json = is_file($path) ? json_decode((string) file_get_contents($path), true) : null;

        return static::$manifest = is_array($json) ? $json : [];
    }
}
