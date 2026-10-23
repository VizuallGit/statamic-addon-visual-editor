<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Snippet;

/**
 * The dock's snippet library: list them, read one, save one.
 *
 * Inserting the text into the open template is the dock's own job — it
 * happens at the cursor, so the change is undoable and saves like any other
 * edit.
 */
class SnippetController
{
    public function index()
    {
        $this->authorize();

        return response()->json(['items' => Snippet::all()]);
    }

    public function show(Request $request)
    {
        $this->authorize();

        $name = Snippet::normalizeName((string) $request->query('name', ''));

        abort_unless($name !== null, 422);

        $parts = Snippet::read($name);

        abort_unless($parts !== null, 404);

        return response()->json($parts);
    }

    public function store(Request $request)
    {
        $this->authorize();

        $name = Snippet::normalizeName((string) $request->input('name', ''));

        abort_unless($name !== null, 422);

        $html = (string) $request->input('html', '');
        $css = (string) $request->input('css', '');
        $js = (string) $request->input('js', '');

        abort_unless(trim($html.$css.$js) !== '', 422);

        $replace = $request->boolean('replace');

        abort_if(Snippet::exists($name) && ! $replace, 409);

        $made = Snippet::write($name, $html, $css, $js);

        abort_unless($made, 422);

        return response()->json(['ok' => true, ...$made]);
    }

    protected function authorize(): void
    {
        abort_unless(Features::allows('template_dock'), 403);
    }
}
