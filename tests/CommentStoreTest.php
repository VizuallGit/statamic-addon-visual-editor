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
}
