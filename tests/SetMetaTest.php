<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SetMeta;
use Mockery;
use Statamic\Entries\Collection as CollectionModel;
use Statamic\Facades\Collection;
use Statamic\Facades\Fieldset;
use Statamic\Fields\Blueprint;
use Statamic\Fields\Fieldset as FieldsetModel;

class SetMetaTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $blueprint = Blueprint::make()->setContents([
            'tabs' => [
                'main' => [
                    'sections' => [
                        [
                            'fields' => [
                                ['import' => 'page_sections'],
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        $collection = Mockery::mock(CollectionModel::class);
        $collection->shouldReceive('entryBlueprint')->andReturn($blueprint);

        Collection::shouldReceive('findByHandle')->with('pages')->andReturn($collection);

        $fieldsets = [
            'page_sections' => $this->pageSections(),
            'hero.style_2' => $this->heroStyle2(),
        ];

        Fieldset::shouldReceive('find')->andReturnUsing(
            fn ($handle) => $fieldsets[$handle] ?? null
        );
    }

    public function test_a_nested_replicator_set_uses_the_icon_from_edit_set(): void
    {
        $sets = SetMeta::map();

        $this->assertSame('lucide:circle-check', $sets['icon']['icon']);
        $this->assertSame('Icon', $sets['icon']['display']);
    }

    public function test_a_nested_set_without_an_icon_keeps_the_panel_default(): void
    {
        $sets = SetMeta::map();

        $this->assertSame('Content', $sets['content']['display']);
        $this->assertNull($sets['content']['icon']);
    }

    protected function pageSections(): FieldsetModel
    {
        return (new FieldsetModel)->setHandle('page_sections')->setContents([
            'fields' => [
                [
                    'handle' => 'page_sections',
                    'field' => [
                        'type' => 'replicator',
                        'sets' => [
                            'items' => [
                                'sets' => [
                                    'hero/style_2' => [
                                        'display' => 'Hero style 2',
                                        'fields' => [
                                            ['import' => 'hero.style_2'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }

    protected function heroStyle2(): FieldsetModel
    {
        return (new FieldsetModel)->setHandle('hero.style_2')->setContents([
            'fields' => [
                [
                    'handle' => 'blocks',
                    'field' => [
                        'type' => 'replicator',
                        'sets' => [
                            'block' => [
                                'sets' => [
                                    'content' => [
                                        'display' => 'Content',
                                        'fields' => [
                                            ['handle' => 'title', 'field' => ['type' => 'text']],
                                        ],
                                    ],
                                    'list' => [
                                        'display' => 'List',
                                        'fields' => [
                                            [
                                                'handle' => 'list',
                                                'field' => [
                                                    'type' => 'replicator',
                                                    'sets' => [
                                                        'item' => [
                                                            'sets' => [
                                                                'item' => [
                                                                    'display' => 'Item',
                                                                    'fields' => [
                                                                        [
                                                                            'handle' => 'blocks',
                                                                            'field' => [
                                                                                'type' => 'replicator',
                                                                                'sets' => [
                                                                                    'block' => [
                                                                                        'sets' => [
                                                                                            'icon' => [
                                                                                                'display' => 'Icon',
                                                                                                'icon' => 'lucide:circle-check',
                                                                                                'fields' => [
                                                                                                    ['handle' => 'icon', 'field' => ['type' => 'iconify']],
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
    }
}
