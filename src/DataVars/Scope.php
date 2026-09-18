<?php

namespace MarioHamann\StatamicVisualEditor\DataVars;

use Statamic\Facades\Collection;
use Statamic\Fields\Fields;

/**
 * Where a chain of loops lands: the names that print inside the innermost
 * one, walked the same way Antlers walks it.
 * Moved verbatim out of DataVars in WP7d.
 */
final class Scope
{
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
            $core = Builtins::entryCore();
            $entry = true;
            break;
        }

        if ($fields === null && $at === 0) {
            $config = Sources::setConfig($collection, $set);

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

        $items = $fields ? Rows::walkAll($fields) : [];

        if ($entry) {
            $items = Rows::withoutPageBuilder($items);
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
                'core' => Builtins::entryCore(),
                'entry' => true,
            ];
        }

        if ($field->type() === 'assets') {
            return ['fields' => null, 'label' => $label, 'core' => Builtins::assetCore(), 'entry' => false];
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

        foreach (Rows::flattenSets($sets) as $set) {
            foreach ($set['fields'] ?? [] as $item) {
                $handle = $item['handle'] ?? null;

                if ($handle !== null && ! isset($merged[$handle])) {
                    $merged[$handle] = $item;
                }
            }
        }

        return new Fields(array_values($merged));
    }
}
