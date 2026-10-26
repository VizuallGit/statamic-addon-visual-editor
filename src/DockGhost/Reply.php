<?php

namespace MarioHamann\StatamicVisualEditor\DockGhost;

/**
 * The model's answer, made into text that can go in as it is.
 *
 * Asked for the insertion only, a small model still now and then wraps it in
 * a code fence, starts by repeating what was typed or the indentation the
 * caret already stands at, or ends with the `}}` or `>` that already follows
 * the caret. Each of those is taken off here, so a Tab never writes a tag
 * twice.
 */
final class Reply
{
    /** Lines kept per way of asking: grey text is a line or a few; a described block may be long. */
    public const MAX_LINES = ['line' => 8, 'block' => 30, 'comment' => 80, 'insert' => 120, 'edit' => 400];

    /** A repeat of the typed text counts from this many visible characters on. */
    public const MIN_REPEAT = 3;

    public static function clean(string $text, string $before = '', string $after = '', string $mode = 'line'): string
    {
        $text = str_replace("\r\n", "\n", $text);
        $text = static::unfence($text);

        if (static::prose($text)) {
            return '';
        }

        $text = static::withoutRepeat($text, $before);
        $text = static::withinValue($text, Caret::of($before));
        $text = static::withoutIndent($text, $before);
        $text = static::underCaret($text, $before);
        $text = static::withoutTail($text, $after);

        $lines = explode("\n", $text);
        $max = static::MAX_LINES[$mode] ?? static::MAX_LINES['line'];

        if (count($lines) > $max) {
            $text = implode("\n", array_slice($lines, 0, $max));
        }

        $text = rtrim($text);

        return trim($text) === '' ? '' : $text;
    }

    /**
     * ⌘K on a selection: the replacement, whole. It ends the way the
     * selection ended — on a line break or not — so the line after it stays
     * where it was.
     */
    public static function edit(string $text, string $selection): string
    {
        $text = rtrim(static::unfence(str_replace("\r\n", "\n", $text)), " \t\n");

        if (trim($text) === '') {
            return '';
        }

        // A selection that starts at its first character, not at the line's
        // indentation: the replacement starts there too.
        if (! preg_match('/\A[ \t]/', $selection)) {
            $text = ltrim($text, " \t");
        }

        if (preg_match('/\n[ \t]*\z/', $selection, $tail)) {
            $text .= $tail[0];
        }

        return $text;
    }

    /**
     * The token counts, under the names the usage and the measuring command use.
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

    /**
     * The model talking about the task instead of doing it — "The `<after>`
     * text already contains …". A small model running without thinking now
     * and then writes its reasoning as the answer; none of it is code to take.
     */
    public static function prose(string $text): bool
    {
        return (bool) preg_match('/<\/?(before|after|selection)>|`(before|after)`|\bthe caret\b|\bthe author\'s\b/i', $text);
    }

    /**
     * A caret inside an attribute's value: the answer ends where the value
     * does, so no markup runs on into the attribute.
     *
     * @param  array{kind: string, quote?: string}  $caret
     */
    protected static function withinValue(string $text, array $caret): string
    {
        if ($caret['kind'] !== 'attribute') {
            return $text;
        }

        $end = strpos($text, $caret['quote']);

        return $end === false ? $text : substr($text, 0, $end);
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
     * The caret stands at a line's indentation and the answer brings its
     * own: the first line's is taken off, the rest keep theirs.
     */
    protected static function withoutIndent(string $text, string $before): string
    {
        if (preg_match('/(?:\A|\n)[ \t]*\z/', $before) && preg_match('/\A[ \t]+/', $text)) {
            return ltrim($text, " \t");
        }

        return $text;
    }

    /**
     * A block written at an indented empty line, its later lines indented as
     * if it stood at the margin: they are moved in under the caret.
     */
    protected static function underCaret(string $text, string $before): string
    {
        $lines = explode("\n", $text);

        if (count($lines) < 2 || ! preg_match('/(?:\A|\n)([ \t]*)\z/', $before, $caret) || $caret[1] === '') {
            return $text;
        }

        $rest = array_filter(array_slice($lines, 1), fn ($line) => trim($line) !== '');
        $least = $rest === [] ? 0 : min(array_map(fn ($line) => strlen($line) - strlen(ltrim($line, " \t")), $rest));
        $missing = strlen($caret[1]) - $least;

        if ($missing <= 0) {
            return $text;
        }

        $pad = str_repeat(' ', $missing);

        return $lines[0]."\n".implode("\n", array_map(fn ($line) => trim($line) === '' ? $line : $pad.$line, array_slice($lines, 1)));
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
