<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Collection;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;
use Statamic\Fields\Field;
use Statamic\Fields\Fields;

/**
 * Every variable a section template can print, as a flat list to pick from.
 *
 * Three groups, because that is how you look for one: the section you are
 * editing, the page it sits on, and the site around it. The names are the
 * point — a handle you can read off a blueprint is not the same as knowing
 * it is spelled `site_settings.phone` in Antlers.
 *
 * Globals carry their real values, read here. Section and page values are
 * whatever is in the open form right now, so the client fills those in.
 */
class DataVars
{
    /** Fields that are looped over rather than printed. */
    public const LOOP_TYPES = [
        'assets',
        'grid',
        'replicator',
        'list',
        'entries',
        'terms',
        'users',
        'taxonomy',
        'collections',
        'array',
        'table',
    ];

    /** A single asset field prints one file; the loop is still how you reach `url`. */
    public const ASSET_TYPES = ['assets'];

    /**
     * Fieldtypes that draw something in the Control Panel and store nothing —
     * a tab, a divider, a preview of another field. There is no variable to
     * write for them, so listing them is only noise.
     *
     * Statamic's own are recognised by `localizable() === false`. Addon ones
     * often set no flags at all, so `data_vars.skip` in the config takes the
     * rest without a release here.
     */
    public const SKIP_TYPES = [
        'section',
        'tab',
        'revealer',
        'spacer',
        'html',
        'import',
    ];

    /** Whether a field is worth offering as something to print. */
    protected static function skip(Field $field): bool
    {
        $type = $field->type();

        if (in_array($type, static::SKIP_TYPES, true)) {
            return true;
        }

        if (in_array($type, (array) config('statamic-visual-editor.data_vars.skip', []), true)) {
            return true;
        }

        return $field->fieldtype()?->localizable() === false;
    }

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
                static::walkAll(
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

        return static::walk($config['fields'] ?? []);
    }

    /**
     * A field list, flattened, with what is nested inside grids and replicators.
     *
     * The nested rows are what makes this worth having: `list` on its own says
     * nothing, and the `icon` inside it is the handle you were looking for. They
     * carry their parent so the menu can show where they live, and print as the
     * bare handle — which is correct, because you write them inside the loop.
     *
     * @return list<array<string, mixed>>
     */
    protected static function walk(array $fields, int $depth = 0, string $parent = '', string $prefix = ''): array
    {
        return static::walkAll(new Fields($fields), $depth, $parent, $prefix);
    }

    /**
     * The same, for a Fields instance — what a blueprint hands back.
     *
     * @return list<array<string, mixed>>
     */
    protected static function walkAll(Fields $fields, int $depth = 0, string $parent = '', string $prefix = '', array $values = []): array
    {
        if ($depth > 2) {
            return [];
        }

        $out = [];

        foreach ($fields->all() as $handle => $field) {
            if (str_starts_with($handle, '_') || static::skip($field)) {
                continue;
            }

            $config = $field->config();
            $type = $field->type();

            // A group is a path, not a loop: its fields are reached as
            // `link.url` from wherever the group itself is reachable. So it
            // contributes a prefix and no row of its own.
            if ($type === 'group') {
                $out = array_merge($out, static::walkAll(
                    new Fields($config['fields'] ?? []),
                    $depth + 1,
                    $parent,
                    $prefix.$handle.'.',
                    is_array($values[$handle] ?? null) ? $values[$handle] : []
                ));

                continue;
            }

            $row = static::row($prefix.$handle, $field, $values[$handle] ?? null);

            if ($parent !== '') {
                $row['parent'] = $parent;
            }

            $out[] = $row;

            // A loop is the other kind: its fields print as bare handles, but
            // only inside it, so they carry where they live instead of a path.
            $inside = trim($parent === '' ? $prefix.$handle : $parent.' › '.$prefix.$handle);

            if ($type === 'grid') {
                $out = array_merge($out, static::walk($config['fields'] ?? [], $depth + 1, $inside));

                continue;
            }

            if ($type === 'replicator') {
                foreach (static::flattenSets($config['sets'] ?? []) as $name => $set) {
                    $out = array_merge($out, static::walk(
                        $set['fields'] ?? [],
                        $depth + 1,
                        $inside.' › '.$name
                    ));
                }
            }
        }

        return static::dedupe($out);
    }

