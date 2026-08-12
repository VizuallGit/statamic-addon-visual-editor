<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use Statamic\Facades\AssetContainer;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Fieldset;
use Statamic\Facades\Site;
use Statamic\Facades\YAML;
use Statamic\Fieldtypes\Sets;

/**
 * Keeps the "Preview Image" of every page-builder section type a true picture of
 * that section, by screenshotting it in a real headless browser on the real site.
 *
 * Each type is drawn with its DEFAULT values — the section the Add Set picker
 * inserts when you click it — so the picker never promises something other than
 * what you get. A type whose defaults are all empty would photograph as a blank
 * strip; for those, and only those, a real instance on the site is borrowed
 * instead, so nothing ends up with no preview at all.
 *
 * The images live in the container/folder configured by
 * `statamic.assets.set_preview_images`, so Statamic's native picker shows them,
 * and the set's `image:` in the fieldset YAML is updated to match.
 *
 * Filenames carry a fingerprint (`hero-style-1-<hash>.png`) of everything the
 * picture depends on: the section's own partial and defaults, the built CSS/JS,
 * the layout, the theme settings. That is what makes this cheap enough to run on
 * every save — a run where nothing changed compares strings and starts no browser
 * — and it doubles as cache busting, since a new hash is a new URL that no
 * browser has cached.
 */
class SetPreviewGenerator
{
    /** A generated filename, as opposed to one somebody uploaded by hand. */
    protected const GENERATED = '/-[0-9a-f]{8}\.[a-z0-9]+$/i';

    /**
     * Brings every section type's preview up to date.
     *
     * @param  string|null  $only  A single set handle, or all of them when null.
     * @param  bool  $force  Re-shoot even the ones whose fingerprint still matches.
     * @return array<string, string>  handle => "ok" | "fresh" | "excluded" | "skipped: …" | "error: …"
     */
    public function generate(?string $only = null, bool $force = false): array
    {
        $config = Sets::previewImageConfig();

        if (! $config) {
            return ['_' => 'error: statamic.assets.set_preview_images is not configured'];
        }

        if (! $container = AssetContainer::find($config['container'])) {
            return ['_' => 'error: asset container "'.$config['container'].'" does not exist'];
        }

        $filesystem = $container->disk()->filesystem();
        $folder = $config['folder'] ? rtrim($config['folder'], '/').'/' : '';

        $results = [];
        $changed = false;

        foreach ($this->targets($only) as $handle => $target) {
            if ($target['status'] === 'excluded') {
                $results[$handle] = 'excluded';

                continue;
            }

            if ($target['status'] === 'no_source') {
                $results[$handle] = 'skipped: no default values and not used anywhere';

                continue;
            }

            if ($target['status'] === 'fresh' && ! $force) {
                $results[$handle] = 'fresh';

                continue;
            }

            // Already tried, at this exact fingerprint, and it drew nothing. Only
            // an explicit --force spends a browser asking again.
            if ($target['status'] === 'renders_nothing' && ! $force) {
                $results[$handle] = 'skipped: renders nothing to photograph';

                continue;
            }

            $results[$handle] = $this->shoot($handle, $target, $filesystem, $folder, $changed);
        }

        if ($changed) {
            SetPreviewImages::flush();
            Artisan::call('statamic:glide:clear');
        }

        return $results;
    }

    /**
     * Photographs the first of a target's subjects that actually draws something.
     *
     * A section type is drawn from its defaults where it can be, and that is the
     * subject tried first. But a template guarded on content it has no default for
     * ({{ if columns }}) renders nothing at all, and a picture of nothing is worse
     * than a picture of somebody's real column section — so a real instance on the
     * site is the next subject, and only when neither draws anything does the type
     * go without.
     */
    protected function shoot(string $handle, array $target, $filesystem, string $folder, bool &$changed): string
    {
        $empty = 0;

        foreach ($target['candidates'] as $candidate) {
            $tmp = tempnam(sys_get_temp_dir(), 'sve_').'.png';

            try {
                PreviewBrowser::shoot($candidate['url'], $candidate['selector'], $tmp);

                $filesystem->put($folder.$target['filename'], file_get_contents($tmp));
                @unlink($tmp);

                $this->updateImage($handle, $target['filename']);
                $this->deleteSuperseded($folder, $target);

                $changed = true;

                return 'ok';
            } catch (EmptyRenderException $e) {
                @unlink($tmp);
                $empty++;

                continue;
            } catch (\Throwable $e) {
                @unlink($tmp);

                return 'error: '.trim($e->getMessage());
            }
        }

        if ($empty) {
            // Remembered against the fingerprint, so the next run doesn't start a
            // browser to be told the same thing. A refresh happens after every
            // save; four sections that draw nothing would otherwise cost a browser
            // each, every time, forever. The memo dies the moment anything the
            // fingerprint covers changes — which is exactly when it might draw
            // something after all.
            Cache::put(static::emptyKey($handle), $target['filename'], now()->addDays(30));

            return 'skipped: renders nothing to photograph (its template draws nothing without content)';
        }

        return 'skipped: nothing to photograph';
    }

