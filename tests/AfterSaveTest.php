<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\AfterSave;
use Statamic\Facades\Collection;
use Statamic\Facades\Preference;
use Statamic\Preferences\DefaultPreferences;

/**
 * After a save the editor stays open: "continue editing" is the site default
 * for every collection, under anything set elsewhere.
 */
class AfterSaveTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Collection::make('pages')->save();
        Collection::make('cases')->save();
        @unlink(resource_path('preferences.yaml'));
        app()->forgetInstance(DefaultPreferences::class);
    }

    protected function tearDown(): void
    {
        @unlink(resource_path('preferences.yaml'));
        Collection::find('pages')?->delete();
        Collection::find('cases')?->delete();

        parent::tearDown();
    }

    public function test_every_collection_gets_continue_editing_as_its_default(): void
    {
        $this->assertSame('continue_editing', Preference::default()->get('collections.pages.after_save'));
        $this->assertSame('continue_editing', Preference::default()->get('collections.cases.after_save'));
        $this->assertSame('continue_editing', Preference::all()['collections']['pages']['after_save']);
    }

    public function test_the_site_file_wins_and_is_written_without_what_the_addon_supplied(): void
    {
        file_put_contents(resource_path('preferences.yaml'), "collections:\n  pages:\n    after_save: listing\n");
        app()->forgetInstance(DefaultPreferences::class);

        $defaults = Preference::default();

        $this->assertSame('listing', $defaults->get('collections.pages.after_save'));
        $this->assertSame('continue_editing', $defaults->get('collections.cases.after_save'));

        $defaults->save();

        $written = (string) file_get_contents(resource_path('preferences.yaml'));

        $this->assertStringContainsString('listing', $written);
        $this->assertStringNotContainsString('cases', $written);
        $this->assertSame('continue_editing', Preference::default()->get('collections.cases.after_save'));
    }

    public function test_null_in_the_config_leaves_it_to_statamic(): void
    {
        config(['statamic-visual-editor.after_save' => null]);
        app()->forgetInstance(DefaultPreferences::class);

        $this->assertNull(AfterSave::option());
        $this->assertNull(Preference::default()->get('collections.pages.after_save'));
    }
}
