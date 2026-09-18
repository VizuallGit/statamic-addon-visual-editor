<?php

namespace MarioHamann\StatamicVisualEditor\Tags\Resolve;

/**
 * The `placeholder` / `as` parameters of `{{ visual_edit }}`, parsed. Moved
 * verbatim out of Tags\VisualEdit in WP7b.
 */
final class Placeholders
{
    /**
     * @return array{text: string, as: string|null}
     */
    public static function parsePlaceholderSpec(mixed $spec): array
    {
        if ($spec === null || $spec === false || $spec === true) {
            return ['text' => '', 'as' => null];
        }

        $spec = trim((string) $spec);

        if ($spec === '') {
            return ['text' => '', 'as' => null];
        }

        if (preg_match('/^(h[1-6]|paragraph|p):(.+)$/is', $spec, $m)) {
            return [
                'as' => static::normalizeAs($m[1]),
                'text' => trim($m[2]),
            ];
        }

        if (preg_match('/^heading:([1-6]):(.+)$/is', $spec, $m)) {
            return [
                'as' => 'h'.$m[1],
                'text' => trim($m[2]),
            ];
        }

        return ['text' => $spec, 'as' => null];
    }

    public static function normalizeAs(mixed $as): ?string
    {
        if (! is_string($as)) {
            return null;
        }

        $as = strtolower(trim($as));

        if ($as === '' ) {
            return null;
        }

        if (in_array($as, ['p', 'paragraph'], true)) {
            return 'paragraph';
        }

        if (preg_match('/^h[1-6]$/', $as)) {
            return $as;
        }

        if (preg_match('/^heading:?([1-6])?$/', $as, $m)) {
            return 'h'.($m[1] ?: '2');
        }

        return null;
    }
}
