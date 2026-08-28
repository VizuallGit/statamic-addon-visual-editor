<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * PARKED — not called. Compile is commented out in SectionTemplateController.
 * Rewrite later; the last version leaked utilities into `{{ style_push }}`.
 *
 * CSS for Tailwind classes in a section's HTML pane, without Vite or a CDN.
 *
 * Spacing, color, type and font utilities come from the site's `@theme` in
 * `site.css` — `py-900` is `var(--spacing-900)`, not default Tailwind
 * `spacing × 900`. Arbitrary values (`bg-[#333]`) still compile. Custom
 * `@utility` names stay with `site.css` and are skipped here.
 */
class TailwindBake
{
    /** @var array<string, string> */
    protected const STATIC = [
        'relative' => 'position:relative',
        'absolute' => 'position:absolute',
        'fixed' => 'position:fixed',
        'sticky' => 'position:sticky',
        'static' => 'position:static',
        'block' => 'display:block',
        'inline' => 'display:inline',
        'inline-block' => 'display:inline-block',
        'flex' => 'display:flex',
        'inline-flex' => 'display:inline-flex',
        'grid' => 'display:grid',
        'hidden' => 'display:none',
        'flex-row' => 'flex-direction:row',
        'flex-col' => 'flex-direction:column',
        'flex-wrap' => 'flex-wrap:wrap',
        'items-start' => 'align-items:flex-start',
        'items-center' => 'align-items:center',
        'items-end' => 'align-items:flex-end',
        'items-stretch' => 'align-items:stretch',
        'justify-start' => 'justify-content:flex-start',
        'justify-center' => 'justify-content:center',
        'justify-end' => 'justify-content:flex-end',
        'justify-between' => 'justify-content:space-between',
        'justify-around' => 'justify-content:space-around',
        'text-left' => 'text-align:left',
        'text-center' => 'text-align:center',
        'text-right' => 'text-align:right',
        'w-full' => 'width:100%',
        'h-full' => 'height:100%',
        'w-screen' => 'width:100vw',
        'h-screen' => 'height:100vh',
        'overflow-hidden' => 'overflow:hidden',
        'overflow-auto' => 'overflow:auto',
        'pointer-events-none' => 'pointer-events:none',
        'underline' => 'text-decoration-line:underline',
        'italic' => 'font-style:italic',
        'font-bold' => 'font-weight:700',
        'font-medium' => 'font-weight:500',
        'uppercase' => 'text-transform:uppercase',
        'truncate' => 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
        'z-10' => 'z-index:10',
        'z-20' => 'z-index:20',
        'z-50' => 'z-index:50',
    ];

    /** @var array<string, string> */
    protected const BOX = [
        'p' => 'padding',
        'px' => 'padding-inline',
        'py' => 'padding-block',
        'pt' => 'padding-top',
        'pr' => 'padding-right',
        'pb' => 'padding-bottom',
        'pl' => 'padding-left',
        'm' => 'margin',
        'mx' => 'margin-inline',
        'my' => 'margin-block',
        'mt' => 'margin-top',
        'mr' => 'margin-right',
        'mb' => 'margin-bottom',
        'ml' => 'margin-left',
        'gap' => 'gap',
        'gap-x' => 'column-gap',
        'gap-y' => 'row-gap',
        'inset' => 'inset',
        'top' => 'top',
        'right' => 'right',
        'bottom' => 'bottom',
        'left' => 'left',
        'w' => 'width',
        'h' => 'height',
        'min-w' => 'min-width',
        'min-h' => 'min-height',
        'max-w' => 'max-width',
        'max-h' => 'max-height',
        'text' => 'font-size',
        'leading' => 'line-height',
        'rounded' => 'border-radius',
    ];

    /** @var array<string, string> */
    protected const COLOR = [
        'bg' => 'background-color',
        'text' => 'color',
        'border' => 'border-color',
        'outline' => 'outline-color',
        'fill' => 'fill',
        'stroke' => 'stroke',
        'decoration' => 'text-decoration-color',
        'accent' => 'accent-color',
        'caret' => 'caret-color',
    ];

