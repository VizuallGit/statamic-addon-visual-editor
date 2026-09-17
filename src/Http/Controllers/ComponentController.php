<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Component;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\TailwindCompile;

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

        if (Features::enabled('tailwind_dock') && $tw === '' && ! app()->environment('local')) {
            try {
                $tw = TailwindCompile::fromHtml($html);
            } catch (\Throwable $e) {
                report($e);
            }
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
