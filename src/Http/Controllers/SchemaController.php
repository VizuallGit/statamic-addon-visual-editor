<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SchemaStore;

/**
 * Read and write the structured data for one page, and for the site.
 *
 * Nothing here touches an entry or a blueprint: the JSON lives in this site's
 * storage, and the only thing that reads it back is the middleware that writes
 * it into the rendered page.
 */
class SchemaController
{
    public function show(Request $request)
    {
        abort_unless(Features::allows('schema'), 403);

        $entry = (string) $request->query('entry', '');

        return response()->json([
            'ok' => true,
            'site' => SchemaStore::get(SchemaStore::SITE_KEY),
            'entry' => $entry !== '' ? SchemaStore::get($entry) : '',
        ]);
    }

    public function store(Request $request)
    {
        abort_unless(Features::allows('schema'), 403);

        $scope = $request->input('scope') === 'site' ? SchemaStore::SITE_KEY : (string) $request->input('entry', '');

        abort_if($scope === '', 422, __('sve::messages.schema_no_target'));

        $result = SchemaStore::validate((string) $request->input('json', ''));

        if (! $result['ok']) {
            return response()->json(['message' => $result['error']], 422);
        }

        SchemaStore::put($scope, $result['json']);

        return response()->json(['ok' => true, 'json' => $result['json']]);
    }
}
