<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use MarioHamann\StatamicVisualEditor\PreviewHost;
use MarioHamann\StatamicVisualEditor\SectionDefaults;

/**
 * Renders one section type with its default values, so the generator can
 * screenshot the section as the picker will insert it.
 *
 * This is what gives every section type a preview, including the ones no page
 * uses yet — the old generator could only photograph instances it found on the
 * site, so a section nobody had built with stayed blank in the picker forever.
 *
 * The handle travels as a query parameter, never a path segment: set handles hold
 * slashes (`hero/style_1`), which a route parameter would swallow.
 */
class SectionDefaultsPreviewController extends Controller
{
    public function __invoke(Request $request)
    {
        $handle = (string) $request->query('type');

        abort_if($handle === '', 404);

        $section = SectionDefaults::for($handle);

        abort_unless($section, 404);

        return PreviewHost::respond($request, [$section]);
    }
}
