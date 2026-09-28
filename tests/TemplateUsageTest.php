<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\TemplateUsage;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;

/**
 * Who is drawn with a template, and which template draws an entry — Statamic's
 * own rule: the entry's `template:`, else its collection's, `default` when the
 * collection names none.
 */
class TemplateUsageTest extends TestCase
{
    private const HANDLES = ['usage_people', 'usage_services', 'usage_pages'];

    protected function setUp(): void
    {
        parent::setUp();

        Collection::make('usage_people')->title('People')->save();
        Collection::make('usage_services')->title('Services')->template('usage_services/show')->save();
        Collection::make('usage_pages')->title('Loose pages')->routes('/{slug}')->save();
    }

    protected function tearDown(): void
    {
        foreach (self::HANDLES as $handle) {
            foreach (Entry::query()->where('collection', $handle)->get() as $entry) {
                $entry->delete();
            }

            // Written to the fixture site; nothing else clears them.
            Collection::findByHandle($handle)?->delete();
        }

        parent::tearDown();
    }

    public function test_default_is_used_by_every_collection_that_names_no_template(): void
    {
        $usage = TemplateUsage::of('default');

        $names = array_column($usage['used_by'], 'name');

        $this->assertContains('People', $names);
        $this->assertContains('Loose pages', $names);
        $this->assertNotContains('Services', $names);
        $this->assertFalse($usage['everything']);
        // The Default page card on the board.
        $this->assertSame(['handle' => '_site', 'slot' => 'default'], $usage['open']);
        $this->assertSame(__('sve::messages.template_board_slot_default'), $usage['name']);
    }

    public function test_a_collections_own_show_is_used_by_it_alone_and_opens_its_card(): void
    {
        $usage = TemplateUsage::of('usage_services/show');

        $this->assertSame(['Services'], array_column($usage['used_by'], 'name'));
        // A collection opens its own listing, in the Live Preview drawer.
        $this->assertSame('collection', $usage['used_by'][0]['kind']);
        $this->assertSame(Collection::findByHandle('usage_services')->showUrl(), $usage['used_by'][0]['url']);
        $this->assertSame(['handle' => 'usage_services', 'slot' => 'show'], $usage['open']);
        $this->assertSame('Services · '.__('sve::messages.template_board_slot_show'), $usage['name']);
    }

    public function test_the_sections_fields_are_those_of_the_pages_drawn_with_it(): void
    {
        \Statamic\Facades\Blueprint::make('usage_page')->setNamespace('collections.usage_pages')->setContents([
            'tabs' => ['main' => ['sections' => [['fields' => [
                ['handle' => 'page_sections', 'field' => ['type' => 'replicator', 'sets' => []]],
            ]]]]],
        ])->save();

        try {
            $this->assertContains('page_sections', TemplateUsage::of('default')['sections_fields']);
            // Services are not built from sections: nothing for a loop to go over.
            $this->assertSame([], TemplateUsage::of('usage_services/show')['sections_fields']);
        } finally {
            \Statamic\Facades\Blueprint::find('collections.usage_pages.usage_page')?->delete();
        }
    }

    public function test_the_layout_frames_everything(): void
    {
        $usage = TemplateUsage::of('layout');

        $this->assertTrue($usage['everything']);
        $this->assertSame([], $usage['used_by']);
    }

    public function test_a_page_that_picks_a_template_itself_is_named(): void
    {
        $page = Entry::make()->collection('usage_pages')->slug('search')
            ->data(['title' => 'Søgeresultater', 'template' => 'search']);
        $page->save();

        $usedBy = TemplateUsage::of('search')['used_by'];

        $this->assertSame(['Søgeresultater'], array_column($usedBy, 'name'));
        // A page opens itself.
        $this->assertSame('page', $usedBy[0]['kind']);
        $this->assertSame($page->editUrl(), $usedBy[0]['url']);
    }

    public function test_an_entry_is_drawn_by_its_own_template_else_its_collections(): void
    {
        $person = Entry::make()->collection('usage_people')->slug('jens')->data(['title' => 'Jens']);
        $service = Entry::make()->collection('usage_services')->slug('seo')->data(['title' => 'SEO']);

        $this->assertSame('default', TemplateUsage::forEntry($person)['view']);
        $this->assertSame('usage_services/show', TemplateUsage::forEntry($service)['view']);
        $this->assertNull(TemplateUsage::forEntry(null));
    }

    public function test_a_view_the_board_draws_no_card_for_is_named_not_opened(): void
    {
        $usage = TemplateUsage::of('skabelon_sections');

        $this->assertNull($usage['open']);
        $this->assertSame('skabelon_sections', $usage['name']);
    }

    public function test_a_guest_is_not_told(): void
    {
        $this->getJson('/!/sve/template-usage?view=default')->assertStatus(403);
    }
}
