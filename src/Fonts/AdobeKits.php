<?php

namespace MarioHamann\StatamicVisualEditor\Fonts;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

/**
 * Adobe Fonts kits. Adobe's licence keeps the files on Adobe's servers, so a
 * kit is an `@import` of its stylesheet in fonts.css — the same as the kit
 * link the theme settings used to add to the layout. The families are read
 * from the kit's own CSS, for the Typography dropdowns.
 */
final class AdobeKits
{
    private const KIT = '#^https://use\.typekit\.net/([a-z0-9]+)\.css$#i';

    /**
     * The kit URL from what was pasted: the URL itself, the project id, or
     * the `<link>` / `@import` line Adobe offers to copy.
     */
    public static function url(string $input): ?string
    {
        $input = trim($input);

        if (preg_match('#use\.typekit\.net/([a-z0-9]+)\.css#i', $input, $m) || preg_match('/^([a-z0-9]{5,12})$/i', $input, $m)) {
            return 'https://use.typekit.net/'.strtolower($m[1]).'.css';
        }

        return null;
    }

    public static function isKit(string $url): bool
    {
        return (bool) preg_match(self::KIT, $url);
    }

    /** The kit's families, remembered for a day; empty when Adobe does not answer. */
    public static function families(string $url): array
    {
        if (! static::isKit($url)) {
            return [];
        }

        $css = Cache::remember('sve-adobe-kit:'.md5($url), now()->addDay(), function () use ($url) {
            try {
                $response = Http::timeout(10)->get($url);

                return $response->successful() ? $response->body() : '';
            } catch (\Throwable) {
                return '';
            }
        });

        if ($css === '') {
            Cache::forget('sve-adobe-kit:'.md5($url));
        }

        preg_match_all('/font-family:\s*["\']?([^"\';}]+)/i', $css, $matches);

        $families = array_values(array_unique(array_map('trim', $matches[1])));
        sort($families);

        return $families;
    }
}
