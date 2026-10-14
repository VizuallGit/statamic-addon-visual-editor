<?php

namespace MarioHamann\StatamicVisualEditor\Tests\ComponentProps;

use MarioHamann\StatamicVisualEditor\ComponentProps;
use MarioHamann\StatamicVisualEditor\ComponentProps\GroupValue;
use MarioHamann\StatamicVisualEditor\PropFields;
use MarioHamann\StatamicVisualEditor\SectionTemplate;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\Antlers;

class GroupTest extends TestCase
{
    private function items(array $extra = []): array
    {
        return [
            'handle' => 'items',
            'type' => 'group',
            'label' => '',
            'default' => '',
            'repeat' => true,
            'fields' => [
                ['handle' => 'title', 'type' => 'text'],
                ['handle' => 'flag', 'type' => 'boolean'],
            ],
            ...$extra,
        ];
    }

    private function render(string $template, array $data = []): string
    {
        return trim((string) Antlers::parse($template, $data, trusted: true));
    }

    public function test_a_group_keeps_its_fields_and_whether_it_repeats()
    {
        $clean = ComponentProps::normalize([$this->items()]);

        $this->assertSame('group', $clean[0]['type']);
        $this->assertTrue($clean[0]['repeat']);
        $this->assertSame(['title', 'flag'], array_column($clean[0]['fields'], 'handle'));
        $this->assertSame(['boolean'], array_values(array_unique(array_column(array_slice($clean[0]['fields'], 1), 'type'))));
    }

    public function test_a_group_inside_a_group_becomes_text_and_a_loop_name_is_dropped()
    {
        $clean = ComponentProps::normalize([$this->items(['fields' => [
            ['handle' => 'inner', 'type' => 'group'],
            ['handle' => 'count', 'type' => 'text'],
            ['handle' => 'first', 'type' => 'text'],
            ['handle' => 'title', 'type' => 'text'],
        ]])]);

        $this->assertSame(['inner', 'title'], array_column($clean[0]['fields'], 'handle'));
        $this->assertSame('text', $clean[0]['fields'][0]['type']);
    }

    public function test_a_field_outside_a_group_may_still_be_called_count()
    {
        $clean = ComponentProps::normalize([['handle' => 'count', 'type' => 'text']]);

        $this->assertSame('count', $clean[0]['handle']);
    }

    public function test_the_default_always_names_the_fields_even_with_no_rows()
    {
        $clean = ComponentProps::normalize([$this->items()]);
        $default = GroupValue::decode($clean[0]['default']);

        $this->assertSame(['title', 'flag'], $default['fields']);
        $this->assertSame([], $default['rows']);
        $this->assertTrue($default['repeat']);
    }

    public function test_a_declaration_with_a_group_survives_a_round_trip()
    {
        $props = ComponentProps::normalize([$this->items([
            'default' => GroupValue::encode(['title', 'flag'], [['title' => 'Én', 'flag' => 'true']], true),
        ])]);

        $file = SectionTemplate::join(['html' => '<ul></ul>', 'css' => '', 'js' => '', 'props' => $props]);

        $this->assertSame($props, SectionTemplate::split($file)['props']);
        $this->assertStringContainsString('props_items="'.GroupValue::PREFIX, $file);
    }

    public function test_the_component_loops_over_its_own_rows_when_the_call_wrote_none()
    {
        $default = GroupValue::encode(['title'], [['title' => 'A'], ['title' => 'B']], true);

        $this->assertSame(
            '[A][B]',
            $this->render('{{ sve_defaults props_items="'.$default.'" }}{{ props_items }}[{{ title }}]{{ /props_items }}{{ /sve_defaults }}')
        );
    }

    public function test_the_call_beats_the_component_rows()
    {
        $default = GroupValue::encode(['title'], [['title' => 'A']], true);
        $call = GroupValue::encode(['title'], [['title' => 'X'], ['title' => 'Y'], ['title' => 'Z']], true);

        $this->assertSame(
            '[X][Y][Z]',
            $this->render('{{ sve_defaults props_items="'.$default.'" }}{{ props_items }}[{{ title }}]{{ /props_items }}{{ /sve_defaults }}', ['props_items' => $call])
        );
    }

