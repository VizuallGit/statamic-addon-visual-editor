<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\OwnPage;
use Statamic\Facades\Entry;
use Statamic\Facades\User;

/**
 * "Give this page its own blueprint and template" (OwnPage), from the top
 * bar's Blueprint drawer. Gated on `configure fields`, like the drawer.
 */
class OwnPageController
{
    public function store(Request $request)
    {
        abort_unless(User::current()?->can('configure fields'), 403);

        $id = (string) $request->input('id', '');
        $entry = $id !== '' ? Entry::find($id) : null;

        abort_unless($entry, 404);
        // The page itself is changed (its blueprint and template): editing it is the editor's right, not only fields'.
        abort_unless(User::current()->can('edit', $entry), 403);

        $made = OwnPage::make($entry);

        return $made === null
            ? response()->json(['error' => 'not_possible'], 422)
            : response()->json(['ok' => true] + $made);
    }
}
