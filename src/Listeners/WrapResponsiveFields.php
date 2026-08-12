<?php

namespace MarioHamann\StatamicVisualEditor\Listeners;

use MarioHamann\StatamicVisualEditor\ResponsiveFields;
use Statamic\Events\EntryBlueprintFound;

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
    }
}
