<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Fieldtypes;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use MarioHamann\StatamicVisualEditor\Fieldtypes\IconButtonGroupFieldtype;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Fields\Field;

class IconButtonGroupFieldtypeTest extends TestCase
{
    public function test_statamic_icon_is_passed_through_without_html(): void
    {
        Http::fake();

        $options = $this->preloadOptions([
            ['key' => 'left', 'label' => 'Left', 'icon' => 'align-left'],
        ]);

        $this->assertSame('left', $options[0]['value']);
        $this->assertSame('align-left', $options[0]['icon']);
        $this->assertNull($options[0]['icon_html']);
        Http::assertNothingSent();
    }

    public function test_iconify_name_becomes_button_html(): void
    {
        Cache::flush();

        Http::fake([
            'api.iconify.design/solar.json*' => Http::response([
                'prefix' => 'solar',
                'width' => 24,
                'height' => 24,
                'icons' => [
                    'flip-vertical-bold' => [
                        'body' => '<path d="M1 1"/>',
                    ],
                ],
            ], 200),
        ]);

        $options = $this->preloadOptions([
            [
                'key' => 'v',
                'label' => 'Vertical',
                'iconify' => 'solar:flip-vertical-bold',
            ],
        ]);

        $this->assertSame('solar:flip-vertical-bold', $options[0]['icon']);
        $this->assertStringContainsString('<path d="M1 1"/>', $options[0]['icon_html']);
    }

    public function test_iconify_name_in_icon_field_is_still_iconify(): void
    {
        Cache::flush();

        Http::fake([
            'api.iconify.design/lucide.json*' => Http::response([
                'prefix' => 'lucide',
                'width' => 24,
                'height' => 24,
                'icons' => [
                    'panel-left' => [
                        'body' => '<path d="M2 2"/>',
                    ],
                ],
            ], 200),
        ]);

        $options = $this->preloadOptions([
            ['key' => 'left', 'label' => 'Left', 'icon' => 'lucide:panel-left'],
        ]);

        $this->assertSame('lucide:panel-left', $options[0]['icon']);
        $this->assertStringContainsString('<path d="M2 2"/>', $options[0]['icon_html']);
    }

    public function test_stored_svg_body_becomes_html_without_http(): void
    {
        Http::fake();

        $options = $this->preloadOptions([
            [
                'key' => 'left',
                'iconify' => [
                    'name' => 'mdi:dock-left',
                    'body' => '<path d="M1 1"/>',
                    'attributes' => ['viewBox' => '0 0 24 24'],
                ],
            ],
        ]);

        $this->assertSame('mdi:dock-left', $options[0]['icon']);
        $this->assertStringContainsString('<path d="M1 1"/>', $options[0]['icon_html']);
        Http::assertNothingSent();
    }

    public function test_config_labels_default_to_english(): void
    {
        app()->setLocale('en');

        $fieldtype = new IconButtonGroupFieldtype;
        $method = new \ReflectionMethod($fieldtype, 'configFieldItems');
        $items = $method->invoke($fieldtype);

        $this->assertSame('Options', $items[0]['display']);
        $this->assertSame('Key', $items[0]['fields']['options']['fields'][0]['field']['display']);
        $this->assertSame('Icon', $items[0]['fields']['options']['fields'][1]['field']['display']);
        $this->assertSame('Add option', $items[0]['fields']['options']['add_row']);
        $this->assertSame('Default value', $items[1]['fields']['default']['display']);
    }

    public function test_pre_process_config_flattens_iconify_to_a_name(): void
    {
        $fieldtype = new IconButtonGroupFieldtype;
        $out = $fieldtype->preProcessConfig([
            'options' => [
                ['key' => 'left', 'iconify' => ['name' => 'mdi:dock-left']],
                ['key' => 'top', 'icon' => 'lucide:panel-top'],
            ],
        ]);

        $this->assertSame('mdi:dock-left', $out['options'][0]['iconify']);
        $this->assertSame('lucide:panel-top', $out['options'][1]['iconify']);
    }

    /**
     * @param  array<int, array<string, mixed>>  $options
     * @return array<int, array{value: string, label: ?string, icon: ?string, icon_html: ?string}>
     */
    private function preloadOptions(array $options): array
    {
        $fieldtype = new IconButtonGroupFieldtype;
        $fieldtype->setField(new Field('icon_position', [
            'type' => 'icon_button_group',
            'options' => $options,
        ]));

        return $fieldtype->preload()['options'];
    }
}
