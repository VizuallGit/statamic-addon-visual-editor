<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Support\Collection as LaravelCollection;
use MarioHamann\StatamicVisualEditor\PageBuilderBlueprint;
use Mockery;
use Statamic\Entries\Collection;
use Statamic\Facades\Blueprint;

class PageBuilderBlueprintTest extends TestCase
{
    private function blueprint(string $handle, bool $withSections)
    {
        $fields = $withSections
            ? [['handle' => 'page_sections', 'field' => ['type' => 'replicator', 'sets' => []]]]
            : [['handle' => 'intro', 'field' => ['type' => 'text']]];

        return Blueprint::make($handle)->setContents(['tabs' => ['main' => ['sections' => [['fields' => $fields]]]]]);
    }

    public function test_the_blueprint_holding_the_page_builder_wins_over_the_default(): void
    {
        $landing = $this->blueprint('cases_landingpage', false);
        $page = $this->blueprint('page', true);
        $collection = Mockery::mock(Collection::class);
        $collection->shouldReceive('entryBlueprint')->andReturn($landing);
        $collection->shouldReceive('entryBlueprints')->andReturn(LaravelCollection::make([$landing, $page]));

        $this->assertSame($page, PageBuilderBlueprint::for($collection));
    }

    public function test_a_default_with_the_field_is_taken_without_looking_further(): void
    {
        $page = $this->blueprint('page', true);
        $collection = Mockery::mock(Collection::class);
        $collection->shouldReceive('entryBlueprint')->andReturn($page);
        $collection->shouldNotReceive('entryBlueprints');

        $this->assertSame($page, PageBuilderBlueprint::for($collection));
    }

    public function test_no_blueprint_with_the_field_falls_back_to_the_default(): void
    {
        $landing = $this->blueprint('cases_landingpage', false);
        $collection = Mockery::mock(Collection::class);
        $collection->shouldReceive('entryBlueprint')->andReturn($landing);
        $collection->shouldReceive('entryBlueprints')->andReturn(LaravelCollection::make([$landing]));

        $this->assertSame($landing, PageBuilderBlueprint::for($collection));
        $this->assertNull(PageBuilderBlueprint::for(null));
    }
}
