<?php

namespace MarioHamann\StatamicVisualEditor\BuiltAssets;

use RuntimeException;

/**
 * Where the built files are and what the manifest says about them: paths,
 * URLs, the live `addon-*.js` and the chunks it imports, and which files
 * may be served at all.
 * Moved verbatim out of BuiltAssets in WP7d.
 */
final class Manifest
{
    /** The addon root is two levels up: this file lives in src/BuiltAssets/. */
    public static function root(): string
    {
        return dirname(__DIR__, 2).'/resources/dist/build';
    }

    public static function lockedRoot(): string
    {
        return dirname(__DIR__, 2).'/resources/dist/locked';
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
     * The build on disk, as one string: the md5 of manifest.json. Every Vite
     * run rewrites that file, so a new build is a new key — and the same
     * build is the same key on the server as on the machine that built it.
     * Null while there is no build.
     */
    public static function buildKey(): ?string
    {
        $path = static::manifestPath();

        if (! is_file($path)) {
            return null;
        }

        return md5_file($path) ?: null;
    }

    /** Memo for the request, with the key of the file it was parsed from. */
    private static ?array $manifest = null;

    private static ?string $manifestKey = null;

    /**
     * @return array<string, mixed>
     */
    public static function manifest(): array
    {
        $key = static::buildKey();

        if ($key === null) {
            throw new RuntimeException('Visual Editor build is missing: '.static::manifestPath());
        }

        if (static::$manifest !== null && static::$manifestKey === $key) {
            return static::$manifest;
        }

        $manifest = json_decode((string) file_get_contents(static::manifestPath()), true);

        if (! is_array($manifest)) {
            throw new RuntimeException('Visual Editor manifest is not valid JSON.');
        }

        static::$manifestKey = $key;

        return static::$manifest = $manifest;
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

    /** Memo for the request: addonImports() is asked for by serving, recovery and the lock. */
    private static ?array $addonImports = null;

    /**
     * File names the live `addon.js` reaches through chunk imports
     * (`from "./name.js"` or `import("./name.js")`), all the way down.
     *
     * From the lock when it describes this build — Recovery wrote the list the
     * last time it walked — and from the walk itself otherwise. The walk reads
     * every chunk in the graph (4 MB, 10 ms); the lock is one small JSON file.
     *
     * @return list<string>
     */
    public static function addonImports(): array
    {
        if (static::$addonImports !== null) {
            return static::$addonImports;
        }

        if (Lock::holds(static::buildKey())) {
            return static::$addonImports = array_values(array_map('strval', Lock::read()['imports']));
        }

        return static::$addonImports = static::walkAddonImports();
    }

    /**
     * The walk itself, every time it is called: addon.js and every chunk it
     * reaches, read and matched for `from "./x.js"` / `import("./x.js")`.
     *
     * One hop stopped being enough when addon.js deferred the Live Preview
     * cluster behind a single `import('./lp-cluster.js')`: overlay-host and
     * every panel chunk now sit behind that hop.
     *
     * A chunk missing from assets/ is read from locked/ so the walk still sees
     * its imports — that is exactly the file Recovery is about to put back.
     *
     * @return list<string>
     */
    public static function walkAddonImports(): array
    {
        $path = static::liveAddonPath();

        if (! $path) {
            return [];
        }

        $seen = [basename($path) => true];
        $queue = [$path];
        $names = [];

        while ($queue) {
            $source = (string) file_get_contents(array_shift($queue));

            if (! preg_match_all('#(?:from\s*["\']\\./|import\(["\']\\./)([^"\']+\.js)#', $source, $matches)) {
                continue;
            }

            foreach ($matches[1] as $name) {
                if (isset($seen[$name])) {
                    continue;
                }

                $seen[$name] = true;
                $names[] = $name;

                foreach ([static::assetsDir().'/'.$name, static::lockedRoot().'/'.$name] as $file) {
                    if (is_file($file)) {
                        $queue[] = $file;

                        break;
                    }
                }
            }
        }

        return $names;
    }

    /** Forget what this request memoised — for tests that change the build under it. */
    public static function forget(): void
    {
        static::$addonImports = null;
        static::$manifest = null;
        static::$manifestKey = null;
    }
}
