<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use MarioHamann\StatamicVisualEditor\LiveReload;

class LiveReloadTest extends TestCase
{
    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->root = sys_get_temp_dir().'/sve-live-reload-'.uniqid();
        File::ensureDirectoryExists($this->root.'/views');
        File::ensureDirectoryExists($this->root.'/css');
        File::ensureDirectoryExists($this->root.'/public/build');

        $this->app->usePublicPath($this->root.'/public');

        config([
            'statamic-visual-editor.live_reload.markup' => [$this->root.'/views'],
            'statamic-visual-editor.live_reload.sources' => [$this->root.'/views', $this->root.'/css'],
        ]);

        Cache::forget('sve-live-reload:attempt');
        Cache::forget('sve-live-reload:flushed');
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);
        Cache::forget('sve-live-reload:attempt');
        Cache::forget('sve-live-reload:flushed');

        parent::tearDown();
    }

    /** As if the last build ended a minute ago — past the gap between builds. */
    private function backdateAttempt(): void
    {
        $attempt = Cache::get('sve-live-reload:attempt');
        $attempt['at'] = time() - 60;
        Cache::forever('sve-live-reload:attempt', $attempt);
    }

    private function write(string $relative, string $contents, int $ago = 10): string
    {
        $path = $this->root.'/'.$relative;
        file_put_contents($path, $contents);
        touch($path, time() - $ago);

        return $path;
    }

    public function test_the_markup_signature_changes_when_a_template_is_saved_added_or_removed(): void
    {
        $view = $this->write('views/hero.antlers.html', '<h1>One</h1>');
        $first = LiveReload::page()['markup'];

        $this->assertSame($first, LiveReload::page()['markup'], 'nothing changed');

        $this->write('views/hero.antlers.html', '<h1>Two!</h1>', 5);
        $saved = LiveReload::page()['markup'];
        $this->assertNotSame($first, $saved);

        $this->write('views/new.antlers.html', '<p>new</p>');
        $added = LiveReload::page()['markup'];
        $this->assertNotSame($saved, $added);

        unlink($this->root.'/views/new.antlers.html');
        $this->assertSame($saved, LiveReload::page()['markup'], 'removing the file goes back');

        $this->write('views/.hero.antlers.html.swp', 'editor swap file');
        $this->assertSame($saved, LiveReload::page()['markup'], 'dotfiles are not templates');

        $this->write('css/site.css', 'body{}');
        $this->assertSame($saved, LiveReload::page()['markup'], 'css is not markup — the build answers for it');
        $this->assertFileExists($view);
    }

    public function test_the_build_signature_is_the_manifest(): void
    {
        $this->assertSame('', LiveReload::page()['build'], 'no manifest yet');

        $this->write('public/build/manifest.json', '{"a":1}');
        $one = LiveReload::page()['build'];
        $this->write('public/build/manifest.json', '{"a":2}');

        $this->assertNotSame('', $one);
        $this->assertNotSame($one, LiveReload::page()['build']);
    }

    public function test_sources_newer_than_the_manifest_are_stale(): void
    {
        $this->write('public/build/manifest.json', '{}', 100);
        $this->write('views/hero.antlers.html', '<h1>old</h1>', 200);

        $this->assertFalse(LiveReload::status()['stale'], 'built after the last save');

        $this->write('css/site.css', 'body{}', 50);

        $this->assertTrue(LiveReload::status()['stale']);
    }

    public function test_a_file_still_being_written_is_not_built_yet(): void
    {
        $this->write('public/build/manifest.json', '{}', 100);
        $this->write('css/site.css', 'body{}', 0);

        $this->assertFalse(LiveReload::status()['stale']);
    }

    public function test_nothing_is_built_while_npm_run_dev_runs(): void
    {
        $this->write('css/site.css', 'body{}', 50);
        $this->write('public/hot', 'http://localhost:5173');

        $this->assertTrue(LiveReload::hot());
        $this->assertFalse(LiveReload::status()['stale']);
    }

    public function test_after_an_attempt_only_new_sources_are_stale(): void
    {
        $this->write('public/build/manifest.json', '{}', 100);
        $this->write('css/site.css', 'body{}', 50);
        $status = LiveReload::status();

        LiveReload::build($status['sources'], fn () => ['ok' => true]);
        $this->backdateAttempt();

        $this->assertFalse(LiveReload::status()['stale'], 'the same sources are not built twice');

        $this->write('css/site.css', 'body{color:red}', 20);

        $this->assertTrue(LiveReload::status()['stale']);
    }

    public function test_builds_keep_a_gap_while_the_dock_saves_on_every_keystroke(): void
    {
        $this->write('public/build/manifest.json', '{}', 100);
        $this->write('views/hero.antlers.html', '<h1>a</h1>', 50);
        LiveReload::build(LiveReload::status()['sources'], fn () => ['ok' => true]);

        $this->write('views/hero.antlers.html', '<h1>ab</h1>', 3);

        $this->assertFalse(LiveReload::status()['stale'], 'the last build ended a moment ago');

        $this->backdateAttempt();

        $this->assertTrue(LiveReload::status()['stale']);
    }

    public function test_a_build_that_throws_is_a_failed_attempt_not_a_loop(): void
    {
        $this->write('public/build/manifest.json', '{}', 100);
        $this->write('css/site.css', 'body{}', 50);
        $status = LiveReload::status();
        $runs = 0;

        $timeout = function () use (&$runs) {
            $runs++;

            throw new \RuntimeException('The process "vite build" exceeded the timeout of 150 seconds.');
        };

        LiveReload::build($status['sources'], $timeout);
        $this->backdateAttempt();
        LiveReload::build($status['sources'], $timeout);

        $after = LiveReload::status();

        $this->assertSame(1, $runs);
        $this->assertFalse($after['stale']);
        $this->assertStringContainsString('exceeded the timeout', $after['error']['output']);
    }

    public function test_a_build_whose_worker_was_ended_reads_as_unfinished(): void
    {
        $this->write('css/site.css', 'body{}', 50);
        $status = LiveReload::status();

        // The worker died inside the build: only the attempt written before it is left.
        $seen = null;
        LiveReload::build($status['sources'], function () use (&$seen) {
            $seen = Cache::get('sve-live-reload:attempt');

            return ['ok' => true];
        });

        $this->assertFalse($seen['ok']);
        $this->assertSame($status['sources'], $seen['sig']);

        Cache::forever('sve-live-reload:attempt', $seen);
        $this->backdateAttempt();
        $after = LiveReload::status();

        $this->assertFalse($after['stale'], 'not started again for the same files');
        $this->assertSame('The build did not finish.', $after['error']['output']);
    }

    public function test_no_error_is_shown_while_a_build_runs(): void
    {
        $this->write('css/site.css', 'body{}', 50);
        $sources = LiveReload::status()['sources'];
        Cache::forever('sve-live-reload:attempt', ['sig' => $sources, 'ok' => false, 'reason' => 'failed', 'output' => 'The build did not finish.', 'at' => time()]);

        $lock = fopen(storage_path('framework/sve-live-reload.lock'), 'c');
        flock($lock, LOCK_EX);

        try {
            $status = LiveReload::status();
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }

        $this->assertTrue($status['building']);
        $this->assertNull($status['error']);
    }

    public function test_a_failed_build_is_reported_once_and_not_retried_for_the_same_files(): void
    {
        $this->write('public/build/manifest.json', '{}', 100);
        $this->write('css/site.css', 'body{', 50);
        $status = LiveReload::status();
        $runs = 0;

        $fail = function () use (&$runs) {
            $runs++;

            return ['ok' => false, 'reason' => 'failed', 'output' => 'CssSyntaxError: Unclosed block'];
        };

        LiveReload::build($status['sources'], $fail);
        $this->backdateAttempt();
        LiveReload::build($status['sources'], $fail);

        $after = LiveReload::status();

        $this->assertSame(1, $runs);
        $this->assertFalse($after['stale']);
        $this->assertSame('failed', $after['error']['reason']);
        $this->assertStringContainsString('Unclosed block', $after['error']['output']);

        $this->write('css/site.css', 'body{}', 20);
        $fixed = LiveReload::status();

        $this->assertNull($fixed['error'], 'a new save is a new attempt');
        $this->assertTrue($fixed['stale']);
    }

    public function test_a_build_already_running_is_not_started_again(): void
    {
        $this->write('css/site.css', 'body{}', 50);
        $status = LiveReload::status();
        $runs = 0;

        $lock = fopen(storage_path('framework/sve-live-reload.lock'), 'c');
        flock($lock, LOCK_EX);

        try {
            $this->assertTrue(LiveReload::building());
            LiveReload::build($status['sources'], function () use (&$runs) {
                $runs++;

                return ['ok' => true];
            });
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }

        $this->assertSame(0, $runs);
        $this->assertFalse(LiveReload::building());
    }

    public function test_a_changed_template_flushes_the_static_cache_once(): void
    {
        $this->write('views/hero.antlers.html', '<h1>One</h1>');

        // A fresh cache only records where the templates stand.
        $markup = LiveReload::status()['markup'];
        $this->assertSame($markup, Cache::get('sve-live-reload:flushed'));

        $this->write('views/hero.antlers.html', '<h1>Two!</h1>', 5);
        $changed = LiveReload::status()['markup'];

        $this->assertNotSame($markup, $changed);
        $this->assertSame($changed, Cache::get('sve-live-reload:flushed'));
    }
}
