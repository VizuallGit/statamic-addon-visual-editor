<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\User;

class ChromePrefsController
{
    /** Keep in step with resources/js/chrome-prefs.js CHROME_KEYS. */
    public const KEYS = [
        'sve-right-dock-open',
        'sve-right-dock-width',
        'sve-right-dock-pinned',
        'sve-right-dock-stack-heights',
        'sve-right-dock-stack-order',
        'sve-right-dock-open-panes',
        'sve-right-dock-folded',
        'sve-globals-panel-width',
        'sve-listview-panel-width',
        'sve-ai-panel-width',
        'sve-lp-docked',
        'sve-lp-panel-mode',
        'sve-lp-collapsed',
        'sve-header-tab',
        'sve-lp-device',
        'sve-lp-zoom',
        'statamic.live-preview.editor-width',
        'sve-code-dock-height',
        'sve-code-dock-panes',
        'sve-code-dock-widths',
        'sve-code-dock-armed',
        'sve-ai-panel-mode',
        'sve-listview-tab',
    ];

    public function update(Request $request)
    {
        $user = $this->user();

        $prefs = $request->input('prefs');

        abort_unless(is_array($prefs), 422);

        $clean = [];

        foreach ($prefs as $key => $value) {
            if (! is_string($key) || ! in_array($key, self::KEYS, true) || ! is_scalar($value)) {
                continue;
            }

            $clean[$key] = (string) $value;
        }

        abort_if(strlen((string) json_encode($clean)) > 20000, 413);

        $user->setPreference('sve_chrome', $clean)->save();

        return response()->json(['ok' => true]);
    }

    public function destroy()
    {
        $user = $this->user();

        $user->removePreference('sve_chrome')->save();

        return response()->json(['ok' => true]);
    }

    protected function user()
    {
        abort_unless(Features::editorEnabled(), 403);

        $user = User::current();

        abort_unless($user, 403);

        return $user;
    }
}
