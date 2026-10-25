<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\BlockPartials;

class BlockPartialsTest extends TestCase
{
    protected string $dir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->dir = resource_path('views/partials/__sve_block_partials_test');

        if (! is_dir($this->dir)) {
            mkdir($this->dir, 0777, true);
        }

        file_put_contents($this->dir.'/richtext.antlers.html', "<div>{{ text }}</div>\n");
        file_put_contents($this->dir.'/headline.antlers.html', "<h2>{{ title }}</h2>\n");
        file_put_contents($this->dir.'/notes.md', "not a partial\n");
    }

    protected function tearDown(): void
    {
        foreach (['richtext.antlers.html', 'headline.antlers.html', 'notes.md'] as $name) {
            $file = $this->dir.'/'.$name;

            if (is_file($file)) {
                unlink($file);
            }
        }

        if (is_dir($this->dir)) {
            rmdir($this->dir);
        }

        parent::tearDown();
    }

    public function test_the_handles_of_the_folder_the_config_names_sorted_with_the_src()
    {
        config()->set('statamic-visual-editor.templates.blocks', '__sve_block_partials_test/{type}');

        $this->assertSame([
            'src' => '__sve_block_partials_test/{type}',
            'handles' => ['headline', 'richtext'],
        ], BlockPartials::toScript());
    }

    public function test_the_default_src_is_the_house_blocks_folder()
    {
        $this->assertSame('blocks/{type}', config('statamic-visual-editor.templates.blocks'));
    }

    public function test_nothing_when_the_folder_is_turned_off_or_has_no_token()
    {
        config()->set('statamic-visual-editor.templates.blocks', '');
        $this->assertSame(['src' => '', 'handles' => []], BlockPartials::toScript());

        config()->set('statamic-visual-editor.templates.blocks', '__sve_block_partials_test/richtext');
        $this->assertSame(['src' => '', 'handles' => []], BlockPartials::toScript());
    }

    public function test_a_folder_that_does_not_exist_gives_the_src_and_no_handles()
    {
        config()->set('statamic-visual-editor.templates.blocks', '__sve_nowhere/{type}');

        $this->assertSame(['src' => '__sve_nowhere/{type}', 'handles' => []], BlockPartials::toScript());
    }
}
