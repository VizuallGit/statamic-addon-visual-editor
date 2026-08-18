<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * Operating rules for the Live Preview AI. The site can replace the shipped
 * list by putting a file at resources/visual-editor/ai-rules.md.
 */
class AiRules
{
    public static function defaultPath(): string
    {
        return dirname(__DIR__).'/resources/ai-rules.md';
    }

    public static function path(): string
    {
        $configured = trim((string) config('statamic-visual-editor.ai.rules', ''));

        if ($configured !== '' && is_file($configured)) {
            return $configured;
        }

        $site = resource_path('visual-editor/ai-rules.md');

        if (is_file($site)) {
            return $site;
        }

        return static::defaultPath();
    }

    public static function text(): string
    {
        $path = static::path();

        if (! is_file($path)) {
            return '';
        }

        return trim((string) file_get_contents($path));
    }
}
