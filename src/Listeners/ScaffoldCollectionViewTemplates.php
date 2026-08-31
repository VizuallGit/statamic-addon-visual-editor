<?php

namespace MarioHamann\StatamicVisualEditor\Listeners;

use MarioHamann\StatamicVisualEditor\CollectionViewTemplates;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Events\CollectionSaved;

/**
 * Scaffold Views already wrote the files. This only adds the CP rows.
 *
 * Statamic's Scaffold page is untouched — we listen after its save.
 */
class ScaffoldCollectionViewTemplates
{
    public function handle(CollectionSaved $event): void
    {
        if (! Features::enabled('collection_templates')) {
            return;
        }

        $request = request();

        if (! $request->routeIs('statamic.cp.collections.scaffold.create')) {
            return;
        }

        CollectionViewTemplates::fromScaffold(
            $event->collection,
            $request->get('index'),
            $request->get('show'),
        );
    }
}
