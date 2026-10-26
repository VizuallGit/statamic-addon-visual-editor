<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Process\PendingProcess;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Process;
use MarioHamann\StatamicVisualEditor\DockGhost;
use MarioHamann\StatamicVisualEditor\DockGhost\Job;
use MarioHamann\StatamicVisualEditor\DockGhost\Usage;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\User;

/**
 * The dock AI on the Cursor key, answered in the background: the POST starts
 * a job and answers 202, `sve:ghost-job` answers it, the job route gives the
 * answer to its own author. No worker really starts here (Process::fake).
 */
class DockGhostJobTest extends TestCase
{
    use FakesCursorAgent;

    /** @var list<\Statamic\Contracts\Auth\User> */
    protected array $users = [];

    protected function setUp(): void
    {
        parent::setUp();

        Process::fake();
        File::deleteDirectory(Job::directory());
        File::deleteDirectory(Usage::directory());
    }

    protected function tearDown(): void
    {
        foreach ($this->users as $user) {
            $user->delete();
        }

        File::deleteDirectory(Job::directory());
        File::deleteDirectory(Usage::directory());
        Features::flush();

        parent::tearDown();
    }

    public function test_start_writes_the_job_and_starts_its_worker_detached(): void
    {
        $id = Job::start('complete', ['before' => '<div>', 'mode' => 'line']);

        $this->assertMatchesRegularExpression('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/', $id);
        $this->assertFileExists(Job::directory()."/{$id}.json");

        $job = Job::read($id);

        $this->assertSame('complete', $job['kind']);
        $this->assertSame('pending', $job['state']);
        $this->assertSame('<div>', $job['request']['before']);
        $this->assertIsInt($job['started']);

        Process::assertRan(fn (PendingProcess $process) => str_starts_with($process->command, 'nohup ')
            && str_contains($process->command, "sve:ghost-job '{$id}'")
            && str_ends_with($process->command, '> /dev/null 2>&1 &')
            && ! str_contains($process->command, 'php-fpm'));
    }

    public function test_the_worker_answers_the_job_with_the_agent_s_reply(): void
    {
        config(['statamic-visual-editor.ai.api_key' => 'crsr-test']);
        $agent = $this->fakeCursorAgent("```html\n<p>{{ text }}</p>\n```");

        $id = Job::start('complete', ['before' => "<div>\n  ", 'after' => "\n</div>", 'mode' => 'line']);

        $this->artisan('sve:ghost-job', ['id' => $id])->assertSuccessful();

        $job = Job::read($id);

        $this->assertSame('done', $job['state']);
        $this->assertTrue($job['result']['ok']);
        $this->assertSame('<p>{{ text }}</p>', $job['result']['text']);
        $this->assertSame('cursor', $job['result']['via']);
        $this->assertCount(1, $agent::$payloads);
    }

    public function test_the_worker_answers_cmd_k_through_edit(): void
    {
        config(['statamic-visual-editor.ai.api_key' => 'crsr-test']);
        $this->fakeCursorAgent('<h3>{{ title }}</h3>');

        $id = Job::start('edit', ['instruction' => 'h3', 'before' => '', 'selection' => "<h2>{{ title }}</h2>\n", 'after' => '']);

        $this->artisan('sve:ghost-job', ['id' => $id])->assertSuccessful();

        $this->assertSame("<h3>{{ title }}</h3>\n", Job::read($id)['result']['text']);
    }

    public function test_an_unknown_or_malformed_id_is_no_job(): void
    {
        $this->assertNull(Job::read('6f1c0b9e-0000-4000-8000-000000000000'));
        $this->assertNull(Job::read('../../.env'));
        $this->artisan('sve:ghost-job', ['id' => 'nope'])->assertFailed();
    }

    public function test_old_job_files_are_swept_when_the_next_one_starts(): void
    {
        $old = Job::start('complete', ['before' => '<div>']);
        touch(Job::directory()."/{$old}.json", time() - Job::KEEP - 1);

        $new = Job::start('complete', ['before' => '<div>']);

        $this->assertNull(Job::read($old));
        $this->assertNotNull(Job::read($new));
    }

    /* ---- The routes ---------------------------------------------------------- */

