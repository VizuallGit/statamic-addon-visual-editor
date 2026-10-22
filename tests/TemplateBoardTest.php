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
        foreach (['journal', 'ghosts', 'worked', 'shared', 'nothing', 'board'] as $handle) {
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

    /**
     * The collection's own `template:` decides what renders an entry. Guessing
     * `{handle}/show` made three of four collections on a real site look as
     * though they had no template at all.
     */
    public function test_the_show_card_follows_the_collections_own_template(): void
    {
        $own = Collection::make('worked')->title('Worked')->template('worked/show');
        $own->save();

        $shared = Collection::make('shared')->title('Shared')->template('worked/show');
        $shared->save();

        $this->assertSame('worked/show', TemplateBoard::showView('worked', $own));
        $this->assertSame('worked/show', TemplateBoard::showView('shared', $shared));
    }

    public function test_a_shared_template_is_marked_shared_not_empty(): void
    {
        $shared = Collection::make('shared')->title('Shared')->template('worked/show');
        $shared->save();

        $own = Collection::make('worked')->title('Worked')->template('worked/show');
        $own->save();

        $card = fn ($row) => collect($row['cards'])->firstWhere('slot', 'show');

        $this->assertTrue($card(TemplateBoard::sourceRow('shared', 'Shared', 'collection', $shared))['shared']);
        $this->assertFalse($card(TemplateBoard::sourceRow('worked', 'Worked', 'collection', $own))['shared']);
    }

    /**
     * Statamic renders a collection with nothing set through `default`, and
     * the CP writes that `default` back on every save. Neither is a template
     * anyone added: a new collection has no show card until one is made here,
     * by Scaffold Views, or by pointing the collection somewhere itself.
     */
    public function test_a_new_collection_has_no_show_card_until_a_template_is_added(): void
    {
        $fresh = Collection::make('board')->title('Board');
        $fresh->save();

        $card = fn ($source) => collect(TemplateBoard::sourceRow('board', 'Board', 'collection', $source)['cards'])->firstWhere('slot', 'show');

        $this->assertSame('default', $fresh->template(), 'Statamic\'s own fallback');
        $this->assertNull(TemplateBoard::ownTemplate($fresh));
        $this->assertFalse($card($fresh)['exists'], 'nothing added, nothing shown');
        $this->assertFalse($card($fresh)['shared'], 'and not "shared" either');

        // The CP saved it: `template: default` is now in the file. Still nothing.
        $fresh->template('default')->save();

        $this->assertNull(TemplateBoard::ownTemplate($fresh));
        $this->assertFalse($card($fresh)['exists']);

        // A file of its own — written here or by Scaffold Views — is the card.
        $this->writeView('board/show');

        $this->assertTrue($card($fresh)['exists']);
        $this->assertSame('board/show', $card($fresh)['view']);
        $this->assertFalse($card($fresh)['shared']);
    }

    public function test_the_show_view_falls_back_to_the_convention_without_a_source(): void
    {
        $this->assertSame('nothing/show', TemplateBoard::showView('nothing', null));
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
