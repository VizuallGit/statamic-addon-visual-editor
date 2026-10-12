<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;
use MarioHamann\StatamicVisualEditor\BuiltAssets;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectLiveReload;
use MarioHamann\StatamicVisualEditor\LiveReload;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\User;

class InjectLiveReloadTest extends TestCase
{
    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        Request::macro('isLivePreview', fn () => false);

        $this->root = sys_get_temp_dir().'/sve-live-reload-mw-'.uniqid();
        File::ensureDirectoryExists($this->root.'/views');
        File::ensureDirectoryExists($this->root.'/public');
        $this->app->usePublicPath($this->root.'/public');
        file_put_contents($this->root.'/views/home.antlers.html', '<h1>Hi</h1>');

        config([
            'statamic-visual-editor.features.live_reload' => true,
            'statamic-visual-editor.live_reload.markup' => [$this->root.'/views'],
            'statamic-visual-editor.live_reload.sources' => [$this->root.'/views'],
        ]);
        Features::flush();
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);
        User::findByEmail('live-reload-dev@example.com')?->delete();
        Features::flush();

        parent::tearDown();
    }

    private function signIn(): void
    {
        $user = User::make()->email('live-reload-dev@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);
    }

    private function inject(?Request $request = null, string $type = 'text/html'): string
    {
        $response = (new InjectLiveReload)->handle(
            $request ?? Request::create('/about', 'GET'),
            fn () => new Response('<html><head></head><body><main>Page</main></body></html>', 200, ['Content-Type' => $type])
        );

        return $response->getContent();
    }

    public function test_the_button_goes_before_the_end_of_body_with_the_page_signatures(): void
    {
        $this->signIn();

        $html = $this->inject();
        $page = LiveReload::page();

        $this->assertStringContainsString('<main>Page</main>', $html);
        $this->assertMatchesRegularExpression('#id="sve-live-reload".*</script>\s*</body>#s', $html);
        $this->assertStringContainsString('"markup":"'.$page['markup'].'"', $html);
        $this->assertStringContainsString('"url":"/!/sve/live-reload"', $html);
        $this->assertSame(1, substr_count($html, '</script>'), 'nothing in the config closes the script');
    }

    public function test_the_button_gets_the_built_morph_it_imports_for_new_markup(): void
    {
        $this->signIn();

        $html = $this->inject();
        $url = BuiltAssets::url('resources/js/live-reload-morph.js');

        $this->assertMatchesRegularExpression('#^/!/sve/build/assets/live-reload-morph-[\w-]+\.js$#', $url);
        $this->assertStringContainsString('"morph":"'.$url.'"', $html);
        $this->assertTrue(BuiltAssets::isAllowed(substr($url, strlen('/!/sve/build/'))), 'the build route serves it');
    }

    public function test_not_for_guests(): void
    {
        $this->assertStringNotContainsString('sve-live-reload', $this->inject());
    }

    public function test_not_when_the_toggle_is_off(): void
    {
        config(['statamic-visual-editor.features.live_reload' => false]);
        Features::flush();
        $this->signIn();

        $this->assertStringNotContainsString('sve-live-reload', $this->inject());
    }

    public function test_not_in_live_preview(): void
    {
        Request::macro('isLivePreview', fn () => true);
        $this->signIn();

        $this->assertStringNotContainsString('sve-live-reload', $this->inject());
    }

    public function test_not_on_json_or_a_performance_reading(): void
    {
        $this->signIn();

        $this->assertStringNotContainsString('sve-live-reload', $this->inject(null, 'application/json'));
        $this->assertStringNotContainsString('sve-live-reload', $this->inject(Request::create('/about?sve_perf=1', 'GET')));
    }

    public function test_not_while_npm_run_dev_runs(): void
    {
        file_put_contents($this->root.'/public/hot', 'http://localhost:5173');
        $this->signIn();

        $this->assertStringNotContainsString('sve-live-reload', $this->inject());
    }
}
