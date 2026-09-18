<?php

namespace MarioHamann\StatamicVisualEditor\Listeners;

use MarioHamann\StatamicVisualEditor\ResponsiveFields;
use Statamic\Events\GlobalVariablesBlueprintFound;
use Statamic\Facades\Blink;

/**
 * Responsive felter på globale sæt — det samme som {@see WrapResponsiveFields}
 * gør for entries, når et globalt sæts blueprint læses.
 *
 * Beslutningen den anden lytter udskød ("globals kunne følge efter senere")
 * blev taget i sitet i september 2026: footeren har ét kolonne-felt, og det
 * skal kunne sættes pr. skærmstørrelse præcis som i en sektion. Lytteren lå
 * i sitets `app/Listeners/` og brugte addonets namespace; i V2 (WP8) bor den
 * her, hvor `ResponsiveFields` bor. Kode flyttet ordret.
 *
 * Indpakningen findes kun i hukommelsen, under den request der spurgte.
 * Blueprintet på disken er urørt. Et felt der allerede er pakket ind, røres
 * ikke, så det er ufarligt at lytteren fyrer to gange.
 */
class WrapResponsiveGlobalFields
{
    public function handle(GlobalVariablesBlueprintFound $event): void
    {
        $event->blueprint->setContents(
            ResponsiveFields::walk($event->blueprint->contents())
        );

        // Statamic husker importerede fieldset-felter på importnavnet alene,
        // ikke på indholdet. Uden at glemme den cache ville næste læsning se
        // feltet i sin oprindelige type i stedet for indpakningen.
        foreach (array_keys(Blink::all()) as $key) {
            if (is_string($key) && str_starts_with($key, 'blueprint-imported-fields-')) {
                Blink::forget($key);
            }
        }
    }
}
