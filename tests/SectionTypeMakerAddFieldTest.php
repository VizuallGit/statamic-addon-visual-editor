<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SectionTypeMaker;
use MarioHamann\StatamicVisualEditor\SectionTypeMaker\AddField;
use MarioHamann\StatamicVisualEditor\SectionTypeMaker\Names;
use Statamic\Facades\Fieldset;
use Statamic\Facades\YAML;

/**
 * "Editable in Edit Content": one field added to a section's fieldset, what
 * the element held as its default. The fieldset on disk is the truth here —
 * the repository memoises a fieldset for the request, and `save()` reads it
 * once more before writing, so `Fieldset::find` would answer with the old one.
 */
class SectionTypeMakerAddFieldTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Fieldset::make('page_sections')->setContents([
            'title' => 'Page sections',
            'fields' => [[
                'handle' => 'page_sections',
                'field' => [
                    'type' => 'replicator',
                    'sets' => [
                        'content' => ['display' => 'Content', 'sets' => [
                            'content/plain' => ['display' => 'Plain', 'fields' => [['import' => 'content.plain']]],
                            'content/prefixed' => ['display' => 'Prefixed', 'fields' => [['import' => 'content.plain', 'prefix' => 'hero_']]],
                            'content/grouped' => ['display' => 'Grouped', 'fields' => [['import' => 'content.grouped']]],
                            'content/inline' => ['display' => 'Inline', 'fields' => [['handle' => 'words', 'field' => ['type' => 'text']]]],
                        ]],
                    ],
                ],
            ]],
        ])->save();

        // Shared settings, imported whole by a section: the shape `common` has on the site.
        Fieldset::make('common.settings')->setContents([
            'title' => 'Settings',
            'fields' => [['handle' => 'heading', 'field' => ['type' => 'bard']]],
        ])->save();

        Fieldset::make('content.plain')->setContents([
            'title' => 'Plain',
            'fields' => [
                ['handle' => 'text', 'field' => ['type' => 'textarea']],
                ['import' => 'common.settings'],
            ],
        ])->save();

        Fieldset::make('content.grouped')->setContents([
            'title' => 'Grouped',
            'sections' => [
                ['display' => 'Content', 'fields' => [['handle' => 'text', 'field' => ['type' => 'textarea']]]],
                ['display' => 'Design', 'fields' => [['handle' => 'bg_color', 'field' => ['type' => 'select']]]],
            ],
        ])->save();
    }

    protected function tearDown(): void
    {
        foreach (['page_sections', 'common.settings', 'content.plain', 'content.grouped'] as $handle) {
            Fieldset::find($handle)?->delete();
        }

        parent::tearDown();
    }

    /** The fieldset as it is on disk. */
    protected function onDisk(string $folder, string $name): array
    {
        return YAML::file(Names::fieldsetPath($folder, $name))->parse();
    }

    public function test_the_field_joins_a_flat_fieldset_with_the_text_as_its_default(): void
    {
        $this->assertSame('intro', AddField::run('page_sections', 'content/plain', 'text', 'Intro', "Tom & Jerry's: a <br> line\nand {{ not a tag"));

        $fields = $this->onDisk('content', 'plain')['fields'];

        $this->assertSame(['handle' => 'text', 'field' => ['type' => 'textarea']], $fields[0]);
        $this->assertSame(['import' => 'common.settings'], $fields[1]);
        $this->assertSame([
            'handle' => 'intro',
            'field' => ['type' => 'text', 'display' => 'Intro', 'default' => "Tom & Jerry's: a <br> line\nand {{ not a tag"],
        ], $fields[2]);
        $this->assertStringNotContainsString('_visual_id', file_get_contents(Names::fieldsetPath('content', 'plain')));
    }

    public function test_the_field_joins_the_last_section_of_a_sectioned_fieldset(): void
    {
        $this->assertSame('intro', AddField::run('page_sections', 'content/grouped', 'textarea', 'Intro', 'Words'));

        $sections = $this->onDisk('content', 'grouped')['sections'];

        $this->assertCount(2, $sections);
        $this->assertSame(['text'], array_column($sections[0]['fields'], 'handle'));
        $this->assertSame(['bg_color', 'intro'], array_column($sections[1]['fields'], 'handle'));
        $this->assertSame('textarea', $sections[1]['fields'][1]['field']['type']);
    }

    public function test_a_name_the_fieldset_already_has_gets_a_number(): void
    {
        $this->assertSame('text_2', AddField::run('page_sections', 'content/plain', 'text', 'Text', 'More'));
        $this->assertSame('type_2', AddField::run('page_sections', 'content/plain', 'text', 'type', 'A row keeps its own type'));
    }

    /**
     * Statamic keys a section's fields by handle and the later wins
     * (`Fields::setItems`). A field named after one the fieldset imports would
     * stand in for it: every page's value in that field would be read through
     * the new field's type, and the imported field's own settings would be gone
     * from the form. Its name is taken as much as an inline field's.
     */
    public function test_a_name_an_imported_fieldset_has_gets_a_number_too(): void
    {
        $this->assertSame('heading_2', AddField::run('page_sections', 'content/plain', 'text', 'Heading', 'Hello'));

        $handles = array_column(array_filter($this->onDisk('content', 'plain')['fields'], fn ($row) => isset($row['handle'])), 'handle');

        $this->assertSame(['text', 'heading_2'], $handles);
    }

    public function test_a_set_declaring_its_fields_inline_has_no_fieldset_to_add_to(): void
    {
        $this->assertNull(AddField::run('page_sections', 'content/inline', 'text', 'Heading', 'Hello'));
    }

    public function test_an_unknown_set_makes_nothing(): void
    {
        $this->assertNull(AddField::run('page_sections', 'content/nope', 'text', 'Heading', 'Hello'));
        $this->assertNull(SectionTypeMaker::readFieldset('content.nope'));
    }
}