    public function test_a_row_never_shows_the_page_field_of_the_same_name()
    {
        // The call was written before `title` was added to the group: its rows
        // have no `title`. Inside the loop a missing name is looked up in the
        // page around it — this printed "Sidens titel" before the rows were
        // filled in from the declaration.
        $default = GroupValue::encode(['title', 'text'], [], true);
        $call = GroupValue::encode(['text'], [['text' => 'brødtekst']], true);

        $this->assertSame(
            '[|brødtekst]',
            $this->render(
                '{{ sve_defaults props_items="'.$default.'" }}{{ props_items }}[{{ title }}|{{ text }}]{{ /props_items }}{{ /sve_defaults }}',
                ['props_items' => $call, 'title' => 'Sidens titel']
            )
        );
    }

    public function test_a_switch_in_a_row_is_a_boolean_the_template_can_test()
    {
        $default = GroupValue::encode(['flag'], [['flag' => 'true'], ['flag' => 'false']], true);

        $this->assertSame(
            '[ja][nej]',
            $this->render('{{ sve_defaults props_items="'.$default.'" }}{{ props_items }}[{{ if flag }}ja{{ else }}nej{{ /if }}]{{ /props_items }}{{ /sve_defaults }}')
        );
    }

    public function test_a_group_that_does_not_repeat_is_read_by_path()
    {
        $default = GroupValue::encode(['title'], [['title' => 'Hej']], false);

        $this->assertSame(
            'Hej',
            $this->render('{{ sve_defaults props_hero="'.$default.'" }}{{ props_hero:title }}{{ /sve_defaults }}')
        );
    }

    public function test_a_group_reading_from_the_page_is_the_page_field()
    {
        $default = GroupValue::encode(['title'], [['title' => 'A']], true);

        $this->assertSame(
            '[Fra siden]',
            $this->render(
                '{{ sve_defaults props_items="'.$default.'" }}{{ props_items }}[{{ title }}]{{ /props_items }}{{ /sve_defaults }}',
                ['props_items' => [['title' => 'Fra siden']]]
            )
        );
    }

    public function test_rows_come_back_to_the_form_and_go_out_the_same()
    {
        $prop = ComponentProps::normalize([$this->items()])[0];
        $written = GroupValue::encode(['title', 'flag'], [['title' => 'Én', 'flag' => 'true'], ['title' => 'To', 'flag' => 'false']], true);

        $form = PropFields::toPublish($prop, $written);

        $this->assertSame([['title' => 'Én', 'flag' => true], ['title' => 'To', 'flag' => false]], $form);
        $this->assertTrue(GroupValue::same($written, PropFields::toParam($prop, $form)));
    }

    public function test_an_empty_list_is_written_as_nothing()
    {
        $prop = ComponentProps::normalize([$this->items()])[0];

        $this->assertSame('', PropFields::toParam($prop, []));
        $this->assertSame('', PropFields::toParam($prop, null));
    }

    public function test_a_group_with_nothing_filled_in_is_written_as_nothing()
    {
        $prop = ComponentProps::normalize([$this->items(['repeat' => false, 'fields' => [['handle' => 'title', 'type' => 'text']]])])[0];

        $this->assertSame('', PropFields::toParam($prop, ['title' => '']));
        $this->assertSame(['title' => 'Hej'], GroupValue::decode(PropFields::toParam($prop, ['title' => 'Hej']))['rows'][0]);
    }

    public function test_the_form_is_the_control_panels_grid_or_group()
    {
        $repeat = PropFields::config(ComponentProps::normalize([$this->items()])[0]);
        $single = PropFields::config(ComponentProps::normalize([$this->items(['repeat' => false])])[0]);

        $this->assertSame('grid', $repeat['type']);
        $this->assertSame('group', $single['type']);
        $this->assertSame(['title', 'flag'], array_column($repeat['fields'], 'handle'));
        $this->assertSame('toggle', $repeat['fields'][1]['field']['type']);
        $this->assertFalse($repeat['fields'][0]['field']['hide_display']);
    }

    public function test_a_value_that_is_not_ours_does_not_decode()
    {
        $this->assertNull(GroupValue::decode('Overskrift'));
        $this->assertNull(GroupValue::decode(GroupValue::PREFIX.'!!!'));
        $this->assertNull(GroupValue::decode(['title' => 'x']));
    }
}
