<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Breakpoints;

/**
 * The one list every breakpoint reader shares. Written before the WP7d split
 * so the derived columns (media queries, Tailwind prefixes, inheritance) are
 * pinned to what the site already gets — and, since the direction setting,
 * what a mobile-first site gets from the same rows.
 */
class BreakpointsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['statamic-visual-editor.breakpoints' => null]);
        config(['statamic-visual-editor.breakpoint_direction' => null]);
        Breakpoints::forget();
    }

    protected function tearDown(): void
    {
        Breakpoints::forget();

        parent::tearDown();
    }

    public function test_the_defaults_are_desktop_first_with_derived_queries(): void
    {
        $all = Breakpoints::all();

        $this->assertSame('desktop', Breakpoints::direction());
        $this->assertSame(['laptop', 'tablet', 'mobile'], array_column($all, 'handle'));
        $this->assertSame('laptop', Breakpoints::base());

        [$laptop, $tablet, $mobile] = $all;

        $this->assertTrue($laptop['base']);
        $this->assertSame('', $laptop['media']);
        $this->assertNull($laptop['max']);
        $this->assertSame('', $laptop['tw']);
        $this->assertSame(1024.0, $laptop['min_px']);

        $this->assertFalse($tablet['base']);
        $this->assertSame('(width < 64em)', $tablet['media']);
        $this->assertSame('(max-width: 1023.98px)', $tablet['media_px']);
        $this->assertSame('1023.98px', $tablet['max']);
        $this->assertSame('max-lg', $tablet['tw'], '1024px is on Tailwind\'s own scale');

        $this->assertSame('(width < 48em)', $mobile['media']);
        $this->assertSame('max-md', $mobile['tw']);
    }

    public function test_labels_are_words_not_keys(): void
    {
        foreach (Breakpoints::all() as $row) {
            $this->assertSame(ucfirst($row['label']), $row['label'], $row['handle'].' must not leak a lower-case key');
        }
    }

    public function test_each_breakpoint_inherits_from_the_ones_above_it(): void
    {
        $this->assertSame([
            'laptop' => [],
            'tablet' => ['laptop'],
            'mobile' => ['tablet', 'laptop'],
        ], Breakpoints::inherits());
    }

    public function test_desktop_first_cascade_is_the_list_itself(): void
    {
        $this->assertSame(['laptop', 'tablet', 'mobile'], Breakpoints::cascadeHandles());
        $this->assertSame(Breakpoints::all(), Breakpoints::cascade());
    }

    public function test_devices_are_in_statamics_live_preview_shape(): void
    {
        $this->assertSame([
            'Desktop' => ['width' => 1440, 'height' => 900],
            'Tablet' => ['width' => 810, 'height' => 1080],
            'Mobile' => ['width' => 375, 'height' => 812],
        ], Breakpoints::devices());
    }

    public function test_a_configured_list_is_sorted_widest_first_whatever_the_unit(): void
    {
        config(['statamic-visual-editor.breakpoints' => [
            ['handle' => 'phone', 'min' => 0, 'unit' => 'px'],
            ['handle' => 'wide', 'min' => 90, 'unit' => 'em', 'width' => 1600],
            ['handle' => 'Mid Size!', 'min' => 900, 'unit' => 'px', 'label' => 'Mellem'],
            ['handle' => '', 'min' => 10],
            ['handle' => 'nope', 'min' => 'x'],
        ]]);
        Breakpoints::forget();

        $all = Breakpoints::all();

        $this->assertSame(['wide', 'mid_size', 'phone'], array_column($all, 'handle'));
        $this->assertSame('Mellem', $all[1]['label']);
        $this->assertSame('(width < 90em)', $all[1]['media']);
        $this->assertSame('max-[90em]', $all[1]['tw'], 'off Tailwind\'s scale: arbitrary prefix, in the limit\'s own unit');
        $this->assertSame('(max-width: 899.98px)', $all[2]['media'], 'a px limit is written inclusively');
        $this->assertSame('max-[900px]', $all[2]['tw']);
    }

    public function test_mobile_first_turns_the_same_rows_around(): void
    {
        config(['statamic-visual-editor.breakpoint_direction' => 'mobile']);
        Breakpoints::forget();

        $all = Breakpoints::all();

        $this->assertSame('mobile', Breakpoints::direction());
        // Display order is unchanged: widest first, as every button row draws it.
        $this->assertSame(['laptop', 'tablet', 'mobile'], array_column($all, 'handle'));
        // The cascade is the other way round: the narrowest is the base.
        $this->assertSame('mobile', Breakpoints::base());
        $this->assertSame(['mobile', 'tablet', 'laptop'], Breakpoints::cascadeHandles());

        [$laptop, $tablet, $mobile] = $all;

        $this->assertTrue($mobile['base']);
        $this->assertSame('', $mobile['media']);
        $this->assertSame('', $mobile['tw']);
        $this->assertNull($mobile['max']);

        $this->assertFalse($tablet['base']);
        $this->assertSame('(width >= 48em)', $tablet['media'], 'a wider size is written from its OWN limit up');
        $this->assertSame('(min-width: 768px)', $tablet['media_px']);
        $this->assertSame('md', $tablet['tw'], 'on Tailwind\'s scale: the plain variant, no max-');
        $this->assertNull($tablet['max'], 'no upper bound mobile-first');

        $this->assertFalse($laptop['base']);
        $this->assertSame('(width >= 64em)', $laptop['media']);
        $this->assertSame('lg', $laptop['tw']);

        $this->assertSame([
            'mobile' => [],
            'tablet' => ['mobile'],
            'laptop' => ['tablet', 'mobile'],
        ], Breakpoints::inherits());

        foreach ($all as $row) {
            $this->assertSame('mobile', $row['direction']);
        }
    }

    public function test_mobile_first_off_scale_limit_is_an_arbitrary_min_variant(): void
    {
        config(['statamic-visual-editor.breakpoint_direction' => 'mobile']);
        config(['statamic-visual-editor.breakpoints' => [
            ['handle' => 'phone', 'min' => 0, 'unit' => 'em'],
            ['handle' => 'mid', 'min' => 56.25, 'unit' => 'em'],
            ['handle' => 'big', 'min' => 1200, 'unit' => 'px'],
        ]]);
        Breakpoints::forget();

        $all = Breakpoints::all();

        $this->assertSame(['big', 'mid', 'phone'], array_column($all, 'handle'));
        $this->assertSame('min-[1200px]', $all[0]['tw']);
        $this->assertSame('(min-width: 1200px)', $all[0]['media']);
        $this->assertSame('min-[56.25em]', $all[1]['tw']);
        $this->assertSame('(width >= 56.25em)', $all[1]['media']);
    }

    public function test_an_unknown_direction_is_desktop(): void
    {
        config(['statamic-visual-editor.breakpoint_direction' => 'sideways']);
        Breakpoints::forget();

        $this->assertSame('desktop', Breakpoints::direction());
        $this->assertSame('laptop', Breakpoints::base());
    }

    public function test_no_more_than_five_sizes_are_read(): void
    {
        config(['statamic-visual-editor.breakpoints' => [
            ['handle' => 'a', 'min' => 100, 'unit' => 'em'],
            ['handle' => 'b', 'min' => 90, 'unit' => 'em'],
            ['handle' => 'not_one', 'min' => 'x'],
            ['handle' => 'c', 'min' => 80, 'unit' => 'em'],
            ['handle' => 'd', 'min' => 70, 'unit' => 'em'],
            ['handle' => 'e', 'min' => 60, 'unit' => 'em'],
            ['handle' => 'f', 'min' => 0, 'unit' => 'em'],
        ]]);
        Breakpoints::forget();

        $this->assertSame(5, Breakpoints::MAX);
        $this->assertSame(['a', 'b', 'c', 'd', 'e'], Breakpoints::handles(), 'the first five valid rows as written; an invalid row does not count');
    }

    public function test_for_script_carries_only_what_the_browser_needs(): void
    {
        $row = Breakpoints::forScript()[0];

        $this->assertSame(
            ['handle', 'label', 'device', 'icon', 'base', 'direction', 'min', 'unit', 'min_px', 'max', 'media', 'media_px', 'tw'],
            array_keys($row)
        );
    }
}
