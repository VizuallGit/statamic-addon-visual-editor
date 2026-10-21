<?php

namespace MarioHamann\StatamicVisualEditor\BuiltAssets;

/**
 * What Recovery found the last time it walked a build: which manifest it was
 * (the md5 of manifest.json), the live addon.js, and every chunk that file
 * reaches through imports.
 *
 * Read on every request instead of walking 4 MB of JS and md5-ing the lock
 * copies again — 28 ms, on a visitor's request too. The key is the manifest's
 * content, so a Vite run (which always rewrites manifest.json) makes the lock
 * stale, and the next request does the full walk once more and writes a new
 * one. The file sits in resources/dist/ beside build/ and locked/, where
 * prune-dist does not reach, and ships with the package: a server with a
 * matching lock never walks at all.
 */
final class Lock
{
    /** Memo for the request. */
    private static ?array $memo = null;

    private static bool $read = false;

    public static function path(): string
    {
        return dirname(Manifest::lockedRoot()).'/lock.json';
    }

    /**
     * @return array{build: string, addon: string, imports: list<string>}|null
     */
    public static function read(): ?array
    {
        if (static::$read) {
            return static::$memo;
        }

        static::$read = true;
        $path = static::path();

        if (! is_file($path)) {
            return static::$memo = null;
        }

        $data = json_decode((string) file_get_contents($path), true);

        if (
            ! is_array($data)
            || ! is_string($data['build'] ?? null)
            || ! is_string($data['addon'] ?? null)
            || ! is_array($data['imports'] ?? null)
        ) {
            return static::$memo = null;
        }

        return static::$memo = $data;
    }

    /** The lock describes this very build. */
    public static function holds(?string $build): bool
    {
        return $build !== null && (static::read()['build'] ?? null) === $build;
    }

    /**
     * @param  list<string>  $imports
     */
    public static function write(string $build, string $addon, array $imports): void
    {
        $dir = dirname(static::path());

        if (! is_dir($dir) || ! is_writable($dir)) {
            return;
        }

        $json = json_encode(
            ['build' => $build, 'addon' => $addon, 'imports' => array_values($imports)],
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES
        );

        if ($json === false) {
            return;
        }

        @file_put_contents(static::path(), $json."\n");
        static::forget();
    }

    public static function forget(): void
    {
        static::$memo = null;
        static::$read = false;
    }
}
