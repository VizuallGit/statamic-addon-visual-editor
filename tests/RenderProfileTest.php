<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\RenderProfile;
use MarioHamann\StatamicVisualEditor\RenderProfile\Ledger;

/**
 * The bookkeeping behind the performance panel's "Server" tab: inclusive and
 * exclusive time per template, and the summary the panel shows.
 */
class RenderProfileTest extends TestCase
{
    public function test_a_nested_partial_is_booked_inclusive_on_the_parent_and_exclusive_on_itself(): void
    {
        $ledger = new Ledger;

        $ledger->open();          // page
        $ledger->open();          //   partial A
        $ledger->close('a', 30);
        $ledger->open();          //   partial B
        $ledger->open();          //     partial C inside B
        $ledger->close('c', 5);
        $ledger->close('b', 20);
        $ledger->close('page', 100);

        $rows = $ledger->rows();

        $this->assertSame(['n' => 1, 'incl' => 100.0, 'excl' => 50.0], $rows['page'], 'page minus A and B');
        $this->assertSame(['n' => 1, 'incl' => 30.0, 'excl' => 30.0], $rows['a']);
        $this->assertSame(['n' => 1, 'incl' => 20.0, 'excl' => 15.0], $rows['b'], 'B minus C');
        $this->assertSame(['n' => 1, 'incl' => 5.0, 'excl' => 5.0], $rows['c']);
    }

    public function test_the_same_template_rendered_twice_is_one_row(): void
    {
        $ledger = new Ledger;

        foreach ([12, 8] as $ms) {
            $ledger->open();
            $ledger->close('x', $ms);
        }

        $this->assertSame(['n' => 2, 'incl' => 20.0, 'excl' => 20.0], $ledger->rows()['x']);
    }

    public function test_the_summary_splits_sections_from_the_rest_and_sorts_by_own_time(): void
    {
        $views = rtrim(resource_path('views'), '/').'/';
        $rows = [
            $views.'default.antlers.html' => ['n' => 1, 'incl' => 1000.0, 'excl' => 100.0],
            $views.'partials/page_sections/hero/style_2.antlers.html' => ['n' => 2, 'incl' => 300.0, 'excl' => 60.0],
            $views.'partials/page_sections/global_section.antlers.html' => ['n' => 1, 'incl' => 50.0, 'excl' => 5.0],
            $views.'partials/responsive/flex_direction.antlers.html' => ['n' => 12, 'incl' => 120.0, 'excl' => 120.0],
            $views.'partials/tiny.antlers.html' => ['n' => 1, 'incl' => 2.0, 'excl' => 2.0],
        ];

        $out = RenderProfile::summarize('https://site.test/x', 1000.0, $rows);

        $this->assertTrue($out['ok']);
        $this->assertSame(1000, $out['total_ms']);
        $this->assertSame(300, $out['sections_ms'], 'only group/style partials are sections; the global wrapper is not');
        $this->assertSame(700, $out['layout_ms']);
        $this->assertSame(17, $out['renders']);
        $this->assertSame(
            ['partials/responsive/flex_direction', 'default', 'partials/page_sections/hero/style_2'],
            array_column($out['templates'], 'path'),
            'sorted by own time, without the extension, and without rows under one percent (the wrapper at 0.5 % and the tiny partial are noise)'
        );
        $this->assertSame(12, $out['templates'][0]['share']);
        $this->assertSame(['path' => 'partials/page_sections/hero/style_2', 'n' => 2, 'excl' => 60, 'incl' => 300, 'share' => 6], $out['templates'][2]);
    }

    public function test_a_guest_cannot_ask_for_a_profile(): void
    {
        $this->getJson('/!/sve/render-profile?url=https://example.com/')->assertStatus(403);
    }
}
