<?php

namespace MarioHamann\StatamicVisualEditor\DataVars;

use Statamic\Facades\Collection;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;

/**
 * Where the rows come from: the section open in the dock, a collection's
 * entry blueprint, and every global set with its real values.
 * Moved verbatim out of DataVars in WP7d.
 */
final class Sources
{
    /**
     * Every global set, with the values it actually holds in this site.
     *
     * Printed with a dot — `{{ site_settings.phone }}` — because that reaches
     * the value from anywhere, including inside a loop, where the tag syntax
     * would collide with the loop's own scope.
     *
     * @return list<array{handle: string, label: string, items: list<array<string, mixed>>}>
     */
    public static function globals(): array
    {
        $out = [];
        $site = Site::current()->handle();

        foreach (GlobalSet::all() as $set) {
            $localized = $set->in($site) ?? $set->inDefaultSite();

            if (! $localized) {
                continue;
            }

            $blueprint = $set->blueprint();

            if (! $blueprint) {
                continue;
            }

            /*
             * Top level and groups only. A global's repeater rows are reached by
             * looping over it, and a `handle` that appears once per set in the
             * repeater lands in this list five times with no way to tell them
             * apart. The loop field itself is here; what is inside it is read
             * where you write the loop.
             */
            $items = array_values(array_filter(
                Rows::walkAll(
                    $blueprint->fields(),
                    0,
                    '',
                    $set->handle().'.',
                    $localized->values()->all()
                ),
                fn ($row) => ! isset($row['parent'])
            ));

            if ($items) {
                $out[] = [
                    'handle' => $set->handle(),
                    'label' => $set->title(),
                    'items' => $items,
                ];
            }
        }

        return $out;
    }

    /**
     * The fields on one replicator set — the section open in the dock.
     *
     * @return list<array<string, mixed>>
     */
    public static function sectionFields(string $collection, string $set): array
    {
        $config = static::setConfig($collection, $set);

        if (! $config) {
            return [];
        }

        return Rows::walk($config['fields'] ?? []);
    }

    /**
     * A collection's entry fields — for a template that loops over them.
     *
     * @return list<array<string, mixed>>
     */
    public static function collectionFields(string $handle): array
    {
        $collection = Collection::findByHandle($handle);

        if (! $collection) {
            return [];
        }

        $blueprint = $collection->entryBlueprint();

        if (! $blueprint) {
            return [];
        }

        return Rows::withoutPageBuilder(Rows::walkAll($blueprint->fields()));
    }

    /** The replicator set config for `$set`, found anywhere in the sets tree. */
    public static function setConfig(string $collection, string $set): ?array
    {
        $entry = Collection::findByHandle($collection);

        if (! $entry) {
            return null;
        }

        $field = $entry->entryBlueprint()?->fields()->all()->get(
            config('statamic-visual-editor.previews.field', 'page_sections')
        );

        foreach (Rows::flattenSets($field?->config()['sets'] ?? []) as $handle => $config) {
            if ($handle === $set) {
                return $config;
            }
        }

        return null;
    }
}
