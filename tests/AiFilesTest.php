<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\AiFiles;

class AiFilesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        @mkdir(resource_path('fieldsets'), 0775, true);
    }

    public function test_it_writes_a_new_fieldset_yaml(): void
    {
        $rel = 'resources/fieldsets/ai_demo.yaml';
        $written = AiFiles::write($rel, "title: Demo\nfields: []\n");

        $this->assertSame($rel, str_replace('\\', '/', $written));
        $this->assertSame("title: Demo\nfields: []\n", AiFiles::read($rel));
        @unlink(resource_path('fieldsets/ai_demo.yaml'));
    }

    public function test_it_refuses_parent_directory_escape(): void
    {
        $this->assertNull(AiFiles::resolve('resources/fieldsets/../.env'));
        $this->assertNull(AiFiles::resolve('vendor/foo.yaml'));
        $this->assertNull(AiFiles::resolve('resources/fieldsets/hack.php'));
    }

    public function test_it_refuses_invalid_yaml(): void
    {
        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);

        AiFiles::write('resources/fieldsets/bad.yaml', "title: [\n");
    }

    public function test_it_creates_a_new_antlers_partial(): void
    {
        @mkdir(resource_path('views/partials/page_sections'), 0775, true);

        $rel = 'resources/views/partials/page_sections/faq/style_1.antlers.html';
        $html = "<section {{ visual_edit }}>faq</section>\n";
        $written = AiFiles::write($rel, $html);

        $this->assertSame($rel, str_replace('\\', '/', $written));
        $this->assertSame($html, AiFiles::read($rel));
        @unlink(resource_path('views/partials/page_sections/faq/style_1.antlers.html'));
        @rmdir(resource_path('views/partials/page_sections/faq'));
    }

    public function test_allowed_accepts_fieldsets_and_rejects_php(): void
    {
        $this->assertTrue(AiFiles::allowed('resources/fieldsets/foo.yaml'));
        $this->assertFalse(AiFiles::allowed('app/Evil.php'));
        $this->assertFalse(AiFiles::allowed('resources/fieldsets/../.env'));
        $this->assertTrue(AiFiles::allowed('resources/visual-editor/ai-rules.md'));
        $this->assertFalse(AiFiles::allowed('resources/visual-editor/library-snapshot.yaml'));
        $this->assertFalse(AiFiles::allowed('README.md'));
    }
}
