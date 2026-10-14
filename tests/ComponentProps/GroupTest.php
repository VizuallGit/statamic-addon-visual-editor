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

        $this->assertSame([
            ['type' => 'row', 'enabled' => true, 'title' => 'Én', 'flag' => true],
            ['type' => 'row', 'enabled' => true, 'title' => 'To', 'flag' => false],
        ], $form);
        $this->assertTrue(GroupValue::same($written, PropFields::toParam($prop, $form)));
    }

    public function test_a_list_with_its_last_row_deleted_is_written_as_no_rows()
    {
        $prop = ComponentProps::normalize([$this->items()])[0];

        $this->assertSame([], GroupValue::decode(PropFields::toParam($prop, []))['rows']);
        $this->assertSame([], GroupValue::decode(PropFields::toParam($prop, null))['rows']);
    }

    public function test_a_place_with_no_rows_shows_none_of_the_component_rows()
    {
        $default = GroupValue::encode(['title'], [['title' => 'A'], ['title' => 'B']], true);
        $call = GroupValue::encode(['title'], [], true);

        $this->assertSame(
            '<ul></ul>',
            $this->render('{{ sve_defaults props_items="'.$default.'" }}<ul>{{ props_items }}<li>{{ title }}</li>{{ /props_items }}</ul>{{ /sve_defaults }}', ['props_items' => $call])
        );
    }

    public function test_text_that_is_not_utf8_never_empties_the_value()
    {
        $written = GroupValue::encode(['title'], [['title' => "ok \xB1 ok"]], true);

        $this->assertSame(['title'], GroupValue::decode($written)['fields']);
        $this->assertStringStartsWith('ok ', GroupValue::decode($written)['rows'][0]['title']);
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

        $set = $repeat['sets']['main']['sets']['row'];

        $this->assertSame('replicator', $repeat['type']);
        $this->assertSame('accordion', $repeat['collapse']);
        $this->assertSame('group', $single['type']);
        $this->assertSame(['title', 'flag'], array_column($set['fields'], 'handle'));
        $this->assertSame('toggle', $set['fields'][1]['field']['type']);
        $this->assertFalse($set['fields'][0]['field']['hide_display']);
        $this->assertSame(['title', 'flag'], array_column($single['fields'], 'handle'));
    }

    public function test_a_row_switched_off_stays_in_the_list_and_off_the_page()
    {
        $prop = ComponentProps::normalize([$this->items()])[0];
        $written = PropFields::toParam($prop, [
            ['type' => 'row', 'enabled' => true, 'title' => 'Én'],
            ['type' => 'row', 'enabled' => false, 'title' => 'To'],
            ['type' => 'row', 'enabled' => true, 'title' => 'Tre'],
        ]);

        $this->assertSame([1], GroupValue::decode($written)['off']);
        $this->assertSame([true, false, true], array_column(PropFields::toPublish($prop, $written), 'enabled'));

        $default = GroupValue::encode(['title', 'flag'], [], true);

        $this->assertSame(
            '[Én][Tre]',
            $this->render('{{ sve_defaults props_items="'.$default.'" }}{{ props_items }}[{{ title }}]{{ /props_items }}{{ /sve_defaults }}', ['props_items' => $written])
        );
    }

    public function test_switching_a_row_off_is_a_change_and_a_list_without_any_reads_as_before()
    {
        $on = GroupValue::encode(['title'], [['title' => 'A']], true);
        $off = GroupValue::encode(['title'], [['title' => 'A']], true, [0]);

        $this->assertFalse(GroupValue::same($on, $off));
        $this->assertStringNotContainsString('"off"', base64_decode(strtr(substr($on, strlen(GroupValue::PREFIX)), '-_', '+/')));
        $this->assertSame([0], GroupValue::decode(ComponentProps::normalize([$this->items(['default' => GroupValue::encode(['title', 'flag'], [['title' => 'A']], true, [0])])])[0]['default'])['off']);
    }

    public function test_a_value_that_is_not_ours_does_not_decode()
    {
        $this->assertNull(GroupValue::decode('Overskrift'));
        $this->assertNull(GroupValue::decode(GroupValue::PREFIX.'!!!'));
        $this->assertNull(GroupValue::decode(['title' => 'x']));
    }
}
