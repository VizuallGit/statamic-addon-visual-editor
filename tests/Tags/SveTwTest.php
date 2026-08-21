<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Tags;

use MarioHamann\StatamicVisualEditor\Tags\SveTw;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;

class SveTwTest extends TestCase
{
    public function test_pair_outputs_the_baked_style(): void
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
        ]);

        $this->assertStringContainsString('background-color:#333', $tag->index());
    }

    public function test_tag_is_registered(): void
    {
        $this->assertContains('sve_tw', collect(app('statamic.tags'))->keys()->all());
    }
}
