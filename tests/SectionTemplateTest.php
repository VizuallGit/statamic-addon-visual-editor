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
            $this->dir.'/custom_section/style_1.antlers.html',
        ];

        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }

        foreach ([$this->dir.'/hero', $this->dir.'/faq', $this->dir.'/custom_section', $this->dir] as $dir) {
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

    public function test_split_strips_the_lock_marker_from_the_html_pane(): void
    {
        $parts = SectionTemplate::split(
            "{{# sve-locked #}}\n<section>hi</section>\n"
        );

        $this->assertTrue($parts['locked']);
        $this->assertSame('<section>hi</section>', $parts['html']);
        $this->assertStringNotContainsString('sve-locked', $parts['html']);
    }

    public function test_join_writes_the_lock_marker_above_the_html(): void
    {
        $out = SectionTemplate::join([
            'html' => '<section>hi</section>',
            'css' => '',
            'js' => '',
            'locked' => true,
        ]);

        $this->assertStringStartsWith("{{# sve-locked #}}\n", $out);
        $this->assertStringContainsString('<section>hi</section>', $out);
    }

    public function test_designed_types_are_locked_without_a_marker(): void
    {
        $parts = SectionTemplate::split("<section>hi</section>\n", 'hero/style_2');

        $this->assertTrue($parts['locked']);
        $this->assertTrue(SectionTemplate::fileIsLocked($this->dir.'/hero/style_2.antlers.html'));
    }

    public function test_custom_sections_are_unlocked_without_a_marker(): void
    {
        $parts = SectionTemplate::split("<section>hi</section>\n", 'custom_section/style_1');

        $this->assertFalse($parts['locked']);
        $this->assertFalse(SectionTemplate::defaultsLocked('custom_section/style_1'));
        $this->assertFalse(SectionTemplate::defaultsLocked('custom_section'));
        $this->assertTrue(SectionTemplate::defaultsLocked('hero/style_2'));
    }

    public function test_an_unlock_marker_opens_a_designed_type(): void
    {
        $parts = SectionTemplate::split(
            "{{# sve-unlocked #}}\n<section>hi</section>\n",
            'hero/style_2'
        );

        $this->assertFalse($parts['locked']);
        $this->assertStringNotContainsString('sve-unlocked', $parts['html']);
    }

    public function test_join_writes_an_unlock_marker_for_a_designed_type(): void
    {
        $out = SectionTemplate::join([
            'html' => '<section>hi</section>',
            'css' => '',
            'js' => '',
            'locked' => false,
        ], 'hero/style_2');

        $this->assertStringStartsWith("{{# sve-unlocked #}}\n", $out);
        $this->assertStringNotContainsString('sve-locked', $out);
    }

    public function test_join_omits_markers_when_the_default_already_matches(): void
    {
        $lockedHero = SectionTemplate::join([
            'html' => '<section>hi</section>',
            'css' => '',
            'js' => '',
            'locked' => true,
        ], 'hero/style_2');

        $openCustom = SectionTemplate::join([
            'html' => '<section>hi</section>',
            'css' => '',
            'js' => '',
            'locked' => false,
        ], 'custom_section/style_1');

        $this->assertSame("<section>hi</section>\n", $lockedHero);
        $this->assertSame("<section>hi</section>\n", $openCustom);
    }

    public function test_set_locked_unlocks_a_designed_type_with_a_marker(): void
    {
        $path = $this->dir.'/hero/style_2.antlers.html';
        $before = (string) file_get_contents($path);

        $this->assertTrue(SectionTemplate::fileIsLocked($path));

        SectionTemplate::setLocked($path, false);

        $this->assertFalse(SectionTemplate::fileIsLocked($path));
        $this->assertStringStartsWith("{{# sve-unlocked #}}\n", (string) file_get_contents($path));
        $this->assertStringContainsString($before, (string) file_get_contents($path));

        SectionTemplate::setLocked($path, true);

        $this->assertTrue(SectionTemplate::fileIsLocked($path));
        $this->assertSame($before, (string) file_get_contents($path));
    }

    public function test_set_locked_locks_a_custom_section_with_a_marker(): void
    {
        mkdir($this->dir.'/custom_section', 0777, true);
        $path = $this->dir.'/custom_section/style_1.antlers.html';
        file_put_contents($path, "<section>custom</section>\n");

        $this->assertFalse(SectionTemplate::fileIsLocked($path));

        SectionTemplate::setLocked($path, true);

        $this->assertTrue(SectionTemplate::fileIsLocked($path));
        $this->assertStringStartsWith("{{# sve-locked #}}\n", (string) file_get_contents($path));

        SectionTemplate::setLocked($path, false);

        $this->assertFalse(SectionTemplate::fileIsLocked($path));
        $this->assertSame("<section>custom</section>\n", (string) file_get_contents($path));
    }

    public function test_restore_locked_puts_a_changed_file_back(): void
    {
        $path = $this->dir.'/hero/style_2.antlers.html';
        $locked = (string) file_get_contents($path);
        $snapshots = SectionTemplate::lockedSnapshots();

        $this->assertArrayHasKey($path, $snapshots);

        file_put_contents($path, "<section>changed</section>\n");
        SectionTemplate::restoreLocked($snapshots);

        $this->assertSame($locked, (string) file_get_contents($path));
    }
}
