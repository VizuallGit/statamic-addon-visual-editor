<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Addon;
use Statamic\Facades\User;

/**
 * The two presets the site sets for the Live Preview top bar: Developer and
 * Content editor. The menu puts All in front of them — every icon, the dock
 * and the sidebar left as they are — which needs no setting and is the state
 * nobody has changed.
 *
 * A preset says which icons show, whether the template dock opens with Live
 * Preview, and which right-sidebar panes it opens (the HTML tree is not one:
 * it comes with the dock). Each user may choose a preset's panes for
 * themselves in Live Preview; this is where they start. The site edits all
 * three on the settings screen (Top bar presets);
 * until it does, DEFAULTS apply — the same values the settings blueprint
 * shows as its defaults, which a test holds in step. Names are not stored:
 * the menu says them in the CP user's language (`toolbar_preset_{id}`).
 *
 * The keys are the icons' `data-tab` names in the top bar, not the access
 * keys: a preset can only hide an icon, and one the user has no access to
 * never gets a button to show.
 */
class ToolbarPresets
{
    /** Every icon a preset can list, left to right as the top bar draws them. Page settings is always shown. */
    public const TOOLS = [
        'pages',
        'globals',
        'collections',
        'forms',
        'templates',
        'blueprint',
        'bard_styles',
        'sections',
        'listview',
        'outline',
        'performance',
        'code',
        'site_css',
        'theme',
        'xray',
        'design_overlay',
        'ai',
        'aitext',
        'schema',
        'edits',
        'comments',
    ];

    /** The right-sidebar panes a preset can open, in the order the Sidebars tab lists them. */
    public const PANES = [
        'listview',
        'outline',
        'comments',
        'sections',
        'ai',
    ];

    /** @var array<string, array{tools: list<string>, dock: bool, panes: list<string>}> */
    public const DEFAULTS = [
        'developer' => [
            'tools' => ['collections', 'forms', 'templates', 'blueprint', 'bard_styles', 'sections', 'code', 'site_css', 'theme', 'xray', 'design_overlay'],
            'dock' => true,
            'panes' => [],
        ],
        'editor' => [
            'tools' => ['pages', 'globals', 'collections', 'forms', 'sections', 'listview', 'outline', 'ai', 'aitext', 'edits', 'comments'],
            'dock' => false,
            'panes' => ['listview', 'sections'],
        ],
    ];

    /**
     * Both presets as the site has them, for the CP script.
     *
     * @return list<array{id: string, tools: list<string>, dock: bool, panes: list<string>}>
     */
    public static function all(): array
    {
        $out = [];

        foreach (static::DEFAULTS as $id => $default) {
            $tools = Features::setting("toolbar_preset_{$id}_tools");
            $dock = Features::setting("toolbar_preset_{$id}_dock");
            $panes = Features::setting("toolbar_preset_{$id}_panes");

            $out[] = [
                'id' => $id,
                'tools' => is_array($tools) ? static::tools($tools) : $default['tools'],
                'dock' => $dock === null ? $default['dock'] : (bool) $dock,
                'panes' => is_array($panes) ? static::known(static::PANES, $panes) : $default['panes'],
            ];
        }

        return $out;
    }

    /**
     * Where the presets are edited, for a user who may edit them; null otherwise.
     */
    public static function settingsUrl(): ?string
    {
        $addon = Addon::get('statamic-addon/visual-editor');
        $user = User::current();

        if (! $addon || ! $user || ! $user->can('editSettings', $addon)) {
            return null;
        }

        return cp_route('addons.settings.edit', $addon->slug());
    }

    /**
     * Known icons only, once each, in the top bar's order.
     *
     * @param  array<mixed>  $tools
     * @return list<string>
     */
    public static function tools(array $tools): array
    {
        return static::known(static::TOOLS, $tools);
    }

    /**
     * The keys of `$known` that `$wanted` lists, once each, in `$known`'s order.
     *
     * @param  list<string>  $known
     * @param  array<mixed>  $wanted
     * @return list<string>
     */
    protected static function known(array $known, array $wanted): array
    {
        $wanted = array_map('strval', $wanted);

        return array_values(array_filter($known, fn ($key) => in_array($key, $wanted, true)));
    }
}
