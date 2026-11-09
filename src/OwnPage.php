<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Statamic\Facades\Blink;
use Statamic\Facades\Blueprint;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Fieldset;
use Statamic\Facades\YAML;

/**
 * "Own page": a page given a blueprint and a template of its own, out of the
 * shared page blueprint and its sections — a landing page, a page unlike the
 * others. Its file is edited in HTML Build and on Build's canvas like any
 * template, and its texts become fields of its own blueprint (TemplateFields),
 * visible ones: the page is its own entry.
 *
 * Made from the top bar's Blueprint drawer (lp-blueprint.js). The blueprint is
 * a copy of the one the page has, read off disk, without the sections field
 * (the page no longer draws sections), hidden from Create; the template starts
 * with the page's title. The entry names both: Statamic's own rule then draws
 * it with them (`Entry::template()`: the entry's `template:` wins). Its
 * sections stay in its file — Statamic merges a form's values into an entry
 * and keeps what the blueprint no longer has — so nothing is lost.
 *
 * Shown on the Templates board in a "Pages" row of its own and on the site
 * canvas beside the templates, and opened in the dock on the page itself.
 */
final class OwnPage
{
    /**
     * Whether the entry is an own page: it names its own template, no
     * collection draws its entries with that file, no other page names it,
     * and no other page is edited with its blueprint.
     */
    public static function is($entry): bool
    {
        $view = static::viewOf($entry);

        if ($view === null) {
            return false;
        }

        foreach (Collection::all() as $collection) {
            if ($collection->template() === $view) {
                return false;
            }
        }

        $root = $entry->root()->id();
        $others = fn ($query) => $query->get()->contains(fn ($other) => $other->root()->id() !== $root);

        return ! $others(Entry::query()->where('template', $view))
            && ! $others(Entry::query()->where('collection', $entry->collectionHandle())->where('blueprint', (string) $entry->blueprint()?->handle()));
    }

    /** The view an entry names for itself, when it is one of the site's pages (not the editor's stores). */
    protected static function viewOf($entry): ?string
    {
        if (! $entry || in_array($entry->collectionHandle(), Stores::all(), true)) {
            return null;
        }

        // A localization takes its origin's template (Entry::template()): the root names it.
        $view = $entry->root()->get('template');

        return is_string($view) && $view !== '' && TemplateBoard::safeView(trim($view, '/')) ? trim($view, '/') : null;
    }

    /**
     * Every own page, with its template — the board's "Pages" row and the
     * site canvas.
     *
     * @return list<array{entry: mixed, view: string}>
     */
    public static function all(): array
    {
        $stores = Stores::all();
        $found = [];

        foreach (Entry::all() as $entry) {
            // Most pages name no template of their own: only those are asked the rest.
            if (! $entry->get('template') || in_array($entry->collectionHandle(), $stores, true) || $entry->hasOrigin() || ! static::is($entry)) {
                continue;
            }

            $found[] = ['entry' => $entry, 'view' => static::viewOf($entry)];
        }

        usort($found, fn ($a, $b) => strnatcasecmp((string) $a['entry']->value('title'), (string) $b['entry']->value('title')));

        return $found;
    }

    /**
     * Whether the entry could be made an own page here: a page of the site,
     * not one already, edited with a blueprint the site owns.
     */
    public static function canMake($entry): bool
    {
        if (! $entry || in_array($entry->collectionHandle(), Stores::all(), true) || $entry->hasOrigin() || static::is($entry)) {
            return false;
        }

        $blueprint = $entry->blueprint();

        return $blueprint !== null && ! $blueprint->isNamespaced() && is_file((string) $blueprint->path());
    }

