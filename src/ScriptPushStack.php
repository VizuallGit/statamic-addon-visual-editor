<?php

namespace MarioHamann\StatamicVisualEditor;

use Vizuall\StylePush\Tags\ScriptPush;

/**
 * The `{{ script_push }}` stack, reachable — and a no-op when the style-push
 * addon is not installed, so nothing here ever autoloads a class that is not
 * there. The twin of {@see StylePushStack}.
 */
class ScriptPushStack
{
    public static function available(): bool
    {
        return class_exists(ScriptPush::class);
    }

    public static function push(string $js): void
    {
        $js = trim($js);

        if ($js === '' || ! static::available()) {
            return;
        }

        ScriptPushStackBridge::push($js);
    }

    public static function mark(): int
    {
        return static::available() ? ScriptPushStackBridge::mark() : 0;
    }

    /** @return list<string> */
    public static function since(int $mark): array
    {
        return static::available() ? ScriptPushStackBridge::since($mark) : [];
    }

    /** @param  list<string>  $scripts */
    public static function pushAll(array $scripts): void
    {
        foreach ($scripts as $js) {
            static::push((string) $js);
        }
    }
}
