<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * A snippet: one file under `resources/snippets`, of one of two kinds.
 *
 * An HTML snippet is `{name}.antlers.html` in the same HTML / CSS / JS shape
 * the template dock reads — markup, then `style_push`, then `script_push`,
 * built with `SectionTemplate::join()` and read back with `split()`.
 *
 * A CSS snippet is `{name}.css`, holding the body of one rule and nothing
 * else: declarations and nested `&…` / `@media` blocks, no selector around
 * them. The dock writes that body into the class of the element you have
 * picked; the file never says which class. (Until v1.1.5xx a CSS-only snippet
 * was an `.antlers.html` with the rule, selector and all, in a `style_push`.
 * Nothing reads that shape as a CSS snippet any more.)
 *
 * One name, one file: a name is never both kinds at once. Nothing renders
 * these files; they are library entries the dock copies from.
 */
class Snippet
{
    public const CSS = 'css';

    public const HTML = 'html';

    public static function directory(): string
    {
        return resource_path('snippets');
    }

    /** Lowercase, no slashes — one flat folder, so a name cannot walk out of it. */
    public static function normalizeName(string $name): ?string
    {
        $name = strtolower(trim(str_replace(['\\', ' ', '-'], ['/', '_', '_'], $name)));
        $name = preg_replace('/\.(antlers\.html|blade\.php|css)$/', '', $name) ?? $name;
        $name = preg_replace('/[^a-z0-9_]/', '', $name) ?? '';
        $name = trim($name, '_');

        if ($name === '' || strlen($name) > 60 || ! preg_match('/^[a-z]/', $name)) {
            return null;
        }

        return $name;
    }

    public static function path(string $name, string $kind = self::HTML): string
    {
        return static::directory().'/'.$name.($kind === self::CSS ? '.css' : '.antlers.html');
    }

    /**
     * Which kind of file holds the name, or null when neither does.
     *
     * The folder is the site's own, so both can be there for one name if
     * somebody put them there by hand. The CSS one is the snippet then: it is
     * the newer shape, and `write()` / `writeCss()` always take the other away.
     */
    public static function kind(string $name): ?string
    {
        if (is_file(static::path($name, self::CSS))) {
            return self::CSS;
        }

        if (is_file(static::path($name, self::HTML))) {
            return self::HTML;
        }

        return null;
    }

    public static function exists(string $name): bool
    {
        return static::kind($name) !== null;
    }

    /**
     * @return array{name: string, kind: string, html: string, css: string, js: string}|null
     */
    public static function read(string $name): ?array
    {
        $kind = static::kind($name);

        if ($kind === null) {
            return null;
        }

        if ($kind === self::CSS) {
            return [
                'name' => $name,
                'kind' => self::CSS,
                'html' => '',
                'css' => (string) file_get_contents(static::path($name, self::CSS)),
                'js' => '',
            ];
        }

        $parts = SectionTemplate::split((string) file_get_contents(static::path($name, self::HTML)), '');

        return [
            'name' => $name,
            'kind' => self::HTML,
            'html' => (string) $parts['html'],
            'css' => (string) $parts['css'],
            'js' => (string) $parts['js'],
        ];
    }

    /**
     * Every snippet on this site, by name, both kinds in one list.
     *
     * @return list<array{name: string, kind: string, html: bool, css: bool, js: bool, hint: string}>
     */
    public static function all(): array
    {
        $dir = static::directory();

        if (! is_dir($dir)) {
            return [];
        }

        $names = [];

        foreach (scandir($dir) ?: [] as $file) {
            $name = null;

            if (str_ends_with($file, '.antlers.html')) {
                $name = substr($file, 0, -strlen('.antlers.html'));
            } elseif (str_ends_with($file, '.css')) {
                $name = substr($file, 0, -strlen('.css'));
            }

            // The folder is the site's own, so it can hold files this addon
            // never made. A name it could not have written cannot be addressed,
            // so it is not offered.
            if ($name === null || static::normalizeName($name) !== $name) {
                continue;
            }

            $names[$name] = true;
        }

        $out = [];

        foreach (array_keys($names) as $name) {
            $parts = static::read($name);

            if ($parts === null) {
                continue;
            }

            $out[] = [
                'name' => $name,
                'kind' => $parts['kind'],
                'html' => trim($parts['html']) !== '',
                'css' => trim($parts['css']) !== '',
                'js' => trim($parts['js']) !== '',
                'hint' => static::hint($parts['html'], $parts['css']),
            ];
        }

        usort($out, fn (array $a, array $b) => strnatcasecmp($a['name'], $b['name']));

        return $out;
    }

