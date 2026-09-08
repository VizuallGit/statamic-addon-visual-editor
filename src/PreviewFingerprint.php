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
 * - design(): what every preview shares and no single section owns — CSS/JS
 *   (Vite sources and the build manifest), the layout, the page template, the
 *   theme settings. Change a colour and every preview is stale, correctly.
 * - the section itself: the templates it actually renders through — its own
 *   partial(s) and every partial those include, from PreviewPartials — plus its
 *   own data (for a section type, the resolved default values; for a saved
 *   section, what's stored on it).
 *
 * The split between the two is drawn by reachability, not by a folder: design()
 * hashes every watched file that no section reaches, and each section hashes the
 * files it does reach. So editing `components/media_placeholder` retakes the
 * three pictures that include it rather than all thirty, and editing the layout
 * still retakes everything — with no file falling between the two and quietly
 * ceasing to invalidate anything.
 *
 * CSS sources are watched as well as the build manifest: while `npm run dev`
 * runs, screenshots load from the Vite server, so a source edit that has not
 * been built yet is still what the picture will show. The manifest covers the
 * case where Vite is not running.
 */
class PreviewFingerprint
{
    protected static ?string $design = null;

    /** Drops the per-request cache — for the long-running generate command. */
    public static function flush(): void
    {
        static::$design = null;
        PreviewPartials::flush();
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
                PreviewPartials::reachable(),
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
            'partials' => static::hashFiles(PreviewPartials::forSection($handle)),
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
                $paths = array_merge($paths, PreviewPartials::forSection($section['type']));
            }
        }

        return static::hash([
            'design' => static::design(),
            'sections' => $sections,
            'partials' => static::hashFiles(array_values(array_unique($paths))),
        ]);
    }

    /**
     * Content hash of every file under the given paths (a file or a directory),
     * ignoring anything under $exclude and anything in $owned. Content, not
     * mtime: a rebuild that produces byte-identical output must not invalidate a
     * single preview.
     *
     * @param  array<int, string>  $paths  relative to the project root
     * @param  array<int, string>  $exclude  relative to the project root
     * @param  array<string, true>  $owned  absolute paths a section hashes itself
     */
    protected static function hashPaths(array $paths, array $exclude = [], array $owned = []): array
    {
        $excluded = array_map(fn ($path) => base_path($path), $exclude);
        $hashes = [];

        foreach ($paths as $path) {
            $absolute = base_path($path);

            foreach (static::filesIn($absolute) as $file) {
                if (isset($owned[$file])) {
                    continue;
                }

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

    /**
     * Content hash of an explicit list of files, keyed by their path from the
     * project root so the hash says which file moved, not just that one did.
     *
     * @param  array<int, string>  $files  absolute paths
     */
    protected static function hashFiles(array $files): array
    {
        $hashes = [];

        foreach ($files as $file) {
            $hashes[SectionTemplate::relative($file)] = @md5_file($file) ?: '';
        }

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
