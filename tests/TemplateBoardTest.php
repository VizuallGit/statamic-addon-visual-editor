<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Stores;
use MarioHamann\StatamicVisualEditor\TemplateBoard;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;

class TemplateBoardTest extends TestCase
{
    protected function tearDown(): void
    {
        foreach (['board/index', 'board/show', 'board/index.blade'] as $view) {
            foreach (['antlers.html', 'blade.php'] as $extension) {
                @unlink(resource_path('views/'.$view.'.'.$extension));
            }
        }

        @rmdir(resource_path('views/board'));

        // The collections the tests make are written to the fixture site, and
        // nothing else clears them — without this they are left behind in the
        // repo and the next run starts from a different site than this one.
        foreach (['journal', 'ghosts'] as $handle) {
            Collection::findByHandle($handle)?->delete();
        }

        parent::tearDown();
    }

    protected function writeView(string $view, string $extension = 'antlers.html'): void
    {
        $path = resource_path('views/'.$view.'.'.$extension);

        @mkdir(dirname($path), 0755, true);
        file_put_contents($path, '<p>hi</p>');
    }

    public function test_a_card_exists_because_the_file_does(): void
    {
        $card = TemplateBoard::card('index', 'board/index', null);

        $this->assertFalse($card['exists'], 'nothing written yet');
        $this->assertNull($card['file']);

        $this->writeView('board/index');

        $card = TemplateBoard::card('index', 'board/index', null);

        $this->assertTrue($card['exists']);
        $this->assertSame('board/index.antlers.html', $card['file']);
    }

    public function test_a_blade_template_is_not_reported_missing(): void
    {
        $this->writeView('board/show', 'blade.php');

        $this->assertSame('board/show.blade.php', TemplateBoard::viewFile('board/show'));
    }

    public function test_view_paths_that_escape_the_views_folder_are_refused(): void
    {
        $this->assertFalse(TemplateBoard::safeView('../../.env'));
        $this->assertFalse(TemplateBoard::safeView('/etc/passwd'));
        $this->assertFalse(TemplateBoard::safeView(''));
        $this->assertNull(TemplateBoard::viewFile('../../.env'));

        $this->assertTrue(TemplateBoard::safeView('cases/show'));
    }

    public function test_a_collection_gets_exactly_one_index_and_one_show(): void
    {
        $row = TemplateBoard::sourceRow('cases', 'Cases', 'collection');

        $this->assertSame(['index', 'show'], array_column($row['cards'], 'slot'));
        $this->assertSame(['cases/index', 'cases/show'], array_column($row['cards'], 'view'));
    }

    public function test_the_site_row_leads_with_layout(): void
    {
        $slots = array_column(TemplateBoard::siteRow()['cards'], 'slot');

        $this->assertSame('layout', $slots[0], 'the frame comes first');
        $this->assertContains('error', $slots);
        $this->assertContains('search', $slots);
        $this->assertNotContains('index', $slots, 'the site row has no collection index');
    }

    public function test_the_editors_own_collections_get_no_row(): void
    {
        Collection::make('journal')->title('Journal')->save();

        $handles = array_column(TemplateBoard::sourceRows(), 'handle');

        $this->assertContains('journal', $handles);

        foreach (Stores::all() as $store) {
            $this->assertNotContains($store, $handles, $store.' is a library, not a page');
        }
    }

    /**
     * The board reads Statamic; it never stands in for it. If this ever needs
     * an entry to exist before a card can, the files have stopped being the
     * truth and Scaffold Views will silently stop showing up here.
     */
    public function test_a_scaffolded_file_shows_up_without_an_entry(): void
    {
        $this->writeView('board/index');

        $card = TemplateBoard::card('index', 'board/index', null);

        $this->assertTrue($card['exists']);
        $this->assertNull($card['entry'], 'no entry was made');
        $this->assertFalse($card['broken']);
    }

    public function test_an_entry_whose_file_is_gone_is_broken_not_hidden(): void
    {
        Collection::make('ghosts')->title('Ghosts')->save();

        $entry = Entry::make()->collection('ghosts')->slug('x');
        $entry->save();

        $card = TemplateBoard::card('show', 'board/show', $entry);

        $this->assertFalse($card['exists']);
        $this->assertTrue($card['broken'], 'a row pointing at nothing has to say so');
        $this->assertSame($entry->id(), $card['entry']);
    }
}
