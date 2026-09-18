<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\PageSpeed\Report;

/**
 * A Lighthouse answer cut down to what the panel shows, reachable since WP7d
 * moved it out of PageSpeed.
 */
class PageSpeedReportTest extends TestCase
{
    protected function body(): array
    {
        return [
            'id' => 'https://vizuall.dk/',
            'lighthouseResult' => [
                'fetchTime' => '2026-09-18T12:00:00.000Z',
                'categories' => ['performance' => ['score' => 0.874]],
                'audits' => [
                    'largest-contentful-paint' => ['title' => 'LCP', 'displayValue' => '1.2 s', 'score' => 0.95],
                    'total-blocking-time' => ['title' => 'TBT', 'displayValue' => '300 ms', 'score' => 0.6],
                    'cumulative-layout-shift' => ['title' => 'CLS', 'displayValue' => '0.3', 'score' => 0.2],
                    'speed-index' => ['title' => 'SI', 'displayValue' => '2.0 s', 'score' => null],
                    'unused-css-rules' => ['title' => 'Reduce unused CSS', 'displayValue' => '450 ms', 'score' => 0.4,
                        'details' => ['type' => 'opportunity', 'overallSavingsMs' => 450.4, 'overallSavingsBytes' => 12000]],
                    'render-blocking-resources' => ['title' => 'Eliminate render-blocking', 'score' => 0.7,
                        'details' => ['type' => 'opportunity', 'overallSavingsMs' => 900]],
                    'tiny-thing' => ['title' => 'Noise', 'score' => 0.1,
                        'details' => ['type' => 'opportunity', 'overallSavingsMs' => 40]],
                    'not-an-opportunity' => ['title' => 'Table', 'details' => ['type' => 'table']],
                ],
            ],
            'loadingExperience' => [
                'origin_fallback' => true,
                'metrics' => [
                    'LARGEST_CONTENTFUL_PAINT_MS' => ['percentile' => 1800, 'category' => 'FAST'],
                    'INTERACTION_TO_NEXT_PAINT' => ['category' => 'AVERAGE'],
                ],
            ],
        ];
    }

    public function test_the_score_and_labels_are_kept_and_the_rest_dropped(): void
    {
        $out = Report::trim($this->body(), 'mobile');

        $this->assertTrue($out['ok']);
        $this->assertFalse($out['cached']);
        $this->assertSame('mobile', $out['strategy']);
        $this->assertSame('https://vizuall.dk/', $out['url']);
        $this->assertSame(87, $out['score']);
        $this->assertSame('2026-09-18T12:00:00.000Z', $out['fetched_at']);
        $this->assertTrue($out['field_is_origin']);
        $this->assertArrayNotHasKey('lighthouseResult', $out);
    }

    public function test_lab_numbers_come_in_story_order_with_a_level_each(): void
    {
        $lab = Report::trim($this->body(), 'desktop')['lab'];

        $this->assertSame(
            ['largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'],
            array_column($lab, 'key'),
            'first-contentful-paint is absent from the audits and so from the list'
        );
        $this->assertSame(['pass', 'warn', 'fail', 'info'], array_column($lab, 'level'));
        $this->assertSame('1.2 s', $lab[0]['value']);
    }

    public function test_field_metrics_need_a_percentile(): void
    {
        $field = Report::trim($this->body(), 'mobile')['field'];

        $this->assertSame([['key' => 'LARGEST_CONTENTFUL_PAINT_MS', 'percentile' => 1800, 'category' => 'FAST']], $field);
    }

    public function test_opportunities_are_the_worthwhile_ones_biggest_first(): void
    {
        $opps = Report::trim($this->body(), 'mobile')['opportunities'];

        $this->assertSame(['render-blocking-resources', 'unused-css-rules'], array_column($opps, 'key'));
        $this->assertSame(450, $opps[1]['savings']);
        $this->assertSame(12000, $opps[1]['bytes']);
        $this->assertSame('warn', $opps[0]['level']);
    }
}
