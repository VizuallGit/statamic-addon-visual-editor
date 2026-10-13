<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\Commands\GenerateSetPreviews;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\User;

/**
 * The Patterns panel's preview tick and its button: the button starts a run
 * that retakes every picture, the panel is told a run is under way from the
 * first answer (before the process has booted), and once it is over the
 * answer says what could not be photographed — so the button never looks
 * like it did nothing.
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
    }

    private function signIn(): void
    {
        $user = User::make()->email('preview-tick@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);
    }

    public function test_closed_to_guests(): void
    {
        $this->postJson('/!/sve/previews/tick')->assertStatus(403);
        $this->postJson('/!/sve/previews/tick?force=1')->assertStatus(403);

        $this->assertFalse(Cache::has(GenerateSetPreviews::QUEUED));
    }

    public function test_the_button_starts_a_run_and_says_it_is_running_before_the_process_has_booted(): void
    {
        $this->signIn();
        Cache::put(GenerateSetPreviews::ERRORS, ['content/stats' => 'net::ERR_NAME_NOT_RESOLVED'], 60);

        $this->postJson('/!/sve/previews/tick?force=1')
            ->assertOk()
            ->assertJson(['running' => true, 'stale' => 0]);

        $this->assertTrue(Cache::get(GenerateSetPreviews::QUEUED));
        // The last run's failures are not this run's: they are not shown again.
        $this->assertFalse(Cache::has(GenerateSetPreviews::ERRORS));

        // The panel's next tick, while the process is still starting.
        $this->postJson('/!/sve/previews/tick')
            ->assertOk()
            ->assertJson(['running' => true, 'errors' => []]);
    }

    public function test_once_the_run_is_over_the_tick_says_what_could_not_be_photographed(): void
    {
        $this->signIn();
        Cache::put(GenerateSetPreviews::ERRORS, ['media_textbox' => 'net::ERR_NAME_NOT_RESOLVED at https://cuben.vizdev/…'], 60);

        $this->postJson('/!/sve/previews/tick')
            ->assertOk()
            ->assertJson([
                'running' => false,
                'errors' => ['media_textbox' => 'net::ERR_NAME_NOT_RESOLVED at https://cuben.vizdev/…'],
            ]);
    }

    public function test_a_machine_that_cannot_start_a_browser_does_not_keep_the_button_waiting(): void
    {
        $this->signIn();
        Cache::put(GenerateSetPreviews::ERRORS, ['_' => 'Screenshots cannot be taken: puppeteer is not installed.'], 60);

        $this->postJson('/!/sve/previews/tick')
            ->assertOk()
            ->assertJson(['running' => false, 'stale' => 0, 'errors' => ['_' => 'Screenshots cannot be taken: puppeteer is not installed.']]);

        $this->assertFalse(Cache::has('sve-previews:throttle'));
    }

    public function test_no_errors_is_an_empty_object_not_a_list(): void
    {
        $this->signIn();

        $this->assertStringContainsString('"errors":{}', $this->postJson('/!/sve/previews/tick')->getContent());
    }
}
