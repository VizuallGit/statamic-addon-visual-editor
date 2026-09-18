<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * CSS for Tailwind classes in a section's HTML pane.
 *
 * `fromHtml()` runs Tailwind's own compiler on the server (`TailwindCompile`).
 * `classes()` lists the classes in a pane and `peelVariants()` splits
 * `hover:md:` prefixes off one class; both are what the dock's chips use.
 * The hand-written utility maps that once baked CSS here were unreachable and
 * were removed in WP7d — the compiler is the only source of CSS.
 */
class TailwindBake
{

    /** @var array<string, string> */
    protected const VARIANT_MEDIA = [
        'sm' => '(min-width:640px)',
        'md' => '(min-width:768px)',
        'lg' => '(min-width:1024px)',
        'xl' => '(min-width:1280px)',
        '2xl' => '(min-width:1536px)',
        'max-sm' => '(max-width:639px)',
        'max-md' => '(max-width:767px)',
        'max-lg' => '(max-width:1023px)',
        'max-xl' => '(max-width:1279px)',
        'max-2xl' => '(max-width:1535px)',
        'dark' => '(prefers-color-scheme:dark)',
    ];

    /** @var array<string, string> */
    protected const VARIANT_PSEUDO = [
        'hover' => ':hover',
        'focus' => ':focus',
        'focus-visible' => ':focus-visible',
        'active' => ':active',
        'disabled' => ':disabled',
        'group-hover' => ':is(:where(.group):hover *)',
    ];

    public static function fromHtml(string $html): string
    {
        return TailwindCompile::fromHtml($html);
    }

    /**
     * @return array{0: list<string>, 1: string}
     */
    public static function peelVariants(string $class): array
    {
        $variants = [];
        $rest = $class;
        $changed = true;

        while ($changed) {
            $changed = false;

            // `max-[900px]:` — en grænse Tailwinds egen skala ikke har et navn
            // til. Den kan ikke stå på en liste, så den genkendes på sin form.
            if (preg_match('/^((?:max|min)-\[[^\]]+\]):/', $rest, $m)) {
                $variants[] = $m[1];
                $rest = substr($rest, strlen($m[0]));

                continue;
            }

            foreach (static::variantNames() as $name) {
                $needle = $name.':';

                if (str_starts_with($rest, $needle)) {
                    $variants[] = $name;
                    $rest = substr($rest, strlen($needle));
                    $changed = true;
                    break;
                }
            }
        }

        return [$variants, $rest];
    }

    /**
     * @return list<string>
     */
    protected static function variantNames(): array
    {
        $keys = array_merge(
            array_keys(static::VARIANT_MEDIA),
            array_keys(static::VARIANT_PSEUDO)
        );

        usort($keys, fn (string $a, string $b) => strlen($b) <=> strlen($a));

        return $keys;
    }

    /**
     * @return list<string>
     */
    public static function classes(string $html): array
    {
        $html = preg_replace('/\{\{[\s\S]*?\}\}/', ' ', $html) ?? $html;
        $out = [];

        if (! preg_match_all('/\bclass\s*=\s*"([^"]*)"/i', $html, $matches)) {
            return [];
        }

        foreach ($matches[1] as $attr) {
            foreach (preg_split('/\s+/', trim($attr)) ?: [] as $class) {
                if ($class === '' || $class === '[' || $class === ']') {
                    continue;
                }

                $out[] = $class;
            }
        }

        return array_values(array_unique($out));
    }

}
