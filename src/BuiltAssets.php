<?php

namespace MarioHamann\StatamicVisualEditor;

use RuntimeException;

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
 */
class BuiltAssets
{
    public static function root(): string
    {
        return dirname(__DIR__).'/resources/dist/build';
    }

    public static function lockedRoot(): string
    {
        return dirname(__DIR__).'/resources/dist/locked';
    }

    public static function assetsDir(): string
    {
        return static::root().'/assets';
    }

    public static function manifestPath(): string
    {
        return static::root().'/manifest.json';
    }

    /**
     * @return array<string, mixed>
     */
    public static function manifest(): array
    {
        $path = static::manifestPath();

        if (! is_file($path)) {
            throw new RuntimeException('Visual Editor build is missing: '.$path);
        }

        $manifest = json_decode((string) file_get_contents($path), true);

        if (! is_array($manifest)) {
            throw new RuntimeException('Visual Editor manifest is not valid JSON.');
        }

        return $manifest;
    }

    public static function fileFor(string $entry): string
    {
        $resolved = static::manifest()[$entry] ?? null;

        if (! is_array($resolved) || empty($resolved['file'])) {
            throw new RuntimeException("Visual Editor manifest has no entry `{$entry}`.");
        }

        return (string) $resolved['file'];
    }

    public static function pathFor(string $entry): string
    {
        return static::root().'/'.ltrim(static::fileFor($entry), '/');
    }

    public static function url(string $entry): string
    {
        return '/!/sve/build/'.ltrim(static::fileFor($entry), '/');
    }

    /**
     * Relative paths under the build root that the route may serve.
     *
     * @return list<string>
     */
    public static function allowedFiles(): array
    {
        $allowed = [];

        foreach (static::manifest() as $entry) {
            if (! is_array($entry)) {
                continue;
            }

            if (! empty($entry['file'])) {
                $allowed[] = (string) $entry['file'];
            }

            foreach ($entry['css'] ?? [] as $css) {
                $allowed[] = (string) $css;
            }
        }

        foreach (static::addonImports() as $import) {
            $allowed[] = 'assets/'.$import;
        }

        return array_values(array_unique($allowed));
    }

    public static function isAllowed(string $relative): bool
    {
        $relative = str_replace('\\', '/', ltrim($relative, '/'));

        if (str_contains($relative, '..')) {
            return false;
        }

        return in_array($relative, static::allowedFiles(), true);
    }

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
        $assets = static::assetsDir();
        $locked = static::lockedRoot();

        if (! is_dir($assets)) {
            return;
        }

        foreach (static::addonImports() as $name) {
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

        foreach (static::addonImports() as $name) {
            if (! is_file(static::assetsDir().'/'.$name)) {
                $missing[] = $name;
            }
        }

        foreach (static::manifest() as $entry => $resolved) {
            if (! is_array($resolved) || empty($resolved['file'])) {
                continue;
            }

            $path = static::root().'/'.$resolved['file'];

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
        $assets = static::assetsDir();
        $locked = static::lockedRoot();

        if (! is_dir($assets)) {
            return;
        }

        if (! is_dir($locked)) {
            @mkdir($locked, 0755, true);
        }

        if (! is_dir($locked) || ! is_writable($locked)) {
            return;
        }

        $addon = static::liveAddonPath();

        if ($addon) {
            static::lockFile($addon, $locked.'/'.basename($addon));
        }

        foreach (static::addonImports() as $name) {
            static::lockFile($assets.'/'.$name, $locked.'/'.$name);
        }
    }

    /**
     * Control Panel still asks Statamic for `vendor/visual-editor/build`.
     * That path must be this addon's dist, not a second copy.
     */
    public static function linkForControlPanel(?string $packageName = 'visual-editor'): void
    {
        if (! function_exists('public_path')) {
            return;
        }

        $source = static::root();
        $target = public_path('vendor/'.$packageName.'/build');

        if (! is_dir($source)) {
            return;
        }

        static::replaceWithLink($target, $source);
    }

    /**
     * The hashed addon.js the manifest is serving now.
     */
    public static function liveAddonPath(): ?string
    {
        try {
            $path = static::pathFor('resources/js/addon.js');
        } catch (\RuntimeException $e) {
            return null;
        }

        return is_file($path) ? $path : null;
    }

    /**
     * File names the live `addon.js` imports (`from "./name.js"` or `import("./name.js")`).
     *
     * @return list<string>
     */
    public static function addonImports(): array
    {
        $path = static::liveAddonPath();

        if (! $path) {
            return [];
        }

        $source = (string) file_get_contents($path);
        $names = [];

        if (preg_match_all('#(?:from\s*["\']\\./|import\(["\']\\./)([^"\']+\.js)#', $source, $matches)) {
            foreach ($matches[1] as $name) {
                $names[] = $name;
            }
        }

        return array_values(array_unique($names));
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

    protected static function replaceWithLink(string $target, string $source): void
    {
        $parent = dirname($target);

        if (! is_dir($parent)) {
            @mkdir($parent, 0755, true);
        }

        if (is_link($target)) {
            $current = realpath($target) ?: readlink($target);

            if ($current === realpath($source)) {
                return;
            }

            @unlink($target);
        } elseif (is_dir($target)) {
            // A published copy — that is the window that went stale.
            $gone = $target.'.replaced-'.date('YmdHis');
            @rename($target, $gone);
        } elseif (is_file($target)) {
            @unlink($target);
        }

        if (! file_exists($target)) {
            @symlink($source, $target);
        }
    }
}
