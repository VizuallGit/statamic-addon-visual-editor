<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Statamic\Facades\Collection;
use Statamic\Facades\Fieldset;
use Statamic\Facades\User;
use Statamic\Fields\Fields;
use Statamic\Support\Arr;

/**
 * Fresh meta + defaults for a single Replicator set, so a section inserted from
 * the visual picker renders in the Control Panel's own section list — not just
 * in the preview.
 *
 * Statamic's Replicator renders each row from `meta.<field>.existing[<id>]`, not
 * from the row's values alone. Adding a row through `setFieldValue` updates the
 * value (the preview re-renders) but leaves the Replicator with no meta for the
 * new row, so it never appears in the CP list. This returns the same `new`
 * (per-row meta) and `defaults` shapes Statamic's own ReplicatorSetController
 * produces, which the client then writes with `setFieldMeta`.
 *
 * Unlike core's endpoint this takes a collection handle instead of an encrypted
 * blueprint token — it sits behind the CP auth middleware and resolves the
 * blueprint itself, so it also works for sets hidden from the native picker
 * (e.g. `global_section`).
 */
class SectionMetaController
{
    public function __invoke(Request $request)
    {
        abort_unless(User::current(), 403);

        $request->validate([
            'collection' => ['required', 'string'],
            'set' => ['required', 'string'],
            // A nested replicator field (e.g. a section's own `blocks`) rather than
            // the top-level page-builder field — for the in-preview block inserter.
            'field' => ['nullable', 'string'],
        ]);

        $collection = Collection::findByHandle($request->collection);

        abort_unless($collection, 404);

        $blueprint = $collection->entryBlueprint();

        if ($request->filled('field')) {
            // Found anywhere in the blueprint tree, so a replicator nested inside a
            // section set resolves the same as a top-level one.
            $config = $this->findReplicatorConfig($blueprint->contents(), $request->field);
            $parentField = $blueprint->fields()->all()->get(config('statamic-visual-editor.previews.field', 'page_sections'));
        } else {
            $fieldHandle = config('statamic-visual-editor.previews.field', 'page_sections');
            $parentField = $blueprint->fields()->all()->get($fieldHandle);
            $config = $parentField?->config();
        }

        abort_unless($config, 404);

        $sets = $this->flattenSets($config['sets'] ?? []);
        $set = $sets[$request->set] ?? null;

        abort_unless($set, 404);

        $fields = new Fields(
            items: $set['fields'],
            parentField: $parentField,
            parentIndex: -1,
        );

        $defaults = $fields->all()
            ->map(fn ($field) => $field->fieldtype()->preProcess($field->defaultValue()))
            ->all();

        $new = $fields->addValues($defaults)->meta()->put('_', '_')->toArray();

        return response()->json(compact('new', 'defaults'));
    }

    /**
     * The config of the replicator field with this handle, found anywhere in the
     * blueprint tree — so a replicator nested inside a section set (a section's own
     * `blocks`) resolves as readily as a top-level one. Returns the field config
     * (the part carrying `sets`), or null.
     */
    private function findReplicatorConfig($node, string $handle, int $depth = 0): ?array
    {
        if ($depth > 14 || ! is_array($node)) {
            return null;
        }

        foreach (($node['tabs'] ?? []) as $tab) {
            if ($found = $this->findReplicatorConfig($tab, $handle, $depth + 1)) {
                return $found;
            }
        }

        foreach (($node['sections'] ?? []) as $section) {
            if ($found = $this->findReplicatorConfig($section, $handle, $depth + 1)) {
                return $found;
            }
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            if (isset($item['import'])) {
                $fieldset = Fieldset::find($item['import']);

                if ($fieldset && $found = $this->findReplicatorConfig($fieldset->contents(), $handle, $depth + 1)) {
                    return $found;
                }

                continue;
            }

            $field = $item['field'] ?? null;

            if (! is_array($field)) {
                continue;
            }

            if (($item['handle'] ?? null) === $handle && isset($field['sets'])) {
                return $field;
            }

            foreach (($field['sets'] ?? []) as $group) {
                foreach (($group['sets'] ?? []) as $set) {
                    if ($found = $this->findReplicatorConfig($set, $handle, $depth + 1)) {
                        return $found;
                    }
                }
            }

            if (isset($field['fields']) && $found = $this->findReplicatorConfig($field, $handle, $depth + 1)) {
                return $found;
            }
        }

        return null;
    }

    /**
     * Flattens Statamic's grouped set config (`sets: { group: { sets: {...} } }`)
     * to a flat `handle => set` map.
     */
    private function flattenSets(array $sets): array
    {
        if (! Arr::has(Arr::first($sets), 'sets')) {
            return $sets;
        }

        return collect($sets)
            ->flatMap(fn (array $group): array => $group['sets'] ?? [])
            ->all();
    }
}
