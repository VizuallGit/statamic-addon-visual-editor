<?php

namespace MarioHamann\StatamicVisualEditor\Listeners;

use MarioHamann\StatamicVisualEditor\PanelVisibility;
use MarioHamann\StatamicVisualEditor\Traits\HandlesReplicatorSets;
use Statamic\Events\EntryBlueprintFound;
use Statamic\Events\GlobalVariablesBlueprintFound;
use Statamic\Facades\Fieldset;

class InjectVisualIdIntoBlueprint
{
    use HandlesReplicatorSets;

    public function handle(EntryBlueprintFound|GlobalVariablesBlueprintFound $event): void
    {
        $contents = $event->blueprint->contents();
        $contents = $this->processContents($contents);
        $event->blueprint->setContents($contents);
    }

    private function processContents(array $contents): array
    {
        foreach ($contents['tabs'] ?? [] as $tabKey => $tab) {
            foreach ($tab['sections'] ?? [] as $sectionIdx => $section) {
                $contents['tabs'][$tabKey]['sections'][$sectionIdx]['fields'] =
                  $this->processFields($section['fields'] ?? []);
            }
        }

        return $contents;
    }

    private function processFields(array $fields): array
    {
        $result = [];

        foreach ($fields as $fieldDef) {
            // "Where is this edited?", as answered on the field's own settings
            // screen, becomes the condition that answers it. Done here rather than
            // in a listener of its own: this walk already reaches every field on a
            // page — through imports, field references, sets and grids — and a
            // second walk of the same tree would be the same code twice.
            if (isset($fieldDef['field']) && is_array($fieldDef['field'])) {
                $fieldDef['field'] = PanelVisibility::apply($fieldDef['field']);
            }

            // Inject visual IDs into imported fieldsets at runtime without expanding
            // the import reference in the blueprint. Expanding caused the CP to save
            // the inlined version to disk, breaking fieldset sync.
            if (isset($fieldDef['import'])) {
                $fieldset = Fieldset::find($fieldDef['import']);

                if ($fieldset) {
                    $fsContents = $fieldset->contents();
                    $fsContents['fields'] = $this->processFields($fsContents['fields'] ?? []);
                    $fieldset->setContents($fsContents);
                }

                $result[] = $fieldDef;
                continue;
            }

            // Resolve string field references like `field: 'fieldset_handle.field_handle'`.
            if (isset($fieldDef['field']) && is_string($fieldDef['field'])) {
                $result[] = $this->resolveStringFieldRef($fieldDef);

                continue;
            }

            $type = $fieldDef['field']['type'] ?? null;

            if (in_array($type, ['replicator', 'bard'], true) && isset($fieldDef['field']['sets'])) {
                $fieldDef['field']['sets'] = $this->processReplicatorSets($fieldDef['field']['sets']);
            }

            if ($type === 'grid') {
                $gridFields = $fieldDef['field']['fields'] ?? [];
                $injected = $this->injectVisualId($gridFields);
                $fieldDef['field']['fields'] = $this->processFields($injected);
            }

            $result[] = $fieldDef;
        }

        return $result;
    }

    private function resolveStringFieldRef(array $fieldDef): array
    {
        $parts = explode('.', $fieldDef['field'], 2);

        if (count($parts) !== 2) {
            return $fieldDef;
        }

        [$fieldsetHandle, $fieldHandle] = $parts;
        $fieldset = Fieldset::find($fieldsetHandle);

        if (! $fieldset) {
            return $fieldDef;
        }

        foreach ($fieldset->contents()['fields'] ?? [] as $fsField) {
            if (($fsField['handle'] ?? null) !== $fieldHandle || ! is_array($fsField['field'])) {
                continue;
            }

            $inlined = $fsField;
            $inlined['handle'] = $fieldDef['handle'];
            // After the merge, so a set overriding the referenced field answers the
            // question for its own copy of it.
            $inlined['field'] = PanelVisibility::apply(
                array_merge($fsField['field'], $fieldDef['config'] ?? [])
            );

            $type = $inlined['field']['type'] ?? null;

            if (in_array($type, ['replicator', 'bard'], true) && isset($inlined['field']['sets'])) {
                $inlined['field']['sets'] = $this->processReplicatorSets($inlined['field']['sets']);
            }

            if ($type === 'grid') {
                $gridFields = $inlined['field']['fields'] ?? [];
                $injected = $this->injectVisualId($gridFields);
                $inlined['field']['fields'] = $this->processFields($injected);
            }

            return $inlined;
        }

        return $fieldDef;
    }

    private function processReplicatorSets(array $sets): array
    {
        return $this->mapSetFields($sets, function (array $fields): array {
            return $this->processFields($this->injectVisualId($fields));
        });
    }

    private function injectVisualId(array $fields): array
    {
        $handles = array_column($fields, 'handle');

        if (! in_array('_visual_id', $handles, true)) {
            $fields[] = ['handle' => '_visual_id', 'field' => [
                'type' => 'auto_uuid',
                'visibility' => 'hidden',
                'replicator_preview' => false,
            ]];
        }

        return $fields;
    }
}
