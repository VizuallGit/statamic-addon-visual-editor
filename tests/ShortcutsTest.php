<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Fieldtypes\ShortcutFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\ShortcutsFieldtype;
use MarioHamann\StatamicVisualEditor\Http\Controllers\ChromePrefsController;
use MarioHamann\StatamicVisualEditor\Shortcuts;
use MarioHamann\StatamicVisualEditor\ToolbarModes;

/**
 * The keyboard shortcuts' PHP half: the built-in list (its only copy), the
 * grammar that validates what is saved, the locked ones, and the site's layer
 * as the Control Panel gets it. Which shortcut wins between the layers is the
 * browser's (lib/shortcuts.js, tests/js/shortcuts.test.js).
 */
class ShortcutsTest extends TestCase
{
    protected function tearDown(): void
    {
        config(['statamic-visual-editor.features.shortcuts' => null]);

        parent::tearDown();
    }

    public function test_normalize_agrees_with_every_case_the_browser_is_held_to(): void
    {
        $cases = json_decode(file_get_contents(__DIR__.'/js/fixtures/shortcut-combos.json'), true);

        $this->assertGreaterThan(20, count($cases));

        foreach ($cases as [$input, $expected]) {
            $this->assertSame($expected, Shortcuts::normalize($input), json_encode($input));
        }

        $this->assertSame('', Shortcuts::normalize(null));
        $this->assertSame('', Shortcuts::normalize(['mod+p']));
    }

    public function test_the_built_in_list_is_clean_one_action_per_shortcut_and_none_locked(): void
    {
        foreach (Shortcuts::DEFAULTS as $action => $combo) {
            $this->assertSame($combo, Shortcuts::normalize($combo), "{$action} is written as normalize writes it");
            $this->assertFalse(Shortcuts::isLocked($combo), "{$action} is not locked");
        }

        $this->assertSame(count(Shortcuts::DEFAULTS), count(array_unique(Shortcuts::DEFAULTS)), 'no shortcut twice');
        $this->assertSame(['size:laptop', 'size:tablet', 'size:mobile'], array_slice(array_keys(Shortcuts::DEFAULTS), 0, 3));
    }

    public function test_every_top_bar_tool_has_a_built_in_shortcut_and_a_name(): void
    {
        $tools = array_map(fn ($action) => substr($action, 5), Shortcuts::tools());

        $this->assertSame(['settings', ...ToolbarModes::TOOLS], $tools, 'Page settings, then every icon a mode can list');
        $this->assertSame($tools, array_keys(Shortcuts::LABELS));

        foreach (Shortcuts::labels() as $action => $label) {
            $this->assertStringNotContainsString('sve::messages', $label, "{$action} has a string");
        }
    }

    public function test_a_locked_shortcut_is_refused_however_it_is_written(): void
    {
        $this->assertTrue(Shortcuts::isLocked('mod+s'));
        $this->assertTrue(Shortcuts::isLocked('Shift+Mod+3'));
        $this->assertTrue(Shortcuts::isLocked('ctrl+s'));
        $this->assertFalse(Shortcuts::isLocked('mod+g'));
        $this->assertFalse(Shortcuts::isLocked('none'));

        $this->assertSame('mod+shift+3', Shortcuts::normalize('shift+mod+3'), 'it is a shortcut');
        $this->assertSame('', Shortcuts::clean('shift+mod+3'), 'but never one of ours');
        $this->assertSame('mod+g', Shortcuts::clean('Mod+G'));
        $this->assertSame('none', Shortcuts::clean('none'));
    }

    public function test_every_locked_shortcut_is_written_as_normalize_writes_it_or_is_no_shortcut_at_all(): void
    {
        foreach (Shortcuts::LOCKED as $combo) {
            $this->assertContains(Shortcuts::normalize($combo), [$combo, ''], $combo);
        }

        $this->assertSame(count(Shortcuts::LOCKED), count(array_unique(Shortcuts::LOCKED)));
    }

