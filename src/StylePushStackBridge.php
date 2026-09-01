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

    public static function reset(): void
    {
        static::$stack = [];
        static::$seen = [];
    }
}
