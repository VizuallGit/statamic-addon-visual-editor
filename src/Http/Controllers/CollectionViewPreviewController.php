<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use MarioHamann\StatamicVisualEditor\CollectionViewSample;
use MarioHamann\StatamicVisualEditor\CollectionViewTemplates;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Stores;
use Statamic\Contracts\Entries\Entry as EntryContract;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Statamic\Facades\User;
use Statamic\View\View;
use Symfony\Component\HttpFoundation\Response;

/**
 * Live Preview target for a collection index/show template.
 *
 * The template entry has no public URL. This route is gated on a CP user, same
 * as global-section preview. The view file is rendered with a real entry, or
 * with sample blueprint values when the collection is still empty.
 */
class CollectionViewPreviewController extends Controller
{
    public function __invoke(Request $request, string $id): Response
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::enabled('collection_templates'), 404);

        $template = Entry::find($id);
        $store = Stores::collectionTemplates();

        abort_unless($template && $template->collectionHandle() === $store, 404);

        $kind = (string) static::raw($template, 'kind');
        $sourceHandle = static::scalar(static::raw($template, 'source_collection'));
        $view = CollectionViewTemplates::normalizeView((string) static::raw($template, 'view'));

        abort_unless($view && in_array($kind, ['index', 'show'], true), 404);
        abort_unless(static::viewExists($view), 404);

        $source = Collection::findByHandle($sourceHandle);

        abort_unless($source, 404);

        $layout = $source->layout() ?: config('statamic.system.layout', 'layout');

        if ($kind === 'index') {
            $html = app(View::class)
                ->template($view)
                ->layout($layout)
                ->render();

            if (static::entryCount($sourceHandle) === 0) {
                $html = static::withEmptyNotice($html);
            }

            return static::previewResponse($html);
        }

        $host = static::host($template, $source);

        $host->template($view);
        $host->layout($layout);

        return static::previewResponse(
            app(View::class)
                ->template($view)
                ->layout($layout)
                ->cascadeContent($host)
                ->render()
        );
    }

    protected static function previewResponse(string $html): Response
    {
        return response($html, 200, [
            'Cache-Control' => 'no-store, no-cache, must-revalidate',
        ]);
    }

    public static function viewExists(string $view): bool
    {
        $full = resource_path('views/'.$view.'.antlers.html');
        $base = realpath(resource_path('views'));

        if (! is_file($full) || ! is_string($base)) {
            return false;
        }

        $real = realpath($full);

        return is_string($real) && str_starts_with($real, $base.DIRECTORY_SEPARATOR);
    }

    protected static function host(EntryContract $template, $source): EntryContract
    {
        $picked = static::raw($template, 'preview_as');
        $id = is_array($picked) ? ($picked[0] ?? null) : $picked;

        if (is_string($id) && $id !== '') {
            $entry = Entry::find($id);

            if ($entry && $entry->collectionHandle() === $source->handle()) {
                return $entry;
            }
        }

        $first = Entry::query()
            ->where('collection', $source->handle())
            ->where('site', Site::selected()?->handle() ?? Site::default()->handle())
            ->first();

        return $first ?: CollectionViewSample::entry($source);
    }

    protected static function entryCount(string $handle): int
    {
        $site = Site::selected()?->handle() ?? Site::default()->handle();

        return (int) Entry::query()
            ->where('collection', $handle)
            ->where('site', $site)
            ->count();
    }

    protected static function withEmptyNotice(string $html): string
    {
        $notice = '<div style="padding:.75rem 1rem;background:#1e3a5f;color:#fff;font:14px/1.4 system-ui,sans-serif">No entries yet. This is the empty list — add one to preview real cards, or keep designing this state.</div>';

        if (str_contains($html, '<body')) {
            return preg_replace('/<body([^>]*)>/i', '<body$1>'.$notice, $html, 1) ?? $html;
        }

        return $notice.$html;
    }

    protected static function scalar(mixed $value): string
    {
        if (is_array($value)) {
            $value = $value[0] ?? '';
        }

        return is_string($value) ? $value : '';
    }

    /**
     * Plain `get()` only ever sees saved data. Live Preview's unsaved edits
     * arrive as a supplement (Statamic\Tokens\Handlers\LivePreview calls
     * `setSupplement()`, never `set()`), which only the augmented accessor
     * checks — see Statamic\Data\AbstractAugmented::getFromData(). Reading
     * this template entry with `get()` is why the picker never changed what
     * rendered: it was always the saved value, live edits or not.
     */
    protected static function raw(EntryContract $entry, string $handle): mixed
    {
        return $entry->augmentedValue($handle)->raw();
    }
}
