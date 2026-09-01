<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Tags;

use MarioHamann\StatamicVisualEditor\Tags\SveTw;
use MarioHamann\StatamicVisualEditor\TailwindStore;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;

class SveTwTest extends TestCase
{
    public function test_pair_prints_nothing(): void
    {
        $tag = new class extends SveTw
        {
            public function parse($data = []): mixed
            {
                return $this->content;
            }
        };

        $tag->setProperties([
            'parser' => null,
            'content' => '<style>.bg-\\[\\#333\\]{background-color:#333}</style>',
            'context' => [],
            'params' => [],
            'tag' => 'sve_tw',
            'tag_method' => 'index',
            'isPair' => true,
        ]);

        $this->assertSame('', $tag->index());
    }

    public function test_self_closing_tag_reads_the_store(): void
    {
        $dir = sys_get_temp_dir().'/sve-tw-'.uniqid('', true);
        config(['statamic-visual-editor.tailwind.store' => $dir]);
        TailwindStore::write('custom_section/style_1', '.relative{position:relative}');

        $tag = new SveTw;
        $tag->setProperties([
            'parser' => null,
            'content' => '',
            'context' => [],
            'params' => ['handle' => 'custom_section/style_1'],
            'tag' => 'sve_tw',
            'tag_method' => 'index',
            'isPair' => false,
        ]);

        $this->assertSame('', $tag->index());

        $path = TailwindStore::path('custom_section/style_1');

        if (is_file($path)) {
            unlink($path);
        }

        @rmdir($dir.'/custom_section');
        @rmdir($dir);
    }
}
