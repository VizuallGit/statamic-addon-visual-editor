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
        file_put_contents($this->dir.'/image.antlers.html', "<img src=\"{{ url }}\">\n");
        file_put_contents($this->dir.'/notes.md', "not a partial\n");
    }

    protected function tearDown(): void
    {
        foreach (['richtext.antlers.html', 'headline.antlers.html', 'image.antlers.html', 'notes.md'] as $name) {
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

    public function test_the_handles_of_the_folder_the_config_names_sorted_with_the_src_and_the_image_partial()
    {
        config()->set('statamic-visual-editor.templates.blocks', '__sve_block_partials_test/{type}');
        config()->set('statamic-visual-editor.templates.image_partial', '__sve_block_partials_test/image');

        $this->assertSame([
            'src' => '__sve_block_partials_test/{type}',
            'handles' => ['headline', 'image', 'richtext'],
            'image' => '__sve_block_partials_test/image',
        ], BlockPartials::toScript());
    }

    public function test_the_defaults_are_the_house_blocks_folder_and_image_component()
    {
        $this->assertSame('blocks/{type}', config('statamic-visual-editor.templates.blocks'));
        $this->assertSame('components/image', config('statamic-visual-editor.templates.image_partial'));
    }

    public function test_nothing_when_the_folder_is_turned_off_or_has_no_token()
    {
        config()->set('statamic-visual-editor.templates.image_partial', '');

        config()->set('statamic-visual-editor.templates.blocks', '');
        $this->assertSame(['src' => '', 'handles' => [], 'image' => ''], BlockPartials::toScript());

        config()->set('statamic-visual-editor.templates.blocks', '__sve_block_partials_test/richtext');
        $this->assertSame(['src' => '', 'handles' => [], 'image' => ''], BlockPartials::toScript());
    }

    public function test_a_folder_that_does_not_exist_gives_the_src_and_no_handles()
    {
        config()->set('statamic-visual-editor.templates.blocks', '__sve_nowhere/{type}');
        config()->set('statamic-visual-editor.templates.image_partial', '');

        $this->assertSame(['src' => '__sve_nowhere/{type}', 'handles' => [], 'image' => ''], BlockPartials::toScript());
    }

    public function test_the_image_partial_only_when_its_file_is_on_disk_and_it_names_one_file()
    {
        config()->set('statamic-visual-editor.templates.image_partial', '__sve_block_partials_test/image');
        $this->assertSame('__sve_block_partials_test/image', BlockPartials::image());

        config()->set('statamic-visual-editor.templates.image_partial', '__sve_block_partials_test/picture');
        $this->assertSame('', BlockPartials::image());

        config()->set('statamic-visual-editor.templates.image_partial', '__sve_block_partials_test/{type}');
        $this->assertSame('', BlockPartials::image());
    }
}
