<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\BuiltAssets\Link;
use MarioHamann\StatamicVisualEditor\BuiltAssets\Manifest;
use MarioHamann\StatamicVisualEditor\BuiltAssets\Recovery;

/**
 * The Visual Editor's built JS lives in this addon's `resources/dist/build`.
 * Nowhere else. A copy in the site's `public/vendor` is how a half-build
 * deleted overlay-host and took the whole editor with it.
 *
 * `addon.js` is a hashed Vite chunk that imports `overlay-host-XXXX.js` by
 * that exact name. Building overlay-host alone writes a new hash and can
 * delete the old file. The Control Panel then fails to load anything.
 *
 * This class is the lock:
 *  - preview and overlay scripts are served from this folder
 *  - every import inside `addon-*.js` must exist, or it is restored from
 *    `resources/dist/locked`
 *  - a missing import after restore is a hard error, not a blank toolbar
 *
 * This class is the entry point other code calls; the work lives in
 * `BuiltAssets\Manifest`, `BuiltAssets\Recovery` and `BuiltAssets\Link`.
 * Split in WP7d, code moved verbatim.
 */
class BuiltAssets
{
    /**
     * @see Manifest::root()
     */
    public static function root(): string
    {
        return Manifest::root();
    }

    /**
     * @see Manifest::lockedRoot()
     */
    public static function lockedRoot(): string
    {
        return Manifest::lockedRoot();
    }

    /**
     * @see Manifest::assetsDir()
     */
    public static function assetsDir(): string
    {
        return Manifest::assetsDir();
    }

    /**
     * @see Manifest::url()
     */
    public static function url(string $entry): string
    {
        return Manifest::url($entry);
    }

    /**
     * @see Manifest::isAllowed()
     */
    public static function isAllowed(string $relative): bool
    {
        return Manifest::isAllowed($relative);
    }

    /**
     * File names the live `addon.js` imports (`from "./name.js"` or `import("./name.js")`).
     *
     * @see Manifest::addonImports()
     */
    public static function addonImports(): array
    {
        return Manifest::addonImports();
    }

    /**
     * Put back any chunk `addon.js` still names, then refuse to boot if one
     * is still missing. Call this on every request — a Vite run must not be
     * able to leave the Control Panel without an editor.
     *
     * @see Recovery::recover()
     */
    public static function recover(): void
    {
        Recovery::recover();
    }

    /**
     * @see Recovery::restoreImportedChunks()
     */
    public static function restoreImportedChunks(): void
    {
        Recovery::restoreImportedChunks();
    }

    /**
     * After a good boot, keep a copy of the live addon.js and every file it
     * imports. Not every leftover hashed addon-*.js in the folder — reading
     * those on each request made Live Preview open slower after many builds.
     *
     * @see Recovery::refreshLock()
     */
    public static function refreshLock(): void
    {
        Recovery::refreshLock();
    }

    /**
     * Control Panel still asks Statamic for `vendor/visual-editor/build`.
     * That path must be this addon's dist, not a second copy.
     *
     * @see Link::linkForControlPanel()
     */
    public static function linkForControlPanel(?string $packageName = 'visual-editor'): void
    {
        Link::linkForControlPanel($packageName);
    }
}
