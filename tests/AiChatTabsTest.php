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

        ['run' => $run, 'chat' => $chat] = $tabs->startRun($id, 'Make it red', [$image['id']], 'write');

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

    public function test_one_question_at_a_time_per_tab(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];

        $tabs->startRun($id, 'one', [], 'write');

        $this->expectException(HttpException::class);

        $tabs->startRun($id, 'two', [], 'write');
    }

    public function test_a_stopped_run_says_so_and_its_late_answer_is_dropped(): void
    {
        $tabs = new Tabs('user-a');
        $id = $tabs->index()['active'];
        ['run' => $run] = $tabs->startRun($id, 'Build a hero', [], 'build');

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

        $tabs->startRun($id, 'hello', [], 'write');

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

        ['run' => $run] = $tabs->startRun($id, 'first', [], 'write');
        $tabs->finishRun($id, $run, ['role' => 'assistant', 'kind' => 'error', 'content' => 'boom']);
        ['run' => $run] = $tabs->startRun($id, 'second', [], 'write');
        $tabs->finishRun($id, $run, ['role' => 'assistant', 'kind' => 'reply', 'content' => 'ok']);
        ['chat' => $chat] = $tabs->startRun($id, 'look', [$image['id']], 'write');

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