    public function test_on_the_cursor_key_the_post_starts_a_job_and_the_job_route_answers_it(): void
    {
        $this->signedIn('ghost-job@example.com');
        config(['statamic-visual-editor.ai.api_key' => 'crsr-test']);
        $this->fakeCursorAgent('<p>{{ text }}</p>');

        $id = $this->postJson('/!/sve/dock-ghost', ['before' => "<div>\n  ", 'after' => "\n</div>", 'section' => 'hero/style_2'])
            ->assertStatus(202)
            ->assertJson(['ok' => true])
            ->json('job');

        $this->getJson("/!/sve/dock-ghost/job/{$id}")
            ->assertOk()
            ->assertExactJson(['ok' => true, 'state' => 'pending']);

        $this->artisan('sve:ghost-job', ['id' => $id])->assertSuccessful();

        $this->getJson("/!/sve/dock-ghost/job/{$id}")
            ->assertOk()
            ->assertJson(['ok' => true, 'state' => 'done', 'text' => '<p>{{ text }}</p>']);
    }

    public function test_a_failed_job_answers_with_its_own_status_and_done(): void
    {
        $this->signedIn('ghost-job-failed@example.com');
        config(['statamic-visual-editor.ai.api_key' => 'crsr-wrong']);
        $this->fakeCursorAgent(['status' => 'error', 'error' => 'Invalid API key']);

        $id = $this->postJson('/!/sve/dock-ghost/edit', ['instruction' => 'h3', 'selection' => '<h2>x</h2>'])->assertStatus(202)->json('job');

        $this->artisan('sve:ghost-job', ['id' => $id])->assertSuccessful();

        $this->getJson("/!/sve/dock-ghost/job/{$id}")
            ->assertStatus(502)
            ->assertExactJson(['message' => 'Invalid API key', 'state' => 'done']);
    }

    public function test_a_job_still_pending_after_its_deadline_is_answered_as_failed(): void
    {
        $this->signedIn('ghost-job-stale@example.com');

        $id = Job::start('complete', ['before' => '<div>']);
        $path = Job::directory()."/{$id}.json";
        file_put_contents($path, json_encode(['started' => 0] + json_decode(file_get_contents($path), true)));

        $this->getJson("/!/sve/dock-ghost/job/{$id}")
            ->assertStatus(502)
            ->assertJson(['state' => 'done', 'message' => __('sve::messages.dock_ghost_error')]);
    }

    public function test_another_author_s_job_is_forbidden_and_an_unknown_one_not_found(): void
    {
        $this->signedIn('ghost-job-owner@example.com');
        $id = Job::start('complete', ['before' => '<div>']);

        $this->signedIn('ghost-job-other@example.com');

        $this->getJson("/!/sve/dock-ghost/job/{$id}")->assertForbidden();
        $this->getJson('/!/sve/dock-ghost/job/6f1c0b9e-0000-4000-8000-000000000000')->assertNotFound();
    }

    public function test_cmd_k_without_an_instruction_is_refused_at_once_without_a_job(): void
    {
        $this->signedIn('ghost-job-empty@example.com');
        config(['statamic-visual-editor.ai.api_key' => 'crsr-test']);

        $this->postJson('/!/sve/dock-ghost/edit', ['instruction' => '  ', 'selection' => '<h2>x</h2>'])
            ->assertStatus(422)
            ->assertJson(['message' => __('sve::messages.dock_ghost_edit_empty')]);

        $this->assertSame([], glob(Job::directory().'/*') ?: []);
        Process::assertNothingRan();
    }

    public function test_on_claude_the_post_answers_in_the_request_as_before(): void
    {
        $this->signedIn('ghost-job-claude@example.com');
        config(['statamic-visual-editor.ghost.provider' => 'claude', 'statamic-visual-editor.ghost.api_key' => 'sk-ant-test']);

        Http::fake([DockGhost::ENDPOINT => Http::response(['content' => [['type' => 'text', 'text' => '<p>{{ text }}</p>']], 'usage' => []])]);

        $this->postJson('/!/sve/dock-ghost', ['before' => "<div>\n  ", 'after' => "\n</div>"])
            ->assertOk()
            ->assertJson(['ok' => true, 'text' => '<p>{{ text }}</p>'])
            ->assertJsonMissing(['job']);

        Process::assertNothingRan();
    }

    /** A super admin, signed in, with the template dock and the dock AI on. */
    protected function signedIn(string $email): void
    {
        $user = User::make()->email($email)->makeSuper();
        $user->save();
        $this->users[] = $user;
        $this->actingAs($user);

        config([
            'statamic-visual-editor.features.template_dock' => true,
            'statamic-visual-editor.features.dock_ghost' => true,
        ]);
        Features::flush();
    }
}
