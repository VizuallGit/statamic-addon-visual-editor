<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Artisan;

/**
 * The Section Previews utility's one action: run the generator now.
 *
 * Run in the request, not detached like the automatic refreshes, precisely
 * because somebody pressed a button — they should see what it did. The
 * fingerprints keep that quick: a normal run photographs only what has actually
 * changed, and "Regenerate everything" is the button for when you want the rest.
 */
class SetPreviewsController extends Controller
{
    public function generate(Request $request)
    {
        @set_time_limit(600); // a full, forced run is a browser per section

        $exit = Artisan::call('sve:previews', array_filter([
            '--force' => $request->boolean('force'),
        ]));

        return back()->with('sve_preview_results', [
            'ok' => $exit === 0,
            'output' => trim(Artisan::output()),
            'forced' => $request->boolean('force'),
        ]);
    }
}
