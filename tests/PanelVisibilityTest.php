<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\PanelVisibility;

class PanelVisibilityTest extends TestCase
{
    public function test_it_leaves_a_field_that_was_never_asked_alone(): void
    {
        // How this was done before the setting existed. Still has to work.
        $field = ['type' => 'select', 'if' => 'custom notInLivePreview'];

        $this->assertSame($field, PanelVisibility::apply($field));
    }

    public function test_it_hides_a_form_only_field_from_the_panel(): void
    {
        $field = PanelVisibility::apply(['type' => 'select', 'sve_panel' => 'form']);

        $this->assertSame('custom notInLivePreview', $field['if']);
        $this->assertTrue($field['always_save']);
    }

    public function test_it_keeps_a_panel_only_field_out_of_the_ordinary_form(): void
    {
        $field = PanelVisibility::apply(['type' => 'select', 'sve_panel' => 'panel']);

        $this->assertSame('custom onlyInLivePreview', $field['if']);
        $this->assertTrue($field['always_save']);
    }

    public function test_it_adds_no_condition_when_the_field_belongs_in_both(): void
    {
        $field = PanelVisibility::apply(['type' => 'select', 'sve_panel' => 'both']);

        $this->assertArrayNotHasKey('if', $field);
        $this->assertArrayNotHasKey('always_save', $field);
    }

    public function test_it_takes_back_a_condition_of_its_own_that_was_saved_to_disk(): void
    {
        // A blueprint saved from the Control Panel can persist what the listener
        // injected. Switching the setting back has to undo it.
        $field = PanelVisibility::apply([
            'type' => 'select',
            'sve_panel' => 'both',
            'if' => 'custom notInLivePreview',
            'always_save' => true,
        ]);

        $this->assertArrayNotHasKey('if', $field);
        $this->assertArrayNotHasKey('always_save', $field);
    }

    public function test_it_never_overrules_a_condition_the_site_wrote_itself(): void
    {
        $field = PanelVisibility::apply([
            'type' => 'select',
            'sve_panel' => 'form',
            'if' => 'custom somethingElse',
        ]);

        $this->assertSame('custom somethingElse', $field['if']);
        $this->assertArrayNotHasKey('always_save', $field);
    }

    public function test_it_leaves_other_kinds_of_condition_alone_too(): void
    {
        foreach (['if_any', 'unless'] as $key) {
            $field = PanelVisibility::apply([
                'type' => 'select',
                'sve_panel' => 'form',
                $key => ['other_field' => 'equals yes'],
            ]);

            $this->assertArrayNotHasKey('if', $field, "{$key} was overruled");
        }
    }
}
