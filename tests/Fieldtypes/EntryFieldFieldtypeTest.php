<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Fieldtypes\EntryFieldFieldtype;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\Blueprint;
use Statamic\Facades\Collection;
use Statamic\Fields\Field;

class EntryFieldFieldtypeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Collection::make('sve_ef_cases')->title('Cases')->saveQuietly();

        Blueprint::make('cases')->setNamespace('collections.sve_ef_cases')->setContents([
            'tabs' => ['main' => ['sections' => [['fields' => [
                ['handle' => 'title', 'field' => ['type' => 'text']],
                ['handle' => 'teaser', 'field' => ['type' => 'textarea', 'display' => 'Teaser']],
                ['handle' => 'body', 'field' => ['type' => 'bard']],
                ['handle' => 'main_image', 'field' => ['type' => 'assets', 'display' => 'Main image']],
            ]]]]],
        ])->save();
    }

    protected function tearDown(): void
    {
        Blueprint::find('collections.sve_ef_cases.cases')?->delete();
        Collection::findByHandle('sve_ef_cases')?->delete();

        parent::tearDown();
    }

    public function test_only_fields_of_the_accepted_types_are_offered(): void
    {
        $text = $this->fieldtype(['text', 'textarea'])->preload()['fields']['sve_ef_cases'];
        $image = $this->fieldtype(['assets'])->preload()['fields']['sve_ef_cases'];

        $this->assertSame(['title', 'teaser'], array_column($text, 'handle'));
        $this->assertSame(['main_image'], array_column($image, 'handle'));
        $this->assertSame('Main image', $image[0]['display']);
    }

    public function test_two_fields_with_the_same_name_are_told_apart_by_handle(): void
    {
        Blueprint::make('cases')->setNamespace('collections.sve_ef_cases')->setContents([
            'tabs' => ['main' => ['sections' => [['fields' => [
                ['handle' => 'title', 'field' => ['type' => 'text', 'display' => 'Title']],
                ['handle' => 'meta_title', 'field' => ['type' => 'text', 'display' => 'Title']],
                ['handle' => 'teaser', 'field' => ['type' => 'textarea', 'display' => 'Teaser']],
            ]]]]],
        ])->save();

        $fields = $this->fieldtype(['text', 'textarea'])->preload()['fields']['sve_ef_cases'];

        $this->assertSame(['Title (title)', 'Title (meta_title)', 'Teaser'], array_column($fields, 'display'));
    }

    public function test_the_entrys_own_page_comes_first_when_a_link_is_accepted(): void
    {
        $fields = $this->fieldtype(['link', EntryFieldFieldtype::ENTRY_URL])->preload()['fields']['sve_ef_cases'];

        $this->assertSame([['handle' => 'url', 'display' => __('sve::messages.entry_field_url'), 'type' => 'entry_url']], $fields);
    }

    public function test_the_collections_are_named_for_the_hint(): void
    {
        $this->assertSame('Cases', $this->fieldtype(['text'])->preload()['collections']['sve_ef_cases'] ?? null);
    }

    public function test_the_value_is_a_field_handle_or_nothing(): void
    {
        $fieldtype = $this->fieldtype(['text']);

        $this->assertSame('teaser', $fieldtype->process('teaser'));
        $this->assertNull($fieldtype->process(''));
        $this->assertNull($fieldtype->process('{{ evil }}'));
        $this->assertNull($fieldtype->preProcess(['teaser']));
    }

    public function test_it_is_not_offered_in_the_blueprint_builder(): void
    {
        $this->assertFalse((new EntryFieldFieldtype)->selectable());
    }

    /** @param  list<string>  $accepts */
    private function fieldtype(array $accepts): EntryFieldFieldtype
    {
        $fieldtype = new EntryFieldFieldtype;
        $fieldtype->setField(new Field('card_source', ['type' => 'sve_entry_field', 'accepts' => $accepts]));

        return $fieldtype;
    }
}
