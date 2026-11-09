<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\SectionTypeMaker\AddField;
use Statamic\Facades\Blueprint;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\YAML;
use Statamic\Fields\Blueprint as BlueprintObject;

/**
 * An element of a template made editable: "Editable in Edit Content" on a view
 * file in Vizuall Build — a cases template, an own page's file.
 *
 * A section's field joins its fieldset ({@see AddField}). A template has none:
 * the entries it draws are edited with their blueprints, so the field joins
 * those. A cases template's text is the template's for every case, and each
 * case is its own entry — so a normal, visible field, never a hidden one as in
 * a section. Build makes it only when "Editable" is switched on (the owner's
 * decision of 9 Nov 2026), not on the first change as in sections.
 *
 * What the element held is the field's default. Statamic prints a field's
 * default for an entry without a value (`Fields\Value::value()`, measured on
 * 6.35), so every entry already drawn with the template keeps showing it and
 * no entry is written.
 *
 * The blueprint is read off disk and written as a new one — never the object
 * Statamic hands out, which listeners change at runtime. A copy is kept first,
 * and nothing is written unless every tab still has its sections and the field
 * count grew by exactly one: a tab left with an empty section once emptied a
 * global's data on the next save (memory project-blueprint-emptied).
 */
final class TemplateFields
{
    /** Names an entry uses for itself: a field by one of them would stand in for it. */
    public const RESERVED = [
        'id', 'slug', 'uri', 'url', 'permalink', 'date', 'blueprint', 'template', 'layout',
        'collection', 'published', 'status', 'origin', 'parent', 'site', 'locale', 'mount',
        'order', 'edit_url', 'last_modified', 'updated_at', 'updated_by', 'author', 'type', 'enabled',
    ];

    /**
     * The blueprints a view's fields join, seen from the entry open in Live
     * Preview. Empty when there is none a field could join.
     *
     * - The entry's own `template:` is the view, and no other entry is edited
     *   with its blueprint: that blueprint (an own page — its file is its own).
     * - Else every blueprint of every collection drawn with the view: the
     *   collection's template, open on a case or on the template's own entry.
     *
     * @return list<BlueprintObject>
     */
    public static function blueprints(string $view, $entry): array
    {
        $view = trim($view, '/');
        $stores = Stores::all();

        if ($view === '' || $view === TemplateBoard::SITE_SLOTS['layout']) {
            return [];
        }

        if ($entry && $entry->get('template') === $view && ! in_array($entry->collectionHandle(), $stores, true)) {
            $blueprint = $entry->blueprint();

            if ($blueprint && static::onlyFor($entry, $blueprint->handle())) {
                return [$blueprint];
            }
        }

        $found = [];

        foreach (Collection::all() as $collection) {
            if (in_array($collection->handle(), $stores, true) || $collection->template() !== $view) {
                continue;
            }

            foreach ($collection->entryBlueprints() as $blueprint) {
                if (! static::drawnElsewhere($collection->handle(), $blueprint->handle(), $view)) {
                    $found[] = $blueprint;
                }
            }
        }

        return $found;
    }

    /**
     * Every entry edited with the blueprint names a template of its own other
     * than the view — an own page's blueprint (Home's, drawn by its own file):
     * a field there would be one the page never prints.
     */
    protected static function drawnElsewhere(string $collection, string $blueprint, string $view): bool
    {
        $entries = Entry::query()->where('collection', $collection)->where('blueprint', $blueprint)->get();

        return $entries->isNotEmpty() && $entries->every(function ($entry) use ($view) {
            $own = $entry->get('template');

            return is_string($own) && $own !== '' && $own !== $view;
        });
    }

    /**
     * The fields the view's entries have, by handle with their type — what
     * makes a tag in an element of the file "a field of its own" in Build's
     * Content, and which of them an element's `visual_edit` may point at.
     *
     * @return list<array{handle: string, type: string}>
     */
    public static function fieldsOf(array $blueprints): array
    {
        $fields = [];

        foreach ($blueprints as $blueprint) {
            foreach ($blueprint->fields()->all() as $handle => $field) {
                $fields[$handle] ??= ['handle' => (string) $handle, 'type' => (string) $field->type()];
            }
        }

        return array_values($fields);
    }

