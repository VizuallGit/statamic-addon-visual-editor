<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SiteCss;

/**
 * The style manager's other two kinds: scripts under resources/js and SVG
 * icons under resources/svg — each in its own folder, with its own extension
 * and starter file, and no `@import` bookkeeping.
 */
class SiteFilesKindsTest extends TestCase
{
    private string $js;

    private string $svg;

    protected function setUp(): void
    {
        parent::setUp();

        $this->js = sys_get_temp_dir().'/sve-js-'.uniqid();
        $this->svg = sys_get_temp_dir().'/sve-svg-'.uniqid();
        mkdir($this->js, 0777, true);
        mkdir($this->svg.'/icons', 0777, true);
        file_put_contents($this->js.'/site.js', "console.log('site');\n");
        file_put_contents($this->js.'/cp.js', "// control panel\n");
        file_put_contents($this->js.'/notes.css', "/* not a script */\n");
        file_put_contents($this->svg.'/icons/arrow.svg', "<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>\n");
        config([
            'statamic-visual-editor.site_css.js_root' => $this->js,
            'statamic-visual-editor.site_css.svg_root' => $this->svg,
        ]);
    }

    protected function tearDown(): void
    {
        SiteCss::use('css');

        foreach ([$this->js, $this->svg] as $dir) {
            foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST) as $f) {
                $f->isDir() ? rmdir($f->getPathname()) : unlink($f->getPathname());
            }

            rmdir($dir);
        }

        parent::tearDown();
    }

    public function test_only_known_kinds_are_accepted_and_css_stays_the_default(): void
    {
        $this->assertSame('css', SiteCss::kind());
        $this->assertFalse(SiteCss::use('php'));
        $this->assertSame('css', SiteCss::kind());
        $this->assertTrue(SiteCss::use('svg'));
        $this->assertSame('svg', SiteCss::kind());
    }

    public function test_scripts_list_only_js_files_and_skip_the_control_panel_script(): void
    {
        SiteCss::use('js');
        $listing = SiteCss::listing();

        $this->assertSame('js', $listing['kind']);
        $this->assertSame(['site.js'], array_column($listing['tree'], 'path'));
        $this->assertTrue($listing['tree'][0]['imported']);
    }

    public function test_a_new_script_starts_with_its_name_and_needs_no_import(): void
    {
        SiteCss::use('js');
        $made = SiteCss::create('modules/menu');

        $this->assertSame('modules/menu.js', $made['path']);
        $this->assertSame("// modules/menu.js\n", $made['css']);
        $this->assertTrue($made['imported']);
        $this->assertStringNotContainsString('menu', (string) file_get_contents($this->js.'/site.js'));
        $this->assertNull(SiteCss::create('styles.css'));
    }

    public function test_svgs_live_in_their_own_folder_and_start_as_an_empty_icon(): void
    {
        SiteCss::use('svg');
        $listing = SiteCss::listing();

        $this->assertSame('svg', $listing['kind']);
        $this->assertSame('icons', $listing['tree'][0]['path']);
        $this->assertSame('icons/arrow.svg', $listing['tree'][0]['children'][0]['path']);

        $made = SiteCss::create('star');

        $this->assertSame('star.svg', $made['path']);
        $this->assertStringStartsWith('<svg xmlns="http://www.w3.org/2000/svg"', $made['css']);
        $this->assertTrue(is_file($this->svg.'/star.svg'));

        $this->assertNotNull(SiteCss::rename('star.svg', 'icons/star'));
        $this->assertTrue(is_file($this->svg.'/icons/star.svg'));
        $this->assertTrue(SiteCss::delete('icons/star.svg'));
        $this->assertFalse(is_file($this->svg.'/icons/star.svg'));
    }
}
