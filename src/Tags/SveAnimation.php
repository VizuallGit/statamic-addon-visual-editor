<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use MarioHamann\StatamicVisualEditor\ScriptPushStack;
use MarioHamann\StatamicVisualEditor\StylePushStack;
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
 * presets, read here and by the build panel.
 */
class SveAnimation extends Tags
{
    protected static $handle = 'sve_animation';

    public function index(): string
    {
        StylePushStack::push('<style>'.static::css().'</style>');
        ScriptPushStack::push('<script>'.static::file('runtime.js').'</script>');

        return '';
    }

    /**
     * runtime.css, reduced-motion.css and a `[data-anim-preset="…"]` rule for
     * each preset, its values under `--anim-preset-*` — the build panel's
     * presetRules() writes the same.
     */
    public static function css(): string
    {
        $rules = array_map(function (array $preset): string {
            $vars = [];

            foreach ($preset['vars'] as $name => $value) {
                $vars[] = preg_replace('/^--anim-/', '--anim-preset-', $name).': '.$value.';';
            }

            return '[data-anim-preset="'.$preset['handle'].'"] { '.implode(' ', $vars).' }';
        }, static::presets());

        return static::file('runtime.css')."\n".static::file('reduced-motion.css')."\n".implode("\n", $rules);
    }

    /** @return list<array{handle: string, group: string, label_da: string, label_en: string, vars: array<string, string>}> */
    public static function presets(): array
    {
        return json_decode(static::file('presets.json'), true, 512, JSON_THROW_ON_ERROR);
    }

    protected static function file(string $name): string
    {
        return trim((string) file_get_contents(__DIR__.'/../../resources/animation/'.$name));
    }
}
