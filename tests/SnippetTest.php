<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Snippet;

class SnippetTest extends TestCase
{
    protected bool $createdDirectory = false;

    private const NAMES = ['svetestnav', 'svetestcarousel', 'svetestslider', 'svetestboth'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->createdDirectory = ! is_dir(Snippet::directory());
        $this->cleanFiles();
    }

    protected function tearDown(): void
    {
        $this->cleanFiles();

        if ($this->createdDirectory && is_dir(Snippet::directory())) {
            rmdir(Snippet::directory());
        }

        parent::tearDown();
    }

    private function cleanFiles(): void
    {
        foreach (self::NAMES as $name) {
            foreach ([Snippet::CSS, Snippet::HTML] as $kind) {
                $file = Snippet::path($name, $kind);

                if (is_file($file)) {
                    unlink($file);
                }
            }
        }
    }

    public function test_normalize_name_follows_component_rules(): void
    {
        $this->assertSame('site_nav', Snippet::normalizeName('Site Nav'));
        $this->assertSame('site_nav', Snippet::normalizeName('site-nav.antlers.html'));
        $this->assertSame('carousel', Snippet::normalizeName('carousel.css'));
        // Same stripping as Component: "../x" is not rejected whole — the dots
        // and slash drop, and "x" is a usable name.
        $this->assertSame('x', Snippet::normalizeName('../x'));
        $this->assertNull(Snippet::normalizeName('9abc'));
        $this->assertNull(Snippet::normalizeName(''));
    }

    public function test_html_write_and_read_round_trip(): void
    {
        $html = "<nav class=\"site-nav\">\n  <a href=\"/\">Home</a>\n</nav>";
        $css = '.site-nav { display: flex; }';
        $js = "console.log('nav')";

        $made = Snippet::write('svetestnav', $html, $css, $js);

        $this->assertNotNull($made);
        $this->assertSame(Snippet::HTML, $made['kind']);
        $this->assertFileExists(Snippet::path('svetestnav', Snippet::HTML));
        $this->assertSame(Snippet::HTML, Snippet::kind('svetestnav'));

        $read = Snippet::read('svetestnav');

        $this->assertNotNull($read);
        $this->assertSame(Snippet::HTML, $read['kind']);
        $this->assertSame(trim($html), trim($read['html']));
        $this->assertSame(trim($css), trim($read['css']));
        $this->assertSame(trim($js), trim($read['js']));

        $contents = (string) file_get_contents(Snippet::path('svetestnav', Snippet::HTML));

        $this->assertStringContainsString('{{ style_push }}', $contents);
        $this->assertStringContainsString('{{ script_push }}', $contents);
        $this->assertStringNotContainsString('sve_tw', $contents);
    }

    public function test_css_write_and_read_round_trip_is_a_bare_body_in_a_css_file(): void
    {
        $body = "--button-size: var(--size-800);\ndisplay: grid;\n\n&::-webkit-scrollbar {\n  display: none;\n}";

        $made = Snippet::writeCss('svetestcarousel', "\n".$body."\n\n");

        $this->assertNotNull($made);
        $this->assertSame(Snippet::CSS, $made['kind']);
        $this->assertTrue($made['css']);
        $this->assertFalse($made['html']);
        $this->assertFileExists(Snippet::path('svetestcarousel', Snippet::CSS));
        $this->assertFileDoesNotExist(Snippet::path('svetestcarousel', Snippet::HTML));

        // The file is the body and one line break — no selector, no Antlers.
        $contents = (string) file_get_contents(Snippet::path('svetestcarousel', Snippet::CSS));

        $this->assertSame($body."\n", $contents);
        $this->assertStringNotContainsString('style_push', $contents);
        $this->assertStringNotContainsString('{{', $contents);

        $read = Snippet::read('svetestcarousel');

        $this->assertSame(Snippet::CSS, $read['kind']);
        $this->assertSame($body."\n", $read['css']);
        $this->assertSame('', $read['html']);
        $this->assertSame('', $read['js']);
    }

