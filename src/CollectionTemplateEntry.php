<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Entries\Entry;

/**
 * A collection index/show template. No public URL — Live Preview still has to
 * open, so this returns Statamic's preview endpoint even without a route.
 *
 * The iframe itself is `/!/sve/collection-view-preview/{id}` (preview target
 * attached when collection_templates is on).
 */
class CollectionTemplateEntry extends Entry
{
    public function livePreviewUrl()
    {
        if (! Features::enabled('collection_templates')) {
            return parent::livePreviewUrl();
        }

        return $this->cpUrl('collections.entries.preview.edit');
    }
}
