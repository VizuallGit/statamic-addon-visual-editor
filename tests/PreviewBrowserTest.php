<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\PreviewBrowser;

/**
 * The browser the previews need: where puppeteer keeps it, whether it is
 * there, and which failure means it is not.
 */
class PreviewBrowserTest extends TestCase
{
    private string $cache;

    protected function setUp(): void
    {
        parent::setUp();

        $this->cache = sys_get_temp_dir().'/sve-pptr-'.uniqid();
        mkdir($this->cache, 0777, true);
        putenv('PUPPETEER_CACHE_DIR='.$this->cache);
    }

    protected function tearDown(): void
    {
        putenv('PUPPETEER_CACHE_DIR');
        exec('rm -rf '.escapeshellarg($this->cache));

        parent::tearDown();
    }

    public function test_the_cache_dir_is_puppeteers(): void
    {
        $this->assertSame($this->cache, PreviewBrowser::cacheDir());

        putenv('PUPPETEER_CACHE_DIR');

        $this->assertStringEndsWith('/.cache/puppeteer', PreviewBrowser::cacheDir());
    }

    public function test_the_browser_is_installed_when_a_build_sits_in_the_cache(): void
    {
        $this->assertFalse(PreviewBrowser::browserInstalled());

        mkdir($this->cache.'/'.PreviewBrowser::BROWSER.'/mac_arm-140.0.0', 0777, true);

        $this->assertTrue(PreviewBrowser::browserInstalled());
    }

    public function test_only_a_missing_browser_earns_a_second_try(): void
    {
        $missing = new \RuntimeException('explained', 0, new \RuntimeException('Error: Could not find chrome-headless-shell (ver. 140.0.7339.82). This can occur if…'));

        $this->assertTrue(PreviewBrowser::isMissingBrowser($missing));
        $this->assertFalse(PreviewBrowser::isMissingBrowser(new \RuntimeException('The selector did not match any elements')));
    }
}
