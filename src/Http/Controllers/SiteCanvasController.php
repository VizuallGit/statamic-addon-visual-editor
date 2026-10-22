<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Facades\Statamic\CP\LivePreview;
use Illuminate\Routing\Controller;
use MarioHamann\StatamicVisualEditor\CollectionViewTemplates;
use MarioHamann\StatamicVisualEditor\Features;
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
 * Templates are the rows of the templates store, grouped under the collection
 * they draw (index and show for Services, say); the site's own views (the
 * layout, the default page) stand in a row of their own. Pages are the entries
 * of the previews collection — the site's pages — in the order of their tree.
 * A concrete service entry is in neither group.
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
    public function __invoke()
    {
        $user = User::current();

        abort_unless($user, 403);
        abort_unless(Features::allows('site_canvas'), 404);

        $locale = $user->preferredLocale() ?? config('app.locale');
        $site = Site::selected()?->handle() ?? Site::default()->handle();
        $groups = [];

        if ($rows = $this->templateRows($site, $locale)) {
            $groups[] = ['key' => 'templates', 'title' => trans('sve::messages.site_canvas_templates', [], $locale), 'rows' => $rows];
        }

        if ($rows = $this->pageRows($site)) {
            $groups[] = ['key' => 'pages', 'title' => trans('sve::messages.site_canvas_pages', [], $locale), 'rows' => $rows];
        }

        return response()->json(['groups' => $groups]);
    }

    /**
     * The templates store, one row per source collection and one for the
     * site's own views. Only templates whose view file exists: the preview
     * route 404s for any other. Nothing without the templates feature — the
     * preview route is gone with it.
     *
     * @return list<array{key: string, title: string, frames: list<array<string, mixed>>}>
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
        }

        unset($row);

        // Collections by title; the site's own views last.
        uasort($rows, fn ($a, $b) => [$a['key'] === 'site', $a['title']] <=> [$b['key'] === 'site', $b['title']]);

        return array_values(array_filter($rows, fn ($row) => $row['frames'] !== []));
    }

    /**
     * The site's pages, in one row: the order of the collection's tree when it
     * has one, by title otherwise.
     *
     * @return list<array{key: string, title: string, frames: list<array<string, mixed>>}>
     */
    protected function pageRows(string $site): array
    {
        $handle = (string) config('statamic-visual-editor.previews.collection', 'pages');
        $collection = Collection::findByHandle($handle);

        if (! $collection) {
            return [];
        }

        $tree = $collection->structure()?->in($site);

        $entries = $tree
            ? $tree->flattenedPages()->map(fn ($page) => $page->entry())->filter()
            : Entry::query()->where('collection', $handle)->where('site', $site)->get()->sortBy(
                fn ($entry) => $entry->value('title') ?: $entry->slug(),
                SORT_NATURAL | SORT_FLAG_CASE
            );

        $frames = $entries
            ->map(fn ($entry) => $this->frame($entry))
            ->filter()
            ->values()
            ->all();

        if ($frames === []) {
            return [];
        }

        return [['key' => $handle, 'title' => $collection->title(), 'frames' => $frames]];
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
