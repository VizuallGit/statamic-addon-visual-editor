<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use Statamic\Fields\Fieldtype;

/**
 * "Med fra start" — afkrydsning af de set-typer et nyt replicator-felt får med.
 *
 * Feltet står i en replicators egne indstillinger og gemmer under Statamics
 * egen `default`-nøgle, samme form som man ellers skriver i YAML i hånden:
 *
 *     default:
 *       - type: icon
 *       - type: title
 *
 * Så fylder Statamic selv rækkerne ud når feltet oprettes — en ny sektion, et
 * nyt list-item, et nyt hvad-som-helst der rummer replicatoren. Ingen ekstra
 * runtime: det er feltets default, og alt der allerede læser den (CP, preview,
 * SectionDefaults) følger med.
 *
 * Mulighederne læses fra det `sets`-felt der står ved siden af i samme
 * formular, præcis som {@see UniqueSetsFieldtype}. En eksisterende default med
 * indlejrede værdier (en række der rummer sine egne rækker) bevares, så længe
 * typen stadig er krydset af.
 */
class DefaultSetsFieldtype extends Fieldtype
{
    /** Kun til feltindstillinger — ikke noget man vælger i et blueprint. */
    protected $selectable = false;

    protected static $handle = 'default_sets';

    public function component(): string
    {
        return 'default-sets';
    }

    public function preProcess($data)
    {
        return $this->normalize($data);
    }

    /**
     * Tom liste gemmes som `null`.
     *
     * Ellers ville hvert eneste replicator-felt få en tom `default: []` i
     * blueprintet første gang nogen åbnede dets indstillinger.
     */
    public function process($data)
    {
        return $this->normalize($data) ?: null;
    }

    /**
     * En liste af rækker med `type` — én pr. handle, i den rækkefølge de kom.
     *
     * En streng tæller som `{type: handle}`. En række der allerede har andre
     * nøgler (indlejrede defaults) får lov at beholde dem. Dubletter droppes,
     * den første vinder, så et flueben ikke kan lægge den samme type to gange.
     *
     * @return array<int, array{type: string}>
     */
    protected function normalize($data): array
    {
        $seen = [];
        $rows = [];

        foreach (is_array($data) ? $data : [] as $item) {
            $row = $this->row($item);

            if (! $row || isset($seen[$row['type']])) {
                continue;
            }

            $seen[$row['type']] = true;
            $rows[] = $row;
        }

        return $rows;
    }

    /** @return array{type: string}|null */
    protected function row(mixed $item): ?array
    {
        if (is_string($item) && $item !== '') {
            return ['type' => $item];
        }

        if (is_array($item) && is_string($item['type'] ?? null) && $item['type'] !== '') {
            return $item;
        }

        return null;
    }
}
