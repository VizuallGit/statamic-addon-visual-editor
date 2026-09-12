<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Component;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\TailwindBake;

/**
 * Turn a piece of a section into a component file.
 *
 * The Control Panel sends the markup, the CSS rules that belong to it, and the
 * Tailwind it compiled for that markup; this writes one partial holding all
 * three. Replacing the markup with the partial tag is the dock's own job — it
 * happens in the open editor, so the change is undoable and saves like any
 * other edit.
 */
class ComponentController
{
    public function index()
    {
        $this->authorize();

        return response()->json(['items' => Component::all()]);
    }

    public function store(Request $request)
    {
        $this->authorize();

        $name = Component::normalizeName((string) $request->input('name', ''));
        $html = $request->input('html');

        abort_unless($name !== null && is_string($html) && trim($html) !== '', 422);
        abort_if(Component::exists($name), 409);

        $css = (string) $request->input('css', '');
        $js = (string) $request->input('js', '');
        $tw = (string) $request->input('tw', '');

        // Same net as a section save: no compile arrived, so bake the subset
        // here. The real thing replaces it the first time the dock saves the
        // component.
        if (trim($tw) === '' && Features::enabled('tailwind_dock')) {
            $tw = TailwindBake::fromHtml($html);
        }

        $made = Component::create($name, $html, $css, $js, $tw);

        abort_unless($made, 422);

        return response()->json(['ok' => true, ...$made]);
    }

    protected function authorize(): void
    {
        abort_unless(Features::allows('template_dock'), 403);
    }
}
