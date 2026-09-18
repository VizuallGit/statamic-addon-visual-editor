<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\RenderProfile\Ledger;
use MarioHamann\StatamicVisualEditor\RenderProfile\TimedEngine;
use Statamic\Facades\Data;
use Statamic\Facades\Site;

/**
 * Where a page's server render time goes.
 *
 * The performance panel's other readings are taken in the browser and say what
 * the page weighs. This one is taken here, in PHP, and says how long the page
 * took to build before a single byte left the server — and which templates
 * took it. The page is rendered once to warm every cache a visitor would also
 * hit warm, and once more with a stopwatch on every Antlers template.
 *
 * Measured, not guessed: on this site's test page the sections' own markup was
 * a fifth of the time; the small CSS partials each section calls a dozen
 * times were half of it. That is the kind of answer this exists to give.
 */
final class RenderProfile
{
    /** Rows below this share of the total are noise in a list meant to be acted on. */
    public const MIN_SHARE = 0.01;

    /** Enough rows to see the pattern, few enough to read. */
    public const MAX_ROWS = 15;

    /**
     * @return array{ok: bool, reason?: string, url?: string, total_ms?: int, layout_ms?: int, sections_ms?: int, renders?: int, templates?: list<array{path: string, n: int, excl: int, incl: int, share: int}>}
     */
    public static function run(string $url): array
    {
        $entry = static::entryFor($url);

        if (! $entry) {
            return ['ok' => false, 'reason' => 'not_found'];
        }

        $request = Request::create($url, 'GET');
        $ledger = new Ledger;
        $resolver = app('view.engine.resolver');
        $engine = $resolver->resolve('antlers');

        $resolver->register('antlers', fn () => new TimedEngine($engine, $ledger));

        try {
            $entry->toResponse($request); // warm: the Stache, Glide, the parsed templates
            $ledger->reset();

            $started = hrtime(true);
            $entry->toResponse($request);
            $total = (hrtime(true) - $started) / 1e6;
        } finally {
            $resolver->register('antlers', fn () => $engine);
        }

        return static::summarize($url, $total, $ledger->rows());
    }

    /**
     * The ledger turned into the panel's answer.
     *
     * A section is a template under `partials/page_sections/{group}/{style}`;
     * their inclusive times add up to "the sections", and everything else —
     * layout, header, footer, the theme's own CSS — is the rest.
     *
     * @param  array<string, array{n: int, incl: float, excl: float}>  $rows
     */
    public static function summarize(string $url, float $totalMs, array $rows): array
    {
        $views = rtrim(resource_path('views'), '/').'/';
        $sections = 0.0;
        $out = [];

        foreach ($rows as $path => $row) {
            $rel = str_starts_with($path, $views) ? substr($path, strlen($views)) : $path;
            $rel = preg_replace('/\.antlers\.(html|php)$/', '', $rel) ?? $rel;

            if (preg_match('#^partials/page_sections/[^/]+/[^/]+$#', $rel)) {
                $sections += $row['incl'];
            }

            $out[] = [
                'path' => $rel,
                'n' => $row['n'],
                'excl' => (int) round($row['excl']),
                'incl' => (int) round($row['incl']),
                'share' => $totalMs > 0 ? (int) round($row['excl'] / $totalMs * 100) : 0,
            ];
        }

        usort($out, fn ($a, $b) => $b['excl'] <=> $a['excl']);

        $out = array_values(array_filter(
            $out,
            fn ($row) => $totalMs <= 0 || $row['excl'] / $totalMs >= static::MIN_SHARE
        ));

        return [
            'ok' => true,
            'url' => $url,
            'total_ms' => (int) round($totalMs),
            'sections_ms' => (int) round(min($sections, $totalMs)),
            'layout_ms' => (int) round(max(0, $totalMs - min($sections, $totalMs))),
            'renders' => array_sum(array_column($rows, 'n')),
            'templates' => array_slice($out, 0, static::MAX_ROWS),
        ];
    }

    /** The entry behind a URL on this site, unwrapped from its structure page. */
    protected static function entryFor(string $url)
    {
        $path = (string) parse_url($url, PHP_URL_PATH);
        $uri = $path === '' || $path === '/' ? '/' : '/'.trim($path, '/');

        $data = Data::findByUri($uri, Site::current()->handle());

        if (! $data) {
            return null;
        }

        if (method_exists($data, 'entry') && ($entry = $data->entry())) {
            return $entry;
        }

        return method_exists($data, 'toResponse') ? $data : null;
    }
}
