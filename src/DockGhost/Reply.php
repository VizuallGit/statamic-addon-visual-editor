<?php

namespace MarioHamann\StatamicVisualEditor\DockGhost;

/**
 * The model's answer, made into text that can go in at the caret as it is.
 *
 * Asked for the insertion only, a small model still now and then wraps it in
 * a code fence, starts by repeating what was typed, or ends with the `}}` or
 * `>` that already stands after the caret. Each of those is taken off here,
 * so a Tab never writes a tag twice.
 */
final class Reply
{
    /** Grey text is a line or a few; anything longer is cut there. */
    public const MAX_LINES = 8;

    /** A repeat of the typed text counts from this many visible characters on. */
    public const MIN_REPEAT = 3;

    public static function clean(string $text, string $before = '', string $after = ''): string
    {
        $text = str_replace("\r\n", "\n", $text);
        $text = static::unfence($text);
        $text = static::withoutRepeat($text, $before);
        $text = static::withoutTail($text, $after);

        $lines = explode("\n", $text);

        if (count($lines) > static::MAX_LINES) {
            $text = implode("\n", array_slice($lines, 0, static::MAX_LINES));
        }

        $text = rtrim($text);

        return trim($text) === '' ? '' : $text;
    }

    /**
     * The token counts, under the names the measuring command prints.
     *
     * @return array<string, int>
     */
    public static function usage(array $usage): array
    {
        return [
            'input' => (int) ($usage['input_tokens'] ?? 0),
            'output' => (int) ($usage['output_tokens'] ?? 0),
            'cache_read' => (int) ($usage['cache_read_input_tokens'] ?? 0),
            'cache_write' => (int) ($usage['cache_creation_input_tokens'] ?? 0),
        ];
    }

    /** A whole answer in one fence: the inside. */
    protected static function unfence(string $text): string
    {
        if (preg_match('/\A\s*```[\w-]*\n(.*?)\n?```\s*\z/s', $text, $match)) {
            return $match[1];
        }

        return $text;
    }

    /**
     * The answer starts with the end of what was typed (`{{ visual_` answered
     * with `{{ visual_edit … }}`): the overlap off.
     */
    protected static function withoutRepeat(string $text, string $before): string
    {
        $max = min(strlen($text), strlen($before), 200);

        for ($length = $max; $length > 0; $length--) {
            $piece = substr($text, 0, $length);

            if (strlen(trim($piece)) < static::MIN_REPEAT) {
                break;
            }

            if (str_ends_with($before, $piece)) {
                return substr($text, $length);
            }
        }

        return $text;
    }

    /**
     * The answer ends with what already follows the caret on that line (` }}`,
     * `">`): the overlap off. Only the caret's own line counts, so a line of
     * markup that merely looks like the next one is kept.
     */
    protected static function withoutTail(string $text, string $after): string
    {
        $line = strstr($after, "\n", true);
        $line = $line === false ? $after : $line;
        $max = min(strlen($text), strlen($line));

        for ($length = $max; $length > 0; $length--) {
            if (str_ends_with($text, substr($line, 0, $length))) {
                return substr($text, 0, -$length);
            }
        }

        return $text;
    }
}
