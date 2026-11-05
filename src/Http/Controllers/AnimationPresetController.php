<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use InvalidArgumentException;
use MarioHamann\StatamicVisualEditor\AnimationPresets;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\User;

/**
 * The Animation tab's own presets: «Save as preset» and the × under «Mine» in a kind's gallery.
 *
 * Build writes the dock's file, so a user who may use the dock may keep the
 * looks it is written with. How many templates still name a preset is a GET
 * the panel asks before it offers Delete; the delete itself always deletes.
 * A POST that answers 4xx is a rejected save to the CP (save-errors.js).
 */
class AnimationPresetController extends Controller
{
    public function store(Request $request)
    {
        $this->authorizeBuild();

        $vars = $request->input('vars');
        $timing = $request->input('timing');

        try {
            $preset = AnimationPresets::save(
                (string) $request->input('label', ''),
                is_array($vars) ? $vars : [],
                $request->input('kind'),
                is_array($timing) ? $timing : [],
            );
        } catch (InvalidArgumentException) {
            return response()->json(['error' => 'invalid_preset'], 422);
        }

        return response()->json(['preset' => $preset, 'presets' => AnimationPresets::all()]);
    }

    public function usage(Request $request)
    {
        $this->authorizeBuild();

        return response()->json(['used' => AnimationPresets::usage((string) $request->query('handle', ''))]);
    }

    public function destroy(Request $request)
    {
        $this->authorizeBuild();

        abort_unless(AnimationPresets::delete((string) $request->input('handle', '')), 404);

        return response()->json(['presets' => AnimationPresets::all()]);
    }

    private function authorizeBuild(): void
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('template_dock'), 403);
    }
}
