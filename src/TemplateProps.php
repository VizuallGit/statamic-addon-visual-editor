<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Str;
use Statamic\Facades\Collection;
use Statamic\Fields\Field;

/**
 * Bindings declared in a section template: `:handle ?? default`.
 *
 * The template is the source. The sidebar fields are generated from it.
 * Compile turns the author syntax into Antlers Statamic can render.
 */
class TemplateProps
{
    public const KIND_COLLECTION = 'collection';

    public const KIND_TEXT = 'text';

    public const KIND_ASSETS = 'assets';

    public const TEXT_KINDS = ['text', 'textarea', 'bard'];

    public const ASSET_KINDS = ['assets'];

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

    public static function compile(string $antlers): string
    {
        if (! SundayAug30::enabled()) {
            return $antlers;
        }

        $placeholders = [];
        $masked = preg_replace_callback('/\{\{#.*?#\}\}/s', function (array $m) use (&$placeholders) {
            $key = '___SVE_PROP_CMT_'.count($placeholders).'___';
            $placeholders[$key] = $m[0];

            return $key;
        }, $antlers) ?? $antlers;

        $masked = preg_replace_callback(
            '/\bfrom\s*=\s*(["\'])\:([a-zA-Z_][a-zA-Z0-9_]*)\s*\?\?\s*([a-zA-Z0-9_-]+)\1/',
            fn (array $m) => 'from='.$m[1].'{'.$m[2]." ?? '".$m[3].'\''.'}'.$m[1],
            $masked
        ) ?? $masked;

        $mediaAttr = static::mediaAttributePattern();

        $masked = preg_replace_callback(
            '/(:?)('.$mediaAttr.')\s*=\s*(["\'])\:([a-zA-Z_][a-zA-Z0-9_]*)\s*\?\?\s*([a-zA-Z0-9_-]+)\3/',
            function (array $m) {
                $colon = $m[1];
                $quote = $m[3];
                $inner = $quote === '"' ? "'" : '"';
                $call = 'sve_prop prop='.$inner.$m[4].$inner.' fallback='.$inner.$m[5].$inner;

                // Same as :imagePath="image": colon looks up a handle.
                // Not the Asset — Antlers would use it as an array key.
                if ($colon === ':') {
                    return ':'.$m[2].'='.$quote.'{sve_prop:field prop='.$inner.$m[4].$inner.' fallback='.$inner.$m[5].$inner.'}'.$quote;
                }

                return $m[2].'='.$quote.'{{ '.$call.' }}'.$quote;
            },
            $masked
        ) ?? $masked;

        $masked = preg_replace_callback(
            '/\{\{\s*\:([a-zA-Z_][a-zA-Z0-9_]*)\s*\?\?\s*[\'"]([^\'"]*)[\'"]\s*\}\}/',
            function (array $m) {
                $empty = htmlspecialchars($m[2], ENT_QUOTES, 'UTF-8');

                return '{{ sve_prop prop="'.$m[1].'" fallback="'.static::inferredFieldHandle($m[1]).'" empty="'.$empty.'" }}';
            },
            $masked
        ) ?? $masked;

        $masked = preg_replace_callback(
            '/\{\{\s*\:([a-zA-Z_][a-zA-Z0-9_]*)\s*\?\?\s*([a-zA-Z0-9_-]+)\s*\}\}/',
            fn (array $m) => '{{ sve_prop prop="'.$m[1].'" fallback="'.$m[2].'" }}',
            $masked
        ) ?? $masked;

        return strtr($masked, $placeholders);
    }

    /**
     * One sidebar field for every `:name ?? …` in this section type's template.
     * The name is the author's — `headline_field` is as valid as `text_field`.
     *
     * @return array{handle: string, field: array<string, mixed>}
     */
    public static function bundleField(string $sectionType): array
    {
        return [
            'handle' => 'sve_props',
            'field' => [
                'type' => 'sve_template_props',
                'display' => __('sve::messages.template_props'),
                'section_type' => $sectionType,
                'replicator_preview' => false,
            ],
        ];
    }

    /**
     * @return array{bindings: list<array{handle: string, fallback: string, kind: string, label: ?string}>, collections: array<string, string>, fields: array<string, list<array{handle: string, display: string, type: string}>>}
     */
    public static function payloadForType(string $type): array
    {
        $path = SectionTemplate::path($type);
        $bindings = $path ? static::parse((string) file_get_contents($path)) : [];

        return [
            'bindings' => $bindings,
            'collections' => static::collectionOptions(),
            'fields' => static::fieldOptions(self::TEXT_KINDS),
            'assetFields' => static::fieldOptions(self::ASSET_KINDS),
        ];
    }

    /**
     * @param  array{handle: string, fallback: string, kind: string, label?: ?string}  $prop
     * @return array{handle: string, field: array<string, mixed>}
     */
    public static function fieldDefinition(array $prop, ?string $collectionField): array
    {
        if ($prop['kind'] === self::KIND_COLLECTION) {
            return [
                'handle' => $prop['handle'],
                'field' => [
                    'type' => 'select',
                    'display' => __('sve::messages.template_prop_collection'),
                    'options' => static::collectionOptions(),
                    'default' => $prop['fallback'],
                    'replicator_preview' => false,
                ],
            ];
        }

        $kinds = $prop['kind'] === self::KIND_ASSETS ? self::ASSET_KINDS : self::TEXT_KINDS;
        $label = $prop['label'] ?? null;

        return [
            'handle' => $prop['handle'],
            'field' => [
                'type' => 'sve_field_prop',
                'display' => is_string($label) && $label !== '' ? $label : Str::headline($prop['handle']),
                'kinds' => $kinds,
                'collection_field' => $collectionField,
                'default' => $prop['fallback'],
                'replicator_preview' => false,
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function collectionOptions(): array
    {
        $stores = Stores::all();

        return Collection::all()
            ->reject(fn ($collection) => in_array($collection->handle(), $stores, true))
            ->sortBy(fn ($collection) => mb_strtolower((string) $collection->title()))
            ->mapWithKeys(fn ($collection) => [$collection->handle() => $collection->title()])
            ->all();
    }

    /**
     * Fields of the given kinds, keyed by collection handle.
     *
     * @param  list<string>  $kinds
     * @return array<string, list<array{handle: string, display: string, type: string}>>
     */
    public static function fieldOptions(array $kinds): array
    {
        $stores = Stores::all();
        $out = [];

        foreach (Collection::all() as $collection) {
            $handle = $collection->handle();

            if (in_array($handle, $stores, true)) {
                continue;
            }

            $out[$handle] = static::fieldsOf($collection, $kinds);
        }

        return $out;
    }

    /**
     * @param  list<string>  $kinds
     * @return list<array{handle: string, display: string, type: string}>
     */
    public static function fieldsOf($collection, array $kinds): array
    {
        $blueprint = $collection->entryBlueprint();

        if (! $blueprint) {
            return [];
        }

        $out = [];

        foreach ($blueprint->fields()->all() as $field) {
            if (! $field instanceof Field) {
                continue;
            }

            $type = $field->type();

            if ($kinds !== [] && ! in_array($type, $kinds, true)) {
                continue;
            }

            $out[] = [
                'handle' => $field->handle(),
                'display' => $field->display(),
                'type' => $type,
            ];
        }

        return $out;
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
