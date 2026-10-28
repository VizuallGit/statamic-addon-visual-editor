<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\ToolbarModes;
use Symfony\Component\Yaml\Yaml;

class ToolbarModesTest extends TestCase
{
    /** @return array<string, array<string, mixed>> handle → field */
    protected function settingsFields(): array
    {
        $blueprint = Yaml::parseFile(__DIR__.'/../resources/blueprints/settings.yaml');
        $out = [];

        foreach ($blueprint['tabs'] as $tab) {
            foreach ($tab['sections'] as $section) {
                foreach ($section['fields'] ?? [] as $row) {
                    $out[$row['handle']] = $row['field'];
                }
            }
        }

        return $out;
    }

    public function test_the_settings_screen_shows_the_same_lists_and_defaults_as_the_code(): void
    {
        $fields = $this->settingsFields();
        $ticks = array_values(array_diff(ToolbarModes::TOOLS, [ToolbarModes::DOCK]));

        foreach (ToolbarModes::SETTINGS as $mode => $handle) {
            $this->assertSame($ticks, array_keys($fields[$handle]['options']), "{$mode}: every icon but the dock");
            $this->assertSame(ToolbarModes::DEFAULTS[$mode], $fields[$handle]['default'], $mode);
        }

        $this->assertSame('equals true', $fields[ToolbarModes::SETTINGS['build']]['if']['build_mode'] ?? null, 'Build’s list only shows with Build on');
        $this->assertArrayNotHasKey('toolbar_preset_developer_dock', $fields);
        $this->assertArrayNotHasKey('toolbar_preset_editor_panes', $fields);
    }

    public function test_build_has_a_who_list_and_the_dock_has_none_of_its_own(): void
    {
        $fields = $this->settingsFields();

        $this->assertSame('toolbar_access', $fields['build_mode_access']['type']);
        $this->assertSame('build_mode', $fields['build_mode_access']['tool']);
        $this->assertArrayNotHasKey('template_dock_access', $fields);
    }

    public function test_unsaved_lists_are_the_defaults_and_html_build_has_every_icon_but_the_dock(): void
    {
        $modes = ToolbarModes::all();

        $this->assertSame(ToolbarModes::DEFAULTS['content'], $modes['content']);
        $this->assertSame(ToolbarModes::DEFAULTS['build'], $modes['build']);
        $this->assertSame(array_values(array_diff(ToolbarModes::TOOLS, ['code'])), $modes['html']);

        foreach ($modes as $tools) {
            $this->assertNotContains('code', $tools, 'the dock comes with the mode, never as an icon');
        }
    }

    public function test_saved_lists_win_cleaned_and_the_dock_on_none(): void
    {
        config([
            'statamic-visual-editor.features.toolbar_preset_editor_tools' => ['ai', 'code', 'bogus', 'ai', 'pages'],
            'statamic-visual-editor.features.toolbar_preset_developer_tools' => ['theme', 'sections'],
        ]);
        Features::flush();

        $modes = ToolbarModes::all();

        $this->assertSame(['pages', 'ai'], $modes['content']);
        $this->assertSame(['sections', 'theme'], $modes['build']);
    }

    public function test_nothing_ticked_is_nothing_and_html_build_keeps_every_icon(): void
    {
        config([
            'statamic-visual-editor.features.toolbar_preset_editor_tools' => [],
            'statamic-visual-editor.features.toolbar_preset_developer_tools' => [],
        ]);
        Features::flush();

        $modes = ToolbarModes::all();

        $this->assertSame([], $modes['content']);
        $this->assertSame([], $modes['build']);
        $this->assertSame(array_values(array_diff(ToolbarModes::TOOLS, ['code'])), $modes['html']);
    }

    public function test_nobody_gets_the_edit_link_without_a_user(): void
    {
        $this->assertNull(ToolbarModes::settingsUrl());
    }
}
