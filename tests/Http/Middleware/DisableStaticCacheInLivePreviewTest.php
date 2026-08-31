<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use MarioHamann\StatamicVisualEditor\Http\Middleware\DisableStaticCacheInLivePreview;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\StaticCaching\Cacher;
use Statamic\StaticCaching\Cachers\ApplicationCacher;
use Statamic\StaticCaching\Cachers\NullCacher;

class DisableStaticCacheInLivePreviewTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['statamic.static_caching.strategy' => 'half']);
        Request::macro('isLivePreview', fn () => false);
    }

    public function test_live_preview_uses_null_cacher_while_frontend_is_half(): void
    {
        Request::macro('isLivePreview', fn () => true);

        $inside = null;

        (new DisableStaticCacheInLivePreview)->handle(
            Request::create('/', 'GET'),
            function () use (&$inside) {
                $inside = app(Cacher::class);

                return new Response('ok');
            }
        );

        $this->assertInstanceOf(NullCacher::class, $inside);
    }

    public function test_frontend_keeps_the_half_cacher(): void
    {
        $inside = null;

        (new DisableStaticCacheInLivePreview)->handle(
            Request::create('/', 'GET'),
            function () use (&$inside) {
                $inside = app(Cacher::class);

                return new Response('ok');
            }
        );

        $this->assertInstanceOf(ApplicationCacher::class, $inside);
    }

    public function test_half_cacher_is_restored_after_live_preview(): void
    {
        Request::macro('isLivePreview', fn () => true);

        (new DisableStaticCacheInLivePreview)->handle(
            Request::create('/', 'GET'),
            fn () => new Response('ok')
        );

        $this->assertInstanceOf(ApplicationCacher::class, app(Cacher::class));
    }

    public function test_addon_preview_renders_also_use_null_cacher(): void
    {
        $inside = null;

        (new DisableStaticCacheInLivePreview)->handle(
            Request::create('/!/sve/section-preview/entry/section', 'GET'),
            function () use (&$inside) {
                $inside = app(Cacher::class);

                return new Response('ok');
            }
        );

        $this->assertInstanceOf(NullCacher::class, $inside);
    }
}
