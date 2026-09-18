<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\PreviewPartials\Files;
use MarioHamann\StatamicVisualEditor\PreviewPartials\Includes;

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
 *
 * This class keeps the three per-request caches and the walk; file lookup
 * lives in `PreviewPartials\Files` and include resolution in
 * `PreviewPartials\Includes`. Split in WP7d, code moved verbatim.
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
        $queue = array_map(fn ($file) => [$file, 0], Files::roots($handle));

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

        foreach (Includes::sources((string) @file_get_contents($file)) as $src) {
            foreach (Includes::resolve($src) as $path) {
                $found[$path] = true;
            }
        }

        return static::$includes[$file] = array_keys($found);
    }
}
