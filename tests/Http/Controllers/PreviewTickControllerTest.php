<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SetPreview\Targets;
use MarioHamann\StatamicVisualEditor\SetPreviewGenerator;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\User;

/**
 * The Patterns panel's preview tick: who may call it, why a section has no
 * picture (`blocked`), and the button's `retry`, which clears the failed and
 * drew-nothing memos so those sections are tried again.
 */
class PreviewTickControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['statamic-visual-editor.features.sections' => true]);
        Features::flush();
        Cache::flush();
    }

    protected function tearDown(): void
    {
        User::findByEmail('previews@example.com')?->delete();
        Features::flush();

        parent::tearDown();
    }

    private function signIn(): void
    {
        $user = User::make()->email('previews@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);
    }

    /**
     * A generator whose answer follows the memos the way Targets does:
     * `x` reads as failed while its memo names the current file, `y` has
     * nothing to photograph, `z` is up to date.
     */
    private function fakeTargets(): void
    {
        $this->app->instance(SetPreviewGenerator::class, new class extends SetPreviewGenerator
        {
            public function targets(?string $only = null): array
            {
                $x = Cache::get(Targets::failedKey('x')) === 'x-0123abcd.png' ? 'failed' : 'missing';

                return [
                    'x' => ['status' => $x],
                    'y' => ['status' => 'no_source'],
                    'z' => ['status' => 'fresh'],
                ];
            }
        });
    }

    public function test_a_guest_cannot_tick(): void
    {
        $this->postJson('/!/sve/previews/tick')->assertStatus(403);
    }

    public function test_a_signed_in_user_gets_the_answer_with_its_reasons(): void
    {
        $this->signIn();

        $this->postJson('/!/sve/previews/tick', ['probe' => true])
            ->assertOk()
            ->assertJsonStructure(['stale', 'handles', 'running', 'blocked']);
    }

    public function test_blocked_names_each_section_that_gets_no_picture_and_why(): void
    {
        $this->signIn();
        $this->fakeTargets();
        Cache::put(Targets::failedKey('x'), 'x-0123abcd.png');

        $this->postJson('/!/sve/previews/tick')
            ->assertOk()
            ->assertJson([
                'stale' => 0,
                'handles' => [],
                'blocked' => ['x' => 'failed', 'y' => 'no_source'],
            ])
            ->assertJsonMissingPath('blocked.z');

        $this->assertSame('x-0123abcd.png', Cache::get(Targets::failedKey('x')), 'a plain tick leaves the memo alone');
    }

    public function test_retry_forgets_the_memos_and_counts_the_section_again(): void
    {
        $this->signIn();
        $this->fakeTargets();
        Cache::put(Targets::failedKey('x'), 'x-0123abcd.png');
        Cache::put(Targets::emptyKey('x'), 'x-0123abcd.png');

        $response = $this->postJson('/!/sve/previews/tick', ['retry' => true])->assertOk();

        $this->assertNull(Cache::get(Targets::failedKey('x')));
        $this->assertNull(Cache::get(Targets::emptyKey('x')));
        $this->assertSame(1, $response->json('stale'));
        $this->assertSame(['x'], $response->json('handles'));
        $this->assertSame(['y' => 'no_source'], $response->json('blocked'));
        $this->assertFalse(Cache::has('sve-previews:throttle'), 'a retry starts without the throttle');
    }

    public function test_a_probe_never_starts_a_run(): void
    {
        $this->signIn();
        $this->fakeTargets();

        $this->postJson('/!/sve/previews/tick', ['probe' => true])
            ->assertOk()
            ->assertJson(['stale' => 1, 'handles' => ['x']]);
        $this->assertFalse(Cache::has('sve-previews:throttle'));

        $this->postJson('/!/sve/previews/tick')->assertOk();
        $this->assertTrue(Cache::has('sve-previews:throttle'), 'a plain tick goes through the throttle');
    }
}
