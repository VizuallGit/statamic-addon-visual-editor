<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectBridgeScript;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectPageTransitions;
use MarioHamann\StatamicVisualEditor\PageTransitionSettings;

class PageTransitionSettingsTest extends TestCase
{
    private string $dir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->dir = sys_get_temp_dir().'/sve-page-transitions-'.uniqid();
        config(['statamic-visual-editor.page_transitions.file' => $this->dir.'/visual-editor/page-transitions.yaml']);
        PageTransitionSettings::forget();
    }

    protected function tearDown(): void
    {
        @unlink($this->dir.'/visual-editor/page-transitions.yaml');
        @rmdir($this->dir.'/visual-editor');
        @rmdir($this->dir);
        PageTransitionSettings::forget();

        parent::tearDown();
    }

    public function test_nothing_saved_means_nothing_added_the_site_decides(): void
    {
        $this->assertNull(PageTransitionSettings::read());
        $this->assertSame('', PageTransitionSettings::css(null));
    }

    public function test_settings_are_cleaned_to_what_the_css_can_take(): void
    {
        $this->assertSame(
            ['enabled' => true, 'style' => 'crossfade', 'duration' => 1.5, 'header' => true],
            PageTransitionSettings::clean(['style' => 'zoom', 'duration' => '9', 'header' => 'true'])
        );
        $this->assertSame(0.1, PageTransitionSettings::clean(['duration' => 0])['duration']);
        $this->assertFalse(PageTransitionSettings::clean(['enabled' => 'false'])['enabled']);
    }

    public function test_written_settings_are_read_back(): void
    {
        $written = PageTransitionSettings::write(['enabled' => true, 'style' => 'fade', 'duration' => 0.4, 'header' => true]);

        $this->assertSame(['enabled' => true, 'style' => 'fade', 'duration' => 0.4, 'header' => true], $written);
        $this->assertSame($written, PageTransitionSettings::read());
    }

    public function test_off_turns_page_transitions_off_everywhere(): void
    {
        $this->assertSame('@view-transition{navigation:none}', PageTransitionSettings::css(['enabled' => false]));
    }

    public function test_fade_lets_the_old_page_go_before_the_new_one_comes_with_no_double_exposure(): void
    {
        $css = PageTransitionSettings::css(['style' => 'fade', 'duration' => 0.4]);

        $this->assertStringContainsString('@view-transition{navigation:auto}', $css);
        $this->assertStringContainsString('::view-transition-old(root),::view-transition-old(*):only-child{animation:200ms ease-in both sve-vt-fade-out;mix-blend-mode:normal}', $css);
        $this->assertStringContainsString('::view-transition-new(root),::view-transition-new(*):only-child{animation:200ms ease-out 200ms both sve-vt-fade-in;mix-blend-mode:normal}', $css);
        $this->assertStringContainsString('@media (prefers-reduced-motion)', $css);
    }

    public function test_each_style_makes_its_own_root_animation(): void
    {
        $this->assertStringContainsString('::view-transition-group(root){animation-duration:600ms}', PageTransitionSettings::css(['style' => 'crossfade', 'duration' => 0.6]));
        $this->assertStringNotContainsString('::view-transition-old(root)', PageTransitionSettings::css(['style' => 'crossfade']));
        $this->assertStringContainsString('::view-transition-old(*):only-child{animation:600ms ease both sve-vt-fade-out}', PageTransitionSettings::css(['style' => 'crossfade', 'duration' => 0.6]));
        $this->assertStringContainsString('sve-vt-slide-in{from{transform:translateX(100%)}}', PageTransitionSettings::css(['style' => 'slide']));
        $this->assertStringContainsString('::view-transition-old(root),::view-transition-old(*):only-child{animation:none;opacity:0}', PageTransitionSettings::css(['style' => 'none']));
    }

    public function test_an_element_with_no_partner_leaves_and_arrives_with_the_page(): void
    {
        foreach (['fade', 'crossfade', 'slide', 'none'] as $style) {
            $css = PageTransitionSettings::css(['style' => $style]);

            $this->assertStringContainsString('::view-transition-old(*):only-child', $css, $style);
            $this->assertStringContainsString('::view-transition-new(*):only-child', $css, $style);
        }
    }

    public function test_the_header_stands_still_when_asked(): void
    {
        $this->assertStringContainsString('[data-sve-chrome="header"]{view-transition-name:sve-site-head}', PageTransitionSettings::css(['header' => true]));
        $this->assertStringNotContainsString('sve-site-head', PageTransitionSettings::css(['header' => false]));
    }

    public function test_the_page_gets_the_css_at_the_end_of_its_head(): void
    {
        PageTransitionSettings::write(['style' => 'fade', 'duration' => 0.3]);

        $html = $this->run_middleware('/cases/eventpro', '<html><head><title>x</title></head><body></body></html>');

        $this->assertMatchesRegularExpression('#<title>x</title><style id="sve-page-transitions">@view-transition\{navigation:auto\}.*</style></head>#', $html);
    }

    public function test_nothing_is_added_without_settings_or_outside_a_page(): void
    {
        $page = '<html><head></head><body></body></html>';

        $this->assertSame($page, $this->run_middleware('/', $page));

        PageTransitionSettings::write(['style' => 'fade']);

        $this->assertSame($page, $this->run_middleware('/!/sve/anything', $page));
        $this->assertSame($page, $this->run_middleware('/', $page, 'application/json'));
    }

    public function test_the_routes_are_registered_and_live_preview_still_wins(): void
    {
        $this->assertTrue(Route::has('sve.page-transitions.show'));
        $this->assertTrue(Route::has('sve.page-transitions.update'));

        $group = app('router')->getMiddlewareGroups()['web'];

        $this->assertGreaterThan(array_search(InjectBridgeScript::class, $group, true), array_search(InjectPageTransitions::class, $group, true));
    }

    private function run_middleware(string $path, string $html, string $type = 'text/html; charset=UTF-8'): string
    {
        PageTransitionSettings::forget();

        $response = (new InjectPageTransitions)->handle(
            Request::create($path, 'GET'),
            fn () => new Response($html, 200, ['Content-Type' => $type])
        );

        return (string) $response->getContent();
    }
}
