<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Addon;
use Statamic\Facades\User;

/**
 * Which top bar icons each mode of Live Preview may have: Content, and Build.
 *
 * The site ticks them on the settings screen (Top bar: Content and Build). An
 * icon that is not on a mode's list is not there in that mode — not shown,
 * not in ⋮ → Top bar, not on a keyboard shortcut — whatever the user does. A
 * user without Build is always in Content. Within its mode's list, each user
 * shows and hides icons, and groups them, for themselves.
 *
 * The HTML dock is on neither list: it is always in Build, which writes the
 * dock's file and cannot do without it, and never in Content.
 *
 * Stored under the names the lists had when they were presets (Developer,
 * Content editor), so a site's ticks carry over.
 *
 * The keys are the icons' `data-tab` names in the top bar, not the access
 * keys: a mode can only hold an icon back, and one the user has no access to
 * never gets a button to show.
 */
class ToolbarModes
{
    /** Every icon a mode can list, left to right as the top bar draws them. Page settings is always shown. */
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
        'site_canvas',
        'ai',
        'aitext',
        'schema',
        'edits',
        'comments',
    ];

    /** The HTML dock: Build's always, Content's never — not a tick on either list. */
    public const DOCK = 'code';

    /** Where each mode's list is stored on the settings screen. */
    public const SETTINGS = [
        'content' => 'toolbar_preset_editor_tools',
        'build' => 'toolbar_preset_developer_tools',
    ];

    /** @var array<string, list<string>> */
    public const DEFAULTS = [
        'content' => ['pages', 'globals', 'collections', 'forms', 'sections', 'listview', 'outline', 'ai', 'aitext', 'edits', 'comments'],
        'build' => ['pages', 'globals', 'collections', 'forms', 'templates', 'blueprint', 'bard_styles', 'sections', 'listview', 'outline', 'performance', 'site_css', 'theme', 'xray', 'design_overlay', 'site_canvas', 'ai', 'aitext', 'schema', 'edits', 'comments'],
    ];

    /**
     * Both lists as the site has them, for the CP script — the dock put where
     * it belongs.
     *
     * @return array{content: list<string>, build: list<string>}
     */
    public static function all(): array
    {
        $out = [];

        foreach (static::SETTINGS as $mode => $handle) {
            $saved = Features::setting($handle);
            $tools = array_values(array_diff(is_array($saved) ? static::tools($saved) : static::DEFAULTS[$mode], [static::DOCK]));

            $out[$mode] = $mode === 'build' ? static::tools([...$tools, static::DOCK]) : $tools;
        }

        return $out;
    }

    /**
     * Where the lists are edited, for a user who may edit them; null otherwise.
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
