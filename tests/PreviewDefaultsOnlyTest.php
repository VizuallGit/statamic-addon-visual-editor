<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SectionDefaults;
use MarioHamann\StatamicVisualEditor\SetPreview\Targets;
use Statamic\Facades\Entry;
use Statamic\Facades\Fieldset;
use Statamic\Fields\Fieldset as FieldsetModel;

/**
 * What a section type's preview photographs: its defaults — what dragging it
 * in gives you — never the section as it stands on some page.
 */
class PreviewDefaultsOnlyTest extends TestCase
{
    protected function candidates(string $handle, array $override = []): array
    {
        return (new \ReflectionMethod(Targets::class, 'candidates'))->invoke(null, $handle, $override, 'main > *');
    }

    protected function setUp(): void
    {
        parent::setUp();

        // A page that uses the section with its own content: the picture must
        // not be of this. The fixtures' `pages` collection is reused, not saved
        // over — the fixtures are shared with every other test.
        Entry::make()->id('preview-defaults-page')->collection('pages')->slug('preview-defaults-page')->data([
            'title' => 'Page',
            'page_sections' => [
                ['id' => 'sec-on-page', 'type' => 'intro/style_1', 'enabled' => true, 'title' => 'Somebody else\'s text'],
            ],
        ])->published(true)->save();

        Fieldset::shouldReceive('find')->with('page_sections')->andReturn(
            (new FieldsetModel)->setHandle('page_sections')->setContents([
                'fields' => [[
                    'handle' => 'page_sections',
                    'field' => [
                        'type' => 'replicator',
                        'sets' => ['main' => ['sets' => [
                            'intro/style_1' => [
                                'display' => 'Intro',
                                'fields' => [
                                    ['handle' => 'title', 'field' => ['type' => 'text', 'default' => 'Indtast overskrift her…']],
                                    ['handle' => 'video', 'field' => ['type' => 'text']],
                                ],
                            ],
                            'blank' => [
                                'display' => 'Blank',
                                'fields' => [['handle' => 'text', 'field' => ['type' => 'text']]],
                            ],
                        ]]],
                    ],
                ]],
            ])
        );
    }

    protected function tearDown(): void
    {
        Entry::find('preview-defaults-page')?->delete();

        parent::tearDown();
    }

    public function test_a_section_used_on_a_page_is_still_photographed_with_its_defaults(): void
    {
        $candidates = $this->candidates('intro/style_1');

        $this->assertCount(1, $candidates);
        $this->assertSame('defaults', $candidates[0]['source']);
        $this->assertSame(SectionDefaults::for('intro/style_1'), $candidates[0]['data']);
        $this->assertSame('Indtast overskrift her…', $candidates[0]['data']['title']);
        $this->assertStringContainsString('section-defaults-preview', $candidates[0]['url']);
    }

    public function test_a_section_without_defaults_is_photographed_as_it_is_inserted(): void
    {
        // The template may well draw placeholders for empty fields; the browser
        // decides whether there is anything to see, not a guess beforehand.
        $candidates = $this->candidates('blank');

        $this->assertCount(1, $candidates);
        $this->assertSame('defaults', $candidates[0]['source']);
    }

    public function test_an_override_still_wins(): void
    {
        $candidates = $this->candidates('intro/style_1', ['url' => 'https://example.com/x']);

        $this->assertCount(1, $candidates);
        $this->assertSame('override', $candidates[0]['source']);
    }
}
