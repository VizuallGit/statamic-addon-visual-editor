<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Controllers;

use Facades\Statamic\CP\LivePreview;
use Illuminate\Support\Facades\File;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Token;
use Statamic\Facades\User;

/**
 * The site canvas's one source: the Templates board's cards (a card exists
 * because its view file does) under the collection they draw — for the
 * collections with a route — and the site's own views in a row of their own;
 * pages in a row; each frame with the Live Preview URL Statamic would open
 * it at and a note saying where it stands in the site. Nothing for a guest,
 * nothing while the feature is off, no frame for an entry of any other
 * collection, no cluster for a collection nobody can visit.
 *
 * Its own collections, named through the config the controller reads: the
 * fixtures' `pages` is shared with every other test, and deleting it would
 * take pages.yaml and its entry with it.
 */
class SiteCanvasControllerTest extends TestCase
{
    protected const PAGES = 'site_canvas_pages';

    protected const SERVICES = 'site_canvas_services';

    protected const PEOPLE = 'site_canvas_people';

    protected const TEMPLATES = 'site_canvas_templates';

    /** @var list<string> */
    protected array $ids = [];

    /** The views this test writes under resources/views, removed again after. */
    protected array $views = [];

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'statamic-visual-editor.features.site_canvas' => true,
            'statamic-visual-editor.features.collection_templates' => true,
            'statamic-visual-editor.previews.collection' => self::PAGES,
            'statamic-visual-editor.collection_templates.collection' => self::TEMPLATES,
        ]);
        Features::flush();

        Collection::make(self::PAGES)->title('Pages')->routes('{slug}')->save();
        Collection::make(self::SERVICES)->title('Services')->routes('services/{slug}')->save();
        // A list drawn on some page: no route, so nobody can visit an entry of
        // it. New collections are seeded a route (CollectionRouting), so the
        // designer's Configure Collection step that clears it is done here.
        $people = Collection::make(self::PEOPLE)->title('People');
        $people->save();
        $people->routes(null)->save();
        Collection::make(self::TEMPLATES)->title('Templates')->previewTargets([
            ['label' => 'Template', 'format' => '/!/sve/collection-view-preview/{id}', 'refresh' => true],
        ])->save();

        $this->entry(self::PAGES, 'home', ['title' => 'Home']);
        // The page the services index is drawn on: its template names the view.
        $this->entry(self::PAGES, 'about', ['title' => 'About us', 'template' => self::SERVICES.'/index']);
        $this->entry(self::SERVICES, 'cleaning', ['title' => 'Cleaning']);

        $this->writeView(self::SERVICES.'/index', '<h1>{{ title }}</h1>');
        $this->writeView(self::SERVICES.'/show', '<h1>{{ title }}</h1>');
        $this->writeView(self::PEOPLE.'/index', '<ul></ul>');
        $this->writeView(self::PEOPLE.'/show', '<p>{{ title }}</p>');
        $this->writeView('errors/404', '<h1>Lost</h1>');
        $this->writeView('layout', '{{ template_content }}');

        // Rows the board already has: found, not made again.
        $this->entry(self::TEMPLATES, 'services-show', ['title' => 'Services show', 'kind' => 'show', 'source_collection' => [self::SERVICES], 'view' => self::SERVICES.'/show']);
        $this->entry(self::TEMPLATES, 'layout', ['title' => 'Layout', 'kind' => 'layout', 'view' => 'layout']);
        // No file behind it: not a template anyone can look at.
        $this->entry(self::TEMPLATES, 'ghost', ['title' => 'Ghost', 'kind' => 'page', 'view' => 'site_canvas_ghost']);

        $user = User::make()->email('site-canvas@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);
    }

    protected function tearDown(): void
    {
        foreach ($this->ids as $id) {
            Entry::find($id)?->delete();
        }

        // Deleting a collection takes its entries with it — the rows the
        // canvas made on demand included.
        foreach ([self::PAGES, self::SERVICES, self::PEOPLE, self::TEMPLATES] as $handle) {
            Collection::find($handle)?->delete();
        }

        foreach ($this->views as $path) {
            @unlink($path);
        }

        @rmdir(resource_path('views/'.self::SERVICES));
        @rmdir(resource_path('views/'.self::PEOPLE));
        @rmdir(resource_path('views/errors'));
        File::deleteDirectory(storage_path('statamic-visual-editor/site-canvas'));
        User::findByEmail('site-canvas@example.com')?->delete();
        Features::flush();

        parent::tearDown();
    }

    protected function entry(string $collection, string $slug, array $data): string
    {
        $entry = Entry::make()->collection($collection)->slug($slug)->data($data);
        $entry->save();

        return $this->ids[] = $entry->id();
    }

    /** A view file under resources/views — only when nothing is there already, so no file of the app's is written over. */
    protected function writeView(string $view, string $contents): void
    {
        $path = resource_path('views/'.$view.'.antlers.html');

        if (is_file($path)) {
            return;
        }

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $contents);
        $this->views[] = $path;
    }

    /** The titles of a row, column by column. */
    protected static function titles(array $row): array
    {
        return array_map(fn ($column) => array_column($column, 'title'), $row['columns']);
    }

    /** The groups as the canvas gets them now. */
    protected function canvas(): array
    {
        return $this->getJson('/!/sve/site-canvas')->assertOk()->json('groups');
    }

    /** The pages row's columns as the canvas gets them now. */
    protected function pageColumns(): array
    {
        return $this->getJson('/!/sve/site-canvas')->assertOk()->json('groups.1.rows.0.columns');
    }

    /** One frame of the groups by its row key and title. */
    protected static function frame(array $groups, string $row, string $title): ?array
    {
        return collect($groups)
            ->flatMap(fn ($group) => $group['rows'])
            ->filter(fn ($r) => $r['key'] === $row)
            ->flatMap(fn ($r) => collect($r['columns'])->flatten(1))
            ->firstWhere('title', $title);
    }

    public function test_a_guest_gets_nothing(): void
    {
        auth()->logout();

        $this->getJson('/!/sve/site-canvas')->assertStatus(403);
    }

    public function test_the_feature_off_is_a_404(): void
    {
        config(['statamic-visual-editor.features.site_canvas' => false]);
        Features::flush();

        $this->getJson('/!/sve/site-canvas')->assertNotFound();
    }

    public function test_templates_under_their_collection_and_the_site_views_apart_then_the_pages(): void
    {
        $groups = $this->canvas();

        $this->assertSame(['templates', 'pages'], array_column($groups, 'key'));

        $rows = $groups[0]['rows'];

        $this->assertSame(['Services', 'Site'], array_column($rows, 'title'));
        $this->assertSame([self::SERVICES, 'site'], array_column($rows, 'key'));
        // The board's cards, titled as the board titles them, one a column; the ghost (no view file) is nowhere.
        $this->assertSame([['Index'], ['Show']], self::titles($rows[0]));
        $this->assertSame(['index', 'show'], array_column(array_merge(...$rows[0]['columns']), 'slot'));

        $site = array_column(array_merge(...$rows[1]['columns']), 'title');

        $this->assertSame('Layout', $site[0], 'the frame first, as on the board');
        $this->assertContains('404 page', $site);
        $this->assertNotContains('Index', $site);
        $this->assertNotContains('Ghost', $site);
        // Templates stay where they are.
        $this->assertFalse($groups[0]['arrange']);

        $pages = $groups[1]['rows'];

        $this->assertCount(1, $pages);
        $this->assertSame(self::PAGES, $pages[0]['key']);
        // No tree: by title. Nothing saved: one page per column.
        $this->assertSame([['About us'], ['Home']], self::titles($pages[0]));
        $this->assertTrue($groups[1]['arrange']);
    }

    public function test_a_card_with_a_file_but_no_row_is_a_frame_and_its_row_is_made_once(): void
    {
        $rowFor = fn (string $view) => Entry::query()->where('collection', self::TEMPLATES)->get()->first(fn ($e) => $e->get('view') === $view);

        $this->assertNull($rowFor('errors/404'), 'nobody made a row for the 404 yet');
        $this->assertNull($rowFor(self::SERVICES.'/index'));

        $groups = $this->canvas();
        $error = self::frame($groups, 'site', '404 page');
        $index = self::frame($groups, self::SERVICES, 'Index');

        $this->assertNotNull($error, 'the file is there, so the card is a frame');
        $this->assertNotNull($index);
        $this->assertSame('errors/404', $error['view']);
        $this->assertSame($rowFor('errors/404')?->id(), $error['id'], 'the row the frame opens is the one made');
        $this->assertSame($rowFor('errors/404')->editUrl(), $error['edit']);
        $this->assertSame('page', $rowFor('errors/404')->get('kind'));
        $this->assertSame('index', $rowFor(self::SERVICES.'/index')->get('kind'));

        // Asked again: the same rows, no second one.
        $this->canvas();

        $this->assertCount(1, Entry::query()->where('collection', self::TEMPLATES)->get()->filter(fn ($e) => $e->get('view') === 'errors/404'));
        $this->assertSame($error['id'], self::frame($this->canvas(), 'site', '404 page')['id']);
    }

    public function test_a_collection_without_a_route_gets_no_cluster(): void
    {
        $rows = $this->canvas()[0]['rows'];

        $this->assertNotContains('People', array_column($rows, 'title'), 'its files exist, but nobody can visit an entry of it');
        $this->assertNotContains(self::PEOPLE, array_column($rows, 'key'));
    }

    public function test_an_entry_of_another_collection_is_in_no_group(): void
    {
        $titles = collect($this->canvas())
            ->flatMap(fn ($group) => collect($group['rows'])->flatMap(fn ($row) => array_merge(...self::titles($row))))
            ->all();

        $this->assertNotContains('Cleaning', $titles);
        $this->assertNotContains('Ghost', $titles);
    }

    /**
     * A page and the index that draws it are one address seen from two sides,
     * and each says so. The default page draws every page with no template of
     * its own; the layout stands around them all; the 404 is its own address.
     */
    public function test_every_frame_says_where_it_stands_in_the_site(): void
    {
        $groups = $this->canvas();

        $this->assertSame('On About us', self::frame($groups, self::SERVICES, 'Index')['note']);
        $this->assertSame('/services/{slug}', self::frame($groups, self::SERVICES, 'Show')['note']);
        $this->assertSame('Around every page', self::frame($groups, 'site', 'Layout')['note']);
        $this->assertSame('', self::frame($groups, 'site', '404 page')['note']);

        $this->assertSame('Services · Index', self::frame($groups, self::PAGES, 'About us')['note']);
        $this->assertSame('', self::frame($groups, self::PAGES, 'Home')['note'], 'drawn with the default every page starts with: nothing to say');
    }

    public function test_an_index_nobody_draws_yet_says_so_and_a_shared_show_is_marked(): void
    {
        Entry::find($this->ids[1])->set('template', null)->save();
        Collection::findByHandle(self::PEOPLE)->routes('people/{slug}')->template(self::SERVICES.'/show')->save();

        $groups = $this->canvas();

        $this->assertSame('Not on any page yet', self::frame($groups, self::SERVICES, 'Index')['note']);
        $this->assertSame('Shared · /people/{slug}', self::frame($groups, self::PEOPLE, 'Show')['note']);
        $this->assertSame('', self::frame($groups, self::PAGES, 'About us')['note']);
    }

    public function test_the_pages_are_arranged_as_saved_and_a_save_answers_with_the_arrangement(): void
    {
        [$about, $home] = array_map(fn ($column) => $column[0]['id'], $this->pageColumns());

        $this->postJson('/!/sve/site-canvas/arrangement', ['columns' => [[$home, $about]]])
            ->assertOk()
            ->assertExactJson(['columns' => [[$home, $about]]]);

        // Home first, About us under it — and the file is the site's.
        $this->assertSame([['Home', 'About us']], self::titles(['columns' => $this->pageColumns()]));
        $this->assertFileExists(storage_path('statamic-visual-editor/site-canvas/default.yaml'));

        // Something that is not a page is not kept; a page left out comes back at the end.
        $this->postJson('/!/sve/site-canvas/arrangement', ['columns' => [['nowhere'], [$about]]])
            ->assertOk()
            ->assertExactJson(['columns' => [[$about], [$home]]]);

        $this->postJson('/!/sve/site-canvas/arrangement', ['columns' => 'home'])->assertUnprocessable();

        auth()->logout();
        $this->postJson('/!/sve/site-canvas/arrangement', ['columns' => []])->assertStatus(403);
    }

    public function test_a_page_under_another_in_the_tree_stands_under_its_parent_and_goes_where_the_parent_goes(): void
    {
        $team = $this->entry(self::PAGES, 'team', ['title' => 'Team']);
        $jobs = $this->entry(self::PAGES, 'jobs', ['title' => 'Jobs']);
        $slug = fn (string $slug) => Entry::query()->where('collection', self::PAGES)->where('slug', $slug)->first()->id();
        [$home, $about] = [$slug('home'), $slug('about')];

        $pages = Collection::findByHandle(self::PAGES);
        $pages->structureContents(['root' => true])->save();
        $pages->structure()->in('default')->tree([
            ['entry' => $home],
            ['entry' => $about, 'children' => [['entry' => $team, 'children' => [['entry' => $jobs]]]]],
        ])->save();

        // The tree's order, one top page a column; the children in their parent's column after it, each as deep as it stands.
        $columns = $this->pageColumns();

        $this->assertSame([['Home'], ['About us', 'Team', 'Jobs']], self::titles(['columns' => $columns]));
        $this->assertSame([0, 0, 1, 2], array_column(array_merge(...$columns), 'depth'));

        // The arrangement is over the top pages: a child's id is not kept, it is where its parent is; the top pages are what is answered.
        $this->postJson('/!/sve/site-canvas/arrangement', ['columns' => [[$team], [$about, $home]]])
            ->assertOk()
            ->assertExactJson(['columns' => [[$about, $home]]]);

        $this->assertSame([['About us', 'Team', 'Jobs', 'Home']], self::titles(['columns' => $this->pageColumns()]));

        // The children go before tearDown takes Home: with Home gone About us would be the root, and a root has no children.
        Entry::find($jobs)->delete();
        Entry::find($team)->delete();
    }

    public function test_a_frame_carries_the_live_preview_url_statamic_would_open_and_the_edit_url(): void
    {
        $groups = $this->canvas();
        $home = self::frame($groups, self::PAGES, 'Home');
        $entry = Entry::find($home['id']);

        $this->assertSame($entry->editUrl(), $home['edit']);

        $url = parse_url($home['preview']);
        parse_str($url['query'], $query);

        $this->assertStringStartsWith($entry->absoluteUrl(), $home['preview']);
        $this->assertArrayHasKey('live-preview', $query);
        $this->assertArrayHasKey('token', $query);

        // The token is Statamic's own Live Preview token, and it holds this entry.
        $token = Token::find($query['token']);

        $this->assertNotNull($token);
        $this->assertSame(\Statamic\Tokens\Handlers\LivePreview::class, $token->handler());
        $this->assertSame($entry->id(), LivePreview::item($token)?->id());

        // A template's URL is its own preview target, under a token of its own.
        $show = self::frame($groups, self::SERVICES, 'Show');

        $this->assertStringContainsString('/!/sve/collection-view-preview/'.$show['id'], $show['preview']);
        $this->assertStringContainsString('token=', $show['preview']);
    }

    /** The index's preview is the page it is drawn on — the same thing the page's own frame shows. */
    public function test_the_index_preview_is_drawn_with_the_page_that_names_it(): void
    {
        $index = self::frame($this->canvas(), self::SERVICES, 'Index');

        $this->get($index['preview'])->assertOk()->assertSee('<h1>About us</h1>', false);

        // Nobody names it: the view alone.
        Entry::find($this->ids[1])->set('template', null)->save();

        $this->get($index['preview'])->assertOk()->assertDontSee('About us');
    }

    public function test_without_the_templates_feature_only_the_pages_remain(): void
    {
        config(['statamic-visual-editor.features.collection_templates' => false]);
        Features::flush();

        $groups = $this->canvas();

        $this->assertSame(['pages'], array_column($groups, 'key'));
    }
}
