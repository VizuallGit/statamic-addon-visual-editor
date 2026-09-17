<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\ServiceProvider;
use MarioHamann\StatamicVisualEditor\TailwindCompile;
use Statamic\Testing\AddonTestCase;

abstract class TestCase extends AddonTestCase
{
    protected string $addonServiceProvider = ServiceProvider::class;

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
