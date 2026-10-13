<?php

namespace MarioHamann\StatamicVisualEditor\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use MarioHamann\StatamicVisualEditor\PreviewBrowser;
use MarioHamann\StatamicVisualEditor\PreviewFingerprint;
use MarioHamann\StatamicVisualEditor\PreviewRefresher;
use MarioHamann\StatamicVisualEditor\SavedSectionPreview;
use MarioHamann\StatamicVisualEditor\SetPreviewGenerator;
use MarioHamann\StatamicVisualEditor\Stores;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;

/**
 * Brings every preview image up to date: the section types in the Add Set picker,
 * the saved sections, and the page compositions.
 *
 * This is the one place screenshots are taken. Everything else — a save, a
 * fieldset change, the section library opening — asks for this to run, and the
 * fingerprints inside decide what actually needs a browser. Beside Vite, run
 * `npm run dev:previews` so a template or CSS change is photographed as it
 * looks on the working tree. Without Vite, run this after `npm run build`.
 */
class GenerateSetPreviews extends Command
{
    protected $signature = 'sve:previews
        {--only= : A single set handle, or a saved section/composition entry id}
        {--force : Re-shoot everything, even what the fingerprints say is current}
        {--watch : Stay running and regenerate whenever a section template, CSS, the build or the theme changes}
        {--interval=2 : Seconds between checks while watching}
        {--sync : Skip the lock — for running inside another process that holds it}
        {--url= : The address to open the site at instead of APP_URL — the refresher passes the one the editor is using}';

    protected $description = 'Regenerate the section, saved-section and composition preview images.';

    /** How long one run may hold the lock before it's assumed dead. */
    protected const LOCK_SECONDS = 1800;

    /** What the last full run could not photograph, for the Patterns panel to say. */
    public const ERRORS = 'sve-previews:errors';

    /**
     * Set by whoever starts a full run, until that run is under way (or has
     * given up), so the Patterns panel does not read the second it takes this
     * process to boot as "finished"; see PreviewTickController.
     */
    public const QUEUED = 'sve-previews:queued';

    /** A run that found the lock taken asks the holder for another pass here. */
    public const RERUN = 'sve-previews:rerun';

    public function handle(SetPreviewGenerator $generator): int
    {
        // A save this command makes must not ask for another run of it.
        PreviewRefresher::suppress();

        if (($url = $this->option('url')) !== null && ! $this->useUrl($url)) {
            $this->components->error('--url takes a scheme and host, like https://example.com');
            $this->underWay();

            return self::FAILURE;
        }

        // The browser is fetched here when the site lacks it (a fresh site
        // from the kit, or a puppeteer upgrade), so the run that follows has
        // one — nobody has to log in and run puppeteer's installer by hand.
        // On Linux the system libraries it lacks come with it, into the site.
        if (! PreviewBrowser::browserInstalled()) {
            // Minutes, the first time: a panel waiting for this run keeps
            // waiting instead of reading the quiet as "done".
            if (! $this->option('only') && Cache::has(static::QUEUED)) {
                Cache::put(static::QUEUED, true, 900);
            }

            $this->line('Fetching '.PreviewBrowser::BROWSER.' into storage/'.PreviewBrowser::DIR.'…');
            PreviewBrowser::install();
        }

        if ($problem = PreviewBrowser::problem()) {
            $this->components->error($problem);

            if (! $this->option('only')) {
                Cache::put(static::ERRORS, ['_' => $problem], now()->addDay());
            }

            $this->underWay();

            return self::FAILURE;
        }

        $force = (bool) $this->option('force');

        if ($this->option('watch')) {
            return $this->watch($generator);
        }

        if ($this->option('sync')) {
            return $this->pass($generator, $force);
        }

        // One target, asked for by name — almost always a section somebody just
        // saved. It gets a lock of its own rather than the site-wide one, so it
        // is photographed now and not after however long a design sweep of every
        // section type happens to take. Two saves of the same thing still can't
        // overlap, which is all the mutual exclusion this needs.
        if ($only = $this->option('only')) {
            $lock = Cache::lock('sve-previews:'.md5($only), 120);

            if (! $lock->get()) {
                $this->line('Already being generated.');

                return self::SUCCESS;
            }

            try {
                return $this->pass($generator, $force);
            } finally {
                $lock->release();
            }
        }

        $lock = Cache::lock('sve-previews', static::LOCK_SECONDS);

        if (! $lock->get()) {
            // Another run has the site. Leave a note rather than a second browser:
            // whatever changed since it started will be picked up by the rerun.
            $this->leaveNote($force, $url);

            // Asked again after the note is down: a run that let go in between
            // checked for notes before this one was written, so nobody else
            // will act on it. QUEUED stays until a run starts the work.
            if (! $lock->get()) {
                $this->line('Another run is in progress — it will pick this up.');

                return self::SUCCESS;
            }
        }

        do {
            $status = $this->holding($generator, $lock, $force);
            $force = false;

            // The mirror image: a note written between this run's last look
            // and the release. Take the lock back for it, unless the run that
            // wrote it already did.
        } while (Cache::has(static::RERUN) && $lock->get());

        return $status;
    }

