<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Cache;
use Statamic\Facades\User;
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

        static::start($only, false);
    }

    /**
     * Retakes every picture, current or not — the Patterns panel's button.
     *
     * Somebody asked in so many words, so the automatic switch has no say, and
     * the fingerprints and the "drew nothing" / "failed" memos are ignored: a
     * picture that is current by its fingerprint can still be wrong (a section
     * imported from another site with its picture, a fix to how pictures are
     * taken), and the button is how you say so.
     */
    public static function regenerate(): void
    {
        static::start(null, true);
    }

    protected static function start(?string $only, bool $force): void
    {
        // A test suite saves entries by the dozen. Each one starting a browser
        // process in the background would make the suite slow and its failures
        // mysterious, and no test wants a screenshot taken.
        if (app()->runningUnitTests()) {
            return;
        }

        if (! static::spawn($only, $force)) {
            // No way to detach here (exec disabled, or Windows). Run it after the
            // response instead: slower for this one request, but the previews
            // still come out right, which matters more than the milliseconds.
            // In-process, the URLs come from this request already.
            dispatch(function () use ($only, $force) {
                \Illuminate\Support\Facades\Artisan::call('sve:previews', array_filter([
                    '--only' => $only,
                    '--force' => $force,
                ]));
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
    protected static function spawn(?string $only, bool $force): bool
    {
        if (! function_exists('exec') || in_array('exec', explode(',', (string) ini_get('disable_functions')), true)) {
            return false;
        }

        if (str_starts_with(strtoupper(PHP_OS_FAMILY), 'WIN')) {
            return false;
        }

        $php = (new PhpExecutableFinder)->find(false) ?: 'php';

        @exec(static::command($php, $only, $force, static::siteUrl()));

        return true;
    }

    /** The detached command line. */
    public static function command(string $php, ?string $only, bool $force, ?string $url): string
    {
        return implode(' ', array_filter([
            escapeshellarg($php),
            escapeshellarg(base_path('artisan')),
            'sve:previews',
            $only ? '--only='.escapeshellarg($only) : null,
            $force ? '--force' : null,
            $url ? '--url='.escapeshellarg($url) : null,
            '> /dev/null 2>&1 &',
        ]));
    }

    /**
     * The address the browser opens the site at: the one the signed-in editor
     * who asked is using right now, or null for APP_URL.
     *
     * The detached process has no request, so on its own it builds every URL
     * from APP_URL — and a site whose APP_URL is not the address it is served
     * at sends the browser to a host that does not answer. Cuben's was
     * `https://cuben.vizdev` (no `.dk`): every shot failed, each failure was
     * memoised for an hour, and the Patterns panel showed the old pictures with
     * no word about why. The editor's own address is known to work — they are
     * looking at it. Only a signed-in user's request counts: the Host header is
     * the client's to write, and a visitor must not be able to send the
     * browser somewhere else.
     */
    public static function siteUrl(): ?string
    {
        if (! app()->bound('request') || ! User::current()) {
            return null;
        }

        $root = request()->getSchemeAndHttpHost();

        return preg_match('#^https?://[^/\s]+$#', $root) ? $root : null;
    }
}
