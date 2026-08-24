<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use MarioHamann\StatamicVisualEditor\IconifyDefault;

class IconifyDefaultTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
    }

    public function test_svg_data_is_null_for_a_non_name(): void
    {
        $this->assertNull(IconifyDefault::svgData('not an icon'));
        $this->assertFalse(IconifyDefault::isName('not an icon'));
    }

    public function test_svg_data_fetches_body_and_viewbox(): void
    {
        Http::fake([
            'api.iconify.design/simple-line-icons.json*' => Http::response([
                'prefix' => 'simple-line-icons',
                'width' => 1024,
                'height' => 1024,
                'icons' => [
                    'check' => [
                        'body' => '<path d="M1 1"/>',
                    ],
                ],
            ], 200),
        ]);

        $data = IconifyDefault::svgData('simple-line-icons:check');

        $this->assertSame('simple-line-icons:check', $data['name']);
        $this->assertSame('<path d="M1 1"/>', $data['body']);
        $this->assertSame('0 0 1024 1024', $data['attributes']['viewBox']);
        $this->assertSame('1em', $data['attributes']['width']);
    }

    public function test_render_turns_a_name_into_svg(): void
    {
        Http::fake([
            'api.iconify.design/simple-line-icons.json*' => Http::response([
                'icons' => [
                    'check' => [
                        'body' => '<path d="M1 1"/>',
                        'width' => 24,
                        'height' => 24,
                    ],
                ],
            ], 200),
        ]);

        $out = IconifyDefault::render('simple-line-icons:check', function (array $icon) {
            return 'SVG:'.$icon['body'];
        });

        $this->assertSame('SVG:<path d="M1 1"/>', $out);
    }

    public function test_render_keeps_stored_svg_data(): void
    {
        Http::fake();

        $stored = [
            'name' => 'mdi:home',
            'body' => '<path d="home"/>',
            'attributes' => ['viewBox' => '0 0 24 24'],
        ];

        $out = IconifyDefault::render($stored, fn (array $icon) => $icon['body']);

        $this->assertSame('<path d="home"/>', $out);
        Http::assertNothingSent();
    }

    public function test_render_returns_null_when_empty(): void
    {
        $this->assertNull(IconifyDefault::render(null, fn () => 'nope'));
        $this->assertNull(IconifyDefault::render('', fn () => 'nope'));
    }

    public function test_render_uses_explicit_fallback_when_empty(): void
    {
        Http::fake([
            'api.iconify.design/simple-line-icons.json*' => Http::response([
                'icons' => [
                    'check' => [
                        'body' => '<path d="M1 1"/>',
                        'width' => 24,
                        'height' => 24,
                    ],
                ],
            ], 200),
        ]);

        $out = IconifyDefault::render(null, function (array $icon) {
            return 'SVG:'.$icon['body'];
        }, 'simple-line-icons:check');

        $this->assertSame('SVG:<path d="M1 1"/>', $out);
    }

    public function test_fallback_name_prefers_the_current_set(): void
    {
        $blueprint = \Statamic\Facades\Blueprint::make()->setContents([
            'tabs' => [
                'main' => [
                    'sections' => [
                        [
                            'fields' => [
                                [
                                    'handle' => 'blocks',
                                    'field' => [
                                        'type' => 'replicator',
                                        'sets' => [
                                            'icon' => [
                                                'fields' => [
                                                    [
                                                        'handle' => 'icon',
                                                        'field' => [
                                                            'type' => 'iconify',
                                                            'default' => 'simple-line-icons:check',
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        $page = new class($blueprint)
        {
            public function __construct(private mixed $blueprint) {}

            public function blueprint(): mixed
            {
                return $this->blueprint;
            }
        };

        $name = IconifyDefault::fallbackName(['page' => $page, 'type' => 'icon'], 'icon');

        $this->assertSame('simple-line-icons:check', $name);
    }
}
