<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Fieldtypes\BardDefaultFieldtype;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;

class BardDefaultFieldtypeTest extends TestCase
{
    private BardDefaultFieldtype $fieldtype;

    protected function setUp(): void
    {
        parent::setUp();
        $this->fieldtype = new BardDefaultFieldtype;
    }

    public function test_heading_kind_becomes_prosemirror(): void
    {
        $this->assertSame(
            [
                [
                    'type' => 'heading',
                    'attrs' => ['level' => 1],
                    'content' => [['type' => 'text', 'text' => 'Indtast din tekst']],
                ],
            ],
            $this->fieldtype->process([
                ['kind' => 'heading', 'level' => 1, 'text' => 'Indtast din tekst'],
            ]),
        );
    }

    public function test_paragraph_and_heading_round_trip(): void
    {
        $nodes = [
            [
                'type' => 'heading',
                'attrs' => ['level' => 2],
                'content' => [['type' => 'text', 'text' => 'Overskrift']],
            ],
            [
                'type' => 'paragraph',
                'content' => [['type' => 'text', 'text' => 'Indtast din tekst']],
            ],
        ];

        $kinds = $this->fieldtype->preProcess($nodes);

        $this->assertSame(
            [
                ['kind' => 'heading', 'level' => 2, 'text' => 'Overskrift'],
                ['kind' => 'paragraph', 'text' => 'Indtast din tekst'],
            ],
            $kinds,
        );

        $this->assertSame($nodes, $this->fieldtype->process($kinds));
    }

    public function test_inline_text_becomes_a_text_node(): void
    {
        $this->assertSame(
            [['type' => 'text', 'text' => 'Indtast din overskrift']],
            $this->fieldtype->process([
                ['kind' => 'text', 'text' => 'Indtast din overskrift'],
            ]),
        );
    }

    public function test_empty_inline_text_is_dropped(): void
    {
        $this->assertNull($this->fieldtype->process([
            ['kind' => 'text', 'text' => ''],
        ]));
    }

    public function test_empty_paragraph_is_still_a_node(): void
    {
        $this->assertSame(
            [['type' => 'paragraph']],
            $this->fieldtype->process([
                ['kind' => 'paragraph', 'text' => ''],
            ]),
        );
    }

    public function test_unknown_nodes_are_kept(): void
    {
        $set = ['type' => 'set', 'attrs' => ['id' => 'abc', 'values' => ['type' => 'pullquote']]];

        $kinds = $this->fieldtype->preProcess([$set]);

        $this->assertSame([['kind' => 'raw', 'node' => $set]], $kinds);
        $this->assertSame([$set], $this->fieldtype->process($kinds));
    }

    public function test_heading_yaml_from_disk_fills_the_ui(): void
    {
        $fromYaml = [
            [
                'type' => 'heading',
                'attrs' => ['level' => 1],
                'content' => [
                    ['type' => 'text', 'text' => 'Indtast din tekst'],
                ],
            ],
        ];

        $this->assertSame(
            [['kind' => 'heading', 'level' => 1, 'text' => 'Indtast din tekst']],
            $this->fieldtype->preProcess($fromYaml),
        );

        $this->assertSame($fromYaml, $this->fieldtype->process(
            $this->fieldtype->preProcess($fromYaml),
        ));
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
