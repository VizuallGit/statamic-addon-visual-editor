<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\CollectionViewFile;
use MarioHamann\StatamicVisualEditor\DockPartial;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SectionTemplate;
use MarioHamann\StatamicVisualEditor\TailwindBake;
use MarioHamann\StatamicVisualEditor\TailwindStore;
use MarioHamann\StatamicVisualEditor\TailwindTheme;

/**
 * Read and write an Antlers file from Live Preview: a section partial, or a
 * collection index/show view (`view:{path}`).
 *
 * The settings toggle and toolbar access both have to be on.
 */
class SectionTemplateController
{
    public function show(Request $request)
    {
        $this->authorize();

        $handle = (string) $request->query('type', '');
        [$path, $splitHandle] = $this->locate($handle);

        $parts = SectionTemplate::split((string) file_get_contents($path), $splitHandle);

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

    public function partials(Request $request)
    {
        $this->authorize();

        return response()->json([
            'items' => DockPartial::resolve((string) $request->query('src', '')),
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

        [$path, $splitHandle] = $this->locate($handle);

        $meta = SectionTemplate::split((string) file_get_contents($path), $splitHandle);

        abort_if(! empty($meta['locked']), 423);

        if (Features::enabled('tailwind_dock')) {
            TailwindStore::write($splitHandle, TailwindBake::fromHtml($html));
        } elseif (trim((string) ($meta['tw'] ?? '')) !== '') {
            TailwindStore::write($splitHandle, (string) $meta['tw']);
        }

        $contents = SectionTemplate::join([
            'html' => $html,
            'css' => $css,
            'js' => $js,
            'html_tag' => $meta['html_tag'],
            'css_tag' => $meta['css_tag'],
            'js_tag' => $meta['js_tag'],
            'locked' => false,
        ], $splitHandle);

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
        [$path] = $this->locate($handle);

        $locked = $request->boolean('locked');

        SectionTemplate::setLocked($path, $locked);

        return response()->json([
            'ok' => true,
            'locked' => $locked,
            'path' => SectionTemplate::relative($path),
        ]);
    }

    /**
     * @return array{0: string, 1: string}
     */
    protected function locate(string $handle): array
    {
        if ($view = CollectionViewFile::viewFromType($handle)) {
            $path = CollectionViewFile::path($view);
            abort_unless($path, 404);

            // Empty split-handle: a view file is not a designed section type,
            // so it must not start locked.
            return [$path, ''];
        }

        $path = SectionTemplate::path($handle);
        abort_unless($path, 404);

        return [$path, $handle];
    }

    protected function authorize(): void
    {
        abort_unless(Features::allows('template_dock'), 403);
    }
}
