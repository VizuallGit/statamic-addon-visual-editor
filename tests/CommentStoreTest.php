<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\CommentStore;

class CommentStoreTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $dir = storage_path('statamic-visual-editor/comments');

        if (is_dir($dir)) {
            foreach (glob($dir.'/*.yaml') ?: [] as $file) {
                @unlink($file);
            }
        }
    }

    public function test_it_stores_and_finds_a_comment(): void
    {
        $store = new CommentStore;
        $comment = [
            'id' => 'thread-1',
            'visual_id' => 'hero',
            'x' => 12.5,
            'y' => 40,
            'resolved' => false,
            'messages' => [],
        ];

        $store->put('entry-abc', $comment);

        $this->assertSame($comment, $store->find('entry-abc', 'thread-1'));
        $this->assertCount(1, $store->all('entry-abc'));
        $this->assertFileExists(storage_path('statamic-visual-editor/comments/entry-abc.yaml'));
    }

    public function test_it_deletes_a_comment(): void
    {
        $store = new CommentStore;
        $store->put('entry-abc', ['id' => 'thread-1', 'messages' => []]);

        $this->assertTrue($store->delete('entry-abc', 'thread-1'));
        $this->assertFalse($store->delete('entry-abc', 'thread-1'));
        $this->assertSame([], $store->all('entry-abc'));
    }

    public function test_it_deletes_comments_for_removed_sections(): void
    {
        $store = new CommentStore;
        $store->put('entry-abc', ['id' => 'on-hero', 'visual_id' => 'hero', 'messages' => []]);
        $store->put('entry-abc', ['id' => 'on-banner', 'visual_id' => 'banner', 'messages' => []]);
        $store->put('entry-abc', ['id' => 'on-page', 'visual_id' => '__page', 'messages' => []]);

        $removed = $store->deleteByVisualIds('entry-abc', ['hero', '__page', '']);

        $this->assertSame(1, $removed);
        $this->assertSame(['on-banner', 'on-page'], array_column($store->all('entry-abc'), 'id'));
    }
}
