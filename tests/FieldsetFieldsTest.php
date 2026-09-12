<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\FieldsetFields;

class FieldsetFieldsTest extends TestCase
{
    public function test_it_reads_a_flat_fieldset(): void
    {
        $fields = FieldsetFields::flatten([
            'title' => 'Hero',
            'fields' => [
                ['handle' => 'headline', 'field' => ['type' => 'text']],
                ['handle' => 'text', 'field' => ['type' => 'bard']],
            ],
        ]);

        $this->assertSame(['headline', 'text'], array_column($fields, 'handle'));
    }

    /**
     * The shape the Fieldsets screen switches to the moment someone names a
     * section — and the one that used to return nothing at all, taking
     * click-to-focus in Live Preview with it.
     */
    public function test_it_reads_a_sectioned_fieldset(): void
    {
        $fields = FieldsetFields::flatten([
            'title' => 'Hero',
            'sections' => [
                ['display' => 'Indhold', 'fields' => [
                    ['handle' => 'headline', 'field' => ['type' => 'text']],
                ]],
                ['display' => 'Design', 'fields' => [
                    ['handle' => 'bg_color', 'field' => ['type' => 'select']],
                    ['handle' => 'padding', 'field' => ['type' => 'sve_responsive']],
                ]],
            ],
        ]);

        $this->assertSame(['headline', 'bg_color', 'padding'], array_column($fields, 'handle'));
    }

    public function test_an_empty_sections_key_falls_back_to_fields(): void
    {
        // Statamic never writes both, but a hand-edited file can hold an empty
        // `sections` alongside real fields, and the fields are what matters.
        $fields = FieldsetFields::flatten([
            'sections' => [],
            'fields' => [['handle' => 'headline', 'field' => ['type' => 'text']]],
        ]);

        $this->assertSame(['headline'], array_column($fields, 'handle'));
    }

    public function test_it_survives_a_fieldset_with_neither(): void
    {
        $this->assertSame([], FieldsetFields::flatten(['title' => 'Tom']));
        $this->assertSame([], FieldsetFields::of(null));
        $this->assertSame([], FieldsetFields::of('der.findes.ikke'));
    }
}
