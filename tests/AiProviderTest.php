<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Process\PendingProcess;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use MarioHamann\StatamicVisualEditor\AiChat;
use MarioHamann\StatamicVisualEditor\AiChat\Models;
use MarioHamann\StatamicVisualEditor\AiChat\Run;
use MarioHamann\StatamicVisualEditor\AiCopy;
use MarioHamann\StatamicVisualEditor\AiProvider;
use MarioHamann\StatamicVisualEditor\ClaudeAgent;
use MarioHamann\StatamicVisualEditor\CursorAgent;
use MarioHamann\StatamicVisualEditor\Features;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * One choice for every AI in the editor: Cursor or Claude. The AI chat, AI
 * text and the dock all run on the one picked, on its key — never the other.
 */
class AiProviderTest extends TestCase
{
    use FakesCursorAgent;

    protected function tearDown(): void
    {
        File::deleteDirectory(Run::directory());
        Features::flush();

        parent::tearDown();
    }

    protected function onClaude(string $key = 'sk-ant-test'): void
    {
        config(['statamic-visual-editor.ghost.provider' => 'claude', 'statamic-visual-editor.ghost.api_key' => $key]);
    }

    public function test_cursor_is_the_default_and_claude_is_picked_by_the_one_setting(): void
    {
        $this->assertSame('cursor', AiProvider::current());
        $this->assertSame(CursorAgent::class, AiProvider::agent());

        $this->onClaude();

        $this->assertSame('claude', AiProvider::current());
        $this->assertSame(ClaudeAgent::class, AiProvider::agent());
        $this->assertSame('sk-ant-test', AiProvider::key());

        config(['statamic-visual-editor.ghost.provider' => 'gpt']);
        $this->assertSame('cursor', AiProvider::current());
    }

    public function test_only_the_key_of_the_way_picked_counts(): void
    {
        config(['statamic-visual-editor.ai.api_key' => 'crsr-test']);
        $this->assertSame('crsr-test', AiProvider::key());

        $this->onClaude('');
        $this->assertSame('', AiProvider::key(), 'Claude picked without its key: the Cursor key is not used instead.');
        $this->assertStringContainsString('Claude API key', AiProvider::needKey());
    }

    public function test_the_claude_model_is_one_of_claude_s_else_opus(): void
    {
        $this->assertSame('claude-sonnet-5-5', AiProvider::claudeModel('claude-sonnet-5-5'));
        $this->assertSame('claude-opus-5-5', AiProvider::claudeModel('grok-4.7'));

        config(['statamic-visual-editor.features.ai_model' => 'claude-haiku-5-5']);
        $this->assertSame('claude-haiku-5-5', AiProvider::claudeModel());
    }

    public function test_on_claude_the_chat_s_picker_lists_claude_s_models(): void
    {
        $this->onClaude();

        $this->assertSame(['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-5-5'], array_column(Models::all(), 'id'));
    }

    public function test_the_ai_chat_on_claude_runs_the_claude_runner_on_the_claude_key(): void
    {
        $this->onClaude();
        $claude = $this->fakeClaudeAgent('Here is the markup.');
        $cursor = $this->fakeCursorAgent('never');

        $out = AiChat::talk('hero/style_2', [['role' => 'user', 'content' => 'A heading, please']], 'write', [], 'claude-sonnet-5-5');

        $this->assertSame('Here is the markup.', $out['reply']);
        $this->assertCount(1, $claude::$payloads);
        $this->assertSame([], $cursor::$payloads);
        $this->assertSame('sk-ant-test', $claude::$payloads[0]['apiKey']);
        $this->assertSame('claude-sonnet-5-5', $claude::$payloads[0]['model']);
        $this->assertArrayNotHasKey('settingSources', $claude::$payloads[0]);
    }

    public function test_the_ai_chat_on_claude_without_its_key_says_so(): void
    {
        $this->onClaude('');
        config(['statamic-visual-editor.ai.api_key' => 'crsr-test']);

        try {
            AiChat::talk('hero/style_2', [['role' => 'user', 'content' => 'hi']]);
            $this->fail('No Claude key: nothing may be asked.');
        } catch (HttpException $e) {
            $this->assertSame(422, $e->getStatusCode());
            $this->assertStringContainsString('Claude API key', $e->getMessage());
        }
    }

    public function test_ai_text_on_claude_runs_the_claude_runner(): void
    {
        $this->onClaude();
        $claude = $this->fakeClaudeAgent('["Hypnose i Holstebro", "Slip angsten"]');

        $this->assertSame(['Hypnose i Holstebro', 'Slip angsten'], AiCopy::suggest(['kind' => 'heading', 'text' => 'Hypnose', 'count' => 2]));
        $this->assertCount(1, $claude::$payloads);
        $this->assertArrayNotHasKey('write', $claude::$payloads[0]);
    }

    public function test_the_claude_runner_s_sdk_comes_with_the_addon(): void
    {
        $this->assertNotNull(ClaudeAgent::sdkPath());
        $this->assertFileExists(ClaudeAgent::script());
    }

    public function test_a_chat_question_is_answered_in_the_background(): void
    {
        Process::fake();

        $id = Run::start('author-1', 'abcdefgh1234', ['run' => 'r1', 'chat' => ['id' => 'abcdefgh1234'], 'item' => ['text' => 'hi']]);

        Process::assertRan(fn (PendingProcess $process) => str_starts_with($process->command, 'nohup ')
            && str_contains($process->command, "sve:ai-chat-run '{$id}'"));

        $this->assertSame(['user' => 'author-1', 'tab' => 'abcdefgh1234', 'started' => ['run' => 'r1', 'chat' => ['id' => 'abcdefgh1234'], 'item' => ['text' => 'hi']]], Run::take($id));
        $this->assertNull(Run::take($id), 'Read once, then gone.');
        $this->assertNull(Run::take('../../.env'));
    }
}
