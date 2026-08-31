<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * Temporary kill switch for work from Sunday 30 Aug 2026.
 *
 * Flip ENABLED to false to turn that work off. Do not delete the Sunday files.
 *
 * Unit tests still run the Sunday code so the tests stay valid.
 * The site / Live Preview follows ENABLED.
 */
class SundayAug30
{
    public const ENABLED = true;

    public static function enabled(): bool
    {
        if (function_exists('app') && app()->runningUnitTests()) {
            return true;
        }

        return self::ENABLED;
    }
}
