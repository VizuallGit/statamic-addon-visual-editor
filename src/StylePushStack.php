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
    public static function push(string $css): void
    {
        $css = trim($css);

        if ($css === '' || ! class_exists(StylePush::class)) {
            return;
        }

        StylePushStackBridge::push($css);
    }
}
