<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use Statamic\Fields\Fieldtype;

/**
 * "Kun én af hver" — afkrydsning af de set-typer der kun må optræde én gang.
 *
 * Feltet står i en replicators egne indstillinger, ikke i et blueprint, og dets
 * værdi er en liste af set-handles. Er en type krydset af, forsvinder den fra
 * "Tilføj"-vælgeren så snart den ligger i listen, og den kan ikke tilføjes igen
 * før rækken er slettet.
 *
 * Mulighederne skrives ikke ned nogen steder: de læses fra det `sets`-felt der
 * står lige ved siden af i samme formular, mens man redigerer. Derfor kan de to
 * ikke komme ud af trit — omdøber man et set, følger afkrydsningen ikke med, og
 * den døde handle falder ud af sig selv (se `normalize()`).
 *
 * Selve begrænsningen sker i CP'ets JS (resources/js/components/UniqueSets.js).
 * Her ligger kun indstillingen.
 */
class UniqueSetsFieldtype extends Fieldtype
{
    /** Kun til feltindstillinger — ikke noget man vælger i et blueprint. */
    protected $selectable = false;

    protected static $handle = 'unique_sets';

    public function component(): string
    {
        return 'unique-sets';
    }

    public function preProcess($data)
    {
        return $this->normalize($data);
    }

    /**
     * Tom liste gemmes som `null`.
     *
     * Ellers ville hvert eneste replicator-felt få en tom `unique_sets: []` i
     * blueprintet første gang nogen åbnede dets indstillinger.
     */
    public function process($data)
    {
        return $this->normalize($data) ?: null;
    }

    /** En liste af handles — uden dubletter, tomme værdier og andet end tekst. */
    protected function normalize($data): array
    {
        return collect($data)
            ->filter(fn ($handle) => is_string($handle) && $handle !== '')
            ->unique()
            ->values()
            ->all();
    }
}
