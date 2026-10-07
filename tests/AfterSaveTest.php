<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\AfterSave;
use Statamic\Facades\Collection;
use Statamic\Facades\Preference;
use Statamic\Preferences\DefaultPreferences;

/**
 * After a save the editor stays open: "continue editing" is the site default
 * for every collection, under anything set elsewhere.
 *
 * Its own collections: the fixtures' `pages` is shared with every other test,
 * and saving over it and deleting it took pages.yaml and its entry with it.
 */
class AfterSaveTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Collection::make('after_save_pages')->save();
        Collection::make('after_save_cases')->save();
        @unlink(resource_path('preferences.yaml'));
        app()->forgetInstance(DefaultPreferences::class);
    }

    protected function tearDown(): void
    {
        @unlink(resource_path('preferences.yaml'));
        Collection::find('after_save_pages')?->delete();
        Collection::find('after_save_cases')?->delete();

        parent::tearDown();
    }

    public function test_every_collection_gets_continue_editing_as_its_default(): void
    {
        $this->assertSame('continue_editing', Preference::default()->get('collections.after_save_pages.after_save'));
        $this->assertSame('continue_editing', Preference::default()->get('collections.after_save_cases.after_save'));
        $this->assertSame('continue_editing', Preference::all()['collections']['after_save_pages']['after_save']);
    }

    public function test_the_site_file_wins_and_is_written_without_what_the_addon_supplied(): void
    {
        file_put_contents(resource_path('preferences.yaml'), "collections:\n  after_save_pages:\n    after_save: listing\n");
        app()->forgetInstance(DefaultPreferences::class);

        $defaults = Preference::default();

        $this->assertSame('listing', $defaults->get('collections.after_save_pages.after_save'));
        $this->assertSame('continue_editing', $defaults->get('collections.after_save_cases.after_save'));

        $defaults->save();

        $written = (string) file_get_contents(resource_path('preferences.yaml'));

        $this->assertStringContainsString('listing', $written);
        $this->assertStringNotContainsString('after_save_cases', $written);
        $this->assertSame('continue_editing', Preference::default()->get('collections.after_save_cases.after_save'));
    }

    public function test_null_in_the_config_leaves_it_to_statamic(): void
    {
        config(['statamic-visual-editor.after_save' => null]);
        app()->forgetInstance(DefaultPreferences::class);

        $this->assertNull(AfterSave::option());
        $this->assertNull(Preference::default()->get('collections.after_save_pages.after_save'));
    }
}
