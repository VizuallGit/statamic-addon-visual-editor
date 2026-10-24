<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Facades\Statamic\Fields\FieldtypeRepository as Fieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\PreviewCollectionsFieldtype;
use MarioHamann\StatamicVisualEditor\Stores;
use Statamic\Facades\Collection;
use Statamic\Facades\User;
use Statamic\Fields\Field;
use Statamic\Fieldtypes\Collections;

/**
 * The addon settings' dropdown for "Open in Live Preview" on rows: one without a
 * URL is locked (previewable: false, listed last, its title saying why), and
 * never read as chosen or written — so a hand-edited one cannot block a save.
 */
class PreviewCollectionsFieldtypeTest extends TestCase
{
    private array $collections = [];

    protected function tearDown(): void
    {
        foreach ($this->collections as $collection) {
            $collection->delete();
        }

        User::findByEmail('preview-collections@example.com')?->delete();

        parent::tearDown();
    }

    private function collection(string $handle, ?string $route = null): void
    {
        $collection = Collection::make($handle)->title(ucfirst($handle));

        if ($route) {
            $collection->routes($route);
        }

        $collection->saveQuietly();

        $this->collections[] = $collection;
    }

    private function actingAsSuper(): void
    {
        $user = User::make()->email('preview-collections@example.com')->makeSuper();
        $user->save();

        $this->actingAs($user);
    }

    private function fieldtype(): PreviewCollectionsFieldtype
    {
        return (new Field('open_in_preview_collections', ['type' => 'sve_preview_collections']))->fieldtype();
    }

    public function test_the_handle_is_its_own_and_collections_stays_statamics(): void
    {
        $this->assertInstanceOf(PreviewCollectionsFieldtype::class, Fieldtype::find('sve_preview_collections'));
        $this->assertSame(Collections::class, get_class(Fieldtype::find('collections')));
    }

    public function test_a_collection_without_a_url_is_listed_last_and_locked(): void
    {
        $this->collection('sve_pc_bare');
        $this->collection('sve_pc_routed', '{slug}');
        $this->actingAsSuper();

        $listed = collect($this->fieldtype()->preload()['collections'])
            ->filter(fn ($collection) => str_starts_with($collection['handle'], 'sve_pc_'))
            ->values()
            ->all();

        $this->assertSame([
            ['handle' => 'sve_pc_routed', 'title' => 'Sve_pc_routed', 'previewable' => true],
            [
                'handle' => 'sve_pc_bare',
                'title' => __('sve::messages.preview_collections_no_url_title', ['title' => 'Sve_pc_bare']),
                'previewable' => false,
            ],
        ], $listed);
    }

    public function test_the_editors_stores_are_not_listed(): void
    {
        $this->actingAsSuper();

        $handles = collect($this->fieldtype()->preload()['collections'])->pluck('handle')->all();

        foreach (Stores::all() as $store) {
            $this->assertNotContains($store, $handles);
        }
    }

    public function test_a_collection_without_a_url_is_never_read_as_chosen_or_saved(): void
    {
        $this->collection('sve_pc_bare');
        $this->collection('sve_pc_routed', '{slug}');

        $fieldtype = $this->fieldtype();
        $value = ['sve_pc_routed', 'sve_pc_bare', 'sve_pc_gone', 'sve_pc_routed'];

        $this->assertSame(['sve_pc_routed'], $fieldtype->preProcess($value));
        $this->assertSame(['sve_pc_routed'], $fieldtype->process($value));
        $this->assertSame([], $fieldtype->process(null));
    }
}
