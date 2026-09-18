<?php

namespace MarioHamann\StatamicVisualEditor\AiCopy;

/**
 * The suggestions out of a reply that should be JSON and might not be.
 * Moved verbatim out of AiCopy in WP7d.
 */
final class Reply
{
    /**
     * The suggestions out of a reply that should be JSON and might not be.
     *
     * Three readings, narrowing: the whole reply as JSON, the first array in it,
     * and failing both, a numbered or blank-line-separated list. The last one is
     * there because a model that ignores the format still wrote usable copy, and
     * throwing it away would show the user an error over a formatting slip.
     *
     * @return list<string>
     */
    public static function parse(string $reply, int $count): array
    {
        $reply = trim($reply);

        if ($reply === '') {
            return [];
        }

        foreach (static::candidates($reply) as $candidate) {
            $rows = json_decode($candidate, true);

            if (is_array($rows) && $rows !== []) {
                $out = static::strings($rows);

                if ($out !== []) {
                    return array_slice($out, 0, $count);
                }
            }
        }

        return array_slice(static::fromList($reply), 0, $count);
    }

    /**
     * @return list<string>
     */
    protected static function candidates(string $reply): array
    {
        $out = [$reply];

        // ```json … ``` — asked not to, does it anyway often enough to handle.
        if (preg_match('/```[A-Za-z0-9_-]*\s*\n([\s\S]*?)```/', $reply, $m)) {
            $out[] = trim($m[1]);
        }

        $start = strpos($reply, '[');
        $end = strrpos($reply, ']');

        if ($start !== false && $end !== false && $end > $start) {
            $out[] = substr($reply, $start, $end - $start + 1);
        }

        return $out;
    }

    /**
     * @param  array<mixed>  $rows
     * @return list<string>
     */
    protected static function strings(array $rows): array
    {
        $out = [];

        foreach ($rows as $row) {
            // A model that wraps each suggestion in an object: {"text": "…"}.
            if (is_array($row)) {
                $row = $row['text'] ?? $row['suggestion'] ?? $row['heading'] ?? null;
            }

            if (! is_string($row)) {
                continue;
            }

            $text = static::tidy($row);

            if ($text !== '' && ! in_array($text, $out, true)) {
                $out[] = $text;
            }
        }

        return $out;
    }

    /**
     * A numbered or blank-line-separated list, when JSON never arrived.
     *
     * @return list<string>
     */
    protected static function fromList(string $reply): array
    {
        $numbered = preg_split('/^\s*(?:\d+[.)]|[-*•])\s+/m', $reply) ?: [];
        $rows = count($numbered) > 1 ? $numbered : (preg_split('/\n{2,}/', $reply) ?: []);
        $out = [];

        foreach ($rows as $row) {
            $text = static::tidy($row);

            // A leading sentence like "Here are five suggestions:" is not one.
            if ($text === '' || str_ends_with($text, ':') || in_array($text, $out, true)) {
                continue;
            }

            $out[] = $text;
        }

        return $out;
    }

    /**
     * One suggestion, as it should go into the field.
     *
     * Quotation marks around the whole thing are the model quoting itself, not
     * copy — a heading that arrives as "Hypnose i Holstebro" must not be written
     * into the page with the quotes still on.
     */
    protected static function tidy(string $text): string
    {
        $text = trim(str_replace(["\r\n", "\r"], "\n", $text));
        $text = preg_replace('/\n{3,}/', "\n\n", $text) ?? $text;
        $text = trim($text);

        foreach ([['"', '"'], ['“', '”'], ['«', '»'], ["'", "'"]] as [$open, $close]) {
            if ($text !== '' && str_starts_with($text, $open) && str_ends_with($text, $close) && mb_strlen($text) > 1) {
                $inner = mb_substr($text, mb_strlen($open), -mb_strlen($close));

                // Only when the quotes wrap everything — copy may legitimately
                // quote someone in the middle.
                if (! str_contains($inner, $open) && ! str_contains($inner, $close)) {
                    $text = trim($inner);
                }
            }
        }

        return Prompt::clip($text, 8000);
    }
}
