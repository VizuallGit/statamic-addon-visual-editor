<?php

namespace MarioHamann\StatamicVisualEditor\Listeners;

use MarioHamann\StatamicVisualEditor\ResponsiveFields;
use Statamic\Events\EntryBlueprintFound;
use Statamic\Facades\Blink;

/**
 * Pakker hvert afkrydset felt ind i `responsive`, når blueprintet læses.
 *
 * Fluebenet sidder på feltet selv (se {@see ResponsiveFields}); her sker
 * oversættelsen af det. Blueprintet på disken er urørt — indpakningen findes kun
 * i hukommelsen, under den request der spurgte, og forsvinder igen bagefter.
 *
 * Kun ved `EntryBlueprintFound`, som i projektet den blev flyttet fra. Globals
 * kunne følge efter senere, men skal det være en beslutning: et globalt sæt der
 * pludselig gemmer sine værdier i tre skuffer, er ikke en detalje.
 */
class WrapResponsiveFields
{
    public function handle(EntryBlueprintFound $event): void
    {
        $event->blueprint->setContents(
            ResponsiveFields::walk($event->blueprint->contents())
        );

        static::forgetImportedFieldsCache();
    }

    /**
     * Glemmer Blinks import-cache, så næste `Fields`-læsning ser indpakningen.
     *
     * Statamic husker importerede fieldset-felter på importnavnet alene, ikke på
     * indholdet. Et screenshot af defaults udvider de imports først (for at
     * fylde tomme felter), mens feltet stadig er sin oprindelige type. Uden at
     * glemme den cache ville preview'et så augmentere `padding` som et
     * spacing-felt i stedet for et responsivt — og billedet ville være uden
     * padding, selv om en rigtig side med samme data har den.
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
