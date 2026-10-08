<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Controllers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\User;

/**
 * A design screenshot per page and screen size: uploaded, listed, served back
 * to the editor and removed — and refused to anyone outside the Control Panel,
 * for a size the site does not have, and when it is not an image.
 */
class DesignOverlayControllerTest extends TestCase
{
    protected string $entryId;

    protected function setUp(): void
    {
        parent::setUp();

        Collection::make('design_overlay_pages')->save();
        $entry = Entry::make()->collection('design_overlay_pages')->slug('home')->data(['title' => 'Home']);
        $entry->save();
        $this->entryId = $entry->id();

        $user = User::make()->email('design-overlay@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);
    }

    protected function tearDown(): void
    {
        File::deleteDirectory(storage_path('statamic-visual-editor/design-overlays'));
        Entry::find($this->entryId)?->delete();
        Collection::find('design_overlay_pages')?->delete();
        User::findByEmail('design-overlay@example.com')?->delete();
        // The feature map is cached statically across tests; the next one reads its own config.
        Features::flush();

        parent::tearDown();
    }

    protected function png(int $width = 40, int $height = 20): UploadedFile
    {
        return UploadedFile::fake()->image('design.png', $width, $height);
    }

    public function test_a_page_starts_with_no_design_for_any_size(): void
    {
        $overlays = $this->getJson("/!/sve/design-overlay/{$this->entryId}")->assertOk()->json('overlays');

        $this->assertSame(['laptop', 'tablet', 'mobile'], array_keys($overlays));
        $this->assertSame([null, null, null], array_values($overlays));
    }

    public function test_an_upload_is_kept_for_its_size_only_and_served_back(): void
    {
        $overlays = $this->post("/!/sve/design-overlay/{$this->entryId}/tablet", ['file' => $this->png(40, 20)], ['Accept' => 'application/json'])
            ->assertOk()
            ->json('overlays');

        $this->assertNull($overlays['laptop']);
        $this->assertNull($overlays['mobile']);
        $this->assertSame(40, $overlays['tablet']['width']);
        $this->assertSame(20, $overlays['tablet']['height']);
        $this->assertStringContainsString("/!/sve/design-overlay/{$this->entryId}/tablet/image?v=", $overlays['tablet']['url']);

        $this->get("/!/sve/design-overlay/{$this->entryId}/tablet/image")->assertOk();
        $this->get("/!/sve/design-overlay/{$this->entryId}/mobile/image")->assertNotFound();
    }

    public function test_a_new_upload_replaces_the_old_one_whatever_its_format(): void
    {
        $this->post("/!/sve/design-overlay/{$this->entryId}/laptop", ['file' => $this->png()], ['Accept' => 'application/json'])->assertOk();
        $this->post(
            "/!/sve/design-overlay/{$this->entryId}/laptop",
            ['file' => UploadedFile::fake()->image('design.jpg', 60, 30)],
            ['Accept' => 'application/json'],
        )->assertOk();

        $files = File::files(storage_path("statamic-visual-editor/design-overlays/{$this->entryId}"));

        $this->assertCount(1, $files);
        $this->assertSame('laptop.jpg', $files[0]->getFilename());
    }

    public function test_removing_a_size_leaves_the_others(): void
    {
        $this->post("/!/sve/design-overlay/{$this->entryId}/laptop", ['file' => $this->png()], ['Accept' => 'application/json'])->assertOk();
        $this->post("/!/sve/design-overlay/{$this->entryId}/mobile", ['file' => $this->png()], ['Accept' => 'application/json'])->assertOk();

        $overlays = $this->deleteJson("/!/sve/design-overlay/{$this->entryId}/laptop")->assertOk()->json('overlays');

        $this->assertNull($overlays['laptop']);
        $this->assertNotNull($overlays['mobile']);
    }

    public function test_a_file_that_is_not_an_image_is_refused(): void
    {
        $this->post(
            "/!/sve/design-overlay/{$this->entryId}/laptop",
            ['file' => UploadedFile::fake()->create('design.pdf', 10, 'application/pdf')],
            ['Accept' => 'application/json'],
        )->assertStatus(422);
    }

    public function test_a_size_the_site_does_not_have_and_a_page_that_does_not_exist_are_refused(): void
    {
        $this->post("/!/sve/design-overlay/{$this->entryId}/watch", ['file' => $this->png()], ['Accept' => 'application/json'])->assertNotFound();
        $this->getJson('/!/sve/design-overlay/no-such-entry')->assertNotFound();
        $this->getJson('/!/sve/design-overlay/..%2F..%2Fetc')->assertNotFound();
    }

    public function test_nobody_outside_the_control_panel_gets_the_files(): void
    {
        $this->post("/!/sve/design-overlay/{$this->entryId}/laptop", ['file' => $this->png()], ['Accept' => 'application/json'])->assertOk();

        auth()->logout();

        $this->getJson("/!/sve/design-overlay/{$this->entryId}")->assertForbidden();
        $this->get("/!/sve/design-overlay/{$this->entryId}/laptop/image")->assertForbidden();
    }

    public function test_switched_off_on_the_settings_screen_it_answers_nothing(): void
    {
        config(['statamic-visual-editor.features.design_overlay' => false]);
        Features::flush();

        $this->getJson("/!/sve/design-overlay/{$this->entryId}")->assertForbidden();
    }
}
