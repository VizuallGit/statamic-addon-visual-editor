<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\User;

/**
 * The live-reload poll: closed unless the toggle is on and the user is one the
 * settings name (super by default); answers the two signatures and whether a
 * build runs, never the internals the controller acts on.
 */
class LiveReloadControllerTest extends TestCase
{
    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->root = sys_get_temp_dir().'/sve-live-reload-http-'.uniqid();
        File::ensureDirectoryExists($this->root.'/views');
        File::ensureDirectoryExists($this->root.'/public/build');
        $this->app->usePublicPath($this->root.'/public');

        config([
            'statamic-visual-editor.features.live_reload' => true,
            'statamic-visual-editor.live_reload.markup' => [$this->root.'/views'],
            'statamic-visual-editor.live_reload.sources' => [$this->root.'/views'],
        ]);
        Features::flush();
        Cache::forget('sve-live-reload:attempt');
        Cache::forget('sve-live-reload:flushed');
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);
        User::findByEmail('live-reload-dev@example.com')?->delete();
        User::findByEmail('live-reload-editor@example.com')?->delete();
        Cache::forget('sve-live-reload:attempt');
        Cache::forget('sve-live-reload:flushed');
        Features::flush();

        parent::tearDown();
    }

    private function signIn(bool $super = true): void
    {
        $user = User::make()->email($super ? 'live-reload-dev@example.com' : 'live-reload-editor@example.com');

        if ($super) {
            $user->makeSuper();
        }

        $user->save();
        $this->actingAs($user);
    }

    public function test_closed_to_guests(): void
    {
        $this->getJson('/!/sve/live-reload')->assertForbidden();
    }

    public function test_closed_when_the_toggle_is_off(): void
    {
        config(['statamic-visual-editor.features.live_reload' => false]);
        Features::flush();
        $this->signIn();

        $this->getJson('/!/sve/live-reload')->assertForbidden();
    }

    public function test_closed_to_a_non_super_user_by_default(): void
    {
        $this->signIn(super: false);

        $this->getJson('/!/sve/live-reload')->assertForbidden();
    }

    public function test_answers_the_signatures_and_nothing_else(): void
    {
        file_put_contents($this->root.'/views/home.antlers.html', '<h1>Hi</h1>');
        touch($this->root.'/views/home.antlers.html', time() - 100);
        file_put_contents($this->root.'/public/build/manifest.json', '{}');
        touch($this->root.'/public/build/manifest.json', time() - 50);
        $this->signIn();

        $response = $this->getJson('/!/sve/live-reload')->assertOk();

        $this->assertSame(['markup', 'build', 'building', 'error'], array_keys($response->json()));
        $this->assertFalse($response->json('building'));
        $this->assertNull($response->json('error'));
        $this->assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));
    }

    public function test_stale_sources_answer_building_at_once(): void
    {
        file_put_contents($this->root.'/public/build/manifest.json', '{}');
        touch($this->root.'/public/build/manifest.json', time() - 100);
        file_put_contents($this->root.'/views/home.antlers.html', '<h1>new class</h1>');
        touch($this->root.'/views/home.antlers.html', time() - 20);
        $this->signIn();

        $this->getJson('/!/sve/live-reload')->assertOk()->assertJson(['building' => true]);
    }
}
