<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SectionTypeMaker;

class SectionTypeMakerTest extends TestCase
{
    /**
     * A trimmed copy of a real site's page-builder groups — kept real because
     * every awkward case here is one this site actually has.
     */
    protected function sampleGroups(): array
    {
        return [
            // Every set agrees on the prefix, and the fieldset folder is the
            // same word.
            'custom_sections' => ['sets' => [
                'custom_section/style_1' => ['fields' => [['import' => 'custom_section.style_1']]],
                'custom_section/style_2' => ['fields' => [['import' => 'custom_section.style_2']]],
            ]],

            // The handle is singular, the fieldset folder is plural. Deriving
            // one from the other writes the fieldset where nothing looks.
            'featured_sections' => ['sets' => [
                'featured_section/style_1' => ['fields' => [['import' => 'featured_sections.style_1']]],
                'featured_section/style_2' => ['fields' => [['import' => 'featured_sections.style_2']]],
            ]],

            // An even split between two prefixes: neither speaks for the group.
            'content_sections' => ['sets' => [
                'content_section/style_1' => ['fields' => [['import' => 'content_section.style_1']]],
                'content_section/style_2' => ['fields' => [['import' => 'content_section.style_2']]],
                'media_textbox/style_1' => ['fields' => [['import' => 'media_textbox.style_1']]],
                'media_textbox/style_2' => ['fields' => [['import' => 'media_textbox.style_2']]],
            ]],

            // A grab-bag, including sets with no folder in the handle at all.
            'other_sections' => ['sets' => [
                'global_section' => ['fields' => [['import' => 'global_section']]],
                'testimonails/style_1' => ['fields' => [['import' => 'testimonials.style_1']]],
                'video_section/style_1' => ['fields' => [['import' => 'video_section.style_1']]],
                'top_banner/style_1' => ['fields' => [['import' => 'top_banner.style_1']]],
            ]],

            // One section, so it speaks for the whole group.
            'galleries' => ['sets' => [
                'gallery/style_1' => ['fields' => [['import' => 'gallery.style_1']]],
            ]],

            'empty_group' => ['sets' => []],
        ];
    }

    public function test_it_slugs_a_name(): void
    {
        $this->assertSame('alyssa', SectionTypeMaker::slug('Alyssa'));
        $this->assertSame('min_flotte_sektion', SectionTypeMaker::slug('Min Flotte Sektion'));
        $this->assertSame('taage_stoev', SectionTypeMaker::slug('Tåge & Støv'));
        $this->assertSame('hero_2', SectionTypeMaker::slug('Hero 2'));
    }

    public function test_it_refuses_a_name_with_nothing_usable_in_it(): void
    {
        $this->assertNull(SectionTypeMaker::slug('???'));
        $this->assertNull(SectionTypeMaker::slug('   '));

        // Has to start with a letter: a file called `2.yaml` sorts and reads
        // like a mistake, and a handle starting with a digit is one.
        $this->assertNull(SectionTypeMaker::slug('2 spalter'));
    }

    public function test_the_template_folder_follows_the_set_handles(): void
    {
        $groups = $this->sampleGroups();

        $this->assertSame('custom_section', SectionTypeMaker::viewFolderForGroup($groups, 'custom_sections'));
        $this->assertSame('featured_section', SectionTypeMaker::viewFolderForGroup($groups, 'featured_sections'));
        $this->assertSame('gallery', SectionTypeMaker::viewFolderForGroup($groups, 'galleries'));
    }

    public function test_a_group_that_does_not_agree_falls_back_to_its_own_name(): void
    {
        $groups = $this->sampleGroups();

        // Two prefixes, two each — and `content_section` is where a new content
        // section belongs anyway.
        $this->assertSame('content_section', SectionTypeMaker::viewFolderForGroup($groups, 'content_sections'));

        // The grab-bag must not adopt whichever stranger happens to be first.
        $this->assertSame('other_section', SectionTypeMaker::viewFolderForGroup($groups, 'other_sections'));

        $this->assertSame('empty_group', SectionTypeMaker::viewFolderForGroup($groups, 'empty_group'));
    }

    /**
     * The case that started this: `featured_section/style_1` imports
     * `featured_sections.style_1`. Singular in the handle, plural in the
     * fieldset, and the only way to know is to read the imports.
     */
    public function test_the_fieldset_folder_is_read_from_the_imports_not_the_handles(): void
    {
        $groups = $this->sampleGroups();

        $this->assertSame('featured_sections', SectionTypeMaker::fieldsetFolderForGroup($groups, 'featured_sections'));
        $this->assertSame('custom_section', SectionTypeMaker::fieldsetFolderForGroup($groups, 'custom_sections'));
        $this->assertSame('gallery', SectionTypeMaker::fieldsetFolderForGroup($groups, 'galleries'));
    }

    public function test_the_fieldset_folder_falls_back_to_the_template_folder(): void
    {
        $groups = $this->sampleGroups();

        $this->assertSame('content_section', SectionTypeMaker::fieldsetFolderForGroup($groups, 'content_sections'));
        $this->assertSame('other_section', SectionTypeMaker::fieldsetFolderForGroup($groups, 'other_sections'));
        $this->assertSame('empty_group', SectionTypeMaker::fieldsetFolderForGroup($groups, 'empty_group'));
    }

