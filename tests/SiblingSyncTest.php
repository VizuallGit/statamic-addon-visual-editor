<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\ResponsiveFields;
use MarioHamann\StatamicVisualEditor\SiblingSync;

class SiblingSyncTest extends TestCase
{
    public function test_responsive_wrap_keeps_sibling_sync_on_the_wrapper(): void
    {
        $field = ResponsiveFields::apply('padding', [
            'type' => 'spacing',
            'display' => 'Padding',
            'sve_responsive' => true,
            'sve_sync_siblings' => true,
        ]);

        $this->assertSame('responsive', $field['type']);
        $this->assertTrue($field[SiblingSync::KEY]);
        $this->assertArrayNotHasKey(SiblingSync::KEY, $field['fields'][0]['field']);
    }

    public function test_responsive_wrap_does_not_add_sibling_sync_when_unset(): void
    {
        $field = ResponsiveFields::apply('padding', [
            'type' => 'spacing',
            'sve_responsive' => true,
        ]);

        $this->assertArrayNotHasKey(SiblingSync::KEY, $field);
    }

    public function test_apply_adds_a_class_so_the_panel_can_find_the_field(): void
    {
        $field = SiblingSync::apply([
            'type' => 'select',
            'sve_sync_siblings' => true,
        ]);

        $this->assertStringContainsString(SiblingSync::CLASS_NAME, $field['classes']);
    }
}
