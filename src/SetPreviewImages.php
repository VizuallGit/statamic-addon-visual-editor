<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Asset;
use Statamic\Facades\Fieldset;
use Statamic\Fieldtypes\Sets;

/**
 * Builds a { setHandle => thumbnailUrl } map of Replicator/Bard set "Preview
 * Image"s configured in blueprints and fieldsets.
 *
 * WHY this exists server-side: Statamic resolves a set's `image` to a real URL
 * only inside the Sets config UI (Sets::previewImageUrl). The Replicator field
 * sent to the entry publish form keeps the raw stored filename, and Vue's
 * internal component instances are not reachable from the DOM in a production
 * build — so the CP-side addon cannot resolve the URL itself. We resolve it here
 * and hand a flat handle→url map to the CP script via Statamic::provideToScript.
 */
class SetPreviewImages
{
    protected static ?array $cache = null;

    /** Resets the in-request cache after the underlying files/YAML change. */
    public static function flush(): void
    {
        static::$cache = null;
    }

    public static function map(): array
    {
        if (static::$cache !== null) {
            return static::$cache;
        }

        $config = Sets::previewImageConfig();

        if (! $config) {
            return static::$cache = [];
        }

        $prefix = sprintf('%s::%s', $config['container'], $config['folder'] ? $config['folder'].'/' : '');

        // Collect raw handle => filename across every fieldset. Set preview images
        // are defined on set definitions, which for this project live in fieldsets
        // (imported into blueprints). BlueprintRepository has no ::all(), so we scan
        // fieldsets only — sufficient since the sets-with-images are defined there.
        $filenames = [];

        foreach (Fieldset::all() as $fieldset) {
            static::walk($fieldset->contents(), $filenames);
        }

        // Resolve each filename to a thumbnail URL, cache-busted with the file's
        // modification time — Statamic's thumbnail URLs are keyed by path only, so
        // without this a regenerated image keeps serving the browser's cached copy.
        $map = [];

        foreach ($filenames as $handle => $filename) {
            if ($asset = Asset::find($prefix.$filename)) {
                $map[$handle] = static::bust($asset);
            }
        }

        return static::$cache = $map;
    }

    /** Appends ?v=<file mtime> to an asset's thumbnail URL for cache busting. */
    protected static function bust($asset): string
    {
        $url = $asset->thumbnailUrl();

        try {
            $mtime = $asset->container()->disk()->filesystem()->lastModified($asset->path());
            $url .= (str_contains($url, '?') ? '&' : '?').'v='.$mtime;
        } catch (\Throwable $e) {
            // Leave un-versioned if the mtime can't be read.
        }

        return $url;
    }

    /**
     * Flat { setHandle => stored filename } map across every fieldset — the raw
     * `image` values before they're resolved to URLs. Used by the preview
     * generator to know which sets have a preview image and where to write it.
     *
     * @return array<string, string>
     */
    public static function filenames(): array
    {
        $filenames = [];

        foreach (Fieldset::all() as $fieldset) {
            static::walk($fieldset->contents(), $filenames);
        }

        return $filenames;
    }

    /**
     * Recursively walk a blueprint/fieldset contents array. Whenever an
     * associative entry looks like a set definition (has a string `image` plus
     * `fields` or `display`), record its key (the set handle) => image filename.
     * This covers flat, grouped, and nested replicator/bard set layouts without
     * needing to special-case each shape.
     */
    protected static function walk($node, array &$filenames): void
    {
        if (! is_array($node)) {
            return;
        }

        foreach ($node as $key => $value) {
            if (! is_array($value)) {
                continue;
            }

            if (
                is_string($key)
                && ! empty($value['image'])
                && is_string($value['image'])
                && (isset($value['fields']) || isset($value['display']))
            ) {
                $filenames[$key] = $value['image'];
            }

            static::walk($value, $filenames);
        }
    }
}
