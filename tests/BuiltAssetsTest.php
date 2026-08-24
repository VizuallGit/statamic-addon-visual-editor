<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\BuiltAssets;

class BuiltAssetsTest extends TestCase
{
    public function test_addon_js_imports_exist_on_disk()
    {
        BuiltAssets::recover();

        $imports = BuiltAssets::addonImports();

        $this->assertNotEmpty($imports, 'addon.js must import overlay-host by hashed name');

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
