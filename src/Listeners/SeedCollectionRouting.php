<?php

namespace MarioHamann\StatamicVisualEditor\Listeners;

use MarioHamann\StatamicVisualEditor\CollectionRouting;
use Statamic\Events\CollectionCreating;

/**
 * Statamic's Create Collection form only asks for a title. Route and preview
 * targets stay empty, so Live Preview never appears. Fill them in before the
 * first write — later Configure Collection saves are left alone.
 */
class SeedCollectionRouting
{
    public function handle(CollectionCreating $event): void
    {
        CollectionRouting::seed($event->collection);
    }
}
