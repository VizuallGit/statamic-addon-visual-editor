<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectEditButton;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;

class InjectEditButtonTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Request::macro('isLivePreview', fn () => false);
    }

    private function makeMiddleware(): InjectEditButton
    {
        return new class extends InjectEditButton
        {
            public function exposeShouldInject(Request $request, Response $response): bool
            {
                return $this->shouldInject($request, $response);
            }

            public function exposeButton(object $entry): string
            {
                return $this->button($entry);
            }
        };
    }

    private function htmlResponse(string $html = '<html><head></head><body></body></html>'): Response
    {
        return new Response($html, 200, ['Content-Type' => 'text/html']);
    }

    public function test_skips_injection_during_live_preview(): void
    {
        Request::macro('isLivePreview', fn () => true);

        $injected = $this->makeMiddleware()->exposeShouldInject(
            Request::create('/', 'GET'),
            $this->htmlResponse()
        );

        $this->assertFalse($injected);
    }

    public function test_skips_injection_when_edit_button_is_disabled(): void
    {
        config(['statamic-visual-editor.edit_button' => false]);

        $injected = $this->makeMiddleware()->exposeShouldInject(
            Request::create('/', 'GET'),
            $this->htmlResponse()
        );

        $this->assertFalse($injected);
    }

    public function test_button_loads_the_shared_overlay_host(): void
    {
        $html = $this->makeMiddleware()->exposeButton(new class
        {
            public function editUrl(): string
            {
                return '/cp/collections/pages/entries/home';
            }
        });

        $this->assertStringContainsString('id="sve-edit-button"', $html);
        $this->assertStringContainsString('live-preview=1', $html);
        $this->assertStringNotContainsString('rel="prefetch"', $html);
        $this->assertStringContainsString('overlay-host', $html);
        $this->assertStringContainsString('data-sve-overlay-host', $html);
        $this->assertStringContainsString('data-ready', $html);
        $this->assertStringContainsString('__sveWantEditor', $html);
    }
}
