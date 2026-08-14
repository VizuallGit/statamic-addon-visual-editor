<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Fieldtypes\DefaultSetsFieldtype;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;

class DefaultSetsFieldtypeTest extends TestCase
{
    private DefaultSetsFieldtype $fieldtype;

    protected function setUp(): void
    {
        parent::setUp();
        $this->fieldtype = new DefaultSetsFieldtype;
    }

    public function test_handles_become_default_rows(): void
    {
        $this->assertSame(
            [
                ['type' => 'icon'],
                ['type' => 'title'],
            ],
            $this->fieldtype->process(['icon', 'title']),
        );
    }

    public function test_existing_rows_keep_nested_values(): void
    {
        $rows = [
            ['type' => 'section_heading', 'blocks' => [['type' => 'headline']]],
            ['type' => 'content_boxes'],
        ];

        $this->assertSame($rows, $this->fieldtype->process($rows));
        $this->assertSame($rows, $this->fieldtype->preProcess($rows));
    }

    public function test_duplicate_types_keep_the_first_row(): void
    {
        $this->assertSame(
            [['type' => 'icon', 'icon' => 'star'], ['type' => 'title']],
            $this->fieldtype->process([
                ['type' => 'icon', 'icon' => 'star'],
                ['type' => 'title'],
                ['type' => 'icon'],
            ]),
        );
    }

    public function test_empty_list_is_stored_as_null(): void
    {
        $this->assertNull($this->fieldtype->process([]));
        $this->assertNull($this->fieldtype->process(null));
    }

    public function test_field_is_not_selectable_in_blueprint_picker(): void
    {
        $this->assertFalse($this->fieldtype->selectable());
    }
}
