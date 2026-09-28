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
        $collection->shouldReceive('entryBlueprints')->andReturn(collect([$blueprint]));

        // A second collection with a page builder of its own: a Replicator in
        // the blueprint itself, marked as the page's sections.
        $lawyer = Blueprint::make('lawyer')->setContents([
            'tabs' => ['main' => ['sections' => [['fields' => [[
                'handle' => 'lawyer_info',
                'field' => [
                    'type' => 'replicator',
                    'sve_sections' => true,
                    'sets' => ['cv' => ['sets' => [
                        'cv/education' => ['display' => 'Uddannelse', 'icon' => 'lucide:graduation-cap', 'fields' => []],
                    ]]],
                ],
            ]]]]]],
        ]);
        $lawyers = Mockery::mock(CollectionModel::class);
        $lawyers->shouldReceive('entryBlueprints')->andReturn(collect([$lawyer]));

        Collection::shouldReceive('findByHandle')->with('pages')->andReturn($collection);
        Collection::shouldReceive('all')->andReturn(collect([$collection, $lawyers]));

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

    public function test_a_page_builder_of_another_collection_names_its_own_sets(): void
    {
        $sets = SetMeta::map();

        $this->assertSame('Uddannelse', $sets['cv/education']['display']);
        $this->assertSame('lucide:graduation-cap', $sets['cv/education']['icon']);
        // The pages' own sets are still there.
        $this->assertSame('Hero style 2', $sets['hero/style_2']['display']);
    }

    public function test_a_resolvable_svg_icon_wins_over_an_earlier_bare_name(): void
    {
        $method = new \ReflectionMethod(SetMeta::class, 'preferIcon');
        $method->setAccessible(true);

        $this->assertSame(
            '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
            $method->invoke(null, 'text', '<svg xmlns="http://www.w3.org/2000/svg"></svg>')
        );
        $this->assertSame('text', $method->invoke(null, 'text', null));
        $this->assertSame(
            '<svg></svg>',
            $method->invoke(null, '<svg></svg>', 'text')
        );
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
