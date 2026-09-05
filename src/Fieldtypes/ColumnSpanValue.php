<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use Statamic\Fields\ArrayableString;

/**
 * En plads i gitteret: hvor blokken starter, og hvor mange kolonner den fylder.
 *
 * Udskrevet alene er den bredden — `{{ span.laptop.span }}` giver stadig tallet,
 * præcis som dengang feltet kun kunne det. Det er ikke pænhed: skabeloner der
 * blev skrevet før startkolonnen fandtes, skal blive ved med at virke uden at
 * nogen rører dem.
 *
 * Startlinjen hentes ved at spørge efter den: `.start` er kolonnen blokken
 * begynder i, `.end` er gitterlinjen den slutter på. Er `.start` tom, har
 * blokken ingen mening om hvor den ligger, og den falder ind hvor rækken er
 * nået til — som alle blokke gjorde før.
 */
class ColumnSpanValue extends ArrayableString
{
    public function __construct(int $span, ?int $start = null)
    {
        parent::__construct($span, [
            'span' => $span,
            'start' => $start,
            // Slutlinjen, ikke den sidste kolonne: 2 + 3 = 5 er hvor en blok fra
            // kolonne 2 i tre kolonners bredde holder op. Det er tallet CSS'en
            // skal bruge, så skabelonen slipper for at lægge sammen selv.
            'end' => $start === null ? null : $start + $span,
        ]);
    }

    public function span(): int
    {
        return $this->extra['span'];
    }

    public function start(): ?int
    {
        return $this->extra['start'];
    }
}
