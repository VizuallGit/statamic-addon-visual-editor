<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Addon;
use Statamic\Facades\User;

/**
 * The two presets every Live Preview top bar starts with: Developer and
 * Content editor.
 *
 * A preset says which icons show and whether the template dock opens with
 * Live Preview. The site edits both on the settings screen (Top bar presets);
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
        'sections',
        'listview',
        'outline',
        'performance',
        'code',
        'site_css',
        'theme',
        'ai',
        'aitext',
        'schema',
        'edits',
        'comments',
    ];

    /** @var array<string, array{tools: list<string>, dock: bool}> */
    public const DEFAULTS = [
        'developer' => [
            'tools' => self::TOOLS,
            'dock' => true,
        ],
        'editor' => [
            'tools' => ['pages', 'globals', 'listview', 'outline', 'ai', 'aitext', 'edits', 'comments'],
            'dock' => false,
        ],
    ];

    /**
     * Both presets as the site has them, for the CP script.
     *
     * @return list<array{id: string, tools: list<string>, dock: bool}>
     */
    public static function all(): array
    {
        $out = [];

        foreach (static::DEFAULTS as $id => $default) {
            $tools = Features::setting("toolbar_preset_{$id}_tools");
            $dock = Features::setting("toolbar_preset_{$id}_dock");

            $out[] = [
                'id' => $id,
                'tools' => is_array($tools) ? static::tools($tools) : $default['tools'],
                'dock' => $dock === null ? $default['dock'] : (bool) $dock,
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
        $wanted = array_map('strval', $tools);

        return array_values(array_filter(static::TOOLS, fn ($key) => in_array($key, $wanted, true)));
    }
}
