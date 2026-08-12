<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SectionDefaults;
use Statamic\Facades\Fieldset;
use Statamic\Fields\Fieldset as FieldsetModel;

class SectionDefaultsTest extends TestCase
{
    protected function fieldset(): FieldsetModel
    {
        return (new FieldsetModel)->setHandle('page_sections')->setContents([
            'fields' => [
                [
                    'handle' => 'page_sections',
                    'field' => [
                        'type' => 'replicator',
                        'sets' => [
                            'main' => [
                                'sets' => [
                                    'hero/style_1' => [
                                        'display' => 'Hero',
                                        'fields' => [
                                            ['handle' => 'title', 'field' => ['type' => 'text', 'default' => 'Overskrift']],
                                            ['handle' => 'nothing', 'field' => ['type' => 'text']],
                                            [
                                                'handle' => 'benefits',
                                                'field' => [
                                                    'type' => 'grid',
                                                    'default' => [[], []],
                                                    'fields' => [
                                                        ['handle' => 'label', 'field' => ['type' => 'text', 'default' => 'Fordel']],
                                                        ['handle' => 'note', 'field' => ['type' => 'text']],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                    'blank' => [
                                        'display' => 'Blank',
                                        'fields' => [
                                            ['handle' => 'text', 'field' => ['type' => 'text']],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }

    protected function setUp(): void
    {
        parent::setUp();

        Fieldset::shouldReceive('find')->with('page_sections')->andReturn($this->fieldset());
    }

    public function test_it_resolves_a_sets_default_values()
    {
        $section = SectionDefaults::for('hero/style_1');

        $this->assertSame('hero/style_1', $section['type']);
        $this->assertTrue($section['enabled']);
        $this->assertSame('Overskrift', $section['title']);
    }

    public function test_a_field_without_a_default_is_left_out_entirely()
    {
        // Rather than written as null: the section partial should fall through to
        // whatever it does for a missing value, as it would on a real new section.
        $this->assertArrayNotHasKey('nothing', SectionDefaults::for('hero/style_1'));
    }

    public function test_grid_rows_are_filled_from_their_own_fields_defaults()
    {
        // The point of the recursion. `default: [{}, {}]` gives two rows; Statamic
        // only fills their fields in when the Control Panel creates a row, so
        // without this the preview would render two empty rows.
        $rows = SectionDefaults::for('hero/style_1')['benefits'];

        $this->assertCount(2, $rows);
        $this->assertSame('Fordel', $rows[0]['label']);
        $this->assertSame('Fordel', $rows[1]['label']);
        $this->assertArrayNotHasKey('note', $rows[0]);
    }

    public function test_rows_get_stable_ids()
    {
        // Ids have to be derived, not random: the section data is part of the
        // preview's fingerprint, so random ids would make every preview
        // permanently stale and re-screenshot the site on every run.
        $first = SectionDefaults::for('hero/style_1');
        $second = SectionDefaults::for('hero/style_1');

        $this->assertNotEmpty($first['id']);
        $this->assertNotEmpty($first['benefits'][0]['id']);
        $this->assertSame($first, $second);
        $this->assertNotSame($first['benefits'][0]['id'], $first['benefits'][1]['id']);
    }

    public function test_it_knows_when_a_set_has_nothing_to_show()
    {
        // A set that would photograph as a blank strip. The generator falls back to
        // a real instance for these, and only for these.
        $this->assertTrue(SectionDefaults::hasContent(SectionDefaults::for('hero/style_1')));
        $this->assertFalse(SectionDefaults::hasContent(SectionDefaults::for('blank')));
        $this->assertFalse(SectionDefaults::hasContent(null));
    }

    public function test_an_unknown_handle_has_no_defaults()
    {
        $this->assertNull(SectionDefaults::for('nope/style_9'));
    }
}
