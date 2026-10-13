<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use MarioHamann\StatamicVisualEditor\Commands\GenerateSetPreviews;
use MarioHamann\StatamicVisualEditor\PreviewRefresher;
use MarioHamann\StatamicVisualEditor\SetPreviewGenerator;
use Illuminate\Console\OutputStyle;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Statamic\Facades\User;

/**
 * Where the detached preview run sends its browser.
 *
 * On its own the run builds URLs from APP_URL; a site whose APP_URL is not
 * the address it is served at (Cuben's lacked `.dk`) had every picture fail.
 * Started by a signed-in editor, the run uses the address that editor is on.
 */
class PreviewRefresherTest extends TestCase
{
    protected function tearDown(): void
    {
        User::findByEmail('preview-refresher@example.com')?->delete();
        Cache::forget(GenerateSetPreviews::ERRORS);
        Cache::forget(GenerateSetPreviews::QUEUED);
        Cache::forget(GenerateSetPreviews::RERUN);
        Cache::forget('sve-previews:running');
        Cache::lock('sve-previews')->forceRelease();

        parent::tearDown();
    }

    private function onRequest(string $url): void
    {
        $this->app->instance('request', Request::create($url));
        URL::setRequest($this->app['request']);
    }

    public function test_a_signed_in_editors_address_is_the_one_the_browser_opens(): void
    {
        $user = User::make()->email('preview-refresher@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);
        $this->onRequest('https://cuben.vizdev.dk/!/sve/previews/tick?force=1');

        $this->assertSame('https://cuben.vizdev.dk', PreviewRefresher::siteUrl());
    }

    public function test_a_visitors_host_header_is_never_used(): void
    {
        $this->onRequest('https://attacker.example/some-form');

        $this->assertNull(PreviewRefresher::siteUrl());
    }

    public function test_the_command_line_carries_force_and_the_address(): void
    {
        $line = PreviewRefresher::command('/usr/bin/php', null, true, 'https://cuben.vizdev.dk');

        $this->assertStringContainsString(' sve:previews ', $line);
        $this->assertStringContainsString(' --force ', $line);
        $this->assertStringContainsString(" --url='https://cuben.vizdev.dk' ", $line);
        $this->assertStringNotContainsString('--only', $line);
        $this->assertStringEndsWith('> /dev/null 2>&1 &', $line);

        $plain = PreviewRefresher::command('/usr/bin/php', 'hero/style_1', false, null);

        $this->assertStringContainsString(" --only='hero/style_1' ", $plain);
        $this->assertStringNotContainsString('--force', $plain);
        $this->assertStringNotContainsString('--url', $plain);
    }

    public function test_the_run_builds_its_signed_urls_on_the_address_it_was_given(): void
    {
        Cache::put(GenerateSetPreviews::QUEUED, true, 60);

        // No browser in the test environment: the run stops at that, after
        // the address is settled — and says why, for the panel.
        $this->artisan('sve:previews', ['--url' => 'https://cuben.vizdev.dk'])->assertExitCode(1);

        $url = URL::temporarySignedRoute('sve.section-defaults-preview', now()->addMinutes(5), ['type' => 'media_textbox']);

        $this->assertStringStartsWith('https://cuben.vizdev.dk/!/sve/section-defaults-preview?', $url);
        $this->assertFalse(Cache::has(GenerateSetPreviews::QUEUED));
        $this->assertArrayHasKey('_', Cache::get(GenerateSetPreviews::ERRORS));
    }

    public function test_an_address_that_is_not_a_scheme_and_host_is_refused(): void
    {
        $before = URL::to('/');

        $this->artisan('sve:previews', ['--url' => 'https://cuben.vizdev.dk/evil path'])->assertExitCode(1);

        $this->assertSame($before, URL::to('/'));
    }

    /** The command, its input bound, for calling its protected steps directly. */
    private function command(array $options = []): GenerateSetPreviews
    {
        $command = $this->app->make(GenerateSetPreviews::class);
        $command->setLaravel($this->app);

        $input = new ArrayInput($options, $command->getDefinition());
        $command->setInput($input);
        $command->setOutput(new OutputStyle($input, new BufferedOutput));

        return $command;
    }

    private function invoke(GenerateSetPreviews $command, string $method, array $args)
    {
        return (new \ReflectionMethod($command, $method))->invokeArgs($command, $args);
    }

    public function test_a_forced_note_is_never_downgraded_and_keeps_the_newest_address(): void
    {
        $command = $this->command();

        $this->invoke($command, 'leaveNote', [true, 'https://cuben.vizdev.dk']);
        $this->invoke($command, 'leaveNote', [false, null]);

        $this->assertSame(['force' => true, 'url' => 'https://cuben.vizdev.dk'], Cache::get(GenerateSetPreviews::RERUN));
    }

    public function test_the_run_holding_the_lock_does_the_forced_pass_on_the_address_the_button_gave(): void
    {
        // A run started without an editor's address (over SSH, APP_URL wrong)
        // holds the lock; the button's run left its note and went.
        Cache::put(GenerateSetPreviews::QUEUED, true, 60);
        Cache::put(GenerateSetPreviews::RERUN, ['force' => true, 'url' => 'https://cuben.vizdev.dk'], 60);

        $seen = [];
        $generator = \Mockery::mock(SetPreviewGenerator::class);
        $generator->shouldReceive('generate')->andReturnUsing(function ($only, $force) use (&$seen) {
            $seen[] = [$force, URL::temporarySignedRoute('sve.section-defaults-preview', now()->addMinute(), ['type' => 'x'])];

            return ['media_textbox' => 'ok'];
        });

        $lock = Cache::lock('sve-previews', 60);
        $this->assertTrue($lock->get());

        $status = $this->invoke($this->command(), 'holding', [$generator, $lock, false]);

        $this->assertSame(0, $status);
        $this->assertCount(1, $seen);
        $this->assertTrue($seen[0][0], 'the pass is forced');
        $this->assertStringStartsWith('https://cuben.vizdev.dk/!/sve/section-defaults-preview?', $seen[0][1]);
        $this->assertFalse(Cache::has(GenerateSetPreviews::RERUN));
        $this->assertFalse(Cache::has(GenerateSetPreviews::QUEUED));
        $this->assertFalse(Cache::has('sve-previews:running'));
        $this->assertSame([], Cache::get(GenerateSetPreviews::ERRORS));
        $this->assertTrue(Cache::lock('sve-previews', 1)->get(), 'the lock is released');
    }
}
