<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\DataVars;
use MarioHamann\StatamicVisualEditor\DataVars\Rows;

class DataVarsTest extends TestCase
{
    /** @return array<string, array<string, mixed>> keyed by variable name */
    protected function walk(array $fields): array
    {
                $out = [];

        foreach (Rows::walk($fields) as $row) {
            $out[$row['var']] = $row;
        }

        return $out;
    }

    public function test_it_lists_plain_fields(): void
    {
        $rows = $this->walk([
            ['handle' => 'headline', 'field' => ['type' => 'text', 'display' => 'Headline']],
            ['handle' => 'text', 'field' => ['type' => 'bard']],
        ]);

        $this->assertSame(['headline', 'text'], array_keys($rows));
        $this->assertSame('Headline', $rows['headline']['label']);
    }

    /** A section's own content (a hidden field) says so: Build tells it from one editable in Edit Content. */
    public function test_a_hidden_field_says_it_is_hidden(): void
    {
        $rows = $this->walk([
            ['handle' => 'heading', 'field' => ['type' => 'text', 'visibility' => 'hidden']],
            ['handle' => 'text', 'field' => ['type' => 'text']],
        ]);

        $this->assertTrue($rows['heading']['hidden']);
        $this->assertArrayNotHasKey('hidden', $rows['text']);
    }

    public function test_a_choice_carries_its_option_keys_in_every_shape(): void
    {
        $rows = $this->walk([
            ['handle' => 'image_position', 'field' => ['type' => 'button_group', 'options' => [['key' => 'left', 'value' => 'Left'], ['key' => 'right', 'value' => 'Right']]]],
            ['handle' => 'size', 'field' => ['type' => 'select', 'options' => ['sm' => 'Small', 'lg' => 'Large']]],
            ['handle' => 'tone', 'field' => ['type' => 'radio', 'options' => ['light', 'dark']]],
            ['handle' => 'title', 'field' => ['type' => 'text']],
        ]);

        $this->assertSame(['left', 'right'], $rows['image_position']['options']);
        $this->assertSame(['sm', 'lg'], $rows['size']['options']);
        $this->assertSame(['light', 'dark'], $rows['tone']['options']);
        $this->assertArrayNotHasKey('options', $rows['title']);
    }

    public function test_bard_prints_rather_than_loops(): void
    {
        $rows = $this->walk([['handle' => 'text', 'field' => ['type' => 'bard']]]);

        $this->assertArrayNotHasKey('loop', $rows['text']);
    }

    public function test_assets_and_replicators_are_loops(): void
    {
        $rows = $this->walk([
            ['handle' => 'image', 'field' => ['type' => 'assets']],
            ['handle' => 'list', 'field' => ['type' => 'replicator', 'sets' => []]],
        ]);

        $this->assertTrue($rows['image']['loop']);
        $this->assertTrue($rows['list']['loop']);
    }

    public function test_control_panel_only_fields_are_left_out(): void
    {
        $rows = $this->walk([
            ['handle' => 'headline', 'field' => ['type' => 'text']],
            ['handle' => 'a_tab', 'field' => ['type' => 'section']],
            ['handle' => 'reveal', 'field' => ['type' => 'revealer']],
        ]);

        $this->assertSame(['headline'], array_keys($rows));
    }

    public function test_the_skip_list_can_be_extended_from_config(): void
    {
        config(['statamic-visual-editor.data_vars.skip' => ['toggle']]);

        $rows = $this->walk([
            ['handle' => 'headline', 'field' => ['type' => 'text']],
            ['handle' => 'on', 'field' => ['type' => 'toggle']],
        ]);

        $this->assertSame(['headline'], array_keys($rows));
    }

    public function test_a_group_becomes_a_dotted_path_and_no_row_of_its_own(): void
    {
        $rows = $this->walk([[
            'handle' => 'link',
            'field' => [
                'type' => 'group',
                'fields' => [
                    ['handle' => 'url', 'field' => ['type' => 'text']],
                    ['handle' => 'label', 'field' => ['type' => 'text']],
                ],
            ],
        ]]);

        $this->assertSame(['link.url', 'link.label'], array_keys($rows));
    }

    public function test_fields_inside_a_loop_keep_their_bare_handle_and_say_where_they_live(): void
    {
        $rows = $this->walk([[
            'handle' => 'list',
            'field' => [
                'type' => 'replicator',
                'sets' => [
                    'box' => ['fields' => [['handle' => 'icon', 'field' => ['type' => 'text']]]],
                ],
            ],
        ]]);

        $this->assertSame('list › box', $rows['icon']['parent']);
        $this->assertArrayNotHasKey('parent', $rows['list']);
    }

    public function test_the_same_handle_in_two_sets_is_listed_once_per_place(): void
    {
        $rows = $this->walk([[
            'handle' => 'list',
            'field' => [
                'type' => 'replicator',
                'sets' => [
                    'box' => ['fields' => [['handle' => 'title', 'field' => ['type' => 'text']]]],
                    'card' => ['fields' => [['handle' => 'title', 'field' => ['type' => 'text']]]],
                ],
            ],
        ]]);

                $titles = array_filter(Rows::walk([[
            'handle' => 'list',
            'field' => [
                'type' => 'replicator',
                'sets' => [
                    'box' => ['fields' => [['handle' => 'title', 'field' => ['type' => 'text']]]],
                    'card' => ['fields' => [['handle' => 'title', 'field' => ['type' => 'text']]]],
                ],
            ],
        ]]), fn ($row) => $row['var'] === 'title');

        $this->assertCount(2, $titles);
        $this->assertSame(
            ['list › box', 'list › card'],
            array_values(array_map(fn ($row) => $row['parent'], $titles))
        );
    }

    public function test_values_are_shortened_to_one_row(): void
    {
        $this->assertSame('true', DataVars::preview(true));
        $this->assertSame('3 ×', DataVars::preview([1, 2, 3]));
        $this->assertSame('a b', DataVars::preview("a \n b"));
        $this->assertSame(61, mb_strlen(DataVars::preview(str_repeat('x', 200))));
    }

    public function test_system_variables_carry_this_site(): void
    {
        $names = array_column(DataVars::systemVars(), 'var');

        $this->assertContains('site:name', $names);
        $this->assertContains('config:app:name', $names);
        $this->assertContains('current_url', $names);
    }
}
