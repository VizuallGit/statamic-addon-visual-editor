<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Boot\ScriptChrome;
use MarioHamann\StatamicVisualEditor\LayoutSlots;
use Statamic\Facades\Blueprint;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\User;

/**
 * The layout's places: one header, one footer, and the global sections under
 * every page. A place that holds one refuses a second — the current one has to
 * be taken out first.
 */
class LayoutSlotsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['statamic-visual-editor.layout' => [
            'header' => 'sve_t_head.header',
            'footer' => 'sve_t_foot.footer',
            'sections' => 'sve_t_layout.sections',
        ]]);

        $this->globalWithReplicator('sve_t_head', 'header', [
            'headers' => ['display' => 'Headers', 'sets' => [
                'header/custom' => ['display' => 'Custom header', 'fields' => []],
                'header/style_1' => ['display' => 'Header style 1', 'fields' => [['handle' => 'title', 'field' => ['type' => 'text']]]],
                'header/hidden' => ['display' => 'Hidden', 'hide' => true, 'fields' => []],
            ]],
        ]);

        $this->globalWithReplicator('sve_t_layout', 'sections', [
            'sections' => ['display' => 'Sections', 'sets' => [
                'global_section' => ['display' => 'Global section', 'fields' => [
                    ['handle' => 'global_section', 'field' => ['type' => 'entries', 'collections' => ['saved_sections'], 'max_items' => 1]],
                ]],
            ]],
        ]);
    }

    /**
     * Everything a test wrote goes again: the global sets, their blueprints,
     * entries, collections and the user land in the committed fixtures and in
     * the testbench's resources otherwise.
     */
    protected function tearDown(): void
    {
        foreach (['sve_t_head', 'sve_t_layout'] as $handle) {
            GlobalSet::findByHandle($handle)?->delete();
            Blueprint::find("globals.{$handle}")?->delete();
        }

        foreach (['sve-t-prefooter', 'sve-t-page'] as $id) {
            Entry::find($id)?->delete();
        }

        foreach (['saved_sections', 'sve_t_pages'] as $handle) {
            Collection::find($handle)?->delete();
        }

        User::findByEmail('layout-slots@example.com')?->delete();

        parent::tearDown();
    }

    private function globalWithReplicator(string $handle, string $field, array $sets): void
    {
        Blueprint::make($handle)->setNamespace('globals')->setContents([
            'tabs' => ['main' => ['sections' => [['fields' => [
                ['handle' => $field, 'field' => ['type' => 'replicator', 'max_sets' => 1, 'sets' => $sets]],
            ]]]]],
        ])->save();

        $set = GlobalSet::make($handle)->title($handle);
        $set->save();
        $set->makeLocalization('default')->data([])->save();
    }

    public function test_the_header_place_offers_its_sets_and_says_it_is_empty(): void
    {
        $header = LayoutSlots::describe('default')['header'];

        $this->assertTrue($header['single']);
        // A set with an empty fieldset is a header still to be built — offered.
        // One kept out of the picker (`hide`) is not.
        $this->assertSame(['header/custom', 'header/style_1'], array_column($header['types'], 'handle'));
        $this->assertSame([], $header['rows']);
    }

    public function test_a_place_without_its_global_set_is_not_offered(): void
    {
        $this->assertArrayNotHasKey('footer', LayoutSlots::describe('default'));
        $this->assertSame('missing', LayoutSlots::add('footer', 'footer/custom', 'default'));
    }

    public function test_the_header_holds_one_and_refuses_a_second(): void
    {
        $this->assertNull(LayoutSlots::add('header', 'header/style_1', 'default'));
        $this->assertSame('header/style_1', LayoutSlots::current('header', 'default'));

        $this->assertSame('taken', LayoutSlots::add('header', 'header/custom', 'default'));

        $rows = LayoutSlots::rows('header', 'default');
        $this->assertCount(1, $rows);
        $this->assertSame('header/style_1', $rows[0]['type']);
    }

    public function test_an_unknown_set_is_refused(): void
    {
        $this->assertSame('unknown', LayoutSlots::add('header', 'header/nope', 'default'));
        $this->assertSame('unknown', LayoutSlots::add('header', 'header/hidden', 'default'));
        $this->assertSame([], LayoutSlots::rows('header', 'default'));
    }

    public function test_deleting_the_header_makes_room_for_another(): void
    {
        LayoutSlots::add('header', 'header/style_1', 'default');
        $id = LayoutSlots::rows('header', 'default')[0]['id'];

        $this->assertFalse(LayoutSlots::remove('header', 'not-a-row', 'default'));
        $this->assertTrue(LayoutSlots::remove('header', $id, 'default'));
        $this->assertNull(LayoutSlots::current('header', 'default'));

        $this->assertNull(LayoutSlots::add('header', 'header/custom', 'default'));
        $this->assertSame('header/custom', LayoutSlots::current('header', 'default'));
    }

    public function test_global_sections_go_in_once_each(): void
    {
        Collection::make('saved_sections')->save();
        Collection::make('sve_t_pages')->save();
        Entry::make()->collection('saved_sections')->id('sve-t-prefooter')->slug('prefooter')->data(['title' => 'Pre-footer'])->save();
        Entry::make()->collection('sve_t_pages')->id('sve-t-page')->slug('page')->data(['title' => 'Page'])->save();

        $this->assertNull(LayoutSlots::add('sections', 'sve-t-prefooter', 'default'));
        $this->assertSame('twice', LayoutSlots::add('sections', 'sve-t-prefooter', 'default'));
        $this->assertSame('unknown', LayoutSlots::add('sections', 'sve-t-page', 'default'));

        $rows = LayoutSlots::describe('default')['sections']['rows'];
        $this->assertCount(1, $rows);
        $this->assertSame('sve-t-prefooter', $rows[0]['entry']);

        $saved = LayoutSlots::rows('sections', 'default')[0];
        $this->assertSame('global_section', $saved['type']);
        $this->assertSame('sve-t-prefooter', $saved['global_section']);
    }

    public function test_the_dock_opens_the_partial_of_the_header_in_use(): void
    {
        config([
            'statamic-visual-editor.chrome.header.global' => 'sve_t_head',
            'statamic-visual-editor.chrome.footer.global' => 'sve_t_foot',
        ]);

        LayoutSlots::add('header', 'header/custom', 'default');

        $this->assertSame('custom', ScriptChrome::styles()['header']);
    }

    public function test_a_guest_cannot_change_the_layout(): void
    {
        $this->postJson('/!/sve/layout-slots', ['slot' => 'header', 'value' => 'header/custom'])->assertStatus(403);
        $this->deleteJson('/!/sve/layout-slots', ['slot' => 'header', 'id' => 'x'])->assertStatus(403);
        $this->assertSame([], LayoutSlots::rows('header', 'default'));
    }

    public function test_the_endpoint_places_refuses_and_deletes(): void
    {
        $user = User::make()->email('layout-slots@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);

        $this->postJson('/!/sve/layout-slots', ['slot' => 'header', 'value' => 'header/style_1'])
            ->assertOk()
            ->assertJsonPath('slots.header.rows.0.type', 'header/style_1')
            ->assertJsonStructure(['chrome_templates' => ['header', 'footer']]);

        $this->postJson('/!/sve/layout-slots', ['slot' => 'header', 'value' => 'header/custom'])
            ->assertStatus(422)
            ->assertJsonPath('error', 'taken');

        $id = LayoutSlots::rows('header', 'default')[0]['id'];

        $this->deleteJson('/!/sve/layout-slots', ['slot' => 'header', 'id' => $id])
            ->assertOk()
            ->assertJsonPath('slots.header.rows', []);

        $this->getJson('/!/sve/layout-slots')->assertOk()->assertJsonPath('slots.header.rows', []);
    }
}
