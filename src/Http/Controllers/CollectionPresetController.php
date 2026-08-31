<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use MarioHamann\StatamicVisualEditor\CollectionPresets;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Contracts\Entries\Collection as CollectionContract;
use Statamic\Facades\Collection;
use Statamic\Facades\User;

/**
 * Applies a VS Code preset (blueprint + index/show) to a collection.
 *
 * The collection's handle is irrelevant — Work can take the Cases pack.
 */
class CollectionPresetController extends Controller
{
    public function __invoke(Request $request)
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::enabled('collection_templates'), 404);
        abort_unless(User::current()->can('store', CollectionContract::class), 403);

        $handle = (string) $request->input('collection', '');
        $preset = (string) $request->input('preset', '');

        $collection = Collection::findByHandle($handle);

        abort_unless($collection, 404);

        $copied = CollectionPresets::apply($collection, $preset);

        abort_unless(is_array($copied), 404);

        return response()->json([
            'ok' => true,
            'copied' => $copied,
            'redirect' => $collection->showUrl(),
        ]);
    }
}
