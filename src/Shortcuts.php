<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * Keyboard shortcuts for Live Preview's top bar and its screen sizes.
 *
 * A shortcut presses a top-bar icon (`tool:<data-tab>`) or a size button
 * (`size:<handle>`) — exactly what a click on it does. Three layers say which
 * shortcut an action has, the last that names it winning:
 *
 * 1. built in: DEFAULTS below — the only copy of that list; the browser gets
 *    it through the Control Panel config, never as a list of its own;
 * 2. the site: the addon setting `shortcuts` (the top-bar tools, edited under
 *    Keyboard shortcuts) and each screen size's own `shortcut` on its
 *    breakpoint row, which travels with the breakpoint list;
 * 3. the user: the chrome preference `sve-shortcuts`, kept in the browser.
 *
 * In every layer `none` means "no shortcut here". Which shortcut wins where
 * two actions name the same one, and how a keypress becomes a shortcut, is
 * resources/js/lib/shortcuts.js. The grammar is written twice — here to
 * validate what is saved, there to read keys — and
 * tests/js/fixtures/shortcut-combos.json holds both to the same cases.
 */
final class Shortcuts
{
    public const NONE = 'none';

    /** `mod+<first letter>`; taken → `mod+shift`, then `mod+alt`, then another letter of the name. */
    public const DEFAULTS = [
        'size:laptop' => 'mod+d',
        'size:tablet' => 'mod+alt+t',
        'size:mobile' => 'mod+m',
        'tool:settings' => 'mod+comma',
        'tool:pages' => 'mod+p',
        'tool:globals' => 'mod+g',
        'tool:collections' => 'mod+o',
        'tool:forms' => 'mod+shift+f',
        'tool:templates' => 'mod+alt+e',
        'tool:blueprint' => 'mod+b',
        'tool:bard_styles' => 'mod+shift+b',
        'tool:sections' => 'mod+alt+p',
        'tool:listview' => 'mod+shift+l',
        'tool:outline' => 'mod+shift+a',
        'tool:performance' => 'mod+shift+e',
        'tool:code' => 'mod+u',
        'tool:site_css' => 'mod+alt+s',
        'tool:theme' => 'mod+shift+h',
        'tool:xray' => 'mod+shift+x',
        'tool:design_overlay' => 'mod+shift+d',
        'tool:site_canvas' => 'mod+alt+v',
        'tool:ai' => 'mod+alt+a',
        'tool:aitext' => 'mod+i',
        'tool:schema' => 'mod+j',
        'tool:edits' => 'mod+e',
        'tool:comments' => 'mod+shift+o',
    ];

    /** In the order a shortcut is written. `mod` is ⌘ on a Mac and Ctrl elsewhere; `ctrl` is the Mac's Control key. */
    public const MODIFIERS = ['mod', 'ctrl', 'alt', 'shift'];

    /** The keys that are neither a letter nor a digit. */
    public const NAMED_KEYS = ['comma', 'period', 'slash', 'semicolon', 'quote', 'bracketleft', 'bracketright', 'backslash', 'minus', 'equal'];

    /**
     * Taken by Statamic, the browser, macOS, text editing or the developer
     * tools: never recorded, never saved. Enter, Backspace and Tab are not keys
     * a shortcut can have at all; they are named so the list stays complete.
     */
    public const LOCKED = [
        // Statamic
        'mod+s', 'mod+shift+s', 'mod+enter', 'mod+shift+p', 'mod+k', 'mod+backspace', 'ctrl+s',
        // The browser
        'mod+t', 'mod+shift+t', 'mod+n', 'mod+shift+n', 'mod+w', 'mod+shift+w', 'mod+q', 'mod+h', 'mod+tab',
        'mod+shift+tab', 'mod+l', 'mod+r', 'mod+shift+r', 'mod+f', 'mod+equal', 'mod+minus', 'mod+0',
        // macOS
        'mod+shift+3', 'mod+shift+4', 'mod+shift+5', 'mod+alt+h', 'mod+alt+m', 'mod+alt+d',
        // Text
        'mod+a', 'mod+c', 'mod+v', 'mod+x', 'mod+z', 'mod+y', 'mod+shift+z', 'mod+shift+v',
        // The developer tools
        'mod+shift+i', 'mod+shift+j', 'mod+shift+c', 'mod+alt+i', 'mod+alt+j', 'mod+alt+c', 'mod+alt+u',
    ];

