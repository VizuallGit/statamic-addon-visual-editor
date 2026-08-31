<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Features;

class FeaturesTest extends TestCase
{
    public function test_collection_templates_are_off_when_nothing_has_turned_them_on(): void
    {
        $this->assertFalse(Features::enabled('collection_templates'));
    }

    public function test_template_dock_is_off_when_nothing_has_turned_it_on(): void
    {
        $this->assertFalse(Features::enabled('template_dock'));
    }

    public function test_tailwind_dock_is_off_when_nothing_has_turned_it_on(): void
    {
        $this->assertFalse(Features::enabled('tailwind_dock'));
    }

    public function test_ai_panel_is_off_when_nothing_has_turned_it_on(): void
    {
        $this->assertFalse(Features::enabled('ai_panel'));
    }

    public function test_comments_are_on_by_default(): void
    {
        $this->assertTrue(Features::enabled('comments'));
    }

    public function test_block_tree_is_on_by_default(): void
    {
        $this->assertTrue(Features::enabled('listview'));
    }

    public function test_html_tree_is_on_by_default(): void
    {
        $this->assertTrue(Features::enabled('html_tree'));
    }

    public function test_ai_panel_stays_off_when_the_config_key_is_missing(): void
    {
        $features = config('statamic-visual-editor.features', []);
        unset($features['ai_panel']);
        config(['statamic-visual-editor.features' => $features]);
        Features::flush();

        $this->assertFalse(Features::enabled('ai_panel'));
    }

    public function test_collection_templates_stay_off_when_the_config_key_is_missing(): void
    {
        $features = config('statamic-visual-editor.features', []);
        unset($features['collection_templates']);
        config(['statamic-visual-editor.features' => $features]);
        Features::flush();

        $this->assertFalse(Features::enabled('collection_templates'));
    }

    public function test_template_dock_stays_off_when_the_config_key_is_missing(): void
    {
        $features = config('statamic-visual-editor.features', []);
        unset($features['template_dock']);
        config(['statamic-visual-editor.features' => $features]);
        Features::flush();

        $this->assertFalse(Features::enabled('template_dock'));
    }

    public function test_tailwind_dock_stays_off_when_the_config_key_is_missing(): void
    {
        $features = config('statamic-visual-editor.features', []);
        unset($features['tailwind_dock']);
        config(['statamic-visual-editor.features' => $features]);
        Features::flush();

        $this->assertFalse(Features::enabled('tailwind_dock'));
    }

    public function test_ai_chat_is_not_ready_without_a_cursor_key(): void
    {
        config(['statamic-visual-editor.features.ai_panel' => true]);
        config(['statamic-visual-editor.ai.api_key' => '']);
        Features::flush();

        $this->assertFalse(\MarioHamann\StatamicVisualEditor\AiChat::ready());
        $this->assertFileExists(\MarioHamann\StatamicVisualEditor\CursorAgent::script());
    }

    public function test_target_files_point_at_the_selected_section(): void
    {
        @mkdir(resource_path('views/partials/page_sections/hero'), 0775, true);
        @mkdir(resource_path('fieldsets/hero'), 0775, true);
        file_put_contents(resource_path('views/partials/page_sections/hero/style_2.antlers.html'), "<section>hi</section>\n");
        file_put_contents(resource_path('fieldsets/hero/style_2.yaml'), "title: Hero\nfields: []\n");

        $target = \MarioHamann\StatamicVisualEditor\AiChat::targetFiles('hero/style_2');

        $this->assertSame('hero/style_2', $target['handle']);
        $this->assertSame('resources/views/partials/page_sections/hero/style_2.antlers.html', str_replace('\\', '/', (string) $target['antlers']));
        $this->assertSame('resources/fieldsets/hero/style_2.yaml', $target['fieldset']);

        $empty = \MarioHamann\StatamicVisualEditor\AiChat::targetFiles('');
        $this->assertSame('', $empty['handle']);
        $this->assertNull($empty['antlers']);
    }

    public function test_ai_rules_come_from_the_site_file_when_it_exists(): void
    {
        $dir = resource_path('visual-editor');
        @mkdir($dir, 0775, true);
        $file = $dir.'/ai-rules.md';
        file_put_contents($file, "1. Keep existing markup.\n");

        $this->assertSame($file, \MarioHamann\StatamicVisualEditor\AiRules::path());
        $this->assertStringContainsString('Keep existing markup', \MarioHamann\StatamicVisualEditor\AiRules::text());

        @unlink($file);
    }

    public function test_ai_rules_fall_back_to_the_addon_list(): void
    {
        $this->assertFileExists(\MarioHamann\StatamicVisualEditor\AiRules::defaultPath());
        $this->assertStringContainsString('Slet aldrig', \MarioHamann\StatamicVisualEditor\AiRules::text());
    }

    public function test_ai_chat_mode_defaults_to_write(): void
    {
        $this->assertSame('write', \MarioHamann\StatamicVisualEditor\AiChat::modeOf(null));
        $this->assertSame('write', \MarioHamann\StatamicVisualEditor\AiChat::modeOf('write'));
        $this->assertSame('write', \MarioHamann\StatamicVisualEditor\AiChat::modeOf('ask'));
        $this->assertSame('build', \MarioHamann\StatamicVisualEditor\AiChat::modeOf('Build'));
    }

    public function test_write_mode_instructions_forbid_file_writes(): void
    {
        $build = \MarioHamann\StatamicVisualEditor\AiChat::modeInstructions('build');
        $write = \MarioHamann\StatamicVisualEditor\AiChat::modeInstructions('write');

        $this->assertStringContainsString('WRITE MODE', $write);
        $this->assertStringContainsString('Do not write', $write);
        $this->assertStringContainsString('```html', $write);
        $this->assertStringContainsString('BUILD MODE', $build);
        $this->assertStringNotContainsString('Do not write', $build);
    }

    public function test_globals_picker_hides_header_and_footer_by_default(): void
    {
        config(['statamic-visual-editor.features.globals_picker' => null]);
        Features::flush();
        $sets = [
            ['handle' => 'theme_settings'],
            ['handle' => 'site_settings'],
            ['handle' => 'header'],
            ['handle' => 'footer'],
        ];

        $shown = Features::filterGlobalsPicker($sets);
        $handles = array_column($shown, 'handle');

        $this->assertSame(['theme_settings', 'site_settings'], $handles);
        $this->assertContains('header', Features::globalsPickerOffByDefault());
        $this->assertContains('footer', Features::globalsPickerOffByDefault());
        $this->assertNotContains('theme_settings', Features::globalsPickerOffByDefault());
    }

    public function test_globals_picker_respects_a_saved_list(): void
    {
        config(['statamic-visual-editor.features.globals_picker' => ['header', 'theme_settings']]);
        Features::flush();

        $shown = Features::filterGlobalsPicker([
            ['handle' => 'theme_settings'],
            ['handle' => 'site_settings'],
            ['handle' => 'header'],
        ]);

        $this->assertSame(['theme_settings', 'header'], array_column($shown, 'handle'));
    }

    public function test_globals_picker_empty_list_shows_none(): void
    {
        config(['statamic-visual-editor.features.globals_picker' => []]);
        Features::flush();

        $shown = Features::filterGlobalsPicker([
            ['handle' => 'theme_settings'],
            ['handle' => 'header'],
        ]);

        $this->assertSame([], $shown);
    }
}
