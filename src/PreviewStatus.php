<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Cache;
use Statamic\Facades\AssetContainer;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Statamic\Fieldtypes\Sets;

/**
 * What the Section Previews utility shows: every preview on the site, whether it
 * is a current picture of the thing it depicts, and — when none can be taken at
 * all — the one line that fixes that.
 *
 * Read-only and browser-free. Answering "is this current?" is a fingerprint
 * comparison, so the page can show the true state of every preview without
 * generating anything.
 */
class PreviewStatus
{
    public static function all(): array
    {
        return [
            'problem' => PreviewBrowser::problem(),
            'running' => Cache::get('sve-previews:running', false),
            'types' => static::types(),
            'sections' => static::store(
                config('statamic-visual-editor.saved_sections.collection', 'saved_sections')
            ),
            'templates' => static::store(
                Stores::compositions()
            ),
        ];
    }

    /** The site's own section types — the Add Set picker's previews. */
    protected static function types(): array
    {
        $images = SetPreviewImages::map();

        return collect(app(SetPreviewGenerator::class)->targets())
            ->map(fn ($target, $handle) => [
                'name' => $handle,
                'status' => $target['status'],
                'source' => $target['source'],
                'url' => $images[$handle] ?? null,
            ])
            ->sortBy(fn ($row) => $row['name'], SORT_NATURAL)
            ->values()
            ->all();
    }

    /**
     * One of the stores (saved sections, page compositions), each entry with whether
     * its screenshot still matches what is stored on it.
     */
    protected static function store(string $collection): array
    {
        $filesystem = static::filesystem();

        return static::entries($collection)
            ->map(fn ($entry) => [
                'name' => $entry->value('title') ?: $entry->id(),
                'status' => static::entryStatus($entry, $filesystem),
                'source' => $entry->value('synced') ? 'global' : null,
                'url' => optional($entry->augmentedValue('preview_image')->value())->url(),
                'edit_url' => $entry->editUrl(),
            ])
            ->sortBy(fn ($row) => $row['name'], SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();
    }

    /**
     * The saved sections and compositions whose picture no longer matches —
     * the Patterns panel's tick, which needs the answer and nothing else.
     *
     * @return list<string> entry titles (or ids)
     */
    public static function staleEntries(): array
    {
        $collections = array_filter([
            config('statamic-visual-editor.saved_sections.collection', 'saved_sections'),
            Stores::compositions(),
        ]);

        $filesystem = static::filesystem();

        return collect($collections)
            ->flatMap(fn ($collection) => static::entries($collection)->all())
            ->filter(fn ($entry) => in_array(static::entryStatus($entry, $filesystem), ['stale', 'missing'], true))
            ->map(fn ($entry) => (string) ($entry->value('title') ?: $entry->id()))
            ->values()
            ->all();
    }

    protected static function entries(string $collection)
    {
        return Entry::query()
            ->where('collection', $collection)
            ->where('site', Site::default()->handle())
            ->get();
    }

    /** The disk the preview images are on, or null when none is configured. */
    protected static function filesystem()
    {
        $config = Sets::previewImageConfig();

        return $config ? AssetContainer::find($config['container'])?->disk()->filesystem() : null;
    }

    /** Whether an entry's screenshot still matches what is stored on it. */
    protected static function entryStatus($entry, $filesystem): string
    {
        $sections = $entry->value(config('statamic-visual-editor.previews.field', 'page_sections'));
        $current = $entry->value('preview_image');
        $folder = (SavedSectionPreview::specFor($entry) ?? [])['folder'] ?? 'saved-sections';

        $expected = is_array($sections) && $sections !== []
            ? $folder.'/'.$entry->id().'-'.PreviewFingerprint::forSections($sections).'.png'
            : null;

        return match (true) {
            $expected === null => 'no_source',
            $current === $expected && $filesystem?->exists($current) => 'fresh',
            (bool) $current => 'stale',
            default => 'missing',
        };
    }
}
