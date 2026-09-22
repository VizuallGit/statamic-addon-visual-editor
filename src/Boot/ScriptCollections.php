<?php

namespace MarioHamann\StatamicVisualEditor\Boot;

use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Stores;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;
use Statamic\Facades\User;
use Statamic\Statamic;

/**
 * What the Control Panel's script is told about collections and global sets:
 * the picker's collections, the ones that open in the preview, the global
 * sets this user may edit, the saved sections' names. Split out of
 * Boot\ControlPanelScript in WP7c, verbatim.
 */
final class ScriptCollections
{
    /**
     * The collections offered in the preview's collection picker.
     *
     * All of them, not only the previewable ones: jumping straight to "new blog
     * post" is worth having even where there's no page to show. `previewable`
     * says which can actually open in Live Preview — that needs a route, and an
     * entry without one has no page to render. The flag is computed, not
     * configured, so a collection starts previewing itself the day it's given a
     * route. Permission-filtered: the picker offers what you may edit.
     */
    public static function pickerCollections(): array
    {
        if (! $user = User::current()) {
            return [];
        }

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        return Collection::all()
            ->filter(fn ($collection) => $user->can('edit', $collection))
            // The editor's own stores are not somewhere you navigate to. They hold
            // fragments — a section, a stack of sections — and neither can ever be
            // previewed as a page, so they would only ever sit in this list greyed
            // out as "no preview". You reach them from the sections panel, which is
            // where they mean something.
            ->reject(fn ($collection) => in_array($collection->handle(), Stores::all(), true))
            ->map(fn ($collection) => [
                'handle' => $collection->handle(),
                'title' => $collection->title(),
                'previewable' => (bool) $collection->route($site),
                'createUrl' => $collection->createEntryUrl($site),
            ])
            ->sortBy('title', SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();
    }

    /**
     * The collections a click lands in the preview rather than the form.
     *
     * Filtered down to the ones that can actually be previewed. A collection
     * without a route has no page to render, so Statamic draws no Live Preview
     * button — an entry there would sit behind the cover waiting for something
     * that is never coming. Named or not, those open the ordinary editor.
     *
     * @return array<int, string>
     */
    public static function openInPreviewCollections(): array
    {
        if (! Features::enabled('open_in_preview')) {
            return [];
        }

        $chosen = Features::setting('open_in_preview_collections', []);

        if (! is_array($chosen) || $chosen === []) {
            return [];
        }

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        return collect($chosen)
            ->filter(fn ($handle) => (bool) Collection::findByHandle($handle)?->route($site))
            ->values()
            ->all();
    }

    public static function globalSets(): array
    {
        if (! $user = User::current()) {
            return [];
        }

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        return GlobalSet::all()
            ->filter(fn ($set) => $user->can('edit', $set))
            ->map(function ($set) use ($site) {
                $variables = $set->in($site) ?? $set->in(Site::default()->handle());

                return $variables ? [
                    'handle' => $set->handle(),
                    'title' => $set->title(),
                    'url' => $variables->editUrl(),
                    // How many fields the set's blueprint has: none means the
                    // preview's bar for it has nothing to save and stays away.
                    'fields' => static::fieldCount($set),
                ] : null;
            })
            ->filter()
            ->values()
            ->all();
    }

    private static function fieldCount($set): ?int
    {
        try {
            return $set->blueprint()->fields()->all()->count();
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * What each saved (global) section calls itself, keyed by entry id.
     *
     * A page holds only a reference. The block tree names the row by the source's
     * section type ("Hero style 5") rather than by the reference set ("Global
     * section"), and this map is how it looks that up without a round-trip.
     *
     * @return array<string, array{title: string, section_type: string}>
     */
    public static function savedSectionLabels(): array
    {
        $handle = config('statamic-visual-editor.saved_sections.collection', 'saved_sections');

        if (! Collection::findByHandle($handle)) {
            return [];
        }

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        try {
            return Entry::query()
                ->where('collection', $handle)
                ->where('site', $site)
                ->get()
                ->mapWithKeys(fn ($entry) => [
                    $entry->id() => [
                        'title' => (string) ($entry->value('title') ?? ''),
                        'section_type' => (string) ($entry->value('section_type') ?? ''),
                    ],
                ])
                ->all();
        } catch (\Throwable) {
            return [];
        }
    }
}
