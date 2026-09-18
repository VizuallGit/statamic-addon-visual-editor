<?php

namespace MarioHamann\StatamicVisualEditor;

use Vizuall\StylePush\Tags\StylePush;

/**
 * Same `$stack` / `$seen` as `{{ style_push }}`. Loaded only when that class
 * exists — see {@see StylePushStack::push()}.
 */
class StylePushStackBridge extends StylePush
{
    public static function push(string $css): void
    {
        $hash = md5($css);

        if (! in_array($hash, static::$seen, true)) {
            static::$seen[] = $hash;
            static::$stack[] = $css;
        }
    }

    /** How many entries the stack has right now — the mark to measure from. */
    public static function mark(): int
    {
        return count(static::$stack);
    }

    /**
     * What was pushed since the mark, as plain strings.
     *
     * The tag stores what `$this->parse()` returned, and in Statamic 6 that is
     * an AntlersString — an object carrying closures, which no cache can
     * serialize. Cast here, once, so a cached partial holds only text.
     *
     * @return list<string>
     */
    public static function since(int $mark): array
    {
        return array_map(fn ($css) => (string) $css, array_slice(static::$stack, $mark));
    }

    public static function reset(): void
    {
        static::$stack = [];
        static::$seen = [];
    }
}
