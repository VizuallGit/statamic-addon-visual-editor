<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\ComponentProps\ClassParam;

class ComponentClassParamTest extends TestCase
{
    public function test_a_component_reading_class_takes_its_classes_in_class()
    {
        $file = '<div class="flow-y {{ settings.sr_only ?= \'sr-only\' }} {{ class }}">{{ text }}</div>';

        $this->assertSame('class', ClassParam::in($file));
    }

    public function test_underscore_class_and_a_class_prop_are_found_too()
    {
        $this->assertSame('_class', ClassParam::in('<div class="{{ _class }}"></div>'));
        $this->assertSame('props_class', ClassParam::in('<div class="{{ props_class }} {{ class }}"></div>'));
    }

    public function test_a_class_handed_on_to_another_partial_is_not_a_read()
    {
        $file = '{{ partial:components/image class="size-800" }}<p class="text-200">{{ text }}</p>';

        $this->assertNull(ClassParam::in($file));
    }

    public function test_a_bound_parameter_that_passes_class_on_is_a_read()
    {
        $this->assertSame('class', ClassParam::in('{{ partial:components/image :class="class" }}'));
    }

    public function test_comments_and_lookalikes_are_not_reads()
    {
        $file = "{{# {{ class }} #}}\n<div>{{ item.class }} {{ subclass }} {{ class_name }}</div>";

        $this->assertNull(ClassParam::in($file));
    }

    public function test_a_comparison_is_still_a_read()
    {
        $this->assertSame('class', ClassParam::in('{{ if class == "wide" }}<div></div>{{ /if }}'));
    }
}
