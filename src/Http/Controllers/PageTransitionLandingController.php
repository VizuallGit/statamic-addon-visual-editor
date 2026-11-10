<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\CollectionViewFile;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\Collection;

/**
 * Where an element in a list of entries lands: the template the collection's
 * own pages are drawn with (Build → Animation → Page transition → «Where it
 * lands»).
 *
 * Answers with the dock's file type for that template (`view:cases/show`);
 * the panel reads and writes the file through the dock's own
 * `/!/sve/section-template`, as any file the dock opens.
 */
class PageTransitionLandingController
{
    public function __invoke(Request $request)
    {
        abort_unless(Features::allows('template_dock'), 403);

        $handle = (string) $request->query('collection', '');
        $collection = $handle !== '' ? Collection::findByHandle($handle) : null;

        abort_unless($collection, 404);

        $view = $collection->template();
        $path = CollectionViewFile::path($view);

        return response()->json([
            'collection' => $collection->handle(),
            'title' => $collection->title(),
            'view' => $view,
            'type' => $path && is_file($path) ? CollectionViewFile::type($view) : null,
        ]);
    }
}
