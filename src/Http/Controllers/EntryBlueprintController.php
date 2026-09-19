<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Stores;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\User;

/**
 * The blueprint behind the page open in Live Preview — where its fields are.
 *
 * A section's fields live in a fieldset the section imports; a template's
 * fields (`services/show`, say) live on the collection's blueprint. The editor
 * opens the first from the section's row and the second from the top bar, and
 * this is what tells it which blueprint that is: the entry decides, not the
 * collection, since a collection can have several.
 *
 * Gated on `configure fields`, like the Blueprints screen it opens.
 */
class EntryBlueprintController
{
    public function __invoke(Request $request)
    {
        abort_unless(User::current()?->can('configure fields'), 403);

        $id = (string) $request->query('id', '');
        $entry = $id !== '' ? Entry::find($id) : null;

        abort_unless($entry, 404);

        $collection = $entry->collection();
        $blueprint = $entry->blueprint();

        // A template entry stands for another collection's view — `services/show`
        // is the services collection's page — so the fields that matter are that
        // collection's, not the template store's own. The view's first folder
        // names the collection, which is how the site lays its views out.
        if ($collection && $collection->handle() === Stores::collectionTemplates()) {
            $view = trim((string) $entry->get('view'), '/');
            $target = $view !== '' ? Collection::find(explode('/', $view)[0]) : null;

            if ($target) {
                $collection = $target;
                $blueprint = $target->entryBlueprints()->first() ?? $blueprint;
            }
        }

        abort_unless($collection && $blueprint, 404);

        return response()->json([
            'collection' => $collection->handle(),
            'handle' => $blueprint->handle(),
            'title' => $blueprint->title(),
            'url' => cp_route('blueprints.collections.edit', [
                'collection' => $collection->handle(),
                'blueprint' => $blueprint->handle(),
            ]),
        ]);
    }
}
