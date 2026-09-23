<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Contracts\Assets\AssetContainer;
use Statamic\Facades\Asset;

/**
 * Removing a preview image that has been superseded.
 *
 * Through the Asset API rather than the filesystem, because Statamic keeps a
 * `.meta/<file>.yaml` beside every asset. Deleting the file alone leaves that
 * behind, and since a preview gets a new filename every time the design changes,
 * the meta folder would fill up with entries for images that no longer exist —
 * one per section per redesign, forever.
 */
class PreviewFile
{
    /**
     * Tell Statamic about a preview image just written to the container's
     * disk. Writing the file is not enough: the container's index and the
     * `.meta/<file>.yaml` are Statamic's, and on a server the Stache watcher is
     * off, so a file nobody registered stays invisible — "No preview" in the
     * panel and "Missing" on the utility page — until somebody warms the
     * Stache by hand. Saving the asset adds it to the index and writes the meta.
     */
    public static function keep(AssetContainer $container, string $path): void
    {
        $asset = Asset::find($container->handle().'::'.$path)
            ?? Asset::make()->container($container->handle())->path($path);

        $asset->saveQuietly();
    }

    public static function forget(AssetContainer $container, string $path): void
    {
        if ($asset = Asset::find($container->handle().'::'.$path)) {
            $asset->delete();

            return;
        }

        // No asset record (never had one, or the container was rebuilt): the file
        // is still what we came to remove.
        $container->disk()->filesystem()->delete($path);
    }
}
