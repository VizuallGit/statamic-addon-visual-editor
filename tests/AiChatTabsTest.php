<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use MarioHamann\StatamicVisualEditor\AiChat\Tabs;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AiChatTabsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        File::deleteDirectory(Tabs::root());
    }

    protected function tearDown(): void
    {
        File::deleteDirectory(Tabs::root());

        parent::tearDown();
    }

    private function png(): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'sve').'.png';

        // 1×1 red PNG
        file_put_contents($path, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC'));

        return new UploadedFile($path, 'shot.png', 'image/png', null, true);
    }

    public function test_there_is_always_one_tab_and_a_new_one_opens(): void
    {
        $tabs = new Tabs('user-a');
        $first = $tabs->index();

        $this->assertCount(1, $first['tabs']);
        $this->assertSame($first['tabs'][0]['id'], $first['active']);

        $second = $tabs->create();

        $this->assertCount(2, $second['tabs']);
        $this->assertSame($second['tabs'][1]['id'], $second['active']);
    }

    public function test_closing_a_tab_deletes_its_chat_and_opens_the_neighbour(): void
    {
        $tabs = new Tabs('user-a');
        $a = $tabs->index()['active'];
        $b = $tabs->create()['active'];

        $tabs->saveDraft($b, 'half a question', []);
        $after = $tabs->close($b);

        $this->assertSame([$a], array_column($after['tabs'], 'id'));
        $this->assertSame($a, $after['active']);
        $this->assertNull($tabs->get($b));

        $last = $tabs->close($a);

        $this->assertCount(1, $last['tabs']);
        $this->assertNotSame($a, $last['active']);
    }

    public function test_the_draft_is_kept_exactly_as_typed(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];

        $tabs->saveDraft($id, "Make the heading bigger \n", []);

        $this->assertSame("Make the heading bigger \n", (new Tabs('user-a'))->get($id)['draft']);
    }

    public function test_an_image_is_stored_kept_in_the_draft_and_dropped_when_removed(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];
        $image = $tabs->storeImage($id, $this->png());

        $this->assertSame('image/png', $image['mime']);

        $tabs->saveDraft($id, '', [$image['id'], 'notanimage1234']);

        $this->assertSame([$image['id']], $tabs->get($id)['draft_images']);
        $this->assertFileExists($path = $tabs->imagePath($id, $image['id']));

        $tabs->saveDraft($id, '', []);

        $this->assertFileExists($path, 'a fresh image is kept a while');

        touch($path, time() - Tabs::ORPHAN_AGE - 1);
        $tabs->saveDraft($id, '', []);

        $this->assertNull($tabs->imagePath($id, $image['id']));
    }

    public function test_a_fresh_upload_survives_a_save_that_does_not_know_it_yet(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];
        $image = $tabs->storeImage($id, $this->png());

        // The box saved its text before the upload's answer came back.
        $tabs->saveDraft($id, 'typing', []);

        $this->assertNotNull($tabs->imagePath($id, $image['id']));
    }

    public function test_only_images_are_accepted(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];
        $path = tempnam(sys_get_temp_dir(), 'sve').'.txt';

        file_put_contents($path, 'not an image');

        $this->expectException(HttpException::class);

        $tabs->storeImage($id, new UploadedFile($path, 'shot.png', 'image/png', null, true));
    }

    public function test_a_question_is_written_before_the_answer_and_the_answer_after(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];
        $image = $tabs->storeImage($id, $this->png());

        $tabs->saveDraft($id, 'Make it red', [$image['id']]);

        ['run' => $run, 'chat' => $chat] = $tabs->ask($id, 'Make it red', [$image['id']], ['mode' => 'write']);

        $this->assertSame('', $chat['draft']);
        $this->assertSame([], $chat['draft_images']);
        $this->assertSame('Make it red', $chat['title']);
        $this->assertSame($run, $chat['pending']['run']);
        $this->assertSame([['id' => $image['id'], 'mime' => 'image/png']], $chat['messages'][0]['images']);
        $this->assertTrue((new Tabs('user-a'))->index()['tabs'][0]['pending']);

        $done = $tabs->finishRun($id, $run, ['role' => 'assistant', 'kind' => 'reply', 'content' => 'Done.']);

        $this->assertNull($done['pending']);
        $this->assertSame('Done.', $done['messages'][1]['content']);
        $this->assertFileExists($tabs->imagePath($id, $image['id']));
    }

    public function test_a_question_asked_while_it_answers_is_queued_and_asked_next(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];
        $image = $tabs->storeImage($id, $this->png());

        ['run' => $run] = $tabs->ask($id, 'one', [], ['mode' => 'build', 'type' => 'hero/style_1']);
        $queued = $tabs->ask($id, 'two', [$image['id']], ['mode' => 'write', 'model' => 'grok-4.7', 'type' => 'hero/style_2']);

        $this->assertArrayNotHasKey('run', $queued);
        $this->assertSame('two', $queued['queued']['text']);
        $this->assertSame('', $queued['chat']['draft']);
        $this->assertCount(1, $queued['chat']['messages']);
        $this->assertSame(1, $tabs->index()['tabs'][0]['queued']);

        // Nothing starts while the first is still being answered.
        $this->assertNull($tabs->startNext($id));

        $tabs->finishRun($id, $run, ['role' => 'assistant', 'kind' => 'reply', 'content' => 'Done one.']);
        $next = $tabs->startNext($id);

        $this->assertSame('two', $next['item']['text']);
        $this->assertSame('grok-4.7', $next['item']['model']);
        $this->assertSame('hero/style_2', $next['item']['type']);
        $this->assertSame($next['run'], $next['chat']['pending']['run']);
        $this->assertSame([], $next['chat']['queue']);
        $this->assertSame(['one', 'Done one.', 'two'], array_column($next['chat']['messages'], 'content'));
        $this->assertSame([['id' => $image['id'], 'mime' => 'image/png']], $next['chat']['messages'][2]['images']);
    }

    public function test_the_queue_has_a_ceiling(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];

        $tabs->ask($id, 'running', [], ['mode' => 'write']);

        for ($i = 0; $i < Tabs::MAX_QUEUE; $i++) {
            $tabs->ask($id, "q{$i}", [], ['mode' => 'write']);
        }

        $this->expectException(HttpException::class);

        $tabs->ask($id, 'one too many', [], ['mode' => 'write']);
    }

    public function test_stop_ends_the_answer_and_the_queue_waits(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];
        ['run' => $run] = $tabs->ask($id, 'one', [], ['mode' => 'build']);

        $tabs->ask($id, 'two', [], ['mode' => 'build']);

        $this->assertTrue($tabs->waitingFor($id, $run));

        $tabs->stop($id);

        $this->assertFalse($tabs->waitingFor($id, $run));
        $this->assertCount(1, $tabs->get($id)['queue']);
    }

    public function test_send_now_stops_the_answer_and_asks_that_question_in_its_place(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];
        ['run' => $run] = $tabs->ask($id, 'one', [], ['mode' => 'build']);
        $two = $tabs->ask($id, 'two', [], ['mode' => 'write'])['queued'];
        $three = $tabs->ask($id, 'three', [], ['mode' => 'write'])['queued'];

        $now = $tabs->sendNow($id, $three['id']);

        $this->assertFalse($tabs->waitingFor($id, $run));
        $this->assertTrue($tabs->waitingFor($id, $now['run']));
        $this->assertSame(['one', '', 'three'], array_column($now['chat']['messages'], 'content'));
        $this->assertSame('stopped', $now['chat']['messages'][1]['kind']);
        $this->assertSame([$two['id']], array_column($now['chat']['queue'], 'id'));
        $this->assertNull($tabs->sendNow($id, $three['id']));
    }

    public function test_a_queued_question_can_be_taken_out(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];

        $tabs->ask($id, 'one', [], ['mode' => 'write']);
        $two = $tabs->ask($id, 'two', [], ['mode' => 'write'])['queued'];

        $this->assertSame([], $tabs->unqueue($id, $two['id'])['queue']);
        $this->assertNull($tabs->unqueue($id, $two['id']));
    }

    public function test_the_model_is_kept_per_tab_and_a_new_tab_starts_with_the_last_one(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];

        $this->assertNull($tabs->get($id)['model']);

        $tabs->setModel($id, 'grok-4.7');
        $new = $tabs->create()['active'];

        $this->assertSame('grok-4.7', $tabs->get($id)['model']);
        $this->assertSame('grok-4.7', $tabs->get($new)['model']);
    }

    public function test_a_stopped_run_says_so_and_its_late_answer_is_dropped(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];
        ['run' => $run] = $tabs->ask($id, 'Build a hero', [], ['mode' => 'build']);

        $stopped = $tabs->stop($id);

        $this->assertSame('stopped', $stopped['messages'][1]['kind']);
        $this->assertSame('build', $stopped['messages'][1]['mode']);
        $this->assertNull($tabs->finishRun($id, $run, ['role' => 'assistant', 'kind' => 'reply', 'content' => 'late']));
        $this->assertCount(2, $tabs->get($id)['messages']);
    }

    public function test_a_run_that_died_with_its_process_is_closed_with_a_note(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];

        $tabs->ask($id, 'hello', [], ['mode' => 'write']);

        $path = collect(File::allFiles(Tabs::root()))->first(fn ($file) => $file->getFilename() === $id.'.json')->getPathname();
        $chat = json_decode(file_get_contents($path), true);
        $chat['pending']['since'] = time() - Tabs::PENDING_TIMEOUT - 1;
        file_put_contents($path, json_encode($chat));

        $after = $tabs->get($id);

        $this->assertNull($after['pending']);
        $this->assertSame('lost', end($after['messages'])['kind']);
    }

    public function test_the_agent_sees_questions_answers_and_the_images_not_errors_or_stops(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];
        $image = $tabs->storeImage($id, $this->png());

        ['run' => $run] = $tabs->ask($id, 'first', [], ['mode' => 'write']);
        $tabs->finishRun($id, $run, ['role' => 'assistant', 'kind' => 'error', 'content' => 'boom']);
        ['run' => $run] = $tabs->ask($id, 'second', [], ['mode' => 'write']);
        $tabs->finishRun($id, $run, ['role' => 'assistant', 'kind' => 'reply', 'content' => 'ok']);
        ['chat' => $chat] = $tabs->ask($id, 'look', [$image['id']], ['mode' => 'write']);

        $agent = $tabs->forAgent($chat);

        $this->assertSame(['user', 'user', 'assistant', 'user'], array_column($agent['messages'], 'role'));
        $this->assertSame("look\n\n[1 image attached]", $agent['messages'][3]['content']);
        $this->assertCount(1, $agent['images']);
        $this->assertSame('image/png', $agent['images'][0]['mimeType']);
    }

    public function test_users_never_see_each_others_tabs(): void
    {
        $mine = (new Tabs('user-a'))->index()['active'];

        $this->assertNull((new Tabs('user-b'))->get($mine));
        $this->assertNotSame($mine, (new Tabs('user-b'))->index()['active']);
    }

    public function test_guests_cannot_reach_the_tabs_or_the_chat(): void
    {
        $this->getJson('/!/sve/ai-tabs')->assertStatus(403);
        $this->postJson('/!/sve/ai-chat', ['tab' => 'abcdefgh1234', 'text' => 'hi'])->assertStatus(403);
    }
}
