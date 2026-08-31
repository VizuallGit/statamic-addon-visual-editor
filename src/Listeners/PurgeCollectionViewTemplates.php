<?php

namespace MarioHamann\StatamicVisualEditor\Listeners;

use MarioHamann\StatamicVisualEditor\CollectionViewTemplates;
use Statamic\Events\CollectionDeleted;

/**
 * Statamic deletes the collection. Scaffold Views files stay. This removes them.
 */
class PurgeCollectionViewTemplates
{
    public function handle(CollectionDeleted $event): void
    {
        CollectionViewTemplates::forget($event->collection);
    }
}
