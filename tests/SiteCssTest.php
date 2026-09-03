<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SiteCss;

class SiteCssTest extends TestCase
{
    protected string $dir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->dir = sys_get_temp_dir().'/sve-site-css-'.uniqid('', true);
        mkdir($this->dir.'/utilities', 0777, true);
        file_put_contents($this->dir.'/site.css', "@import \"./base\" layer(base);\n");
        file_put_contents($this->dir.'/base.css', "html { font-size: 16px; }\n");
        file_put_contents($this->dir.'/custom.css', ".foo { color: red; }\n");
        file_put_contents($this->dir.'/cp.css', "/* control panel */\n");
        file_put_contents($this->dir.'/utilities/flow.css', ".flow-y { gap: 1em; }\n");
        config([
            'statamic-visual-editor.site_css.root' => $this->dir,
            'statamic-visual-editor.site_css.exclude' => ['cp.css'],
        ]);
    }

    protected function tearDown(): void
    {
        foreach ([
            $this->dir.'/utilities/flow.css',
            $this->dir.'/utilities/new.css',
            $this->dir.'/colors.css',
            $this->dir.'/site.css',
            $this->dir.'/base.css',
            $this->dir.'/custom.css',
            $this->dir.'/cp.css',
        ] as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }

        foreach ([$this->dir.'/utilities', $this->dir] as $dir) {
            if (is_dir($dir)) {
                @rmdir($dir);
            }
        }

        parent::tearDown();
    }

    public function test_the_tree_mirrors_the_folder_and_skips_cp_css(): void
    {
        $listing = SiteCss::listing();
        $names = $this->names($listing['tree']);

        $this->assertContains('site.css', $names);
        $this->assertContains('base.css', $names);
        $this->assertContains('custom.css', $names);
        $this->assertContains('utilities', $names);
        $this->assertNotContains('cp.css', $names);

        $utilities = collect($listing['tree'])->firstWhere('name', 'utilities');
        $this->assertSame('dir', $utilities['type']);
        $this->assertSame(['flow.css'], array_column($utilities['children'], 'name'));
    }

    public function test_site_css_is_listed_as_imported(): void
    {
        $file = SiteCss::read('site.css');

        $this->assertNotNull($file);
        $this->assertTrue($file['imported']);
        $this->assertStringContainsString('@import', $file['css']);
    }

    public function test_base_is_imported_and_custom_is_not(): void
    {
        $this->assertTrue(SiteCss::read('base.css')['imported']);
        $this->assertFalse(SiteCss::read('custom.css')['imported']);
        $this->assertFalse(SiteCss::read('utilities/flow.css')['imported']);
    }

    public function test_writing_a_file_updates_the_disk(): void
    {
        SiteCss::write('base.css', "html { font-size: 18px; }\n");

        $this->assertSame("html { font-size: 18px; }\n", file_get_contents($this->dir.'/base.css'));
        $this->assertSame("html { font-size: 18px; }\n", SiteCss::read('base.css')['css']);
    }

    public function test_creating_a_file_writes_it_and_imports_it_in_site_css(): void
    {
        $file = SiteCss::create('colors');

        $this->assertNotNull($file);
        $this->assertSame('colors.css', $file['path']);
        $this->assertFileExists($this->dir.'/colors.css');
        $this->assertTrue($file['imported']);
        $this->assertStringContainsString('@import "./colors" layer(base);', file_get_contents($this->dir.'/site.css'));
    }

    public function test_creating_in_a_folder_uses_that_layer(): void
    {
        $file = SiteCss::create('utilities/new');

        $this->assertNotNull($file);
        $this->assertSame('utilities/new.css', $file['path']);
        $this->assertStringContainsString(
            '@import "./utilities/new" layer(utilities);',
            file_get_contents($this->dir.'/site.css')
        );
    }

    public function test_it_rejects_path_escape_and_cp_css(): void
    {
        $this->assertNull(SiteCss::read('../site.css'));
        $this->assertNull(SiteCss::read('cp.css'));
        $this->assertNull(SiteCss::write('cp.css', 'nope'));
        $this->assertNull(SiteCss::create('../evil.css'));
        $this->assertNull(SiteCss::normalize('foo.js'));
    }

    /** @param  list<array<string, mixed>>  $tree */
    protected function names(array $tree): array
    {
        return array_column($tree, 'name');
    }

    public function test_deleting_a_sheet_also_removes_its_import()
    {
        SiteCss::ensureImport('custom.css');
        $this->assertTrue(SiteCss::isImported('custom.css'));

        $this->assertTrue(SiteCss::delete('custom.css'));
        $this->assertFileDoesNotExist($this->dir.'/custom.css');
        // The entry must not be left naming a file that is gone.
        $this->assertStringNotContainsString('custom', file_get_contents($this->dir.'/site.css'));
    }

    public function test_the_entry_itself_cannot_be_deleted()
    {
        $this->assertFalse(SiteCss::delete(SiteCss::ENTRY));
        $this->assertFileExists($this->dir.'/site.css');
    }

    public function test_deleting_refuses_what_it_would_not_open()
    {
        $this->assertFalse(SiteCss::delete('cp.css'));
        $this->assertFalse(SiteCss::delete('../outside.css'));
        $this->assertFileExists($this->dir.'/cp.css');
    }

    public function test_renaming_a_sheet_carries_its_import_across()
    {
        SiteCss::ensureImport('custom.css');

        $out = SiteCss::rename('custom.css', 'brand.css');

        $this->assertSame('brand.css', $out['path']);
        $this->assertFileExists($this->dir.'/brand.css');
        $this->assertFileDoesNotExist($this->dir.'/custom.css');
        $this->assertTrue(SiteCss::isImported('brand.css'));
        $this->assertStringNotContainsString('"./custom"', file_get_contents($this->dir.'/site.css'));

        @unlink($this->dir.'/brand.css');
    }

    public function test_renaming_a_sheet_that_was_never_imported_stays_that_way()
    {
        $this->assertFalse(SiteCss::isImported('custom.css'));

        $out = SiteCss::rename('custom.css', 'unused.css');

        $this->assertSame('unused.css', $out['path']);
        $this->assertFalse(SiteCss::isImported('unused.css'));

        @unlink($this->dir.'/unused.css');
    }

    public function test_the_entry_cannot_be_renamed_or_replaced()
    {
        $this->assertNull(SiteCss::rename(SiteCss::ENTRY, 'main.css'));
        $this->assertNull(SiteCss::rename('custom.css', SiteCss::ENTRY));
        $this->assertNull(SiteCss::rename('custom.css', 'base.css'));
        $this->assertNull(SiteCss::rename('custom.css', '../escaped.css'));

        $this->assertFileExists($this->dir.'/site.css');
        $this->assertFileExists($this->dir.'/custom.css');
    }
}
