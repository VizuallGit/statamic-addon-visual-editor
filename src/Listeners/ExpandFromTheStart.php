<?php

namespace MarioHamann\StatamicVisualEditor\Listeners;

use MarioHamann\StatamicVisualEditor\FromTheStart;
use Statamic\Events\EntryBlueprintFound;
use Statamic\Facades\Blink;

/**
 * Udvider replicator-`default` med "hvor mange af hver", når et entry-blueprint læses.
 *
 * YAML og feltindstillinger er urørt: afkrydsningen gemmer stadig én række pr.
 * type. Tallet er Statamics eget heltal. Her, og kun her (plus
 * {@see \MarioHamann\StatamicVisualEditor\SectionDefaults}), bliver det til
 * flere rækker — i hukommelsen, under den request der spurgte.
 */
class ExpandFromTheStart
{
    public function handle(EntryBlueprintFound $event): void
    {
        $event->blueprint->setContents(
            FromTheStart::walk($event->blueprint->contents())
        );

        static::forgetImportedFieldsCache();
    }

    /**
     * Statamic husker importerede fieldset-felter på importnavnet. Uden at
     * glemme den cache ville en senere `Fields`-læsning se den u-udvidede
     * default, og en ny sektion ville få én Item i stedet for tre.
     */
    protected static function forgetImportedFieldsCache(): void
    {
        foreach (array_keys(Blink::all()) as $key) {
            if (is_string($key) && str_starts_with($key, 'blueprint-imported-fields-')) {
                Blink::forget($key);
            }
        }
    }
}
