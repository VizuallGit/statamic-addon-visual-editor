<?php

namespace MarioHamann\StatamicVisualEditor\BuiltAssets;

use RuntimeException;

/**
 * The lock: every chunk `addon-*.js` imports must exist, or it is restored
 * from `resources/dist/locked`; a missing import after restore is a hard
 * error, not a blank toolbar.
 * Moved verbatim out of BuiltAssets in WP7d.
 */
final class Recovery
{
    /**
     * Put back any chunk `addon.js` still names, then refuse to boot if one
     * is still missing. Call this on every request — a Vite run must not be
     * able to leave the Control Panel without an editor.
     */
    public static function recover(): void
    {
        static::restoreImportedChunks();
        static::assertIntegrity();
        static::refreshLock();
    }

    public static function restoreImportedChunks(): void
    {
        $assets = Manifest::assetsDir();
        $locked = Manifest::lockedRoot();

        if (! is_dir($assets)) {
            return;
        }

        foreach (Manifest::addonImports() as $name) {
            $live = $assets.'/'.$name;

            if (is_file($live)) {
                continue;
            }

            $backup = $locked.'/'.$name;

            if (! is_file($backup)) {
                continue;
            }

            @copy($backup, $live);
        }
    }

    public static function assertIntegrity(): void
    {
        $missing = [];

        foreach (Manifest::addonImports() as $name) {
            if (! is_file(Manifest::assetsDir().'/'.$name)) {
                $missing[] = $name;
            }
        }

        foreach (Manifest::manifest() as $entry => $resolved) {
            if (! is_array($resolved) || empty($resolved['file'])) {
                continue;
            }

            $path = Manifest::root().'/'.$resolved['file'];

            if (! is_file($path)) {
                $missing[] = $resolved['file']." (manifest `{$entry}`)";
            }
        }

        if ($missing) {
            throw new RuntimeException(
                'Visual Editor build is broken — addon.js imports a file that is not on disk: '
                .implode(', ', $missing)
                .'. Do not rebuild overlay-host, preview or bridge alone. The live files are in resources/dist/build.'
            );
        }
    }

    /**
     * After a good boot, keep a copy of the live addon.js and every file it
     * imports. Not every leftover hashed addon-*.js in the folder — reading
     * those on each request made Live Preview open slower after many builds.
     */
    public static function refreshLock(): void
    {
        $assets = Manifest::assetsDir();
        $locked = Manifest::lockedRoot();

        if (! is_dir($assets)) {
            return;
        }

        if (! is_dir($locked)) {
            @mkdir($locked, 0755, true);
        }

        if (! is_dir($locked) || ! is_writable($locked)) {
            return;
        }

        $addon = Manifest::liveAddonPath();

        if ($addon) {
            static::lockFile($addon, $locked.'/'.basename($addon));
        }

        foreach (Manifest::addonImports() as $name) {
            static::lockFile($assets.'/'.$name, $locked.'/'.$name);
        }
    }

    protected static function lockFile(string $live, string $dest): void
    {
        if (! is_file($live)) {
            return;
        }

        if (is_file($dest) && md5_file($live) === md5_file($dest)) {
            return;
        }

        @copy($live, $dest);
    }
}
