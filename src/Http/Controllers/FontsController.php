<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Fonts\AdobeKits;
use MarioHamann\StatamicVisualEditor\Fonts\Folder;
use MarioHamann\StatamicVisualEditor\Fonts\GoogleFonts;
use MarioHamann\StatamicVisualEditor\Fonts\Listing;
use MarioHamann\StatamicVisualEditor\Fonts\Stylesheet;
use MarioHamann\StatamicVisualEditor\Fonts\Uploads;
use MarioHamann\StatamicVisualEditor\GitSync;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTemplateController\Persist;

/**
 * The Theme panel's Fonts tab: what is installed, Google's catalog, and the
 * three ways in — Google Fonts, an uploaded file, an Adobe Fonts kit. Every
 * write lands in the site's fonts folder and fonts.css and is only ever an
 * addition. Gated like the rest of the Theme panel (it writes site files).
 */
class FontsController
{
    public function index()
    {
        $this->authorize();

        return response()->json(Listing::get());
    }

    public function catalog()
    {
        $this->authorize();

        try {
            $fonts = GoogleFonts::catalog();
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['error' => 'google_unreachable'], 502);
        }

        return response()->json(['fonts' => $fonts])->header('Cache-Control', 'private, max-age=3600');
    }

    public function plan(Request $request)
    {
        $this->authorize();

        [$font, $variants, $subsets] = $this->choice($request);

        try {
            $plan = GoogleFonts::plan($font, $variants, $subsets);
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['error' => 'google_unreachable'], 502);
        }

        return response()->json(['files' => count($plan['faces']), 'bytes' => $plan['bytes']]);
    }

    public function installGoogle(Request $request)
    {
        $this->authorize();
        $this->writable();

        [$font, $variants, $subsets] = $this->choice($request);

        try {
            $added = GoogleFonts::install($font, $variants, $subsets);
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['error' => 'install_failed'], 502);
        }

        return $this->written("font {$font['family']}", ['added' => $added, 'family' => Folder::family($font['family'])]);
    }

    public function upload(Request $request)
    {
        $this->authorize();
        $this->writable();

        $file = $request->file('file');
        $family = Folder::family((string) $request->input('family', ''));

        abort_unless($file && $file->isValid() && $family, 422);

        $face = Uploads::store($file, $family, (string) $request->input('weight', '400'), (string) $request->input('style', 'normal'));

        if (! $face) {
            return response()->json(['error' => 'not_a_font'], 422);
        }

        return $this->written("font {$family}", ['added' => Stylesheet::addFaces($family, [$face]), 'family' => $family]);
    }

    public function adobe(Request $request)
    {
        $this->authorize();
        $this->writable();

        $url = AdobeKits::url((string) $request->input('kit', ''));

        if (! $url) {
            return response()->json(['error' => 'kit_url'], 422);
        }

        if (! AdobeKits::families($url)) {
            return response()->json(['error' => 'kit_empty'], 422);
        }

        return $this->written('Adobe Fonts kit', ['added' => Stylesheet::addImport($url) ? 1 : 0, 'kit' => $url]);
    }

    /** A Google family from the catalog and the styles and scripts asked for — nothing else is fetched. */
    private function choice(Request $request): array
    {
        try {
            $font = GoogleFonts::find((string) $request->input('family', ''));
        } catch (\Throwable $e) {
            report($e);
            abort(response()->json(['error' => 'google_unreachable'], 502));
        }

        abort_unless($font, 404);

        $variants = array_values(array_intersect($font['variants'], array_map('strval', (array) $request->input('variants', []))));
        $subsets = array_values(array_intersect($font['subsets'], array_map('strval', (array) $request->input('subsets', []))));

        abort_unless($variants && $subsets, 422);

        return [$font, $variants, $subsets];
    }

    private function written(string $what, array $extra)
    {
        GitSync::after($what);
        // A cached page links fonts.css with the old time in its URL.
        Persist::flushStaticCache();

        return response()->json([...$extra, ...Listing::get()]);
    }

    private function authorize(): void
    {
        abort_unless(Features::allows('site_css'), 403);
    }

    private function writable(): void
    {
        if (! Folder::writable()) {
            abort(response()->json(['error' => 'not_writable'], 409));
        }
    }
}
