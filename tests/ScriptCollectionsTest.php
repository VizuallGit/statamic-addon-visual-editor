<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Boot\ScriptCollections;
use MarioHamann\StatamicVisualEditor\CollectionTemplateEntry;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Statamic\Facades\User;

/**
 * What the Control Panel's script is told about where an entry opens:
 * which collections can open in Live Preview, and the front page for the
 * top bar's button.
 */
class ScriptCollectionsTest extends TestCase
{
    private array $collections = [];

    protected function tearDown(): void
    {
        foreach ($this->collections as $collection) {
            $collection->delete();
        }

        User::findByEmail('script-collections@example.com')?->delete();

        parent::tearDown();
    }

    private function collection(string $handle, ?string $route = null, ?string $entryClass = null)
    {
        $collection = Collection::make($handle)->title(ucfirst($handle));

        if ($route) {
            $collection->routes($route);
        }

        if ($entryClass) {
            $collection->entryClass($entryClass);
        }

        $collection->saveQuietly();

        return $this->collections[] = $collection;
    }

    private function actingAsSuper(): void
    {
        $user = User::make()->email('script-collections@example.com')->makeSuper();
        $user->save();

        $this->actingAs($user);
    }

    public function test_a_routed_collection_is_previewable_and_one_without_a_route_is_not(): void
    {
        $routed = $this->collection('sve_sc_routed', '{slug}');
        $bare = $this->collection('sve_sc_bare');
        $site = Site::default()->handle();

        $this->assertTrue(ScriptCollections::previewable($routed, $site));
        $this->assertFalse(ScriptCollections::previewable($bare, $site));
    }

    public function test_the_templates_store_is_previewable_without_a_route(): void
    {
        config(['statamic-visual-editor.features.collection_templates' => true]);
        Features::flush();

        $templates = $this->collection('sve_sc_templates', null, CollectionTemplateEntry::class);

        $this->assertTrue(ScriptCollections::previewable($templates, Site::default()->handle()));
    }

    public function test_the_previewable_map_answers_for_every_collection_the_stores_included(): void
    {
        config(['statamic-visual-editor.features.collection_templates' => true]);
        Features::flush();

        $this->collection('sve_sc_routed', '{slug}');
        $this->collection('sve_sc_bare');
        $this->collection('sve_sc_templates', null, CollectionTemplateEntry::class);
        $this->actingAsSuper();

        $map = ScriptCollections::previewableMap();

        $this->assertTrue($map['sve_sc_routed']);
        $this->assertFalse($map['sve_sc_bare']);
        $this->assertTrue($map['sve_sc_templates']);
    }

    public function test_the_previewable_map_is_empty_without_a_user(): void
    {
        $this->collection('sve_sc_routed', '{slug}');

        $this->assertSame([], ScriptCollections::previewableMap());
    }

    public function test_the_picker_flag_and_the_map_agree(): void
    {
        $this->collection('sve_sc_routed', '{slug}');
        $this->collection('sve_sc_bare');
        $this->actingAsSuper();

        $map = ScriptCollections::previewableMap();

        foreach (ScriptCollections::pickerCollections() as $collection) {
            $this->assertSame($map[$collection['handle']], $collection['previewable'], $collection['handle']);
        }
    }

    public function test_only_previewable_collections_carry_the_open_in_preview_label(): void
    {
        config([
            'statamic-visual-editor.features.open_in_preview' => true,
            'statamic-visual-editor.features.open_in_preview_collections' => ['sve_sc_routed', 'sve_sc_bare', 'sve_sc_missing'],
        ]);
        Features::flush();

        $this->collection('sve_sc_routed', '{slug}');
        $this->collection('sve_sc_bare');
        $this->actingAsSuper();

        $this->assertSame(['sve_sc_routed'], ScriptCollections::openInPreviewCollections());
    }

    public function test_the_home_preview_button_is_on_by_default(): void
    {
        $this->assertTrue(Features::enabled('home_preview_button'));
    }

    public function test_the_home_preview_is_the_entry_at_the_root_uri(): void
    {
        $pages = $this->collection('sve_sc_pages', '{parent_uri}/{slug}');
        $pages->structureContents(['root' => true])->save();

        $home = Entry::make()->collection($pages)->slug('home')->data(['title' => 'Front page']);
        $home->save();
        $pages->structure()->in(Site::default()->handle())->tree([['entry' => $home->id()]])->save();

        $this->actingAsSuper();

        $preview = ScriptCollections::homePreview();

        $this->assertNotNull($preview);
        $this->assertSame($home->id(), $preview['id']);
        $this->assertSame('Front page', $preview['title']);
        $this->assertSame($home->editUrl().'?live-preview=1', $preview['url']);
    }

    public function test_there_is_no_home_preview_when_the_toggle_is_off(): void
    {
        config(['statamic-visual-editor.features.home_preview_button' => false]);
        Features::flush();

        $pages = $this->collection('sve_sc_pages', '{parent_uri}/{slug}');
        $pages->structureContents(['root' => true])->save();

        $home = Entry::make()->collection($pages)->slug('home')->data(['title' => 'Front page']);
        $home->save();
        $pages->structure()->in(Site::default()->handle())->tree([['entry' => $home->id()]])->save();

        $this->actingAsSuper();

        $this->assertNull(ScriptCollections::homePreview());
    }

    public function test_there_is_no_home_preview_without_an_entry_at_the_root(): void
    {
        $this->collection('sve_sc_pages', '{parent_uri}/{slug}');
        $this->actingAsSuper();

        $this->assertNull(ScriptCollections::homePreview());
    }

    public function test_there_is_no_home_preview_without_a_user(): void
    {
        $pages = $this->collection('sve_sc_pages', '{parent_uri}/{slug}');
        $pages->structureContents(['root' => true])->save();

        $home = Entry::make()->collection($pages)->slug('home')->data(['title' => 'Front page']);
        $home->save();
        $pages->structure()->in(Site::default()->handle())->tree([['entry' => $home->id()]])->save();

        $this->assertNull(ScriptCollections::homePreview());
    }
}
