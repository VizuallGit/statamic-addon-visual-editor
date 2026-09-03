<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SiteCss;

/**
 * Read and write files under `resources/css` from Live Preview.
 *
 * The settings toggle and toolbar access both have to be on.
 */
class SiteCssController
{
    public function index()
    {
        $this->authorize();

        return response()->json(SiteCss::listing());
    }

    public function show(Request $request)
    {
        $this->authorize();

        $file = SiteCss::read((string) $request->query('path', ''));

        abort_unless($file, 404);

        return response()->json($file);
    }

    public function update(Request $request)
    {
        $this->authorize();

        $path = (string) $request->input('path', '');
        $css = $request->input('css');

        abort_unless(is_string($css), 422);

        $file = SiteCss::write($path, $css);

        abort_unless($file, 404);

        return response()->json($file);
    }

    public function store(Request $request)
    {
        $this->authorize();

        $path = (string) $request->input('path', '');
        $file = SiteCss::create($path);

        abort_unless($file, 422);

        return response()->json([
            ...$file,
            ...SiteCss::listing(),
        ]);
    }

    public function import(Request $request)
    {
        $this->authorize();

        $path = (string) $request->input('path', '');

        abort_unless(SiteCss::existingPath($path), 404);
        abort_unless(SiteCss::ensureImport($path), 422);

        return response()->json([
            'path' => SiteCss::normalize($path),
            'imported' => true,
            ...SiteCss::listing(),
        ]);
    }

    public function rename(Request $request)
    {
        $this->authorize();

        $file = SiteCss::rename(
            (string) $request->input('from', ''),
            (string) $request->input('to', '')
        );

        abort_unless($file, 422);

        return response()->json([
            ...$file,
            ...SiteCss::listing(),
        ]);
    }

    public function destroy(Request $request)
    {
        $this->authorize();

        abort_unless(SiteCss::delete((string) $request->input('path', '')), 422);

        return response()->json(SiteCss::listing());
    }

    protected function authorize(): void
    {
        abort_unless(Features::allows('site_css'), 403);
    }
}
