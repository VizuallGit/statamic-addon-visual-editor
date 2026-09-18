<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTemplateController;

use MarioHamann\StatamicVisualEditor\CollectionViewFile;
use MarioHamann\StatamicVisualEditor\SectionTemplate;
use MarioHamann\StatamicVisualEditor\TailwindStore;

/**
 * Which file a dock request is about, its Tailwind store key, and whether
 * PHP may write it.
 * Moved verbatim out of SectionTemplateController in WP7d.
 */
final class Target
{
    /** The file if it exists, else the nearest folder that does. */
    public static function fileWritable(string $path): bool
    {
        if (is_file($path)) {
            return is_writable($path);
        }

        for ($dir = dirname($path); $dir !== dirname($dir); $dir = dirname($dir)) {
            if (is_dir($dir)) {
                return is_writable($dir);
            }
        }

        return false;
    }

    /**
     * @return array{0: string, 1: string}
     */
    public static function locate(string $handle): array
    {
        if ($view = CollectionViewFile::viewFromType($handle)) {
            $path = CollectionViewFile::path($view);
            abort_unless($path, 404);

            // Empty split-handle: a view file is not a designed section type,
            // so it must not start locked.
            return [$path, ''];
        }

        $path = SectionTemplate::path($handle);
        abort_unless($path, 404);

        return [$path, $handle];
    }

    /**
     * Key into the Tailwind store.
     *
     * A section reuses its own handle. A collection view file has an empty
     * split-handle — that is what keeps it unlocked — so it would otherwise
     * write to `TailwindStore::path('')`, which is null, and the compiled
     * utilities would be dropped on every save. It gets a `view/` key instead.
     */
    public static function twHandle(string $type, string $splitHandle): string
    {
        if ($splitHandle !== '') {
            return $splitHandle;
        }

        $view = CollectionViewFile::viewFromType($type);

        return $view ? 'view/'.$view : '';
    }
}
