<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\File;

/**
 * Structured data (schema.org JSON-LD) for this site's pages.
 *
 * What it is: a block of JSON in a `<script type="application/ld+json">` that
 * tells a search engine what the page *is* — a business with an address and
 * opening hours, an article with an author, a list of questions and answers.
 * Google reads it to build rich results; nobody sees it on the page.
 *
 * Two levels, and both are sent:
 *
 * - `site`  — the standing description of the organisation behind the site.
 *             The same on every page, because it is true on every page.
 * - `entry` — what this one page is, when it is something in its own right.
 *
 * Site data, not addon data: it lives in this site's storage next to the
 * comments, the same way content does. Nothing here is written to a blueprint,
 * so turning the feature off leaves no field behind in anyone's forms.
 */
class SchemaStore
{
    public const SITE_KEY = 'site';

    /** Big enough for a long FAQ, small enough that nobody pastes a document. */
    public const MAX_BYTES = 100000;

    public static function root(): string
    {
        return storage_path('statamic-visual-editor/schema');
    }

    /** The raw JSON-LD saved for one key, or an empty string. */
    public static function get(string $key): string
    {
        $path = static::path($key);

        return $path && File::exists($path) ? (string) File::get($path) : '';
    }

    public static function put(string $key, string $json): void
    {
        $path = static::path($key);

        if (! $path) {
            return;
        }

        if (trim($json) === '') {
            if (File::exists($path)) {
                File::delete($path);
            }

            return;
        }

        if (! File::isDirectory(dirname($path))) {
            File::makeDirectory(dirname($path), 0755, true);
        }

        File::put($path, $json);
    }

    /**
     * Every block that belongs on one page: the site's, then the page's.
     *
     * @return list<string>
     */
    public static function forPage(?string $entryId): array
    {
        $out = [];

        foreach ([static::SITE_KEY, $entryId] as $key) {
            if (! is_string($key) || $key === '') {
                continue;
            }

            $json = trim(static::get($key));

            if ($json !== '') {
                $out[] = $json;
            }
        }

        return $out;
    }

    /**
     * Is this valid JSON-LD, and what is wrong with it if not?
     *
     * Accepts a bare object, an array of objects, and a `<script>` tag pasted
     * straight off another site — the last one is what people actually have in
     * their hands, and refusing it teaches them nothing.
     *
     * @return array{ok: bool, json: string, error: ?string}
     */
    public static function validate(string $input): array
    {
        $json = trim(static::unwrap($input));

        if ($json === '') {
            return ['ok' => true, 'json' => '', 'error' => null];
        }

        if (strlen($json) > static::MAX_BYTES) {
            return ['ok' => false, 'json' => '', 'error' => __('sve::messages.schema_too_big')];
        }

        $decoded = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return ['ok' => false, 'json' => '', 'error' => json_last_error_msg()];
        }

        if (! is_array($decoded)) {
            return ['ok' => false, 'json' => '', 'error' => __('sve::messages.schema_not_object')];
        }

        // Re-encoded from the parsed value: that normalises the formatting and,
        // more to the point, means what gets written is something this server
        // has already parsed rather than a string it is passing along unread.
        $encoded = json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        return ['ok' => true, 'json' => is_string($encoded) ? $encoded : '', 'error' => null];
    }

    /** The JSON inside a pasted `<script type="application/ld+json">` tag. */
    protected static function unwrap(string $input): string
    {
        if (preg_match('/<script[^>]*>(.*?)<\/script>/is', $input, $m)) {
            return $m[1];
        }

        return $input;
    }

    protected static function path(string $key): ?string
    {
        $safe = preg_replace('/[^A-Za-z0-9._-]/', '', $key) ?? '';

        // A key that sanitises to nothing, or to a dot-path, is not a key.
        if ($safe === '' || $safe !== $key || str_contains($safe, '..')) {
            return null;
        }

        return static::root().'/'.$safe.'.json';
    }
}
