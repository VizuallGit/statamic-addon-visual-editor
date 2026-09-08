<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\TemplateHistory;

class TemplateHistoryTest extends TestCase
{
    protected string $file;

    protected function setUp(): void
    {
        parent::setUp();

        $dir = sys_get_temp_dir().'/sve-history-'.uniqid('', true);
        mkdir($dir, 0777, true);
        $this->file = $dir.'/style_2.antlers.html';
        file_put_contents($this->file, "<section>one</section>\n");

        $store = TemplateHistory::dir($this->file);

        if (is_dir($store)) {
            array_map('unlink', glob($store.'/*.html') ?: []);
        }
    }

    protected function tearDown(): void
    {
        $store = TemplateHistory::dir($this->file);

        array_map('unlink', glob($store.'/*.html') ?: []);
        @rmdir($store);
        @unlink($this->file);
        @rmdir(dirname($this->file));

        parent::tearDown();
    }

    public function test_it_keeps_the_file_as_it_was_before_the_write()
    {
        TemplateHistory::record($this->file);
        file_put_contents($this->file, "<section>two</section>\n");

        $entries = TemplateHistory::entries($this->file);

        $this->assertCount(1, $entries);
        $this->assertSame(
            "<section>one</section>\n",
            TemplateHistory::read($this->file, $entries[0]['id'])
        );
    }

    public function test_it_coalesces_a_burst_of_keystrokes_into_one_version()
    {
        TemplateHistory::record($this->file);

        foreach (['two', 'three', 'four'] as $text) {
            file_put_contents($this->file, "<section>{$text}</section>\n");
            TemplateHistory::record($this->file);
        }

        $this->assertCount(1, TemplateHistory::entries($this->file));
    }

    public function test_it_skips_an_unchanged_file()
    {
        $store = TemplateHistory::dir($this->file);

        mkdir($store, 0777, true);
        file_put_contents($store.'/1000.html', "<section>one</section>\n");

        TemplateHistory::record($this->file);

        $this->assertCount(1, TemplateHistory::entries($this->file));
    }

    public function test_it_prunes_to_the_newest_versions()
    {
        $store = TemplateHistory::dir($this->file);

        mkdir($store, 0777, true);

        for ($i = 1; $i <= TemplateHistory::KEEP + 5; $i++) {
            file_put_contents($store.'/'.($i * 1000).'.html', "<section>{$i}</section>\n");
        }

        // One real write prunes the tail.
        file_put_contents($this->file, "<section>new</section>\n");
        TemplateHistory::record($this->file);

        $entries = TemplateHistory::entries($this->file);

        $this->assertCount(TemplateHistory::KEEP, $entries);
        $this->assertSame(
            "<section>new</section>\n",
            TemplateHistory::read($this->file, $entries[0]['id'])
        );
    }

    public function test_it_refuses_an_id_that_is_not_a_stamp()
    {
        $this->assertNull(TemplateHistory::read($this->file, '../../../.env'));
        $this->assertNull(TemplateHistory::read($this->file, 'nope'));
    }
}
