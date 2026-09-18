<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use MarioHamann\StatamicVisualEditor\PageSpeed\Report;
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
 *
 * This class keeps the key, the checks and the request to Google; the
 * answer is cut down by `PageSpeed\Report`. Split in WP7d, code moved
 * verbatim.
 */
class PageSpeed
{
    protected const ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

    /** Lighthouse is slow by design — it loads the page several times. */
    protected const TIMEOUT = 120;

    /** Long enough that switching tabs is free, short enough to be today's page. */
    protected const CACHE_SECONDS = 600;

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

        return Report::trim((array) $response->json(), $strategy);
    }

    /** Google speaks the editor's language where it can. */
    protected static function locale(): string
    {
        return str_replace('_', '-', (string) (User::current()?->preferredLocale() ?? config('app.locale', 'en')));
    }
}
