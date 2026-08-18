<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * The Antlers partial a page-section type is rendered from.
 *
 * The dock writes this file. The handle comes from the replicator set
 * (`hero/style_2`); the path is always under the section-partials directory,
 * never anywhere else — `..` and absolute paths are refused.
 */
class SectionTemplate
{
    public static function directory(): string
    {
        return (string) config(
            'statamic-visual-editor.templates.partials',
            resource_path('views/partials/page_sections')
        );
    }

    /**
     * Real path to write the partial, creating parent folders. Null when the
     * handle is unsafe. The file itself does not have to exist yet.
     */
    public static function writablePath(string $handle): ?string
    {
        $handle = str_replace('\\', '/', trim($handle));

        if ($handle === '' || str_contains($handle, '..') || str_starts_with($handle, '/')) {
            return null;
        }

        if (! preg_match('/^[A-Za-z0-9][A-Za-z0-9_\/.-]*$/', $handle)) {
            return null;
        }

        $base = static::directory();

        if (! is_dir($base) && ! @mkdir($base, 0775, true) && ! is_dir($base)) {
            return null;
        }

        $baseReal = realpath($base);

        if ($baseReal === false) {
            return null;
        }

        $candidate = $baseReal.DIRECTORY_SEPARATOR.str_replace('.', '/', $handle).'.antlers.html';
        $dir = dirname($candidate);

        if (! is_dir($dir) && ! @mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return null;
        }

        $dirReal = realpath($dir);

        if ($dirReal === false) {
            return null;
        }

        if ($dirReal !== $baseReal && ! str_starts_with($dirReal, $baseReal.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return $candidate;
    }

    public static function path(string $handle): ?string
    {
        $handle = str_replace('\\', '/', trim($handle));

        if ($handle === '' || str_contains($handle, '..') || str_starts_with($handle, '/')) {
            return null;
        }

        if (! preg_match('/^[A-Za-z0-9][A-Za-z0-9_\/.-]*$/', $handle)) {
            return null;
        }

        $base = realpath(static::directory());

        if ($base === false) {
            return null;
        }

        $candidate = $base.DIRECTORY_SEPARATOR.str_replace('.', '/', $handle).'.antlers.html';

        if (! is_file($candidate)) {
            return null;
        }

        $real = realpath($candidate);

        if ($real === false || ! str_starts_with($real, $base.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return $real;
    }

    public static function relative(string $absolute): string
    {
        $root = realpath(base_path()) ?: base_path();

        if (str_starts_with($absolute, $root.DIRECTORY_SEPARATOR)) {
            return substr($absolute, strlen($root) + 1);
        }

        return $absolute;
    }

    /**
     * Split a section partial into the three dock panes.
     *
     * CSS is the inner contents of the last `style_push` / `sve_css` pair that
     * is not inside an Antlers comment — without the wrapping `<style>` tag.
     * JS is the same for `script_push` / `sve_js`. Everything else is HTML —
     * including commented-out style blocks.
     *
     * @return array{html: string, css: string, js: string, tw: string, html_tag: ?string, css_tag: string, js_tag: string}
     */
    public static function split(string $contents): array
    {
        $placeholders = [];
        $masked = preg_replace_callback('/\{\{#.*?#\}\}/s', function (array $m) use (&$placeholders) {
            $key = '___SVE_CMT_'.count($placeholders).'___';
            $placeholders[$key] = $m[0];

            return $key;
        }, $contents) ?? $contents;

        $css = '';
        $js = '';
        $tw = '';
        $cssTag = 'style_push';
        $jsTag = 'script_push';
        $html = $masked;
        $suffix = '';

        $changed = true;

        while ($changed) {
            $changed = false;

            while (preg_match('/(___SVE_CMT_\d+___)(\s*)$/', $html, $m)) {
                $suffix = $m[1].$m[2].$suffix;
                $html = substr($html, 0, -strlen($m[0]));
            }

            foreach ([
                ['sve_tw', 'tw'],
                ['sve_css', 'css'],
                ['style_push', 'css'],
                ['sve_js', 'js'],
                ['script_push', 'js'],
            ] as [$tag, $bucket]) {
                $pair = static::peelTrailingPair($html, $tag);

                if ($pair === null) {
                    continue;
                }

                $html = $pair['rest'];

                if ($bucket === 'css') {
                    $css = static::joinBlocks($pair['inner'], $css);
                    $cssTag = $tag;
                } elseif ($bucket === 'tw') {
                    $tw = static::joinBlocks($pair['inner'], $tw);
                } else {
                    $js = static::joinBlocks($pair['inner'], $js);
                    $jsTag = $tag;
                }

                $changed = true;
                break;
            }
        }

        $html .= $suffix;
        $htmlTag = null;
        $wrapped = static::unwrapPair($html, 'sve_html');

        if ($wrapped !== null) {
            $html = $wrapped;
            $htmlTag = 'sve_html';
        }

        return [
            'html' => static::unmask(static::trimBlock($html), $placeholders),
            'css' => static::unwrapTagged(static::unmask(static::trimBlock($css), $placeholders), 'style'),
            'js' => static::unwrapTagged(static::unmask(static::trimBlock($js), $placeholders), 'script'),
            'tw' => static::unwrapTagged(static::unmask(static::trimBlock($tw), $placeholders), 'style'),
            'html_tag' => $htmlTag,
            'css_tag' => $cssTag,
            'js_tag' => $jsTag,
        ];
    }

    /**
     * Write the three panes back to one Antlers file.
     *
     * Empty CSS/JS panes drop their pair tags. Wrappers come from the file that
     * was on disk (`style_push` on this site), so a first CSS edit still pushes
     * into the layout stack. `<style>` / `<script>` are added around the pane
     * text — the dock never shows those tags.
     *
     * @param  array{html: string, css: string, js: string, tw?: string, html_tag?: ?string, css_tag?: string, js_tag?: string}  $parts
     */
    public static function join(array $parts): string
    {
        $html = (string) ($parts['html'] ?? '');
        $css = (string) ($parts['css'] ?? '');
        $js = (string) ($parts['js'] ?? '');
        $tw = (string) ($parts['tw'] ?? '');
        $htmlTag = $parts['html_tag'] ?? null;
        $cssTag = $parts['css_tag'] ?? 'style_push';
        $jsTag = $parts['js_tag'] ?? 'script_push';

        if (is_string($htmlTag) && $htmlTag !== '') {
            $html = '{{ '.$htmlTag." }}\n".$html."\n{{ /".$htmlTag.' }}';
        }

        $out = rtrim($html);

        if (trim($css) !== '') {
            $out .= static::wrapPair($cssTag, static::wrapTagged($css, 'style'));
        }

        if (trim($tw) !== '') {
            $out .= static::wrapPair('sve_tw', static::wrapTagged($tw, 'style'));
        }

        if (trim($js) !== '') {
            $out .= static::wrapPair($jsTag, static::wrapTagged($js, 'script'));
        }

        return $out === '' ? '' : $out."\n";
    }

    /**
     * @return array{rest: string, inner: string}|null
     */
    protected static function peelTrailingPair(string $html, string $tag): ?array
    {
        $open = '\{\{\s*'.preg_quote($tag, '~').'\s*\}\}';
        $close = '\{\{\s*/'.preg_quote($tag, '~').'\s*\}\}';

        if (! preg_match('~^(.*)('.$open.')(.*?)('.$close.')\s*$~s', rtrim($html), $m)) {
            return null;
        }

        return [
            'rest' => $m[1],
            'inner' => $m[3],
        ];
    }

    protected static function unwrapPair(string $html, string $tag): ?string
    {
        $open = '\{\{\s*'.preg_quote($tag, '~').'\s*\}\}';
        $close = '\{\{\s*/'.preg_quote($tag, '~').'\s*\}\}';

        if (! preg_match('~^\s*'.$open.'(.*?)'.$close.'\s*$~s', $html, $m)) {
            return null;
        }

        return $m[1];
    }

    protected static function wrapPair(string $tag, string $inner): string
    {
        return "\n\n{{ {$tag} }}\n{$inner}\n{{ /{$tag} }}";
    }

    /**
     * Drop a wrapping `<style>` / `<script>` so the dock pane is just the code.
     * Leaves the inner alone when it is not a single pair of those tags.
     */
    protected static function unwrapTagged(string $inner, string $tag): string
    {
        $name = preg_quote($tag, '/');

        if (! preg_match('/^\s*<'.$name.'\b[^>]*>\s*(.*?)\s*<\/'.$name.'>\s*$/is', $inner, $m)) {
            return $inner;
        }

        return static::trimBlock($m[1]);
    }

    /**
     * Put `<style>` / `<script>` back for the file on disk. The layout stack
     * outputs this as HTML; without the tag the browser never runs it.
     */
    protected static function wrapTagged(string $inner, string $tag): string
    {
        $name = preg_quote($tag, '/');

        if (preg_match('/^\s*<'.$name.'\b/i', $inner) && preg_match('/<\/'.$name.'>\s*$/i', $inner)) {
            return $inner;
        }

        return "<{$tag}>\n{$inner}\n</{$tag}>";
    }

    protected static function joinBlocks(string $inner, string $existing): string
    {
        $inner = static::trimBlock($inner);

        if ($existing === '') {
            return $inner;
        }

        if ($inner === '') {
            return $existing;
        }

        return $inner."\n\n".$existing;
    }

    protected static function trimBlock(string $value): string
    {
        return preg_replace('/^\n+|\n+$/', '', $value) ?? $value;
    }

    /**
     * @param  array<string, string>  $placeholders
     */
    protected static function unmask(string $value, array $placeholders): string
    {
        return strtr($value, $placeholders);
    }
}
