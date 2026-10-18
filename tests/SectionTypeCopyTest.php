<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Support\Facades\File;
use MarioHamann\StatamicVisualEditor\SectionTemplate\Locks;
use MarioHamann\StatamicVisualEditor\SectionTypeMaker;
use MarioHamann\StatamicVisualEditor\TailwindStore;
use Statamic\Facades\Fieldset;

/**
 * "Duplicate as a new section": a type of its own, made from one on the page —
 * its markup, baked Tailwind and own fieldset copied, registered right after it.
 */
class SectionTypeCopyTest extends TestCase
{
    protected string $views;

    protected string $tw;

    protected function setUp(): void
    {
        parent::setUp();

        $this->views = resource_path('views/partials/page_sections/content');
        $this->tw = sys_get_temp_dir().'/sve-copy-tw-'.uniqid();
        config(['statamic-visual-editor.tailwind.store' => $this->tw]);

        Fieldset::make('page_sections')->setContents([
            'title' => 'Page sections',
            'fields' => [[
                'handle' => 'page_sections',
                'field' => [
                    'type' => 'replicator',
                    'sets' => [
                        'content' => ['display' => 'Content', 'sets' => [
                            'content/two_column_text' => [
                                'display' => 'Two column text',
                                'icon' => 'lucide:columns-2',
                                'image' => 'content-two-column-text-1234.png',
                                'fields' => [['import' => 'content.two_column_text'], ['import' => 'common.settings']],
                            ],
                            'content/stats' => ['display' => 'Stats', 'fields' => [['import' => 'content.stats']]],
                        ]],
                    ],
                ],
            ]],
        ])->save();

        Fieldset::make('content.two_column_text')->setContents([
            'title' => 'Two column text',
            'fields' => [['handle' => 'text', 'field' => ['type' => 'textarea']]],
        ])->save();

        File::ensureDirectoryExists($this->views);
        file_put_contents($this->views.'/two_column_text.antlers.html', "{{# sve-locked #}}\n<section id=\"id-{{ id }}\" class=\"bg-gray-800\">{{ text }}</section>\n");
        File::ensureDirectoryExists($this->tw.'/content');
        file_put_contents($this->tw.'/content/two_column_text.css', '.bg-gray-800{background:#222}');
    }

    protected function tearDown(): void
    {
        foreach (['page_sections', 'content.two_column_text', 'content.two_column_text_copy', 'content.two_column_text_copy_2'] as $handle) {
            Fieldset::find($handle)?->delete();
        }

        File::deleteDirectory($this->views);
        File::deleteDirectory($this->tw);

        parent::tearDown();
    }

    public function test_the_copy_is_a_type_of_its_own_right_after_the_source(): void
    {
        $made = SectionTypeMaker::copy('page_sections', 'content/two_column_text', 'Two column text copy');

        $this->assertIsArray($made);
        $this->assertSame('content/two_column_text_copy', $made['handle']);
        $this->assertSame('Two column text copy', $made['display']);
        $this->assertSame('content', $made['group']);
        $this->assertSame('content.two_column_text_copy', $made['fieldset']);
        $this->assertSame('lucide:columns-2', $made['icon']);

        // The file is the truth: the repository memoises a fieldset for the request.
        $sets = SectionTypeMaker::readFieldset('page_sections')['fields'][0]['field']['sets']['content']['sets'];

        $this->assertSame(['content/two_column_text', 'content/two_column_text_copy', 'content/stats'], array_keys($sets));

        // Its own fieldset; the shared one stays shared. No preview image: the
        // copy's would be written over the source's.
        $this->assertSame([
            'display' => 'Two column text copy',
            'icon' => 'lucide:columns-2',
            'fields' => [['import' => 'content.two_column_text_copy'], ['import' => 'common.settings']],
        ], $sets['content/two_column_text_copy']);
        $this->assertSame('content-two-column-text-1234.png', $sets['content/two_column_text']['image']);
    }

    public function test_the_markup_fields_and_tailwind_are_copied_and_the_copy_is_unlocked(): void
    {
        SectionTypeMaker::copy('page_sections', 'content/two_column_text', 'Two column text copy');

        $fieldset = SectionTypeMaker::readFieldset('content.two_column_text_copy');
        $this->assertSame('Two column text copy', $fieldset['title']);
        $this->assertSame([['handle' => 'text', 'field' => ['type' => 'textarea']]], $fieldset['fields']);

        $markup = file_get_contents($this->views.'/two_column_text_copy.antlers.html');
        $this->assertStringContainsString('<section id="id-{{ id }}" class="bg-gray-800">{{ text }}</section>', $markup);
        $this->assertFalse(Locks::hasLockMarker($markup));
        $this->assertFalse(Locks::resolveLocked(Locks::hasLockMarker($markup), Locks::hasUnlockMarker($markup), 'content/two_column_text_copy'));

        // The source is as it was.
        $this->assertTrue(Locks::hasLockMarker(file_get_contents($this->views.'/two_column_text.antlers.html')));

        $this->assertSame('.bg-gray-800{background:#222}', TailwindStore::read('content/two_column_text_copy'));
    }

    public function test_a_second_copy_under_the_same_name_gets_a_number(): void
    {
        SectionTypeMaker::copy('page_sections', 'content/two_column_text', 'Two column text copy');
        $made = SectionTypeMaker::copy('page_sections', 'content/two_column_text', 'Two column text copy');

        $this->assertSame('content/two_column_text_copy_2', $made['handle']);
        $this->assertSame('content.two_column_text_copy_2', $made['fieldset']);
        $this->assertFileExists($this->views.'/two_column_text_copy_2.antlers.html');
    }

    public function test_it_says_why_it_made_nothing(): void
    {
        $this->assertSame('not_found', SectionTypeMaker::copy('page_sections', 'content/nope', 'Nope copy'));
        // Registered but with no markup on disk: nothing to copy from.
        $this->assertSame('not_found', SectionTypeMaker::copy('page_sections', 'content/stats', 'Stats copy'));
        $this->assertSame('bad_name', SectionTypeMaker::copy('page_sections', 'content/two_column_text', '???'));

        $sets = SectionTypeMaker::readFieldset('page_sections')['fields'][0]['field']['sets']['content']['sets'];
        $this->assertSame(['content/two_column_text', 'content/stats'], array_keys($sets));
    }
}
