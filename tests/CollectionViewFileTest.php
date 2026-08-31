<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\CollectionViewFile;
use MarioHamann\StatamicVisualEditor\SectionTemplate;

class CollectionViewFileTest extends TestCase
{
    private string $dir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->dir = resource_path('views/sve_cv_file');
        if (! is_dir($this->dir)) {
            mkdir($this->dir, 0775, true);
        }
        file_put_contents($this->dir.'/show.antlers.html', "<section>\n    <h1>Service page</h1>\n</section>\n");
    }

    protected function tearDown(): void
    {
        @unlink($this->dir.'/show.antlers.html');
        @rmdir($this->dir);

        parent::tearDown();
    }

    public function test_view_types_are_prefixed_and_normalised(): void
    {
        $this->assertSame('services/show', CollectionViewFile::viewFromType('view:services/show'));
        $this->assertSame('services/show', CollectionViewFile::viewFromType('view:services/show.antlers.html'));
        $this->assertSame('view:services/show', CollectionViewFile::type('services/show.antlers.html'));
        $this->assertNull(CollectionViewFile::viewFromType('hero/style_1'));
        $this->assertNull(CollectionViewFile::viewFromType('view:../secret'));
    }

    public function test_path_stays_inside_views(): void
    {
        $path = CollectionViewFile::path('sve_cv_file/show');

        $this->assertNotNull($path);
        $this->assertSame(realpath($this->dir.'/show.antlers.html'), $path);
        $this->assertNull(CollectionViewFile::path('../secret'));
        $this->assertNull(CollectionViewFile::path('sve_cv_file/missing'));
    }

    public function test_a_plain_view_file_splits_into_the_html_pane_unlocked(): void
    {
        $path = CollectionViewFile::path('sve_cv_file/show');
        $parts = SectionTemplate::split((string) file_get_contents($path), '');

        $this->assertStringContainsString('Service page', $parts['html']);
        $this->assertSame('', $parts['css']);
        $this->assertSame('', $parts['js']);
        $this->assertFalse($parts['locked']);
    }
}
