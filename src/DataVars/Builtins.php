<?php

namespace MarioHamann\StatamicVisualEditor\DataVars;

use Statamic\Facades\Site;

/**
 * Statamic's own variables — not in any blueprint, always there: the page,
 * the site and request, an entry inside a loop, an asset inside a loop.
 * Moved verbatim out of DataVars in WP7d.
 */
final class Builtins
{
    /**
     * Statamic's own page variables — not in any blueprint, always there.
     *
     * @return list<array<string, string>>
     */
    public static function pageCore(): array
    {
        return [
            ['var' => 'title', 'label' => 'Title', 'type' => 'text'],
            ['var' => 'slug', 'label' => 'Slug', 'type' => 'text'],
            ['var' => 'url', 'label' => 'URL', 'type' => 'text'],
            ['var' => 'permalink', 'label' => 'Permalink', 'type' => 'text'],
            ['var' => 'id', 'label' => 'ID', 'type' => 'text'],
            ['var' => 'date', 'label' => 'Date', 'type' => 'date'],
            ['var' => 'edit_url', 'label' => 'Edit URL', 'type' => 'text'],
            ['var' => 'collection:handle', 'label' => 'Collection handle', 'type' => 'text'],
            ['var' => 'collection:title', 'label' => 'Collection title', 'type' => 'text'],
            ['var' => 'is_entry', 'label' => 'Is an entry', 'type' => 'toggle'],
            ['var' => 'first', 'label' => 'First in loop', 'type' => 'toggle'],
            ['var' => 'last', 'label' => 'Last in loop', 'type' => 'toggle'],
        ];
    }

    /**
     * The site itself and the request — the things that are true on every page.
     *
     * @return list<array<string, string>>
     */
    public static function systemVars(): array
    {
        $site = Site::current();

        return [
            ['var' => 'site:name', 'label' => 'Site name', 'type' => 'text', 'value' => (string) $site->name()],
            ['var' => 'site:handle', 'label' => 'Site handle', 'type' => 'text', 'value' => (string) $site->handle()],
            ['var' => 'site:url', 'label' => 'Site URL', 'type' => 'text', 'value' => (string) $site->url()],
            ['var' => 'site:locale', 'label' => 'Locale', 'type' => 'text', 'value' => (string) $site->locale()],
            ['var' => 'site:short_locale', 'label' => 'Short locale', 'type' => 'text', 'value' => (string) $site->shortLocale()],
            ['var' => 'config:app:name', 'label' => 'App name', 'type' => 'text', 'value' => (string) config('app.name')],
            ['var' => 'config:app:url', 'label' => 'App URL', 'type' => 'text', 'value' => (string) config('app.url')],
            ['var' => 'environment', 'label' => 'Environment', 'type' => 'text', 'value' => (string) app()->environment()],
            ['var' => 'current_url', 'label' => 'Current URL', 'type' => 'text'],
            ['var' => 'current_uri', 'label' => 'Current URI', 'type' => 'text'],
            ['var' => 'current_full_url', 'label' => 'Current full URL', 'type' => 'text'],
            ['var' => 'homepage', 'label' => 'Homepage URL', 'type' => 'text'],
            ['var' => 'segment_1', 'label' => 'First URL segment', 'type' => 'text'],
            ['var' => 'segment_2', 'label' => 'Second URL segment', 'type' => 'text'],
            ['var' => 'now', 'label' => 'Now', 'type' => 'date'],
            ['var' => 'csrf_token', 'label' => 'CSRF token', 'type' => 'text'],
            ['var' => 'logged_in', 'label' => 'Logged in', 'type' => 'toggle'],
        ];
    }

    /**
     * Statamic's own variables inside an entry loop — not in any blueprint.
     *
     * @return list<array<string, string>>
     */
    public static function entryCore(): array
    {
        return [
            ['var' => 'url', 'label' => 'URL', 'type' => 'text'],
            ['var' => 'permalink', 'label' => 'Permalink', 'type' => 'text'],
            ['var' => 'slug', 'label' => 'Slug', 'type' => 'text'],
            ['var' => 'id', 'label' => 'ID', 'type' => 'text'],
            ['var' => 'date', 'label' => 'Date', 'type' => 'date'],
            ['var' => 'first', 'label' => 'First in loop', 'type' => 'toggle'],
            ['var' => 'last', 'label' => 'Last in loop', 'type' => 'toggle'],
            ['var' => 'count', 'label' => 'Number of results', 'type' => 'integer'],
        ];
    }

    /**
     * An asset loop's variables. These come off the file, not a blueprint — the
     * container's own fields are added on top where it has any.
     *
     * @return list<array<string, string>>
     */
    public static function assetCore(): array
    {
        return [
            ['var' => 'url', 'label' => 'URL', 'type' => 'text'],
            ['var' => 'permalink', 'label' => 'Permalink', 'type' => 'text'],
            ['var' => 'alt', 'label' => 'Alt text', 'type' => 'text'],
            ['var' => 'width', 'label' => 'Width', 'type' => 'integer'],
            ['var' => 'height', 'label' => 'Height', 'type' => 'integer'],
            ['var' => 'size', 'label' => 'File size', 'type' => 'text'],
            ['var' => 'extension', 'label' => 'Extension', 'type' => 'text'],
            ['var' => 'basename', 'label' => 'File name', 'type' => 'text'],
            ['var' => 'is_image', 'label' => 'Is an image', 'type' => 'toggle'],
        ];
    }
}
