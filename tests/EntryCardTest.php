<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\EntryCard;
use Statamic\Contracts\Assets\Asset;
use Statamic\Facades\AssetContainer;
use Statamic\Facades\Blueprint;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Fields\Value;
use Statamic\Fieldtypes\Assets\Assets;
use Statamic\Fieldtypes\Text;
use Illuminate\Support\Facades\Storage;

class EntryCardTest extends TestCase
{
    private const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    protected function setUp(): void
    {
        parent::setUp();

        config(['filesystems.disks.sve_card_assets' => ['driver' => 'local', 'root' => storage_path('framework/testing/disks/sve_card_assets'), 'url' => '/assets']]);
        Storage::fake('sve_card_assets');
        AssetContainer::make('sve_card_assets')->disk('sve_card_assets')->save();
        Storage::disk('sve_card_assets')->put('photo.png', base64_decode(self::PNG));
        Storage::disk('sve_card_assets')->put('other.png', base64_decode(self::PNG));
    }

    protected function tearDown(): void
    {
        foreach (['people', 'cases', 'plain', 'own'] as $handle) {
            Blueprint::find("collections.sve_card_{$handle}.{$handle}")?->delete();
            Collection::findByHandle("sve_card_{$handle}")?->delete();
        }

        AssetContainer::find('sve_card_assets')?->delete();

        parent::tearDown();
    }

    /** @param  array<int, array<string, mixed>>  $fields */
    private function collection(string $handle, array $fields, ?string $route = null): \Statamic\Contracts\Entries\Collection
    {
        $collection = Collection::make("sve_card_{$handle}")->title(ucfirst($handle));

        if ($route) {
            $collection->routes($route);
        }

        $collection->saveQuietly();

        Blueprint::make($handle)->setNamespace("collections.sve_card_{$handle}")->setContents([
            'tabs' => ['main' => ['sections' => [['fields' => $fields]]]],
        ])->save();

        EntryCard::computeFor(["sve_card_{$handle}"]);

        return $collection;
    }

    private function assetsField(string $handle, array $config = []): array
    {
        return ['handle' => $handle, 'field' => array_merge(['type' => 'assets', 'container' => 'sve_card_assets', 'max_files' => 1], $config)];
    }

    public function test_the_blueprint_says_which_field_is_the_cards_image_text_and_label(): void
    {
        $this->collection('people', [
            ['handle' => 'title', 'field' => ['type' => 'text']],
            ['handle' => 'job_title', 'field' => ['type' => 'text', EntryCard::KEY => 'label']],
            ['handle' => 'bio', 'field' => ['type' => 'textarea', EntryCard::KEY => 'text']],
            $this->assetsField('banner'),
            $this->assetsField('photo', [EntryCard::KEY => 'image']),
        ]);

        $entry = Entry::make()->collection('sve_card_people')->slug('jens')
            ->data(['title' => 'Jens', 'job_title' => 'Designer', 'bio' => 'Tegner ting.', 'banner' => 'other.png', 'photo' => 'photo.png']);
        $entry->save();

        $card = Entry::find($entry->id())->value(EntryCard::FIELD);

        $this->assertSame('Jens', $card['title']);
        $this->assertSame('Designer', (string) $card['label']);
        $this->assertSame('Tegner ting.', (string) $card['text']);
        $this->assertInstanceOf(Asset::class, $card['image']);
        // The field with the role, not the first image field.
        $this->assertSame('photo.png', $card['image']->path());
        // No route: nothing to link to.
        $this->assertNull($card['url']);
    }

    public function test_title_and_link_are_the_entrys_own_and_an_empty_role_is_null(): void
    {
        $this->collection('cases', [
            ['handle' => 'title', 'field' => ['type' => 'text']],
            ['handle' => 'teaser', 'field' => ['type' => 'bard', EntryCard::KEY => 'text']],
        ], '/cases/{slug}');

        $entry = Entry::make()->collection('sve_card_cases')->slug('acme')->data(['title' => 'Acme']);
        $entry->save();

        $card = EntryCard::of(Entry::find($entry->id()));

        $this->assertSame('Acme', $card['title']);
        $this->assertSame('/cases/acme', $card['url']);
        $this->assertNull($card['text']);
        $this->assertNull($card['image']);
        $this->assertNull($card['label']);
    }

    public function test_a_blueprint_without_roles_uses_its_first_image_field(): void
    {
        $this->collection('plain', [
            ['handle' => 'title', 'field' => ['type' => 'text']],
            $this->assetsField('gallery', ['max_files' => null]),
            $this->assetsField('photo'),
        ]);

        $entry = Entry::make()->collection('sve_card_plain')->slug('x')
            ->data(['title' => 'X', 'gallery' => ['other.png', 'photo.png'], 'photo' => 'photo.png']);
        $entry->save();

        $card = EntryCard::of(Entry::find($entry->id()));

        // The first image field, and the first image of it.
        $this->assertSame('other.png', $card['image']->path());
        $this->assertNull($card['text']);
    }

    public function test_a_blueprint_with_its_own_card_field_keeps_it(): void
    {
        $this->collection('own', [
            ['handle' => 'title', 'field' => ['type' => 'text']],
            ['handle' => 'card', 'field' => ['type' => 'text']],
        ]);

        $entry = Entry::make()->collection('sve_card_own')->slug('x')->data(['title' => 'X', 'card' => 'Mit eget']);
        $entry->save();

        $this->assertSame('Mit eget', Entry::find($entry->id())->value(EntryCard::FIELD));
    }

    public function test_the_first_field_with_a_role_wins_and_unknown_roles_are_ignored(): void
    {
        $blueprint = Blueprint::make('x')->setContents(['tabs' => ['main' => ['sections' => [['fields' => [
            ['handle' => 'a', 'field' => ['type' => 'text', EntryCard::KEY => 'text']],
            ['handle' => 'b', 'field' => ['type' => 'text', EntryCard::KEY => 'text']],
            ['handle' => 'c', 'field' => ['type' => 'text', EntryCard::KEY => 'price']],
        ]]]]]]);

        $this->assertSame(['text' => 'a'], EntryCard::roles($blueprint));
    }

    public function test_each_fieldtype_offers_only_the_roles_it_can_fill(): void
    {
        EntryCard::registerSettings();

        $options = fn (string $class) => array_keys(
            collect((new $class)->configFields()->all())->get(EntryCard::KEY)->config()['options']
        );

        $this->assertSame(['image'], $options(Assets::class));
        $this->assertSame(['title', 'text', 'label', 'url'], $options(Text::class));
    }

    public function test_the_card_reaches_antlers_through_the_entry(): void
    {
        $this->collection('people', [
            ['handle' => 'title', 'field' => ['type' => 'text']],
            ['handle' => 'job_title', 'field' => ['type' => 'text', EntryCard::KEY => 'label']],
        ]);

        $entry = Entry::make()->collection('sve_card_people')->slug('jens')->data(['title' => 'Jens', 'job_title' => 'Designer']);
        $entry->save();

        $card = Entry::find($entry->id())->augmentedValue(EntryCard::FIELD);

        $this->assertInstanceOf(Value::class, $card);
        $this->assertSame('Designer', (string) $card->value()['label']);
    }
}
