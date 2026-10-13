<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Cookie\CookieValuePrefix;
use Illuminate\Routing\RouteCollection;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Http\Middleware\RecordEditorWrite;
use MarioHamann\StatamicVisualEditor\LiveReload;
use MarioHamann\StatamicVisualEditor\StylePushStack;
use MarioHamann\StatamicVisualEditor\StylePushStackBridge;
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

    /** A page of this site, as the web group renders it — ahead of Statamic's catch-all route. */
    private function page(): void
    {
        $page = Route::middleware('web')->get('/sve-live-reload-page', fn () => response(
            '<html><head></head><body><main>Rendered for '.(User::current()?->email() ?? 'a guest').' in session '.session()->getId().'</main></body></html>',
            200,
            ['Content-Type' => 'text/html; charset=UTF-8'],
        ));

        $routes = new RouteCollection;
        $routes->add($page);

        foreach (Route::getRoutes()->getRoutes() as $route) {
            if ($route !== $page) {
                $routes->add($route);
            }
        }

        Route::setRoutes($routes);
    }

    /**
     * Polls naming the page, from a browser with session `$id`: the cookie as
     * Laravel's test client sends it, and as PHP-FPM hands it over raw in
     * $_COOKIE (encrypted, the way a browser sends it).
     */
    private function pollWithPage(array $query, string $id)
    {
        $name = config('session.cookie');
        $_COOKIE[$name] = encrypt(CookieValuePrefix::create($name, app('encrypter')->getKey()).$id, false);

        try {
            return $this->withCredentials()->withCookie($name, $id)->getJson('/!/sve/live-reload?'.http_build_query($query));
        } finally {
            unset($_COOKIE[$name]);
        }
    }

    public function test_a_poll_naming_its_page_answers_a_markup_change_with_the_page_rendered(): void
    {
        $page = $this->settled();
        $this->hold(3.0);
        $this->page();
        $this->signIn();
        $this->getJson('/!/sve/live-reload')->assertOk(); // the first request of a test boots Statamic
        $id = Str::random(40);

        $start = microtime(true);
        $response = $this->pollWithPage(['markup' => 'what the page was rendered with', 'build' => $page['build'], 'page' => '/sve-live-reload-page'], $id)->assertOk();

        $this->assertLessThan(1.0, microtime(true) - $start, 'answered the tick it is seen');
        $this->assertSame($page['markup'], $response->json('markup'));
        $html = $response->json('html');
        $this->assertIsString($html);
        $this->assertStringContainsString('<main>Rendered for live-reload-dev@example.com in session '.$id.'</main>', $html, 'as the signed-in user, in the browser\'s own session');
        $this->assertStringContainsString('id="sve-live-reload"', $html, 'through the web group, as a browser gets it');
        $response->assertCookie(config('session.cookie'), $id);
        $this->assertStringEndsWith('/!/sve/live-reload', parse_url(url()->current(), PHP_URL_PATH), 'the poll\'s request is put back');

        $this->getJson('/!/sve/live-reload')->assertOk(); // still signed in
    }

    public function test_without_the_browsers_own_session_cookie_no_page_is_rendered(): void
    {
        $page = $this->settled();
        $this->hold(3.0);
        $this->page();
        $this->signIn();
        $this->getJson('/!/sve/live-reload')->assertOk();

        $response = $this->getJson('/!/sve/live-reload?'.http_build_query(['markup' => 'old', 'build' => $page['build'], 'page' => '/sve-live-reload-page']))->assertOk();

        $this->assertArrayNotHasKey('html', $response->json(), 'a new session would put another CSRF token into the page');
    }

    public function test_a_page_is_rendered_only_for_a_markup_change(): void
    {
        $page = $this->settled();
        $this->hold(0.2);
        $this->page();
        $this->signIn();

        $held = $this->pollWithPage($page + ['page' => '/sve-live-reload-page'], Str::random(40))->assertOk();
        $this->assertArrayNotHasKey('html', $held->json(), 'nothing changed');

        $newBuild = $this->pollWithPage(['markup' => 'old', 'build' => 'old build', 'page' => '/sve-live-reload-page'], Str::random(40))->assertOk();
        $this->assertArrayNotHasKey('html', $newBuild->json(), 'a new build reloads the page anyway');
    }

    public function test_live_preview_names_no_page_and_gets_no_html(): void
    {
        $page = $this->settled();
        $this->hold(3.0);
        $this->signIn();
        $this->getJson('/!/sve/live-reload')->assertOk();

        $response = $this->poll(['markup' => 'what the page was rendered with', 'build' => $page['build']])->assertOk();

        $this->assertArrayNotHasKey('html', $response->json());
    }

    public function test_only_a_path_on_this_site_is_rendered(): void
    {
        $page = $this->settled();
        $this->hold(3.0);
        $this->page();
        $this->signIn();
        $this->getJson('/!/sve/live-reload')->assertOk();

        foreach (['//elsewhere.example/x', 'https://elsewhere.example/', 'sve-live-reload-page', '/\\elsewhere.example', '/!/sve/live-reload?markup=a&build=b', '/cp/dashboard', '/cp'] as $foreign) {
            $response = $this->pollWithPage(['markup' => 'old', 'build' => $page['build'], 'page' => $foreign], Str::random(40))->assertOk();
            $this->assertArrayNotHasKey('html', $response->json(), $foreign);
        }

        $missing = $this->pollWithPage(['markup' => 'old', 'build' => $page['build'], 'page' => '/no-such-page-here'], Str::random(40))->assertOk();
        $this->assertNull($missing->json('html'), 'a page that is not one: no HTML, the button fetches it itself');
    }

    /** A page route of this test, ahead of Statamic's catch-all. */
    private function route(string $uri, \Closure $action): void
    {
        $page = Route::middleware('web')->get($uri, $action);
        $routes = new RouteCollection;
        $routes->add($page);

        foreach (Route::getRoutes()->getRoutes() as $route) {
            if ($route !== $page) {
                $routes->add($route);
            }
        }

        Route::setRoutes($routes);
    }

    public function test_a_render_after_the_hold_carries_none_of_the_warm_renders_pushed_css(): void
    {
        // The addon is no dependency here; StylePushStackTest declares a stand-in
        // with the same static stack when the suite loads.
        if (! StylePushStack::available()) {
            $this->markTestSkipped('no style-push stack to push onto');
        }

        StylePushStackBridge::reset();
        $page = $this->settled();
        $this->hold(3.0);
        $renders = 0;
        $this->route('/sve-live-reload-pushed', function () use (&$renders) {
            StylePushStack::push('[render '.(++$renders).']');

            return response('<html><head><style>'.\Vizuall\StylePush\Tags\StylePush::getAll().'</style></head><body></body></html>', 200, ['Content-Type' => 'text/html']);
        });
        $this->signIn();
        $this->getJson('/!/sve/live-reload')->assertOk();

        $html = $this->pollWithPage(['markup' => 'old', 'build' => $page['build'], 'page' => '/sve-live-reload-pushed'], Str::random(40))->assertOk()->json('html');

        $this->assertSame(2, $renders, 'warm, then the render the answer carries');
        $this->assertStringContainsString('<style>[render 2]</style>', $html, 'the second render\'s CSS alone — a rule taken out stays out');
        StylePushStackBridge::reset();
    }

    public function test_the_render_after_the_hold_starts_from_the_session_as_it_is_then(): void
    {
        $handler = new class implements \SessionHandlerInterface
        {
            public int $reads = 0;

            public function open(string $path, string $name): bool
            {
                return true;
            }

            public function close(): bool
            {
                return true;
            }

            /** Until the hold, the session holds a flash; another request takes it out meanwhile. */
            public function read(string $id): string|false
            {
                $this->reads++;

                return serialize($this->reads <= 2 ? ['_token' => 't', 'flashed' => 'shown once'] : ['_token' => 't']);
            }

            public function write(string $id, string $data): bool
            {
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
        $this->app['session']->extend('sve-held-page', fn () => $handler);
        config(['session.driver' => 'sve-held-page']);

        $page = $this->settled();
        $this->hold(3.0);
        $this->route('/sve-live-reload-session', fn () => response(
            '<html><body>'.(session()->has('flashed') ? 'stale flash' : 'clean session').'</body></html>', 200, ['Content-Type' => 'text/html']
        ));
        $this->signIn();

        $html = $this->pollWithPage(['markup' => 'old', 'build' => $page['build'], 'page' => '/sve-live-reload-session'], Str::random(40))->assertOk()->json('html');

        $this->assertStringContainsString('clean session', $html, 'what another request took out during the hold stays out');
    }

    public function test_a_page_that_is_not_utf8_is_not_sent(): void
    {
        $page = $this->settled();
        $this->hold(3.0);
        $this->route('/sve-live-reload-latin1', fn () => response("<html><body>caf\xE9</body></html>", 200, ['Content-Type' => 'text/html']));
        $this->signIn();
        $this->getJson('/!/sve/live-reload')->assertOk();

        $response = $this->pollWithPage(['markup' => 'old', 'build' => $page['build'], 'page' => '/sve-live-reload-latin1'], Str::random(40));

        $response->assertOk();
        $this->assertNull($response->json('html'), 'the button fetches it itself; the poll does not become a 500');
    }

    public function test_the_render_is_marked_as_a_prefetch_not_a_visit(): void
    {
        $page = $this->settled();
        $this->hold(3.0);
        $this->route('/sve-live-reload-purpose', fn () => response(
            '<html><body>'.request()->header('Sec-Purpose').' '.request()->header('X-Sve-Live-Reload').' '.(request()->ajax() ? 'ajax' : 'page').'</body></html>', 200, ['Content-Type' => 'text/html']
        ));
        $this->signIn();
        $this->getJson('/!/sve/live-reload')->assertOk();

        $html = $this->pollWithPage(['markup' => 'old', 'build' => $page['build'], 'page' => '/sve-live-reload-purpose'], Str::random(40))->json('html');

        $this->assertStringContainsString('<body>prefetch 1 page<', $html);
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

    public function test_the_patterns_tick_is_not_stamped_as_an_editor_write(): void
    {
        $route = $this->app['router']->getRoutes()->getByName('sve.previews.tick');

        $this->assertNotNull($route);
        $this->assertContains(RecordEditorWrite::class, $route->excludedMiddleware(), 'a POST every 5 s that writes nothing must not make the next outside save look like the editor\'s');
    }
}
