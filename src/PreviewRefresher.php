<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Cache;
use Symfony\Component\Process\PhpExecutableFinder;

/**
 * Asks for previews to be brought up to date, without making anybody wait.
 *
 * A screenshot takes seconds and a full site takes a minute or two, so this is
 * never done in the request that triggered it. It starts `artisan sve:previews`
 * as a detached process and returns immediately: the save is as fast as it was,
 * and the new images appear in the picker a moment later.
 *
 * Called from anywhere a preview could have gone out of date — a saved section
 * saved, a fieldset's defaults changed, the theme's colours changed. Not from
 * merely opening the picker: that started a screenshot job that rebuilt the
 * Live Preview chrome (Theme Settings included) every 1.5s. Not from the
 * template dock: that save runs on every keystroke.
 *
 * @see Commands\GenerateSetPreviews for the locking that keeps concurrent kicks
 *      from photographing the same section twice.
 */
class PreviewRefresher
{
    /** Set while the generate command runs, so a save it makes can't kick itself. */
    protected static bool $suppressed = false;

    public static function suppress(): void
    {
        static::$suppressed = true;
    }

    public static function suppressed(): bool
    {
        return static::$suppressed;
    }

    /**
     * Refreshes what has gone stale.
     *
     * @param  string|null  $only  A single set handle or entry id, or everything.
     */
    public static function kick(?string $only = null): void
    {
        if (static::$suppressed || ! config('statamic-visual-editor.previews.auto', true)) {
            return;
        }

        // A test suite saves entries by the dozen. Each one starting a browser
        // process in the background would make the suite slow and its failures
        // mysterious, and no test wants a screenshot taken.
        if (app()->runningUnitTests()) {
            return;
        }

        if (! static::spawn($only)) {
            // No way to detach here (exec disabled, or Windows). Run it after the
            // response instead: slower for this one request, but the previews
            // still come out right, which matters more than the milliseconds.
            dispatch(function () use ($only) {
                \Illuminate\Support\Facades\Artisan::call('sve:previews', array_filter(['--only' => $only]));
            })->afterResponse();
        }
    }

    /**
     * Throttles the "something might have changed" kicks that arrive in bursts.
     *
     * A bulk publish saves twenty entries in a second. One run covers all of it,
     * so the rest are dropped — and dropping them is safe because the run reads
     * the fingerprints when it starts, not when it was asked.
     */
    public static function kickThrottled(int $seconds = 20): bool
    {
        if (! Cache::add('sve-previews:throttle', true, $seconds)) {
            return false;
        }

        static::kick();

        return true;
    }

    /** Starts the command detached. False when this platform can't. */
    protected static function spawn(?string $only): bool
    {
        if (! function_exists('exec') || in_array('exec', explode(',', (string) ini_get('disable_functions')), true)) {
            return false;
        }

        if (str_starts_with(strtoupper(PHP_OS_FAMILY), 'WIN')) {
            return false;
        }

        $php = (new PhpExecutableFinder)->find(false) ?: 'php';

        $command = implode(' ', array_filter([
            escapeshellarg($php),
            escapeshellarg(base_path('artisan')),
            'sve:previews',
            $only ? '--only='.escapeshellarg($only) : null,
            '> /dev/null 2>&1 &',
        ]));

        @exec($command);

        return true;
    }
}
