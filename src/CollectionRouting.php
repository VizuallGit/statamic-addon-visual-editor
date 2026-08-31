<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Contracts\Entries\Collection as CollectionContract;

/**
 * Defaults a new collection gets so Live Preview works without a trip through
 * Configure Collection. Designers can still change both afterwards.
 *
 * Route is `/{handle}/{slug}` — unique per collection, no mount or tree needed.
 * Preview Refresh is off: Visual Editor morphs the iframe; Statamic's own
 * reload would eject the overlay.
 */
class CollectionRouting
{
    public static function defaultRoute(string $handle): string
    {
        return '/'.$handle.'/{slug}';
    }

    /**
     * @return list<array{label: string, format: string, refresh: bool}>
     */
    public static function defaultPreviewTargets(): array
    {
        return [
            [
                'label' => 'Entry',
                'format' => '{permalink}',
                'refresh' => false,
            ],
        ];
    }

    public static function applies(CollectionContract $collection): bool
    {
        return ! in_array($collection->handle(), Stores::all(), true);
    }

    public static function hasRoute(CollectionContract $collection): bool
    {
        return $collection->routes()->filter()->isNotEmpty();
    }

    public static function seed(CollectionContract $collection): void
    {
        if (! static::applies($collection)) {
            return;
        }

        if (! static::hasRoute($collection)) {
            $collection->routes(static::defaultRoute($collection->handle()));
        }

        $collection->previewTargets(static::defaultPreviewTargets());
    }
}
