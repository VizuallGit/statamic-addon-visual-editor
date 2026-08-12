<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;

/**
 * What a preview image WOULD look like, as a short hash.
 *
 * This is what makes previews maintain themselves. The hash travels in the
 * filename (`hero-style-1-<hash>.png`), so deciding whether a preview is still
 * current costs one string comparison — no browser, no render, no bookkeeping
 * file to keep in step. A regeneration run over a site where nothing changed
 * launches no browser at all, which is what lets every save trigger one.
 *
 * Two inputs, kept apart on purpose so a run does the least work possible:
 *
 * - design(): everything shared by every preview — the built CSS/JS, the layout,
 *   the shared partials, the theme settings. Change a colour and every preview
 *   is stale, correctly.
 * - the section itself: its own partial(s) and its own data (for a section type,
 *   the resolved default values; for a saved section, what's stored on it).
 *   Change one section's template and only that one is rebuilt.
 *
 * The built assets are read from the build manifest rather than the CSS sources:
 * a screenshot renders what's been built, so a source edit that hasn't been
 * built yet must NOT count as a change — otherwise the preview would be marked
 * fresh while showing the old design.
 */
class PreviewFingerprint
{
    protected static ?string $design = null;

    /** Drops the per-request cache — for the long-running generate command. */
    public static function flush(): void
    {
        static::$design = null;
    }

    /** The design every section is drawn in: built assets, layout, theme settings. */
    public static function design(): string
    {
        if (static::$design !== null) {
            return static::$design;
        }

        return static::$design = static::hash([
            'files' => static::hashPaths(
                (array) config('statamic-visual-editor.previews.watch', []),
                (array) config('statamic-visual-editor.previews.watch_exclude', []),
            ),
            'theme' => static::themeSettings(),
        ]);
    }

    /**
     * A section type, as the picker will insert it: the design, its partial(s),
     * and the default values it comes with.
     */
    public static function forSectionType(string $handle, array $section): string
    {
        return static::hash([
            'design' => static::design(),
            'handle' => $handle,
            'section' => $section,
            'partials' => static::hashPaths(static::sectionPaths($handle)),
        ]);
    }

    /**
     * A stack of concrete sections — a saved section (one) or a template (many),
     * with the partials of every type appearing in it.
     */
    public static function forSections(array $sections): string
    {
        $paths = [];

        foreach ($sections as $section) {
            if (is_array($section) && ! empty($section['type']) && is_string($section['type'])) {
                $paths = array_merge($paths, static::sectionPaths($section['type']));
            }
        }

        return static::hash([
            'design' => static::design(),
            'sections' => $sections,
            'partials' => static::hashPaths(array_values(array_unique($paths))),
        ]);
    }

    /** The template file(s) a section type renders through. */
    protected static function sectionPaths(string $handle): array
    {
        $base = rtrim(config(
            'statamic-visual-editor.previews.section_partials',
            'resources/views/partials/page_sections'
        ), '/');

        return [
            $base.'/'.$handle.'.antlers.html',
            $base.'/'.$handle.'.blade.php',
            // A section whose markup is split across several files keeps them in a
            // directory of its own name — include those too, or editing one of them
            // would leave the preview claiming to be current.
            $base.'/'.$handle,
        ];
    }

    /**
     * Content hash of every file under the given paths (a file or a directory),
     * ignoring anything under $exclude. Content, not mtime: a rebuild that
     * produces byte-identical output must not invalidate a single preview.
     *
     * @param  array<int, string>  $paths  relative to the project root
     */
    protected static function hashPaths(array $paths, array $exclude = []): array
    {
        $excluded = array_map(fn ($path) => base_path($path), $exclude);
        $hashes = [];

        foreach ($paths as $path) {
            $absolute = base_path($path);

            foreach (static::filesIn($absolute) as $file) {
                foreach ($excluded as $skip) {
                    if (str_starts_with($file, $skip)) {
                        continue 2;
                    }
                }

                $hashes[$path.'|'.substr(md5($file), 0, 6)] = @md5_file($file) ?: '';
            }
        }

        // Sorted: the same set of files must hash the same however it was walked.
        ksort($hashes);

        return $hashes;
    }

    /** @return array<int, string> absolute file paths */
    protected static function filesIn(string $absolute): array
    {
        if (is_file($absolute)) {
            return [$absolute];
        }

        if (! is_dir($absolute)) {
            return []; // configured but not present on this site — not an error
        }

        $files = [];

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($absolute, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $files[] = $file->getPathname();
            }
        }

        return $files;
    }

    /**
     * The theme settings' stored values — colours, fonts, spacing. Raw, from the
     * global set, so this doesn't depend on anything being augmented or rendered.
     *
     * Its own config key, not `chrome.global`: header and footer may well live in
     * a global set of their own, and then the chrome handle names a set holding
     * widgets and layouts — nothing a section preview looks like. Reading it here
     * would leave every preview stale after a colour change and re-shoot the
     * whole site after a header edit.
     */
    protected static function themeSettings(): array
    {
        $handle = config('statamic-visual-editor.previews.theme_global', 'theme_settings');

        if (! $set = GlobalSet::findByHandle($handle)) {
            return [];
        }

        $variables = $set->in(Site::default()->handle());

        return $variables ? $variables->data()->all() : [];
    }

    protected static function hash(array $parts): string
    {
        return substr(md5(json_encode($parts)), 0, 8);
    }
}
