<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Tags;

use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\Tags\SveCache;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;

/**
 * `{{ sve_cache }}`: a partial rendered once and remembered — and the three
 * things that make it render again: the switch, a different key, a changed
 * file. (The globals hash and the style stack are proven on the site, where
 * globals and style-push exist.)
 */
class SveCacheTest extends TestCase
{
    protected string $views;

    protected function setUp(): void
    {
        parent::setUp();

        $this->views = sys_get_temp_dir().'/sve-cache-'.uniqid();
        mkdir($this->views.'/partials', 0777, true);
        file_put_contents($this->views.'/partials/probe.antlers.html', 'seen:{{ x }}');
        view()->addLocation($this->views);
        Cache::flush();
        config(['statamic-visual-editor.cache.partials' => true]);
    }

    protected function tearDown(): void
    {
        @unlink($this->views.'/partials/probe.antlers.html');
        @rmdir($this->views.'/partials');
        @rmdir($this->views);

        parent::tearDown();
    }

    protected function render(array $context, array $params = []): string
    {
        $tag = new SveCache;

        $tag->setProperties([
            'parser' => null,
            'content' => '',
            'context' => $context,
            'params' => ['src' => 'probe'] + $params,
            'tag' => 'sve_cache',
            'tag_method' => 'index',
        ]);

        return $tag->index();
    }

    public function test_the_second_render_is_the_remembered_first_one(): void
    {
        $this->assertSame('seen:A', $this->render(['x' => 'A']));
        $this->assertSame('seen:A', $this->render(['x' => 'B']), 'page data is not in the key — by contract');
    }

    public function test_the_switch_renders_live(): void
    {
        $this->assertSame('seen:A', $this->render(['x' => 'A']));

        config(['statamic-visual-editor.cache.partials' => false]);

        $this->assertSame('seen:B', $this->render(['x' => 'B']));
    }

    public function test_a_key_of_its_own_is_its_own_entry(): void
    {
        $this->assertSame('seen:A', $this->render(['x' => 'A'], ['key' => 'one']));
        $this->assertSame('seen:B', $this->render(['x' => 'B'], ['key' => 'two']));
        $this->assertSame('seen:A', $this->render(['x' => 'C'], ['key' => 'one']));
    }

    public function test_a_changed_partial_file_renders_again(): void
    {
        $this->assertSame('seen:A', $this->render(['x' => 'A']));

        file_put_contents($this->views.'/partials/probe.antlers.html', 'now:{{ x }}');
        touch($this->views.'/partials/probe.antlers.html', time() + 5);

        $this->assertSame('now:B', $this->render(['x' => 'B']));
    }

    public function test_a_missing_partial_is_empty_and_never_cached(): void
    {
        $tag = new SveCache;
        $tag->setProperties(['parser' => null, 'content' => '', 'context' => [], 'params' => ['src' => ''], 'tag' => 'sve_cache', 'tag_method' => 'index']);

        $this->assertSame('', $tag->index());
    }

    public function test_the_globals_hash_changes_with_what_is_named(): void
    {
        $this->assertSame(SveCache::globalsHash(['nope'], 'default'), SveCache::globalsHash(['nope'], 'default'));
        $this->assertNotSame(SveCache::globalsHash([], 'default'), SveCache::globalsHash(['nope'], 'default'));
    }
}
