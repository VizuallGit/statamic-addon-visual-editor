<?php

namespace MarioHamann\StatamicVisualEditor\TemplateProps;

use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\SectionTemplate;
use MarioHamann\StatamicVisualEditor\Stores;
use Statamic\Facades\Collection;
use Statamic\Fields\Field;

/**
 * The sidebar fields generated from the bindings, and the collections and
 * fields an editor can point them at.
 * Moved verbatim out of TemplateProps in WP7d.
 */
final class Options
{
    public const TEXT_KINDS = ['text', 'textarea', 'bard'];

    public const ASSET_KINDS = ['assets'];

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
        $bindings = $path ? Parser::parse((string) file_get_contents($path)) : [];

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
        if ($prop['kind'] === Parser::KIND_COLLECTION) {
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

        $kinds = $prop['kind'] === Parser::KIND_ASSETS ? self::ASSET_KINDS : self::TEXT_KINDS;
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
}