    public function test_the_sites_layer_is_the_setting_cleaned_tools_only_in_the_built_in_order(): void
    {
        config(['statamic-visual-editor.features.shortcuts' => [
            'tool:globals' => 'none',
            'tool:pages' => 'Alt+Mod+9',
            'tool:forms' => 'mod+s',
            'tool:bogus' => 'mod+1',
            'size:laptop' => 'mod+2',
            'tool:schema' => 'q',
        ]]);

        $this->assertSame(['tool:pages' => 'mod+alt+9', 'tool:globals' => 'none'], Shortcuts::site());

        config(['statamic-visual-editor.features.shortcuts' => 'mod+p']);

        $this->assertSame([], Shortcuts::site());
    }

    public function test_the_control_panel_gets_the_layers_the_locked_ones_and_the_names(): void
    {
        config(['statamic-visual-editor.features.shortcuts' => ['tool:pages' => 'mod+alt+9']]);

        $script = Shortcuts::forScript();

        $this->assertSame(['builtIn', 'site', 'locked', 'labels'], array_keys($script));
        $this->assertSame(Shortcuts::DEFAULTS, $script['builtIn']);
        $this->assertSame(['tool:pages' => 'mod+alt+9'], $script['site']);
        $this->assertSame(Shortcuts::LOCKED, $script['locked']);
        $this->assertSame(Shortcuts::tools(), array_keys($script['labels']));
        $this->assertSame('Pages', $script['labels']['tool:pages']);
    }

    public function test_the_settings_screen_lists_every_tool_with_its_name_and_built_in_shortcut(): void
    {
        $rows = Shortcuts::forFieldtype();

        $this->assertSame(Shortcuts::tools(), array_column($rows, 'action'));
        $this->assertSame(['action' => 'tool:settings', 'label' => 'Page settings', 'default' => 'mod+comma'], $rows[0]);
        $this->assertSame('mod+g', $rows[2]['default']);
    }

    public function test_the_fieldtypes_save_only_what_may_be_saved(): void
    {
        $one = new ShortcutFieldtype;

        $this->assertSame('mod+alt+w', $one->process('alt+mod+w'));
        $this->assertSame('none', $one->process('none'));
        $this->assertNull($one->process(''));
        $this->assertNull($one->process('mod+s'), 'locked');
        $this->assertNull($one->process('w'), 'not a shortcut');
        $this->assertSame('', $one->preProcess(null));
        $this->assertSame(['builtIn', 'locked', 'labels', 'sizes'], array_keys($one->preload()));

        $map = new ShortcutsFieldtype;

        $this->assertSame(['tool:pages' => 'mod+alt+9'], $map->process(['tool:pages' => 'alt+mod+9', 'size:laptop' => 'mod+1', 'tool:forms' => 'mod+w']));
        $this->assertNull($map->process([]));
        $this->assertNull($map->process(null));
        $this->assertSame([], $map->preProcess(null));
        $this->assertSame(['rows', 'builtIn', 'locked', 'sizes'], array_keys($map->preload()));
    }

    public function test_the_users_own_are_a_chrome_preference_on_both_sides(): void
    {
        $this->assertContains('sve-shortcuts', ChromePrefsController::KEYS);
        $this->assertMatchesRegularExpression(
            "/CHROME_KEYS = \[[^\]]*'sve-shortcuts'/s",
            file_get_contents(__DIR__.'/../resources/js/chrome-prefs.js')
        );
    }

    public function test_the_settings_screen_has_the_list_and_the_column_and_no_shortcut_in_a_yaml_default(): void
    {
        $yaml = file_get_contents(__DIR__.'/../resources/blueprints/settings.yaml');

        $this->assertStringContainsString('type: sve_shortcuts', $yaml);
        $this->assertStringContainsString('type: sve_shortcut', $yaml);

        foreach (Shortcuts::DEFAULTS as $combo) {
            $this->assertStringNotContainsString($combo, $yaml, 'the built-in list lives in Shortcuts::DEFAULTS only');
        }
    }
}