    /** Each tool's name: the string its icon's tooltip says. */
    public const LABELS = [
        'settings' => 'panel',
        'pages' => 'pages',
        'globals' => 'globals',
        'collections' => 'lp_collections_heading',
        'forms' => 'lp_forms_heading',
        'templates' => 'template_board_title',
        'blueprint' => 'blueprint',
        'bard_styles' => 'bard_styles_title',
        'sections' => 'sections',
        'listview' => 'listview',
        'outline' => 'outline',
        'performance' => 'performance',
        'code' => 'code_dock_toggle',
        'site_css' => 'site_css_toggle',
        'theme' => 'theme_panel_toggle',
        'xray' => 'xray_tip',
        'design_overlay' => 'design_overlay_tip',
        'site_canvas' => 'site_canvas_button',
        'ai' => 'ai_panel',
        'aitext' => 'ai_text_off',
        'schema' => 'schema',
        'edits' => 'page_edits_title',
        'comments' => 'comments_pane',
    ];

    /** `Shift+ mod+F` → `mod+shift+f`; '' when it is not a shortcut; `none` stays `none`. */
    public static function normalize(mixed $combo): string
    {
        if (! is_string($combo)) {
            return '';
        }

        $parts = array_map('trim', explode('+', mb_strtolower(trim($combo))));

        if (count($parts) === 1 && $parts[0] === self::NONE) {
            return self::NONE;
        }

        if (count($parts) < 2 || in_array('', $parts, true)) {
            return '';
        }

        $key = array_pop($parts);

        if (! static::isKey($key) || count(array_unique($parts)) !== count($parts) || array_diff($parts, self::MODIFIERS) !== []) {
            return '';
        }

        // Shift alone is typing a capital, not a shortcut.
        if (array_diff($parts, ['shift']) === []) {
            return '';
        }

        return implode('+', [...array_values(array_intersect(self::MODIFIERS, $parts)), $key]);
    }

    public static function isLocked(mixed $combo): bool
    {
        return in_array(static::normalize($combo), self::LOCKED, true);
    }

    /** A shortcut that may be saved, `none`, or '' — broken and locked ones are ''. */
    public static function clean(mixed $combo): string
    {
        $combo = static::normalize($combo);

        return $combo === '' || static::isLocked($combo) ? '' : $combo;
    }

    /**
     * The site's top-bar shortcuts as saved: `{ "tool:pages": "mod+p", … }`,
     * known tools only, in the built-in order. A size's shortcut is not kept
     * here but on its breakpoint row.
     *
     * @return array<string, string>
     */
    public static function cleanMap(mixed $map): array
    {
        if (! is_array($map)) {
            return [];
        }

        $out = [];

        foreach (static::tools() as $action) {
            $combo = static::clean($map[$action] ?? null);

            if ($combo !== '') {
                $out[$action] = $combo;
            }
        }

        return $out;
    }

    /** @return array<string, string> the site's layer for the top-bar tools */
    public static function site(): array
    {
        return static::cleanMap(Features::setting('shortcuts'));
    }

    /**
     * What the Control Panel needs to resolve the layers: the built-in list,
     * the site's tools, the locked shortcuts and each tool's name in the CP
     * user's language.
     *
     * @return array{builtIn: array<string, string>, site: array<string, string>, locked: list<string>, labels: array<string, string>}
     */
    public static function forScript(): array
    {
        return [
            'builtIn' => self::DEFAULTS,
            'site' => static::site(),
            'locked' => self::LOCKED,
            'labels' => static::labels(),
        ];
    }

    /**
     * The rows of the settings screen's list: every top-bar tool, its name and
     * its built-in shortcut, in the built-in order.
     *
     * @return list<array{action: string, label: string, default: string}>
     */
    public static function forFieldtype(): array
    {
        $labels = static::labels();

        return array_map(fn ($action) => [
            'action' => $action,
            'label' => $labels[$action],
            'default' => self::DEFAULTS[$action],
        ], static::tools());
    }

    /** @return array<string, string> `tool:<key>` → its name */
    public static function labels(): array
    {
        $out = [];

        foreach (static::tools() as $action) {
            $out[$action] = (string) __('sve::messages.'.self::LABELS[substr($action, 5)]);
        }

        return $out;
    }

    /** @return list<string> the top-bar actions, in the built-in order */
    public static function tools(): array
    {
        return array_values(array_filter(array_keys(self::DEFAULTS), fn ($action) => str_starts_with($action, 'tool:')));
    }

    protected static function isKey(string $key): bool
    {
        return preg_match('/^[a-z0-9]$/', $key) === 1 || in_array($key, self::NAMED_KEYS, true);
    }
}
