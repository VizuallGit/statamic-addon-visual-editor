<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Http\Controllers\EntryActivityController\Changes;

/**
 * The diff behind the Edits popup, reachable since WP7d moved it out of the
 * controller: what changed between two revisions, in the popup's own words.
 */
class EntryActivityChangesTest extends TestCase
{
    protected function revision(array $sections, array $extra = []): array
    {
        return ['slug' => 'forside', 'published' => true, 'data' => ['title' => 'Forside', 'page_sections' => $sections] + $extra];
    }

    public function test_nothing_changed_is_nothing(): void
    {
        $rev = $this->revision([['id' => 'a', 'type' => 'hero/style_1', 'headline' => 'Hej']]);

        $this->assertSame([], Changes::changedFields($rev, $rev));
    }

    public function test_slug_published_and_plain_fields_are_named_by_handle(): void
    {
        $before = $this->revision([], ['intro' => 'a']);
        $after = ['slug' => 'ny-forside', 'published' => false, 'data' => ['title' => 'Ny', 'page_sections' => [], 'intro' => 'a', 'updated_at' => 1]];

        $this->assertSame([
            ['action' => 'updated', 'handle' => 'slug'],
            ['action' => 'updated', 'handle' => 'published'],
            ['action' => 'updated', 'handle' => 'title'],
        ], Changes::changedFields($before, $after));
    }

    public function test_sections_are_added_removed_updated_and_reordered(): void
    {
        $a = ['id' => 'a', 'type' => 'hero/style_1', 'headline' => 'Hej'];
        $b = ['id' => 'b', 'type' => 'content_section/basic', '_sve_label' => 'Om os', 'text' => 'x'];
        $c = ['id' => 'c', 'type' => 'employees/list'];

        $added = Changes::changedFields($this->revision([$a]), $this->revision([$a, $c]));
        $this->assertSame([['action' => 'added', 'section' => 'Employees List']], $added);

        $removed = Changes::changedFields($this->revision([$a, $b]), $this->revision([$a]));
        $this->assertSame([['action' => 'removed', 'section' => 'Om os']], $removed);

        $updated = Changes::changedFields($this->revision([$a]), $this->revision([['headline' => 'Hej igen', 'enabled' => false] + $a]));
        $this->assertSame([['action' => 'updated', 'section' => 'Hero Style 1', 'parts' => ['headline']]], $updated, '`enabled` is not a part');

        $reordered = Changes::changedFields($this->revision([$a, $b]), $this->revision([$b, $a]));
        $this->assertSame([['action' => 'reordered', 'handle' => 'page_sections']], $reordered);
    }

    public function test_a_changed_block_inside_a_section_is_named_by_its_type(): void
    {
        $before = $this->revision([['id' => 'a', 'type' => 'hero/style_1', 'blocks' => [['id' => 'x', 'type' => 'headline', 'text' => 'A']]]]);
        $after = $this->revision([['id' => 'a', 'type' => 'hero/style_1', 'blocks' => [['id' => 'x', 'type' => 'headline', 'text' => 'B'], ['id' => 'y', 'type' => 'links']]]]);

        $this->assertSame(
            [['action' => 'updated', 'section' => 'Hero Style 1', 'parts' => ['links', 'text']]],
            Changes::changedFields($before, $after)
        );
    }

    public function test_visual_ids_are_noise(): void
    {
        $before = $this->revision([['id' => 'a', 'type' => 'hero/style_1', '_visual_id' => 'v1', 'blocks' => [['id' => 'x', 'type' => 'headline', '_visual_id' => 'b1']]]]);
        $after = $this->revision([['id' => 'a', 'type' => 'hero/style_1', '_visual_id' => 'v2', 'blocks' => [['id' => 'x', 'type' => 'headline', '_visual_id' => 'b2']]]]);

        $this->assertSame([], Changes::changedFields($before, $after));
    }
}
