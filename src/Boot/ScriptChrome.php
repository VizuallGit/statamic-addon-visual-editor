<?php

namespace MarioHamann\StatamicVisualEditor\Boot;

use Illuminate\Support\Str;
use Statamic\Facades\GlobalSet;
use Statamic\Statamic;

/**
 * The header/footer globals and the Theme Settings tabs the docked panel leaves
 * out, resolved for the Control Panel's script. Split out of
 * Boot\ControlPanelScript in WP7c, verbatim.
 */
final class ScriptChrome
{
    /**
     * Tabs the docked Theme Settings panel leaves out, as the labels they carry
     * on screen.
     *
     * Configured by handle, resolved here to labels: the panel has only the
     * rendered publish form to work with — the tab buttons in it carry their
     * display text and nothing that names the blueprint tab — so the matching
     * has to happen on the label. Doing the lookup server-side is what keeps the
     * config honest (a handle, stable) and the match right in every language (a
     * label, as the blueprint actually spells it).
     *
     * @return array<string, array<int, string>>  global set handle => lowercased labels
     */
    public static function hiddenGlobalsTabs(): array
    {
        $hidden = (array) config('statamic-visual-editor.chrome.hidden_tabs', []);

        if (! $hidden) {
            return [];
        }

        $map = [];

        // One set or one per half — the tabs to leave out are named the same way
        // either way, so every set that carries a half gets the same treatment.
        foreach (static::chromeGlobalHandles() as $handle) {
            if (! $set = GlobalSet::findByHandle($handle)) {
                continue;
            }

            $tabs = $set->blueprint()?->contents()['tabs'] ?? [];
            $labels = [];

            foreach ($hidden as $tab) {
                if (! isset($tabs[$tab])) {
                    continue; // renamed or removed since it was configured
                }

                // No `display` means Statamic titleises the handle for the tab button.
                $labels[] = Str::lower($tabs[$tab]['display'] ?? Str::title(str_replace('_', ' ', $tab)));
            }

            if ($labels) {
                $map[$handle] = $labels;
            }
        }

        return $map;
    }

    /**
     * Every global set holding a half of the site frame, deduplicated.
     *
     * `chrome.global` names one set for both; `chrome.header.global` and
     * `chrome.footer.global` name one each. Configuring both is allowed and
     * answers with the two specific ones — the shared key is then the fallback
     * for a half that names none.
     *
     * @return array<int, string>
     */
    public static function chromeGlobalHandles(): array
    {
        $shared = config('statamic-visual-editor.chrome.global');

        $handles = collect(['header', 'footer'])
            ->map(fn ($half) => config("statamic-visual-editor.chrome.{$half}.global") ?: $shared)
            ->filter()
            ->all();

        return array_values(array_unique($handles ?: [$shared ?: 'theme_settings']));
    }
}
