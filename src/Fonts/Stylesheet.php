<?php

namespace MarioHamann\StatamicVisualEditor\Fonts;

/**
 * `fonts.css` — the one list of the site's fonts: an `@font-face` per file
 * and an `@import` per Adobe Fonts kit. The Fonts tab reads it back and only
 * ever adds to it: new faces go after their family's last face (or at the
 * end, under a `/* Family *\/` line), a kit after the last `@import`. What
 * someone wrote by hand stays as it is.
 *
 * A face is `['family', 'file', 'format', 'weight', 'style', 'unicodeRange']`,
 * `file` relative to the fonts folder as it stands in `url(…)`.
 */
final class Stylesheet
{
    private const HEADER = <<<'CSS'
/*
 * The site's fonts. Written by the Fonts tab in Live Preview's Theme panel
 * (Visual Editor); `{{ theme_tokens }}` links this file on every page, so a
 * font added on the server works without a build.
 *
 * One @font-face per file; a family's faces stand together. Editing by hand
 * is fine: the panel reads the rules back and only ever adds to the file.
 * Paths are relative to this file.
 */

CSS;

    private const FACE = '/@font-face\s*\{([^}]*)\}/i';

    private const IMPORT = '/@import\s+(?:url\(\s*)?["\']?([^"\')\s;]+)["\']?\s*\)?[^;]*;/i';

    public static function css(): string
    {
        $path = Folder::path(Folder::STYLESHEET);

        return is_file($path) ? (string) file_get_contents($path) : '';
    }

    /** @return list<array{family: string, file: string, format: string, weight: string, style: string, unicodeRange: ?string, end: int}> */
    public static function faces(?string $css = null): array
    {
        $css ??= static::css();
        $faces = [];

        preg_match_all(self::FACE, $css, $blocks, PREG_SET_ORDER | PREG_OFFSET_CAPTURE);

        foreach ($blocks as $block) {
            $body = $block[1][0];
            $family = static::descriptor($body, 'font-family');
            $src = static::descriptor($body, 'src');

            if ($family === null || $src === null || ! preg_match('/url\(\s*["\']?([^"\')]+)["\']?\s*\)/i', $src, $url)) {
                continue;
            }

            preg_match('/format\(\s*["\']?([\w-]+)/i', $src, $format);

            $faces[] = [
                'family' => trim($family, " \t\n\r\"'"),
                'file' => static::relative(trim($url[1])),
                'format' => strtolower($format[1] ?? ''),
                'weight' => (string) preg_replace('/\s+/', ' ', static::descriptor($body, 'font-weight') ?? '400'),
                'style' => strtolower(static::descriptor($body, 'font-style') ?? 'normal'),
                'unicodeRange' => static::descriptor($body, 'unicode-range'),
                'end' => $block[0][1] + strlen($block[0][0]),
            ];
        }

        return $faces;
    }

    /** @return list<string> the `@import` URLs, in file order */
    public static function imports(?string $css = null): array
    {
        preg_match_all(self::IMPORT, $css ?? static::css(), $matches);

        return array_values(array_unique($matches[1]));
    }

    /**
     * Add faces for one family; a face whose file is already in the list is
     * left out. Answers how many were written.
     *
     * @param  list<array{family: string, file: string, format: string, weight: string, style: string, unicodeRange?: ?string}>  $faces
     */
    public static function addFaces(string $family, array $faces): int
    {
        $css = static::css() ?: self::HEADER;
        $known = array_map(fn ($face) => strtolower($face['file']), static::faces($css));
        $blocks = [];

        foreach ($faces as $face) {
            $key = strtolower($face['file']);

            if (! in_array($key, $known, true)) {
                $known[] = $key;
                $blocks[] = static::block($family, $face);
            }
        }

        if (! $blocks) {
            return 0;
        }

        $mine = array_filter(static::faces($css), fn ($face) => strcasecmp($face['family'], $family) === 0);
        $text = implode("\n", $blocks);

        if ($mine) {
            $at = max(array_column($mine, 'end'));
            $css = substr($css, 0, $at)."\n".$text.substr($css, $at);
        } else {
            $css = rtrim($css)."\n\n/* {$family} */\n{$text}\n";
        }

        static::write($css);

        return count($blocks);
    }

    /** Add `@import url("…");` for a kit, after the last import or before the first rule. */
    public static function addImport(string $url): bool
    {
        $css = static::css() ?: self::HEADER;

        if (in_array($url, static::imports($css), true)) {
            return false;
        }

        $line = '@import url("'.$url.'");';

        if (preg_match_all(self::IMPORT, $css, $imports, PREG_OFFSET_CAPTURE) && $imports[0]) {
            $last = end($imports[0]);
            $at = $last[1] + strlen($last[0]);
            $css = substr($css, 0, $at)."\n".$line.substr($css, $at);
        } elseif (preg_match('/@font-face\b/i', $css, $first, PREG_OFFSET_CAPTURE)) {
            // Before the first rule — and before its `/* Family */` line, when it has one.
            $at = $first[0][1];

            if (preg_match('#/\*[^*]*\*/\s*$#', substr($css, 0, $at), $note, PREG_OFFSET_CAPTURE)) {
                $at = $note[0][1];
            }

            $css = substr($css, 0, $at).$line."\n\n".substr($css, $at);
        } else {
            $css = rtrim($css)."\n\n".$line."\n";
        }

        static::write($css);

        return true;
    }

    public static function block(string $family, array $face): string
    {
        $lines = [
            '  font-family: "'.$family.'";',
            '  src: url("'.$face['file'].'") format("'.$face['format'].'");',
            '  font-weight: '.$face['weight'].';',
            '  font-style: '.$face['style'].';',
            '  font-display: swap;',
        ];

        if (! empty($face['unicodeRange'])) {
            $lines[] = '  unicode-range: '.$face['unicodeRange'].';';
        }

        return "@font-face {\n".implode("\n", $lines)."\n}";
    }

    /** `format()` for a file extension. */
    public static function format(string $extension): string
    {
        return match (strtolower($extension)) {
            'woff' => 'woff',
            'ttf' => 'truetype',
            'otf' => 'opentype',
            default => 'woff2',
        };
    }

    private static function write(string $css): void
    {
        $path = Folder::path(Folder::STYLESHEET);

        if (! is_dir(dirname($path))) {
            mkdir(dirname($path), 0775, true);
        }

        if (file_put_contents($path, $css, LOCK_EX) === false) {
            throw new \RuntimeException('fonts.css could not be written');
        }
    }

    private static function descriptor(string $body, string $name): ?string
    {
        if (! preg_match('/(?:^|[;\s{])'.preg_quote($name, '/').'\s*:\s*([^;]+)/i', $body, $m)) {
            return null;
        }

        return trim($m[1]);
    }

    /** A url() as a path in the fonts folder: `/fonts/a/b.woff2` → `a/b.woff2`; remote and relative ones as they are. */
    private static function relative(string $url): string
    {
        $base = Folder::url().'/';

        if (str_starts_with($url, $base)) {
            return rawurldecode(substr($url, strlen($base)));
        }

        return str_starts_with($url, './') ? substr($url, 2) : $url;
    }
}
