<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use Statamic\Fields\Fieldtype;

/**
 * Bredde målt i kolonner — ét tal, valgt på en stribe.
 *
 * Værdien er hvor mange af gitterets kolonner blokken fylder: 6 ud af 12 er
 * halvdelen. Ingen liste at folde ud og ingen procenter at skrive; striben er
 * gitteret set fra oven, og man klikker der hvor blokken skal slutte.
 *
 * Tom værdi er ikke nul — det er "ingen mening om det". Så bestemmer sektionens
 * egen CSS bredden, præcis som før feltet fandtes, og en blok der aldrig er
 * blevet rørt ser ud som den altid har gjort. Sammen med `sve_responsive: true`
 * betyder tomt på tablet i stedet "det samme som laptop".
 *
 * Feltet gemmer kun tallet. Hvad en kolonne er bred, og hvad der sker når
 * summen ikke går op, er skabelonens sag.
 */
class ColumnSpanFieldtype extends Fieldtype
{
    protected $categories = ['structured'];

    protected static $handle = 'column_span';

    /** Så mange kolonner er der, når feltet ikke får noget at vide. */
    public const DEFAULT_COLUMNS = 12;

    public function component(): string
    {
        return 'column-span';
    }

    protected function configFieldItems(): array
    {
        return [
            'columns' => [
                'display' => 'Kolonner',
                'instructions' => 'Hvor mange kolonner gitteret har. Skal passe med sektionens CSS.',
                'type' => 'integer',
                'default' => self::DEFAULT_COLUMNS,
                'width' => 50,
            ],
            'min' => [
                'display' => 'Mindste bredde',
                'instructions' => 'Færreste kolonner en blok må fylde.',
                'type' => 'integer',
                'default' => 1,
                'width' => 50,
            ],
        ];
    }

    /** Gitterets bredde, aldrig mindre end én kolonne at vælge imellem. */
    public function columns(): int
    {
        return max(1, (int) ($this->config('columns') ?: self::DEFAULT_COLUMNS));
    }

    /**
     * Tallet, eller null.
     *
     * Alt uden for gitteret klippes til kanten i stedet for at blive kasseret:
     * en blok der har fyldt 12 og bagefter havner i et gitter med 6 kolonner,
     * skal fylde hele rækken — ikke miste sin bredde.
     */
    protected function normalize($value): ?int
    {
        if ($value === null || $value === '' || $value === []) {
            return null;
        }

        $span = (int) $value;

        if ($span < 1) {
            return null;
        }

        return min($span, $this->columns());
    }

    public function preProcess($data)
    {
        return $this->normalize($data);
    }

    public function process($data)
    {
        return $this->normalize($data);
    }

    public function augment($value)
    {
        return $this->normalize($value);
    }

    /** Striben skal kende gitteret for at kunne tegne det. */
    public function preload(): array
    {
        return [
            'columns' => $this->columns(),
            'min' => max(1, (int) ($this->config('min') ?: 1)),
        ];
    }

    public function rules(): array
    {
        return ['nullable', 'integer', 'min:1', 'max:'.$this->columns()];
    }
}
