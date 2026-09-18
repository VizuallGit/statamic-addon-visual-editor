<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SetPreview\FieldsetImage;
use MarioHamann\StatamicVisualEditor\SetPreview\Targets;

/**
 * The pure parts of set-preview generation, reachable since WP7d moved them out
 * of SetPreviewGenerator: the fieldset `image:` rewrite and the filename base.
 * The browser path is covered by the shipped Live Preview tests.
 */
class SetPreviewFieldsetImageTest extends TestCase
{
    public function test_it_sets_the_image_on_a_nested_set(): void
    {
        $fieldset = [
            'fields' => [[
                'handle' => 'page_sections',
                'field' => [
                    'type' => 'replicator',
                    'sets' => [
                        'hero' => [
                            'display' => 'Hero',
                            'sets' => [
                                'hero/style_1' => ['display' => 'Style 1', 'image' => 'old.png', 'fields' => []],
                                'hero/style_2' => ['display' => 'Style 2', 'fields' => []],
                            ],
                        ],
                    ],
                ],
            ]],
        ];

        $this->assertTrue(FieldsetImage::replaceImage($fieldset, 'hero/style_1', 'hero-style-1-0123abcd.png'));

        $sets = $fieldset['fields'][0]['field']['sets']['hero']['sets'];
        $this->assertSame('hero-style-1-0123abcd.png', $sets['hero/style_1']['image']);
        $this->assertArrayNotHasKey('image', $sets['hero/style_2'], 'only the named set changes');
    }

    public function test_a_set_is_recognised_by_its_fields_or_display_key(): void
    {
        $withFields = ['sets' => ['a' => ['fields' => []]]];
        $withDisplay = ['sets' => ['a' => ['display' => 'A']]];
        $neither = ['sets' => ['a' => ['image' => 'x.png']]];

        $this->assertTrue(FieldsetImage::replaceImage($withFields, 'a', 'new.png'));
        $this->assertTrue(FieldsetImage::replaceImage($withDisplay, 'a', 'new.png'));
        $this->assertFalse(FieldsetImage::replaceImage($neither, 'a', 'new.png'), 'a bare key is not a set');
        $this->assertSame('x.png', $neither['sets']['a']['image']);
    }

    public function test_an_unknown_set_leaves_the_fieldset_alone(): void
    {
        $fieldset = ['sets' => ['a' => ['fields' => [], 'image' => 'a.png']]];
        $before = $fieldset;

        $this->assertFalse(FieldsetImage::replaceImage($fieldset, 'b', 'new.png'));
        $this->assertSame($before, $fieldset);
    }

    public function test_the_filename_base_is_the_handle_with_dashes(): void
    {
        $this->assertSame('hero-style-1', Targets::handleBase('hero/style_1'));
        $this->assertSame('custom-section', Targets::handleBase('custom_section'));
    }

    public function test_memo_keys_are_stable_and_distinct(): void
    {
        $this->assertSame(Targets::emptyKey('hero/style_1'), Targets::emptyKey('hero/style_1'));
        $this->assertNotSame(Targets::emptyKey('hero/style_1'), Targets::failedKey('hero/style_1'));
        $this->assertNotSame(Targets::emptyKey('hero/style_1'), Targets::emptyKey('hero/style_2'));
    }
}
