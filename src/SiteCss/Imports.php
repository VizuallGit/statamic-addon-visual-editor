<?php

namespace MarioHamann\StatamicVisualEditor\SiteCss;

use MarioHamann\StatamicVisualEditor\GitSync;

/**
 * The `@import` lines in the Vite entry (`site.css`).
 *
 * A stylesheet only reaches the page if the entry imports it, so creating,
 * renaming and deleting a sheet each keep the entry in step.
 * Moved verbatim out of SiteCss in WP7d.
 */
final class Imports
{
    /** Take a sheet's `@import` line out of the entry. */
    public static function removeImport(string $relative): bool
    {
        // Scripts and icons have no entry to keep in step.
        if (Root::entry() === null) {
            return true;
        }

        $rel = Root::normalize($relative);

        if (! $rel || $rel === Root::ENTRY) {
            return false;
        }

        $entry = Root::existingPath(Root::ENTRY);

        if (! $entry) {
            return false;
        }

        $css = (string) file_get_contents($entry);
        $stem = preg_replace('/\.css$/', '', $rel);

        $patched = preg_replace(
            '/^@import[^\n]*(?:"\.\/'.preg_quote($stem, '/').'(?:\.css)?"|\x27\.\/'.preg_quote($stem, '/').'(?:\.css)?\x27)[^\n]*\n?/m',
            '',
            $css
        );

        if (! is_string($patched) || $patched === $css) {
            return false;
        }

        file_put_contents($entry, $patched);
        GitSync::after('site CSS imports');

        return true;
    }

    public static function ensureImport(string $relative): bool
    {
        // Scripts and icons have no entry to keep in step.
        if (Root::entry() === null) {
            return true;
        }

        $rel = Root::normalize($relative);

        if (! $rel || $rel === Root::ENTRY || Root::excluded($rel)) {
            return false;
        }

        if (static::isImported($rel)) {
            return true;
        }

        $entry = Root::existingPath(Root::ENTRY);

        if (! $entry) {
            return false;
        }

        $css = (string) file_get_contents($entry);
        $line = static::importLine($rel);
        $patched = static::insertImport($css, $line);

        if ($patched === $css) {
            return false;
        }

        file_put_contents($entry, $patched);
        GitSync::after('site CSS imports');

        return true;
    }

    public static function isImported(string $relative): bool
    {
        // Scripts and icons have no entry to keep in step.
        if (Root::entry() === null) {
            return true;
        }

        $rel = Root::normalize($relative);

        if (! $rel) {
            return false;
        }

        $entry = Root::existingPath(Root::ENTRY);

        if (! $entry) {
            return false;
        }

        $css = (string) file_get_contents($entry);
        $stem = preg_replace('/\.css$/', '', $rel);

        foreach ([$rel, $stem] as $needle) {
            if (
                str_contains($css, '"./'.$needle.'"')
                || str_contains($css, "'./".$needle."'")
            ) {
                return true;
            }
        }

        return false;
    }

    protected static function importLine(string $relative): string
    {
        $stem = preg_replace('/\.css$/', '', $relative);
        $layer = str_starts_with($relative, 'utilities/')
            ? 'utilities'
            : (str_starts_with($relative, 'compositions/') ? 'compositions' : 'base');

        return '@import "./'.$stem.'" layer('.$layer.');';
    }

    protected static function insertImport(string $css, string $line): string
    {
        if (preg_match_all('/^@import[^\n]*$/m', $css, $matches, PREG_OFFSET_CAPTURE)) {
            $last = $matches[0][array_key_last($matches[0])];
            $at = $last[1] + strlen($last[0]);

            return substr($css, 0, $at)."\n".$line.substr($css, $at);
        }

        return $line."\n".$css;
    }
}
