<?php

namespace MarioHamann\StatamicVisualEditor\Listeners;

use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Stores;
use Statamic\Events\EntryBlueprintFound;

/**
 * The Preview-as field only lists entries from the template's source collection.
 *
 * Our blueprint, in memory — Statamic's entries field is not wrapped.
 */
class ScopeTemplatePreviewAs
{
    public function handle(EntryBlueprintFound $event): void
    {
        if (! Features::enabled('collection_templates')) {
            return;
        }

        $entry = $event->entry;

        if (! $entry || $entry->collectionHandle() !== Stores::collectionTemplates()) {
            return;
        }

        $source = $entry->get('source_collection');
        if (is_array($source)) {
            $source = $source[0] ?? '';
        }

        if (! is_string($source) || $source === '') {
            return;
        }

        $event->blueprint->setContents(
            static::scope($event->blueprint->contents(), $source)
        );
    }

    public static function scope(array $contents, string $source): array
    {
        foreach ($contents['tabs'] ?? [] as $tabHandle => $tab) {
            foreach ($tab['sections'] ?? [] as $sectionIndex => $section) {
                foreach ($section['fields'] ?? [] as $fieldIndex => $field) {
                    if (($field['handle'] ?? '') !== 'preview_as') {
                        continue;
                    }

                    if (! isset($field['field']) || ! is_array($field['field'])) {
                        continue;
                    }

                    $contents['tabs'][$tabHandle]['sections'][$sectionIndex]['fields'][$fieldIndex]['field']['collections'] = [$source];
                }
            }
        }

        return $contents;
    }
}
