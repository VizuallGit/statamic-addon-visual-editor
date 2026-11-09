<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Statamic\Events\BlueprintDeleting;
use Statamic\Events\BlueprintSaving;
use Statamic\Events\FieldsetDeleting;
use Statamic\Events\FieldsetSaving;
use Statamic\Facades\Blueprint as BlueprintFacade;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\User;
use Statamic\Facades\YAML;
use Statamic\Fields\Blueprint;

/**
 * A warning before a page builder is taken away from pages that use it.
 *
 * A blueprint's sections field (the page's sections: `page_sections`, or a
 * Replicator with "The page's sections" on, SectionField) holds every section
 * of every page edited with it. Removed from the blueprint — or from the
 * fieldset it is imported from, or with the whole blueprint or fieldset — the
 * pages keep their rows but nothing draws them right any more: Patterns, the
 * block tree and the HTML tree lose the list, and the templates' loops get
 * sections nothing describes.
 *
 * So the first save that would do it is stopped with what it would cost —
 * the field, how many pages, the first few by name — in Statamic's own error
 * (a validation error from its own Saving/Deleting event, so its screens are
 * untouched). The same save again within five minutes, by the same person, is
 * taken as meant and goes through: a warning, not a lock (the owner, 9 Nov
 * 2026). Nothing is said when no page holds a section in the field, nor to
 * code saving on its own (no one signed in).
 */
final class SectionFieldGuard
{
    /** How long a warning stands: the same save again within it goes through. */
    public const CONFIRM_SECONDS = 300;

    /** How many pages are named before the rest are counted. */
    public const NAMED = 3;

    public static function blueprintSaving(BlueprintSaving $event): void
    {
        if (! static::watching()) {
            return;
        }

        $blueprint = $event->blueprint;
        $before = static::onDisk($blueprint);

        if (! $before || ! SectionField::in($before)) {
            return;
        }

        $field = SectionField::of($before);

        if (SectionField::in($blueprint) && SectionField::of($blueprint) === $field) {
            return;
        }

        static::guard('blueprint:'.$blueprint->fullyQualifiedHandle().':'.$field, $field, static::pagesOf($blueprint, $field), false);
    }

    public static function blueprintDeleting(BlueprintDeleting $event): void
    {
        if (! static::watching()) {
            return;
        }

        $blueprint = $event->blueprint;

        if (! SectionField::in($blueprint)) {
            return;
        }

        $field = SectionField::of($blueprint);

        static::guard('blueprint-delete:'.$blueprint->fullyQualifiedHandle(), $field, static::pagesOf($blueprint, $field), true);
    }

    public static function fieldsetSaving(FieldsetSaving $event): void
    {
        if (! static::watching()) {
            return;
        }

        $fieldset = $event->fieldset;
        $path = $fieldset->path();

        if (! is_string($path) || ! is_file($path)) {
            return;
        }

        $before = static::sectionsFieldsIn(FieldsetFields::flatten((array) YAML::file($path)->parse()));
        $after = array_column(array_filter(FieldsetFields::flatten($fieldset->contents()), 'is_array'), 'handle');

        foreach (array_diff($before, $after) as $field) {
            static::guard('fieldset:'.$fieldset->handle().':'.$field, $field, static::pagesThrough($fieldset->handle(), $field), false);
        }
    }

    public static function fieldsetDeleting(FieldsetDeleting $event): void
    {
        if (! static::watching()) {
            return;
        }

        $fieldset = $event->fieldset;

        foreach (static::sectionsFieldsIn(FieldsetFields::flatten($fieldset->contents())) as $field) {
            static::guard('fieldset-delete:'.$fieldset->handle().':'.$field, $field, static::pagesThrough($fieldset->handle(), $field), true);
        }
    }

    /**
     * Only a person's save or delete is warned — in the Control Panel or Live
     * Preview's drawer. What code does on its own (a command, a test, an
     * addon's own write) is meant, and nobody would see the warning.
     */
    private static function watching(): bool
    {
        return User::current() !== null;
    }

    /**
     * The blueprint as its file has it, before this save: the event carries the
     * new contents. Under a handle of its own — Statamic keeps a blueprint's
     * contents for the rest of the request by its handle (Blink), and the copy
     * read first would answer for the one being saved too. Only read here,
     * never saved. Null for a blueprint that has no file yet.
     */
    private static function onDisk(Blueprint $blueprint): ?Blueprint
    {
        $path = $blueprint->path();

        if (! is_string($path) || ! is_file($path)) {
            return null;
        }

        $contents = YAML::file($path)->parse();

        return BlueprintFacade::make($blueprint->handle().'__sve_before_save')
            ->setNamespace($blueprint->namespace())
            ->setContents(is_array($contents) ? $contents : []);
    }

