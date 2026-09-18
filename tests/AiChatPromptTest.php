<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\AiChat\ChangedFiles;
use MarioHamann\StatamicVisualEditor\AiChat\Conversation;
use MarioHamann\StatamicVisualEditor\AiChat\Prompt;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * The chat's input shaping, reachable since WP7d moved it out of AiChat: the
 * conversation that reaches the agent, and the diff of allowed files after it.
 */
class AiChatPromptTest extends TestCase
{
    public function test_the_conversation_is_cleaned_and_must_end_with_the_user(): void
    {
        $out = Conversation::sanitize([
            'junk',
            ['role' => 'system', 'content' => 'ignored'],
            ['role' => 'assistant', 'content' => '   '],
            ['role' => 'assistant', 'content' => 'Hi'],
            ['role' => 'user', 'content' => 'Make it blue'],
        ]);

        $this->assertSame([
            ['role' => 'assistant', 'content' => 'Hi'],
            ['role' => 'user', 'content' => 'Make it blue'],
        ], $out);
    }

    public function test_a_conversation_ending_with_the_assistant_is_refused(): void
    {
        $this->expectException(HttpException::class);

        Conversation::sanitize([['role' => 'user', 'content' => 'x'], ['role' => 'assistant', 'content' => 'y']]);
    }

    public function test_long_text_is_clipped_with_an_ellipsis(): void
    {
        $this->assertSame('abc', Conversation::clip('abc', 3));
        $this->assertSame("ab\n…", Conversation::clip('abc', 2));
    }

    public function test_changed_paths_are_the_stamps_that_differ(): void
    {
        $before = ['/a' => '1:1', '/b' => '2:2'];
        $after = ['/a' => '1:1', '/b' => '3:3', '/c' => '4:4'];

        $changed = ChangedFiles::changedPaths($before, $after);

        $this->assertCount(2, $changed);
        $this->assertStringEndsWith('b', $changed[0]);
        $this->assertStringEndsWith('c', $changed[1]);
    }
}
