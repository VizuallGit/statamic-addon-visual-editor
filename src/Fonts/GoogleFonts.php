<?php

namespace MarioHamann\StatamicVisualEditor\Fonts;

use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

/**
 * Google Fonts, installed into the site's own fonts folder: visitors never
 * contact Google.
 *
 * The catalog is Google's own metadata (every family, its styles, scripts
 * and weight axis), trimmed and cached for a week. The files come from the
 * CSS API (`css2`) asked as a current browser, which answers with WOFF2 —
 * nothing to convert. A family with a weight axis is served as one variable
 * file per script and style whatever weights are asked for, so it is asked
 * for its whole range: the site gets every weight for the size of one.
 *
 * Only Google's hosts are fetched, and only for a family and styles the
 * catalog lists.
 */
final class GoogleFonts
{
    private const METADATA = 'https://fonts.google.com/metadata/fonts';

    private const CSS = 'https://fonts.googleapis.com/css2';

    private const FILES = 'https://fonts.gstatic.com/';

    /** A current browser: css2 answers it with WOFF2 files. */
    private const AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

    private const CACHE = 'sve-google-fonts-v1';

    /**
     * Every family, most popular first:
     * `['family', 'category', 'variants' => ['400', '400i', …], 'subsets', 'axis' => [min, max] | null]`.
     */
    public static function catalog(): array
    {
        return Cache::remember(self::CACHE, now()->addWeek(), fn () => static::fetchCatalog());
    }

    public static function find(string $family): ?array
    {
        foreach (static::catalog() as $font) {
            if ($font['family'] === $family) {
                return $font;
            }
        }

        return null;
    }

    /**
     * The files the choice installs — one per script, style and (for a
     * family without a weight axis) weight — with their sizes.
     *
     * @return array{faces: list<array>, bytes: int}
     */
    public static function plan(array $font, array $variants, array $subsets): array
    {
        $faces = static::faces($font, $variants, $subsets);
        $sizes = static::sizes(array_column($faces, 'url'));

        foreach ($faces as &$face) {
            $face['bytes'] = $sizes[$face['url']] ?? 0;
        }

        return ['faces' => $faces, 'bytes' => array_sum(array_column($faces, 'bytes'))];
    }

    /**
     * Download the chosen files into `{slug}/` and add them to fonts.css.
     *
     * @return int how many faces were added
     */
    public static function install(array $font, array $variants, array $subsets): int
    {
        $faces = static::faces($font, $variants, $subsets);
        $slug = Folder::slug($font['family']);
        $responses = Http::pool(fn (Pool $pool) => array_map(
            fn ($url) => $pool->as($url)->timeout(30)->get($url),
            array_values(array_unique(array_column($faces, 'url')))
        ));
        $written = [];

        foreach ($faces as $face) {
            $response = $responses[$face['url']] ?? null;
            $bytes = $response instanceof \Illuminate\Http\Client\Response && $response->successful() ? $response->body() : '';

            if (! str_starts_with($bytes, 'wOF2')) {
                throw new \RuntimeException('Google Fonts sent no font for '.$face['url']);
            }

            $name = implode('-', array_filter([
                $slug,
                str_replace(' ', '-', $face['weight']),
                $face['style'] === 'italic' ? 'italic' : null,
                trim($face['subset'], '[]'),
            ], fn ($part) => $part !== null && $part !== ''));
            $file = Folder::store("{$slug}/{$name}.woff2", $bytes);

            if ($file === null) {
                throw new \RuntimeException("{$name}.woff2 could not be written");
            }

            $written[] = [
                'file' => $file,
                'format' => 'woff2',
                'weight' => $face['weight'],
                'style' => $face['style'],
                'unicodeRange' => $face['unicodeRange'],
            ];
        }

        return Stylesheet::addFaces(Folder::family($font['family']) ?? $font['family'], $written);
    }

    /** The `family=` value css2 wants: `Rubik:ital,wght@0,300..900;1,300..900`, `Lato:wght@400;700`. */
    public static function query(array $font, array $variants): string
    {
        $italic = fn ($v) => str_ends_with($v, 'i');
        $withItalic = (bool) array_filter($variants, $italic);

        if ($font['axis']) {
            [$min, $max] = $font['axis'];
            $range = $min === $max ? (string) $min : "{$min}..{$max}";
            $styles = array_values(array_unique(array_map(fn ($v) => $italic($v) ? 1 : 0, $variants)));
            sort($styles);
            $spec = $withItalic
                ? 'ital,wght@'.implode(';', array_map(fn ($s) => "{$s},{$range}", $styles))
                : "wght@{$range}";
        } else {
            $tuples = array_map(fn ($v) => [$italic($v) ? 1 : 0, (int) $v], $variants);
            usort($tuples, fn ($a, $b) => $a <=> $b);
            $spec = $withItalic
                ? 'ital,wght@'.implode(';', array_map(fn ($t) => "{$t[0]},{$t[1]}", $tuples))
                : 'wght@'.implode(';', array_map(fn ($t) => $t[1], $tuples));
        }

        return str_replace(' ', '+', $font['family']).':'.$spec;
    }

