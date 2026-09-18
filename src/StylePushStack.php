<?php

namespace MarioHamann\StatamicVisualEditor;

use Vizuall\StylePush\Tags\StylePush;

/**
 * Push CSS onto the site's `style_push` stack so it lands in `<head>` via
 * `yield_minified` — the same path as `{{ style_push }}` in a section partial.
 *
 * `StylePush::$stack` is protected, so the write goes through a subclass that
 * shares the parent's static storage. No second stack.
 */
class StylePushStack
{
    public static function available(): bool
    {
        return class_exists(StylePush::class);
    }

    public static function push(string $css): void
    {
        $css = trim($css);

        if ($css === '' || ! static::available()) {
            return;
        }

        StylePushStackBridge::push($css);
    }

    /** How many entries the stack has right now — the mark to measure from. */
    public static function mark(): int
    {
        return static::available() ? StylePushStackBridge::mark() : 0;
    }

    /** @return list<string> what was pushed since the mark */
    public static function since(int $mark): array
    {
        return static::available() ? StylePushStackBridge::since($mark) : [];
    }

    /** @param  list<string>  $styles */
    public static function pushAll(array $styles): void
    {
        foreach ($styles as $css) {
            static::push((string) $css);
        }
    }
}
