<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Support\Facades\Storage;
use MarioHamann\StatamicVisualEditor\PreviewFile;
use Statamic\Facades\Asset;
use Statamic\Facades\AssetContainer;

/**
 * A preview image written to the container's disk is Statamic's only once it
 * is registered: index and meta. Without that, a server (no Stache watcher)
 * shows "No preview" for a file that is right there.
 */
class PreviewFileTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['filesystems.disks.sve_test_assets' => ['driver' => 'local', 'root' => storage_path('framework/testing/disks/sve_test_assets'), 'url' => '/assets']]);
        Storage::fake('sve_test_assets');
        AssetContainer::make('sve_previews')->disk('sve_test_assets')->save();
    }

    public function test_a_written_image_becomes_an_asset_with_meta_once_kept(): void
    {
        $container = AssetContainer::find('sve_previews');
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');

        $container->disk()->filesystem()->put('set-previews/hero-style-1-abcd1234.png', $png);

        PreviewFile::keep($container, 'set-previews/hero-style-1-abcd1234.png');

        $asset = Asset::find('sve_previews::set-previews/hero-style-1-abcd1234.png');

        $this->assertNotNull($asset);
        $this->assertSame('set-previews/hero-style-1-abcd1234.png', $asset->path());
        Storage::disk('sve_test_assets')->assertExists('set-previews/.meta/hero-style-1-abcd1234.png.yaml');

        // Kept twice is still one asset, and the meta is refreshed, not duplicated.
        PreviewFile::keep($container, 'set-previews/hero-style-1-abcd1234.png');

        $this->assertCount(1, $container->assets('set-previews'));
    }

    public function test_forgetting_removes_file_meta_and_index(): void
    {
        $container = AssetContainer::find('sve_previews');

        $container->disk()->filesystem()->put('set-previews/old-11111111.png', 'x');
        PreviewFile::keep($container, 'set-previews/old-11111111.png');

        PreviewFile::forget($container, 'set-previews/old-11111111.png');

        Storage::disk('sve_test_assets')->assertMissing('set-previews/old-11111111.png');
        Storage::disk('sve_test_assets')->assertMissing('set-previews/.meta/old-11111111.png.yaml');
        $this->assertNull(Asset::find('sve_previews::set-previews/old-11111111.png'));
    }
}
