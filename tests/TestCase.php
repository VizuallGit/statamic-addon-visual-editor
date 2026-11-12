<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\ServiceProvider;
use MarioHamann\StatamicVisualEditor\TailwindCompile;
use Statamic\Testing\AddonTestCase;

abstract class TestCase extends AddonTestCase
{
    protected string $addonServiceProvider = ServiceProvider::class;

    protected function getEnvironmentSetUp($app)
    {
        parent::getEnvironmentSetUp($app);

        // tests/__fixtures__/content/assets/sve_previews.yaml points at this disk.
        // Since Statamic 6.35, saving a user builds a missing search index, which
        // lists every asset container, so the disk must exist in every test, not
        // only in the two that write set previews. Without it a fresh checkout
        // fails 12 tests and the next run passes.
        $app['config']->set('filesystems.disks.sve_test_assets', [
            'driver' => 'local',
            'root' => $app->storagePath('framework/testing/disks/sve_test_assets'),
            'url' => '/assets',
        ]);
    }

    protected function setUp(): void
    {
        parent::setUp();

        // The feature map is cached for the life of a request; a test run is one
        // process, so without this a test that changes config would read whatever
        // the previous one resolved.
        Features::flush();

        if (! TailwindCompile::hasEngine(base_path())) {
            $parent = dirname(__DIR__);
            foreach (glob($parent.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'*'.DIRECTORY_SEPARATOR.'node_modules'.DIRECTORY_SEPARATOR.'@tailwindcss'.DIRECTORY_SEPARATOR.'oxide') ?: [] as $oxide) {
                config(['statamic-visual-editor.tailwind.cwd' => dirname($oxide, 3)]);
                break;
            }
        }
    }
}
