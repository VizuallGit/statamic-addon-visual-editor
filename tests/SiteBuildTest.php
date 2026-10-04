<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SiteBuild;

/**
 * The site's CSS build after a utilities save: which built file the manifest
 * points at, and that a server without Vite says so instead of failing.
 */
class SiteBuildTest extends TestCase
{
    public function test_entry_css_is_the_manifest_file_for_the_site_stylesheet(): void
    {
        $css = resource_path('css/site.css');
        $manifest = public_path('build/manifest.json');

        @mkdir(dirname($css), 0777, true);
        @mkdir(dirname($manifest), 0777, true);
        file_put_contents($css, "@theme {\n}\n");
        file_put_contents($manifest, json_encode([
            'resources/css/site.css' => ['file' => 'assets/site-DNpXWrME.css', 'isEntry' => true],
            'resources/js/site.js' => ['file' => 'assets/site-BQ0z6WUE.js', 'isEntry' => true],
        ]));
        config(['statamic-visual-editor.tailwind.css' => $css]);

        try {
            $this->assertSame('/build/assets/site-DNpXWrME.css', SiteBuild::entryCss());
        } finally {
            unlink($css);
            unlink($manifest);
        }
    }

    public function test_entry_css_is_null_without_a_manifest(): void
    {
        $css = resource_path('css/site.css');

        @mkdir(dirname($css), 0777, true);
        file_put_contents($css, "@theme {\n}\n");
        config(['statamic-visual-editor.tailwind.css' => $css]);

        try {
            $this->assertNull(SiteBuild::entryCss());
        } finally {
            unlink($css);
        }
    }

    public function test_saving_an_imported_stylesheet_builds_and_says_how_it_went(): void
    {
        // The testbench app has no node_modules/vite, so the build is attempted and answers why it did not run.
        $this->assertSame(
            ['build' => ['ok' => false, 'reason' => 'no-vite']],
            SiteBuild::afterSave(['kind' => 'css', 'path' => 'base.css', 'ok' => true, 'imported' => true])
        );
    }

    public function test_saving_a_script_an_icon_or_an_unimported_sheet_builds_nothing(): void
    {
        $this->assertSame([], SiteBuild::afterSave(['kind' => 'js', 'path' => 'site.js', 'ok' => true, 'imported' => true]));
        $this->assertSame([], SiteBuild::afterSave(['kind' => 'svg', 'path' => 'icons/arrow.svg', 'ok' => true, 'imported' => true]));
        $this->assertSame([], SiteBuild::afterSave(['kind' => 'css', 'path' => 'custom.css', 'ok' => true, 'imported' => false]));
    }

    public function test_a_server_without_vite_answers_no_vite_instead_of_running(): void
    {
        // The testbench app has no node_modules/vite.
        $this->assertSame(['ok' => false, 'reason' => 'no-vite'], SiteBuild::run());
    }
}