    /** One full run, holding the site lock; releases it. */
    protected function holding(SetPreviewGenerator $generator, $lock, bool $force): int
    {
        try {
            // So the utility page can say a run is under way rather than showing a
            // list of "stale" that is in the middle of being fixed.
            Cache::put('sve-previews:running', true, static::LOCK_SECONDS);

            $status = self::SUCCESS;
            $errors = [];

            // A note left before this run took the lock is work asked for —
            // a forced one above all — not a duplicate to throw away.
            $note = Cache::pull(static::RERUN);

            do {
                if (is_array($note)) {
                    $force = $force || ! empty($note['force']);

                    // The address of the editor who asked: the run that holds
                    // the lock may have been started without one (over SSH,
                    // from a queue), and APP_URL can be wrong.
                    if (! empty($note['url'])) {
                        $this->useUrl($note['url']);
                    }
                }

                $this->underWay();

                // Files and settings have moved on since the last pass.
                PreviewFingerprint::flush();

                $status = max($status, $this->pass($generator, $force, $errors));

                $force = false;
                $note = Cache::pull(static::RERUN);
            } while ($note !== null);

            // Kept until the next run, so a panel that asks after this one
            // finished can still say what went wrong instead of nothing.
            Cache::put(static::ERRORS, $errors, now()->addDay());

            return $status;
        } finally {
            Cache::forget('sve-previews:running');
            $lock->release();
        }
    }

    /**
     * Asks the run that holds the lock for another pass — forced, if this run
     * was, and never downgraded by a later plain note; on the newest editor
     * address given.
     */
    protected function leaveNote(bool $force, ?string $url): void
    {
        $note = Cache::get(static::RERUN);
        $note = is_array($note) ? $note : [];

        Cache::put(static::RERUN, [
            'force' => $force || ! empty($note['force']),
            'url' => $url ?? ($note['url'] ?? null),
        ], static::LOCK_SECONDS);
    }

    /**
     * Builds every URL the browser is sent to on this address, signed routes
     * included; the signature is checked against the same host. False when it
     * is not a bare scheme and host.
     */
    protected function useUrl(string $url): bool
    {
        if (! preg_match('#^(https?)://[^/\s]+$#', $url, $match)) {
            return false;
        }

        URL::forceRootUrl($url);
        URL::forceScheme($match[1]);

        return true;
    }

    /** A full run has taken over from "queued": it is running, or gave up. */
    protected function underWay(): void
    {
        if (! $this->option('only')) {
            Cache::forget(static::QUEUED);
        }
    }

    /**
     * Stays running and regenerates the moment something changes.
     *
     * For the hours spent building sections. Editing an Antlers partial fires no
     * event anything can subscribe to — the file just changes — so the only ways
     * to notice are to look, or to wait until somebody opens the section library.
     * Run this beside `npm run dev` and the picker is simply always right.
     *
     * Looking is cheap on purpose: a pass over the fingerprints reads a few dozen
     * small files and starts no browser unless one of them moved.
     */
    protected function watch(SetPreviewGenerator $generator): int
    {
        $interval = max(1, (int) $this->option('interval'));
        $previous = null;

        $this->components->info('Watching for changes — ctrl-c to stop.');

        while (true) {
            PreviewFingerprint::flush();

            // Every target's filename carries its fingerprint, so the set of names
            // IS the state of the site's design: partials, defaults, CSS/JS and
            // theme settings all reach it.
            $current = md5(json_encode(array_map(
                fn ($target) => $target['filename'],
                $generator->targets(),
            )));

            if ($previous !== null && $current !== $previous) {
                $this->line(' <comment>changed</comment> — regenerating…');
                $this->pass($generator, (bool) $this->option('force'));
            }

            $previous = $current;

            sleep($interval);
        }
    }

    /** @param  array<string, string>  $errors  Collects name => message for every target that failed. */
    protected function pass(SetPreviewGenerator $generator, bool $force, array &$errors = []): int
    {
        $only = $this->option('only');

        $results = array_merge(
            $generator->generate($only, $force),
            $this->stores($only, $force),
        );

        foreach ($results as $name => $status) {
            $this->line(sprintf(
                ' %s %s — %s',
                $status === 'ok' ? '<info>✓</info>' : '<comment>•</comment>',
                $name,
                $status
            ));
        }

        $failed = collect($results)->filter(fn ($status) => str_starts_with($status, 'error'));

        foreach ($results as $name => $status) {
            if (str_starts_with($status, 'error')) {
                $errors[$name] = trim(substr($status, strlen('error:')));
            } elseif ($status === 'ok') {
                unset($errors[$name]);
            }
        }

        if ($failed->isNotEmpty()) {
            $this->components->error($failed->first());
        }

        return $failed->isEmpty() ? self::SUCCESS : self::FAILURE;
    }

    /**
     * The saved sections and page compositions.
     *
     * Both are entries with a stack of sections on them, and both are photographed
     * the same way — the only difference is the render route and whether one
     * section or all of them are in frame, which the entry's collection decides.
     *
     * @return array<string, string>
     */
    protected function stores(?string $only, bool $force): array
    {
        $preview = app(SavedSectionPreview::class);
        $collections = array_filter([
            config('statamic-visual-editor.saved_sections.collection', 'saved_sections'),
            Stores::compositions(),
        ]);

        $results = [];

        foreach ($collections as $collection) {
            $entries = Entry::query()
                ->where('collection', $collection)
                ->where('site', Site::default()->handle())
                ->get();

            foreach ($entries as $entry) {
                // --only takes a set handle or an entry id; a handle simply matches
                // no entry here, which is why both can share one option.
                if ($only !== null && $entry->id() !== $only) {
                    continue;
                }

                if (($spec = SavedSectionPreview::specFor($entry)) === null) {
                    continue;
                }

                $results[$collection.'/'.$entry->id()] = $preview->generate($entry, $spec, $force);
            }
        }

        return $results;
    }
}
