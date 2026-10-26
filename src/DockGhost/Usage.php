<?php

namespace MarioHamann\StatamicVisualEditor\DockGhost;

/**
 * What the dock's AI has cost this site, month by month.
 *
 * One small JSON file per month under storage/, added to after each answer:
 * how many requests, the tokens of each kind and the dollars they come to at
 * list price. The owner pays per request on the site's own key; this is
 * where they can see what that has come to, without opening the Anthropic
 * console.
 *
 * The prices are the list prices of October 2026 (console.anthropic.com
 * shows today's). A model not listed is counted in requests and tokens, not
 * in dollars.
 */
final class Usage
{
    /**
     * Dollars per million tokens: input, output, cache read. A five-minute
     * cache write is input and a quarter.
     */
    public const PRICES = [
        'claude-haiku-5-5' => [0.10, 0.50, 0.01],
        'claude-sonnet-5-5' => [2.00, 10.00, 0.20],
        'claude-opus-5-5' => [4.00, 20.00, 0.20],
    ];

    public static function directory(): string
    {
        return storage_path('statamic-visual-editor/ghost-usage');
    }

    /** @param  array<string, int>  $usage  Reply::usage's shape */
    public static function cost(string $model, array $usage): ?float
    {
        $price = static::PRICES[$model] ?? null;

        if ($price === null) {
            return null;
        }

        [$input, $output, $cacheRead] = $price;

        return (($usage['input'] ?? 0) * $input
            + ($usage['output'] ?? 0) * $output
            + ($usage['cache_read'] ?? 0) * $cacheRead
            + ($usage['cache_write'] ?? 0) * $input * 1.25) / 1_000_000;
    }

    /** One answer more on this month's account. */
    public static function record(string $model, string $mode, array $usage): void
    {
        $dir = static::directory();

        if (! is_dir($dir) && ! @mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return;
        }

        $path = $dir.'/'.date('Y-m').'.json';
        $handle = @fopen($path, 'c+');

        if ($handle === false) {
            return;
        }

        try {
            flock($handle, LOCK_EX);

            $month = json_decode((string) stream_get_contents($handle), true);
            $month = is_array($month) ? $month : [];

            $month['requests'] = ($month['requests'] ?? 0) + 1;
            $month['modes'][$mode] = ($month['modes'][$mode] ?? 0) + 1;

            foreach (['input', 'output', 'cache_read', 'cache_write'] as $kind) {
                $month['tokens'][$kind] = ($month['tokens'][$kind] ?? 0) + (int) ($usage[$kind] ?? 0);
            }

            $cost = static::cost($model, $usage);

            if ($cost !== null) {
                $month['cost'] = round(($month['cost'] ?? 0) + $cost, 6);
            }

            ftruncate($handle, 0);
            rewind($handle);
            fwrite($handle, json_encode($month, JSON_PRETTY_PRINT));
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }

    /**
     * This month so far.
     *
     * @return array{month: string, requests: int, cost: float, modes: array<string, int>}
     */
    public static function month(?string $month = null): array
    {
        $month ??= date('Y-m');
        $path = static::directory().'/'.$month.'.json';
        $data = is_file($path) ? json_decode((string) file_get_contents($path), true) : null;
        $data = is_array($data) ? $data : [];

        return [
            'month' => $month,
            'requests' => (int) ($data['requests'] ?? 0),
            'cost' => (float) ($data['cost'] ?? 0),
            'modes' => (array) ($data['modes'] ?? []),
        ];
    }
}
