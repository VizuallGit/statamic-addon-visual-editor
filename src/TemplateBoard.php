<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Taxonomy;

/**
 * The Templates board: one row per collection and per taxonomy, plus the site's
 * own row for the frame and the pages that belong to no collection.
 *
 * **The files are the truth.** A card exists because the view file exists — not
 * because somebody made a row for it. That is what lets Statamic's own Scaffold
 * Views show up here without being told: it writes `{handle}/index.antlers.html`,
 * and the next time the board is asked, the card is filled.
 *
 * The entries in the templates collection are CP handles, nothing more. They
 * give Live Preview something to open (a view file is not an entry and cannot
 * be previewed on its own), and they are made on demand. An entry whose file
 * has since gone is reported as broken rather than hidden: the row is the only
 * place anyone would find out.
 *
 * A collection has exactly one index and one show. `CollectionViewTemplates::ensure`
 * enforces that on the entry side; the two fixed slots here are the same rule
 * drawn on screen.
 */
final class TemplateBoard
{
    /**
     * The site row, in reading order: the frame first, then the pages that are
     * not any collection's.
     *
     * `layout` is the wrapper every page renders inside — Statamic's own name
     * for the file, and the thing other builders confusingly call "index".
     */
    public const SITE_SLOTS = [
        'layout' => 'layout',
        'home' => 'home',
        'default' => 'default',
        'error' => 'errors/404',
        'search' => 'search',
    ];

    /** The two a collection or taxonomy can have. Statamic's own words. */
    public const SOURCE_SLOTS = ['index', 'show'];

    /** What Statamic will render a view from, in the order it looks. */
    public const EXTENSIONS = ['antlers.html', 'blade.php'];

    /**
     * @return array{rows: list<array>}
     */
    public static function rows(): array
    {
        return [
            'rows' => array_values(array_filter(array_merge(
                [static::siteRow()],
                static::sourceRows(),
            ))),
        ];
    }

    /**
     * The frame and the loose pages. Always present, even with every slot
     * empty: it is where Layout lives, and Layout is the one file every site
     * has.
     */
    public static function siteRow(): array
    {
        $cards = [];

        foreach (static::SITE_SLOTS as $slot => $view) {
            $cards[] = static::card($slot, $view, null);
        }

        return [
            'handle' => '_site',
            'title' => __('sve::messages.template_board_site'),
            'kind' => 'site',
            'cards' => $cards,
        ];
    }

    /**
     * One row per collection and per taxonomy the site actually has.
     *
     * The editor's own collections are libraries, not pages, so they get no
     * row — `saved_sections` has no index to write.
     *
     * @return list<array>
     */
    public static function sourceRows(): array
    {
        $stores = Stores::all();
        $rows = [];

        foreach (Collection::all() as $collection) {
            if (in_array($collection->handle(), $stores, true)) {
                continue;
            }

            $rows[] = static::sourceRow($collection->handle(), $collection->title(), 'collection');
        }

        foreach (Taxonomy::all() as $taxonomy) {
            $rows[] = static::sourceRow($taxonomy->handle(), $taxonomy->title(), 'taxonomy');
        }

        return $rows;
    }

    public static function sourceRow(string $handle, string $title, string $kind): array
    {
        $entries = static::entriesFor($handle);
        $cards = [];

        foreach (static::SOURCE_SLOTS as $slot) {
            $cards[] = static::card($slot, static::viewPath($handle, $slot), $entries[$slot] ?? null);
        }

        return [
            'handle' => $handle,
            'title' => $title,
            'kind' => $kind,
            'cards' => $cards,
        ];
    }

    /**
     * `cases` + `show` is `cases/show`. Pure, so the board and whatever creates
     * a file agree on where it goes without asking each other.
     */
    public static function viewPath(string $handle, string $slot): string
    {
        return $handle.'/'.$slot;
    }

    /**
     * One card: the slot, where its file would be, and whether it is there.
     *
     * `broken` is an entry pointing at a file that is gone — the one state that
     * needs saying out loud, because nothing else in the CP would mention it.
     */
    public static function card(string $slot, string $view, mixed $entry): array
    {
        $file = static::viewFile($view);
        $entryId = $entry?->id();

        return [
            'slot' => $slot,
            'view' => $view,
            'exists' => $file !== null,
            'file' => $file,
            'entry' => $entryId,
            // Where the card goes when it is clicked. A source's template opens
            // its CP row, which carries the Live Preview target; the site's own
            // views have no row, so the board sends those to the file editor.
            'edit' => $entryId !== null ? $entry->editUrl() : null,
            'broken' => $entryId !== null && $file === null,
        ];
    }

    /**
     * The view file on disk, relative to resources/views, or null.
     *
     * Both spellings, in the order Statamic resolves them, so a Blade template
     * is not reported missing.
     */
    public static function viewFile(string $view): ?string
    {
        if (! static::safeView($view)) {
            return null;
        }

        foreach (static::EXTENSIONS as $extension) {
            $relative = $view.'.'.$extension;

            if (is_file(resource_path('views/'.$relative))) {
                return $relative;
            }
        }

        return null;
    }

    /**
     * A view path the board is willing to touch: no traversal, no absolute
     * path, no leading slash. Same shape `CollectionViewTemplates` accepts.
     */
    public static function safeView(string $view): bool
    {
        if ($view === '' || str_contains($view, '..') || str_starts_with($view, '/')) {
            return false;
        }

        return (bool) preg_match('#^[A-Za-z0-9][A-Za-z0-9_/-]*$#', $view);
    }

    /**
     * The templates-collection entries for one source, by kind.
     *
     * One query per row rather than one per card: a site with twenty
     * collections would otherwise ask forty times to draw one screen.
     *
     * @return array<string, mixed>
     */
    public static function entriesFor(string $handle): array
    {
        $store = Stores::collectionTemplates();

        if (! Collection::findByHandle($store)) {
            return [];
        }

        $found = [];

        foreach (Entry::query()->where('collection', $store)->get() as $entry) {
            if (! CollectionViewTemplates::sourceMatches($entry->get('source_collection'), $handle)) {
                continue;
            }

            $kind = $entry->get('kind');

            if (is_string($kind) && $kind !== '' && ! isset($found[$kind])) {
                $found[$kind] = $entry;
            }
        }

        return $found;
    }
}