    /**
     * One field more in every blueprint the view stands for, the element's
     * content as its default.
     *
     * @param  string  $kind  one of AddField::KINDS
     * @return ?array{handle: string, blueprints: list<string>} null when nothing was written
     */
    public static function add(string $view, $entry, string $kind, string $name, string $value): ?array
    {
        $config = AddField::config($kind, $value);
        $targets = static::blueprints($view, $entry);

        if ($config === null || $targets === []) {
            return null;
        }

        $read = [];
        $taken = [];

        foreach ($targets as $blueprint) {
            $path = static::path($blueprint);

            if ($path === null) {
                return null;
            }

            $contents = YAML::file($path)->parse();
            $read[] = [$blueprint, $path, $contents];
            $taken = array_merge($taken, static::fields($contents));
        }

        $handle = AddField::handle($name, $taken, self::RESERVED);
        $field = ['handle' => $handle, 'field' => ['type' => $kind, 'display' => Str::title(str_replace('_', ' ', $handle))] + $config];
        $planned = [];

        // Every blueprint is checked before any is written: one refused leaves all as they were.
        foreach ($read as [$blueprint, $path, $contents]) {
            $next = static::withField($contents, $field);

            if ($next === null) {
                return null;
            }

            $planned[] = [$blueprint, $path, $next, count(static::fields($contents))];
        }

        $written = [];

        foreach ($planned as [$blueprint, $path, $next, $before]) {
            $copy = static::keep($path, $blueprint);
            $hidden = Arr::pull($next, 'hide');
            $order = Arr::pull($next, 'order');

            Blueprint::make($blueprint->handle())
                ->setNamespace($blueprint->namespace())
                ->setHidden($hidden === null ? null : (bool) $hidden)
                ->setOrder($order)
                ->setContents($next)
                ->save();

            // What landed on disk, read back: one field more and nothing less, or the copy goes back.
            if (count(static::fields(YAML::file($path)->parse())) !== $before + 1) {
                File::copy($copy, $path);

                return null;
            }

            $written[] = $blueprint->namespace().'.'.$blueprint->handle();
        }

        return ['handle' => $handle, 'blueprints' => $written];
    }

    /** No other entry (a localization is the same page) is edited with the blueprint. */
    protected static function onlyFor($entry, string $handle): bool
    {
        $root = $entry->root()->id();

        return Entry::query()
            ->where('collection', $entry->collectionHandle())
            ->where('blueprint', $handle)
            ->get()
            ->every(fn ($other) => $other->root()->id() === $root);
    }

    /** The blueprint's file, when it is the site's own (an addon's namespaced one is not written). */
    protected static function path(BlueprintObject $blueprint): ?string
    {
        if ($blueprint->isNamespaced()) {
            return null;
        }

        $path = $blueprint->path();

        return is_string($path) && is_file($path) && str_starts_with(realpath($path) ?: '', realpath(resource_path('blueprints')) ?: "\0") ? $path : null;
    }

    /**
     * The contents with the field last in the first tab's last section; null
     * when the blueprint has no such place, or a tab without sections or with an
     * empty one — the shape that empties an entry's data on its next save.
     */
    protected static function withField(array $contents, array $field): ?array
    {
        $tabs = $contents['tabs'] ?? null;

        if (! is_array($tabs) || $tabs === []) {
            return null;
        }

        foreach ($tabs as $tab) {
            $sections = is_array($tab) ? ($tab['sections'] ?? null) : null;

            if (! is_array($sections) || $sections === [] || in_array([], $sections, true)) {
                return null;
            }
        }

        $first = array_key_first($tabs);
        $last = array_key_last($tabs[$first]['sections']);
        $section = $tabs[$first]['sections'][$last];

        if (! is_array($section)) {
            return null;
        }

        $section['fields'] = [...(is_array($section['fields'] ?? null) ? $section['fields'] : []), $field];
        $contents['tabs'][$first]['sections'][$last] = $section;

        return $contents;
    }

    /**
     * Every field entry of the blueprint, as written: `handle` + `field`, or an
     * `import` — Statamic's Fields reads the handles out of them.
     *
     * @return list<array<string, mixed>>
     */
    protected static function fields(array $contents): array
    {
        $fields = [];

        foreach ((array) ($contents['tabs'] ?? []) as $tab) {
            foreach ((array) (is_array($tab) ? ($tab['sections'] ?? []) : []) as $section) {
                foreach ((array) (is_array($section) ? ($section['fields'] ?? []) : []) as $field) {
                    if (is_array($field)) {
                        $fields[] = $field;
                    }
                }
            }
        }

        return $fields;
    }

    /** A copy of the file as it was, under storage/ — the way back if anything goes wrong. */
    protected static function keep(string $path, BlueprintObject $blueprint): string
    {
        $dir = storage_path('sve-blueprint-backups');

        File::ensureDirectoryExists($dir);

        $copy = $dir.'/'.date('Ymd-His').'-'.str_replace(['.', '/'], '-', $blueprint->namespace().'.'.$blueprint->handle()).'.yaml';

        File::copy($path, $copy);

        return $copy;
    }
}
