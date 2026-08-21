<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\TailwindBake;

class TailwindBakeTest extends TestCase
{
    protected string $file;

    protected function setUp(): void
    {
        parent::setUp();

        $this->file = sys_get_temp_dir().'/sve-tw-bake-'.uniqid('', true).'.css';
        config(['statamic-visual-editor.tailwind.css' => $this->file]);
        file_put_contents($this->file, <<<'CSS'
@theme {
    --color-*: initial;
    --color-primary: var(--primary);
    --text-800: var(--size-800);
    --spacing-900: var(--size-900);
    --spacing-gutter: var(--gutter);
    --leading-tight: 1.25;
    --font-heading: var(--font-heading);
}
@utility wrapper {
    padding-left: 1rem;
}
CSS);
    }

    protected function tearDown(): void
    {
        if (is_file($this->file)) {
            unlink($this->file);
        }

        parent::tearDown();
    }

    public function test_it_bakes_arbitrary_background(): void
    {
        $css = TailwindBake::fromHtml(
            '<section class="[ {{ _class }} ] bg-[#333555] wrapper relative">'
        );

        $this->assertStringContainsString('.bg-\\[\\#333555\\]{background-color:#333555}', $css);
        $this->assertStringContainsString('.relative{position:relative}', $css);
        $this->assertStringNotContainsString('wrapper', $css);
    }

    public function test_spacing_uses_the_site_theme_token(): void
    {
        $css = TailwindBake::fromHtml('<section class="py-900 px-gutter">');

        $this->assertStringContainsString('.py-900{padding-block:var(--spacing-900)}', $css);
        $this->assertStringContainsString('.px-gutter{padding-inline:var(--spacing-gutter)}', $css);
        $this->assertStringNotContainsString('calc(var(--spacing', $css);
    }

    public function test_it_does_not_invent_default_tailwind_spacing(): void
    {
        $css = TailwindBake::fromHtml('<section class="py-6 p-4">');

        $this->assertSame('', $css);
    }

    public function test_colors_and_type_use_theme_tokens(): void
    {
        $css = TailwindBake::fromHtml(
            '<section class="bg-primary text-800 text-primary font-heading leading-tight">'
        );

        $this->assertStringContainsString('.bg-primary{background-color:var(--color-primary)}', $css);
        $this->assertStringContainsString('.text-800{font-size:var(--text-800)}', $css);
        $this->assertStringContainsString('.text-primary{color:var(--color-primary)}', $css);
        $this->assertStringContainsString('.font-heading{font-family:var(--font-heading)}', $css);
        $this->assertStringContainsString('.leading-tight{line-height:var(--leading-tight)}', $css);
    }

    public function test_it_skips_antlers_noise(): void
    {
        $classes = TailwindBake::classes(
            '<section class="[ {{ _class }} ] bg-[#333] py-900" {{ visual_edit outline_inside="true" }}>'
        );

        $this->assertSame(['bg-[#333]', 'py-900'], $classes);
    }

    public function test_empty_html_is_empty_css(): void
    {
        $this->assertSame('', TailwindBake::fromHtml('<section></section>'));
    }
}
