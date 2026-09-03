<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * What Statamic says about itself, for the AI chat.
 *
 * Statamic ships a guidelines file for Laravel Boost — folder structure,
 * collections vs. taxonomies, blueprints vs. fieldsets, Antlers vs. Blade,
 * the `please` CLI. It is written by the people who built the CMS, it ships
 * inside the installed version, and without it the chat knows this site's
 * house style perfectly and nothing about the framework underneath it.
 *
 * Read from vendor rather than copied here on purpose: a copy would be a
 * second thing to keep current, and it would describe whichever Statamic we
 * happened to look at rather than the one this site is running.
 *
 * Boost is not required. It reads the same file from the same place; this
 * only means the chat does not have to wait for a site to install it.
 */
class StatamicGuidelines
{
    /** Nothing to say is a valid answer — an older Statamic ships no such file. */
    public static function text(): string
    {
        if (! config('statamic-visual-editor.ai.statamic_guidelines', true)) {
            return '';
        }

        $path = static::path();

        if (! $path || ! is_file($path)) {
            return '';
        }

        return static::toMarkdown((string) file_get_contents($path));
    }

    public static function path(): ?string
    {
        $configured = config('statamic-visual-editor.ai.statamic_guidelines_path');

        if (is_string($configured) && $configured !== '') {
            return $configured;
        }

        $vendor = base_path('vendor/statamic/cms/resources/boost/guidelines/core.blade.php');

        return is_file($vendor) ? $vendor : null;
    }

    /**
     * The Blade file as plain markdown.
     *
     * Not rendered through Blade: this runs inside a chat request, the file
     * belongs to another package, and a compile error in it must not be able to
     * take the chat down. The only directives it uses are `@verbatim` fences
     * around code samples, which are markup for Blade's benefit and noise for a
     * reader — so they come out.
     */
    public static function toMarkdown(string $blade): string
    {
        $out = preg_replace('/^[ \t]*@(?:end)?verbatim[ \t]*$\n?/m', '', $blade);

        return trim((string) $out);
    }
}
