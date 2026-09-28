<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Taxonomy;

/**
 * Who is drawn with a template, and which template draws an entry.
 *
 * A template is shared: `default` renders every page, every collection that
 * names no template of its own, and every entry in them. Editing it is a
 * change to all of them, and the HTML tree says so above an open template
 * ("Bruges af: Pages, Employees, Test"). On a page that is not built from
 * sections it says which template the page is, and opens that template —
 * rather than letting the page edit a file it shares with others.
 *
 * Statamic's own rule decides the view: the entry's `template:`, else its
 * collection's, which is `default` when the collection names none
 * (`Collection::template()`). The board's slots decide how to open it
 * ({@see TemplateBoard}, `TemplateBoardController::store`).
 */
final class TemplateUsage
{
    /** How many single pages are named before the rest are counted. */
    public const NAMED_PAGES = 3;

    /**
     * @return array{view: string, name: string, everything: bool, used_by: list<string>, open: ?array{handle: string, slot: string}}
     */
    public static function of(string $view): array
    {
        $view = trim($view, '/');
        $layout = $view === TemplateBoard::SITE_SLOTS['layout'];

        return [
            'view' => $view,
            'name' => static::name($view),
            // The layout frames every page there is; listing them says less.
            'everything' => $layout,
            'used_by' => $layout ? [] : static::usedBy($view),
            'open' => static::slotFor($view),
        ];
    }

    /** The template an entry is drawn with, described as {@see of()} does. */
    public static function forEntry($entry): ?array
    {
        if (! $entry || ! method_exists($entry, 'template')) {
            return null;
        }

        $view = $entry->template();

        return is_string($view) && $view !== '' ? static::of($view) : null;
    }

    /**
     * The collections and taxonomies drawn with the view, then the single
     * pages that pick it themselves (a search page, a front page).
     *
     * @return list<string>
     */
    public static function usedBy(string $view): array
    {
        $stores = Stores::all();
        $names = [];

        foreach (Collection::all() as $collection) {
            if (! in_array($collection->handle(), $stores, true) && $collection->template() === $view) {
                $names[] = (string) $collection->title();
            }
        }

        foreach (Taxonomy::all() as $taxonomy) {
            if ($taxonomy->template() === $view || $taxonomy->termTemplate() === $view) {
                $names[] = (string) $taxonomy->title();
            }
        }

        $pages = [];

        foreach (Entry::all() as $entry) {
            $own = $entry->get('template');

            if ($own === $view && ! in_array($entry->collectionHandle(), $stores, true)) {
                $pages[] = (string) ($entry->value('title') ?: $entry->slug());
            }
        }

        $names = array_merge($names, array_slice($pages, 0, static::NAMED_PAGES));
        $more = count($pages) - static::NAMED_PAGES;

        if ($more > 0) {
            $names[] = trans_choice('sve::messages.template_usage_more_pages', $more, ['count' => $more]);
        }

        return $names;
    }

    /**
     * The board slot that opens the view — the one `TemplateBoardController::store`
     * makes a CP row for and answers with its edit URL. The site's own views
     * first (`default` is the Default page card, not some collection's), then
     * a collection's or taxonomy's index or show by the board's naming. A view
     * the board draws no card for gets no slot: it is named, not opened.
     *
     * @return array{handle: string, slot: string}|null
     */
    public static function slotFor(string $view): ?array
    {
        foreach (TemplateBoard::SITE_SLOTS as $slot => $siteView) {
            if ($siteView === $view) {
                return ['handle' => '_site', 'slot' => $slot];
            }
        }

        $sources = array_merge(
            Collection::handles()->all(),
            Taxonomy::handles()->all(),
        );

        foreach ($sources as $handle) {
            foreach (TemplateBoard::SOURCE_SLOTS as $slot) {
                if (TemplateBoard::viewPath($handle, $slot) === $view) {
                    return ['handle' => $handle, 'slot' => $slot];
                }
            }
        }

        return null;
    }

    /** What the board calls the view's card: "Standardside", "Services · Show". */
    public static function name(string $view): string
    {
        $slot = static::slotFor($view);

        if ($slot === null) {
            return $view;
        }

        $label = __('sve::messages.template_board_slot_'.$slot['slot']);

        if ($slot['handle'] === '_site') {
            return $label;
        }

        $source = Collection::findByHandle($slot['handle']) ?: Taxonomy::findByHandle($slot['handle']);

        return ($source ? $source->title() : $slot['handle']).' · '.$label;
    }
}
