<?php

namespace MarioHamann\StatamicVisualEditor\PreviewPartials;

/**
 * The view files a section type starts from, and the files under a set of
 * paths.
 * Moved verbatim out of PreviewPartials in WP7d.
 */
final class Files
{
    /**
     * A section type's own template(s).
     *
     * A section whose markup is split across several files keeps them in a
     * directory of its own name, so that counts too.
     *
     * @return list<string> absolute paths that exist
     */
    public static function roots(string $handle): array
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
     * The same, for paths a template pointed at: everything must stay under
     * `resources/views` — a src is not a way out of the tree.
     *
     * @param  list<string>  $paths
     * @return list<string> absolute paths
     */
    public static function viewFilesIn(array $paths): array
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