    /**
     * The Replicators in a fieldset's own fields that are a page builder: one
     * with "The page's sections" on, or the one with the default name.
     *
     * @return list<string>
     */
    private static function sectionsFieldsIn(array $fields): array
    {
        $found = [];

        foreach ($fields as $item) {
            $config = is_array($item['field'] ?? null) ? $item['field'] : null;
            $handle = $item['handle'] ?? null;

            if (! is_string($handle) || ! $config || ($config['type'] ?? null) !== 'replicator') {
                continue;
            }

            if (($config[SectionField::KEY] ?? false) === true || $handle === SectionField::fallback()) {
                $found[] = $handle;
            }
        }

        return $found;
    }

    /**
     * The pages that hold sections in the field: entries of the blueprint's
     * collection edited with it (named in their data, or by default the
     * collection's first), each with at least one row in the field.
     *
     * @return list<string> their titles
     */
    private static function pagesOf(Blueprint $blueprint, string $field): array
    {
        $namespace = (string) $blueprint->namespace();

        if (! str_starts_with($namespace, 'collections.')) {
            return [];
        }

        $collection = Collection::findByHandle(Str::after($namespace, 'collections.'));

        if (! $collection) {
            return [];
        }

        $handle = $blueprint->handle();
        $default = $collection->entryBlueprints()->first()?->handle();

        return Entry::query()
            ->where('collection', $collection->handle())
            ->get()
            ->filter(fn ($entry) => ($entry->get('blueprint') ?: $default) === $handle && count(array_filter((array) $entry->get($field))) > 0)
            ->map(fn ($entry) => (string) ($entry->value('title') ?: $entry->slug()))
            ->unique()
            ->values()
            ->all();
    }

    /**
     * The pages that hold sections in a fieldset's field: through every
     * collection blueprint that imports the fieldset (with its prefix) or
     * names the field (`field: fieldset.field`).
     *
     * @return list<string>
     */
    private static function pagesThrough(string $fieldset, string $field): array
    {
        $pages = [];

        foreach (Collection::all() as $collection) {
            foreach ($collection->entryBlueprints() as $blueprint) {
                foreach (static::handlesFor($blueprint->contents(), $fieldset, $field) as $handle) {
                    $pages = array_merge($pages, static::pagesOf($blueprint, $handle));
                }
            }
        }

        return array_values(array_unique($pages));
    }

    /**
     * Where a blueprint keeps a fieldset's field: the handle it has there.
     *
     * @return list<string>
     */
    private static function handlesFor(array $contents, string $fieldset, string $field): array
    {
        $handles = [];

        foreach ((array) ($contents['tabs'] ?? []) as $tab) {
            foreach ((array) (is_array($tab) ? ($tab['sections'] ?? []) : []) as $section) {
                foreach ((array) (is_array($section) ? ($section['fields'] ?? []) : []) as $item) {
                    if (! is_array($item)) {
                        continue;
                    }

                    if (($item['import'] ?? null) === $fieldset) {
                        $handles[] = ($item['prefix'] ?? '').$field;
                    } elseif (($item['field'] ?? null) === $fieldset.'.'.$field && is_string($item['handle'] ?? null)) {
                        $handles[] = $item['handle'];
                    }
                }
            }
        }

        return $handles;
    }

    /**
     * Stopped the first time, with what it would cost; the same again from the
     * same person within CONFIRM_SECONDS goes through.
     *
     * @param  list<string>  $pages
     */
    private static function guard(string $what, string $field, array $pages, bool $deleting): void
    {
        if ($pages === []) {
            return;
        }

        $key = 'sve:sections-guard:'.(User::current()?->id() ?? 'guest').':'.md5($what);

        if (Cache::pull($key)) {
            return;
        }

        Cache::put($key, true, static::CONFIRM_SECONDS);

        $named = array_slice($pages, 0, static::NAMED);
        $more = count($pages) - count($named);
        $names = implode(', ', $named).($more > 0 ? ' '.trans('sve::messages.sections_guard_more', ['count' => $more]) : '');

        throw ValidationException::withMessages([
            'sve_sections' => [trans_choice($deleting ? 'sve::messages.sections_guard_delete' : 'sve::messages.sections_guard', count($pages), [
                'field' => Str::ucfirst(str_replace('_', ' ', $field)),
                'count' => count($pages),
                'pages' => $names,
            ])],
        ]);
    }
}
