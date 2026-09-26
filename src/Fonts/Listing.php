<?php

namespace MarioHamann\StatamicVisualEditor\Fonts;

/**
 * What the Fonts tab shows: fonts.css read back as families with their
 * faces, files and sizes, the Adobe kits with their families, and whether
 * this server can add to the folder.
 */
final class Listing
{
    public static function get(): array
    {
        $css = Stylesheet::css();
        $families = [];

        foreach (Stylesheet::faces($css) as $face) {
            $remote = (bool) preg_match('#^(?:[a-z][a-z0-9+.-]*:)?//#i', $face['file']);
            $path = $remote ? null : Folder::path($face['file']);
            $bytes = $path && is_file($path) ? (int) filesize($path) : 0;
            $key = strtolower($face['family']);

            $families[$key] ??= ['name' => $face['family'], 'faces' => [], 'files' => 0, 'bytes' => 0];
            $families[$key]['faces'][] = [
                'weight' => $face['weight'],
                'style' => $face['style'],
                'url' => $remote ? $face['file'] : Folder::url($face['file']),
                'unicodeRange' => $face['unicodeRange'],
                'missing' => ! $remote && $bytes === 0,
            ];

            if ($bytes) {
                $families[$key]['files']++;
                $families[$key]['bytes'] += $bytes;
            }
        }

        uasort($families, fn ($a, $b) => strcasecmp($a['name'], $b['name']));

        return [
            'families' => array_values($families),
            'kits' => array_map(
                fn ($url) => ['url' => $url, 'families' => AdobeKits::families($url)],
                Stylesheet::imports($css)
            ),
            'writable' => Folder::writable(),
            'stylesheet' => Folder::url(Folder::STYLESHEET),
        ];
    }
}
