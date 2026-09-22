<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SiteClasses;
use MarioHamann\StatamicVisualEditor\SiteCss;

/**
 * Read and write the site's own files from Live Preview: stylesheets under
 * `resources/css` (the default), scripts under `resources/js`, SVG icons
 * under `resources/svg` — chosen by `kind` on every request.
 *
 * The settings toggle and toolbar access both have to be on.
 */
class SiteCssController
{
    public function index(Request $request)
    {
        $this->authorize($request);

        return response()->json(SiteCss::listing());
    }

    /** The site's own class names, for the panel's add-class list. */
    public function classes(Request $request)
    {
        $this->authorize($request, 'css');

        return response()->json([
            'groups' => SiteClasses::grouped(),
        ]);
    }

    /** Every class the site defines and where — for the dock's `[ name ]` check. */
    public function defined(Request $request)
    {
        $this->authorize($request, 'css');

        return response()->json([
            'defined' => SiteClasses::defined(),
        ]);
    }

    public function show(Request $request)
    {
        $this->authorize($request);

        $file = SiteCss::read((string) $request->query('path', ''));

        abort_unless($file, 404);

        return response()->json($file);
    }

    public function update(Request $request)
    {
        $this->authorize($request);

        $path = (string) $request->input('path', '');
        $css = $request->input('css');

        abort_unless(is_string($css), 422);

        $file = SiteCss::write($path, $css);

        abort_unless($file, 404);

        return response()->json($file);
    }

    public function store(Request $request)
    {
        $this->authorize($request);

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
        $this->authorize($request);

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
        $this->authorize($request);

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
        $this->authorize($request);

        abort_unless(SiteCss::delete((string) $request->input('path', '')), 422);

        return response()->json(SiteCss::listing());
    }

    /**
     * The feature must be on, and the kind asked for must exist. `$only`
     * pins an action to one kind (the class list is stylesheets' business).
     */
    protected function authorize(Request $request, ?string $only = null): void
    {
        abort_unless(Features::allows('site_css'), 403);

        $kind = $only ?? (string) ($request->input('kind') ?: $request->query('kind') ?: 'css');

        abort_unless(SiteCss::use($kind), 422);
    }
}
