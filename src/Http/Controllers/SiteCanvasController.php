<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Facades\Statamic\CP\LivePreview;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Collection as LaravelCollection;
use MarioHamann\StatamicVisualEditor\CollectionViewTemplates;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SiteCanvasArrangement;
use MarioHamann\StatamicVisualEditor\TemplateBoard;
use MarioHamann\StatamicVisualEditor\TemplateUsage;
use Statamic\Contracts\Entries\Entry as EntryContract;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Statamic\Facades\URL;
use Statamic\Facades\User;
use Statamic\Support\Str;

/**
 * The site canvas's frames (resources/js/site-canvas.js): every template and
 * every page of the site, in two groups, each with the Live Preview URL it
 * opens with. The one source of the list — the canvas scrapes nothing from
 * the Control Panel.
 *
 * A group's rows are clusters on its line; a row's columns stand side by
 * side, each a stack of frames. Templates are the cards of the Templates
 * board (TemplateBoard: a card exists because its view file does), grouped
 * under the collection they draw (index and show for Services, say) for the
 * collections with a route on this site, one template a column; the site's
 * own views (the layout, the default page, the 404) stand in a row of their
 * own. Pages are the entries of the previews collection — the site's pages —
 * in one row whose columns are the editors' own arrangement
 * (SiteCanvasArrangement) over the order of the tree: that group is marked
 * `arrange`, and the canvas posts its columns back here as a page is
 * dragged. A concrete service entry is in neither group.
 *
 * Every frame carries a `note` saying where it stands in the site: on a page,
 * the template it is drawn with when that is one of its own; on a template,
 * the page it is drawn on (an index), the route it answers (a show), the
 * pages it draws (the default), the pages it frames (the layout). The same
 * file named the same way on both rows — a page and the index that draws it
 * are one address, seen from two sides.
 *
 * Each frame's preview URL is the one Statamic hands Live Preview for that
 * entry: its first preview target, with a Live Preview token minted the way
 * Statamic\Http\Controllers\CP\PreviewController mints it. Tokenised, a draft
 * renders and the editor's Live Preview middleware runs (no static cache, no
 * Vite client, the bridge left out by `sve_view`). The token holds the entry
 * as it is saved now, and lives for an hour, as Statamic's own does.
 */
class SiteCanvasController extends Controller
{
    /** @var array<string, LaravelCollection<int, EntryContract>> the pages of a site, read once a request */
    protected array $pages = [];

    public function index()
    {
        $user = User::current();

        abort_unless($user, 403);
        abort_unless(Features::allows('site_canvas'), 404);

        $locale = $user->preferredLocale() ?? config('app.locale');
        $site = $this->site();
        $groups = [];

        if ($rows = $this->templateRows($site, $locale)) {
            $groups[] = ['key' => 'templates', 'title' => trans('sve::messages.site_canvas_templates', [], $locale), 'arrange' => false, 'rows' => $rows];
        }

        if ($rows = $this->pageRows($site)) {
            $groups[] = ['key' => 'pages', 'title' => trans('sve::messages.site_canvas_pages', [], $locale), 'arrange' => true, 'rows' => $rows];
        }

        return response()->json(['groups' => $groups]);
    }

