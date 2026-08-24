<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Tags;

use MarioHamann\StatamicVisualEditor\Tags\ResponsiveCss;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;

class ResponsiveCssTest extends TestCase
{
    private function tag(array $params = []): ResponsiveCss
    {
        $tag = new class extends ResponsiveCss
        {
            public function filter(array $fields): array
            {
                return $this->filterFields($fields);
            }
        };

        $tag->setProperties([
            'parser' => null,
            'content' => '',
            'context' => ['id' => 'abc'],
            'params' => $params,
            'tag' => 'responsive_css',
            'tag_method' => 'index',
        ]);

        return $tag;
    }

    public function test_only_keeps_named_fields(): void
    {
        $fields = [
            'padding' => ['laptop' => 1],
            'gap' => ['laptop' => 2],
            'media_width' => ['laptop' => 50],
        ];

        $filtered = $this->tag(['only' => 'padding,gap'])->filter($fields);

        $this->assertSame(['padding', 'gap'], array_keys($filtered));
    }

    public function test_only_accepts_pipe_separators(): void
    {
        $fields = [
            'padding' => ['laptop' => 1],
            'gap' => ['laptop' => 2],
            'media_width' => ['laptop' => 50],
        ];

        $filtered = $this->tag(['only' => 'padding|gap'])->filter($fields);

        $this->assertSame(['padding', 'gap'], array_keys($filtered));
    }

    public function test_except_drops_named_fields(): void
    {
        $fields = [
            'padding' => ['laptop' => 1],
            'media_width' => ['laptop' => 50],
        ];

        $filtered = $this->tag(['except' => 'padding'])->filter($fields);

        $this->assertSame(['media_width'], array_keys($filtered));
    }
}
