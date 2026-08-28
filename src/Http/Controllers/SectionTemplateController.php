<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SectionTemplate;
// PARKED — Tailwind dock compile. Uncomment with the fromHtml() call below.
// use MarioHamann\StatamicVisualEditor\TailwindBake;
use MarioHamann\StatamicVisualEditor\TailwindTheme;

/**
 * Read and write a section type's Antlers partial from Live Preview.
 *
 * The settings toggle and toolbar access both have to be on. The file is the
 * shared template for every page that uses the type.
 */
class SectionTemplateController
{
    public function show(Request $request)
    {
        $this->authorize();

        $handle = (string) $request->query('type', '');
        $path = SectionTemplate::path($handle);

        abort_unless($path, 404);

        $parts = SectionTemplate::split((string) file_get_contents($path), $handle);

        return response()->json([
            'type' => $handle,
            'path' => SectionTemplate::relative($path),
            'html' => $parts['html'],
            'css' => $parts['css'],
            'js' => $parts['js'],
            'locked' => ! empty($parts['locked']),
        ]);
    }

    public function theme()
    {
        $this->authorize();

        return response()->json([
            'css' => TailwindTheme::css(),
        ]);
    }

    public function update(Request $request)
    {
        $this->authorize();

        $handle = (string) $request->input('type', '');
        $html = $request->input('html');
        $css = $request->input('css');
        $js = $request->input('js');

        abort_unless(is_string($html) && is_string($css) && is_string($js), 422);

        $path = SectionTemplate::path($handle);

        abort_unless($path, 404);

        $meta = SectionTemplate::split((string) file_get_contents($path), $handle);

        abort_if(! empty($meta['locked']), 423);

        // PARKED — Tailwind dock compile (leaked into style_push). Rewrite later.
        // $tw = Features::enabled('tailwind_dock')
        //     ? TailwindBake::fromHtml($html)
        //     : ($meta['tw'] ?? '');
        $tw = $meta['tw'] ?? '';

        $contents = SectionTemplate::join([
            'html' => $html,
            'css' => $css,
            'js' => $js,
            'tw' => $tw,
            'html_tag' => $meta['html_tag'],
            'css_tag' => $meta['css_tag'],
            'js_tag' => $meta['js_tag'],
            'locked' => false,
        ], $handle);

        file_put_contents($path, $contents);

        // Do not kick PreviewRefresher here. The dock saves on every keystroke;
        // spawning a headless browser then loads extra site documents and has
        // thrown the editor back to the public front end. Picker screenshots
        // catch up when the library opens or `sve:previews` runs.

        return response()->json([
            'ok' => true,
            'path' => SectionTemplate::relative($path),
        ]);
    }

    public function lock(Request $request)
    {
        $this->authorize();

        $handle = (string) $request->input('type', '');
        $path = SectionTemplate::path($handle);

        abort_unless($path, 404);

        $locked = $request->boolean('locked');

        SectionTemplate::setLocked($path, $locked);

        return response()->json([
            'ok' => true,
            'locked' => $locked,
            'path' => SectionTemplate::relative($path),
        ]);
    }

    protected function authorize(): void
    {
        abort_unless(Features::allows('template_dock'), 403);
    }
}
