<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Support\Facades\File;
use MarioHamann\StatamicVisualEditor\AiChat\HouseStyle;
use MarioHamann\StatamicVisualEditor\AiChat\Registration;
use MarioHamann\StatamicVisualEditor\AiChat\WriteScope;
use MarioHamann\StatamicVisualEditor\SectionTemplate;
use Statamic\Facades\YAML;

/**
 * What an AI run may write, and the new section it may add — against a small
 * site: a page builder with a set whose fieldset folder is not its handle's
 * (as on the real site), the site's CSS, a header and a shared fieldset.
 */
class AiWriteScopeTest extends TestCase
{
    /** Files this test writes, with what was there before (null: nothing). */
    private array $before = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->file('resources/fieldsets/page_sections.yaml', YAML::dump([
            'title' => 'Page sections',
            'fields' => [[
                'handle' => 'page_sections',
                'field' => [
                    'type' => 'replicator',
                    'sets' => [
                        'featured_sections' => ['display' => 'Featured', 'sets' => [
                            'featured_section/style_1' => ['display' => 'Featured 1', 'fields' => [['import' => 'featured_sections.style_1']]],
                        ]],
                        'hero' => ['display' => 'Hero', 'sets' => [
                            'hero/style_1' => ['display' => 'Hero 1', 'fields' => [['import' => 'hero.style_1']]],
                        ]],
                    ],
                ],
            ]],
        ]));
        $this->file('resources/fieldsets/featured_sections/style_1.yaml', "title: Featured 1\nfields: []\n");
        $this->file('resources/fieldsets/hero/style_1.yaml', "title: Hero 1\nfields: []\n");
        $this->file('resources/fieldsets/links.yaml', "title: Links\nfields: []\n");
        $this->file('resources/views/partials/page_sections/featured_section/style_1.antlers.html', "<section>featured</section>\n");
        $this->file('resources/views/partials/page_sections/hero/style_1.antlers.html', "<section>hero</section>\n");
        $this->file('resources/views/partials/page_sections/hero/style_1.old.antlers.html', "<section>old hero</section>\n");
        $this->file('resources/views/partials/site_head.antlers.html', "<header></header>\n");
        $this->file('resources/css/site.css', "body { color: black; }\n");

        // Section types start locked in the dock; these two are opened, as
        // the designer does with the lock icon.
        foreach (['featured_section/style_1', 'hero/style_1'] as $handle) {
            SectionTemplate::setLocked(base_path("resources/views/partials/page_sections/{$handle}.antlers.html"), false);
        }
    }

    protected function tearDown(): void
    {
        foreach (array_reverse($this->before, true) as $rel => $contents) {
            $contents === null ? File::delete(base_path($rel)) : File::put(base_path($rel), $contents);
        }

        foreach (['resources/views/partials/page_sections/hero/style_9.antlers.html', 'resources/fieldsets/hero/style_9.yaml'] as $rel) {
            File::delete(base_path($rel));
        }

        parent::tearDown();
    }

    private function file(string $rel, string $contents): void
    {
        $path = base_path($rel);

        if (! array_key_exists($rel, $this->before)) {
            $this->before[$rel] = is_file($path) ? (string) file_get_contents($path) : null;
        }

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $contents);
    }

    public function test_write_mode_opens_nothing(): void
    {
        $this->assertNull(WriteScope::for('write'));
    }

    public function test_build_mode_opens_the_site_s_content_and_theme_without_naming_a_file(): void
    {
        $scope = WriteScope::for('build');

        $this->assertSame(['content/', 'resources/', 'public/'], $scope['open']);
        $this->assertSame('public/assets/', $scope['assets']);
        $this->assertSame('resources/visual-editor/ai-rules.md', $scope['rules']);
    }

    public function test_secrets_built_files_and_the_page_builder_s_list_stay_closed(): void
    {
        $closed = WriteScope::for('build')['closed'];

        $this->assertContains('resources/addons/', $closed);
        $this->assertContains('resources/fieldsets/page_sections.yaml', $closed);
        $this->assertContains('public/build/', $closed);
        $this->assertContains('public/vendor/', $closed);
    }

    public function test_a_new_section_is_added_to_its_group_and_every_other_set_stays(): void
    {
        $this->file('resources/views/partials/page_sections/hero/style_9.antlers.html', "<section>nine</section>\n");
        $this->file('resources/fieldsets/hero/style_9.yaml', "title: Hero 9\nfields: []\n");

        $added = Registration::apply([['group' => 'hero', 'handle' => 'hero/style_9', 'display' => 'Hero 9', 'fieldset' => 'hero.style_9']]);

        $this->assertSame(['hero/style_9'], $added);

        $sets = YAML::parse((string) file_get_contents(base_path('resources/fieldsets/page_sections.yaml')))['fields'][0]['field']['sets'];

        $this->assertSame(['display' => 'Hero 9', 'fields' => [['import' => 'hero.style_9']]], $sets['hero']['sets']['hero/style_9']);
        $this->assertArrayHasKey('hero/style_1', $sets['hero']['sets']);
        $this->assertArrayHasKey('featured_section/style_1', $sets['featured_sections']['sets']);
    }

    public function test_a_registration_is_refused_without_its_files_its_group_or_a_free_handle(): void
    {
        $this->file('resources/views/partials/page_sections/hero/style_9.antlers.html', "<section>nine</section>\n");

        $this->assertSame([], Registration::apply([
            // No fieldset on disk.
            ['group' => 'hero', 'handle' => 'hero/style_9', 'display' => 'Hero 9', 'fieldset' => 'hero.style_9'],
            // No such group.
            ['group' => 'nope', 'handle' => 'hero/style_9', 'display' => 'Hero 9', 'fieldset' => 'hero.style_1'],
            // No partial.
            ['group' => 'hero', 'handle' => 'hero/style_8', 'display' => 'Hero 8', 'fieldset' => 'hero.style_1'],
            // Taken.
            ['group' => 'hero', 'handle' => 'hero/style_1', 'display' => 'Hero 1 again', 'fieldset' => 'hero.style_1'],
        ]));
    }

    public function test_the_house_style_is_the_newest_sections_without_old_copies_or_the_selected_one(): void
    {
        touch(base_path('resources/views/partials/page_sections/featured_section/style_1.antlers.html'), time() - 100);
        touch(base_path('resources/views/partials/page_sections/hero/style_1.antlers.html'), time());
        touch(base_path('resources/views/partials/page_sections/hero/style_1.old.antlers.html'), time() + 100);

        $newest = HouseStyle::newest();

        $this->assertSame('hero/style_1', $newest[0]['handle']);
        $this->assertSame('resources/fieldsets/hero/style_1.yaml', $newest[0]['fieldset']);
        $this->assertNotContains('hero/style_1.old', array_column($newest, 'handle'));
        $this->assertNotContains('hero/style_1', array_column(HouseStyle::newest('hero/style_1'), 'handle'));
        $this->assertStringContainsString("<section>hero</section>", HouseStyle::prompt());
    }
}
