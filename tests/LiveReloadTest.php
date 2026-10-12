<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use MarioHamann\StatamicVisualEditor\LiveReload;
use MarioHamann\StatamicVisualEditor\SiteBuild;

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

        $this->forgetStamps();
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);
        $this->forgetStamps();

        parent::tearDown();
    }

    private function forgetStamps(): void
    {
        foreach (['attempt', 'flushed', 'writing', 'own'] as $key) {
            Cache::forget('sve-live-reload:'.$key);
        }
    }

    /** A build newer than every source: nothing is stale, a held poll is not answered for a build. */
    private function built(): void
    {
        $this->write('public/build/manifest.json', '{}', 1);
    }

    /** As if the stamp under `$key` was taken `$ago` seconds ago. */
    private function backdate(string $key, float $ago): void
    {
        $stamp = Cache::get('sve-live-reload:'.$key);
        $stamp['at'] = microtime(true) - $ago;
        Cache::forever('sve-live-reload:'.$key, $stamp);
    }

    /**
     * Writes a file from another process after `$delay` seconds — the way a
     * save from Cursor lands while a poll is held — by moving a finished file
     * into place, so no half-written state is ever seen. Returns the path of
     * a file that will hold the write's microtime.
     *
     * `$then` is PHP run in that process right after the move, with the
     * addon's autoloader loaded.
     */
    private function writeLater(float $delay, string $relative, string $contents, int $mtime, string $then = ''): string
    {
        $tmp = $this->root.'/tmp-'.uniqid();
        $stamp = $this->root.'/written-'.uniqid();
        $code = sprintf(
            'require %s; usleep(%d); file_put_contents(%s, %s); touch(%s, %d); rename(%s, %s); file_put_contents(%s, (string) microtime(true)); %s',
            var_export(dirname(__DIR__).'/vendor/autoload.php', true),
            (int) ($delay * 1_000_000),
            var_export($tmp, true), var_export($contents, true),
            var_export($tmp, true), $mtime,
            var_export($tmp, true), var_export($this->root.'/'.$relative, true),
            var_export($stamp, true),
            $then
        );

        exec(sprintf('%s -r %s > /dev/null 2>&1 &', escapeshellarg(PHP_BINARY), escapeshellarg($code)));

        return $stamp;
    }

    /** When the other process wrote, once it has. */
    private function writtenAt(string $stamp): float
    {
        for ($i = 0; $i < 100 && ! is_file($stamp); $i++) {
            usleep(10_000);
        }

        return (float) file_get_contents($stamp);
    }

    /** The markup signature the views will have once `$relative` holds `$contents` with `$mtime`. */
    private function markupWith(string $relative, string $contents, int $mtime): string
    {
        $path = $this->root.'/'.$relative;
        $before = is_file($path) ? [file_get_contents($path), filemtime($path)] : null;

        file_put_contents($path, $contents);
        touch($path, $mtime);
        $sig = LiveReload::page()['markup'];

        if ($before === null) {
            unlink($path);
        } else {
            file_put_contents($path, $before[0]);
            touch($path, $before[1]);
        }

        return $sig;
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

    public function test_the_answer_says_own_and_names_the_built_stylesheet(): void
    {
        $this->app->setBasePath($this->root);
        File::ensureDirectoryExists($this->root.'/resources/css');
        file_put_contents($this->root.'/resources/css/site.css', '@import "tailwindcss";');
        config(['statamic-visual-editor.tailwind.css' => $this->root.'/resources/css/site.css']);

        $this->assertNull(LiveReload::status('s1')['css'], 'no build yet');
        $this->assertFalse(LiveReload::status('s1')['own']);

        $this->write('public/build/manifest.json', '{"resources/css/site.css":{"file":"assets/site-AbC123.css","src":"resources/css/site.css"}}');

        $status = LiveReload::status('s1');
        $this->assertSame('/build/assets/site-AbC123.css', $status['css']);
        $this->assertSame(SiteBuild::entryCss(), $status['css']);
    }

    public function test_the_markup_a_finished_write_left_is_that_sessions_own(): void
    {
        $this->write('views/hero.antlers.html', '<h1>One</h1>', 60);

        LiveReload::writing('s1');
        $this->write('views/hero.antlers.html', '<h1>Two!</h1>', 30);
        LiveReload::wrote('s1');
        // Past the moment right after the write: only the signature speaks.
        $this->backdate('writing', 6);
        $this->backdate('own', 5);

        $markup = LiveReload::page()['markup'];

        $this->assertSame($markup, Cache::get('sve-live-reload:own')['sig']);
        $this->assertTrue(LiveReload::own($markup, 's1'));
        $this->assertFalse(LiveReload::own($markup, 's2'), 'another session saw a save from outside');
        $this->assertFalse(LiveReload::own($markup, null), 'no session is never an editor');
        $this->assertTrue(LiveReload::status('s1')['own']);
        $this->assertFalse(LiveReload::status()['own']);

        $this->write('views/hero.antlers.html', '<h1>From Cursor</h1>', 10);

        $this->assertFalse(LiveReload::own(LiveReload::page()['markup'], 's1'), 'a later save from outside is not');
    }

    public function test_a_write_under_way_is_its_sessions_own_until_it_ends(): void
    {
        $this->write('views/hero.antlers.html', '<h1>One</h1>', 60);

        // The dock wrote the template and is compiling Tailwind: no end stamp yet.
        LiveReload::writing('s1');
        $this->write('views/hero.antlers.html', '<h1>Two!</h1>', 30);
        $markup = LiveReload::page()['markup'];

        $this->assertTrue(LiveReload::own($markup, 's1'));
        $this->assertFalse(LiveReload::own($markup, 's2'));
        $this->assertFalse(LiveReload::own($markup, null));

        // A worker killed mid-request does not make every later save the editor's.
        $this->backdate('writing', 16);
        $this->assertFalse(LiveReload::own($markup, 's1'));

        // A write finished after it, by anyone, ends it as well.
        LiveReload::writing('s1');
        LiveReload::wrote('s2');
        $this->write('views/hero.antlers.html', '<h1>From Cursor</h1>', 10);

        $this->assertFalse(LiveReload::own(LiveReload::page()['markup'], 's1'));
    }

    public function test_a_change_right_after_the_write_still_counts_as_it(): void
    {
        $this->write('views/hero.antlers.html', '<h1>One</h1>', 60);
        LiveReload::writing('s1');
        LiveReload::wrote('s1');

        // Something the save set off after its response touches a file.
        $this->write('views/hero.antlers.html', '<h1>One, later</h1>', 30);
        $markup = LiveReload::page()['markup'];

        $this->assertTrue(LiveReload::own($markup, 's1'));
        $this->assertFalse(LiveReload::own($markup, 's2'));

        $this->backdate('writing', 2);
        $this->backdate('own', 1);
        $this->assertFalse(LiveReload::own($markup, 's1'), 'half a second, not for good');
    }

    public function test_a_failed_write_takes_its_writing_stamp_away(): void
    {
        LiveReload::writing('s1');
        LiveReload::writeFailed('s2');
        $this->assertSame('s1', Cache::get('sve-live-reload:writing')['session'], 'not another session\'s stamp');

        LiveReload::writeFailed('s1');
        $this->assertNull(Cache::get('sve-live-reload:writing'));
        $this->assertNull(Cache::get('sve-live-reload:own'));

        $this->write('views/hero.antlers.html', '<h1>From Cursor</h1>', 10);
        $this->assertFalse(LiveReload::own(LiveReload::page()['markup'], 's1'));
    }

    public function test_a_held_poll_with_nothing_to_say_answers_when_the_hold_is_over(): void
    {
        $this->write('views/hero.antlers.html', '<h1>One</h1>', 60);
        $this->built();
        $page = LiveReload::page();

        $start = microtime(true);
        $status = LiveReload::await($page, 's1', 0.3, 20);
        $elapsed = microtime(true) - $start;

        $this->assertGreaterThanOrEqual(0.3, $elapsed);
        $this->assertLessThan(0.6, $elapsed);
        $this->assertSame($page['markup'], $status['markup']);
        $this->assertSame($page['build'], $status['build']);
        $this->assertSame(['markup', 'build', 'building', 'error', 'own', 'css', 'stale', 'sources'], array_keys($status));
    }

    public function test_a_held_poll_answers_at_once_when_the_page_is_already_behind(): void
    {
        $this->write('views/hero.antlers.html', '<h1>One</h1>', 60);
        $this->built();
        $page = LiveReload::page();

        $start = microtime(true);
        $status = LiveReload::await(['markup' => $page['markup'], 'build' => 'an older build'], 's1', 2.0, 20);

        $this->assertLessThan(0.2, microtime(true) - $start);
        $this->assertSame($page['build'], $status['build']);
    }

    public function test_a_save_from_outside_is_answered_the_tick_it_lands_and_named(): void
    {
        $this->write('views/hero.antlers.html', '<h1>One</h1>', 60);
        $this->built();
        LiveReload::status('s1'); // remembers the files behind the page's signature
        $page = LiveReload::page();
        $stamp = $this->writeLater(0.1, 'views/hero.antlers.html', '<h1>From Cursor</h1>', time() - 30);

        $status = LiveReload::await($page, 's1', 2.0, 20);
        $lag = microtime(true) - $this->writtenAt($stamp);

        $this->assertNotSame($page['markup'], $status['markup']);
        $this->assertFalse($status['own']);
        $this->assertLessThan(0.14, $lag, 'within two ticks: seen, then seen again unchanged');
        $this->assertSame(
            [['path' => 'views/hero.antlers.html', 'content' => '<h1>From Cursor</h1>']],
            array_map(fn ($f) => ['path' => basename(dirname($f['path'])).'/'.basename($f['path']), 'content' => $f['content']], $status['changed'])
        );
    }

    public function test_the_editors_own_save_is_answered_the_same_tick(): void
    {
        $this->write('views/hero.antlers.html', '<h1>One</h1>', 60);
        $this->built();
        $page = LiveReload::page();
        LiveReload::writing('s1');
        $stamp = $this->writeLater(0.1, 'views/hero.antlers.html', '<h1>Typed in the dock</h1>', time() - 30);

        $status = LiveReload::await($page, 's1', 2.0, 20);
        $lag = microtime(true) - $this->writtenAt($stamp);

        $this->assertNotSame($page['markup'], $status['markup']);
        $this->assertTrue($status['own']);
        $this->assertLessThan(0.14, $lag, 'within two ticks');
    }

    /**
     * The save as an editor makes it: the file truncated, then written a
     * moment later (well under a tick). A look between the two sees an empty
     * file; the answer must carry the whole file, never the empty one.
     */
    public function test_a_file_still_being_written_is_answered_once_it_stands_still(): void
    {
        $this->write('views/hero.antlers.html', '<h1>One</h1>', 60);
        $this->built();
        LiveReload::status('s1');
        $page = LiveReload::page();
        $mtime = time() - 30;
        $this->writeLater(0.1, 'views/hero.antlers.html', '', $mtime, sprintf(
            'usleep(8000); file_put_contents(%s, %s); touch(%s, %d);',
            var_export($this->root.'/views/hero.antlers.html', true),
            var_export('<h1>Whole file from Cursor</h1>', true),
            var_export($this->root.'/views/hero.antlers.html', true),
            $mtime
        ));

        $status = LiveReload::await($page, 's1', 2.0, 20);

        $this->assertSame('<h1>Whole file from Cursor</h1>', $status['changed'][0]['content']);
    }

    public function test_changed_is_unknown_for_a_signature_nobody_remembers(): void
    {
        $this->write('views/hero.antlers.html', '<h1>One</h1>', 60);
        $this->built();
        LiveReload::status('s1');

        $this->assertNull(LiveReload::changed('a signature from before the cache was cleared', LiveReload::page()['markup']));
    }

    public function test_changed_names_new_and_removed_files_and_sends_no_big_contents(): void
    {
        $this->write('views/hero.antlers.html', '<h1>One</h1>', 60);
        $this->write('views/gone.antlers.html', '<p>bye</p>', 60);
        $this->built();
        $from = LiveReload::status('s1')['markup'];

        unlink($this->root.'/views/gone.antlers.html');
        $this->write('views/new.antlers.html', '<p>new</p>', 30);
        $this->write('views/big.antlers.html', str_repeat('x', 70000), 30);
        $to = LiveReload::status('s1')['markup'];

        $changed = LiveReload::changed($from, $to);
        $byName = [];

        foreach ($changed as $file) {
            $byName[basename($file['path'])] = $file;
        }

        $this->assertSame(['big.antlers.html', 'gone.antlers.html', 'new.antlers.html'], array_keys($byName) === [] ? [] : (function () use ($byName) { $k = array_keys($byName); sort($k); return $k; })());
        $this->assertSame('<p>new</p>', $byName['new.antlers.html']['content']);
        $this->assertNull($byName['big.antlers.html']['content'], 'too big to send');
        $this->assertTrue($byName['gone.antlers.html']['removed']);
        $this->assertNull($byName['gone.antlers.html']['content']);
        $this->assertStringEndsWith('views/new.antlers.html', $byName['new.antlers.html']['path']);
    }

    public function test_a_changed_section_partial_comes_with_the_docks_panes(): void
    {
        File::ensureDirectoryExists($this->root.'/views/partials/page_sections/hero');
        $this->write('views/partials/page_sections/hero/style_2.antlers.html', "<section>One</section>\n\n{{ sve_tw }}", 60);
        $this->write('views/layout.antlers.html', '<html>a</html>', 60);
        $this->built();
        $from = LiveReload::status('s1')['markup'];

        $this->write('views/partials/page_sections/hero/style_2.antlers.html', "<section>Two</section>\n\n{{ sve_tw }}\n{{ style_push }}<style>.a{color:red}</style>{{ /style_push }}", 30);
        $this->write('views/layout.antlers.html', '<html>b</html>', 30);
        $to = LiveReload::status('s1')['markup'];

        $byName = [];

        foreach (LiveReload::changed($from, $to) as $file) {
            $byName[basename($file['path'])] = $file;
        }

        $parts = $byName['style_2.antlers.html']['parts'];

        $this->assertSame('<section>Two</section>', $parts['html'], 'the HTML pane: without {{ sve_tw }} and the style_push pair');
        $this->assertSame('.a{color:red}', $parts['css']);
        $this->assertSame('', $parts['js']);
        $this->assertTrue($parts['locked'], 'a partial without a lock marker opens locked, as the dock reads it');
        $this->assertArrayNotHasKey('parts', $byName['layout.antlers.html'], 'only a section partial is split');
    }

    public function test_a_held_poll_answers_at_once_for_a_new_build(): void
    {
        $this->write('public/build/manifest.json', '{"a":1}', 100);
        $page = LiveReload::page();
        $stamp = $this->writeLater(0.1, 'public/build/manifest.json', '{"a":2}', time() - 30);

        $status = LiveReload::await($page, 's1', 2.0, 20);
        $lag = microtime(true) - $this->writtenAt($stamp);

        $this->assertNotSame($page['build'], $status['build']);
        $this->assertSame($page['markup'], $status['markup']);
        $this->assertLessThan(0.12, $lag, 'no grace for the build');
    }

    public function test_a_held_poll_answers_at_once_when_a_build_should_start(): void
    {
        $this->write('public/build/manifest.json', '{}', 100);
        $this->write('css/site.css', 'body{}', 50);
        $page = LiveReload::page();

        $start = microtime(true);
        $status = LiveReload::await($page, 's1', 2.0, 20);

        $this->assertLessThan(0.2, microtime(true) - $start, 'the controller starts the build after this answer');
        $this->assertTrue($status['stale']);
        $this->assertFalse($status['building']);
    }

    public function test_a_held_poll_waits_while_the_build_that_should_start_already_runs(): void
    {
        $this->write('public/build/manifest.json', '{}', 100);
        $this->write('css/site.css', 'body{}', 50);
        $page = LiveReload::page();

        $lock = fopen(storage_path('framework/sve-live-reload.lock'), 'c');
        flock($lock, LOCK_EX);

        try {
            $start = microtime(true);
            $status = LiveReload::await($page, 's1', 0.3, 20);
            $elapsed = microtime(true) - $start;
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }

        $this->assertGreaterThanOrEqual(0.3, $elapsed);
        $this->assertTrue($status['building']);
    }
}
