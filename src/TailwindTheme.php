<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * The `@theme` / `@utility` blocks the dock compiler needs from the site CSS.
 *
 * The browser cannot follow `@import` or `@source`. Those stay with Vite.
 * What it does need is the token map, so `bg-primary` matches `--primary`
 * instead of Tailwind's defaults. A missing file is an empty string — arbitrary
 * values like `bg-[#333333]` still compile.
 */
class TailwindTheme
{
    public static function path(): ?string
    {
        $path = (string) config(
            'statamic-visual-editor.tailwind.css',
            resource_path('css/site.css')
        );

        return is_file($path) ? $path : null;
    }

    public static function css(): string
    {
        $path = static::path();

        if ($path === null) {
            return '';
        }

        $src = (string) file_get_contents($path);
        $out = [];

        foreach (['@theme', '@utility'] as $at) {
            $offset = 0;

            while (($block = static::nextBlock($src, $at, $offset)) !== null) {
                $out[] = $block['css'];
                $offset = $block['end'];
            }
        }

        return implode("\n\n", $out);
    }

    /**
     * @return array{css: string, end: int}|null
     */
    protected static function nextBlock(string $src, string $at, int $from): ?array
    {
        $pos = strpos($src, $at, $from);

        if ($pos === false) {
            return null;
        }

        $brace = strpos($src, '{', $pos);

        if ($brace === false) {
            return null;
        }

        $depth = 0;
        $len = strlen($src);

        for ($i = $brace; $i < $len; $i++) {
            $ch = $src[$i];

            if ($ch === '{') {
                $depth++;
            } elseif ($ch === '}') {
                $depth--;

                if ($depth === 0) {
                    return [
                        'css' => trim(substr($src, $pos, $i - $pos + 1)),
                        'end' => $i + 1,
                    ];
                }
            }
        }

        return null;
    }
}
