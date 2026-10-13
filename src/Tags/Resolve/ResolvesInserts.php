<?php

namespace MarioHamann\StatamicVisualEditor\Tags\Resolve;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\BlueprintFields;
use Statamic\Fields\Value;

/**
 * What a `+` may insert here: the replicator config behind a field, its sets
 * and its max. Needs `$this->context`. Moved verbatim out of Tags\VisualEdit
 * in WP7c.
 */
trait ResolvesInserts
{
    /** @var array<string, array|null> */
    private static array $replicatorByHandle = [];

    /**
     * The replicator this tag is on.
     *
     * The field's own value carries its Field: Statamic resolved exactly which
     * replicator this is while augmenting the row — the right section, the
     * right nested set, references and imports included. So a set added to the
     * fieldset is in the "+" list on the next render, wherever the field sits.
     *
     * Searching the blueprint by name cannot do that. A handle is only unique
     * within its set, and `type` in the context is the row being rendered, not
     * the section: inside hero/style_2's `content` block it is `content`, and
     * the first set called `content` in the blueprint belonged to another
     * section — so the hero's "+" offered that section's blocks. The search
     * below is only for a context that holds no Value (plain arrays passed in).
     */
    protected function replicatorConfig(string $fieldHandle): ?array
    {
        $value = $this->context->get($fieldHandle);
        $config = $value instanceof Value ? $value->field()?->config() : null;

        if (is_array($config['sets'] ?? null)) {
            return $config;
        }

        $page = $this->context->get('page');
        $blueprint = ($page && method_exists($page, 'blueprint')) ? $page->blueprint() : null;

        if (! $blueprint) {
            return null;
        }

        $setType = (string) ($this->context->get('type') ?? '');
        $cacheKey = spl_object_id($blueprint).'|'.$fieldHandle.'|'.$setType;

        if (array_key_exists($cacheKey, self::$replicatorByHandle)) {
            return self::$replicatorByHandle[$cacheKey];
        }

        $contents = $blueprint->contents();

        if ($setType !== '' && $set = ReplicatorLookups::findSetConfig($contents, $setType)) {
            if ($found = ReplicatorLookups::findReplicatorConfig($set, $fieldHandle)) {
                return self::$replicatorByHandle[$cacheKey] = $found;
            }
        }

        return self::$replicatorByHandle[$cacheKey] = ReplicatorLookups::findReplicatorConfig($contents, $fieldHandle);
    }

    /**
     * The replicator's `max_sets`, when it has one.
     *
     * The preview's "+" is the addon's own control, not Statamic's Add Set
     * button, so nothing stopped it offering a third block to a field capped at
     * two — the cap was only ever consulted by the row toolbar's Add another.
     * Emitted alongside the set types, from the same config lookup, so the "+"
     * can simply not be drawn once the field is full.
     */
    protected function resolveInsertMax(string $fieldHandle): ?int
    {
        try {
            $max = $this->replicatorConfig($fieldHandle)['max_sets'] ?? null;

            return ($max === null || $max === '') ? null : (int) $max;
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve insert max for '.$fieldHandle, ['exception' => $e]);

            return null;
        }
    }

    /**
     * The set types a replicator field allows, as [{handle, display}], read from
     * the blueprint — so the block inserter offers exactly what the field permits,
     * nothing hardcoded.
     */
    protected function resolveInsertSets(string $fieldHandle): array
    {
        try {
            $config = $this->replicatorConfig($fieldHandle);

            if (! $config) {
                return [];
            }

            $out = [];

            foreach ($this->flattenReplicatorSets($config['sets'] ?? []) as $handle => $set) {
                $out[] = [
                    'handle' => $handle,
                    'display' => $set['display'] ?? Str::headline($handle),
                    'icon' => $set['icon'] ?? null,
                    'image' => $set['image'] ?? null,
                ];
            }

            return $out;
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve insert sets for '.$fieldHandle, ['exception' => $e]);

            return [];
        }
    }
}
