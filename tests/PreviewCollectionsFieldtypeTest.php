<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Facades\Statamic\Fields\FieldtypeRepository as Fieldtype;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use MarioHamann\StatamicVisualEditor\Fieldtypes\PreviewCollectionsFieldtype;
use Statamic\Facades\Collection;
use Statamic\Facades\User;
use Statamic\Fields\Field;
use Statamic\Fieldtypes\Collections;

/**
 * The addon settings' picker for "Open in Live Preview" on rows: a collection
 * without a URL stays in the list — last, its title saying why — and a save
 * that names it is refused with the same reason.
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

    private function field(): Field
    {
        return new Field('open_in_preview_collections', ['type' => 'sve_preview_collections', 'mode' => 'select']);
    }

    private function closed(string $title): string
    {
        return __('sve::messages.preview_collections_no_url_title', ['title' => $title]);
    }

    public function test_the_handle_is_its_own_and_collections_stays_statamics(): void
    {
        $this->assertInstanceOf(PreviewCollectionsFieldtype::class, Fieldtype::find('sve_preview_collections'));
        $this->assertSame(Collections::class, get_class(Fieldtype::find('collections')));
    }

    public function test_a_collection_without_a_url_is_listed_last_saying_why(): void
    {
        $this->collection('sve_pc_bare');
        $this->collection('sve_pc_routed', '{slug}');
        $this->actingAsSuper();

        $items = collect($this->field()->fieldtype()->getIndexItems(new Request))
            ->filter(fn ($item) => str_starts_with($item['id'], 'sve_pc_'))
            ->values();

        $this->assertSame(['sve_pc_routed', 'sve_pc_bare'], $items->pluck('id')->all());
        $this->assertSame(['Sve_pc_routed', $this->closed('Sve_pc_bare')], $items->pluck('title')->all());
    }

    public function test_a_chosen_collection_without_a_url_says_why_where_it_is_shown(): void
    {
        $this->collection('sve_pc_bare');
        $this->collection('sve_pc_routed', '{slug}');
        $this->actingAsSuper();

        $titles = $this->field()->fieldtype()->getItemData(['sve_pc_routed', 'sve_pc_bare'])->pluck('title')->all();

        $this->assertSame(['Sve_pc_routed', $this->closed('Sve_pc_bare')], $titles);
    }

    public function test_saving_a_collection_without_a_url_is_refused_with_the_reason(): void
    {
        $this->collection('sve_pc_bare');
        $this->collection('sve_pc_routed', '{slug}');
        $this->actingAsSuper();

        $rules = $this->field()->rules();

        $refused = Validator::make(['open_in_preview_collections' => ['sve_pc_routed', 'sve_pc_bare']], $rules);

        $this->assertTrue($refused->fails());
        $this->assertSame(
            [__('sve::messages.preview_collections_no_url', ['title' => 'Sve_pc_bare'])],
            $refused->errors()->get('open_in_preview_collections'),
        );

        $this->assertFalse(Validator::make(['open_in_preview_collections' => ['sve_pc_routed']], $rules)->fails());
        $this->assertFalse(Validator::make(['open_in_preview_collections' => null], $rules)->fails());
    }
}
