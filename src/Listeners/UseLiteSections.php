<?php

namespace MarioHamann\StatamicVisualEditor\Listeners;

use Statamic\Events\EntryBlueprintFound;
use Statamic\Facades\Blink;
use Statamic\Facades\Fieldset;

/**
 * I Live Preview: page_sections vises som `sve_lite_sections`, så Vue kun
 * mounter den sektion der redigeres.
 *
 * YAML på disken er urørt (`type: replicator`). Felt-CP'et, Manage Sets og
 * den almindelige entry-form ser stadig Statamics replicator.
 */
class UseLiteSections
{
    public const TYPE = 'sve_lite_sections';

    public function handle(EntryBlueprintFound $event): void
    {
        if (! $this->inLivePreview()) {
            return;
        }

        $handle = (string) config('statamic-visual-editor.previews.field', 'page_sections');

        if ($handle === '') {
            return;
        }

        $event->blueprint->setContents(
            $this->swapInContents($event->blueprint->contents(), $handle)
        );

        $this->swapInNamedFieldset($handle);
        $this->forgetImportedFieldsCache();
    }

    private function inLivePreview(): bool
    {
        $request = request();

        if ($request->boolean('live-preview')) {
            return true;
        }

        if ($request->has('sve-panel')) {
            return true;
        }

        $referer = (string) $request->headers->get('referer', '');

        return $referer !== '' && str_contains($referer, 'live-preview=');
    }

    /**
     * @param  array<string, mixed>  $contents
     * @return array<string, mixed>
     */
    private function swapInContents(array $contents, string $handle): array
    {
        foreach ($contents['tabs'] ?? [] as $tabKey => $tab) {
            foreach ($tab['sections'] ?? [] as $sectionIdx => $section) {
                $contents['tabs'][$tabKey]['sections'][$sectionIdx]['fields'] =
                    $this->swapFields($section['fields'] ?? [], $handle);
            }
        }

        return $contents;
    }

    /**
     * @param  array<int, mixed>  $fields
     * @return array<int, mixed>
     */
    private function swapFields(array $fields, string $handle): array
    {
        foreach ($fields as $i => $fieldDef) {
            if (! is_array($fieldDef)) {
                continue;
            }

            if (isset($fieldDef['import']) && is_string($fieldDef['import'])) {
                $fieldset = Fieldset::find($fieldDef['import']);

                if ($fieldset) {
                    $fs = $fieldset->contents();
                    $fs['fields'] = $this->swapFields($fs['fields'] ?? [], $handle);
                    $fieldset->setContents($fs);
                }

                continue;
            }

            $fieldHandle = $fieldDef['handle'] ?? null;
            $type = $fieldDef['field']['type'] ?? null;

            if ($fieldHandle === $handle && $type === 'replicator') {
                $fields[$i]['field']['type'] = self::TYPE;
            }
        }

        return $fields;
    }

    private function swapInNamedFieldset(string $handle): void
    {
        $fieldset = Fieldset::find($handle);

        if (! $fieldset) {
            return;
        }

        $contents = $fieldset->contents();
        $contents['fields'] = $this->swapFields($contents['fields'] ?? [], $handle);
        $fieldset->setContents($contents);
    }

    private function forgetImportedFieldsCache(): void
    {
        foreach (array_keys(Blink::all()) as $key) {
            if (is_string($key) && str_starts_with($key, 'blueprint-imported-fields-')) {
                Blink::forget($key);
            }
        }
    }
}
