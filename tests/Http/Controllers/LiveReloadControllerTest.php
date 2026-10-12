<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\LiveReload;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\User;

/**
 * The live-reload poll: closed unless the toggle is on and the user is one the
 * settings name (super by default); answers the two signatures, whether a
 * build runs, whether the markup is this session's own editor write and the
 * built stylesheet — never the internals the controller acts on. Held open
 * when the page names the signatures it holds.
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
        $this->forgetStamps();
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);
        User::findByEmail('live-reload-dev@example.com')?->delete();
        User::findByEmail('live-reload-editor@example.com')?->delete();
        $this->forgetStamps();
        Features::flush();

        parent::tearDown();
    }

    private function forgetStamps(): void
    {
        foreach (['attempt', 'flushed', 'writing', 'own'] as $key) {
            Cache::forget('sve-live-reload:'.$key);
        }
    }

    /** A template and a build newer than it: nothing changes, nothing is stale. */
    private function settled(): array
    {
        file_put_contents($this->root.'/views/home.antlers.html', '<h1>Hi</h1>');
        touch($this->root.'/views/home.antlers.html', time() - 100);
        file_put_contents($this->root.'/public/build/manifest.json', '{}');
        touch($this->root.'/public/build/manifest.json', time() - 50);

        return LiveReload::page();
    }

    /** Held for a fraction of a second here; the real hold is LiveReload::HOLD. */
    private function hold(float $seconds): void
    {
        config([
            'statamic-visual-editor.live_reload.hold' => $seconds,
            'statamic-visual-editor.live_reload.tick_ms' => 20,
        ]);
    }

    private function poll(array $have, ?string $session = null)
    {
        if ($session !== null) {
            // JSON requests carry cookies only with credentials.
            $this->withCredentials()->withCookie(config('session.cookie'), $session);
        }

        return $this->getJson('/!/sve/live-reload?'.http_build_query($have));
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

        $this->assertSame(['markup', 'build', 'building', 'error', 'own', 'css'], array_keys($response->json()));
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

    public function test_a_poll_naming_the_current_signatures_is_held(): void
    {
        $page = $this->settled();
        $this->hold(0.3);
        $this->signIn();

        $start = microtime(true);
        $response = $this->poll($page)->assertOk();
        $elapsed = microtime(true) - $start;

        $this->assertGreaterThanOrEqual(0.3, $elapsed);
        $this->assertLessThan(1.0, $elapsed);
        $this->assertSame($page['markup'], $response->json('markup'));
        $this->assertSame(['markup', 'build', 'building', 'error', 'own', 'css'], array_keys($response->json()));
    }

    public function test_a_poll_holding_old_signatures_is_answered_at_once(): void
    {
        $page = $this->settled();
        $this->hold(3.0);
        $this->signIn();
        $this->getJson('/!/sve/live-reload')->assertOk(); // the first request of a test boots Statamic

        $start = microtime(true);
        $response = $this->poll(['markup' => 'what the page was rendered with', 'build' => $page['build']])->assertOk();

        // A foreign markup change is answered the tick it is seen, not held.
        $this->assertLessThan(1.0, microtime(true) - $start);
        $this->assertArrayHasKey('changed', $response->json());
        $this->assertSame($page['markup'], $response->json('markup'));
        $this->assertSame($page['build'], $response->json('build'));
    }

    public function test_a_poll_naming_no_signatures_is_answered_at_once(): void
    {
        $this->settled();
        $this->hold(3.0);
        $this->signIn();
        $this->getJson('/!/sve/live-reload')->assertOk(); // the first request of a test boots Statamic

        $start = microtime(true);
        $this->getJson('/!/sve/live-reload')->assertOk();
        $this->getJson('/!/sve/live-reload?markup=only-one')->assertOk();

        $this->assertLessThan(1.0, microtime(true) - $start, 'two answers, neither held for the three-second hold');
    }

    public function test_a_site_without_a_build_is_held_too(): void
    {
        // `build=` arrives as null (ConvertEmptyStringsToNull); still a signature.
        $page = $this->settled();
        unlink($this->root.'/public/build/manifest.json');
        // No manifest means stale sources; a build that just ran keeps it quiet.
        Cache::forever('sve-live-reload:attempt', ['sig' => LiveReload::status()['sources'], 'ok' => true, 'at' => time() - 60]);
        $page = LiveReload::page();
        $this->assertSame('', $page['build']);
        $this->hold(0.3);
        $this->signIn();

        $start = microtime(true);
        $response = $this->poll($page)->assertOk();

        $this->assertGreaterThanOrEqual(0.3, microtime(true) - $start);
        $this->assertSame('', $response->json('build'));
    }

    public function test_own_is_true_only_for_the_session_that_wrote(): void
    {
        $this->settled();
        $this->signIn();
        $mine = Str::random(40);

        LiveReload::writing($mine);
        file_put_contents($this->root.'/views/home.antlers.html', '<h1>Typed in the dock</h1>');
        touch($this->root.'/views/home.antlers.html', time() - 70); // still older than the build
        LiveReload::wrote($mine);

        $this->assertTrue($this->poll([], $mine)->assertOk()->json('own'));
        $this->assertFalse($this->poll([], Str::random(40))->assertOk()->json('own'));
    }

    /**
     * Laravel writes the session back at the end of a request as it read it
     * at the start. A poll held for seconds must write back what is there
     * after the hold, or it undoes whatever another request wrote meanwhile.
     */
    public function test_a_held_poll_writes_back_the_session_as_it_is_after_the_hold(): void
    {
        $handler = new class implements \SessionHandlerInterface
        {
            public int $reads = 0;

            public array $written = [];

            public function open(string $path, string $name): bool
            {
                return true;
            }

            public function close(): bool
            {
                return true;
            }

            /** Each read finds what "another request" wrote since the last. */
            public function read(string $id): string|false
            {
                $this->reads++;

                return serialize(['written_elsewhere' => $this->reads]);
            }

            public function write(string $id, string $data): bool
            {
                $this->written = unserialize($data);

                return true;
            }

            public function destroy(string $id): bool
            {
                return true;
            }

            public function gc(int $max_lifetime): int|false
            {
                return 0;
            }
        };

        $this->app['session']->extend('sve-held', fn () => $handler);
        config(['session.driver' => 'sve-held']);

        $page = $this->settled();
        $this->hold(0.2);
        $this->signIn();

        $this->poll($page)->assertOk();

        $this->assertSame(2, $handler->reads);
        $this->assertSame(2, $handler->written['written_elsewhere'] ?? null, 'the copy read after the hold went back');
    }
}