    /** Where the "this drew nothing" memo for a handle lives. */
    protected static function emptyKey(string $handle): string
    {
        return 'sve-previews:empty:'.md5($handle);
    }

    /**
     * What each section type needs, without touching a browser.
     *
     * The utility page reads this to show what is current and what is not, and
     * generate() reads it to decide what to shoot — the same answer either way.
     *
     * @return array<string, array{status: string, url: ?string, selector: string, filename: ?string, current: ?string, source: ?string}>
     */
    public function targets(?string $only = null): array
    {
        $exclude = (array) config('statamic-visual-editor.previews.exclude', []);
        $overrides = (array) config('statamic-visual-editor.previews.overrides', []);
        $selector = config('statamic-visual-editor.previews.selector', 'main > *');

        $config = Sets::previewImageConfig();
        $filesystem = $config ? AssetContainer::find($config['container'])?->disk()->filesystem() : null;
        $folder = $config && $config['folder'] ? rtrim($config['folder'], '/').'/' : '';

        $targets = [];

        foreach ($this->targetSets() as $handle => $current) {
            if ($only !== null && $handle !== $only) {
                continue;
            }

            $base = [
                'status' => 'excluded',
                'candidates' => [],
                'filename' => null,
                'current' => $current,
                'source' => null,
            ];

            if (in_array($handle, $exclude, true)) {
                $targets[$handle] = $base;

                continue;
            }

            $candidates = $this->candidates($handle, $overrides[$handle] ?? [], $selector);

            if ($candidates === []) {
                $targets[$handle] = array_merge($base, ['status' => 'no_source']);

                continue;
            }

            // Fingerprinted over every candidate, not just the one that will be
            // used: the filename has to be settled before a browser is started,
            // and a change to either subject should still retake the picture.
            $fingerprint = PreviewFingerprint::forSectionType(
                $handle,
                array_map(fn ($candidate) => $candidate['data'], $candidates),
            );

            $filename = $this->handleBase($handle).'-'.$fingerprint.'.png';
            $exists = $current === $filename && $filesystem && $filesystem->exists($folder.$current);
            $drewNothing = Cache::get(static::emptyKey($handle)) === $filename;

            $targets[$handle] = array_merge($base, [
                'status' => match (true) {
                    $exists => 'fresh',
                    $drewNothing => 'renders_nothing',
                    (bool) $current => 'stale',
                    default => 'missing',
                },
                'candidates' => $candidates,
                'filename' => $filename,
                'source' => $candidates[0]['source'],
            ]);
        }

        return $targets;
    }

    /**
     * The section types to generate previews for: the set handles of the
     * configured page-builder field, each with its current `image` filename (or
     * null when it has none yet).
     *
     * @return array<string, ?string>
     */
    protected function targetSets(): array
    {
        return array_map(
            fn ($set) => $set['image'] ?? null,
            SectionDefaults::allSets(),
        );
    }

    /**
     * The subjects a handle could be photographed as, best first.
     *
     * Defaults lead, because that is the section the picker inserts. A real
     * instance follows as the understudy, for the types whose template draws
     * nothing without content — see shoot(). An explicit config override replaces
     * both, since somebody has said in so many words what to photograph.
     *
     * @return array<int, array{url: string, selector: string, data: array, source: string}>
     */
    protected function candidates(string $handle, array $override, string $selector): array
    {
        if (! empty($override['url'])) {
            $url = preg_match('#^https?://#', $override['url']) ? $override['url'] : url($override['url']);

            return [[
                'url' => $url,
                'selector' => $override['selector'] ?? $selector,
                'data' => ['override' => $override],
                'source' => 'override',
            ]];
        }

        $candidates = [];
        $defaults = SectionDefaults::for($handle);

        if (SectionDefaults::hasContent($defaults)) {
            $candidates[] = [
                'url' => URL::temporarySignedRoute('sve.section-defaults-preview', now()->addMinutes(30), [
                    'type' => $handle,
                ]),
                'selector' => $selector,
                'data' => $defaults,
                'source' => 'defaults',
            ];
        }

        if ($instance = $this->findInstance($handle)) {
            [$entryId, $sectionId, $data] = $instance;

            $candidates[] = [
                'url' => URL::temporarySignedRoute('sve.section-preview', now()->addMinutes(30), [
                    'entry' => $entryId,
                    'section' => $sectionId,
                ]),
                'selector' => $selector,
                'data' => $data,
                'source' => 'instance',
            ];
        }

        return $candidates;
    }

