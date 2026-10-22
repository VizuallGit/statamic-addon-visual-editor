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
 * The site canvas's one source: templates under the collection they draw and
 * the site's own views in a row of their own, pages in a row, each frame with
 * the Live Preview URL Statamic would open it at — and nothing for a guest,
 * nothing while the feature is off, and no frame for an entry of any other
 * collection.
 *
 * Its own collections, named through the config the controller reads: the
 * fixtures' `pages` is shared with every other test, and deleting it would
 * take pages.yaml and its entry with it.
 */
class SiteCanvasControllerTest extends TestCase
{
    protected const PAGES = 'site_canvas_pages';

    protected const SERVICES = 'site_canvas_services';

    protected const TEMPLATES = 'site_canvas_templates';

    /** @var list<string> */
    protected array $ids = [];

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
        Collection::make(self::TEMPLATES)->title('Templates')->previewTargets([
            ['label' => 'Template', 'format' => '/!/sve/collection-view-preview/{id}', 'refresh' => true],
        ])->save();

        $this->entry(self::PAGES, 'home', ['title' => 'Home']);
        $this->entry(self::PAGES, 'about', ['title' => 'About us']);
        $this->entry(self::SERVICES, 'cleaning', ['title' => 'Cleaning']);

        File::ensureDirectoryExists(resource_path('views/site_canvas_services'));
        File::put(resource_path('views/site_canvas_services/index.antlers.html'), '<h1>Services</h1>');
        File::put(resource_path('views/site_canvas_services/show.antlers.html'), '<h1>{{ title }}</h1>');
        File::put(resource_path('views/site_canvas_layout.antlers.html'), '{{ template_content }}');

        $this->entry(self::TEMPLATES, 'services-show', ['title' => 'Services show', 'kind' => 'show', 'source_collection' => [self::SERVICES], 'view' => 'site_canvas_services/show']);
        $this->entry(self::TEMPLATES, 'services-index', ['title' => 'Services index', 'kind' => 'index', 'source_collection' => self::SERVICES, 'view' => 'site_canvas_services/index']);
        $this->entry(self::TEMPLATES, 'layout', ['title' => 'Layout', 'kind' => 'layout', 'view' => 'site_canvas_layout']);
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

        foreach ([self::PAGES, self::SERVICES, self::TEMPLATES] as $handle) {
            Collection::find($handle)?->delete();
        }

        foreach (['site_canvas_services/index', 'site_canvas_services/show', 'site_canvas_layout'] as $view) {
            @unlink(resource_path('views/'.$view.'.antlers.html'));
        }

        @rmdir(resource_path('views/site_canvas_services'));
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

    /** The titles of a row, column by column. */
    protected static function titles(array $row): array
    {
        return array_map(fn ($column) => array_column($column, 'title'), $row['columns']);
    }

    /** The pages row's columns as the canvas gets them now. */
    protected function pageColumns(): array
    {
        return $this->getJson('/!/sve/site-canvas')->assertOk()->json('groups.1.rows.0.columns');
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
        $groups = $this->getJson('/!/sve/site-canvas')->assertOk()->json('groups');

        $this->assertSame(['templates', 'pages'], array_column($groups, 'key'));

        $rows = $groups[0]['rows'];

        $this->assertSame(['Services', 'Site'], array_column($rows, 'title'));
        $this->assertSame([self::SERVICES, 'site'], array_column($rows, 'key'));
        // Index before show, one frame per column; the ghost (no view file) is nowhere.
        $this->assertSame([['Services index'], ['Services show']], self::titles($rows[0]));
        $this->assertSame([['Layout']], self::titles($rows[1]));
        // Templates stay where they are.
        $this->assertFalse($groups[0]['arrange']);

        $pages = $groups[1]['rows'];

        $this->assertCount(1, $pages);
        $this->assertSame(self::PAGES, $pages[0]['key']);
        // No tree: by title. Nothing saved: one page per column.
        $this->assertSame([['About us'], ['Home']], self::titles($pages[0]));
        $this->assertTrue($groups[1]['arrange']);
    }

    public function test_an_entry_of_another_collection_is_in_no_group(): void
    {
        $titles = collect($this->getJson('/!/sve/site-canvas')->json('groups'))
            ->flatMap(fn ($group) => collect($group['rows'])->flatMap(fn ($row) => array_merge(...self::titles($row))))
            ->all();

        $this->assertNotContains('Cleaning', $titles);
        $this->assertNotContains('Ghost', $titles);
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

    public function test_a_frame_carries_the_live_preview_url_statamic_would_open_and_the_edit_url(): void
    {
        $groups = $this->getJson('/!/sve/site-canvas')->assertOk()->json('groups');
        $home = collect($groups[1]['rows'][0]['columns'])->flatten(1)->firstWhere('title', 'Home');
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
        $show = collect($groups[0]['rows'][0]['columns'])->flatten(1)->firstWhere('title', 'Services show');

        $this->assertStringContainsString('/!/sve/collection-view-preview/'.$show['id'], $show['preview']);
        $this->assertStringContainsString('token=', $show['preview']);
    }

    public function test_without_the_templates_feature_only_the_pages_remain(): void
    {
        config(['statamic-visual-editor.features.collection_templates' => false]);
        Features::flush();

        $groups = $this->getJson('/!/sve/site-canvas')->assertOk()->json('groups');

        $this->assertSame(['pages'], array_column($groups, 'key'));
    }
}