    public function test_css_write_refuses_an_empty_body(): void
    {
        $this->assertNull(Snippet::writeCss('svetestcarousel', "  \n "));
        $this->assertFalse(Snippet::exists('svetestcarousel'));
    }

    public function test_one_name_is_one_file_across_kinds(): void
    {
        Snippet::writeCss('svetestboth', 'display: grid;');

        $this->assertTrue(Snippet::exists('svetestboth'));
        $this->assertSame(Snippet::CSS, Snippet::kind('svetestboth'));

        // Writing the other kind under the same name replaces the file, it
        // does not sit beside it.
        Snippet::write('svetestboth', '<div class="both"></div>', '', '');

        $this->assertSame(Snippet::HTML, Snippet::kind('svetestboth'));
        $this->assertFileDoesNotExist(Snippet::path('svetestboth', Snippet::CSS));

        Snippet::writeCss('svetestboth', 'display: flex;');

        $this->assertSame(Snippet::CSS, Snippet::kind('svetestboth'));
        $this->assertFileDoesNotExist(Snippet::path('svetestboth', Snippet::HTML));
    }

    public function test_all_lists_both_kinds_with_flags_and_hint(): void
    {
        Snippet::write(
            'svetestnav',
            "<nav class=\"site-nav\">\n  <a href=\"/\">Home</a>\n</nav>",
            '.site-nav { display: flex; }',
            '',
        );
        Snippet::writeCss('svetestcarousel', "overflow: hidden;\nscroll-snap-type: x mandatory;");

        $byName = [];

        foreach (Snippet::all() as $row) {
            $byName[$row['name']] = $row;
        }

        $this->assertArrayHasKey('svetestnav', $byName);
        $this->assertArrayHasKey('svetestcarousel', $byName);

        $this->assertSame(Snippet::HTML, $byName['svetestnav']['kind']);
        $this->assertTrue($byName['svetestnav']['html']);
        $this->assertTrue($byName['svetestnav']['css']);
        $this->assertFalse($byName['svetestnav']['js']);
        $this->assertSame('<nav class="site-nav">', $byName['svetestnav']['hint']);

        $this->assertSame(Snippet::CSS, $byName['svetestcarousel']['kind']);
        $this->assertFalse($byName['svetestcarousel']['html']);
        $this->assertTrue($byName['svetestcarousel']['css']);
        $this->assertFalse($byName['svetestcarousel']['js']);
        $this->assertSame('overflow: hidden;', $byName['svetestcarousel']['hint']);
    }

    public function test_rename_moves_the_file_and_refuses_a_taken_name(): void
    {
        Snippet::writeCss('svetestcarousel', 'display: grid;');
        Snippet::write('svetestnav', '<nav></nav>', '', '');

        $this->assertFalse(Snippet::rename('svetestcarousel', 'svetestnav'), 'taken by the other kind');
        $this->assertFalse(Snippet::rename('svetestslider', 'svetestboth'), 'nothing under the old name');

        $this->assertTrue(Snippet::rename('svetestcarousel', 'svetestslider'));
        $this->assertNull(Snippet::read('svetestcarousel'));

        $read = Snippet::read('svetestslider');

        $this->assertSame(Snippet::CSS, $read['kind']);
        $this->assertSame("display: grid;\n", $read['css']);
    }

    public function test_delete_removes_the_file(): void
    {
        Snippet::writeCss('svetestcarousel', 'display: grid;');

        $this->assertTrue(Snippet::delete('svetestcarousel'));
        $this->assertFalse(Snippet::exists('svetestcarousel'));
        $this->assertFalse(Snippet::delete('svetestcarousel'));
    }

    public function test_read_missing_returns_null(): void
    {
        $this->assertNull(Snippet::read('svetestnav'));
    }
}
