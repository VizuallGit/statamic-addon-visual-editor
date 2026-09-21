<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Boot\ScriptChrome;

/**
 * The dock's file for the header and the footer is the partial that carries
 * `data-sve-chrome` — the attribute the preview finds the half by.
 */
class ChromeTemplatesTest extends TestCase
{
    /** @var array<int, string> */
    private array $written = [];

    protected function setUp(): void
    {
        parent::setUp();

        ScriptChrome::flush();
    }

    protected function tearDown(): void
    {
        foreach (array_reverse($this->written) as $path) {
            @unlink($path);
            @rmdir(dirname($path));
        }

        ScriptChrome::flush();

        parent::tearDown();
    }

    private function writeView(string $relative, string $source): void
    {
        $path = resource_path('views/'.$relative.'.antlers.html');

        if (! is_dir(dirname($path))) {
            mkdir(dirname($path), 0775, true);
        }

        file_put_contents($path, $source);
        $this->written[] = $path;
    }

    public function test_the_partial_carrying_the_marker_is_the_file(): void
    {
        $this->writeView('partials/sve_t_head', '<header data-sve-chrome="header"><div>logo</div></header>');
        $this->writeView('partials/footer/sve_t_widgets', "{{ site_foot }}\n<footer data-sve-chrome='footer'>x</footer>");

        $templates = ScriptChrome::templates();

        $this->assertSame(['type' => 'view:partials/sve_t_head', 'styled' => false], $templates['header']);
        $this->assertSame(['type' => 'footer/sve_t_widgets', 'styled' => false], $templates['footer']);
    }

    public function test_a_wrapper_choosing_a_layout_keeps_the_styled_partial(): void
    {
        $this->writeView('partials/sve_t_head', '<header data-sve-chrome="header">{{ partial src="header/{header_style}" }}</header>');
        $this->writeView('partials/header/style_1', '<div class="wrapper">logo</div>');

        $this->assertSame(['type' => 'header/style_1', 'styled' => true], ScriptChrome::templates()['header']);
    }

    public function test_a_styled_partial_carrying_the_marker_is_styled(): void
    {
        $this->writeView('partials/footer/style_1', '<footer data-sve-chrome="footer">x</footer>');

        $this->assertSame(['type' => 'footer/style_1', 'styled' => true], ScriptChrome::templates()['footer']);
    }

    public function test_no_marker_keeps_the_styled_rule(): void
    {
        $this->assertSame(['type' => 'header/style_1', 'styled' => true], ScriptChrome::templates()['header']);
        $this->assertSame(['type' => 'footer/style_1', 'styled' => true], ScriptChrome::templates()['footer']);
    }
}
