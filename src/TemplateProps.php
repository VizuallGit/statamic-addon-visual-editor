<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\TemplateProps\Compiler;
use MarioHamann\StatamicVisualEditor\TemplateProps\Options;
use MarioHamann\StatamicVisualEditor\TemplateProps\Parser;

/**
 * Bindings declared in a section template: `:handle ?? default`.
 *
 * The template is the source. The sidebar fields are generated from it.
 * Compile turns the author syntax into Antlers Statamic can render.
 *
 * This class is the entry point other code calls; the work lives in
 * `TemplateProps\Parser`, `TemplateProps\Compiler` and `TemplateProps\Options`.
 * Split in WP7d, code moved verbatim.
 */
class TemplateProps
{
    public const KIND_COLLECTION = Parser::KIND_COLLECTION;
    public const KIND_TEXT = Parser::KIND_TEXT;
    public const KIND_ASSETS = Parser::KIND_ASSETS;
    public const TEXT_KINDS = Options::TEXT_KINDS;
    public const ASSET_KINDS = Options::ASSET_KINDS;
    public const MEDIA_ATTRIBUTES = Parser::MEDIA_ATTRIBUTES;

    /**
     * @see Parser::parse()
     */
    public static function parse(string $antlers): array
    {
        return Parser::parse($antlers);
    }

    /**
     * Statamic's Antlers preparser can pass null (empty field, settings save).
     *
     * @see Compiler::compile()
     */
    public static function compile(?string $antlers): string
    {
        return Compiler::compile($antlers);
    }

    /**
     * One sidebar field for every `:name ?? …` in this section type's template.
     * The name is the author's — `headline_field` is as valid as `text_field`.
     *
     * @see Options::bundleField()
     */
    public static function bundleField(string $sectionType): array
    {
        return Options::bundleField($sectionType);
    }

    /**
     * @see Options::payloadForType()
     */
    public static function payloadForType(string $type): array
    {
        return Options::payloadForType($type);
    }

    /**
     * @see Options::fieldDefinition()
     */
    public static function fieldDefinition(array $prop, ?string $collectionField): array
    {
        return Options::fieldDefinition($prop, $collectionField);
    }
}
