<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use Closure;
use MarioHamann\StatamicVisualEditor\Boot\ScriptCollections;
use Statamic\Facades\Collection;
use Statamic\Facades\Site;
use Statamic\Fieldtypes\Collections;

/**
 * The collections whose rows get "Open in Live Preview" (addon settings).
 *
 * Statamic's own collections picker under a handle of its own, so `collections`
 * everywhere else is untouched: same select, same values. The one difference
 * is a collection that cannot open in Live Preview — no URL, so no page to
 * show (ScriptCollections::previewable). It stays in the list, last, its title
 * saying why, and a save that names it is refused with the same reason.
 * Statamic's select has no per-option disabled state, so the title and the
 * rule are how it reads as not selectable.
 */
class PreviewCollectionsFieldtype extends Collections
{
    protected $selectable = false;

    protected static $handle = 'sve_preview_collections';

    public function getIndexItems($request)
    {
        [$open, $closed] = parent::getIndexItems($request)->partition(fn ($item) => static::opens($item['id']));

        return $open
            ->concat($closed->map(fn ($item) => [...$item, 'title' => static::closedTitle($item['title'])]))
            ->values();
    }

    protected function toItemArray($id, $site = null)
    {
        $item = parent::toItemArray($id, $site);

        if (($item['invalid'] ?? false) || static::opens($id)) {
            return $item;
        }

        return [...$item, 'title' => static::closedTitle($item['title'])];
    }

    public function rules(): array
    {
        return [
            ...parent::rules(),
            function (string $attribute, $value, Closure $fail) {
                foreach ((array) $value as $handle) {
                    $collection = is_string($handle) ? Collection::findByHandle($handle) : null;

                    if ($collection && ! static::opens($handle)) {
                        $fail(__('sve::messages.preview_collections_no_url', ['title' => $collection->title()]));
                    }
                }
            },
        ];
    }

    protected static function opens(string $handle): bool
    {
        $collection = Collection::findByHandle($handle);
        $site = Site::selected()?->handle() ?? Site::default()->handle();

        return $collection !== null && ScriptCollections::previewable($collection, $site);
    }

    protected static function closedTitle(string $title): string
    {
        return __('sve::messages.preview_collections_no_url_title', ['title' => $title]);
    }
}
