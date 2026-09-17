<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\TailwindCompile;
use RuntimeException;

class TailwindCompileTest extends TestCase
{
    protected string $file;

    protected function setUp(): void
    {
        parent::setUp();

        $this->file = sys_get_temp_dir().'/sve-tw-compile-'.uniqid('', true).'.css';
        config(['statamic-visual-editor.tailwind.css' => $this->file]);
        file_put_contents($this->file, <<<'CSS'
@plugin "@tailwindcss/typography";

@theme {
    --color-*: initial;
    --color-primary: var(--primary);
    --color-primary-300: var(--primary-300);
    --spacing-*: initial;
    --spacing-900: var(--size-900);
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

    public function test_prose_variants_and_colors_compile(): void
    {
        try {
            $css = TailwindCompile::fromHtml(
                '<div class="wrapper prose-p:opacity-50 prose-headings:text-primary prose-p:text-primary-300 py-900">'
            );
        } catch (RuntimeException $e) {
            $this->markTestSkipped($e->getMessage());
        }

        $this->assertStringContainsString('prose-p\\:opacity-50', $css);
        $this->assertStringContainsString('opacity', $css);
        $this->assertStringContainsString('prose-headings\\:text-primary', $css);
        $this->assertStringContainsString('prose-p\\:text-primary-300', $css);
        $this->assertStringContainsString('--color-primary', $css);
        $this->assertStringContainsString('.py-900', $css);
        $this->assertStringContainsString('--spacing-900', $css);
        $this->assertStringNotContainsString('.wrapper', $css);
    }

    public function test_empty_markup_is_empty_css(): void
    {
        try {
            $css = TailwindCompile::fromHtml('<section></section>');
        } catch (RuntimeException $e) {
            $this->markTestSkipped($e->getMessage());
        }

        $this->assertSame('', $css);
    }
}