    /**
     * Finds a real, enabled instance of the given section type on a published
     * entry, on the default site.
     *
     * Every collection is searched, not only the one previews render inside: a site
     * may well keep its examples somewhere other than its pages (a "Sections"
     * collection of demos, a Blog), and a section type that exists on the site
     * ought to be findable wherever it lives. `previews.scan` narrows this to a
     * list of collection handles where that matters.
     *
     * @return array{0: string, 1: string, 2: array}|null  [entry id, section id, section data]
     */
    protected function findInstance(string $handle): ?array
    {
        $field = config('statamic-visual-editor.previews.field', 'page_sections');

        foreach ($this->scannedCollections() as $collection) {
            $entries = Entry::query()
                ->where('collection', $collection)
                ->where('site', Site::default()->handle())
                ->where('published', true)
                ->get();

            foreach ($entries as $entry) {
                $sections = $entry->value($field);

                if (! is_array($sections)) {
                    continue;
                }

                foreach ($sections as $section) {
                    // Disabled sections don't render at all — keep looking.
                    if (($section['enabled'] ?? true) === false) {
                        continue;
                    }

                    if (($section['type'] ?? null) === $handle) {
                        $id = $section['id'] ?? ($section['_id'] ?? null);

                        if ($id) {
                            return [$entry->id(), $id, $section];
                        }
                    }
                }
            }
        }

        return null;
    }

    /**
     * Which collections to look for instances in: the configured list, or all of
     * them with the previews collection first — it is the likeliest home, and
     * searching it first keeps the choice stable as content is added elsewhere.
     *
     * The editor's own stores are left out: a saved section is a copy of a section
     * type, so photographing one as though it were the type would show somebody's
     * edited copy in the picker.
     *
     * @return array<int, string>
     */
    protected function scannedCollections(): array
    {
        $primary = config('statamic-visual-editor.previews.collection', 'pages');

        if ($scan = config('statamic-visual-editor.previews.scan')) {
            return (array) $scan;
        }

        $stores = [
            config('statamic-visual-editor.saved_sections.collection', 'saved_sections'),
            config('statamic-visual-editor.templates.collection', 'saved_templates'),
        ];

        $rest = Collection::all()
            ->map->handle()
            ->reject(fn ($handle) => $handle === $primary || in_array($handle, $stores, true))
            ->sort()
            ->values()
            ->all();

        return array_merge([$primary], $rest);
    }

    /**
     * Removes the image this one replaces — but only when we made it.
     *
     * A hand-uploaded preview is left on disk: somebody chose that file, and the
     * generator taking over the set's `image:` is no reason to delete it from the
     * asset container, where it may well be in use somewhere else.
     */
    protected function deleteSuperseded(string $folder, array $target): void
    {
        $current = $target['current'];

        if (! $current || $current === $target['filename']) {
            return;
        }

        if (! preg_match(static::GENERATED, $current)) {
            return;
        }

        $config = Sets::previewImageConfig();

        if ($container = AssetContainer::find($config['container'])) {
            PreviewFile::forget($container, $folder.$current);
        }
    }

    /** A clean file base derived from a set handle, e.g. "hero/style_1" → "hero-style-1". */
    protected function handleBase(string $handle): string
    {
        return str_replace(['/', '_'], '-', $handle);
    }

    /**
     * Updates the set's `image:` value in whichever fieldset defines it.
     *
     * Read from the file, every time, right before writing — never from the copy
     * this process has been holding. Two things make that essential, and both of
     * them corrupt a fieldset if ignored:
     *
     * A run takes a browser-second per section, so minutes can pass between the
     * moment the sets were read and the moment one is written back. A set added in
     * the Control Panel during that window is not in the copy we hold, and writing
     * it back deletes their work — the page keeps its section, the fieldset no
     * longer has the type, and the whole page-builder field renders empty.
     *
     * And the fieldset repository hands out one cached instance per handle, which
     * this addon mutates at runtime to inject `_visual_id` into imported sets
     * (deliberately in memory only — see InjectVisualIdIntoBlueprint). Saving that
     * instance writes those injected fields into the author's YAML.
     */
    protected function updateImage(string $handle, string $newFilename): void
    {
        $field = config('statamic-visual-editor.previews.field', 'page_sections');
        $handles = collect([$field])
            ->merge(Fieldset::all()->map->handle())
            ->unique()
            ->all();

        foreach ($handles as $fieldsetHandle) {
            $contents = $this->readFieldset($fieldsetHandle);

            if ($contents === null || ! $this->replaceImage($contents, $handle, $newFilename)) {
                continue;
            }

            Fieldset::make($fieldsetHandle)->setContents($contents)->saveQuietly();

            return;
        }
    }

    /**
     * A fieldset's contents as they are on disk this second, or null if it has no
     * file (a namespaced or addon-provided fieldset, which is not ours to edit).
     */
    protected function readFieldset(string $handle): ?array
    {
        $path = Fieldset::directory().'/'.str_replace('.', '/', $handle).'.yaml';

        if (! is_file($path)) {
            return null;
        }

        return YAML::file($path)->parse() ?: [];
    }

    /** Recursively finds the set (keyed by $handle) and sets its image. */
    protected function replaceImage(array &$node, string $handle, string $newFilename): bool
    {
        foreach ($node as $key => &$value) {
            if (! is_array($value)) {
                continue;
            }

            if ($key === $handle && (isset($value['fields']) || isset($value['display']))) {
                $value['image'] = $newFilename;

                return true;
            }

            if ($this->replaceImage($value, $handle, $newFilename)) {
                return true;
            }
        }

        return false;
    }
}
