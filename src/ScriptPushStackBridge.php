<?php

namespace MarioHamann\StatamicVisualEditor;

use Vizuall\StylePush\Tags\ScriptPush;

/**
 * Same `$stack` / `$seen` as `{{ script_push }}`. Loaded only when that class
 * exists — go through {@see ScriptPushStack}, which checks first.
 */
class ScriptPushStackBridge extends ScriptPush
{
    public static function push(string $js): void
    {
        $hash = md5($js);

        if (! in_array($hash, static::$seen, true)) {
            static::$seen[] = $hash;
            static::$stack[] = $js;
        }
    }

    /** How many entries the stack has right now — the mark to measure from. */
    public static function mark(): int
    {
        return count(static::$stack);
    }

    /** @return list<string> what was pushed since the mark */
    public static function since(int $mark): array
    {
        return array_slice(static::$stack, $mark);
    }

    public static function reset(): void
    {
        static::$stack = [];
        static::$seen = [];
    }
}
