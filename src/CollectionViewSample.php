<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Contracts\Entries\Collection as CollectionContract;
use Statamic\Contracts\Entries\Entry as EntryContract;
use Statamic\Facades\Entry;

/**
 * A throwaway entry shaped like the collection's blueprint, never saved.
 *
 * Show-preview needs *some* values when the collection is still empty.
 */
class CollectionViewSample
{
    public static function entry(CollectionContract $collection): EntryContract
    {
        $blueprint = $collection->entryBlueprint();
        $title = 'Sample '.$collection->title();
        $data = ['title' => $title];

        if ($blueprint) {
            foreach ($blueprint->fields()->all() as $field) {
                $handle = $field->handle();

                if ($handle === 'slug' || $handle === 'title' || isset($data[$handle])) {
                    continue;
                }

                if ($value = static::valueFor($field->type(), $field->display() ?: $handle)) {
                    $data[$handle] = $value;
                }
            }
        }

        return Entry::make()
            ->id('sve-sample-'.$collection->handle())
            ->collection($collection->handle())
            ->locale($collection->sites()->first() ?? 'default')
            ->published(true)
            ->slug('sample')
            ->data($data);
    }

    protected static function valueFor(string $type, string $label): mixed
    {
        return match ($type) {
            'text', 'textarea', 'markdown', 'html' => $label,
            'integer', 'float', 'range' => 1,
            'toggle', 'revealer' => true,
            'date' => now()->toDateString(),
            default => null,
        };
    }
}
