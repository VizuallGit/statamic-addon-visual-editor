<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use MarioHamann\StatamicVisualEditor\AnimationPresets;
use MarioHamann\StatamicVisualEditor\ScriptPushStack;
use MarioHamann\StatamicVisualEditor\StylePushStack;
use Statamic\Fields\Value;
use Statamic\Tags\Tags;

/**
 * `{{ sve_animation }}` — the animation runtime for a section that animates.
 *
 * Pushes runtime.css, reduced-motion.css and one rule per preset onto
 * `style_push`, and runtime.js onto `script_push`, and prints nothing. Every animated section
 * carries the tag; the stacks drop a block they already hold, so a page
 * gets the runtime once however many sections ask for it.
 *
 * The files live in resources/animation/. presets.json is the one list of
 * the addon's presets, read here and by the build panel; the site's own,
 * saved from the panel, come from AnimationPresets.
 *
 * A section that differs from its template («Kun denne sektion» in the
 * panel) keeps the difference in its set's hidden `_anim` field; the tag
 * pushes it as one more sheet under the section's id (sectionCss), never
 * into the template or a style attribute.
 */
class SveAnimation extends Tags
{
    protected static $handle = 'sve_animation';

    private const STEP = '/^(\d+):([a-z][a-z0-9-]*)$/';

    private const HANDLE = '/^[a-z][a-z0-9-]*$/';

    private const VAR_NAME = '/^--anim-[a-z-]+$/';

    private const VAR_VALUE = '/^[a-zA-Z0-9 .,%()#*\/-]+$/';

    private const SECTION_ID = '/^[A-Za-z0-9_-]+$/';

    public function index(): string
    {
        StylePushStack::push('<style>'.static::css().'</style>');
        ScriptPushStack::push('<script>'.static::file('runtime.js').'</script>');

        $id = static::plain($this->context->get('id'));
        $own = is_string($id) ? static::sectionCss($id, static::override($this->context->get('_anim'))) : '';

        if ($own !== '') {
            StylePushStack::push('<style>'.$own.'</style>');
        }

        return '';
    }

    /**
     * A set's `_anim` as an array: the field's value, or the JSON a form
     * sent; anything else is no override.
     */
    public static function override(mixed $raw): array
    {
        $raw = static::plain($raw);

        if (is_string($raw) && $raw !== '') {
            $raw = json_decode($raw, true);
        }

        return is_array($raw) ? $raw : [];
    }

    /**
     * The section's own animation values over its template's, one rule per
     * element under the section's id: `{ flip?, elements?: { "<build path>":
     * { vars?, preset?, off? } } }`. Unlayered, so they beat the layered
     * runtime and the template's own classes. A key that is not a build path,
     * a name that is not `--anim-*` or a value CSS could break out of is left
     * out; nothing left gives ''.
     */
    public static function sectionCss(string $id, array $anim): string
    {
        if (! preg_match(self::SECTION_ID, $id)) {
            return '';
        }

        $root = '#id-'.$id;
        $rules = [];

        if (($anim['flip'] ?? false) === true) {
            $rules[] = $root.' { --anim-flip: -1; }';
        }

        $elements = is_array($anim['elements'] ?? null) ? $anim['elements'] : [];

        foreach ($elements as $path => $over) {
            $selector = is_array($over) ? static::selector($root, (string) $path) : null;

            if ($selector === null) {
                continue;
            }

            $decls = [...static::varDecls($over['vars'] ?? null), ...static::presetDecls($over['preset'] ?? null)];

            if ($decls) {
                $rules[] = $selector.' { '.implode(' ', $decls).' }';
            }

            if (($over['off'] ?? false) === true) {
                $rules[] = $selector.', '.$selector.' > *, '.$selector.' [data-anim-word] { animation: none; transition: none; translate: none; }';
            }
        }

        return implode("\n", $rules);
    }

    /**
     * A build path as a selector under the section's root: `0:section/0:div/1:h2`
     * is `#id-… > div:nth-child(1) > h2:nth-child(2)`. Null when a step is not
     * `index:tag`.
     */
    protected static function selector(string $root, string $path): ?string
    {
        $steps = explode('/', $path);
        $selector = $root;

        foreach ($steps as $i => $step) {
            if (! preg_match(self::STEP, $step, $match)) {
                return null;
            }

            if ($i > 0) {
                $selector .= ' > '.$match[2].':nth-child('.((int) $match[1] + 1).')';
            }
        }

        return $selector;
    }

    /** @return list<string> */
    protected static function varDecls(mixed $vars): array
    {
        $decls = [];

        foreach (is_array($vars) ? $vars : [] as $name => $value) {
            if (is_string($name) && preg_match(self::VAR_NAME, $name) && is_string($value) && preg_match(self::VAR_VALUE, $value)) {
                $decls[] = $name.': '.$value.';';
            }
        }

        return $decls;
    }

    /**
     * A preset in the template's preset's place: its values under
     * `--anim-preset-*`, and every other preset's name the template's preset
     * may have set made empty again, so the runtime falls back as it would
     * on this preset alone.
     *
     * @return list<string>
     */
    protected static function presetDecls(mixed $handle): array
    {
        if (! is_string($handle) || ! preg_match(self::HANDLE, $handle)) {
            return [];
        }

        $all = [...static::presets(), ...AnimationPresets::all()];
        $preset = collect($all)->firstWhere('handle', $handle);

        if (! $preset) {
            return [];
        }

        $named = [];
        $decls = [];

        foreach ($preset['vars'] as $name => $value) {
            $named[] = static::presetVar($name);
            $decls[] = static::presetVar($name).': '.$value.';';
        }

        foreach ($all as $other) {
            foreach (array_keys($other['vars']) as $name) {
                if (! in_array(static::presetVar($name), $named, true)) {
                    $named[] = static::presetVar($name);
                    $decls[] = static::presetVar($name).': initial;';
                }
            }
        }

        return $decls;
    }

    protected static function presetVar(string $name): string
    {
        return preg_replace('/^--anim-/', '--anim-preset-', $name);
    }

    /** A context value as stored: a field's raw value, not its augmented one. */
    protected static function plain(mixed $value): mixed
    {
        return $value instanceof Value ? $value->raw() : $value;
    }

    /**
     * runtime.css, reduced-motion.css and a `[data-anim-preset="…"]` rule for
     * each preset, the addon's and the site's own, its values under
     * `--anim-preset-*` — the build panel's presetRules() writes the same.
     */
    public static function css(): string
    {
        $rules = array_map(function (array $preset): string {
            $vars = [];

            foreach ($preset['vars'] as $name => $value) {
                $vars[] = preg_replace('/^--anim-/', '--anim-preset-', $name).': '.$value.';';
            }

            return '[data-anim-preset="'.$preset['handle'].'"] { '.implode(' ', $vars).' }';
        }, [...static::presets(), ...AnimationPresets::all()]);

        return static::file('runtime.css')."\n".static::file('reduced-motion.css')."\n".implode("\n", $rules);
    }

    /**
     * The addon's presets only.
     *
     * @return list<array{handle: string, group: string, label_da: string, label_en: string, vars: array<string, string>}>
     */
    public static function presets(): array
    {
        return json_decode(static::file('presets.json'), true, 512, JSON_THROW_ON_ERROR);
    }

    protected static function file(string $name): string
    {
        return trim((string) file_get_contents(__DIR__.'/../../resources/animation/'.$name));
    }
}