    /**
     * The `@font-face` rules of a css2 answer, each with the script it covers
     * (the comment Google writes above it: `latin`, `cyrillic-ext`, or `[12]`
     * for one slice of a large CJK font).
     *
     * @return list<array{subset: string, weight: string, style: string, url: string, unicodeRange: ?string}>
     */
    public static function parse(string $css): array
    {
        $faces = [];

        preg_match_all('#(?:/\*\s*([^*]*?)\s*\*/\s*)?@font-face\s*\{([^}]*)\}#i', $css, $blocks, PREG_SET_ORDER);

        foreach ($blocks as [, $label, $body]) {
            if (! preg_match('/src:\s*url\(\s*["\']?([^"\')\s]+)/i', $body, $url)) {
                continue;
            }

            preg_match('/font-weight:\s*([^;]+);/i', $body, $weight);
            preg_match('/font-style:\s*([^;]+);/i', $body, $style);
            preg_match('/unicode-range:\s*([^;]+);/i', $body, $range);

            $faces[] = [
                'subset' => $label !== '' ? $label : 'all',
                'weight' => trim($weight[1] ?? '400'),
                'style' => trim($style[1] ?? 'normal'),
                'url' => $url[1],
                'unicodeRange' => isset($range[1]) ? trim($range[1]) : null,
            ];
        }

        return $faces;
    }

    /** The css2 faces for a choice, narrowed to the chosen scripts, one per file. */
    private static function faces(array $font, array $variants, array $subsets): array
    {
        $css = Cache::remember(self::CACHE.':css:'.md5(static::query($font, $variants)), now()->addDay(), function () use ($font, $variants) {
            return Http::withHeaders(['User-Agent' => self::AGENT])
                ->timeout(20)
                ->get(self::CSS.'?family='.static::query($font, $variants).'&display=swap')
                ->throw()
                ->body();
        });

        $all = static::parse($css);
        $named = array_filter(array_column($all, 'subset'), fn ($s) => ! str_starts_with($s, '['));
        // A CJK script comes as numbered slices, not under its own name: a
        // chosen script that has no block of its own is what the slices are.
        $slices = (bool) array_diff($subsets, $named);
        $faces = [];

        foreach ($all as $face) {
            $wanted = in_array($face['subset'], $subsets, true)
                || ($slices && str_starts_with($face['subset'], '['))
                || $face['subset'] === 'all';

            if ($wanted && str_starts_with($face['url'], self::FILES) && ! isset($faces[$face['url'].$face['weight'].$face['style']])) {
                $faces[$face['url'].$face['weight'].$face['style']] = $face;
            }
        }

        // Upright before italic, light before bold; Google's script order within (usort is stable).
        $faces = array_values($faces);
        usort($faces, fn ($a, $b) => [$a['style'] !== 'normal', (int) $a['weight']] <=> [$b['style'] !== 'normal', (int) $b['weight']]);

        return $faces;
    }

    /** @return array<string, int> bytes per URL, from HEAD requests, remembered for a day */
    private static function sizes(array $urls): array
    {
        $key = self::CACHE.':size:';
        $sizes = [];
        $missing = [];

        foreach (array_unique($urls) as $url) {
            $known = Cache::get($key.md5($url));

            $known === null ? $missing[] = $url : $sizes[$url] = $known;
        }

        if ($missing) {
            $responses = Http::pool(fn (Pool $pool) => array_map(
                fn ($url) => $pool->as($url)->timeout(10)->head($url),
                $missing
            ));

            foreach ($missing as $url) {
                $response = $responses[$url] ?? null;
                $bytes = $response instanceof \Illuminate\Http\Client\Response && $response->successful()
                    ? (int) $response->header('Content-Length')
                    : 0;

                $sizes[$url] = $bytes;

                if ($bytes > 0) {
                    Cache::put($key.md5($url), $bytes, now()->addDay());
                }
            }
        }

        return $sizes;
    }

    private static function fetchCatalog(): array
    {
        $body = Http::timeout(30)->get(self::METADATA)->throw()->body();
        $data = json_decode(substr($body, (int) strpos($body, '{')), true);
        $fonts = [];

        foreach ((array) ($data['familyMetadataList'] ?? []) as $family) {
            $variants = array_map('strval', array_keys((array) ($family['fonts'] ?? [])));

            if (! is_string($family['family'] ?? null) || ! $variants) {
                continue;
            }

            usort($variants, fn ($a, $b) => [str_ends_with($a, 'i'), (int) $a] <=> [str_ends_with($b, 'i'), (int) $b]);

            $axis = null;

            foreach ((array) ($family['axes'] ?? []) as $a) {
                if (($a['tag'] ?? '') === 'wght') {
                    $axis = [(int) round($a['min']), (int) round($a['max'])];
                }
            }

            $fonts[] = [
                'family' => $family['family'],
                'category' => (string) ($family['category'] ?? ''),
                'variants' => $variants,
                'subsets' => array_values(array_diff((array) ($family['subsets'] ?? []), ['menu'])),
                'axis' => $axis,
                'popularity' => (int) ($family['popularity'] ?? PHP_INT_MAX),
            ];
        }

        if (! $fonts) {
            throw new \RuntimeException('Google Fonts sent an empty catalog');
        }

        usort($fonts, fn ($a, $b) => $a['popularity'] <=> $b['popularity']);

        return array_map(function ($font) {
            unset($font['popularity']);

            return $font;
        }, $fonts);
    }
}
