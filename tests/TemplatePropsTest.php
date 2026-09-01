<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\TemplateProps;
use Statamic\Facades\Antlers;

class TemplatePropsTest extends TestCase
{
    public function test_parse_reads_collection_and_text_bindings(): void
    {
        $props = TemplateProps::parse(<<<'ANTLERS'
<section>
  {{ collection from=":collection_field ?? services" }}
    <li>{{ :text_field ?? title }}</li>
    <li>{{ :phone ?? phone }}</li>
  {{ /collection }}
</section>
ANTLERS);

        $this->assertSame([
            ['handle' => 'collection_field', 'fallback' => 'services', 'kind' => TemplateProps::KIND_COLLECTION, 'label' => null],
            ['handle' => 'text_field', 'fallback' => 'title', 'kind' => TemplateProps::KIND_TEXT, 'label' => null],
            ['handle' => 'phone', 'fallback' => 'phone', 'kind' => TemplateProps::KIND_TEXT, 'label' => null],
        ], $props);
    }

    public function test_parse_ignores_antlers_comments(): void
    {
        $props = TemplateProps::parse('{{# {{ :hidden ?? title }} #}}<p>{{ :text_field ?? title }}</p>');

        $this->assertSame([
            ['handle' => 'text_field', 'fallback' => 'title', 'kind' => TemplateProps::KIND_TEXT, 'label' => null],
        ], $props);
    }

    public function test_parse_reads_compiled_syntax(): void
    {
        $props = TemplateProps::parse('{{ collection from="{collection_field ?? \'cases\'}" }}{{ sve_prop :handle="name_field" fallback="name" }}{{ /collection }}');

        $this->assertSame([
            ['handle' => 'collection_field', 'fallback' => 'cases', 'kind' => TemplateProps::KIND_COLLECTION, 'label' => null],
            ['handle' => 'name_field', 'fallback' => 'name', 'kind' => TemplateProps::KIND_TEXT, 'label' => null],
        ], $props);
    }

    public function test_parse_reads_image_binding_as_assets(): void
    {
        $props = TemplateProps::parse('<img src=":image_field ?? image">');

        $this->assertSame([
            ['handle' => 'image_field', 'fallback' => 'image', 'kind' => TemplateProps::KIND_ASSETS, 'label' => null],
        ], $props);
    }

    public function test_parse_reads_image_component_binding(): void
    {
        $source = '{{ partial:components/image :imagePath=":midi ?? image" }}';

        $this->assertSame([
            ['handle' => 'midi', 'fallback' => 'image', 'kind' => TemplateProps::KIND_ASSETS, 'label' => null],
        ], TemplateProps::parse($source));

        $compiled = TemplateProps::compile($source);

        $this->assertSame(
            '{{ partial:components/image :imagePath="{sve_prop:field prop=\'midi\' fallback=\'image\'}" }}',
            $compiled
        );
        $this->assertSame($compiled, TemplateProps::compile($compiled));
        $this->assertSame(
            ['handle' => 'midi', 'fallback' => 'image', 'kind' => TemplateProps::KIND_ASSETS, 'label' => null],
            TemplateProps::parse($compiled)[0]
        );
    }

    public function test_parse_reads_picture_component_binding(): void
    {
        $this->assertSame(
            [['handle' => 'hero_image', 'fallback' => 'media', 'kind' => TemplateProps::KIND_ASSETS, 'label' => null]],
            TemplateProps::parse('{{ partial:components/picture :imagePath=":hero_image ?? media" }}')
        );
    }

    public function test_compiled_image_attribute_resolves_mapped_asset(): void
    {
        $compiled = TemplateProps::compile('<img src=":image_field ?? image">');

        $this->assertSame(
            '<img src="{{ sve_prop prop=\'image_field\' fallback=\'image\' }}">',
            $compiled
        );

        $this->assertSame(
            '<img src="FROM_MIDI">',
            trim((string) Antlers::parse($compiled, [
                'sve_props' => ['image_field' => 'midi'],
                'midi' => 'FROM_MIDI',
                'image' => 'FROM_IMAGE',
            ], trusted: true))
        );

        $this->assertSame(
            '<img src="FROM_IMAGE">',
            trim((string) Antlers::parse($compiled, [
                'image' => 'FROM_IMAGE',
            ], trusted: true))
        );
    }

