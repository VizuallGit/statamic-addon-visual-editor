<?php

namespace MarioHamann\StatamicVisualEditor\SetPreview;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use MarioHamann\StatamicVisualEditor\PreviewFingerprint;
use MarioHamann\StatamicVisualEditor\SectionDefaults;
use Statamic\Facades\AssetContainer;
use Statamic\Fieldtypes\Sets;

/**
 * What each section type needs, without touching a browser: its subject
 * (its defaults, or a configured override), the fingerprinted
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
     * The subjects a handle could be photographed as.
     *
     * The fieldset's defaults, and only those: that is the section the picker
     * inserts, so the picture is what you get when you drag it in. A section
     * as it stands on some page shows that page's content — somebody's text,
     * somebody's video — which is exactly what you do NOT get. A template that
     * draws nothing without content gets no picture; the cure is a default or
     * an {{ else }} in the template, not a picture of somebody else's section.
     * An explicit config override replaces the defaults, since somebody has
     * said in so many words what to photograph.
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

        if (! $defaults = SectionDefaults::for($handle)) {
            return [];
        }

        return [[
            'url' => URL::temporarySignedRoute('sve.section-defaults-preview', now()->addMinutes(30), [
                'type' => $handle,
            ]),
            'selector' => $selector,
            'data' => $defaults,
            'source' => 'defaults',
        ]];
    }

    /** A clean file base derived from a set handle, e.g. "hero/style_1" → "hero-style-1". */
    public static function handleBase(string $handle): string
    {
        return str_replace(['/', '_'], '-', $handle);
    }
}
