<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Fieldtypes\ColumnSpanFieldtype;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Fields\Field;

class ColumnSpanFieldtypeTest extends TestCase
{
    private function fieldtype(array $config = []): ColumnSpanFieldtype
    {
        $fieldtype = new ColumnSpanFieldtype;
        $fieldtype->setField(new Field('span', array_merge(['type' => 'column_span'], $config)));

        return $fieldtype;
    }

    public function test_a_plain_width_stays_a_plain_width(): void
    {
        $fieldtype = $this->fieldtype(['columns' => 6]);

        $this->assertSame(4, $fieldtype->process(4));
        $this->assertSame(4, $fieldtype->preProcess(4));
    }

    public function test_a_width_augments_to_something_that_still_prints_as_the_number(): void
    {
        $value = $this->fieldtype(['columns' => 6])->augment(4);

        // Templates written before starting columns existed say {{ span }} and
        // expect the number. That has to keep working untouched.
        $this->assertSame('4', (string) $value);
        $this->assertSame(4, $value['span']);
        $this->assertNull($value['start']);
        $this->assertNull($value['end']);
    }

    public function test_a_placement_keeps_both_numbers(): void
    {
        $fieldtype = $this->fieldtype(['columns' => 6]);

        $this->assertSame(['span' => 3, 'start' => 2], $fieldtype->process(['start' => 2, 'span' => 3]));

        $value = $fieldtype->augment(['start' => 2, 'span' => 3]);

        $this->assertSame('3', (string) $value);
        $this->assertSame(2, $value['start']);
        $this->assertSame(5, $value['end']);
    }

    public function test_a_placement_without_a_start_is_stored_as_the_number_alone(): void
    {
        $this->assertSame(3, $this->fieldtype(['columns' => 6])->process(['start' => null, 'span' => 3]));
    }

    public function test_empty_stays_empty(): void
    {
        $fieldtype = $this->fieldtype(['columns' => 6]);

        $this->assertNull($fieldtype->process(null));
        $this->assertNull($fieldtype->process(''));
        $this->assertNull($fieldtype->process([]));
        $this->assertNull($fieldtype->process(0));
        $this->assertNull($fieldtype->augment(null));
    }

    public function test_a_width_from_a_wider_grid_is_clipped_not_dropped(): void
    {
        $this->assertSame(6, $this->fieldtype(['columns' => 6])->process(12));
    }

    public function test_a_block_may_not_hang_off_the_end_of_the_grid(): void
    {
        // Start 5 of 6 leaves room for two columns, not four. The start is where
        // someone put it; the width is what gives.
        $this->assertSame(
            ['span' => 2, 'start' => 5],
            $this->fieldtype(['columns' => 6])->process(['start' => 5, 'span' => 4])
        );
    }

    public function test_a_start_outside_the_grid_moves_in_rather_than_disappearing(): void
    {
        $this->assertSame(
            ['span' => 1, 'start' => 6],
            $this->fieldtype(['columns' => 6])->process(['start' => 9, 'span' => 3])
        );
    }

    public function test_an_augmented_value_can_be_read_back(): void
    {
        $fieldtype = $this->fieldtype(['columns' => 6]);
        $roundTripped = $fieldtype->augment(['start' => 2, 'span' => 3])->toArray();

        $this->assertSame(['span' => 3, 'start' => 2], $fieldtype->process($roundTripped));
    }
}
