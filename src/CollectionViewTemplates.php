<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\File;
use Statamic\Contracts\Entries\Collection as CollectionContract;
use Statamic\Contracts\Entries\Entry as EntryContract;
use Statamic\Facades\Blink;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;

/**
 * CP rows for a collection's index/show views — not public pages.
 *
 * Scaffold Views writes the Antlers files. This makes the matching entries in
 * the templates store so Live Preview has something to open.
 */
class CollectionViewTemplates
{
    /**
     * After Statamic's own Scaffold Views POST. Idempotent: two CollectionSaved
     * events fire when both boxes are ticked; Blink keeps this to one pass.
     */
    public static function fromScaffold(CollectionContract $collection, mixed $index, mixed $show): void
    {
        if (! Features::enabled('collection_templates')) {
            return;
        }

        if (Blink::get('sve-scaffold-collection-views')) {
            return;
        }

        Blink::put('sve-scaffold-collection-views', true);

        $handle = $collection->handle();

        if (in_array($handle, Stores::all(), true)) {
            return;
        }

        if ($path = static::normalizeView(is_string($index) ? $index : null)) {
            static::ensure($handle, 'index', $path, $collection->title());
        }

        if ($path = static::normalizeView(is_string($show) ? $show : null)) {
            static::ensure($handle, 'show', $path, $collection->title());
        }
    }

    public static function normalizeView(?string $path): ?string
    {
        if ($path === null) {
            return null;
        }

        $path = str_replace('\\', '/', trim($path));
        $path = preg_replace('/\.(antlers\.html|blade\.php)$/', '', $path) ?? $path;

        if ($path === '' || str_contains($path, '..') || str_starts_with($path, '/')) {
            return null;
        }

        $path = trim($path, '/');

        if (! preg_match('#^[A-Za-z0-9][A-Za-z0-9_/-]*$#', $path)) {
            return null;
        }

        return $path;
    }

    public static function ensure(string $sourceHandle, string $kind, string $view, string $sourceTitle): ?EntryContract
    {
        if (! in_array($kind, ['index', 'show'], true)) {
            return null;
        }

        $store = Stores::collectionTemplates();

        if (! Collection::findByHandle($store)) {
            return null;
        }

        $existing = Entry::query()
            ->where('collection', $store)
            ->where('source_collection', $sourceHandle)
            ->where('kind', $kind)
            ->first();

        if ($existing) {
            return $existing;
        }

        $site = Site::default()->handle();

        $entry = Entry::make()
            ->collection($store)
            ->locale($site)
            ->published(true)
            ->slug($sourceHandle.'-'.$kind)
            ->data([
                'title' => $sourceTitle.' '.$kind,
                'kind' => $kind,
                'source_collection' => $sourceHandle,
                'view' => $view,
            ]);

        $entry->save();

        return $entry;
    }

    /**
     * Scaffold Views (and presets) leave files behind. Statamic does not.
     *
     * The collection yaml is already gone. This removes the view folder, the
     * blueprint folder, and the Templates rows that pointed at them.
     */
    public static function forget(CollectionContract|string $collection): void
    {
        $handle = is_string($collection) ? $collection : $collection->handle();

        if (! static::purgeableHandle($handle)) {
            return;
        }

        static::forgetTemplateEntries($handle);
        static::deleteTree(resource_path('views/'.$handle), resource_path('views'));
        static::deleteTree(
            resource_path('blueprints/collections/'.$handle),
            resource_path('blueprints/collections')
        );
    }

    public static function purgeableHandle(?string $handle): bool
    {
        if (! is_string($handle) || $handle === '') {
            return false;
        }

        if (in_array($handle, Stores::all(), true)) {
            return false;
        }

        if (in_array($handle, ['pages', 'errors', 'partials', 'vendor', 'layout', 'components', 'widgets'], true)) {
            return false;
        }

        return (bool) preg_match('/^[a-z0-9][a-z0-9_-]*$/', $handle);
    }

    public static function sourceMatches(mixed $value, string $handle): bool
    {
        if (is_array($value)) {
            $value = $value[0] ?? null;
        }

        return is_string($value) && $value === $handle;
    }

    protected static function forgetTemplateEntries(string $handle): void
    {
        $store = Stores::collectionTemplates();

        if (! Collection::findByHandle($store)) {
            return;
        }

        foreach (Entry::query()->where('collection', $store)->get() as $entry) {
            if (static::belongsToSource($entry, $handle)) {
                $entry->delete();
            }
        }
    }

    public static function belongsToSource(EntryContract $entry, string $handle): bool
    {
        if (static::sourceMatches($entry->get('source_collection'), $handle)) {
            return true;
        }

        $view = $entry->get('view');

        if (is_string($view) && ($view === $handle || str_starts_with($view, $handle.'/'))) {
            return true;
        }

        $slug = (string) $entry->slug();

        return (bool) preg_match(
            '/^'.preg_quote($handle, '/').'-(index|show)([.-].*)?$/',
            $slug
        );
    }

    protected static function deleteTree(string $dir, string $root): void
    {
        $rootReal = realpath($root);

        if (! $rootReal || ! is_dir($dir)) {
            return;
        }

        $dirReal = realpath($dir);

        if (! $dirReal || $dirReal === $rootReal || ! str_starts_with($dirReal, $rootReal.DIRECTORY_SEPARATOR)) {
            return;
        }

        File::deleteDirectory($dirReal);
    }
}
