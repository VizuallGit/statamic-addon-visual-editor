<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use InvalidArgumentException;
use MarioHamann\StatamicVisualEditor\AnimationPresets;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\User;

/**
 * The Animation tab's own presets: «Save as preset» and the × under My presets.
 *
 * Build writes the dock's file, so a user who may use the dock may keep the
 * looks it is written with. A preset still named in a template is deleted
 * only when the panel has said so and asks again with `force`.
 */
class AnimationPresetController extends Controller
{
    public function store(Request $request)
    {
        $this->authorizeBuild();

        $vars = $request->input('vars');

        try {
            $preset = AnimationPresets::save((string) $request->input('label', ''), is_array($vars) ? $vars : []);
        } catch (InvalidArgumentException) {
            return response()->json(['error' => 'invalid_preset'], 422);
        }

        return response()->json(['preset' => $preset, 'presets' => AnimationPresets::all()]);
    }

    public function destroy(Request $request)
    {
        $this->authorizeBuild();

        $handle = (string) $request->input('handle', '');
        $used = AnimationPresets::usage($handle);

        if ($used > 0 && ! $request->boolean('force')) {
            return response()->json(['used' => $used], 409);
        }

        abort_unless(AnimationPresets::delete($handle), 404);

        return response()->json(['presets' => AnimationPresets::all()]);
    }

    private function authorizeBuild(): void
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('template_dock'), 403);
    }
}
