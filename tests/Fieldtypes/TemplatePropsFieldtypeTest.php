<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Fieldtypes\TemplatePropsFieldtype;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Fields\Field;

class TemplatePropsFieldtypeTest extends TestCase
{
    public function test_process_keeps_named_mappings(): void
    {
        $fieldtype = $this->fieldtype();

        $this->assertSame(
            ['headline_field' => 'title'],
            $fieldtype->process(['headline_field' => 'title', 'empty' => ''])
        );
    }

    public function test_field_is_not_selectable_in_blueprint_picker(): void
    {
        $this->assertFalse((new TemplatePropsFieldtype)->selectable());
    }

    private function fieldtype(): TemplatePropsFieldtype
    {
        $fieldtype = new TemplatePropsFieldtype;
        $fieldtype->setField(new Field('sve_props', [
            'type' => 'sve_template_props',
            'section_type' => 'dynamic/entries',
        ]));

        return $fieldtype;
    }
}
