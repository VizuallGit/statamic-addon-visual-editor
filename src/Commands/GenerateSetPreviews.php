<?php

namespace MarioHamann\StatamicVisualEditor\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\PreviewBrowser;
use MarioHamann\StatamicVisualEditor\PreviewFingerprint;
use MarioHamann\StatamicVisualEditor\PreviewRefresher;
use MarioHamann\StatamicVisualEditor\SavedSectionPreview;
use MarioHamann\StatamicVisualEditor\SetPreviewGenerator;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;

/**
 * Brings every preview image up to date: the section types in the Add Set picker,
 * the saved sections, and the page templates.
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
        {--only= : A single set handle, or a saved section/template entry id}
        {--force : Re-shoot everything, even what the fingerprints say is current}
        {--watch : Stay running and regenerate whenever a section template, CSS, the build or the theme changes}
        {--interval=2 : Seconds between checks while watching}
        {--sync : Skip the lock — for running inside another process that holds it}';

    protected $description = 'Regenerate the section, saved-section and template preview images.';

    /** How long one run may hold the lock before it's assumed dead. */
    protected const LOCK_SECONDS = 1800;

    public function handle(SetPreviewGenerator $generator): int
    {
        // A save this command makes must not ask for another run of it.
        PreviewRefresher::suppress();

        if ($problem = PreviewBrowser::problem()) {
            $this->components->error($problem);

            return self::FAILURE;
        }

        if ($this->option('watch')) {
            return $this->watch($generator);
        }

        if ($this->option('sync')) {
            return $this->pass($generator);
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
                return $this->pass($generator);
            } finally {
                $lock->release();
            }
        }

        $lock = Cache::lock('sve-previews', static::LOCK_SECONDS);

        if (! $lock->get()) {
            // Another run has the site. Leave a note rather than a second browser:
            // whatever changed since it started will be picked up by the rerun.
            Cache::put('sve-previews:rerun', true, static::LOCK_SECONDS);
            $this->line('Another run is in progress — it will pick this up.');

            return self::SUCCESS;
        }

        try {
            // So the utility page can say a run is under way rather than showing a
            // list of "stale" that is in the middle of being fixed.
            Cache::put('sve-previews:running', true, static::LOCK_SECONDS);

            $status = self::SUCCESS;

            do {
                Cache::forget('sve-previews:rerun');

                // Files and settings have moved on since the last pass.
                PreviewFingerprint::flush();

                $status = max($status, $this->pass($generator));
            } while (Cache::pull('sve-previews:rerun'));

            return $status;
        } finally {
            Cache::forget('sve-previews:running');
            $lock->release();
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
                $this->pass($generator);
            }

            $previous = $current;

            sleep($interval);
        }
    }

    protected function pass(SetPreviewGenerator $generator): int
    {
        $only = $this->option('only');
        $force = (bool) $this->option('force');

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

        if ($failed->isNotEmpty()) {
            $this->components->error($failed->first());
        }

        return $failed->isEmpty() ? self::SUCCESS : self::FAILURE;
    }

    /**
     * The saved sections and page templates.
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
            config('statamic-visual-editor.templates.collection', 'saved_templates'),
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
