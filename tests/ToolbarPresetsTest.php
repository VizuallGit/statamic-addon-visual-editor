<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\ToolbarPresets;
use Symfony\Component\Yaml\Yaml;

class ToolbarPresetsTest extends TestCase
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

    public function test_the_settings_screen_shows_the_same_defaults_as_the_code(): void
    {
        $fields = $this->settingsFields();

        foreach (ToolbarPresets::DEFAULTS as $id => $default) {
            $tools = $fields["toolbar_preset_{$id}_tools"];

            $this->assertSame(ToolbarPresets::TOOLS, array_keys($tools['options']), $id);
            $this->assertSame($default['tools'], $tools['default'], $id);
            $this->assertSame($default['dock'], $fields["toolbar_preset_{$id}_dock"]['default'], $id);
        }
    }

    public function test_unsaved_presets_are_the_defaults(): void
    {
        $this->assertSame([
            ['id' => 'developer', 'tools' => ToolbarPresets::TOOLS, 'dock' => true],
            ['id' => 'editor', 'tools' => ToolbarPresets::DEFAULTS['editor']['tools'], 'dock' => false],
        ], ToolbarPresets::all());
    }

    public function test_saved_presets_win_and_are_cleaned(): void
    {
        config([
            'statamic-visual-editor.features.toolbar_preset_developer_tools' => ['theme', 'code', 'bogus', 'code', 'sections'],
            'statamic-visual-editor.features.toolbar_preset_developer_dock' => false,
            'statamic-visual-editor.features.toolbar_preset_editor_tools' => [],
            'statamic-visual-editor.features.toolbar_preset_editor_dock' => true,
        ]);
        Features::flush();

        $this->assertSame([
            ['id' => 'developer', 'tools' => ['sections', 'code', 'theme'], 'dock' => false],
            ['id' => 'editor', 'tools' => [], 'dock' => true],
        ], ToolbarPresets::all());
    }

    public function test_nobody_gets_the_edit_link_without_a_user(): void
    {
        $this->assertNull(ToolbarPresets::settingsUrl());
    }
}
