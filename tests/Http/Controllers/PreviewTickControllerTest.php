<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\Commands\GenerateSetPreviews;
use MarioHamann\StatamicVisualEditor\SetPreview\Targets;
use MarioHamann\StatamicVisualEditor\SetPreviewGenerator;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\User;

/**
 * The Patterns panel's preview check. Only what changed is retaken: the
 * automatic check starts a run when something is stale, the save button
 * starts one now (retrying what failed), a probe never starts one — and a
 * run is reported `running` from the first answer until it is done, then
 * with what could not be photographed.
 */
class PreviewTickControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->forget();
    }

    protected function tearDown(): void
    {
        $this->forget();
        User::findByEmail('preview-tick@example.com')?->delete();

        parent::tearDown();
    }

    private function forget(): void
    {
        foreach ([GenerateSetPreviews::QUEUED, GenerateSetPreviews::ERRORS, 'sve-previews:running', 'sve-previews:throttle'] as $key) {
            Cache::forget($key);
        }

        Cache::forget(Targets::failedKey('content/stats'));
    }

    private function signIn(): void
    {
        $user = User::make()->email('preview-tick@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);
    }

    /** @param  array<string, string>  $statuses  handle => status */
    private function targets(array $statuses): void
    {
        $generator = \Mockery::mock(SetPreviewGenerator::class);
        $generator->shouldReceive('targets')->andReturnUsing(fn () => array_map(
            fn ($status) => ['status' => $status],
            // A failed memo that was cleared reads as stale again, as in Targets.
            array_map(fn ($status) => $status === 'failed' && ! Cache::has(Targets::failedKey('content/stats')) ? 'stale' : $status, $statuses),
        ));

        $this->app->instance(SetPreviewGenerator::class, $generator);
    }

    public function test_closed_to_guests(): void
    {
        $this->postJson('/!/sve/previews/tick')->assertStatus(403);
        $this->postJson('/!/sve/previews/tick?update=1')->assertStatus(403);

        $this->assertFalse(Cache::has(GenerateSetPreviews::QUEUED));
    }

    public function test_the_button_with_nothing_changed_starts_nothing_and_says_so(): void
    {
        $this->signIn();
        $this->targets(['hero/style_1' => 'fresh', 'banner/test' => 'renders_nothing']);

        $this->postJson('/!/sve/previews/tick?update=1')
            ->assertOk()
            ->assertJson(['running' => false, 'stale' => 0]);

        $this->assertFalse(Cache::has(GenerateSetPreviews::QUEUED));
    }

    public function test_the_button_retakes_what_changed_and_what_failed_and_is_running_from_the_first_answer(): void
    {
        $this->signIn();
        Cache::put(Targets::failedKey('content/stats'), 'content-stats-1.png', 60);
        Cache::put(GenerateSetPreviews::ERRORS, ['content/stats' => 'net::ERR_NAME_NOT_RESOLVED'], 60);
        $this->targets(['hero/style_1' => 'stale', 'content/stats' => 'failed', 'intro/intro' => 'fresh']);

        $this->postJson('/!/sve/previews/tick?update=1')
            ->assertOk()
            ->assertJson(['running' => true, 'stale' => 2, 'handles' => ['hero/style_1', 'content/stats']]);

        $this->assertFalse(Cache::has(Targets::failedKey('content/stats')));
        $this->assertFalse(Cache::has(GenerateSetPreviews::ERRORS));
        $this->assertTrue(Cache::get(GenerateSetPreviews::QUEUED));

        // The panel follows with probes while the process starts.
        $this->postJson('/!/sve/previews/tick?probe=1')->assertJson(['running' => true, 'errors' => []]);
    }

    public function test_the_automatic_check_starts_a_run_only_when_something_is_stale(): void
    {
        $this->signIn();
        $this->targets(['hero/style_1' => 'fresh']);

        $this->postJson('/!/sve/previews/tick')->assertJson(['running' => false, 'stale' => 0]);
        $this->assertFalse(Cache::has('sve-previews:throttle'));

        $this->targets(['hero/style_1' => 'stale']);

        $this->postJson('/!/sve/previews/tick')->assertJson(['running' => true, 'stale' => 1]);
        $this->assertTrue(Cache::has('sve-previews:throttle'));
        $this->assertTrue(Cache::get(GenerateSetPreviews::QUEUED));
    }

    public function test_a_probe_never_starts_a_run(): void
    {
        $this->signIn();
        $this->targets(['hero/style_1' => 'stale']);

        $this->postJson('/!/sve/previews/tick?probe=1')->assertJson(['running' => false, 'stale' => 1]);

        $this->assertFalse(Cache::has('sve-previews:throttle'));
        $this->assertFalse(Cache::has(GenerateSetPreviews::QUEUED));
    }

    public function test_once_the_run_is_over_the_tick_says_what_could_not_be_photographed(): void
    {
        $this->signIn();
        $this->targets([]);
        Cache::put(GenerateSetPreviews::ERRORS, ['media_textbox' => 'net::ERR_NAME_NOT_RESOLVED'], 60);

        $this->postJson('/!/sve/previews/tick?probe=1')
            ->assertOk()
            ->assertJson(['running' => false, 'errors' => ['media_textbox' => 'net::ERR_NAME_NOT_RESOLVED']]);
    }

    public function test_a_machine_that_cannot_start_a_browser_does_not_keep_anything_waiting(): void
    {
        $this->signIn();
        $this->targets(['hero/style_1' => 'missing']);
        Cache::put(GenerateSetPreviews::ERRORS, ['_' => 'Screenshots cannot be taken: puppeteer is not installed.'], 60);

        $this->postJson('/!/sve/previews/tick')
            ->assertOk()
            ->assertJson(['running' => false, 'stale' => 0, 'errors' => ['_' => 'Screenshots cannot be taken: puppeteer is not installed.']]);

        $this->assertFalse(Cache::has('sve-previews:throttle'));
    }

    public function test_no_errors_is_an_empty_object_not_a_list(): void
    {
        $this->signIn();
        $this->targets([]);

        $this->assertStringContainsString('"errors":{}', $this->postJson('/!/sve/previews/tick?probe=1')->getContent());
    }
}
