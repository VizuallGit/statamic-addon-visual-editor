<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Statamic\Facades\User;

/**
 * Google's opinion of a page, and what its real visitors have lived through.
 *
 * The performance panel's own reading is taken here, on this machine, with no
 * throttling — it answers "what does this page weigh and where is the weight",
 * which is the question you can act on while building. It cannot answer the
 * other one: what the page feels like on a mid-range phone on a slow network,
 * and what people out there actually experienced. Only a run on Google's own
 * hardware and Chrome's own field data can say that, so that is what this is.
 *
 * Two things it deliberately does not do:
 *
 * The key never reaches the browser. The Control Panel asks this site, this
 * site asks Google — so the key sits in the settings screen or the .env and
 * nowhere a visitor could read it.
 *
 * The answer is cut down before it is sent on. A PageSpeed response is a
 * megabyte of Lighthouse artefacts; the panel shows a score, six numbers and a
 * handful of recommendations. Trimming here rather than in the browser keeps
 * the Control Panel out of the business of parsing a report it mostly throws
 * away.
 */
class PageSpeed
{
    protected const ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

    /** Lighthouse is slow by design — it loads the page several times. */
    protected const TIMEOUT = 120;

    /** Long enough that switching tabs is free, short enough to be today's page. */
    protected const CACHE_SECONDS = 600;

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

    /** The settings screen wins; .env answers when it is left empty. */
    public static function apiKey(): string
    {
        $saved = trim((string) Features::setting('psi_api_key', ''));

        if ($saved !== '') {
            return $saved;
        }

        return trim((string) config('statamic-visual-editor.psi.api_key', ''));
    }

    /** The tab exists only where the panel does. */
    public static function enabled(): bool
    {
        return Features::enabled('performance') && Features::enabled('psi');
    }

    /**
     * Can Google reach this address at all?
     *
     * A local domain is not a smaller version of a live site — it is a name
     * that resolves to nothing outside this machine, and asking Google to test
     * it returns an error that reads like a fault in the page. Better to say so
     * before the request than to pass on a wrong-sounding answer after it.
     */
    public static function isPublicHost(string $url): bool
    {
        $host = strtolower((string) parse_url($url, PHP_URL_HOST));

        if ($host === '' || ! str_contains($host, '.')) {
            return false;
        }

        foreach (['.test', '.local', '.localhost', '.internal', '.invalid', '.example'] as $suffix) {
            if (str_ends_with($host, $suffix)) {
                return false;
            }
        }

        if (in_array($host, ['localhost', '127.0.0.1', '::1'], true)) {
            return false;
        }

        // A literal private address. A name that happens to resolve to one is
        // Google's problem to report, not ours to guess at.
        return ! (filter_var($host, FILTER_VALIDATE_IP)
            && ! filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE));
    }

    /** This site's own pages, and no others — never a proxy for scanning the web. */
    public static function isOwnUrl(string $url): bool
    {
        $host = strtolower((string) parse_url($url, PHP_URL_HOST));
        $mine = strtolower((string) parse_url((string) config('app.url'), PHP_URL_HOST));

        return $host !== '' && ($host === $mine || $host === request()->getHost());
    }

    /**
     * Run the test, or hand back the last one if it is minutes old.
     *
     * @return array{ok: bool, message?: string, ...}
     */
    public static function run(string $url, string $strategy, bool $fresh = false): array
    {
        $strategy = $strategy === 'desktop' ? 'desktop' : 'mobile';
        $key = 'sve.psi.'.sha1($strategy.'|'.$url);

        if ($fresh) {
            Cache::forget($key);
        }

        $cached = Cache::get($key);

        if (is_array($cached)) {
            return $cached + ['cached' => true];
        }

        $out = static::ask($url, $strategy);

        if ($out['ok']) {
            Cache::put($key, $out, static::CACHE_SECONDS);
        }

        return $out;
    }

    /** @return array{ok: bool, message?: string, ...} */
    protected static function ask(string $url, string $strategy): array
    {
        $query = [
            'url' => $url,
            'strategy' => $strategy,
            'category' => 'performance',
            'locale' => static::locale(),
        ];

        if ($key = static::apiKey()) {
            $query['key'] = $key;
        }

        try {
            $response = Http::timeout(static::TIMEOUT)->get(static::ENDPOINT, $query);
        } catch (\Throwable $e) {
            return ['ok' => false, 'message' => $e->getMessage()];
        }

        if (! $response->successful()) {
            $message = (string) ($response->json('error.message') ?? $response->status());

            return [
                'ok' => false,
                'status' => $response->status(),
                // Google's own words. They say the useful thing — a quota that is
                // spent, a page that would not load — and inventing a friendlier
                // sentence here would only hide which of the two it was.
                'message' => $message,
                // The shared quota for keyless requests is small and usually
                // already spent by somebody else, so this failure is the normal
                // one rather than the rare one. Worth answering with the fix.
                'needs_key' => static::apiKey() === '' && stripos($message, 'quota') !== false,
            ];
        }

        return static::trim((array) $response->json(), $strategy);
    }

    /** Google speaks the editor's language where it can. */
    protected static function locale(): string
    {
        return str_replace('_', '-', (string) (User::current()?->preferredLocale() ?? config('app.locale', 'en')));
    }

    /**
     * A megabyte of Lighthouse, kept to the part that is read.
     *
     * @param  array<string, mixed>  $body
     */
    protected static function trim(array $body, string $strategy): array
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
