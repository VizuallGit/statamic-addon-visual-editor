<?php

namespace MarioHamann\StatamicVisualEditor\PageSpeed;

/**
 * A megabyte of Lighthouse, kept to the part the panel reads: the score,
 * five lab numbers, the field metrics and up to eight opportunities.
 * Moved verbatim out of PageSpeed in WP7d.
 */
final class Report
{
    /** The five lab numbers worth showing, in the order they tell the story. */
    protected const LAB_AUDITS = [
        'largest-contentful-paint',
        'total-blocking-time',
        'cumulative-layout-shift',
        'first-contentful-paint',
        'speed-index',
    ];

    /** The field metrics, named as Chrome's own report names them. */
    protected const FIELD_METRICS = [
        'LARGEST_CONTENTFUL_PAINT_MS',
        'INTERACTION_TO_NEXT_PAINT',
        'CUMULATIVE_LAYOUT_SHIFT_SCORE',
        'FIRST_CONTENTFUL_PAINT_MS',
    ];

    /** Anything smaller than this is noise dressed up as advice. */
    protected const MIN_SAVING_MS = 100;

    /**
     * A megabyte of Lighthouse, kept to the part that is read.
     *
     * @param  array<string, mixed>  $body
     */
    public static function trim(array $body, string $strategy): array
    {
        $house = $body['lighthouseResult'] ?? [];
        $audits = $house['audits'] ?? [];
        $score = $house['categories']['performance']['score'] ?? null;

        return [
            'ok' => true,
            'cached' => false,
            'strategy' => $strategy,
            'url' => (string) ($body['id'] ?? ''),
            'score' => is_numeric($score) ? (int) round($score * 100) : null,
            'fetched_at' => (string) ($house['fetchTime'] ?? ''),
            'lab' => static::lab($audits),
            'field' => static::field($body['loadingExperience'] ?? []),
            'field_is_origin' => (bool) ($body['loadingExperience']['origin_fallback'] ?? false),
            'opportunities' => static::opportunities($audits),
        ];
    }

    /** @param  array<string, mixed>  $audits */
    protected static function lab(array $audits): array
    {
        $out = [];

        foreach (static::LAB_AUDITS as $id) {
            $audit = $audits[$id] ?? null;

            if (! is_array($audit)) {
                continue;
            }

            $out[] = [
                'key' => $id,
                'label' => (string) ($audit['title'] ?? $id),
                'value' => (string) ($audit['displayValue'] ?? ''),
                'level' => static::levelFor($audit['score'] ?? null),
            ];
        }

        return $out;
    }

    /**
     * What real Chrome users met on this page over the last 28 days.
     *
     * Absent for a page too quiet to have data of its own — which is not a
     * failure, just a page nobody has visited enough. Google then answers for
     * the whole site instead, and `field_is_origin` says so, because "your
     * site" and "this page" are different claims.
     *
     * @param  array<string, mixed>  $experience
     */
    protected static function field(array $experience): array
    {
        $metrics = $experience['metrics'] ?? [];
        $out = [];

        foreach (static::FIELD_METRICS as $key) {
            $metric = $metrics[$key] ?? null;

            if (! is_array($metric) || ! isset($metric['percentile'])) {
                continue;
            }

            $out[] = [
                'key' => $key,
                'percentile' => (int) $metric['percentile'],
                'category' => (string) ($metric['category'] ?? ''),
            ];
        }

        return $out;
    }

    /**
     * What Lighthouse says is worth doing, with the seconds it puts on each.
     *
     * @param  array<string, mixed>  $audits
     */
    protected static function opportunities(array $audits): array
    {
        $out = [];

        foreach ($audits as $id => $audit) {
            if (! is_array($audit) || ($audit['details']['type'] ?? '') !== 'opportunity') {
                continue;
            }

            $savings = (float) ($audit['details']['overallSavingsMs'] ?? 0);

            if ($savings < static::MIN_SAVING_MS) {
                continue;
            }

            $out[] = [
                'key' => (string) $id,
                'label' => (string) ($audit['title'] ?? $id),
                'value' => (string) ($audit['displayValue'] ?? ''),
                'savings' => (int) round($savings),
                'bytes' => (int) ($audit['details']['overallSavingsBytes'] ?? 0),
                'level' => static::levelFor($audit['score'] ?? null),
            ];
        }

        usort($out, fn ($a, $b) => $b['savings'] <=> $a['savings']);

        return array_slice($out, 0, 8);
    }

    /** Lighthouse's own thresholds, in the panel's three colours. */
    protected static function levelFor(mixed $score): string
    {
        if (! is_numeric($score)) {
            return 'info';
        }

        if ($score >= 0.9) {
            return 'pass';
        }

        return $score >= 0.5 ? 'warn' : 'fail';
    }
}
