<?php

namespace MarioHamann\StatamicVisualEditor\AiChat;

/**
 * What the user said, as the agent may see it: the last twenty turns,
 * user and assistant only, clipped, ending with the user.
 * Moved verbatim out of AiChat in WP7d.
 */
final class Conversation
{
    /**
     * @param  list<mixed>  $messages
     * @return list<array{role: string, content: string}>
     */
    public static function sanitize(array $messages): array
    {
        $out = [];

        foreach (array_slice($messages, -20) as $row) {
            if (! is_array($row)) {
                continue;
            }

            $role = $row['role'] ?? '';
            $content = $row['content'] ?? '';

            if (! in_array($role, ['user', 'assistant'], true) || ! is_string($content) || trim($content) === '') {
                continue;
            }

            $out[] = [
                'role' => $role,
                'content' => static::clip($content, 20000),
            ];
        }

        abort_unless($out !== [] && $out[array_key_last($out)]['role'] === 'user', 422);

        return $out;
    }

    public static function clip(string $text, int $max = 60000): string
    {
        if (strlen($text) <= $max) {
            return $text;
        }

        return substr($text, 0, $max)."\n…";
    }
}
