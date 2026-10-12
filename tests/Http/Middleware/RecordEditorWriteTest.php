<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\Http\Middleware\RecordEditorWrite;
use MarioHamann\StatamicVisualEditor\LiveReload;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\User;

/**
 * The editor's writes are stamped as its own: "writing" before the route
 * runs, the markup it left after a 2xx, nothing kept after a refusal, and
 * nothing at all for a read — the live-reload poll is one.
 */
class RecordEditorWriteTest extends TestCase
{
    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->root = sys_get_temp_dir().'/sve-record-write-'.uniqid();
        File::ensureDirectoryExists($this->root.'/views');
        file_put_contents($this->root.'/views/hero.antlers.html', '<h1>One</h1>');
        touch($this->root.'/views/hero.antlers.html', time() - 60);

        config(['statamic-visual-editor.live_reload.markup' => [$this->root.'/views']]);
        $this->forgetStamps();
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);
        User::findByEmail('record-write@example.com')?->delete();
        $this->forgetStamps();

        parent::tearDown();
    }

    private function forgetStamps(): void
    {
        Cache::forget('sve-live-reload:writing');
        Cache::forget('sve-live-reload:own');
    }

    /** One request through the middleware, with a session; `$route` runs as the route would. */
    private function through(string $method, int $status, ?\Closure $route = null): string
    {
        $session = $this->app['session']->driver();
        $session->setId(Str::random(40));
        $session->start();

        $request = Request::create('/!/sve/section-template', $method);
        $request->setLaravelSession($session);

        (new RecordEditorWrite)->handle($request, function () use ($route, $status) {
            if ($route) {
                $route();
            }

            return new Response('', $status);
        });

        return $session->getId();
    }

    private function saveTemplate(): void
    {
        file_put_contents($this->root.'/views/hero.antlers.html', '<h1>Typed in the dock</h1>');
        touch($this->root.'/views/hero.antlers.html', time() - 30);
    }

    public function test_a_write_that_succeeds_is_stamped_writing_then_own_for_its_session(): void
    {
        $during = null;

        $session = $this->through('POST', 200, function () use (&$during) {
            $during = Cache::get('sve-live-reload:writing');
            $this->saveTemplate();
        });

        $own = Cache::get('sve-live-reload:own');
        $markup = LiveReload::page()['markup'];

        $this->assertSame($session, $during['session'] ?? null, 'stamped before the route ran');
        $this->assertSame($session, $own['session']);
        $this->assertSame($markup, $own['sig'], 'the markup the write left');
        $this->assertTrue(LiveReload::own($markup, $session));
    }

    public function test_a_delete_is_a_write_too(): void
    {
        $session = $this->through('DELETE', 204);

        $this->assertSame($session, Cache::get('sve-live-reload:own')['session'] ?? null);
    }

    public function test_a_read_records_nothing(): void
    {
        $during = 'not run';

        $this->through('GET', 200, function () use (&$during) {
            $during = Cache::get('sve-live-reload:writing');
        });

        $this->assertNull($during);
        $this->assertNull(Cache::get('sve-live-reload:writing'));
        $this->assertNull(Cache::get('sve-live-reload:own'));
    }

    public function test_a_refused_write_is_stamped_writing_but_never_own(): void
    {
        $during = null;

        $session = $this->through('POST', 422, function () use (&$during) {
            $during = Cache::get('sve-live-reload:writing');
        });

        $this->assertSame($session, $during['session'] ?? null);
        $this->assertNull(Cache::get('sve-live-reload:own'));
        $this->assertNull(Cache::get('sve-live-reload:writing'), 'the window closes with the request');

        // A save from outside right after is not mistaken for the refused one.
        $this->saveTemplate();
        $this->assertFalse(LiveReload::own(LiveReload::page()['markup'], $session));
    }

    public function test_both_route_groups_carry_it_and_the_dock_keeps_its_untrimmed_strings(): void
    {
        foreach (['sve.section-template.update', 'sve.file-manager.update', 'sve.component.store', 'sve.section-types.store', 'sve.chrome-prefs.update', 'sve.live-reload'] as $name) {
            $route = Route::getRoutes()->getByName($name);

            $this->assertNotNull($route, $name);
            $this->assertContains(RecordEditorWrite::class, $route->gatherMiddleware(), $name);
        }

        $dock = Route::getRoutes()->getByName('sve.section-template.update');
        $this->assertContains(\Illuminate\Foundation\Http\Middleware\TrimStrings::class, $dock->excludedMiddleware());
        $this->assertContains(\Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class, $dock->excludedMiddleware());
    }

    public function test_a_real_editor_route_stamps_the_session_it_was_called_with(): void
    {
        $user = User::make()->email('record-write@example.com')->makeSuper();
        $user->save();
        $session = Str::random(40);

        // Refused (signed out): stamped writing, then nothing kept.
        $this->withCredentials()->withCookie(config('session.cookie'), $session)
            ->postJson('/!/sve/chrome-prefs', ['prefs' => ['sve-right-dock-width' => '400']])
            ->assertForbidden();
        $this->assertNull(Cache::get('sve-live-reload:own'));
        $this->assertNull(Cache::get('sve-live-reload:writing'));

        $this->actingAs($user)->withCredentials()->withCookie(config('session.cookie'), $session)
            ->postJson('/!/sve/chrome-prefs', ['prefs' => ['sve-right-dock-width' => '400']])
            ->assertOk();
        $this->assertSame($session, Cache::get('sve-live-reload:own')['session'] ?? null);
    }
}
