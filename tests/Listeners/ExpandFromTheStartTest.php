<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Listeners;

use MarioHamann\StatamicVisualEditor\FromTheStart;
use MarioHamann\StatamicVisualEditor\Listeners\ExpandFromTheStart;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Events\EntryBlueprintFound;
use Statamic\Facades\Blink;
use Statamic\Fields\Blueprint;

class ExpandFromTheStartTest extends TestCase
{
    public function test_it_expands_replicator_defaults_in_memory(): void
    {
        $blueprint = (new Blueprint)->setHandle('page')->setContents([
            'tabs' => [
                'main' => [
                    'sections' => [
                        [
                            'fields' => [
                                [
                                    'handle' => 'list',
                                    'field' => [
                                        'type' => 'replicator',
                                        'default' => [['type' => 'item']],
                                        FromTheStart::KEY => [['set' => 'item', 'count' => 3]],
                                    ],
                                ],
                                [
                                    'handle' => 'title',
                                    'field' => [
                                        'type' => 'text',
                                        'display' => 'Title',
                                        'placeholder' => 'Keep me',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        (new ExpandFromTheStart)->handle(new EntryBlueprintFound($blueprint));

        $fields = $blueprint->contents()['tabs']['main']['sections'][0]['fields'];

        $this->assertCount(3, $fields[0]['field']['default']);
        $this->assertSame('item', $fields[0]['field']['default'][2]['type']);
        $this->assertSame('Title', $fields[1]['field']['display']);
        $this->assertSame('Keep me', $fields[1]['field']['placeholder']);
    }

    public function test_it_forgets_imported_fieldset_fields_cached_before_the_expand()
    {
        Blink::put('blueprint-imported-fields-stale', ['list' => 'replicator']);
        Blink::put('unrelated', true);

        $blueprint = (new Blueprint)->setHandle('page')->setContents([
            'tabs' => [
                'main' => [
                    'sections' => [
                        ['fields' => []],
                    ],
                ],
            ],
        ]);

        (new ExpandFromTheStart)->handle(new EntryBlueprintFound($blueprint));

        $this->assertFalse(Blink::has('blueprint-imported-fields-stale'));
        $this->assertTrue(Blink::has('unrelated'));
    }
}