    public function test_colon_image_path_resolves_to_the_field_handle(): void
    {
        $compiled = TemplateProps::compile('{{ partial:components/image :imagePath=":image ?? image" }}');

        $this->assertSame(
            '{{ partial:components/image :imagePath="{sve_prop:field prop=\'image\' fallback=\'image\'}" }}',
            $compiled
        );
        $this->assertSame($compiled, TemplateProps::compile($compiled));

        $this->assertSame(
            'midi',
            trim((string) Antlers::parse('{{ sve_prop:field prop="image" fallback="image" }}', [
                'sve_props' => ['image' => 'midi'],
            ], trusted: true))
        );

        $this->assertSame(
            'image',
            trim((string) Antlers::parse('{{ sve_prop:field prop="image" fallback="image" }}', [], trusted: true))
        );
    }

    public function test_compile_rewrites_author_syntax(): void
    {
        $source = '{{ collection from=":collection_field ?? services" }}<li>{{ :text_field ?? title }}</li>{{ /collection }}';

        $this->assertSame(
            '{{ collection from="{collection_field ?? \'services\'}" }}<li>{{ sve_prop prop="text_field" fallback="title" }}</li>{{ /collection }}',
            TemplateProps::compile($source)
        );
    }

    public function test_compile_is_idempotent_and_leaves_comments(): void
    {
        $source = "{{# sve-unlocked #}}\n{{ :text_field ?? title }}";
        $once = TemplateProps::compile($source);

        $this->assertSame($once, TemplateProps::compile($once));
        $this->assertStringContainsString('{{# sve-unlocked #}}', $once);
    }

    public function test_compiled_text_binding_renders_the_mapped_field(): void
    {
        $compiled = TemplateProps::compile('{{ :text_field ?? title }}');

        $this->assertSame(
            'Hello',
            trim((string) Antlers::parse($compiled, [
                'text_field' => 'title',
                'title' => 'Hello',
                'teaser' => 'Nope',
            ], trusted: true))
        );

        $this->assertSame(
            'Teaser',
            trim((string) Antlers::parse($compiled, [
                'text_field' => 'teaser',
                'title' => 'Hello',
                'teaser' => 'Teaser',
            ], trusted: true))
        );
    }

    public function test_quoted_fallback_is_a_label_and_empty_text(): void
    {
        $source = "<p>{{ :teaser_field ?? 'Teaser tekst' }}</p>";

        $this->assertSame([
            ['handle' => 'teaser_field', 'fallback' => 'teaser', 'kind' => TemplateProps::KIND_TEXT, 'label' => 'Teaser tekst'],
        ], TemplateProps::parse($source));

        $compiled = TemplateProps::compile($source);

        $this->assertSame(
            '<p>{{ sve_prop prop="teaser_field" fallback="teaser" empty="Teaser tekst" }}</p>',
            $compiled
        );
        $this->assertSame($compiled, TemplateProps::compile($compiled));

        $this->assertSame(
            'Teaser tekst',
            trim(strip_tags((string) Antlers::parse($compiled, [], trusted: true)))
        );

        $this->assertSame(
            'The teaser',
            trim(strip_tags((string) Antlers::parse($compiled, [
                'teaser_field' => 'teaser',
                'teaser' => 'The teaser',
            ], trusted: true)))
        );
    }

    public function test_any_prop_name_works_the_same(): void
    {
        $source = '{{ :headline_field ?? title }}';

        $this->assertSame([
            ['handle' => 'headline_field', 'fallback' => 'title', 'kind' => TemplateProps::KIND_TEXT, 'label' => null],
        ], TemplateProps::parse($source));

        $this->assertSame(
            'Hello',
            trim((string) Antlers::parse(TemplateProps::compile($source), [
                'sve_props' => ['headline_field' => 'title'],
                'title' => 'Hello',
            ], trusted: true))
        );
    }

    public function test_compiled_binding_uses_fallback_when_empty(): void
    {
        $compiled = TemplateProps::compile('{{ :text_field ?? title }}');

        $this->assertSame(
            'Hello',
            trim((string) Antlers::parse($compiled, [
                'title' => 'Hello',
            ], trusted: true))
        );
    }

    public function test_compile_accepts_null_from_antlers_preparse(): void
    {
        $this->assertSame('', TemplateProps::compile(null));
    }
}
