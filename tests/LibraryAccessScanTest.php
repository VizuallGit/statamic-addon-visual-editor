<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\LibraryAccess\Scan;

/**
 * The walk behind "Scan the site", reachable since WP7d moved it out of
 * LibraryAccess: which rows count as sections, and which do not.
 */
class LibraryAccessScanTest extends TestCase
{
    protected function walk(array $data): array
    {
        $types = [];
        $globals = [];

        Scan::walk($data, 'page_sections', 'global_section', $types, $globals);

        return [Scan::sorted($types), Scan::sorted($globals)];
    }

    public function test_it_collects_types_and_global_ids_from_the_page_builder(): void
    {
        [$types, $globals] = $this->walk([
            'title' => 'Forside',
            'page_sections' => [
                ['type' => 'hero/style_2', 'headline' => 'Hej'],
                ['type' => 'global_section', 'global_section' => ['abc-1', 'abc-2']],
                ['type' => 'content_section/basic', 'blocks' => [
                    ['type' => 'headline', 'text' => 'not a section'],
                ]],
            ],
        ]);

        $this->assertSame(['content_section/basic', 'hero/style_2'], $types);
        $this->assertSame(['abc-1', 'abc-2'], $globals);
    }

    public function test_rows_outside_the_page_builder_field_do_not_count(): void
    {
        [$types, $globals] = $this->walk([
            'related' => [['type' => 'hero/style_1']],
            'meta' => ['type' => 'hero/style_3'],
        ]);

        $this->assertSame([], $types);
        $this->assertSame([], $globals);
    }

    public function test_a_nested_page_builder_inside_a_section_is_still_walked(): void
    {
        [$types] = $this->walk([
            'page_sections' => [
                ['type' => 'tabs/style_1', 'page_sections' => [
                    ['type' => 'hero/style_9'],
                ]],
            ],
        ]);

        $this->assertSame(['hero/style_9', 'tabs/style_1'], $types);
    }

    public function test_sorting_is_natural_and_case_insensitive(): void
    {
        $this->assertSame(
            ['a/style_2', 'a/style_10', 'B/style_1'],
            Scan::sorted(['B/style_1' => true, 'a/style_10' => true, 'a/style_2' => true])
        );
        $this->assertSame(['1', 'x'], Scan::strings([1, 'x', 'x', 1]));
    }
}
