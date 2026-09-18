<?php

namespace MarioHamann\StatamicVisualEditor\SectionTemplate;

/**
 * The wrappers a pane is stored inside: an Antlers tag pair
 * (`{{ style_push }} … {{ /style_push }}`) and the `<style>` / `<script>`
 * element the dock never shows. Find, peel, unwrap and wrap.
 * Moved verbatim out of SectionTemplate in WP7d.
 */
final class Wrappers
{
    /**
     * @return array{rest: string, inner: string}|null
     */
    public static function extractPair(string $html, string $tag): ?array
    {
        $open = '\{\{\s*'.preg_quote($tag, '~').'\s*\}\}';
        $close = '\{\{\s*/'.preg_quote($tag, '~').'\s*\}\}';

        if (! preg_match('~^(.*)('.$open.')(.*?)('.$close.')(.*)$~s', $html, $m)) {
            return null;
        }

        $rest = rtrim($m[1]).ltrim($m[5]);

        return [
            'rest' => preg_replace('/\n{3,}/', "\n\n", $rest) ?? $rest,
            'inner' => $m[3],
        ];
    }

    /**
     * @return array{rest: string, inner: string}|null
     */
    public static function peelTrailingPair(string $html, string $tag): ?array
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

    public static function unwrapPair(string $html, string $tag): ?string
    {
        $open = '\{\{\s*'.preg_quote($tag, '~').'\s*\}\}';
        $close = '\{\{\s*/'.preg_quote($tag, '~').'\s*\}\}';

        if (! preg_match('~^\s*'.$open.'(.*?)'.$close.'\s*$~s', $html, $m)) {
            return null;
        }

        return $m[1];
    }

    public static function wrapPair(string $tag, string $inner): string
    {
        return "\n\n{{ {$tag} }}\n{$inner}\n{{ /{$tag} }}";
    }

    /**
     * Drop a wrapping `<style>` / `<script>` so the dock pane is just the code.
     * Leaves the inner alone when it is not a single pair of those tags.
     */
    public static function unwrapTagged(string $inner, string $tag): string
    {
        $name = preg_quote($tag, '/');

        if (! preg_match('/^\s*<'.$name.'\b[^>]*>\s*(.*?)\s*<\/'.$name.'>\s*$/is', $inner, $m)) {
            return $inner;
        }

        return Panes::trimBlock($m[1]);
    }

    /**
     * Put `<style>` / `<script>` back for the file on disk. The layout stack
     * outputs this as HTML; without the tag the browser never runs it.
     */
    public static function wrapTagged(string $inner, string $tag): string
    {
        $name = preg_quote($tag, '/');

        if (preg_match('/^\s*<'.$name.'\b/i', $inner) && preg_match('/<\/'.$name.'>\s*$/i', $inner)) {
            return $inner;
        }

        return "<{$tag}>\n{$inner}\n</{$tag}>";
    }
}
