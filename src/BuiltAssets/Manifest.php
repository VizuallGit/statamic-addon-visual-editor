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
}
