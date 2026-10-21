<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\BuiltAssets;
use MarioHamann\StatamicVisualEditor\BuiltAssets\Lock;
use MarioHamann\StatamicVisualEditor\BuiltAssets\Manifest;

class BuiltAssetsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Manifest::forget();
        Lock::forget();
    }

    public function test_recover_writes_a_lock_for_the_build_on_disk()
    {
        BuiltAssets::recover();

        $lock = Lock::read();

        $this->assertNotNull($lock, 'recover() must leave a lock behind');
        $this->assertSame(Manifest::buildKey(), $lock['build']);
        $this->assertSame(Manifest::fileFor('resources/js/addon.js'), $lock['addon']);
        $this->assertSame(Manifest::walkAddonImports(), $lock['imports'], 'the lock must say exactly what the walk says');
        $this->assertTrue(Lock::holds(Manifest::buildKey()));
    }

    public function test_the_imports_read_from_the_lock_are_the_imports_the_walk_finds()
    {
        BuiltAssets::recover();
        Manifest::forget();

        $this->assertTrue(Lock::holds(Manifest::buildKey()));
        $this->assertSame(Manifest::walkAddonImports(), Manifest::addonImports());
    }

    public function test_a_lock_for_another_build_is_not_trusted()
    {
        BuiltAssets::recover();

        $path = Lock::path();
        $real = file_get_contents($path);
        $stale = json_decode($real, true);
        $stale['build'] = 'another-build';
        $stale['imports'] = ['not-a-chunk.js'];
        file_put_contents($path, json_encode($stale));
        Lock::forget();
        Manifest::forget();

        try {
            $this->assertFalse(Lock::holds(Manifest::buildKey()));
            $this->assertSame(Manifest::walkAddonImports(), Manifest::addonImports(), 'a stale lock must not feed the import list');

            BuiltAssets::recover();

            $this->assertTrue(Lock::holds(Manifest::buildKey()), 'recover() must replace a stale lock');
        } finally {
            file_put_contents($path, $real);
            Lock::forget();
        }
    }

    public function test_a_chunk_that_went_missing_is_put_back_even_with_a_current_lock()
    {
        BuiltAssets::recover();
        $this->assertTrue(Lock::holds(Manifest::buildKey()));

        $name = Manifest::addonImports()[0];
        $live = BuiltAssets::assetsDir().'/'.$name;
        $backup = $live.'.test-away';

        rename($live, $backup);

        try {
            BuiltAssets::recover();

            $this->assertFileExists($live, 'the fast path must notice a missing chunk and restore it');
        } finally {
            if (is_file($backup)) {
                @unlink($live);
                rename($backup, $live);
            }
        }
    }

    public function test_addon_js_imports_exist_on_disk()
    {
        BuiltAssets::recover();

        $imports = BuiltAssets::addonImports();

        $this->assertNotEmpty($imports, 'addon.js must import overlay-host by hashed name');
        $this->assertTrue(
            collect($imports)->contains(fn ($name) => str_starts_with($name, 'overlay-host-')),
            'the live addon.js must name overlay-host'
        );

        foreach ($imports as $name) {
            $this->assertFileExists(BuiltAssets::assetsDir().'/'.$name);
        }
    }

    public function test_preview_scripts_come_from_the_addon_build_not_public_vendor()
    {
        $url = BuiltAssets::url('resources/js/overlay-host.js');

        $this->assertStringStartsWith('/!/sve/build/', $url);
        $this->assertStringContainsString('overlay-host', $url);
        $this->assertStringNotContainsString('public/vendor', $url);
        $this->assertStringNotContainsString('/vendor/visual-editor/', $url);
    }

    public function test_restore_puts_back_a_chunk_addon_js_still_names()
    {
        $imports = BuiltAssets::addonImports();
        $this->assertNotEmpty($imports);

        $name = $imports[0];
        $live = BuiltAssets::assetsDir().'/'.$name;
        $locked = BuiltAssets::lockedRoot().'/'.$name;

        $this->assertFileExists($live);
        BuiltAssets::refreshLock();
        $this->assertFileExists($locked);

        $backup = $live.'.test-away';
        rename($live, $backup);

        try {
            $this->assertFileDoesNotExist($live);
            BuiltAssets::restoreImportedChunks();
            $this->assertFileExists($live);
            $this->assertFileEquals($locked, $live);
        } finally {
            if (is_file($backup)) {
                @unlink($live);
                rename($backup, $live);
            }
        }
    }
}