    /**
     * The pages' columns as an editor has just dragged them: laid over the
     * pages that exist, saved for the site, and answered as saved.
     */
    public function arrange(Request $request)
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('site_canvas'), 404);

        $data = $request->validate([
            'columns' => 'present|array|max:500',
            'columns.*' => 'array|max:500',
            'columns.*.*' => 'string|max:80',
        ]);

        $ids = $this->pageEntries($this->site())->map(fn (EntryContract $entry) => (string) $entry->id())->values()->all();

        return response()->json(['columns' => (new SiteCanvasArrangement)->save($this->site(), $data['columns'], $ids)]);
    }

    protected function site(): string
    {
        return Site::selected()?->handle() ?? Site::default()->handle();
    }

    /**
     * The templates as the Templates board draws them — the files are the
     * truth ({@see TemplateBoard}) — for the collections whose entries have
     * an address on this site, then the site's own views; one template a
     * column. A card is a frame when its file exists: the board's own rule,
     * so the two screens never disagree about what the site has.
     *
     * A card's CP row — the entry Live Preview opens — is made the first time
     * the canvas draws it, the same row the board makes when its card is
     * clicked (`TemplateBoardController::store`): idempotent, nothing written
     * over. Nothing without the templates feature — the preview route is
     * gone with it.
     *
     * Taxonomies wait: the templates store names its source in a collections
     * field, so a taxonomy's row cannot be made yet. The board lists them
     * without a door; the canvas draws nothing it cannot open.
     *
     * @return list<array{key: string, title: string, columns: list<list<array<string, mixed>>>}>
     */
    protected function templateRows(string $site, string $locale): array
    {
        if (! Features::enabled('collection_templates')) {
            return [];
        }

        $drawn = $this->pagesByView($site);
        $rows = [];

        foreach (TemplateBoard::sourceRows() as $row) {
            if ($row['kind'] !== 'collection') {
                continue;
            }

            $collection = Collection::findByHandle($row['handle']);

            if (! $collection || ! $this->hasAddress($collection, $site)) {
                continue;
            }

            $frames = [];

            foreach ($row['cards'] as $card) {
                if ($frame = $this->templateFrame($card, $row['handle'], $card['slot'], $collection->title(), $locale)) {
                    $frame['note'] = $this->sourceNote($card, $collection, $site, $drawn, $locale);
                    $frames[] = $frame;
                }
            }

            if ($frames !== []) {
                $rows[] = ['key' => $row['handle'], 'title' => $row['title'], 'columns' => array_map(fn ($frame) => [$frame], $frames)];
            }
        }

        usort($rows, fn ($a, $b) => strnatcasecmp($a['title'], $b['title']));

        $frames = [];

        foreach (TemplateBoard::siteRow()['cards'] as $card) {
            $kind = $card['slot'] === 'layout' ? 'layout' : 'page';

            if ($frame = $this->templateFrame($card, '_site', $kind, $card['slot'], $locale)) {
                $frame['note'] = $this->siteNote($card, $drawn, $locale);
                $frames[] = $frame;
            }
        }

        if ($frames !== []) {
            $rows[] = ['key' => 'site', 'title' => trans('sve::messages.site_canvas_site', [], $locale), 'columns' => array_map(fn ($frame) => [$frame], $frames)];
        }

        return $rows;
    }

    /**
     * A board card as a frame: its CP row made if it has none, titled as the
     * board titles the card ("Index", "Default page"). Null for a card with
     * no file — there is nothing to draw — or no row.
     *
     * `$handle`, `$kind` and `$title` are what the board's own store sends
     * `CollectionViewTemplates::ensure` for this card, so the row found or
     * made here is the row a click on the board would open.
     */
    protected function templateFrame(array $card, string $handle, string $kind, string $title, string $locale): ?array
    {
        if (! $card['exists']) {
            return null;
        }

        $entry = CollectionViewTemplates::ensure($handle, $kind, $card['view'], $title);
        $frame = $entry ? $this->frame($entry) : null;

        if (! $frame) {
            return null;
        }

        $frame['title'] = trans('sve::messages.template_board_slot_'.$card['slot'], [], $locale);
        $frame['slot'] = $card['slot'];
        $frame['view'] = $card['view'];

        return $frame;
    }

    /**
     * Where a collection's template is drawn: an index on the page whose
     * `template:` names it (Statamic's way to give an index an address — the
     * mount), a show at the collection's route, said to be shared when the
     * file is another collection's.
     */
    protected function sourceNote(array $card, $collection, string $site, array $drawn, string $locale): string
    {
        if ($card['slot'] === 'index') {
            return $this->drawnOn($card['view'], $drawn, $locale);
        }

        $parts = [];

        if (! empty($card['shared'])) {
            $parts[] = trans('sve::messages.template_board_shared_short', [], $locale);
        }

        $route = (string) $collection->route($site);

        if ($route !== '') {
            $parts[] = Str::ensureLeft($route, '/');
        }

        return implode(' · ', $parts);
    }

    /**
     * Where one of the site's own views is drawn: the layout around every
     * page, the default page on however many pages have no template of their
     * own, the frontpage and the search page on the page that names them.
     * The 404 is its own address.
     */
    protected function siteNote(array $card, array $drawn, string $locale): string
    {
        $count = count($drawn[$card['view']] ?? []);

        return match ($card['slot']) {
            'layout' => trans('sve::messages.site_canvas_note_layout', [], $locale),
            'default' => trans_choice('sve::messages.site_canvas_note_pages', $count, ['count' => $count], $locale),
            'error' => '',
            default => $this->drawnOn($card['view'], $drawn, $locale),
        };
    }

    /** "On Cases" — the page a view is drawn on, and how many more; or that no page draws it yet. */
    protected function drawnOn(string $view, array $drawn, string $locale): string
    {
        $pages = $drawn[$view] ?? [];

        if ($pages === []) {
            return trans('sve::messages.site_canvas_note_nowhere', [], $locale);
        }

        $title = (string) ($pages[0]->value('title') ?: $pages[0]->slug());

        return count($pages) === 1
            ? trans('sve::messages.site_canvas_note_on', ['page' => $title], $locale)
            : trans('sve::messages.site_canvas_note_on_more', ['page' => $title, 'count' => count($pages) - 1], $locale);
    }

    /**
     * The pages by the view each is drawn with — Statamic's rule: the page's
     * own `template:`, else its collection's. One pass over the pages the
     * canvas draws; what the notes on both rows are read from.
     *
     * @return array<string, list<EntryContract>>
     */
    protected function pagesByView(string $site): array
    {
        $drawn = [];

        foreach ($this->pageEntries($site) as $entry) {
            $view = $entry->template();

            if (is_string($view) && $view !== '') {
                $drawn[$view][] = $entry;
            }
        }

        return $drawn;
    }

    /**
     * A collection whose entries have a URL on this site — a route. One with
     * none (a list drawn on some page, a store) has no template anyone could
     * look at, and gets no cluster.
     */
    protected function hasAddress($collection, string $site): bool
    {
        $route = $collection->route($site);

        return is_string($route) && trim($route) !== '';
    }

    /**
     * The site's pages, in one row whose columns are the saved arrangement
     * over the pages as they are: untouched, one page a column in the
     * collection's order.
     *
     * @return list<array{key: string, title: string, columns: list<list<array<string, mixed>>>}>
     */
    protected function pageRows(string $site): array
    {
        $handle = (string) config('statamic-visual-editor.previews.collection', 'pages');
        $collection = Collection::findByHandle($handle);

        if (! $collection) {
            return [];
        }

        $frames = $this->pageEntries($site)
            ->map(function (EntryContract $entry) {
                $frame = $this->frame($entry);

                return $frame ? $frame + ['note' => $this->pageNote($entry)] : null;
            })
            ->filter()
            ->keyBy('id');

        if ($frames->isEmpty()) {
            return [];
        }

        $columns = (new SiteCanvasArrangement)->columns($site, $frames->keys()->all());

        return [[
            'key' => $handle,
            'title' => $collection->title(),
            'columns' => array_map(fn (array $column) => array_map(fn (string $id) => $frames[$id], $column), $columns),
        ]];
    }

    /**
     * Which template draws the page, when it is one of its own — not the
     * default every page starts with. Named as the board names the card
     * ("Cases · Index", "Frontpage"), so the page and the template say the
     * same thing about each other.
     */
    protected function pageNote(EntryContract $entry): string
    {
        $view = $entry->template();

        return is_string($view) && $view !== '' && $view !== TemplateBoard::SITE_SLOTS['default']
            ? TemplateUsage::name($view)
            : '';
    }

    /**
     * The pages collection's entries for `$site`: the order of its tree when
     * it has one, by title otherwise. Read once a request — the notes and the
     * row both ask.
     *
     * @return LaravelCollection<int, EntryContract>
     */
    protected function pageEntries(string $site): LaravelCollection
    {
        if (isset($this->pages[$site])) {
            return $this->pages[$site];
        }

        $handle = (string) config('statamic-visual-editor.previews.collection', 'pages');
        $collection = Collection::findByHandle($handle);

        if (! $collection) {
            return $this->pages[$site] = collect();
        }

        $tree = $collection->structure()?->in($site);

        $entries = $tree
            ? $tree->flattenedPages()->map(fn ($page) => $page->entry())->filter()
            : Entry::query()->where('collection', $handle)->where('site', $site)->get()->sortBy(
                fn ($entry) => $entry->value('title') ?: $entry->slug(),
                SORT_NATURAL | SORT_FLAG_CASE
            );

        return $this->pages[$site] = collect($entries->values()->all());
    }

    /**
     * One frame: id, title, the Live Preview URL to show, the edit URL to go
     * to on a click. Null when the entry has no preview target to show.
     *
     * @return array{id: string, title: string, preview: string, edit: string}|null
     */
    protected function frame(EntryContract $entry): ?array
    {
        $preview = $this->previewUrl($entry);

        if ($preview === null) {
            return null;
        }

        return [
            'id' => (string) $entry->id(),
            'title' => (string) ($entry->value('title') ?: $entry->slug()),
            'preview' => $preview,
            'edit' => $entry->editUrl(),
        ];
    }

    /**
     * The URL Statamic's Live Preview opens this entry at: its first preview
     * target under a Live Preview token for the entry as saved — the same
     * three lines as PreviewController::getPreviewUrl(), with the saved values
     * where the Control Panel posts the form's.
     */
    protected function previewUrl(EntryContract $entry): ?string
    {
        $url = $entry->previewTargets()->first()['url'] ?? null;

        if (! is_string($url) || $url === '') {
            return null;
        }

        $entry->setSupplement('live_preview', true);

        $token = LivePreview::tokenize(null, $entry)->token();
        $url = URL::makeAbsolute($url);

        return $url.(str_contains($url, '?') ? '&' : '?').'live-preview='.Str::random().'&token='.$token;
    }
}
