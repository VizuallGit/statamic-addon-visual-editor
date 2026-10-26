<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Snippet;

/**
 * The dock's snippet library: list them, read one, save one — and, for a CSS
 * snippet, change or remove it from Theme → Styles.
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

    /**
     * A new snippet. `kind: css` stores the `css` field as a rule body in a
     * `.css` file; anything else is the HTML shape with its three parts.
     * `replace` is the answer to the 409 a taken name gets — of either kind.
     */
    public function store(Request $request)
    {
        $this->authorize();

        $name = Snippet::normalizeName((string) $request->input('name', ''));

        abort_unless($name !== null, 422);

        $kind = (string) $request->input('kind', Snippet::HTML);
        $html = (string) $request->input('html', '');
        $css = (string) $request->input('css', '');
        $js = (string) $request->input('js', '');

        abort_unless(trim($kind === Snippet::CSS ? $css : $html.$css.$js) !== '', 422);

        $replace = $request->boolean('replace');

        abort_if(Snippet::exists($name) && ! $replace, 409);

        $made = $kind === Snippet::CSS
            ? Snippet::writeCss($name, $css)
            : Snippet::write($name, $html, $css, $js);

        abort_unless($made, 422);

        return response()->json(['ok' => true, ...$made]);
    }

    /**
     * A CSS snippet's body, and its name when `rename` is sent. One request,
     * so a rename and a body change land together or not at all: the name is
     * checked first, the body written under the new name, and the old file
     * taken away last.
     */
    public function update(Request $request)
    {
        $this->authorize();

        $name = Snippet::normalizeName((string) $request->input('name', ''));

        abort_unless($name !== null, 422);
        abort_unless(Snippet::kind($name) === Snippet::CSS, 404);

        $css = (string) $request->input('css', '');

        abort_unless(trim($css) !== '', 422);

        $to = $name;

        if ($request->filled('rename')) {
            $to = Snippet::normalizeName((string) $request->input('rename', ''));

            abort_unless($to !== null, 422);
            abort_if($to !== $name && Snippet::exists($to), 409);
        }

        $made = Snippet::writeCss($to, $css);

        abort_unless($made, 422);

        if ($to !== $name) {
            Snippet::delete($name);
        }

        return response()->json(['ok' => true, ...$made]);
    }

    public function destroy(Request $request)
    {
        $this->authorize();

        $name = Snippet::normalizeName((string) $request->query('name', ''));

        abort_unless($name !== null, 422);
        abort_unless(Snippet::delete($name), 404);

        return response()->json(['ok' => true, 'name' => $name]);
    }

    protected function authorize(): void
    {
        abort_unless(Features::allows('template_dock'), 403);
    }
}
