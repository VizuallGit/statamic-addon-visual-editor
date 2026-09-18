<?php

namespace MarioHamann\StatamicVisualEditor\TemplateProps;

/**
 * Reads the bindings (`:handle ?? default`) out of a section template —
 * collection, media and text, in author syntax and in compiled form.
 * Moved verbatim out of TemplateProps in WP7d.
 */
final class Parser
{
    public const KIND_COLLECTION = 'collection';

    public const KIND_TEXT = 'text';

    public const KIND_ASSETS = 'assets';

    /** Attribute names that pass an asset into a partial or tag (image/picture/video). */
    public const MEDIA_ATTRIBUTES = [
        'imagePath',
        'image',
        'src',
        'poster',
        'media',
        'video',
        'featured_media',
        'background_image',
        'profile_image',
    ];

    /**
     * @return list<array{handle: string, fallback: string, kind: string, label: ?string}>
     */
    public static function parse(string $antlers): array
    {
        $text = static::stripComments($antlers);
        $found = [];

        foreach (static::matches(
            $text,
            '/\bfrom\s*=\s*(["\'])\:([a-zA-Z_][a-zA-Z0-9_]*)\s*\?\?\s*([a-zA-Z0-9_-]+)\1/'
        ) as $row) {
            $found[$row[2]] = static::binding($row[2], $row[3], self::KIND_COLLECTION);
        }

        foreach (static::matches(
            $text,
            '/\bfrom\s*=\s*(["\'])\{([a-zA-Z_][a-zA-Z0-9_]*)\s*\?\?\s*[\'"]([a-zA-Z0-9_-]+)[\'"]\}\1/'
        ) as $row) {
            $found[$row[2]] ??= static::binding($row[2], $row[3], self::KIND_COLLECTION);
        }

        $mediaAttr = static::mediaAttributePattern();

        foreach (static::matches(
            $text,
            '/:?('.$mediaAttr.')\s*=\s*(["\'])\:([a-zA-Z_][a-zA-Z0-9_]*)\s*\?\?\s*([a-zA-Z0-9_-]+)\2/'
        ) as $row) {
            $found[$row[3]] = static::binding($row[3], $row[4], self::KIND_ASSETS);
        }

        foreach (static::matches(
            $text,
            '/:?('.$mediaAttr.')\s*=\s*(["\'])\{sve_prop(?::field)? prop=([\'"])([a-zA-Z_][a-zA-Z0-9_]*)\3 fallback=\3([a-zA-Z0-9_-]+)\3\}\2/'
        ) as $row) {
            $found[$row[4]] ??= static::binding($row[4], $row[5], self::KIND_ASSETS);
        }

        foreach (static::matches(
            $text,
            '/:?('.$mediaAttr.')\s*=\s*(["\'])\{\{\s*sve_prop\s+prop=([\'"])([a-zA-Z_][a-zA-Z0-9_]*)\3\s+fallback=\3([a-zA-Z0-9_-]+)\3\s*\}\}\2/'
        ) as $row) {
            $found[$row[4]] ??= static::binding($row[4], $row[5], self::KIND_ASSETS);
        }

        foreach (static::matches(
            $text,
            '/\{\{\s*\:([a-zA-Z_][a-zA-Z0-9_]*)\s*\?\?\s*[\'"]([^\'"]*)[\'"]\s*\}\}/'
        ) as $row) {
            $found[$row[1]] ??= static::binding(
                $row[1],
                static::inferredFieldHandle($row[1]),
                self::KIND_TEXT,
                $row[2]
            );
        }

        foreach (static::matches(
            $text,
            '/\{\{\s*\:([a-zA-Z_][a-zA-Z0-9_]*)\s*\?\?\s*([a-zA-Z0-9_-]+)\s*\}\}/'
        ) as $row) {
            $found[$row[1]] ??= static::binding($row[1], $row[2], self::KIND_TEXT);
        }

        foreach (static::matches(
            $text,
            '/\{\{\s*sve_prop\s+(?:prop|:handle)="([a-zA-Z_][a-zA-Z0-9_]*)"\s+fallback="([a-zA-Z0-9_-]+)"(?:\s+empty="([^"]*)")?\s*\}\}/'
        ) as $row) {
            $found[$row[1]] ??= static::binding(
                $row[1],
                $row[2],
                self::KIND_TEXT,
                ($row[3] ?? '') !== '' ? $row[3] : null
            );
        }

        return array_values($found);
    }

    public static function mediaAttributePattern(): string
    {
        return implode('|', array_map(
            fn (string $name) => preg_quote($name, '/'),
            self::MEDIA_ATTRIBUTES
        ));
    }

    /**
     * `teaser_field` → `teaser` when the fallback is a quoted label, not a handle.
     */
    public static function inferredFieldHandle(string $handle): string
    {
        if (str_ends_with($handle, '_field') && strlen($handle) > 6) {
            return substr($handle, 0, -6);
        }

        return $handle;
    }

    /**
     * @return array{handle: string, fallback: string, kind: string, label: ?string}
     */
    protected static function binding(string $handle, string $fallback, string $kind, ?string $label = null): array
    {
        return [
            'handle' => $handle,
            'fallback' => $fallback,
            'kind' => $kind,
            'label' => $label,
        ];
    }

    /**
     * @return list<array<int, string>>
     */
    protected static function matches(string $text, string $pattern): array
    {
        if (! preg_match_all($pattern, $text, $m, PREG_SET_ORDER)) {
            return [];
        }

        return $m;
    }

    protected static function stripComments(string $antlers): string
    {
        return preg_replace('/\{\{#.*?#\}\}/s', '', $antlers) ?? $antlers;
    }
}