    public function test_it_steps_past_a_name_already_taken_by_a_set(): void
    {
        $groups = $this->sampleGroups();

        $this->assertSame(
            'style_3',
            SectionTypeMaker::freeName($groups, 'custom_section', 'custom_section', 'style_3')
        );

        // `custom_section/style_1` is registered, so the next free one is used
        // rather than a set quietly overwritten.
        $this->assertSame(
            'style_1_2',
            SectionTypeMaker::freeName($groups, 'custom_section', 'custom_section', 'style_1')
        );
    }

    public function test_the_scaffold_carries_what_live_preview_needs(): void
    {
        $html = SectionTypeMaker::scaffold();

        // Without these three the section renders but cannot be selected,
        // scoped or dragged — and nothing in the file says why.
        $this->assertStringContainsString('id="id-{{ id }}"', $html);
        $this->assertStringContainsString('{{ _class }}', $html);
        $this->assertStringContainsString('visual_edit', $html);
    }

    /** The site's `common` fieldset, cut down to the handles the scaffold looks for. */
    protected function commonFields(array $except = []): array
    {
        $fields = [];

        foreach (['content_tab', 'style_tab', 'colors_tab', 'spacing_tab', 'section_spacing', 'gap'] as $handle) {
            if (! in_array($handle, $except, true)) {
                $fields[] = ['handle' => $handle, 'field' => ['type' => 'tab']];
            }
        }

        return $fields;
    }

    public function test_a_new_section_starts_with_the_sites_content_and_style_tabs(): void
    {
        $fields = SectionTypeMaker::startingFields($this->commonFields(), true);

        // Content first, then Style with Colors and Spacing inside it — the
        // order every section in the kit has, so the panel reads the same.
        $this->assertSame(
            ['content_tab', 'style_tab', 'colors_tab', 'bg_color', 'spacing_tab', 'padding'],
            array_column($fields, 'handle')
        );

        // Imports, not copies: the shared tab is the one source.
        $this->assertSame('common.content_tab', $fields[0]['field']);
        $this->assertSame('common.style_tab', $fields[1]['field']);
        $this->assertSame('common.colors_tab', $fields[2]['field']);
        $this->assertSame('theme_color_picker', $fields[3]['field']['type']);
        $this->assertSame('common.spacing_tab', $fields[4]['field']);
        $this->assertSame('common.section_spacing', $fields[5]['field']);
        $this->assertTrue($fields[5]['config']['sve_responsive']);
    }

    public function test_a_site_without_the_shared_tabs_gets_an_empty_fieldset(): void
    {
        $this->assertSame([], SectionTypeMaker::startingFields([], true));
        $this->assertSame([], SectionTypeMaker::startingFields($this->commonFields(['style_tab']), true));
        $this->assertSame([], SectionTypeMaker::startingFields($this->commonFields(['content_tab']), true));
    }

    public function test_colors_are_only_offered_where_the_picker_is_installed(): void
    {
        $handles = array_column(SectionTypeMaker::startingFields($this->commonFields(), false), 'handle');

        $this->assertSame(['content_tab', 'style_tab', 'spacing_tab', 'padding'], $handles);

        $handles = array_column(SectionTypeMaker::startingFields($this->commonFields(['colors_tab']), true), 'handle');

        $this->assertSame(['content_tab', 'style_tab', 'spacing_tab', 'padding'], $handles);
    }

    public function test_spacing_needs_both_the_tab_and_the_field(): void
    {
        $handles = array_column(SectionTypeMaker::startingFields($this->commonFields(['section_spacing']), true), 'handle');

        $this->assertSame(['content_tab', 'style_tab', 'colors_tab', 'bg_color'], $handles);
    }

    public function test_a_styled_section_reads_its_style_fields_from_the_first_render(): void
    {
        $html = SectionTypeMaker::scaffold(true);

        $this->assertStringContainsString('id="id-{{ id }}"', $html);
        $this->assertStringContainsString('{{ style_push }}', $html);
        $this->assertStringContainsString('{{ responsive_css }}', $html);
        $this->assertStringContainsString('background-color: {{ bg_color }};', $html);

        // An empty fieldset gets the bare section as before.
        $this->assertStringNotContainsString('style_push', SectionTypeMaker::scaffold(false));
        $this->assertStringNotContainsString('style_push', SectionTypeMaker::scaffold());
    }

    public function test_the_static_scaffold_is_a_section_with_nothing_to_fill_in(): void
    {
        $html = SectionTypeMaker::staticScaffold();

        // The same root every section has — outlined, scoped and draggable in
        // Live Preview — and unlocked from the first line: markup is all it
        // will ever hold, and the dock is where it is written.
        $this->assertStringStartsWith('{{# sve-unlocked #}}', $html);
        $this->assertStringContainsString('id="id-{{ id }}"', $html);
        $this->assertStringContainsString('{{ _class }}', $html);
        $this->assertStringContainsString('visual_edit', $html);
        $this->assertStringContainsString('section_orderable="true"', $html);
    }
}
