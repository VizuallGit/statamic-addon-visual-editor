<?php

namespace MarioHamann\StatamicVisualEditor\IconifyDefault;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

/**
 * An icon name resolved to its SVG data, and what counts as a name.
 * Moved verbatim out of IconifyDefault in WP7d.
 */
final class Svg
{
    /**
     * @return array{name: string, body: string, attributes: array<string, string>}|null
     */
    public static function svgData(string $name): ?array
    {
        $name = trim($name);

        if (! self::isName($name)) {
            return null;
        }

        $cacheKey = 'sve.iconify.svg.'.$name;

        if (Cache::has($cacheKey)) {
            $cached = Cache::get($cacheKey);

            return is_array($cached) ? $cached : null;
        }

        [$prefix, $icon] = explode(':', $name, 2);

        try {
            $response = Http::timeout(10)->get('https://api.iconify.design/'.$prefix.'.json', [
                'icons' => $icon,
            ]);
        } catch (\Throwable) {
            return null;
        }

        if (! $response->successful()) {
            return null;
        }

        $json = $response->json();
        $data = is_array($json) ? ($json['icons'][$icon] ?? null) : null;

        if (! is_array($data) || empty($data['body'])) {
            return null;
        }

        $width = $data['width'] ?? $json['width'] ?? 16;
        $height = $data['height'] ?? $json['height'] ?? 16;
        $left = $data['left'] ?? 0;
        $top = $data['top'] ?? 0;

        $result = [
            'name' => $name,
            'body' => $data['body'],
            'attributes' => [
                'width' => '1em',
                'height' => '1em',
                'viewBox' => $left.' '.$top.' '.$width.' '.$height,
            ],
        ];

        Cache::put($cacheKey, $result, 86400);

        return $result;
    }

    public static function isName(string $value): bool
    {
        return (bool) preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*$/i', trim($value));
    }
}
