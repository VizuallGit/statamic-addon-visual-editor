<?php

namespace MarioHamann\StatamicVisualEditor\Boot;

use MarioHamann\StatamicVisualEditor\CollectionTemplateEntry;
use MarioHamann\StatamicVisualEditor\Stores;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\Collection;
use Statamic\Facades\CP\Nav;
use Statamic\Statamic;

/**
 * The editor's own collections (saved sections, compositions, templates):
 * where they sit in the Control Panel nav, and how a template previews without
 * a public route.
 *
 * Moved out of ServiceProvider::bootAddon() verbatim in WP7a.
 */
final class StoreCollections
{
    public static function register(): void
    {
        static::moveStoresOutOfCollections();

        // After the Stache has read collections from yaml — setting entryClass
        // earlier is wiped when the file is loaded.
        Statamic::booted(fn () => static::attachCollectionViewPreviewTargets());
    }

    protected static function moveStoresOutOfCollections(): void
    {
        $stores = Stores::all();
        $navHandles = Stores::nav();

        Nav::extend(function ($nav) use ($stores, $navHandles) {
            $collections = collect($stores)
                ->map(fn ($handle) => Collection::findByHandle($handle))
                ->filter(); // whatever is not installed on this site is nothing to move

            if ($collections->isEmpty()) {
                return;
            }

            /*
             * Statamic's own Nav::remove() matches a child by its display name, and
             * two collections are free to share a title — renaming a store to
             * something the site already uses would pull the site's own collection
             * out of the list along with it. The show URL carries the handle, so it
             * can only ever match the one store.
             */
            $urls = $collections->map->showUrl()->all();

            if ($parent = $nav->find('Content', 'Collections')) {
                if ($children = $parent->resolveChildren()->children()) {
                    $parent->children($children->reject(fn ($child) => in_array($child->url(), $urls, true)));
                }
            }

            $collections
                ->filter(fn ($collection) => in_array($collection->handle(), $navHandles, true))
                ->each(function ($collection) use ($nav) {
                    $nav->content($collection->title())
                        ->url($collection->showUrl())
                        ->icon($collection->icon() ?: 'content-writing')
                        ->can('view', $collection);
                });
        });
    }

    /**
     * Live Preview without a public route.
     *
     * Statamic hides the button unless `livePreviewUrl()` is set, and that
     * method returns null when the collection has no route. The custom entry
     * class returns the CP preview endpoint anyway. Preview targets replace
     * the default `{permalink}` (which would be empty) so the iframe loads
     * `/!/sve/collection-view-preview/{id}`.
     */
    protected static function attachCollectionViewPreviewTargets(): void
    {
        if (! Features::enabled('collection_templates')) {
            return;
        }

        $handle = Stores::collectionTemplates();
        $collection = Collection::findByHandle($handle);

        if (! $collection) {
            return;
        }

        $collection->entryClass(CollectionTemplateEntry::class);

        $collection->previewTargets([
            [
                'label' => 'Template',
                'format' => '/!/sve/collection-view-preview/{id}',
                'refresh' => true,
            ],
        ]);
    }
}
