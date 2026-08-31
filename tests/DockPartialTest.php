<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\CollectionViewFile;
use MarioHamann\StatamicVisualEditor\DockPartial;

class DockPartialTest extends TestCase
{
    protected string $dir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->dir = resource_path('views/partials/__sve_dock_partial_test');

        if (! is_dir($this->dir)) {
            mkdir($this->dir, 0777, true);
        }

        file_put_contents($this->dir.'/headline.antlers.html', "<h1>hi</h1>\n");
        file_put_contents($this->dir.'/media-old.antlers.html', "<p>old</p>\n");
    }

    protected function tearDown(): void
    {
        foreach (['headline.antlers.html', 'media-old.antlers.html'] as $name) {
            $file = $this->dir.'/'.$name;

            if (is_file($file)) {
                unlink($file);
            }
        }

        if (is_dir($this->dir)) {
            rmdir($this->dir);
        }

        parent::tearDown();
    }

    public function test_a_static_src_resolves_under_partials(): void
    {
        $items = DockPartial::resolve('__sve_dock_partial_test/headline');

        $this->assertCount(1, $items);
        $this->assertSame('headline', $items[0]['label']);
        $this->assertSame(CollectionViewFile::PREFIX.'partials/__sve_dock_partial_test/headline', $items[0]['type']);
    }

    public function test_a_token_src_lists_the_folder(): void
    {
        $items = DockPartial::resolve('__sve_dock_partial_test/{type}');
        $labels = array_column($items, 'label');

        $this->assertContains('headline', $labels);
        $this->assertContains('media-old', $labels);
    }

    public function test_a_bare_token_is_refused(): void
    {
        $this->assertSame([], DockPartial::resolve('{type}'));
    }

    public function test_path_traversal_is_refused(): void
    {
        $this->assertSame([], DockPartial::resolve('../secret'));
        $this->assertSame([], DockPartial::resolve('__sve_dock_partial_test/../../etc/passwd'));
    }

    public function test_a_missing_file_is_empty(): void
    {
        $this->assertSame([], DockPartial::resolve('__sve_dock_partial_test/nope'));
    }
}
