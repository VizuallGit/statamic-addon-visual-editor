<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Listeners;

use MarioHamann\StatamicVisualEditor\Listeners\UseLiteSections;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Events\EntryBlueprintFound;
use Statamic\Facades\Blink;
use Statamic\Fields\Blueprint;

class UseLiteSectionsTest extends TestCase
{
    private function pageBlueprint(): Blueprint
    {
        return (new Blueprint)->setHandle('page')->setContents([
            'tabs' => [
                'main' => [
                    'sections' => [
                        [
                            'fields' => [
                                [
                                    'handle' => 'page_sections',
                                    'field' => [
                                        'type' => 'replicator',
                                        'display' => 'Page sections',
                                        'sets' => [],
                                    ],
                                ],
                                [
                                    'handle' => 'title',
                                    'field' => [
                                        'type' => 'text',
                                        'display' => 'Title',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }

    public function test_it_swaps_page_sections_in_live_preview(): void
    {
        request()->query->set('live-preview', '1');

        $blueprint = $this->pageBlueprint();

        (new UseLiteSections)->handle(new EntryBlueprintFound($blueprint));

        $fields = $blueprint->contents()['tabs']['main']['sections'][0]['fields'];

        $this->assertSame(UseLiteSections::TYPE, $fields[0]['field']['type']);
        $this->assertSame('text', $fields[1]['field']['type']);
    }

    public function test_it_leaves_replicator_outside_live_preview(): void
    {
        $blueprint = $this->pageBlueprint();

        (new UseLiteSections)->handle(new EntryBlueprintFound($blueprint));

        $fields = $blueprint->contents()['tabs']['main']['sections'][0]['fields'];

        $this->assertSame('replicator', $fields[0]['field']['type']);
    }

    public function test_it_forgets_imported_fieldset_fields_cache(): void
    {
        request()->query->set('live-preview', '1');

        Blink::put('blueprint-imported-fields-stale', ['page_sections' => 'replicator']);
        Blink::put('unrelated', true);

        (new UseLiteSections)->handle(new EntryBlueprintFound($this->pageBlueprint()));

        $this->assertFalse(Blink::has('blueprint-imported-fields-stale'));
        $this->assertTrue(Blink::has('unrelated'));
    }
}
