<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Snippet;

class SnippetTest extends TestCase
{
    protected bool $createdDirectory = false;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createdDirectory = ! is_dir(Snippet::directory());
    }

    protected function tearDown(): void
    {
        foreach (['svetestnav', 'svetestcarousel'] as $name) {
            $file = Snippet::path($name);

            if (is_file($file)) {
                unlink($file);
            }
        }

        if ($this->createdDirectory && is_dir(Snippet::directory())) {
            rmdir(Snippet::directory());
        }

        parent::tearDown();
    }

    public function test_normalize_name_follows_component_rules(): void
    {
        $this->assertSame('site_nav', Snippet::normalizeName('Site Nav'));
        $this->assertSame('site_nav', Snippet::normalizeName('site-nav.antlers.html'));
        // Same stripping as Component: "../x" is not rejected whole — the dots
        // and slash drop, and "x" is a usable name.
        $this->assertSame('x', Snippet::normalizeName('../x'));
        $this->assertNull(Snippet::normalizeName('9abc'));
        $this->assertNull(Snippet::normalizeName(''));
    }

    public function test_write_and_read_round_trip(): void
    {
        $html = "<nav class=\"site-nav\">\n  <a href=\"/\">Home</a>\n</nav>";
        $css = '.site-nav { display: flex; }';
        $js = "console.log('nav')";

        $made = Snippet::write('svetestnav', $html, $css, $js);

        $this->assertNotNull($made);
        $this->assertFileExists(Snippet::path('svetestnav'));

        $read = Snippet::read('svetestnav');

        $this->assertNotNull($read);
        $this->assertSame(trim($html), trim($read['html']));
        $this->assertSame(trim($css), trim($read['css']));
        $this->assertSame(trim($js), trim($read['js']));

        $contents = (string) file_get_contents(Snippet::path('svetestnav'));

        $this->assertStringContainsString('{{ style_push }}', $contents);
        $this->assertStringContainsString('{{ script_push }}', $contents);
        $this->assertStringNotContainsString('sve_tw', $contents);
    }

    public function test_all_lists_flags_and_hint(): void
    {
        Snippet::write(
            'svetestnav',
            "<nav class=\"site-nav\">\n  <a href=\"/\">Home</a>\n</nav>",
            '.site-nav { display: flex; }',
            '',
        );
        Snippet::write('svetestcarousel', '', '.carousel { overflow: hidden; }', '');

        $byName = [];

        foreach (Snippet::all() as $row) {
            $byName[$row['name']] = $row;
        }

        $this->assertArrayHasKey('svetestnav', $byName);
        $this->assertArrayHasKey('svetestcarousel', $byName);

        $this->assertTrue($byName['svetestnav']['html']);
        $this->assertTrue($byName['svetestnav']['css']);
        $this->assertFalse($byName['svetestnav']['js']);
        $this->assertSame('<nav class="site-nav">', $byName['svetestnav']['hint']);

        $this->assertFalse($byName['svetestcarousel']['html']);
        $this->assertTrue($byName['svetestcarousel']['css']);
        $this->assertSame('.carousel { overflow: hidden; }', $byName['svetestcarousel']['hint']);
    }

    public function test_read_missing_returns_null(): void
    {
        $this->assertNull(Snippet::read('svetestnav'));
    }
}