    /**
     * One row per variable name. Sets repeat `headline` and `text` constantly,
     * and three identical rows in the menu is three ways to pick the same thing.
     */
    protected static function dedupe(array $rows): array
    {
        $seen = [];
        $out = [];

        foreach ($rows as $row) {
            $key = $row['var'].'|'.($row['parent'] ?? '');

            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;
            $out[] = $row;
        }

        return $out;
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

        return static::withoutPageBuilder(static::walkAll($blueprint->fields()));
    }

    /**
     * An entry's fields without the page builder inside them.
     *
     * The builder is what the Section tab is for, and it is the biggest field on
     * the blueprint by a wide margin — every set, every row, unfolded. Left in,
     * it buries the handful of fields the tab exists to show.
     *
     * @param  list<array<string, mixed>>  $rows
     * @return list<array<string, mixed>>
     */
    protected static function withoutPageBuilder(array $rows): array
    {
        $skip = (string) config('statamic-visual-editor.previews.field', 'page_sections');

        return array_values(array_filter(
            $rows,
            fn ($row) => $row['var'] !== $skip && ! str_starts_with((string) ($row['parent'] ?? ''), $skip)
        ));
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

    /**
     * Where a chain of loops lands: the names that print inside the innermost one.
     *
     * A template's scope is decided by what it is standing in. Inside
     * `{{ collection:services }}` the handles are a service entry's, and the
     * section's own fields are not what you are looking for. The chain is read
     * off the template, outermost first, and walked here the same way Antlers
     * walks it.
     *
     * A replicator set is not a step: `{{ list }}` puts you inside the rows, and
     * which set a row is decides what is on it, not another loop to open.
     *
     * @param  list<array{kind: string, handle: string}>  $chain
     * @return array{label: string, items: list<array<string, mixed>>, core: list<array<string, string>>}|null
     *   Null when the chain leads somewhere with no fields to offer — the menu
     *   then shows what it always showed rather than an empty tab.
     */
    public static function scopeFields(string $collection, string $set, array $chain): ?array
    {
        $chain = array_values(array_filter(
            $chain,
            fn ($step) => is_array($step) && ($step['handle'] ?? '') !== ''
        ));

        if (! $chain) {
            return null;
        }

        $at = 0;
        $fields = null;
        $label = '';
        $core = [];
        $entry = false;

        // A collection starts the scope over: nothing around it is in the rows
        // it prints. The innermost one is the one you are standing in.
        for ($i = count($chain) - 1; $i >= 0; $i--) {
            if (($chain[$i]['kind'] ?? '') !== 'collection') {
                continue;
            }

            $entries = Collection::findByHandle($chain[$i]['handle']);

            if (! $entries) {
                return null;
            }

            $at = $i + 1;
            $fields = $entries->entryBlueprint()?->fields();
            $label = $entries->title();
            $core = static::entryCore();
            $entry = true;
            break;
        }

        if ($fields === null && $at === 0) {
            $config = static::setConfig($collection, $set);

            if (! $config) {
                return null;
            }

            $fields = new Fields($config['fields'] ?? []);
        }

        for ($count = count($chain); $at < $count; $at++) {
            $step = static::stepInto($fields, (string) $chain[$at]['handle']);

            if (! $step) {
                return null;
            }

            $fields = $step['fields'];
            $label = $step['label'];
            $core = $step['core'];
            $entry = $step['entry'];
        }

        $items = $fields ? static::walkAll($fields) : [];

        if ($entry) {
            $items = static::withoutPageBuilder($items);
        }

        /*
         * A blueprint that spells out `slug` itself leaves Statamic's own row
         * with nothing to add — two rows writing the same tag is two ways to
         * pick one thing. Only the names in reach here count: a `url` down
         * inside some nested loop is a different variable entirely.
         */
        $named = array_column(array_filter($items, fn ($row) => ! isset($row['parent'])), 'var');
        $core = array_values(array_filter($core, fn ($row) => ! in_array($row['var'], $named, true)));

        if (! $items && ! $core) {
            return null;
        }

        return [
            'label' => $label,
            'items' => $items,
            'core' => $core,
        ];
    }

    /**
     * One step down a loop chain: the field named, and what its rows hold.
     *
     * Only the types a template can actually open a pair on get a step. Anything
     * else — a text field someone looped over by mistake, a fieldtype this does
     * not know — returns null, and the caller falls back rather than guessing.
     *
     * @return array{fields: ?Fields, label: string, core: list<array<string, string>>, entry: bool}|null
     */
    protected static function stepInto(?Fields $fields, string $handle): ?array
    {
        $field = $fields?->all()->get($handle);

        if (! $field) {
            return null;
        }

        $config = $field->config();
        $label = $field->display() ?: $handle;

        if ($field->type() === 'grid') {
            return ['fields' => new Fields($config['fields'] ?? []), 'label' => $label, 'core' => [], 'entry' => false];
        }

        if ($field->type() === 'replicator' || $field->type() === 'bard') {
            return ['fields' => static::setFields($config['sets'] ?? []), 'label' => $label, 'core' => [], 'entry' => false];
        }

        if ($field->type() === 'entries') {
            $handles = array_values(array_filter((array) ($config['collections'] ?? [])));
            $entries = $handles ? Collection::findByHandle($handles[0]) : null;

            if (! $entries) {
                return null;
            }

            return [
                'fields' => $entries->entryBlueprint()?->fields(),
                'label' => $label,
                'core' => static::entryCore(),
                'entry' => true,
            ];
        }

        if ($field->type() === 'assets') {
            return ['fields' => null, 'label' => $label, 'core' => static::assetCore(), 'entry' => false];
        }

        return null;
    }

    /**
     * Every set's fields as one list — what a row inside a replicator can hold.
     *
     * Sets repeat `headline` and `text` constantly, and the first one to claim a
     * handle keeps it: two rows spelling the same tag is two ways to pick one.
     */
    protected static function setFields(array $sets): Fields
    {
        $merged = [];

        foreach (static::flattenSets($sets) as $set) {
            foreach ($set['fields'] ?? [] as $item) {
                $handle = $item['handle'] ?? null;

                if ($handle !== null && ! isset($merged[$handle])) {
                    $merged[$handle] = $item;
                }
            }
        }

        return new Fields(array_values($merged));
    }

    /** The replicator set config for `$set`, found anywhere in the sets tree. */
    protected static function setConfig(string $collection, string $set): ?array
    {
        $entry = Collection::findByHandle($collection);

        if (! $entry) {
            return null;
        }

        $field = $entry->entryBlueprint()?->fields()->all()->get(
            config('statamic-visual-editor.previews.field', 'page_sections')
        );

        foreach (static::flattenSets($field?->config()['sets'] ?? []) as $handle => $config) {
            if ($handle === $set) {
                return $config;
            }
        }

        return null;
    }

    /** Sets may be grouped; the handles are one flat namespace either way. */
    protected static function flattenSets(array $sets): array
    {
        $out = [];

        foreach ($sets as $handle => $config) {
            if (isset($config['sets']) && is_array($config['sets'])) {
                $out += static::flattenSets($config['sets']);

                continue;
            }

            $out[$handle] = $config;
        }

        return $out;
    }

    /** One pickable row: what to write, what it is, and what is in it. */
    protected static function row(string $var, Field $field, mixed $value = null): array
    {
        $type = $field->type();

        $row = [
            'var' => $var,
            'label' => $field->display() ?: $var,
            'type' => $type,
        ];

        // Only what is true is sent. A row carrying `loop: false` and
        // `value: null` reads, in the menu's code, exactly like one that says
        // nothing — and costs a field on every row to say it.
        if (in_array($type, static::LOOP_TYPES, true)) {
            $row['loop'] = true;
        }

        $preview = $value === null ? '' : static::preview($value);

        if ($preview !== '') {
            $row['value'] = $preview;
        }

        return $row;
    }

    /** A value shortened to something that fits on one row of a menu. */
    public static function preview(mixed $value): string
    {
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if (is_scalar($value)) {
            $text = trim(preg_replace('/\s+/', ' ', (string) $value));

            return mb_strlen($text) > 60 ? mb_substr($text, 0, 60).'…' : $text;
        }

        if (is_array($value)) {
            return count($value).' ×';
        }

        return '';
    }
}
