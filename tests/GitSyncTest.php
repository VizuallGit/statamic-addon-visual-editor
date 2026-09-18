<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Support\Facades\Bus;
use MarioHamann\StatamicVisualEditor\GitSync;
use Statamic\Git\CommitJob;

class GitSyncTest extends TestCase
{
    public function test_the_editors_paths_join_statamics_commit_paths(): void
    {
        config(['statamic.git.paths' => [base_path('content')]]);

        GitSync::register();

        $paths = config('statamic.git.paths');

        $this->assertContains(base_path('content'), $paths);
        $this->assertContains(resource_path('views'), $paths);
        $this->assertContains(resource_path('visual-editor'), $paths);
        $this->assertContains(resource_path('css'), $paths);
        $this->assertContains(storage_path('statamic-visual-editor'), $paths);
        $this->assertSame(count($paths), count(array_unique($paths)));
    }

    public function test_no_commit_is_asked_for_when_git_automation_is_off(): void
    {
        Bus::fake();
        config(['statamic.git.enabled' => false, 'statamic.git.automatic' => true]);

        GitSync::after('section template');

        Bus::assertNotDispatched(CommitJob::class);
    }

    public function test_no_commit_is_asked_for_when_commits_are_scheduled_instead(): void
    {
        Bus::fake();
        config(['statamic.git.enabled' => true, 'statamic.git.automatic' => false]);

        GitSync::after('section template');

        Bus::assertNotDispatched(CommitJob::class);
    }

    public function test_a_write_asks_for_a_commit_like_a_cp_save_does(): void
    {
        Bus::fake();
        config(['statamic.git.enabled' => true, 'statamic.git.automatic' => true, 'statamic.git.dispatch_delay' => 0]);

        GitSync::after('section template hero/style_1');

        Bus::assertDispatched(CommitJob::class);
    }
}
