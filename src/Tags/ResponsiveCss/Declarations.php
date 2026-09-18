<?php

namespace MarioHamann\StatamicVisualEditor\Tags\ResponsiveCss;

/**
 * The CSS declarations one breakpoint's values become.
 * Moved verbatim out of ResponsiveCss in WP7d.
 */
final class Declarations
{
    /** @param  array<string, array<string, mixed>>  $fields */
    public static function declarations(array $fields, string $breakpoint): string
    {
        $out = '';

        foreach ($fields as $handle => $byBreakpoint) {
            if (! array_key_exists($breakpoint, $byBreakpoint)) {
                continue;
            }

            $value = $byBreakpoint[$breakpoint];

            if ($value === null || $value === '' || $value === []) {
                continue;
            }

            $out .= static::declaration($handle, $value);
        }

        return $out;
    }

    /** Ét felts værdi som CSS — enten en custom property eller feltets egen partial. */
    protected static function declaration(string $handle, $value): string
    {
        $view = 'partials/responsive/'.$handle;

        if (view()->exists($view)) {
            $css = trim(view($view, ['value' => $value, 'handle' => $handle])->render());

            if ($css === '' || preg_match('/:\s*;?\s*$/', $css) || preg_match('/:\s*%\s*;?\s*$/', $css)) {
                return '';
            }

            return $css;
        }

        if (is_array($value) || $value instanceof \Traversable) {
            return '';
        }

        if ($value === null || $value === '') {
            return '';
        }

        $css = '--'.str_replace('_', '-', $handle).': '.$value.';';

        if (preg_match('/:\s*;?\s*$/', $css) || preg_match('/:\s*%\s*;?\s*$/', $css)) {
            return '';
        }

        return $css;
    }
}
