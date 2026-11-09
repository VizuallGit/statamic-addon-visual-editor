<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\SectionTypeMaker\AddField;
use MarioHamann\StatamicVisualEditor\TemplateFields;
use Statamic\Facades\Entry;
use Statamic\Facades\User;

/**
 * A template's elements made editable from Vizuall Build (TemplateFields):
 * which fields the view's entries have, and one field more.
 *
 * The view is the file the dock holds (`services/show`); the entry is the one
 * open in Live Preview — it decides whether the view is an own page's file or
 * a collection's template. Gated on `configure fields`, like a section's.
 */
class TemplateFieldsController
{
    /** Whether the view's elements can become fields here, and the fields its entries have. */
    public function index(Request $request)
    {
        abort_unless(User::current()?->can('configure fields'), 403);

        $blueprints = TemplateFields::blueprints((string) $request->query('view', ''), static::entry($request->query('id')));

        return response()->json([
            'can' => $blueprints !== [],
            'fields' => TemplateFields::fieldsOf($blueprints),
        ]);
    }

    /** An element's content as a field of the view's entries. */
    public function store(Request $request)
    {
        abort_unless(User::current()?->can('configure fields'), 403);

        $view = trim((string) $request->input('view', ''));
        $kind = (string) $request->input('kind', '');

        abort_if($view === '' || ! in_array($kind, AddField::KINDS, true), 400);

        $entry = static::entry($request->input('id'));
        $made = TemplateFields::add(
            $view,
            $entry,
            $kind,
            mb_substr(trim((string) $request->input('name', '')), 0, 60),
            (string) $request->input('value', '')
        );

        if ($made === null) {
            return response()->json(['error' => 'no_blueprint'], 422);
        }

        $own = $entry?->blueprint();

        return response()->json([
            'ok' => true,
            'handle' => $made['handle'],
            'type' => $kind,
            // The open form was built from one of them at page load: only a
            // real load puts the field in it (lp-blueprint.js does the same).
            'reload' => $own !== null && in_array($own->namespace().'.'.$own->handle(), $made['blueprints'], true),
        ]);
    }

    protected static function entry(mixed $id)
    {
        return is_string($id) && $id !== '' && $id !== 'create' ? Entry::find($id) : null;
    }
}
