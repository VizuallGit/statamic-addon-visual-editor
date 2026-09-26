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

    public function test_a_server_without_vite_answers_no_vite_instead_of_running(): void
    {
        // The testbench app has no node_modules/vite.
        $this->assertSame(['ok' => false, 'reason' => 'no-vite'], SiteBuild::run());
    }
}
