<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Breakpoints;

/**
 * The one list every breakpoint reader shares. Written before the WP7d split
 * so the derived columns (media queries, Tailwind prefixes, inheritance) are
 * pinned to what the site already gets.
 */
class BreakpointsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['statamic-visual-editor.breakpoints' => null]);
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
        $this->assertSame('max-[1440px]', $all[1]['tw'], 'off Tailwind\'s scale: arbitrary prefix');
        $this->assertSame('(max-width: 899.98px)', $all[2]['media'], 'a px limit is written inclusively');
        $this->assertSame('max-[900px]', $all[2]['tw']);
    }

    public function test_for_script_carries_only_what_the_browser_needs(): void
    {
        $row = Breakpoints::forScript()[0];

        $this->assertSame(
            ['handle', 'label', 'device', 'icon', 'base', 'min', 'unit', 'min_px', 'max', 'media', 'media_px', 'tw'],
            array_keys($row)
        );
    }
}
