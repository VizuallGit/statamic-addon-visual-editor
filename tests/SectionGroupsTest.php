<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SectionTypeMaker;
use MarioHamann\StatamicVisualEditor\SectionTypes;
use Statamic\Facades\Fieldset;

/**
 * Groups of the page builder: every one is listed, empty ones too, and a new
 * one can be made as a tab with no sections in it.
 */
class SectionGroupsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Fieldset::make('page_sections')->setContents([
            'title' => 'Page sections',
            'fields' => [[
                'handle' => 'page_sections',
                'field' => [
                    'type' => 'replicator',
                    'sets' => [
                        'hero' => ['display' => 'Hero', 'sets' => [
                            'hero/style_1' => ['display' => 'Hero 1', 'fields' => [['import' => 'hero.style_1']]],
                        ]],
                        'lister' => ['display' => 'Lister', 'sets' => []],
                    ],
                ],
            ]],
        ])->save();
    }

    protected function tearDown(): void
    {
        Fieldset::find('page_sections')?->delete();

        parent::tearDown();
    }

    public function test_every_group_is_listed_in_fieldset_order_even_when_empty(): void
    {
        $this->assertSame([
            ['handle' => 'hero', 'display' => 'Hero', 'static' => false],
            ['handle' => 'lister', 'display' => 'Lister', 'static' => false],
        ], SectionTypes::groups());
    }

    public function test_a_group_can_be_made_empty_and_a_taken_name_gets_a_number(): void
    {
        $this->assertSame(['handle' => 'content', 'display' => 'Content'], SectionTypeMaker::createGroup('page_sections', 'Content'));
        $this->assertSame(['handle' => 'lister_2', 'display' => 'Lister'], SectionTypeMaker::createGroup('page_sections', 'Lister'));
        $this->assertNull(SectionTypeMaker::createGroup('page_sections', '???'));

        // The file is the truth: the repository memoises a fieldset for the request.
        $sets = SectionTypeMaker::readFieldset('page_sections')['fields'][0]['field']['sets'];

        $this->assertSame(['hero', 'lister', 'content', 'lister_2'], array_keys($sets));
        $this->assertSame(['display' => 'Content', 'sets' => []], $sets['content']);
        $this->assertSame('content', SectionTypes::groups()[2]['handle']);
    }
}
