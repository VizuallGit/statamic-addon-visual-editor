<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Foundation\Vite;
use MarioHamann\StatamicVisualEditor\LivePreviewVite;

class LivePreviewViteTest extends TestCase
{
    protected string $hotFile;

    protected function setUp(): void
    {
        parent::setUp();

        $this->hotFile = sys_get_temp_dir().'/sve-vite-hot-'.uniqid();
        file_put_contents($this->hotFile, 'http://127.0.0.1:5173');
    }

    protected function tearDown(): void
    {
        @unlink($this->hotFile);

        parent::tearDown();
    }

    public function test_hot_tags_point_at_the_vite_server_without_the_hmr_client()
    {
        $vite = LivePreviewVite::lock(app(Vite::class), $this->hotFile);
        $html = (string) $vite(['resources/css/site.css', 'resources/js/site.js']);

        $this->assertStringContainsString('http://127.0.0.1:5173/resources/css/site.css', $html);
        $this->assertStringContainsString('http://127.0.0.1:5173/resources/js/site.js', $html);
        $this->assertStringNotContainsString('@vite/client', $html);
    }

    public function test_statamic_cloning_the_instance_cannot_put_the_client_back()
    {
        $vite = LivePreviewVite::lock(app(Vite::class), $this->hotFile);
        $clone = clone $vite;
        $clone->useHotFile(null);

        $html = (string) $clone(['resources/css/site.css']);

        $this->assertStringContainsString('http://127.0.0.1:5173/resources/css/site.css', $html);
        $this->assertStringNotContainsString('@vite/client', $html);
        $this->assertSame($this->hotFile, $clone->hotFile());
    }
}
