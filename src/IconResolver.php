<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Icon;
use Statamic\Statamic;

/**
 * Turns a set/field icon value into something the CP or preview can draw.
 *
 * Authors write one of four things in Edit Set (or YAML): a Statamic icon name
 * (`h1`), a file from a registered custom set (`hero`), an Iconify name
 * (`lucide:layout`), pasted SVG, or a short emoji. Filenames are resolved to
 * markup here; everything else is left for the browser (Iconify fetch, emoji).
 */
class IconResolver
{
    /**
     * Inline SVG when the value names a file we can read; null when the client
     * should handle it (Iconify, emoji, unknown name).
     */
    public static function markup(?string $icon): ?string
    {
        if (! $icon) {
            return null;
        }

        if (preg_match('/^\s*<svg[\s>]/i', $icon)) {
            return trim($icon);
        }

        // Iconify (`prefix:name`), emoji, paths — never open as a file.
        if (! preg_match('/^[A-Za-z0-9_-]+$/', $icon)) {
            return null;
        }

        if ($svg = Statamic::svg("icons/{$icon}")) {
            return $svg;
        }

        foreach (Icon::sets() as $set) {
            if ($svg = $set->get($icon)) {
                return trim($svg);
            }
        }

        if ($svg = Icon::get('default')->get($icon)) {
            return trim($svg);
        }

        return null;
    }

    /**
     * What the focus panel stores: resolved SVG when we have it, otherwise the
     * raw value so Iconify/emoji still render client-side.
     */
    public static function forPanel(?string $icon): ?string
    {
        if (! $icon) {
            return null;
        }

        return static::markup($icon) ?? $icon;
    }
}
