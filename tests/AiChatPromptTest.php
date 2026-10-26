<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\AiChat\Conversation;
use MarioHamann\StatamicVisualEditor\AiChat\Prompt;
use MarioHamann\StatamicVisualEditor\AiChat\WriteScope;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * The chat's input shaping, reachable since WP7d moved it out of AiChat: the
 * conversation that reaches the agent, and what it is told it may change.
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

    public function test_write_mode_is_told_it_can_change_nothing(): void
    {
        $text = Prompt::writeScope(null);

        $this->assertStringContainsString('nothing', $text);
        $this->assertStringContainsString('no shell', $text);
    }

    public function test_build_mode_is_told_it_may_build_anything_in_content_and_theme(): void
    {
        $text = Prompt::writeScope(WriteScope::for('build'));

        $this->assertStringContainsString('the whole of its content and theme (content/, resources/, public/)', $text);
        $this->assertStringContainsString('no file has to be named first', $text);
        $this->assertStringContainsString('taxonomies', $text);
        $this->assertStringContainsString('There is no shell', $text);
        $this->assertStringContainsString('never edit page_sections.yaml', $text);
        $this->assertStringContainsString('fetch_page', $text);
        $this->assertStringNotContainsString('du må ændre site.css', $text);
    }

    public function test_the_prompt_carries_the_write_scope_and_never_asks_for_page_sections_to_be_rewritten(): void
    {
        $prompt = Prompt::prompt('', [['role' => 'user', 'content' => 'Make a hero']], 'build', [
            'files' => [],
            'create' => ['resources/fieldsets/'],
            'rules' => 'resources/visual-editor/ai-rules.md',
        ]);

        $this->assertStringContainsString('WHAT YOU CAN CHANGE', $prompt);
        $this->assertStringContainsString('register_section', $prompt);
        $this->assertStringNotContainsString('write the full YAML back', $prompt);
    }
}