    /**
     * An HTML snippet: markup with the CSS and JS that travel with it.
     *
     * @return array{name: string, kind: string, path: string, html: bool, css: bool, js: bool}|null
     */
    public static function write(string $name, string $html, string $css, string $js): ?array
    {
        if (! static::ensureDirectory()) {
            return null;
        }

        // A snippet has no Tailwind key and must not start locked, so both the
        // section handle and the Tailwind handle stay empty.
        $contents = SectionTemplate::join([
            'html' => $html,
            'css' => $css,
            'js' => $js,
            'locked' => false,
        ], '', '');

        if (file_put_contents(static::path($name, self::HTML), $contents) === false) {
            return null;
        }

        static::dropOther($name, self::HTML);
        GitSync::after('snippet '.$name);

        return [
            'name' => $name,
            'kind' => self::HTML,
            'path' => SectionTemplate::relative(static::path($name, self::HTML)),
            'html' => trim($html) !== '',
            'css' => trim($css) !== '',
            'js' => trim($js) !== '',
        ];
    }

    /**
     * A CSS snippet: the body of one rule, as handed in, with one line break
     * at the end. No selector is added and none is looked for — the dock
     * strips it before the body gets here.
     *
     * @return array{name: string, kind: string, path: string, html: bool, css: bool, js: bool}|null
     */
    public static function writeCss(string $name, string $body): ?array
    {
        $body = trim($body);

        if ($body === '' || ! static::ensureDirectory()) {
            return null;
        }

        if (file_put_contents(static::path($name, self::CSS), $body."\n") === false) {
            return null;
        }

        static::dropOther($name, self::CSS);
        GitSync::after('snippet '.$name);

        return [
            'name' => $name,
            'kind' => self::CSS,
            'path' => SectionTemplate::relative(static::path($name, self::CSS)),
            'html' => false,
            'css' => true,
            'js' => false,
        ];
    }

    /**
     * The file under a new name, same kind. False when there is nothing under
     * the old name, or the new one is already taken by either kind.
     */
    public static function rename(string $from, string $to): bool
    {
        $kind = static::kind($from);

        if ($kind === null || $from === $to || static::exists($to)) {
            return false;
        }

        if (! @rename(static::path($from, $kind), static::path($to, $kind))) {
            return false;
        }

        GitSync::after('snippet '.$from.' renamed '.$to);

        return true;
    }

    /** The file gone. False when there was none. */
    public static function delete(string $name): bool
    {
        $kind = static::kind($name);

        if ($kind === null || ! @unlink(static::path($name, $kind))) {
            return false;
        }

        // Both, should a stray second file be there: the name is to be free.
        static::dropOther($name, $kind);
        GitSync::after('snippet '.$name.' removed');

        return true;
    }

    private static function ensureDirectory(): bool
    {
        $dir = static::directory();

        return is_dir($dir) || @mkdir($dir, 0755, true) || is_dir($dir);
    }

    /** One name, one file: writing one kind takes the other kind's file away. */
    private static function dropOther(string $name, string $kept): void
    {
        $other = static::path($name, $kept === self::CSS ? self::HTML : self::CSS);

        if (is_file($other)) {
            @unlink($other);
        }
    }

    /** The first line the library list can show under the name. */
    private static function hint(string $html, string $css): string
    {
        $source = trim($html) !== '' ? $html : $css;

        foreach (preg_split('/\R/', $source) ?: [] as $line) {
            $line = trim($line);

            if ($line !== '') {
                return mb_substr($line, 0, 80);
            }
        }

        return '';
    }
}
