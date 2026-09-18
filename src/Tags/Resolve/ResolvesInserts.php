<?php

namespace MarioHamann\StatamicVisualEditor\Tags\Resolve;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\BlueprintFields;

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
     * The replicator this tag is on, found inside the section being rendered.
     *
     * A field handle is only unique within its set. Half the page-builder
     * sections call their block field `blocks`, so searching the blueprint for
     * the bare handle returns whichever one comes first in the file — another
     * section's field, with another section's set types and another section's
     * limits. The set being rendered is in the context as `type`, so the search
     * starts there and only falls back to the whole tree when that fails.
     */
    protected function replicatorConfig(string $fieldHandle): ?array
    {
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
