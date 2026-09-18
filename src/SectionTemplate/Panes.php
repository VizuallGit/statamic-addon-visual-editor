<?php

namespace MarioHamann\StatamicVisualEditor\SectionTemplate;

use MarioHamann\StatamicVisualEditor\ComponentProps;
use MarioHamann\StatamicVisualEditor\TailwindStore;

/**
 * The three dock panes (HTML, CSS, JS) plus the Tailwind bucket, split out
 * of one Antlers file and joined back into it.
 * Moved verbatim out of SectionTemplate in WP7d.
 */
final class Panes
{
    /**
     * Split a section partial into the three dock panes.
     *
     * CSS is the inner contents of the last `style_push` / `sve_css` pair that
     * is not inside an Antlers comment — without the wrapping `<style>` tag.
     * JS is the same for `script_push` / `sve_js`. Everything else is HTML —
     * including commented-out style blocks.
     *
     * @return array{html: string, css: string, js: string, tw: string, html_tag: ?string, css_tag: string, js_tag: string, locked: bool}
     */
    public static function split(string $contents, string $handle = ''): array
    {
        $unlockedMarker = Locks::hasUnlockMarker($contents);
        $lockedMarker = Locks::hasLockMarker($contents);
        $contents = Locks::stripMarkers($contents);

        // The prop declaration comes off before anything else. It is a comment,
        // so the masking below would otherwise carry it straight into the HTML
        // pane, where it is noise: the panel is what edits it.
        $peeled = ComponentProps::peel($contents);
        $props = $peeled['props'];
        $contents = $peeled['rest'];

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
                $pair = Wrappers::peelTrailingPair($html, $tag);

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

        $embedded = Wrappers::extractPair($html, 'sve_tw');

        if ($embedded !== null) {
            $html = $embedded['rest'];
            $tw = static::joinBlocks($embedded['inner'], $tw);
        }

        // Bare in a section, `handle="…"` in a collection view file. Both forms
        // are the dock's own output and never belong in the HTML pane.
        $html = preg_replace('/\{\{\s*sve_tw(?:\s+[^}]*)?\}\}/', '', $html) ?? $html;

        $htmlTag = null;
        $wrapped = Wrappers::unwrapPair($html, 'sve_html');

        if ($wrapped !== null) {
            $html = $wrapped;
            $htmlTag = 'sve_html';
        }

        return [
            'html' => static::unmask(static::trimBlock($html), $placeholders),
            'css' => Wrappers::unwrapTagged(static::unmask(static::trimBlock($css), $placeholders), 'style'),
            'js' => Wrappers::unwrapTagged(static::unmask(static::trimBlock($js), $placeholders), 'script'),
            'tw' => Wrappers::unwrapTagged(static::unmask(static::trimBlock($tw), $placeholders), 'style'),
            'html_tag' => $htmlTag,
            'css_tag' => $cssTag,
            'js_tag' => $jsTag,
            'props' => $props,
            'locked' => Locks::resolveLocked($lockedMarker, $unlockedMarker, $handle),
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
     * `$twHandle` is the key into the Tailwind store and defaults to `$handle`,
     * so section partials keep their exact output. A collection view file passes
     * one here while `$handle` stays empty — the empty handle is what keeps it
     * from starting locked, so the two meanings must not share a variable.
     *
     * @param  array{html: string, css: string, js: string, tw?: string, html_tag?: ?string, css_tag?: string, js_tag?: string, props?: array, locked?: bool}  $parts
     */
    public static function join(array $parts, string $handle = '', ?string $twHandle = null): string
    {
        $twHandle = $twHandle ?? $handle;
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

        $html = rtrim($html);

        if ($twHandle !== '' && trim($tw) !== '') {
            TailwindStore::write($twHandle, $tw);
        }

        $out = $html;

        // CSS lives in resources/visual-editor/tw/{handle}.css. The tag sits
        // after the section (before style_push) so authored CSS wins cascade;
        // SveTw pushes onto the head stack — not a <style> in the markup.
        //
        // A section leaves the tag bare: SveTw resolves the key from `{{ type }}`
        // in the set context. A view file has no such context, so its key is
        // written out as a parameter.
        if ($twHandle !== '' && TailwindStore::has($twHandle)) {
            $out .= $twHandle === $handle
                ? "\n\n{{ sve_tw }}"
                : "\n\n{{ sve_tw handle=\"".$twHandle.'" }}';
        }

        if (trim($css) !== '') {
            $out .= Wrappers::wrapPair($cssTag, Wrappers::wrapTagged($css, 'style'));
        }

        if (trim($js) !== '') {
            $out .= Wrappers::wrapPair($jsTag, Wrappers::wrapTagged($js, 'script'));
        }

        $out = $out === '' ? '' : $out."\n";

        // The declaration at the very top, above the markup and above the lock
        // marker's line, so opening the file in an editor tells you what it
        // takes — and the `sve_defaults` pair around everything below it, which
        // is what makes the declared fallbacks apply without an assignment
        // escaping into the page's scope.
        if (is_array($parts['props'] ?? null)) {
            $out = ComponentProps::wrap($parts['props'], $out);
        }

        $marker = Locks::markerFor(! empty($parts['locked']), $handle);

        if ($marker !== null) {
            $out = $marker."\n".$out;
        }

        return $out;
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

    public static function trimBlock(string $value): string
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
