<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * The view files a section type actually renders through.
 *
 * Previews used to share one "design" hash over the whole of `resources/views`,
 * so editing any partial outside `page_sections/` retook every picture on the
 * site — thirty screenshots at three seconds each for a change that touched one
 * section. This walks `{{ partial }}` from a section's own template instead, so
 * a shared partial only invalidates the sections that include it.
 *
 * The walk is deliberately generous where it cannot be sure. A dynamic src
 * (`blocks/{type}`) names a folder, not a file, so the whole folder counts —
 * a section that picks its blocks at render time really does depend on all of
 * them. Being too generous costs a screenshot; being too narrow leaves a
 * thumbnail promising a design the site no longer has, which is the failure
 * worth avoiding.
 *
 * @see PreviewFingerprint, which hashes what this returns — and hashes
 *      everything this does NOT reach as the shared design, so no watched file
 *      can fall between the two and silently stop invalidating anything.
 */
class PreviewPartials
{
    /** Partial chains this deep are a cycle, not a design. */
    protected const MAX_DEPTH = 12;

    /** @var array<string, list<string>> section handle => absolute view paths */
    protected static array $sections = [];

    /** @var array<string, list<string>> absolute file => the files it includes */
    protected static array $includes = [];

    /** @var array<string, true>|null every file reachable from any section */
    protected static ?array $reachable = null;

    /** Drops the per-request cache — for the long-running generate command. */
    public static function flush(): void
    {
        static::$sections = [];
        static::$includes = [];
        static::$reachable = null;
    }

    /**
     * Every view file a section type's picture depends on: its own template(s)
     * and, transitively, every partial they pull in.
     *
     * @return list<string> absolute paths, sorted
     */
    public static function forSection(string $handle): array
    {
        if (isset(static::$sections[$handle])) {
            return static::$sections[$handle];
        }

        $seen = [];
        $queue = array_map(fn ($file) => [$file, 0], static::roots($handle));

        while ($queue) {
            [$file, $depth] = array_shift($queue);

            if (isset($seen[$file])) {
                continue;
            }

            $seen[$file] = true;

            if ($depth >= static::MAX_DEPTH) {
                continue;
            }

            foreach (static::includesOf($file) as $next) {
                if (! isset($seen[$next])) {
                    $queue[] = [$next, $depth + 1];
                }
            }
        }

        $files = array_keys($seen);
        sort($files);

        return static::$sections[$handle] = $files;
    }

    /**
     * The union over every section type — what the design hash must leave alone,
     * because these files are already accounted for section by section.
     *
     * @return array<string, true> absolute path => true
     */
    public static function reachable(): array
    {
        if (static::$reachable !== null) {
            return static::$reachable;
        }

        $all = [];

        foreach (array_keys(SectionDefaults::allSets()) as $handle) {
            foreach (static::forSection((string) $handle) as $file) {
                $all[$file] = true;
            }
        }

        return static::$reachable = $all;
    }

    /**
     * A section type's own template(s).
     *
     * A section whose markup is split across several files keeps them in a
     * directory of its own name, so that counts too.
     *
     * @return list<string> absolute paths that exist
     */
    protected static function roots(string $handle): array
    {
        $base = rtrim((string) config(
            'statamic-visual-editor.previews.section_partials',
            'resources/views/partials/page_sections'
        ), '/');

        // Not held to the `resources/views` containment below: where a site
        // keeps its section templates is its own business, and the test suite
        // puts them elsewhere entirely. Only a src *followed* out of a template
        // has to stay in the view tree.
        return static::filesIn([
            base_path($base.'/'.$handle.'.antlers.html'),
            base_path($base.'/'.$handle.'.blade.php'),
            base_path($base.'/'.$handle),
        ]);
    }

    /**
     * The files one view includes directly.
     *
     * @return list<string> absolute paths
     */
    protected static function includesOf(string $file): array
    {
        if (isset(static::$includes[$file])) {
            return static::$includes[$file];
        }

        $found = [];

        foreach (static::sources((string) @file_get_contents($file)) as $src) {
            foreach (static::resolve($src) as $path) {
                $found[$path] = true;
            }
        }

        return static::$includes[$file] = array_keys($found);
    }

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
    protected static function sources(string $contents): array
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
    protected static function resolve(string $src): array
    {
        $src = trim(str_replace('\\', '/', $src));

        if ($src === '' || str_contains($src, '..')) {
            return [];
        }

        if (($brace = strpos($src, '{')) !== false) {
            $prefix = trim(substr($src, 0, $brace), '/');

            return $prefix === '' ? [] : static::viewFilesIn(static::candidates($prefix));
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

        return static::viewFilesIn($files);
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

    /**
     * The same, for paths a template pointed at: everything must stay under
     * `resources/views` — a src is not a way out of the tree.
     *
     * @param  list<string>  $paths
     * @return list<string> absolute paths
     */
    protected static function viewFilesIn(array $paths): array
    {
        $views = realpath(resource_path('views'));

        if (! is_string($views)) {
            return [];
        }

        return array_values(array_filter(
            static::filesIn($paths),
            fn ($file) => str_starts_with($file, $views.DIRECTORY_SEPARATOR),
        ));
    }

    /**
     * Expands a list of files and directories to the files inside them.
     *
     * @param  list<string>  $paths
     * @return list<string> absolute paths
     */
    protected static function filesIn(array $paths): array
    {
        $out = [];

        foreach ($paths as $path) {
            $real = realpath($path);

            if (! is_string($real)) {
                continue;
            }

            if (is_file($real)) {
                $out[$real] = true;

                continue;
            }

            if (! is_dir($real)) {
                continue;
            }

            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($real, \FilesystemIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::LEAVES_ONLY
            );

            foreach ($iterator as $file) {
                if ($file->isFile()) {
                    $out[$file->getPathname()] = true;
                }
            }
        }

        return array_keys($out);
    }
}
