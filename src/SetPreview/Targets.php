<?php

namespace MarioHamann\StatamicVisualEditor\SetPreview;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use MarioHamann\StatamicVisualEditor\PreviewFingerprint;
use MarioHamann\StatamicVisualEditor\SectionDefaults;
use MarioHamann\StatamicVisualEditor\Stores;
use Statamic\Facades\AssetContainer;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Statamic\Fieldtypes\Sets;

/**
 * What each section type needs, without touching a browser: its subjects
 * (defaults, a real instance, or a configured override), the fingerprinted
 * filename, and whether the picture on disk is still current.
 * Moved verbatim out of SetPreviewGenerator in WP7d.
 */
final class Targets
{
    /** Where the "this drew nothing" memo for a handle lives. */
    public static function emptyKey(string $handle): string
    {
        return 'sve-previews:empty:'.md5($handle);
    }

    /** Where the "the browser could not do this one" memo lives. */
    public static function failedKey(string $handle): string
    {
        return 'sve-previews:failed:'.md5($handle);
    }

    /**
     * What each section type needs, without touching a browser.
     *
     * The utility page reads this to show what is current and what is not, and
     * generate() reads it to decide what to shoot — the same answer either way.
     *
     * @return array<string, array{status: string, url: ?string, selector: string, filename: ?string, current: ?string, source: ?string}>
     */
    public static function targets(?string $only = null): array
    {
        $exclude = (array) config('statamic-visual-editor.previews.exclude', []);
        $overrides = (array) config('statamic-visual-editor.previews.overrides', []);
        $selector = config('statamic-visual-editor.previews.selector', 'main > *');

        $config = Sets::previewImageConfig();
        $filesystem = $config ? AssetContainer::find($config['container'])?->disk()->filesystem() : null;
        $folder = $config && $config['folder'] ? rtrim($config['folder'], '/').'/' : '';

        $targets = [];

        foreach (static::targetSets() as $handle => $current) {
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

            $candidates = static::candidates($handle, $overrides[$handle] ?? [], $selector);

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

            $filename = static::handleBase($handle).'-'.$fingerprint.'.png';
            $exists = $current === $filename && $filesystem && $filesystem->exists($folder.$current);
            $drewNothing = Cache::get(static::emptyKey($handle)) === $filename;
            $lastFailed = Cache::get(static::failedKey($handle)) === $filename;

            $targets[$handle] = array_merge($base, [
                'status' => match (true) {
                    $exists => 'fresh',
                    $drewNothing => 'renders_nothing',
                    $lastFailed => 'failed',
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
    protected static function targetSets(): array
    {
        return array_map(
            fn ($set) => $set['image'] ?? null,
            SectionDefaults::allSets(),
        );
    }

    /**
     * The subjects a handle could be photographed as, best first.
     *
     * A real instance leads: the section as it stands on a page — the editor's
     * working copy included, since that is what Live Preview shows — is the
     * picture of what the section looks like. The fieldset's defaults follow
     * as the understudy, for a type no page uses yet, and for one whose
     * instance draws nothing — see shoot(). An explicit config override
     * replaces both, since somebody has said in so many words what to
     * photograph.
     *
     * @return array<int, array{url: string, selector: string, data: array, source: string}>
     */
    protected static function candidates(string $handle, array $override, string $selector): array
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

        if ($instance = static::findInstance($handle)) {
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

        return $candidates;
    }

    /**
     * Finds a real, enabled instance of the given section type on an entry of
     * the default site — read through the entry's working copy when it has
     * one, so an edit saved but not yet published is what gets photographed,
     * exactly as Live Preview shows it. Published entries are searched first.
     *
     * Every collection is searched, not only the one previews render inside: a site
     * may well keep its examples somewhere other than its pages (a "Sections"
     * collection of demos, a Blog), and a section type that exists on the site
     * ought to be findable wherever it lives. `previews.scan` narrows this to a
     * list of collection handles where that matters.
     *
     * @return array{0: string, 1: string, 2: array}|null  [entry id, section id, section data]
     */
    protected static function findInstance(string $handle): ?array
    {
        $field = config('statamic-visual-editor.previews.field', 'page_sections');

        foreach (static::scannedCollections() as $collection) {
            $entries = Entry::query()
                ->where('collection', $collection)
                ->where('site', Site::default()->handle())
                ->get()
                ->sortByDesc(fn ($entry) => $entry->published() ? 1 : 0);

            foreach ($entries as $entry) {
                $sections = static::editorsView($entry)->value($field);

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
     * The entry as the editor sees it: its working copy when it has one, else
     * the entry itself. Statamic's PreviewHost renders the same way, so the
     * picture and Live Preview agree.
     */
    public static function editorsView($entry)
    {
        try {
            return method_exists($entry, 'hasWorkingCopy') && $entry->hasWorkingCopy()
                ? $entry->fromWorkingCopy()
                : $entry;
        } catch (\Throwable) {
            return $entry;
        }
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
    protected static function scannedCollections(): array
    {
        $primary = config('statamic-visual-editor.previews.collection', 'pages');

        if ($scan = config('statamic-visual-editor.previews.scan')) {
            return (array) $scan;
        }

        $stores = [
            config('statamic-visual-editor.saved_sections.collection', 'saved_sections'),
            Stores::compositions(),
        ];

        $rest = Collection::all()
            ->map->handle()
            ->reject(fn ($handle) => $handle === $primary || in_array($handle, $stores, true))
            ->sort()
            ->values()
            ->all();

        return array_merge([$primary], $rest);
    }

    /** A clean file base derived from a set handle, e.g. "hero/style_1" → "hero-style-1". */
    public static function handleBase(string $handle): string
    {
        return str_replace(['/', '_'], '-', $handle);
    }
}
