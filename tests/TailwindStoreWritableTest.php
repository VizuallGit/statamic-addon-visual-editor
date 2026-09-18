<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\TailwindStore;

/**
 * The bake store says whether this server can take a save, and reports
 * whether a write reached disk — most editing happens on the server, and a
 * class that quietly never reaches resources/visual-editor/tw is a class
 * missing on the site.
 */
class TailwindStoreWritableTest extends TestCase
{
    protected string $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = sys_get_temp_dir().'/sve-tw-'.uniqid();
        mkdir($this->store, 0775, true);
        config(['statamic-visual-editor.tailwind.store' => $this->store]);
    }

    protected function tearDown(): void
    {
        if (is_dir($this->store)) {
            @chmod($this->store, 0775);

            foreach (glob($this->store.'/*/*.css') ?: [] as $file) {
                @unlink($file);
            }

            foreach (glob($this->store.'/*', GLOB_ONLYDIR) ?: [] as $dir) {
                @chmod($dir, 0775);
                @rmdir($dir);
            }

            @rmdir($this->store);
        }

        parent::tearDown();
    }

    public function test_a_handle_is_writable_when_its_folder_can_be_created(): void
    {
        $this->assertTrue(TailwindStore::writable('hero/style_1'));
    }

    public function test_write_reports_success_and_the_file_is_there(): void
    {
        $this->assertTrue(TailwindStore::write('hero/style_1', '.pt-1000{padding-top:1000px}'));
        $this->assertSame('.pt-1000{padding-top:1000px}', TailwindStore::read('hero/style_1'));
    }

    public function test_an_empty_bake_removes_the_file_and_still_counts_as_written(): void
    {
        TailwindStore::write('hero/style_1', '.a{}');
        $this->assertTrue(TailwindStore::write('hero/style_1', ''));
        $this->assertFalse(TailwindStore::has('hero/style_1'));
    }

    public function test_an_unsafe_handle_is_neither_writable_nor_written(): void
    {
        $this->assertFalse(TailwindStore::writable('../outside'));
        $this->assertFalse(TailwindStore::write('../outside', '.a{}'));
    }

    public function test_a_read_only_folder_is_reported_before_and_after(): void
    {
        if (posix_geteuid() === 0) {
            $this->markTestSkipped('root can write anywhere');
        }

        chmod($this->store, 0555);

        $this->assertFalse(TailwindStore::writable('hero/style_1'));
        $this->assertFalse(TailwindStore::write('hero/style_1', '.a{}'));
    }
}
