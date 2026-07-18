<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Routing\Controller;
use MarioHamann\StatamicVisualEditor\SetPreviewGenerator;

class SetPreviewsController extends Controller
{
    public function generate(SetPreviewGenerator $generator)
    {
        @set_time_limit(300); // browser screenshots can take a while

        $results = $generator->generate();

        $ok = collect($results)->filter(fn ($s) => $s === 'ok')->keys()->all();
        $failed = collect($results)->filter(fn ($s) => str_starts_with($s, 'error'))->keys()->all();

        return back()->with('sve_preview_results', [
            'ok' => $ok,
            'failed' => $failed,
            'raw' => $results,
        ]);
    }
}
