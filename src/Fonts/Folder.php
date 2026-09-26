<?php

namespace MarioHamann\StatamicVisualEditor\Fonts;

/**
 * Where the site's fonts live: `public/fonts` (config `fonts.root`), served
 * at `/fonts` (config `fonts.url`), with `fonts.css` in it as the one list of
 * what is installed. The site's `{{ theme_tokens }}` links that file.
 *
 * Nothing here removes or overwrites a file: a new file whose name is taken
 * by different bytes gets a free name instead (`name-2.woff2`).
 */
final class Folder
{
    public const STYLESHEET = 'fonts.css';

    public static function path(string $relative = ''): string
    {
        $root = rtrim((string) config('statamic-visual-editor.fonts.root', public_path('fonts')), '/');

        return $relative === '' ? $root : $root.'/'.ltrim($relative, '/');
    }

    public static function url(string $relative = ''): string
    {
        $root = rtrim((string) config('statamic-visual-editor.fonts.url', '/fonts'), '/');

        return $relative === '' ? $root : $root.'/'.implode('/', array_map('rawurlencode', explode('/', ltrim($relative, '/'))));
    }

    /** Can this server's PHP add files and write fonts.css? */
    public static function writable(): bool
    {
        $root = static::path();

        if (! is_dir($root)) {
            return is_writable(dirname($root));
        }

        $css = static::path(self::STYLESHEET);

        return is_writable($root) && (! is_file($css) || is_writable($css));
    }

    /** `Barlow Condensed` → `barlow-condensed`: the family's folder and file prefix. */
    public static function slug(string $name): string
    {
        $slug = strtolower((string) preg_replace('/[^A-Za-z0-9]+/', '-', static::ascii($name)));

        return trim($slug, '-') ?: 'font';
    }

    /**
     * A family name safe to write into CSS between double quotes: letters,
     * digits, spaces, dashes and underscores; null when nothing usable is left.
     */
    public static function family(string $name): ?string
    {
        $clean = trim((string) preg_replace('/\s+/u', ' ', (string) preg_replace('/[^\p{L}\p{N} _-]+/u', '', $name)));

        return $clean === '' ? null : mb_substr($clean, 0, 64);
    }

    /**
     * Store `$bytes` as `$relative` and answer the relative path it got: the
     * same name when the file is new or already holds these bytes, else the
     * first free `-2`, `-3` … — an existing file is never overwritten.
     */
    public static function store(string $relative, string $bytes): ?string
    {
        $info = pathinfo($relative);
        $dir = ($info['dirname'] ?? '.') === '.' ? '' : $info['dirname'].'/';
        $ext = isset($info['extension']) ? '.'.$info['extension'] : '';

        for ($n = 1; $n < 100; $n++) {
            $candidate = $dir.$info['filename'].($n === 1 ? '' : '-'.$n).$ext;
            $path = static::path($candidate);

            if (is_file($path)) {
                if (hash_file('sha256', $path) === hash('sha256', $bytes)) {
                    return $candidate;
                }

                continue;
            }

            if (! is_dir(dirname($path)) && ! @mkdir(dirname($path), 0775, true) && ! is_dir(dirname($path))) {
                return null;
            }

            return file_put_contents($path, $bytes, LOCK_EX) === strlen($bytes) ? $candidate : null;
        }

        return null;
    }

    private static function ascii(string $name): string
    {
        $ascii = function_exists('iconv') ? @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $name) : false;

        return $ascii === false ? $name : $ascii;
    }
}
