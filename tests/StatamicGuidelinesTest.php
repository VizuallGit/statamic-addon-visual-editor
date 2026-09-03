<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\StatamicGuidelines;

class StatamicGuidelinesTest extends TestCase
{
    protected string $file;

    protected function setUp(): void
    {
        parent::setUp();

        $this->file = sys_get_temp_dir().'/sve-guidelines-'.uniqid('', true).'.blade.php';

        file_put_contents($this->file, <<<'BLADE'
## Statamic
- Collections live in content/collections.

@verbatim
<code-snippet name="Folder Structure" lang="text">
├── content/
│   ├── taxonomies/
</code-snippet>
@endverbatim
BLADE);

        config(['statamic-visual-editor.ai.statamic_guidelines_path' => $this->file]);
    }

    protected function tearDown(): void
    {
        @unlink($this->file);

        parent::tearDown();
    }

    public function test_the_guidelines_come_through_as_markdown()
    {
        $text = StatamicGuidelines::text();

        $this->assertStringContainsString('content/collections', $text);
        $this->assertStringContainsString('taxonomies', $text);
    }

    public function test_blade_fences_are_stripped()
    {
        $text = StatamicGuidelines::text();

        $this->assertStringNotContainsString('@verbatim', $text);
        $this->assertStringNotContainsString('@endverbatim', $text);
        // The sample they wrapped is the point — it must survive.
        $this->assertStringContainsString('<code-snippet', $text);
    }

    public function test_it_can_be_switched_off()
    {
        config(['statamic-visual-editor.ai.statamic_guidelines' => false]);

        $this->assertSame('', StatamicGuidelines::text());
    }

    public function test_a_missing_file_is_silence_not_a_failure()
    {
        config(['statamic-visual-editor.ai.statamic_guidelines_path' => '/nope/does-not-exist.blade.php']);

        $this->assertSame('', StatamicGuidelines::text());
    }

    public function test_the_real_file_is_found_when_statamic_ships_one()
    {
        config(['statamic-visual-editor.ai.statamic_guidelines_path' => null]);

        $path = StatamicGuidelines::path();

        if ($path === null) {
            $this->markTestSkipped('This checkout has no statamic/cms guidelines file.');
        }

        $this->assertStringEndsWith('resources/boost/guidelines/core.blade.php', $path);
    }
}
