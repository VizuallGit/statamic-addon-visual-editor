<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\Listeners\UseLiteSections;
use Statamic\Facades\Blueprint as BlueprintFacade;
use Statamic\Facades\Collection;
use Statamic\Facades\Fieldset;
use Statamic\Fields\Blueprint;
use Statamic\Support\Str;

/**
 * Which field holds a page's sections.
 *
 * A blueprint says so itself: the one Replicator with "Sidens sektioner"
 * switched on (`sve_sections: true`, appended to Statamic's Replicator by
 * {@see ReplicatorSettings}). A blueprint that marks none uses the field named
 * in `statamic-visual-editor.previews.field` — `page_sections` — which is how
 * every page worked before a field could be marked, and still works unchanged.
 *
 * So a law firm's lawyers can have their own page builder, called what suits
 * it, with sections of their own and none of the pages': the Patterns panel,
 * the block tree and the HTML tree all ask here, and each page gets the answer
 * for its own blueprint.
 *
 * Read off the blueprint's contents rather than its resolved fields: an import
 * (`import: page_sections`) and a field reference (`field: common.blocks`) say
 * which file the list of sets is written in, which the resolved fields no
 * longer do — and that file is where a new section type is registered.
 */
final class SectionField
{
    /** The Replicator config key that marks the page's sections. */
    public const KEY = 'sve_sections';

    /** The field a blueprint's sections live in when it marks none. */
    public static function fallback(): string
    {
        return (string) config('statamic-visual-editor.previews.field', 'page_sections');
    }

    /** The handle of the field holding this blueprint's sections. */
    public static function of($blueprint): string
    {
        return static::locate($blueprint)['handle'] ?? static::fallback();
    }

    /** Whether the blueprint has a sections field at all. */
    public static function in($blueprint): bool
    {
        return static::locate($blueprint) !== null;
    }

    /**
     * The file this blueprint's section types are written in. A blueprint
     * without sections gets the site's own list, as every caller did before.
     */
    public static function listOf($blueprint): SectionList
    {
        return static::locate($blueprint)['list'] ?? SectionList::fallback();
    }

    /**
     * The blueprint a request is about.
     *
     * The Control Panel sends what the page's form told it (`sectionField()`
     * in lib/config.js): the fully qualified handle of the blueprint
     * (`collections.employees.employee`) when the entry has one, and always
     * the collection and the sections field. A collection blueprint is fetched
     * through its collection, the way the entry form gets it. Without a
     * handle, the collection's blueprint holding that field; with neither,
     * the pages collection's page builder — what was always answered.
     */
    public static function blueprintFor(?string $fullyQualifiedHandle, ?string $collection = null, ?string $field = null): ?Blueprint
    {
        $fullyQualifiedHandle = trim((string) $fullyQualifiedHandle);

        if ($fullyQualifiedHandle !== '') {
            if (str_starts_with($fullyQualifiedHandle, 'collections.')) {
                $rest = substr($fullyQualifiedHandle, strlen('collections.'));

                return Collection::findByHandle(Str::beforeLast($rest, '.'))
                    ?->entryBlueprint(Str::afterLast($rest, '.'));
            }

            return BlueprintFacade::find($fullyQualifiedHandle);
        }

        $field = trim((string) $field);

        return PageBuilderBlueprint::for(
            Collection::findByHandle($collection ?: config('statamic-visual-editor.previews.collection', 'pages')),
            $field !== '' ? $field : null,
        );
    }

    /**
     * The marked Replicator, else the one with the default name, as
     * `['handle' => …, 'list' => SectionList]` — or null when the blueprint has
     * neither.
     */
    private static function locate($blueprint): ?array
    {
        if (! $blueprint instanceof Blueprint) {
            return null;
        }

        $marked = null;
        $named = null;
        $fqh = (string) $blueprint->fullyQualifiedHandle();

        foreach (($blueprint->contents()['tabs'] ?? []) as $tab) {
            foreach (($tab['sections'] ?? []) as $section) {
                static::scan(
                    (array) ($section['fields'] ?? []),
                    '',
                    fn (string $field) => SectionList::blueprint($fqh, $field),
                    $marked,
                    $named,
                );
            }
        }

        return $marked ?? $named;
    }

    /**
     * One `fields` list — a blueprint section's or an imported fieldset's.
     *
     * @param  callable(string): SectionList  $listFor  the file these items are written in
     */
    private static function scan(array $fields, string $prefix, callable $listFor, ?array &$marked, ?array &$named, int $depth = 0): void
    {
        if ($depth > 6) {
            return;
        }

        foreach ($fields as $item) {
            if (! is_array($item)) {
                continue;
            }

            if (is_string($item['import'] ?? null) && $item['import'] !== '') {
                $import = $item['import'];

                static::scan(
                    FieldsetFields::of(Fieldset::find($import)),
                    $prefix.($item['prefix'] ?? ''),
                    fn (string $field) => SectionList::fieldset($import, $field),
                    $marked,
                    $named,
                    $depth + 1,
                );

                continue;
            }

            $handle = $item['handle'] ?? null;
            $field = $item['field'] ?? null;

            if (! is_string($handle) || $handle === '') {
                continue;
            }

            if (is_string($field)) {
                // A reference, `field: fieldset.field`: that field's config with
                // this item's overrides, written in the referenced fieldset.
                $fieldset = Str::beforeLast($field, '.');
                $inFile = Str::afterLast($field, '.');
                $config = array_merge(static::referenced($fieldset, $inFile) ?? [], (array) ($item['config'] ?? []));
                $list = SectionList::fieldset($fieldset, $inFile);
            } elseif (is_array($field)) {
                $config = $field;
                $list = $listFor($handle);
            } else {
                continue;
            }

            if (! in_array($config['type'] ?? null, ['replicator', UseLiteSections::TYPE], true)) {
                continue;
            }

            $found = ['handle' => $prefix.$handle, 'list' => $list];

            if (($config[self::KEY] ?? false) === true) {
                $marked ??= $found;
            } elseif ($prefix.$handle === static::fallback()) {
                $named ??= $found;
            }
        }
    }

    /** The raw config of a field in a fieldset, or null. */
    private static function referenced(string $fieldset, string $handle): ?array
    {
        foreach (FieldsetFields::of(Fieldset::find($fieldset)) as $item) {
            if (is_array($item) && ($item['handle'] ?? null) === $handle && is_array($item['field'] ?? null)) {
                return $item['field'];
            }
        }

        return null;
    }
}
