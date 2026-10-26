<?php

namespace MarioHamann\StatamicVisualEditor\DockGhost;

/**
 * Where the caret stands in the markup, read from the file before it: inside
 * an attribute's value, inside an Antlers tag, inside an opening tag, or
 * between elements — and then whether it is on an empty line, and in which
 * element (a fresh line in a <ul> is where a loop goes).
 *
 * The model is told, so a caret in `x-data="{ |` gets Alpine state and not a
 * block of HTML; and the answer is held to it (Reply), so nothing runs past
 * the attribute's closing quote. A reading for hints, not a parser: Antlers
 * with a `>` in it can fool it, and then the hint is only less precise.
 */
final class Caret
{
    /** Characters of the file before the caret that are looked at. */
    public const TAIL = 4000;

    /** Elements that never close. */
    public const VOID = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'];

    /**
     * @return array{kind: 'attribute'|'antlers'|'tag'|'markup', tag?: string, attribute?: string, quote?: string, fresh?: bool, inside?: ?string}
     */
    public static function of(string $before): array
    {
        $tail = substr($before, -static::TAIL);
        $open = static::openTag($tail);

        if ($open !== null) {
            [$tag, $inside] = $open;

            if (static::inAntlers($inside)) {
                return ['kind' => 'antlers', 'tag' => $tag];
            }

            if (preg_match('/([^\s=<>"\'{}\/]+)\s*=\s*(["\'])((?:(?!\2).)*)\z/s', $inside, $match)) {
                return ['kind' => 'attribute', 'tag' => $tag, 'attribute' => $match[1], 'quote' => $match[2]];
            }

            return ['kind' => 'tag', 'tag' => $tag];
        }

        if (static::inAntlers($tail)) {
            return ['kind' => 'antlers'];
        }

        return ['kind' => 'markup', 'fresh' => (bool) preg_match('/(?:\A|\n)[ \t]*\z/', $before), 'inside' => static::inside($tail)];
    }

    /** The innermost element still open before the caret, or null. */
    public static function inside(string $tail): ?string
    {
        $text = (string) preg_replace('/\{\{.*?\}\}/s', '', $tail);
        $stack = [];

        preg_match_all('/<(\/?)([a-zA-Z][\w:.-]*)(?:"[^"]*"|\'[^\']*\'|[^\'">])*?(\/?)>/s', $text, $tags, PREG_SET_ORDER);

        foreach ($tags as [, $closing, $name, $self]) {
            $name = strtolower($name);

            if ($closing === '') {
                if ($self === '' && ! in_array($name, static::VOID, true)) {
                    $stack[] = $name;
                }

                continue;
            }

            $at = array_search($name, array_reverse($stack, true), true);

            if ($at !== false) {
                $stack = array_slice($stack, 0, $at);
            }
        }

        return $stack === [] ? null : end($stack);
    }

    /** What the model is told about the caret, for the user turn; '' between elements. */
    public static function hint(array $caret): string
    {
        $tag = isset($caret['tag']) ? "<{$caret['tag']}>" : '';

        return match ($caret['kind']) {
            'attribute' => "The caret is inside the value of {$caret['attribute']}={$caret['quote']}…{$caret['quote']} on {$tag}. Write only the rest of that value: no closing quote, nothing after it.".static::about($caret['attribute']),
            'antlers' => 'The caret is inside an Antlers tag {{ … }}: complete that tag and end it with }} unless <after> already does.',
            'tag' => "The caret is inside the opening tag {$tag}: write attributes only, no > and no content.",
            default => '',
        };
    }

    /** What an attribute holds, for the ones where that is not obvious. */
    protected static function about(string $attribute): string
    {
        return match (true) {
            $attribute === 'x-data' => ' x-data holds Alpine state: an object such as { open: false }.',
            $attribute === 'class' => " Class names only: the site's own classes and tokens, and Tailwind utilities.",
            str_starts_with($attribute, 'x-') || str_starts_with($attribute, '@') || str_starts_with($attribute, ':') => ' It is an Alpine.js expression.',
            default => '',
        };
    }

    /**
     * The opening tag the caret stands in, as [name, its text so far]; null
     * when the last `<` before the caret is closed or is no opening tag.
     *
     * @return array{0: string, 1: string}|null
     */
    protected static function openTag(string $tail): ?array
    {
        $lt = strrpos($tail, '<');

        if ($lt === false || ! preg_match('/\G<([a-zA-Z][\w:.-]*)/', $tail, $match, 0, $lt)) {
            return null;
        }

        $inside = substr($tail, $lt);

        // A `>` that is not inside a quoted value or an Antlers tag closes it.
        if (str_contains(static::bare($inside), '>')) {
            return null;
        }

        return [$match[1], $inside];
    }

    /** The tag's text without its Antlers tags and quoted values — the one still open at the caret too. */
    protected static function bare(string $inside): string
    {
        return (string) preg_replace(['/\{\{.*?\}\}/s', '/\{\{.*\z/s', '/"[^"]*"/', "/'[^']*'/", '/["\'].*\z/s'], '', $inside);
    }

    protected static function inAntlers(string $text): bool
    {
        $open = strrpos($text, '{{');

        return $open !== false && strpos($text, '}}', $open) === false;
    }
}
