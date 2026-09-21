<?php

namespace MarioHamann\StatamicVisualEditor\SiteCss;

/**
 * Where the site's stylesheets live and which relative paths are accepted.
 * Moved verbatim out of SiteCss in WP7d.
 */
final class Root
{
    public const ENTRY = 'site.css';

    /**
     * The three kinds of file the panel manages, each in its own folder:
     * stylesheets in resources/css (with `site.css` as the Vite entry and its
     * `@import` lines kept in step), scripts in resources/js, and SVG icons in
     * resources/svg (the `{{ svg }}` tag reads them). Used to be stylesheets
     * only; the kind is chosen per request (`Root::use`) and defaults to css.
     */
    public const KINDS = ['css', 'js', 'svg'];

    private static string $kind = 'css';

    /** Choose the kind for this request; false for a kind that does not exist. */
    public static function use(string $kind): bool
    {
        if (! in_array($kind, self::KINDS, true)) {
            return false;
        }

        self::$kind = $kind;

        return true;
    }

    public static function kind(): string
    {
        return self::$kind;
    }

    /** The file extension of this kind, without the dot. */
    public static function extension(): string
    {
        return self::$kind;
    }

    /** The Vite entry whose imports are kept in step — stylesheets only. */
    public static function entry(): ?string
    {
        return self::$kind === 'css' ? self::ENTRY : null;
    }

    /** What a new file starts with: a comment naming it, or an empty icon. */
    public static function starter(string $relative): string
    {
        return match (self::$kind) {
            'js' => "// {$relative}\n",
            'svg' => "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    \n</svg>\n",
            default => "/* {$relative} */\n",
        };
    }

    public static function root(): string
    {
        $configured = config(self::$kind === 'css'
            ? 'statamic-visual-editor.site_css.root'
            : 'statamic-visual-editor.site_css.'.self::$kind.'_root');

        return is_string($configured) && $configured !== ''
            ? rtrim($configured, '/')
            : resource_path(self::$kind);
    }

    public static function relativeRoot(): string
    {
        $root = str_replace('\\', '/', static::root());
        $base = str_replace('\\', '/', base_path());

        if (str_starts_with($root, $base.'/')) {
            return ltrim(substr($root, strlen($base)), '/');
        }

        return 'resources/'.self::$kind;
    }

    public static function existingPath(string $relative): ?string
    {
        $rel = static::normalize($relative);

        if (! $rel || static::excluded($rel)) {
            return null;
        }

        $root = realpath(static::root());

        if (! $root) {
            return null;
        }

        $full = realpath($root.'/'.$rel);

        if (! $full || ! is_file($full) || ! str_starts_with($full, $root.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return $full;
    }

    public static function normalize(string $relative, bool $creating = false): ?string
    {
        $relative = str_replace('\\', '/', trim($relative));
        $relative = ltrim($relative, '/');

        if ($relative === '' || str_contains($relative, '..') || str_contains($relative, '//')) {
            return null;
        }

        $ext = static::extension();

        if ($creating && ! str_ends_with(strtolower($relative), '.'.$ext)) {
            if (! preg_match('/^[A-Za-z0-9][A-Za-z0-9_\-\/]*$/', $relative)) {
                return null;
            }

            $relative .= '.'.$ext;
        }

        if (! preg_match('/^[A-Za-z0-9][A-Za-z0-9_\-\/]*\.'.preg_quote($ext, '/').'$/', $relative)) {
            return null;
        }

        return $relative;
    }

    /** Control Panel files stay out of the tree: `cp.css`, `cp.js`. */
    public static function excluded(string $relative): bool
    {
        $name = basename($relative);
        $list = match (self::$kind) {
            'js' => config('statamic-visual-editor.site_css.exclude_js', ['cp.js']),
            'svg' => config('statamic-visual-editor.site_css.exclude_svg', []),
            default => config('statamic-visual-editor.site_css.exclude', ['cp.css']),
        };

        return in_array($name, (array) $list, true);
    }

    public static function relativeFrom(string $path): string
    {
        $root = realpath(static::root()) ?: static::root();
        $path = str_replace('\\', '/', $path);
        $root = str_replace('\\', '/', $root);

        return ltrim(substr($path, strlen($root)), '/');
    }
}