    public static function fromHtml(string $html): string
    {
        $skip = static::customUtilities();
        $rules = [];

        foreach (static::classes($html) as $class) {
            if (isset($skip[$class]) || isset($rules[$class])) {
                continue;
            }

            $decl = static::declaration($class);

            if ($decl !== null) {
                $rules[$class] = static::selector($class).'{'.$decl.'}';
            }
        }

        return implode('', $rules);
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

    protected static function declaration(string $class): ?string
    {
        if (isset(static::STATIC[$class])) {
            return static::STATIC[$class];
        }

        $split = static::splitClass($class);

        if ($split === null) {
            return null;
        }

        [$prefix, $rest] = $split;

        if (str_starts_with($rest, '[') && str_ends_with($rest, ']')) {
            return static::arbitrary($prefix, substr($rest, 1, -1));
        }

        if (preg_match('/^\(--([a-zA-Z0-9_-]+)\)$/', $rest, $m)) {
            return static::arbitraryVar($prefix, $m[1]);
        }

        return static::themed($prefix, $rest);
    }

    /**
     * @return array{0: string, 1: string}|null
     */
    protected static function splitClass(string $class): ?array
    {
        foreach (static::prefixes() as $prefix) {
            $needle = $prefix.'-';

            if (str_starts_with($class, $needle) && strlen($class) > strlen($needle)) {
                return [$prefix, substr($class, strlen($needle))];
            }
        }

        return null;
    }

    /**
     * @return list<string>
     */
    protected static function prefixes(): array
    {
        $keys = array_unique(array_merge(
            array_keys(static::BOX),
            array_keys(static::COLOR),
            ['font']
        ));

        usort($keys, fn (string $a, string $b) => strlen($b) <=> strlen($a));

        return $keys;
    }

    protected static function themed(string $prefix, string $token): ?string
    {
        $tokens = static::themeTokens();

        if (in_array($token, ['px', 'auto', 'full', 'screen'], true) && isset(static::BOX[$prefix])) {
            return static::BOX[$prefix].':'.static::keywordValue($prefix, $token);
        }

        if ($prefix === 'text') {
            if (isset($tokens['text'][$token])) {
                return 'font-size:var(--text-'.$token.')';
            }

            if (isset($tokens['color'][$token])) {
                return 'color:var(--color-'.$token.')';
            }

            return null;
        }

        if (isset(static::COLOR[$prefix]) && isset($tokens['color'][$token])) {
            return static::COLOR[$prefix].':var(--color-'.$token.')';
        }

        if ($prefix === 'font' && isset($tokens['font'][$token])) {
            return 'font-family:var(--font-'.$token.')';
        }

        if ($prefix === 'leading' && isset($tokens['leading'][$token])) {
            return 'line-height:var(--leading-'.$token.')';
        }

        if (isset(static::BOX[$prefix]) && isset($tokens['spacing'][$token])) {
            return static::BOX[$prefix].':var(--spacing-'.$token.')';
        }

        return null;
    }

    protected static function keywordValue(string $prefix, string $token): string
    {
        return match ($token) {
            'px' => '1px',
            'auto' => 'auto',
            'full' => '100%',
            default => in_array($prefix, ['w', 'min-w', 'max-w'], true) ? '100vw' : '100vh',
        };
    }

    protected static function arbitrary(string $prefix, string $value): ?string
    {
        $value = static::arbitraryValue($value);

        if ($value === null) {
            return null;
        }

        if (preg_match('/^#|^rgb|^hsl|^oklch|^var\(--color/', $value)) {
            if (isset(static::COLOR[$prefix])) {
                return static::COLOR[$prefix].':'.$value;
            }
        }

        if (isset(static::BOX[$prefix])) {
            return static::BOX[$prefix].':'.$value;
        }

        if (isset(static::COLOR[$prefix])) {
            return static::COLOR[$prefix].':'.$value;
        }

        return null;
    }

    protected static function arbitraryVar(string $prefix, string $name): ?string
    {
        $value = 'var(--'.$name.')';

        if (isset(static::COLOR[$prefix])) {
            return static::COLOR[$prefix].':'.$value;
        }

        if (isset(static::BOX[$prefix])) {
            return static::BOX[$prefix].':'.$value;
        }

        return null;
    }

    protected static function arbitraryValue(string $raw): ?string
    {
        $raw = trim($raw);

        if ($raw === '' || str_contains($raw, '{') || str_contains($raw, '}')) {
            return null;
        }

        if (preg_match('/^#[0-9a-fA-F]{3,8}$/', $raw)) {
            return $raw;
        }

        if (preg_match('/^-?[0-9.]+(?:px|rem|em|%|vh|vw|ch|svh|lvh|dvh|svw|lvw|dvw)$/', $raw)) {
            return $raw;
        }

        if (preg_match('/^var\(--[a-zA-Z0-9_-]+\)$/', $raw)) {
            return $raw;
        }

        return null;
    }

    protected static function selector(string $class): string
    {
        return '.'.preg_replace_callback('/[^a-zA-Z0-9_-]/', fn ($m) => '\\'.$m[0], $class);
    }

    /**
     * @return array<string, array<string, true>>
     */
    protected static function themeTokens(): array
    {
        $css = TailwindTheme::css();
        $out = [
            'color' => [],
            'spacing' => [],
            'text' => [],
            'leading' => [],
            'font' => [],
            'radius' => [],
        ];

        if (preg_match_all(
            '/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:/',
            $css,
            $m,
            PREG_SET_ORDER
        )) {
            foreach ($m as $row) {
                $out[$row[1]][$row[2]] = true;
            }
        }

        return $out;
    }

    /**
     * @return array<string, true>
     */
    protected static function customUtilities(): array
    {
        $css = TailwindTheme::css();
        $skip = [];

        if (preg_match_all('/@utility\s+([a-zA-Z0-9_-]+)/', $css, $m)) {
            foreach ($m[1] as $name) {
                $skip[$name] = true;
            }
        }

        return $skip;
    }
}
