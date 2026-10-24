<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Boot\ScriptCollections;
use Statamic\Facades\Collection;
use Statamic\Facades\Site;
use Statamic\Fields\Fieldtype;

/**
 * Which collections get the "Open in Live Preview" label on their rows.
 *
 * A dropdown like Statamic's collections field, drawn by its own component:
 * Statamic's cannot lock one option, and a collection without a URL has no page
 * to open — so it is listed last, at half opacity, and cannot be chosen.
 *
 * The list is the Live Preview picker's own (ScriptCollections::pickerCollections),
 * the editor's stores already left out. A collection without a URL is never read
 * as chosen and never written, so a hand-edited one cannot block a save.
 */
class PreviewCollectionsFieldtype extends Fieldtype
{
    protected $selectable = false;

    protected static $handle = 'sve_preview_collections';

    public function component(): string
    {
        return 'sve-preview-collections';
    }

    public function preload(): array
    {
        [$open, $closed] = collect(ScriptCollections::pickerCollections())
            ->map(fn ($collection) => [
                'handle' => $collection['handle'],
                'title' => $collection['previewable']
                    ? $collection['title']
                    : __('sve::messages.preview_collections_no_url_title', ['title' => $collection['title']]),
                'previewable' => $collection['previewable'],
            ])
            ->partition(fn ($collection) => $collection['previewable']);

        return ['collections' => $open->concat($closed)->values()->all()];
    }

    public function preProcess($data)
    {
        return $this->normalize($data);
    }

    public function process($data)
    {
        return $this->normalize($data);
    }

    /** @return list<string> */
    protected function normalize($data): array
    {
        $site = Site::selected()?->handle() ?? Site::default()->handle();

        return collect(is_array($data) ? $data : [])
            ->filter(fn ($handle) => is_string($handle) && $handle !== '')
            ->unique()
            ->filter(function ($handle) use ($site) {
                $collection = Collection::findByHandle($handle);

                return $collection && ScriptCollections::previewable($collection, $site);
            })
            ->values()
            ->all();
    }
}
