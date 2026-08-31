<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\LivePreviewSectionScope;

class LivePreviewSectionScopeTest extends TestCase
{
    public function test_ids_come_from_the_query_string(): void
    {
        $request = Request::create('/', 'GET', [LivePreviewSectionScope::QUERY => 'a, b,']);

        $this->assertSame(['a', 'b'], LivePreviewSectionScope::idsFromRequest($request));
    }

    public function test_missing_query_is_empty(): void
    {
        $this->assertSame([], LivePreviewSectionScope::idsFromRequest(Request::create('/', 'GET')));
    }

    public function test_one_row_matches_any_of_its_ids(): void
    {
        $rows = [
            ['id' => 'one', 'type' => 'hero/style_1'],
            ['id' => 'two', '_visual_id' => 'vis-two', 'type' => 'gallery/style_1'],
        ];

        $matched = LivePreviewSectionScope::matchingRows($rows, ['vis-two', 'two']);

        $this->assertCount(1, $matched);
        $this->assertSame('two', $matched[0]['id']);
    }

    public function test_unknown_ids_match_nothing(): void
    {
        $rows = [
            ['id' => 'one'],
            ['id' => 'two'],
        ];

        $this->assertSame([], LivePreviewSectionScope::matchingRows($rows, ['missing']));
    }

    public function test_limit_cascade_keeps_all_rows_when_it_is_not_exactly_one_match(): void
    {
        $entry = new class
        {
            public array $data = [
                'page_sections' => [
                    ['id' => 'one'],
                    ['id' => 'two'],
                ],
            ];

            public function get($key)
            {
                return $this->data[$key] ?? null;
            }

            public function set($key, $value)
            {
                $this->data[$key] = $value;
            }
        };

        $cascade = new class($entry)
        {
            public function __construct(private object $content) {}

            public function content(): object
            {
                return $this->content;
            }

            public function set($key, $value): void {}
        };

        LivePreviewSectionScope::limitCascade($cascade, ['missing']);

        $this->assertCount(2, $entry->get('page_sections'));
    }

    public function test_limit_cascade_keeps_exactly_one_matching_row(): void
    {
        $entry = new class
        {
            public array $data = [
                'page_sections' => [
                    ['id' => 'one'],
                    ['id' => 'two'],
                ],
            ];

            public function get($key)
            {
                return $this->data[$key] ?? null;
            }

            public function set($key, $value)
            {
                $this->data[$key] = $value;
            }
        };

        $cascade = new class($entry)
        {
            public mixed $setKey = null;

            public mixed $setValue = null;

            public function __construct(private object $content) {}

            public function content(): object
            {
                return $this->content;
            }

            public function set($key, $value): void
            {
                $this->setKey = $key;
                $this->setValue = $value;
            }
        };

        LivePreviewSectionScope::limitCascade($cascade, ['two']);

        $this->assertCount(1, $entry->get('page_sections'));
        $this->assertSame('two', $entry->get('page_sections')[0]['id']);
        $this->assertSame('page_sections', $cascade->setKey);
        $this->assertCount(1, $cascade->setValue);
    }
}
