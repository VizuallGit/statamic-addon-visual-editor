<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\FromTheStart;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;

class FromTheStartTest extends TestCase
{
    public function test_empty_counts_leave_rows_including_duplicates(): void
    {
        $rows = [
            ['type' => 'content'],
            ['type' => 'list'],
            ['type' => 'list'],
            ['type' => 'list'],
        ];

        $this->assertSame($rows, FromTheStart::expand($rows, []));
        $this->assertSame($rows, FromTheStart::expand($rows, null));
        $this->assertSame($rows, FromTheStart::expand($rows, 3));
    }

    public function test_count_applies_per_type(): void
    {
        $this->assertSame(
            [
                ['type' => 'content'],
                ['type' => 'list'],
                ['type' => 'list'],
                ['type' => 'list'],
            ],
            FromTheStart::expand(
                [
                    ['type' => 'content'],
                    ['type' => 'list'],
                ],
                [
                    ['set' => 'list', 'count' => 3],
                ],
            ),
        );
    }

    public function test_count_one_is_ignored(): void
    {
        $rows = [
            ['type' => 'content'],
            ['type' => 'list'],
        ];

        $this->assertSame(
            $rows,
            FromTheStart::expand($rows, [
                ['set' => 'list', 'count' => 1],
            ]),
        );
    }

    public function test_apply_only_touches_replicators(): void
    {
        $text = ['type' => 'text', 'default' => 'Hi', FromTheStart::KEY => [['set' => 'item', 'count' => 3]]];
        $this->assertSame($text, FromTheStart::apply($text));

        $once = [
            'type' => 'replicator',
            'default' => [['type' => 'item']],
        ];
        $this->assertSame($once, FromTheStart::apply($once));
    }

    public function test_apply_is_idempotent(): void
    {
        $field = [
            'type' => 'replicator',
            'default' => [['type' => 'item']],
            FromTheStart::KEY => [['set' => 'item', 'count' => 3]],
        ];

        $once = FromTheStart::apply($field);
        $twice = FromTheStart::apply($once);

        $this->assertCount(3, $once['default']);
        $this->assertSame($once, $twice);
    }
}
