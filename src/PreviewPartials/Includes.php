<?php

namespace MarioHamann\StatamicVisualEditor\PreviewPartials;

/**
 * The partials a view includes: the `{{ partial }}` sources in its text,
 * resolved to files.
 * Moved verbatim out of PreviewPartials in WP7d.
 */
final class Includes
{
    /**
     * The `src` of every partial tag in a template.
     *
     * Both spellings: `{{ partial:foo/bar }}` and `{{ partial src="foo/bar" }}`.
     * A bound `:src` is skipped rather than read as a path — its value is a
     * variable name, and `resolve()` would go looking for a file called `media`.
     * Nothing in the wild uses it on `partial`; when something does, the folder
     * it lives in is unknowable and the section keeps its other dependencies.
     *
     * @return list<string>
     */
    public static function sources(string $contents): array
    {
        $out = [];

        if (preg_match_all('/\{\{-?\s*partial:([^\s}]+)/', $contents, $matches)) {
            $out = array_merge($out, $matches[1]);
        }

        // `[^}]*?` cannot cross a closing brace, so this stays inside one tag —
        // and never picks up the `:src` on a neighbouring `{{ glide }}`.
        if (preg_match_all('/\{\{-?\s*partial\b[^}]*?(?<![:\w-])src\s*=\s*(["\'])(.*?)\1/s', $contents, $matches)) {
            $out = array_merge($out, $matches[2]);
        }

        return array_values(array_filter(array_unique(array_map('trim', $out))));
    }

    /**
     * A src as written, turned into the files it can name.
     *
     * `{type}` (or `{{ type }}`, or `{ type }`) is resolved at render time, so
     * the folder in front of it is as precise as this can get — every template
     * under it is a candidate. Statamic looks in `partials/` before `views/`,
     * and so does this.
     *
     * @return list<string> absolute paths that exist
     */
    public static function resolve(string $src): array
    {
        $src = trim(str_replace('\\', '/', $src));

        if ($src === '' || str_contains($src, '..')) {
            return [];
        }

        if (($brace = strpos($src, '{')) !== false) {
            $prefix = trim(substr($src, 0, $brace), '/');

            return $prefix === '' ? [] : Files::viewFilesIn(static::candidates($prefix));
        }

        $src = trim(preg_replace('/\.(antlers\.html|blade\.php)$/i', '', $src) ?? $src, '/');

        if ($src === '') {
            return [];
        }

        $files = [];

        foreach (static::candidates($src) as $base) {
            foreach (['.antlers.html', '.blade.php'] as $extension) {
                if (is_file($base.$extension)) {
                    $files[] = $base.$extension;
                }
            }
        }

        return Files::viewFilesIn($files);
    }

    /**
     * Where a src could live, in Statamic's own order of preference.
     *
     * @return list<string> absolute paths, without an extension
     */
    protected static function candidates(string $src): array
    {
        if (str_starts_with($src, 'partials/')) {
            return [resource_path('views/'.$src)];
        }

        return [
            resource_path('views/partials/'.$src),
            resource_path('views/'.$src),
        ];
    }
}
