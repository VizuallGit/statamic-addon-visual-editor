<?php

namespace MarioHamann\StatamicVisualEditor\ComponentProps;

/**
 * The parameter a component takes its classes in, read off what its file uses.
 *
 * `{{ class }}` on the component's root is the usual door, `{{ _class }}` the
 * page loop's spelling, and a declared `class` prop arrives as `props_class`.
 * Whichever the file reads is what the dock's Tailwind pane writes on the
 * call — so classes typed on a component land where the component puts them.
 */
class ClassParam
{
    /** In order of preference, when a file reads more than one. */
    public const NAMES = ['props_class', 'class', '_class'];

    public static function in(string $contents): ?string
    {
        $used = [];

        // Only what Antlers reads: inside `{{ … }}`, never a `{{# comment #}}`.
        // A name written as `class="…"` there is a parameter handed on to a
        // partial inside, not a read, and `.class` / `:class` belong to
        // something else.
        $code = preg_replace('/\{\{#[\s\S]*?#\}\}/', '', $contents) ?? $contents;

        preg_match_all('/\{\{([\s\S]*?)\}\}/', $code, $tags);

        foreach ($tags[1] as $tag) {
            preg_match_all('/(?<![\w.:$-])(props_class|_class|class)(?![\w-])(?!\s*=(?!=))/', $tag, $names);

            $used = [...$used, ...$names[1]];
        }

        foreach (self::NAMES as $name) {
            if (in_array($name, $used, true)) {
                return $name;
            }
        }

        return null;
    }
}
