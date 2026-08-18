<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\TailwindTheme;

class TailwindThemeTest extends TestCase
{
    protected string $file;

    protected function setUp(): void
    {
        parent::setUp();

        $this->file = sys_get_temp_dir().'/sve-tw-theme-'.uniqid('', true).'.css';
        config(['statamic-visual-editor.tailwind.css' => $this->file]);
    }

    protected function tearDown(): void
    {
        if (is_file($this->file)) {
            unlink($this->file);
        }

        parent::tearDown();
    }

    public function test_missing_file_is_empty(): void
    {
        $this->assertSame('', TailwindTheme::css());
        $this->assertNull(TailwindTheme::path());
    }

    public function test_it_extracts_theme_and_utilities(): void
    {
        file_put_contents($this->file, <<<'CSS'
@import "tailwindcss";

@theme {
    --color-primary: var(--primary);
}

@utility wrapper {
    padding-left: 1rem;
    & > * + * { margin: 0; }
}
CSS);

        $css = TailwindTheme::css();

        $this->assertStringContainsString('@theme', $css);
        $this->assertStringContainsString('--color-primary: var(--primary);', $css);
        $this->assertStringContainsString('@utility wrapper', $css);
        $this->assertStringContainsString('& > * + *', $css);
        $this->assertStringNotContainsString('@import', $css);
    }
}
