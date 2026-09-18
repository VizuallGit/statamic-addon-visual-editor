<?php

namespace MarioHamann\StatamicVisualEditor\SectionTemplate;

/**
 * The dock lock on a section partial.
 *
 * Designed types are locked in the template dock by default. `custom_section`
 * stays editable until a super admin locks it. Unlocking a designed type
 * writes `{{# sve-unlocked #}}`; locking a custom type writes `{{# sve-locked #}}`.
 * Moved verbatim out of SectionTemplate in WP7d.
 */
final class Locks
{
    /** Comment written at the top of a locked partial — not shown in the dock. */
    public const LOCK_MARKER = '{{# sve-locked #}}';

    /** Comment written when a default-locked type has been unlocked. */
    public const UNLOCK_MARKER = '{{# sve-unlocked #}}';

    /**
     * Designed types are locked until unlocked. `custom_section` (and anything
     * listed in `templates.unlocked`) stays editable until someone locks it.
     */
    public static function defaultsLocked(string $handle): bool
    {
        $handle = str_replace('\\', '/', trim($handle));

        if ($handle === '') {
            return false;
        }

        foreach (static::unlockedPrefixes() as $prefix) {
            if ($handle === $prefix || str_starts_with($handle, $prefix.'/')) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return list<string>
     */
    public static function unlockedPrefixes(): array
    {
        $raw = config('statamic-visual-editor.templates.unlocked', ['custom_section']);

        if (! is_array($raw)) {
            return ['custom_section'];
        }

        $out = [];

        foreach ($raw as $prefix) {
            if (! is_string($prefix)) {
                continue;
            }

            $prefix = str_replace('\\', '/', trim($prefix));

            if ($prefix !== '' && ! str_contains($prefix, '..')) {
                $out[] = $prefix;
            }
        }

        return $out !== [] ? $out : ['custom_section'];
    }

    public static function hasLockMarker(string $contents): bool
    {
        return (bool) preg_match('/\{\{#\s*sve-locked\s*#\}\}/', $contents);
    }

    public static function hasUnlockMarker(string $contents): bool
    {
        return (bool) preg_match('/\{\{#\s*sve-unlocked\s*#\}\}/', $contents);
    }

    public static function stripLockMarker(string $contents): string
    {
        return static::stripOneMarker($contents, 'sve-locked');
    }

    public static function stripUnlockMarker(string $contents): string
    {
        return static::stripOneMarker($contents, 'sve-unlocked');
    }

    public static function stripMarkers(string $contents): string
    {
        return static::stripUnlockMarker(static::stripLockMarker($contents));
    }

    public static function fileIsLocked(string $path): bool
    {
        if (! is_file($path)) {
            return false;
        }

        return Panes::split((string) file_get_contents($path), Paths::handleFromAbsolute($path) ?? '')['locked'];
    }

    /**
     * Toggle the lock without rewriting the three panes.
     *
     * Default-locked types (everything but custom sections) store an unlock
     * comment when opened; default-unlocked types store a lock comment when
     * closed. The other marker is always stripped, so the file never has both.
     */
    public static function setLocked(string $path, bool $locked): void
    {
        $contents = (string) file_get_contents($path);
        $handle = Paths::handleFromAbsolute($path) ?? '';

        if (Panes::split($contents, $handle)['locked'] === $locked) {
            return;
        }

        $contents = static::stripMarkers($contents);
        $marker = static::markerFor($locked, $handle);

        if ($marker !== null) {
            $contents = $marker."\n".$contents;
        }

        if ($contents !== '' && ! str_ends_with($contents, "\n")) {
            $contents .= "\n";
        }

        file_put_contents($path, $contents);
    }

    /**
     * @return array<string, string>  absolute path → file contents
     */
    public static function lockedSnapshots(): array
    {
        $dir = Paths::directory();

        if (! is_dir($dir)) {
            return [];
        }

        $out = [];
        $iter = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iter as $file) {
            if (! $file->isFile() || ! str_ends_with($file->getFilename(), '.antlers.html')) {
                continue;
            }

            $full = $file->getPathname();

            if (static::fileIsLocked($full)) {
                $out[$full] = (string) file_get_contents($full);
            }
        }

        return $out;
    }

    /**
     * @param  array<string, string>  $snapshots
     */
    public static function restoreLocked(array $snapshots): void
    {
        foreach ($snapshots as $path => $contents) {
            if (! is_string($contents) || $contents === '') {
                continue;
            }

            $current = is_file($path) ? (string) file_get_contents($path) : '';

            if ($current !== $contents) {
                file_put_contents($path, $contents);
            }
        }
    }

    /**
     * Unlock marker wins; then an explicit lock; then the type's default.
     */
    public static function resolveLocked(bool $lockedMarker, bool $unlockedMarker, string $handle): bool
    {
        if ($unlockedMarker) {
            return false;
        }

        if ($lockedMarker) {
            return true;
        }

        return $handle !== '' && static::defaultsLocked($handle);
    }

    /**
     * The comment to write, or null when the default already says the same.
     */
    public static function markerFor(bool $locked, string $handle): ?string
    {
        if ($handle === '') {
            return $locked ? static::LOCK_MARKER : null;
        }

        $defaultsLocked = static::defaultsLocked($handle);

        if ($locked && ! $defaultsLocked) {
            return static::LOCK_MARKER;
        }

        if (! $locked && $defaultsLocked) {
            return static::UNLOCK_MARKER;
        }

        return null;
    }

    protected static function stripOneMarker(string $contents, string $name): string
    {
        $out = preg_replace('/\s*\{\{#\s*'.preg_quote($name, '/').'\s*#\}\}\s*/', "\n", $contents) ?? $contents;

        return ltrim($out, "\n\r");
    }
}
