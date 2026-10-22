<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SiteCanvasArrangement;

class SiteCanvasArrangementTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $dir = storage_path('statamic-visual-editor/site-canvas');

        if (is_dir($dir)) {
            foreach (glob($dir.'/*.yaml') ?: [] as $file) {
                @unlink($file);
            }
        }
    }

    public function test_untouched_the_pages_are_one_column_each_in_the_collections_order(): void
    {
        $this->assertSame([['home'], ['about'], ['contact']], (new SiteCanvasArrangement)->columns('default', ['home', 'about', 'contact']));
    }

    public function test_saved_columns_are_read_back_and_laid_over_the_pages_that_exist(): void
    {
        $store = new SiteCanvasArrangement;

        $saved = $store->save('default', [['cases', 'about'], ['home']], ['home', 'about', 'contact', 'cases']);

        // Contact, not named, is appended as a column of its own.
        $this->assertSame([['cases', 'about'], ['home'], ['contact']], $saved);
        $this->assertSame($saved, $store->columns('default', ['home', 'about', 'contact', 'cases']));
        $this->assertFileExists(storage_path('statamic-visual-editor/site-canvas/default.yaml'));
    }

    public function test_a_page_gone_from_the_collection_is_dropped_and_a_new_one_appended(): void
    {
        $store = new SiteCanvasArrangement;
        $store->save('default', [['cases', 'about'], ['home']], ['home', 'about', 'cases']);

        // About was deleted; FAQ is new.
        $this->assertSame([['cases'], ['home'], ['faq']], $store->columns('default', ['home', 'faq', 'cases']));
    }

    public function test_merge_keeps_a_repeated_id_once_drops_empty_columns_and_ignores_nonsense(): void
    {
        $this->assertSame(
            [['a', 'b'], ['c']],
            SiteCanvasArrangement::merge([['a', 'b', 'a'], [], ['b', 'c'], 'junk', [null, 7]], ['a', 'b', 'c'])
        );
        $this->assertSame([], SiteCanvasArrangement::merge([['a']], []));
        $this->assertSame([['x']], SiteCanvasArrangement::merge([], ['x']));
    }

    public function test_one_file_per_site_with_a_safe_name(): void
    {
        $store = new SiteCanvasArrangement;

        $this->assertSame([['b'], ['a']], $store->save('en', [['b'], ['a']], ['a', 'b']));
        $this->assertSame([['a'], ['b']], $store->columns('da', ['a', 'b']), 'another site has its own file — none yet');
        $this->assertStringEndsWith('/site-canvas/a-b.yaml', $store->path('a/b'));
    }
}
