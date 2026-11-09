<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Validation\ValidationException;
use Statamic\Facades\Blueprint;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Fieldset;
use Statamic\Facades\User;

/**
 * Taking a page builder away from pages that use it is warned once, then let
 * through (SectionFieldGuard): the sections field removed from a blueprint or
 * from the fieldset it is imported from, or the fieldset deleted. Nothing is
 * said when no page holds a section in the field.
 */
class SectionFieldGuardTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // A person at the Control Panel: code saving on its own is not warned.
        $this->actingAs(User::make()->email('guard@example.com')->makeSuper());

        Fieldset::make('guard_sections')->setContents([
            'title' => 'Guard sections',
            'fields' => [[
                'handle' => 'page_sections',
                'field' => ['type' => 'replicator', 'sets' => [
                    'hero' => ['display' => 'Hero', 'sets' => [
                        'hero/style_1' => ['display' => 'Hero 1', 'fields' => [['handle' => 'title', 'field' => ['type' => 'text']]]],
                    ]],
                ]],
            ]],
        ])->save();

        Collection::make('guarded')->title('Guarded')->save();
        $this->blueprintWith([['import' => 'guard_sections']])->save();
    }

    protected function tearDown(): void
    {
        // Pages first: with them gone the guard has nothing to warn about.
        Entry::query()->where('collection', 'guarded')->get()->each->delete();
        Blueprint::find('collections.guarded.page')?->delete();
        Collection::findByHandle('guarded')?->delete();
        Fieldset::find('guard_sections')?->delete();

        parent::tearDown();
    }

    private function blueprintWith(array $fields)
    {
        return Blueprint::make('page')->setNamespace('collections.guarded')->setContents([
            'title' => 'Page',
            'tabs' => ['main' => ['sections' => [['fields' => array_merge([['handle' => 'title', 'field' => ['type' => 'text']]], $fields)]]]],
        ]);
    }

    private function page(string $title, array $sections): void
    {
        Entry::make()->collection('guarded')->slug(str($title)->slug())->data(['title' => $title, 'page_sections' => $sections])->save();
    }

    private function warned(callable $save): ?string
    {
        try {
            $save();
        } catch (ValidationException $error) {
            return collect($error->errors())->flatten()->first();
        }

        return null;
    }

    public function test_the_sections_field_taken_out_of_a_blueprint_in_use_is_warned_then_let_through(): void
    {
        $this->page('Front', [['id' => 'a', 'type' => 'hero/style_1', 'enabled' => true]]);

        $first = $this->warned(fn () => $this->blueprintWith([])->save());

        $this->assertNotNull($first, 'the first save is stopped');
        $this->assertStringContainsString('Page sections is used by 1 page (Front)', $first);
        $this->assertStringContainsString('import: guard_sections', file_get_contents(Blueprint::find('collections.guarded.page')->path()), 'nothing was written');

        $this->assertNull($this->warned(fn () => $this->blueprintWith([])->save()), 'the same save again goes through');
        $this->assertStringNotContainsString('guard_sections', file_get_contents(Blueprint::find('collections.guarded.page')->path()));
    }

    public function test_nothing_is_said_when_no_page_holds_a_section(): void
    {
        $this->page('Empty', []);

        $this->assertNull($this->warned(fn () => $this->blueprintWith([])->save()));
    }

    public function test_a_save_that_keeps_the_field_is_not_warned(): void
    {
        $this->page('Front', [['id' => 'a', 'type' => 'hero/style_1', 'enabled' => true]]);

        $this->assertNull($this->warned(fn () => $this->blueprintWith([['import' => 'guard_sections'], ['handle' => 'intro', 'field' => ['type' => 'text']]])->save()));
    }

    public function test_the_field_taken_out_of_its_fieldset_is_warned_with_the_pages_counted(): void
    {
        foreach (['One', 'Two', 'Three', 'Four', 'Five'] as $title) {
            $this->page($title, [['id' => $title, 'type' => 'hero/style_1', 'enabled' => true]]);
        }

        $fieldset = Fieldset::find('guard_sections');
        $fieldset->setContents(['title' => 'Guard sections', 'fields' => [['handle' => 'note', 'field' => ['type' => 'text']]]]);

        $first = $this->warned(fn () => $fieldset->save());

        $this->assertNotNull($first);
        $this->assertStringContainsString('Page sections is used by 5 pages', $first);
        $this->assertStringContainsString('and 2 more', $first);
        $this->assertNull($this->warned(fn () => $fieldset->save()));
    }

    public function test_code_saving_on_its_own_is_not_warned(): void
    {
        $this->page('Front', [['id' => 'a', 'type' => 'hero/style_1', 'enabled' => true]]);
        auth()->logout();

        $this->assertNull($this->warned(fn () => $this->blueprintWith([])->save()));
    }

    public function test_deleting_a_fieldset_in_use_is_warned_then_let_through(): void
    {
        $this->page('Front', [['id' => 'a', 'type' => 'hero/style_1', 'enabled' => true]]);

        $fieldset = Fieldset::find('guard_sections');

        $this->assertStringContainsString('Delete again', (string) $this->warned(fn () => $fieldset->delete()));
        $this->assertNotNull(Fieldset::find('guard_sections'), 'nothing was deleted');
    }
}
