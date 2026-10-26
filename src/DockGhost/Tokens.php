<?php

namespace MarioHamann\StatamicVisualEditor\DockGhost;

use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\SiteClasses;
use MarioHamann\StatamicVisualEditor\TailwindTheme;

/**
 * The site's own design tokens and class names, as a short word list for the
 * grey text.
 *
 * Without it a model writes Tailwind's defaults — `text-blue-600`, `p-4` —
 * which this site's `@theme` may have switched off (`--color-*: initial`).
 * With it, it writes `text-primary-600` and the site's own `flow-y`.
 *
 * Nothing here is a fixed list: the designer adds colours and classes as
 * they go. The tokens are read from the blocks the dock's Tailwind compiler
 * gets (TailwindTheme); the classes from where the dock's class picker finds
 * them (SiteClasses) — every site CSS file that reaches the page, and the
 * `[ name ]` and `@scope(.name)` the sections write. Read again at most
 * every FRESH seconds, so a class saved a moment ago is in the next
 * suggestions.
 *
 * A scale is said once (`primary-{50,100,…,950}`), not line by line: the
 * list sits in the cached part of the prompt, but it is still read.
 */
final class Tokens
{
    /** Tailwind v4 theme namespaces, and how a class reads each. */
    public const NAMESPACES = [
        'color' => 'Colours (bg-, text-, border-, fill-, …)',
        'text' => 'Text sizes (text-…)',
        'font' => 'Fonts (font-…)',
        'spacing' => 'Spacing (p-, m-, gap-, w-, …)',
        'leading' => 'Line height (leading-…)',
        'tracking' => 'Letter spacing (tracking-…)',
        'radius' => 'Corners (rounded-…)',
        'shadow' => 'Shadows (shadow-…)',
        'breakpoint' => 'Breakpoints (prefix:)',
        'container' => 'Container sizes (max-w-…, @…)',
    ];

    /** Names shown per group before the list is cut. */
    public const MAX = 150;

    /** Seconds the word list is kept before the files are read again. */
    public const FRESH = 15;

    /** The word list for this site as it is now (give or take FRESH seconds). */
    public static function forSite(): string
    {
        return Cache::remember('sve.dock-ghost.tokens', static::FRESH, fn () => static::vocabulary(TailwindTheme::css(), static::siteClasses()));
    }

    /**
     * The class names this site writes itself and that can reach a page: the
     * picker's (CSS files imported into the site's stylesheet) and the
     * sections' own `[ name ]` and `@scope(.name)`. The Control Panel's own
     * stylesheets are not among them.
     *
     * @return list<string>
     */
    public static function siteClasses(): array
    {
        $names = [];

        foreach (SiteClasses::grouped() as $group) {
            foreach ($group['items'] as $item) {
                if ($item['loaded']) {
                    $names[$item['name']] = true;
                }
            }
        }

        foreach (SiteClasses::defined() as $rule) {
            if (in_array($rule['kind'], ['bracket', 'scope'], true)) {
                $names[$rule['name']] = true;
            }
        }

        return array_keys($names);
    }

    /** @param  list<string>  $classes  the site's own class names (siteClasses) */
    public static function vocabulary(string $css, array $classes = []): string
    {
        $groups = [];
        $custom = [];

        foreach (static::blocks($css, '@theme') as $block) {
            preg_match_all('/(?<![\w-])--([a-zA-Z][\w-]*)\s*:/', $block, $matches);

            foreach ($matches[1] as $name) {
                // `--text-lg--line-height` is a setting of `text-lg`, not a token.
                if (str_contains($name, '--')) {
                    continue;
                }

                $namespace = static::namespaceOf($name);

                if ($namespace === null) {
                    $custom['--'.$name] = true;

                    continue;
                }

                $token = substr($name, strlen($namespace) + 1);

                if ($token !== '' && $token !== '*') {
                    $groups[$namespace][$token] = true;
                }
            }
        }

        preg_match_all('/@utility\s+([\w-]+)/', $css, $utilities);

        $lines = [];

        foreach (static::NAMESPACES as $namespace => $label) {
            if (! empty($groups[$namespace])) {
                $lines[] = "{$label}: ".static::compact(array_keys($groups[$namespace]));
            }
        }

        $own = array_values(array_unique(array_merge($utilities[1], $classes)));

        if ($own !== []) {
            $lines[] = "The site's own classes (its CSS files and sections): ".static::compact($own);
        }

        if ($custom !== []) {
            $lines[] = 'Custom properties, for var(--…): '.static::compact(array_keys($custom));
        }

        if ($lines === []) {
            return '';
        }

        return "These are the site's tokens (site.css @theme). Use these names; do not write Tailwind's default colours, sizes or fonts.\n"
            .implode("\n", $lines);
    }

    /** Which theme namespace a variable belongs to, or null for the site's own. */
    protected static function namespaceOf(string $name): ?string
    {
        foreach (array_keys(static::NAMESPACES) as $namespace) {
            if ($name === $namespace || str_starts_with($name, $namespace.'-')) {
                return $namespace;
            }
        }

        return null;
    }

    /**
     * Names with a scale folded: `primary primary-50 … primary-950` becomes
     * `primary, primary-{50,…,950}`.
     *
     * @param  list<string>  $names
     */
    public static function compact(array $names): string
    {
        $scales = [];
        $plain = [];

        foreach ($names as $name) {
            if (preg_match('/^(.+)-(\d+)$/', $name, $match)) {
                $scales[$match[1]][] = $match[2];
            } else {
                $plain[] = $name;
            }
        }

        $out = [];

        foreach ($plain as $name) {
            $out[] = $name;
        }

        foreach ($scales as $stem => $steps) {
            $out[] = count($steps) === 1 ? "{$stem}-{$steps[0]}" : "{$stem}-{".implode(',', $steps).'}';
        }

        if (count($out) > static::MAX) {
            $out = array_slice($out, 0, static::MAX);
            $out[] = '…';
        }

        return implode(', ', $out);
    }

    /**
     * The `$at { … }` blocks of a stylesheet, braces balanced.
     *
     * @return list<string>
     */
    protected static function blocks(string $css, string $at): array
    {
        $out = [];
        $offset = 0;

        while (($start = strpos($css, $at, $offset)) !== false) {
            $open = strpos($css, '{', $start);

            if ($open === false) {
                break;
            }

            $depth = 0;
            $length = strlen($css);

            for ($i = $open; $i < $length; $i++) {
                if ($css[$i] === '{') {
                    $depth++;
                } elseif ($css[$i] === '}' && --$depth === 0) {
                    break;
                }
            }

            $out[] = substr($css, $open + 1, $i - $open - 1);
            $offset = $i + 1;
        }

        return $out;
    }
}
