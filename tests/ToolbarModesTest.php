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

    public function test_unsaved_lists_are_the_defaults_with_the_dock_in_build_only(): void
    {
        $modes = ToolbarModes::all();

        $this->assertSame(ToolbarModes::DEFAULTS['content'], $modes['content']);
        $this->assertNotContains('code', $modes['content']);
        $this->assertContains('code', $modes['build']);
        $this->assertSame(ToolbarModes::tools([...ToolbarModes::DEFAULTS['build'], 'code']), $modes['build']);
    }

    public function test_saved_lists_win_cleaned_and_the_dock_put_where_it_belongs(): void
    {
        config([
            'statamic-visual-editor.features.toolbar_preset_editor_tools' => ['ai', 'code', 'bogus', 'ai', 'pages'],
            'statamic-visual-editor.features.toolbar_preset_developer_tools' => ['theme', 'sections'],
        ]);
        Features::flush();

        $this->assertSame([
            'content' => ['pages', 'ai'],
            'build' => ['sections', 'code', 'theme'],
        ], ToolbarModes::all());
    }

    public function test_nothing_ticked_is_nothing_but_the_dock_in_build(): void
    {
        config([
            'statamic-visual-editor.features.toolbar_preset_editor_tools' => [],
            'statamic-visual-editor.features.toolbar_preset_developer_tools' => [],
        ]);
        Features::flush();

        $this->assertSame(['content' => [], 'build' => ['code']], ToolbarModes::all());
    }

    public function test_nobody_gets_the_edit_link_without_a_user(): void
    {
        $this->assertNull(ToolbarModes::settingsUrl());
    }
}
