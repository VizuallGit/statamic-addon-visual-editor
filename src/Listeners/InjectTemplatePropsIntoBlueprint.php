<?php

namespace MarioHamann\StatamicVisualEditor\Listeners;

use MarioHamann\StatamicVisualEditor\SectionTemplate;
use MarioHamann\StatamicVisualEditor\SundayAug30;
use MarioHamann\StatamicVisualEditor\TemplateProps;
use Statamic\Events\EntryBlueprintFound;
use Statamic\Events\GlobalVariablesBlueprintFound;
use Statamic\Facades\Fieldset;

/**
 * Sidebar fields for `:handle ?? default` bindings in a section template.
 *
 * The template is the source. A handle already in the fieldset is left alone.
 */
class InjectTemplatePropsIntoBlueprint
{
    public function handle(EntryBlueprintFound|GlobalVariablesBlueprintFound $event): void
    {
        if (! SundayAug30::enabled()) {
            return;
        }

        $contents = $event->blueprint->contents();
        $contents = $this->processContents($contents);
        $event->blueprint->setContents($contents);
    }

    /**
     * @param  array<string, mixed>  $contents
     * @return array<string, mixed>
     */
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

    /**
     * @param  array<int, mixed>  $fields
     * @return array<int, mixed>
     */
    private function processFields(array $fields): array
    {
        $result = [];

        foreach ($fields as $fieldDef) {
            if (! is_array($fieldDef)) {
                $result[] = $fieldDef;

                continue;
            }

            // Same walk as visual IDs: the page blueprint is `import:
            // page_sections`. Without this the sets — and the template —
            // are never reached, so the sidebar stays empty.
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

            if (isset($fieldDef['field']) && is_string($fieldDef['field'])) {
                $result[] = $this->resolveStringFieldRef($fieldDef);

                continue;
            }

            $type = is_array($fieldDef['field'] ?? null) ? ($fieldDef['field']['type'] ?? null) : null;

            if (in_array($type, ['replicator', 'bard', 'sve_lite_sections'], true) && isset($fieldDef['field']['sets'])) {
                $fieldDef['field']['sets'] = $this->processSets($fieldDef['field']['sets']);
            }

            $result[] = $fieldDef;
        }

        return $result;
    }

    /**
     * @param  array<string, mixed>  $sets
     * @return array<string, mixed>
     */
    private function processSets(array $sets): array
    {
        if ($sets === []) {
            return $sets;
        }

        $first = reset($sets);

        if (isset($first['sets'])) {
            foreach ($sets as $groupKey => $group) {
                foreach ($group['sets'] ?? [] as $setKey => $set) {
                    $fields = $this->processFields($set['fields'] ?? []);
                    $sets[$groupKey]['sets'][$setKey]['fields'] = $this->injectProps((string) $setKey, $fields);
                }
            }

            return $sets;
        }

        foreach ($sets as $setKey => $set) {
            $fields = $this->processFields($set['fields'] ?? []);
            $sets[$setKey]['fields'] = $this->injectProps((string) $setKey, $fields);
        }

        return $sets;
    }

    /**
     * @param  array<int, mixed>  $fields
     * @return array<int, mixed>
     */
    private function injectProps(string $setHandle, array $fields): array
    {
        $path = SectionTemplate::path($setHandle);

        if ($path === null) {
            return $fields;
        }

        $props = TemplateProps::parse((string) file_get_contents($path));

        if ($props === []) {
            return $fields;
        }

        $handles = [];

        foreach ($fields as $fieldDef) {
            if (is_array($fieldDef) && isset($fieldDef['handle'])) {
                $handles[] = $fieldDef['handle'];
            }
        }

        if (in_array('sve_props', $handles, true)) {
            return $fields;
        }

        $fields[] = TemplateProps::bundleField($setHandle);

        return $fields;
    }

    /**
     * @param  array<string, mixed>  $fieldDef
     * @return array<string, mixed>
     */
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
            if (($fsField['handle'] ?? null) !== $fieldHandle || ! is_array($fsField['field'] ?? null)) {
                continue;
            }

            $inlined = $fsField;
            $inlined['handle'] = $fieldDef['handle'];
            $inlined['field'] = array_merge($fsField['field'], $fieldDef['config'] ?? []);

            $type = $inlined['field']['type'] ?? null;

            if (in_array($type, ['replicator', 'bard', 'sve_lite_sections'], true) && isset($inlined['field']['sets'])) {
                $inlined['field']['sets'] = $this->processSets($inlined['field']['sets']);
            }

            return $inlined;
        }

        return $fieldDef;
    }
}
