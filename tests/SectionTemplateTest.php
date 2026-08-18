<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SectionTemplate;

class SectionTemplateTest extends TestCase
{
    protected string $dir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->dir = sys_get_temp_dir().'/sve-templates-'.uniqid('', true);
        mkdir($this->dir.'/hero', 0777, true);
        file_put_contents($this->dir.'/hero/style_2.antlers.html', "<section>\n  hi\n</section>\n");
        config(['statamic-visual-editor.templates.partials' => $this->dir]);
    }

    protected function tearDown(): void
    {
        $files = [
            $this->dir.'/hero/style_2.antlers.html',
            $this->dir.'/faq/style_1.antlers.html',
        ];

        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }

        foreach ([$this->dir.'/hero', $this->dir.'/faq', $this->dir] as $dir) {
            if (is_dir($dir)) {
                rmdir($dir);
            }
        }

        parent::tearDown();
    }

    public function test_it_resolves_a_nested_handle(): void
    {
        $path = SectionTemplate::path('hero/style_2');

        $this->assertNotNull($path);
        $this->assertSame(realpath($this->dir.'/hero/style_2.antlers.html'), $path);
    }

    public function test_it_rejects_a_missing_file(): void
    {
        $this->assertNull(SectionTemplate::path('hero/style_99'));
    }

    public function test_writable_path_creates_a_new_nested_file(): void
    {
        $path = SectionTemplate::writablePath('faq/style_1');

        $this->assertNotNull($path);
        $this->assertSame(realpath($this->dir).'/faq/style_1.antlers.html', $path);
        $this->assertDirectoryExists($this->dir.'/faq');
        $this->assertFileDoesNotExist($path);
    }

    public function test_it_rejects_path_traversal(): void
    {
        $this->assertNull(SectionTemplate::path('../secret'));
        $this->assertNull(SectionTemplate::path('hero/../../etc/passwd'));
        $this->assertNull(SectionTemplate::path('/etc/passwd'));
    }

    public function test_it_rejects_unsafe_characters(): void
    {
        $this->assertNull(SectionTemplate::path('hero/style_2;rm'));
        $this->assertNull(SectionTemplate::path('hero/style 2'));
    }

    public function test_relative_path_is_under_the_app_root(): void
    {
        $absolute = SectionTemplate::path('hero/style_2');

        $this->assertNotNull($absolute);
        $this->assertStringNotContainsString('..', SectionTemplate::relative($absolute));
    }

    public function test_it_splits_style_push_into_the_css_pane(): void
    {
        $parts = SectionTemplate::split(
            "<section>hi</section>\n\n{{ style_push }}\n<style>.x{}</style>\n{{ /style_push }}\n"
        );

        $this->assertSame('<section>hi</section>', $parts['html']);
        $this->assertSame('.x{}', $parts['css']);
        $this->assertSame('', $parts['js']);
        $this->assertSame('style_push', $parts['css_tag']);
    }

    public function test_it_leaves_commented_style_push_in_html(): void
    {
        $parts = SectionTemplate::split(
            "<section>hi</section>\n\n{{ style_push }}\n<style>.live{}</style>\n{{ /style_push }}\n\n{{# {{ style_push }}\n<style>.old{}</style>\n{{ /style_push }} #}}\n"
        );

        $this->assertStringContainsString('<section>hi</section>', $parts['html']);
        $this->assertStringContainsString('{{#', $parts['html']);
        $this->assertStringContainsString('.old{}', $parts['html']);
        $this->assertSame('.live{}', $parts['css']);
    }

    public function test_it_splits_script_push_into_the_js_pane(): void
    {
        $parts = SectionTemplate::split(
            "<section>hi</section>\n\n{{ script_push }}\n<script>alert(1)</script>\n{{ /script_push }}\n"
        );

        $this->assertSame('<section>hi</section>', $parts['html']);
        $this->assertSame('alert(1)', $parts['js']);
        $this->assertSame('script_push', $parts['js_tag']);
    }

    public function test_join_writes_style_push_and_script_push_back(): void
    {
        $out = SectionTemplate::join([
            'html' => '<section>hi</section>',
            'css' => '.x{}',
            'js' => '1',
            'css_tag' => 'style_push',
            'js_tag' => 'script_push',
        ]);

        $this->assertStringContainsString('<section>hi</section>', $out);
        $this->assertStringContainsString('{{ style_push }}', $out);
        $this->assertStringContainsString("<style>\n.x{}\n</style>", $out);
        $this->assertStringContainsString('{{ script_push }}', $out);
        $this->assertStringContainsString("<script>\n1\n</script>", $out);
    }

    public function test_join_does_not_double_wrap_existing_style_tags(): void
    {
        $out = SectionTemplate::join([
            'html' => '<section>hi</section>',
            'css' => '<style>.x{}</style>',
            'js' => '',
            'css_tag' => 'style_push',
        ]);

        $this->assertSame(1, substr_count($out, '<style>'));
        $this->assertStringContainsString('<style>.x{}</style>', $out);
    }

    public function test_join_omits_empty_css_and_js(): void
    {
        $out = SectionTemplate::join([
            'html' => '<section>hi</section>',
            'css' => '',
            'js' => '   ',
        ]);

        $this->assertSame("<section>hi</section>\n", $out);
    }

    public function test_split_then_join_roundtrips_the_panes(): void
    {
        $source = "<section>hi</section>\n\n{{ style_push }}\n<style>.x{}</style>\n{{ /style_push }}\n";
        $parts = SectionTemplate::split($source);
        $again = SectionTemplate::split(SectionTemplate::join($parts));

        $this->assertSame($parts['html'], $again['html']);
        $this->assertSame($parts['css'], $again['css']);
        $this->assertSame($parts['js'], $again['js']);
        $this->assertSame('', $again['tw']);
    }

    public function test_it_keeps_sve_tw_out_of_the_css_pane(): void
    {
        $parts = SectionTemplate::split(
            "<section>hi</section>\n\n{{ style_push }}\n<style>.x{}</style>\n{{ /style_push }}\n\n{{ sve_tw }}\n<style>.bg-\\[\\#333\\]{background-color:#333}</style>\n{{ /sve_tw }}\n"
        );

        $this->assertSame('<section>hi</section>', $parts['html']);
        $this->assertSame('.x{}', $parts['css']);
        $this->assertSame('.bg-\\[\\#333\\]{background-color:#333}', $parts['tw']);
        $this->assertSame('', $parts['js']);
    }

    public function test_join_writes_sve_tw_after_the_css_pane(): void
    {
        $out = SectionTemplate::join([
            'html' => '<section>hi</section>',
            'css' => '.x{}',
            'js' => '',
            'tw' => '.p-4{padding:1rem}',
            'css_tag' => 'style_push',
        ]);

        $this->assertStringContainsString('{{ style_push }}', $out);
        $this->assertStringContainsString('{{ sve_tw }}', $out);
        $this->assertTrue(strpos($out, '{{ style_push }}') < strpos($out, '{{ sve_tw }}'));
        $this->assertStringContainsString('.p-4{padding:1rem}', $out);
    }

    public function test_join_omits_empty_sve_tw(): void
    {
        $out = SectionTemplate::join([
            'html' => '<section>hi</section>',
            'css' => '',
            'js' => '',
            'tw' => '  ',
        ]);

        $this->assertSame("<section>hi</section>\n", $out);
        $this->assertStringNotContainsString('sve_tw', $out);
    }
}
