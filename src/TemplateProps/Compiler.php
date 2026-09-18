<?php

namespace MarioHamann\StatamicVisualEditor\TemplateProps;

use MarioHamann\StatamicVisualEditor\SundayAug30;

/**
 * Turns the author syntax into Antlers Statamic can render (`sve_prop`
 * tags), leaving comments alone.
 * Moved verbatim out of TemplateProps in WP7d.
 */
final class Compiler
{
    /**
     * Statamic's Antlers preparser can pass null (empty field, settings save).
     */
    public static function compile(?string $antlers): string
    {
        $antlers ??= '';

        if (! SundayAug30::enabled()) {
            return $antlers;
        }

        $placeholders = [];
        $masked = preg_replace_callback('/\{\{#.*?#\}\}/s', function (array $m) use (&$placeholders) {
            $key = '___SVE_PROP_CMT_'.count($placeholders).'___';
            $placeholders[$key] = $m[0];

            return $key;
        }, $antlers) ?? $antlers;

        $masked = preg_replace_callback(
            '/\bfrom\s*=\s*(["\'])\:([a-zA-Z_][a-zA-Z0-9_]*)\s*\?\?\s*([a-zA-Z0-9_-]+)\1/',
            fn (array $m) => 'from='.$m[1].'{'.$m[2]." ?? '".$m[3].'\''.'}'.$m[1],
            $masked
        ) ?? $masked;

        $mediaAttr = Parser::mediaAttributePattern();

        $masked = preg_replace_callback(
            '/(:?)('.$mediaAttr.')\s*=\s*(["\'])\:([a-zA-Z_][a-zA-Z0-9_]*)\s*\?\?\s*([a-zA-Z0-9_-]+)\3/',
            function (array $m) {
                $colon = $m[1];
                $quote = $m[3];
                $inner = $quote === '"' ? "'" : '"';
                $call = 'sve_prop prop='.$inner.$m[4].$inner.' fallback='.$inner.$m[5].$inner;

                // Same as :imagePath="image": colon looks up a handle.
                // Not the Asset — Antlers would use it as an array key.
                if ($colon === ':') {
                    return ':'.$m[2].'='.$quote.'{sve_prop:field prop='.$inner.$m[4].$inner.' fallback='.$inner.$m[5].$inner.'}'.$quote;
                }

                return $m[2].'='.$quote.'{{ '.$call.' }}'.$quote;
            },
            $masked
        ) ?? $masked;

        $masked = preg_replace_callback(
            '/\{\{\s*\:([a-zA-Z_][a-zA-Z0-9_]*)\s*\?\?\s*[\'"]([^\'"]*)[\'"]\s*\}\}/',
            function (array $m) {
                $empty = htmlspecialchars($m[2], ENT_QUOTES, 'UTF-8');

                return '{{ sve_prop prop="'.$m[1].'" fallback="'.Parser::inferredFieldHandle($m[1]).'" empty="'.$empty.'" }}';
            },
            $masked
        ) ?? $masked;

        $masked = preg_replace_callback(
            '/\{\{\s*\:([a-zA-Z_][a-zA-Z0-9_]*)\s*\?\?\s*([a-zA-Z0-9_-]+)\s*\}\}/',
            fn (array $m) => '{{ sve_prop prop="'.$m[1].'" fallback="'.$m[2].'" }}',
            $masked
        ) ?? $masked;

        return strtr($masked, $placeholders);
    }
}
