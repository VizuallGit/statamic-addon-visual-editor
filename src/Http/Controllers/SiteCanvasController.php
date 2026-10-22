<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Facades\Statamic\CP\LivePreview;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Collection as LaravelCollection;
use MarioHamann\StatamicVisualEditor\CollectionViewTemplates;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SiteCanvasArrangement;
use MarioHamann\StatamicVisualEditor\Stores;
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
 * side, each a stack of frames. Templates are the rows of the templates
 * store, grouped under the collection they draw (index and show for
 * Services, say), one template a column; the site's own views (the layout,
 * the default page) stand in a row of their own. Pages are the entries of
 * the previews collection — the site's pages — in one row whose columns are
 * the editors' own arrangement (SiteCanvasArrangement) over the order of the
 * tree: that group is marked `arrange`, and the canvas posts its columns
 * back here as a page is dragged. A concrete service entry is in neither
 * group.
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
     * The templates store, one row per source collection and one for the
     * site's own views, each template a column of its own. Only templates
     * whose view file exists: the preview route 404s for any other. Nothing
     * without the templates feature — the preview route is gone with it.
     *
     * @return list<array{key: string, title: string, columns: list<list<array<string, mixed>>>}>
     */
    protected function templateRows(string $site, string $locale): array
    {
        if (! Features::enabled('collection_templates')) {
            return [];
        }

        $rows = [];

        $entries = Entry::query()
            ->where('collection', Stores::collectionTemplates())
            ->where('site', $site)
            ->get();

        foreach ($entries as $entry) {
            $view = CollectionViewTemplates::normalizeView((string) $entry->value('view'));

            if (! $view || ! CollectionViewPreviewController::viewExists($view)) {
                continue;
            }

            $kind = (string) $entry->value('kind');
            $collection = in_array($kind, ['index', 'show'], true)
                ? Collection::findByHandle($this->scalar($entry->value('source_collection')))
                : null;
            $key = $collection?->handle() ?? 'site';

            $rows[$key] ??= [
                'key' => $key,
                'title' => $collection?->title() ?? trans('sve::messages.site_canvas_site', [], $locale),
                'frames' => [],
            ];

            if ($frame = $this->frame($entry)) {
                $rows[$key]['frames'][] = $frame + ['kind' => $kind];
            }
        }

        $order = ['layout' => 0, 'index' => 1, 'show' => 2, 'page' => 3];

        foreach ($rows as &$row) {
            usort($row['frames'], fn ($a, $b) => [$order[$a['kind']] ?? 9, $a['title']] <=> [$order[$b['kind']] ?? 9, $b['title']]);
            $row['columns'] = array_map(fn ($frame) => [$frame], $row['frames']);
            unset($row['frames']);
        }

        unset($row);

        // Collections by title; the site's own views last.
        uasort($rows, fn ($a, $b) => [$a['key'] === 'site', $a['title']] <=> [$b['key'] === 'site', $b['title']]);

        return array_values(array_filter($rows, fn ($row) => $row['columns'] !== []));
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
            ->map(fn (EntryContract $entry) => $this->frame($entry))
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
     * The pages collection's entries for `$site`: the order of its tree when
     * it has one, by title otherwise.
     *
     * @return LaravelCollection<int, EntryContract>
     */
    protected function pageEntries(string $site): LaravelCollection
    {
        $handle = (string) config('statamic-visual-editor.previews.collection', 'pages');
        $collection = Collection::findByHandle($handle);

        if (! $collection) {
            return collect();
        }

        $tree = $collection->structure()?->in($site);

        $entries = $tree
            ? $tree->flattenedPages()->map(fn ($page) => $page->entry())->filter()
            : Entry::query()->where('collection', $handle)->where('site', $site)->get()->sortBy(
                fn ($entry) => $entry->value('title') ?: $entry->slug(),
                SORT_NATURAL | SORT_FLAG_CASE
            );

        return collect($entries->values()->all());
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

    protected function scalar(mixed $value): string
    {
        if (is_array($value)) {
            $value = $value[0] ?? '';
        }

        return is_string($value) ? $value : '';
    }
}
