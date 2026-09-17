<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\TailwindBake;
use RuntimeException;

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
    --spacing-*: initial;
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

    protected function compile(string $html): string
    {
        try {
            return TailwindBake::fromHtml($html);
        } catch (RuntimeException $e) {
            $this->markTestSkipped($e->getMessage());
        }
    }

    public function test_it_bakes_arbitrary_background(): void
    {
        $css = $this->compile(
            '<section class="[ {{ _class }} ] bg-[#333555] wrapper relative">'
        );

        $this->assertStringContainsString('bg-\\[\\#333555\\]', $css);
        $this->assertStringContainsString('#333555', $css);
        $this->assertStringContainsString('.relative', $css);
        $this->assertStringContainsString('position: relative', $css);
        $this->assertStringNotContainsString('.wrapper', $css);
    }

    public function test_spacing_uses_the_site_theme_token(): void
    {
        $css = $this->compile('<section class="py-900 px-gutter">');

        $this->assertStringContainsString('.py-900', $css);
        $this->assertStringContainsString('--spacing-900', $css);
        $this->assertStringContainsString('.px-gutter', $css);
        $this->assertStringContainsString('--spacing-gutter', $css);
        $this->assertStringNotContainsString('calc(var(--spacing', $css);
    }

    public function test_it_does_not_invent_default_tailwind_spacing(): void
    {
        $css = $this->compile('<section class="py-6 p-4">');

        $this->assertStringNotContainsString('.py-6', $css);
        $this->assertStringNotContainsString('.p-4', $css);
    }

    public function test_colors_and_type_use_theme_tokens(): void
    {
        $css = $this->compile(
            '<section class="bg-primary text-800 text-primary font-heading leading-tight">'
        );

        $this->assertStringContainsString('.bg-primary', $css);
        $this->assertStringContainsString('--color-primary', $css);
        $this->assertStringContainsString('.text-800', $css);
        $this->assertStringContainsString('--text-800', $css);
        $this->assertStringContainsString('.text-primary', $css);
        $this->assertStringContainsString('.font-heading', $css);
        $this->assertStringContainsString('--font-heading', $css);
        $this->assertStringContainsString('.leading-tight', $css);
        $this->assertStringContainsString('--leading-tight', $css);
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
        $this->assertSame('', $this->compile('<section></section>'));
    }

    public function test_it_bakes_breakpoint_and_hover_variants(): void
    {
        $css = $this->compile(
            '<p class="md:text-800 hover:bg-primary max-lg:py-900">'
        );

        $this->assertStringContainsString('md\\:text-800', $css);
        $this->assertStringContainsString('width >= 48rem', $css);
        $this->assertStringContainsString('hover\\:bg-primary', $css);
        $this->assertStringContainsString('--color-primary', $css);
        $this->assertStringContainsString('max-lg\\:py-900', $css);
        $this->assertStringContainsString('width < 64rem', $css);
    }

    public function test_hover_before_breakpoint_still_peels(): void
    {
        [$variants, $utility] = TailwindBake::peelVariants('hover:md:text-800');

        $this->assertSame(['hover', 'md'], $variants);
        $this->assertSame('text-800', $utility);
    }
}
