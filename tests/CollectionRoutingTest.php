<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\CollectionRouting;
use MarioHamann\StatamicVisualEditor\CollectionTemplateEntry;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;

class CollectionRoutingTest extends TestCase
{
    public function test_a_new_collection_gets_a_route_and_preview_refresh_off(): void
    {
        $collection = Collection::make('cases')->title('Cases');

        CollectionRouting::seed($collection);

        $this->assertSame('/cases/{slug}', $collection->routes()->first());
        $this->assertFalse($collection->basePreviewTargets()->first()['refresh']);
        $this->assertSame('{permalink}', $collection->basePreviewTargets()->first()['format']);
    }

    public function test_an_existing_route_is_left_alone(): void
    {
        $collection = Collection::make('cases')->title('Cases');
        $collection->routes('{parent_uri}/{slug}');

        CollectionRouting::seed($collection);

        $this->assertSame('{parent_uri}/{slug}', $collection->routes()->first());
        $this->assertFalse($collection->basePreviewTargets()->first()['refresh']);
    }

    public function test_editor_stores_are_not_given_a_public_route(): void
    {
        $collection = Collection::make('saved_sections')->title('Sections');

        CollectionRouting::seed($collection);

        $this->assertFalse(CollectionRouting::hasRoute($collection));
        $this->assertTrue($collection->basePreviewTargets()->first()['refresh']);
    }

    public function test_a_template_entry_has_live_preview_without_a_collection_route(): void
    {
        config(['statamic-visual-editor.features.collection_templates' => true]);
        Features::flush();

        $collection = Collection::make('sve_tpl_lp')->title('Templates');
        $collection->entryClass(CollectionTemplateEntry::class);
        $collection->saveQuietly();

        try {
            $entry = Entry::make()
                ->id('template-preview-test')
                ->collection($collection);

            $this->assertInstanceOf(CollectionTemplateEntry::class, $entry);
            $this->assertNotNull($entry->livePreviewUrl());
            $this->assertStringContainsString('preview', $entry->livePreviewUrl());
        } finally {
            $collection->delete();
        }
    }

    public function test_an_ordinary_entry_without_a_route_has_no_live_preview_url(): void
    {
        $collection = Collection::make('sve_bare_lp')->title('Bare');
        $collection->saveQuietly();

        try {
            $entry = Entry::make()
                ->id('bare-preview-test')
                ->collection($collection);

            $this->assertNull($entry->livePreviewUrl());
        } finally {
            $collection->delete();
        }
    }
}