    /**
     * The page's own blueprint and template, and the page named with them.
     *
     * @return ?array{blueprint: string, view: string} null when nothing was made
     */
    public static function make($entry): ?array
    {
        if (! static::canMake($entry)) {
            return null;
        }

        $collection = $entry->collectionHandle();
        $from = $entry->blueprint();
        $contents = YAML::file($from->path())->parse();
        $sections = SectionField::of($from);
        $stripped = static::withoutField($contents, $sections);

        if ($stripped === null) {
            return null;
        }

        $base = Str::slug((string) ($entry->slug() ?: $entry->value('title') ?: 'page')) ?: 'page';
        [$handle, $view] = static::names($collection, $base);
        $title = (string) ($entry->value('title') ?: $entry->slug());

        Arr::pull($stripped, 'hide');
        Arr::pull($stripped, 'order');
        $stripped['title'] = $title;

        $blueprint = Blueprint::make($handle)
            ->setNamespace('collections.'.$collection)
            ->setHidden(true)
            ->setContents($stripped);
        $blueprint->save();

        // Read back: the copy holds every field but the sections. Otherwise it goes again.
        $written = $blueprint->path();

        if (! is_file($written) || static::count(YAML::file($written)->parse()) !== static::count($stripped)) {
            File::delete($written);

            return null;
        }

        // The collection's blueprints were read earlier in this request
        // (canMake), before this one existed: the entry would not find it.
        Blink::forget('collection-entry-blueprints-'.$collection);
        Blink::forget('collection-entry-blueprint-'.$collection.'-'.$handle);

        $file = resource_path('views/'.$view.'.antlers.html');

        try {
            File::ensureDirectoryExists(dirname($file));

            if (File::put($file, static::starter()) === false) {
                throw new \RuntimeException("The view {$view} could not be written.");
            }

            // `blueprint:` is in the page's data too, read from its file; the data wins on save.
            $entry->blueprint($handle)->set('blueprint', $handle)->set('template', $view)->save();
        } catch (\Throwable $error) {
            // Nothing half-made is left behind: the page stays as it was.
            // (names() made sure neither file was there before.)
            File::delete([$written, $file]);

            throw $error;
        }

        // A working copy carries the page's data as it was, `blueprint:` and
        // `template:` too, and the form and Live Preview are drawn from it.
        if (method_exists($entry, 'hasWorkingCopy') && $entry->hasWorkingCopy()) {
            $copy = $entry->workingCopy();
            $attributes = $copy->attributes();
            $attributes['data'] = array_merge((array) ($attributes['data'] ?? []), ['blueprint' => $handle, 'template' => $view]);
            $copy->attributes($attributes)->save();
        }

        return ['blueprint' => 'collections.'.$collection.'.'.$handle, 'view' => $view];
    }

    /**
     * Free names for the blueprint and the view: `about-us` → `about_us` and
     * `pages/about-us`, numbered while either is taken — never a file written
     * over, never a collection's `index` or `show`.
     *
     * @return array{0: string, 1: string}
     */
    protected static function names(string $collection, string $base): array
    {
        for ($number = 1; ; $number++) {
            $slug = $number === 1 ? $base : $base.'-'.$number;
            $handle = str_replace('-', '_', $slug);
            $handle = preg_match('/^[a-z]/', $handle) ? $handle : 'page_'.$handle;
            $view = $collection.'/'.$slug;
            $taken = in_array($slug, TemplateBoard::SOURCE_SLOTS, true)
                || Blueprint::find('collections.'.$collection.'.'.$handle) !== null
                || TemplateBoard::viewFile($view) !== null;

            if (! $taken && TemplateBoard::safeView($view)) {
                return [$handle, $view];
            }
        }
    }

    /**
     * The contents without the sections field — a field by that handle, or the
     * import that brings it. Null when a tab would be left without sections or
     * with an empty one: the shape that empties an entry's data on its next save.
     */
    protected static function withoutField(array $contents, string $handle): ?array
    {
        $tabs = $contents['tabs'] ?? null;

        if (! is_array($tabs) || $tabs === []) {
            return null;
        }

        foreach ($tabs as $tabKey => $tab) {
            $sections = is_array($tab) ? ($tab['sections'] ?? null) : null;

            if (! is_array($sections) || $sections === []) {
                return null;
            }

            foreach ($sections as $sectionKey => $section) {
                if (! is_array($section) || $section === []) {
                    return null;
                }

                $fields = is_array($section['fields'] ?? null) ? $section['fields'] : [];
                $section['fields'] = array_values(array_filter($fields, fn ($field) => ! static::bringsField($field, $handle)));
                $contents['tabs'][$tabKey]['sections'][$sectionKey] = $section;
            }
        }

        return $contents;
    }

    /** A blueprint's field entry is the field, or an import with it among its fields. */
    protected static function bringsField(mixed $field, string $handle): bool
    {
        if (! is_array($field)) {
            return false;
        }

        if (($field['handle'] ?? null) === $handle) {
            return true;
        }

        $import = $field['import'] ?? null;

        if (! is_string($import) || $import === '') {
            return false;
        }

        $prefix = (string) ($field['prefix'] ?? '');
        $fieldset = Fieldset::find($import);

        return $fieldset !== null && $fieldset->fields()->all()->keys()->contains(fn ($key) => $prefix.$key === $handle);
    }

    /** How many field entries the contents hold, tab by tab. */
    protected static function count(array $contents): int
    {
        $count = 0;

        foreach ((array) ($contents['tabs'] ?? []) as $tab) {
            foreach ((array) (is_array($tab) ? ($tab['sections'] ?? []) : []) as $section) {
                $count += count(array_filter((array) (is_array($section) ? ($section['fields'] ?? []) : []), 'is_array'));
            }
        }

        return $count;
    }

    /**
     * What the page's file starts with: nothing. An empty file is a page with
     * nothing on it yet — the HTML tree says so and Build adds the first
     * element at the top of the file.
     */
    protected static function starter(): string
    {
        return '';
    }
}
