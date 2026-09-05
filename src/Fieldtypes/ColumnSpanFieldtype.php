<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use Statamic\Fields\Fieldtype;

/**
 * En plads i gitteret — valgt på en stribe.
 *
 * Værdien er hvor blokken ligger: hvor mange af gitterets kolonner den fylder,
 * og — hvis nogen har sagt det — hvilken kolonne den begynder i. 6 ud af 12 er
 * halvdelen; 6 ud af 12 fra kolonne 4 er halvdelen, rykket ind på midten.
 * Ingen liste at folde ud og ingen procenter at skrive; striben er gitteret set
 * fra oven, og man markerer der hvor blokken skal ligge.
 *
 * Tom værdi er ikke nul — det er "ingen mening om det". Så bestemmer sektionens
 * egen CSS bredden, præcis som før feltet fandtes, og en blok der aldrig er
 * blevet rørt ser ud som den altid har gjort. Sammen med `sve_responsive: true`
 * betyder tomt på tablet i stedet "det samme som laptop".
 *
 * Startkolonnen er tom på samme måde, og for sig: en bredde uden start flyder
 * derhen hvor rækken er nået til, som al bredde gjorde før startkolonnen fandtes.
 * Først når nogen sætter en start, holder blokken op med at flyde — og først da
 * kan to blokke komme til at ligge oven i hinanden.
 *
 * Feltet gemmer kun tallene. Hvad en kolonne er bred, om blokke må overlappe, og
 * hvad der sker når summen ikke går op, er skabelonens sag.
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
     * Værdien skilt ad i bredde og start, eller null.
     *
     * Tre former kommer ind her, og de skal alle sammen ud som det samme: et tal
     * (bredden alene — sådan så feltet ud før startkolonnen fandtes), et array
     * med `span` og `start`, eller ingenting.
     *
     * Alt uden for gitteret klippes til kanten i stedet for at blive kasseret:
     * en blok der har fyldt 12 og bagefter havner i et gitter med 6 kolonner,
     * skal fylde hele rækken — ikke miste sin bredde. Det samme gælder en start
     * der er faldet uden for: blokken rykker ind til sidste gyldige kolonne
     * frem for at slippe sin plads.
     */
    protected function parse($value): ?array
    {
        if ($value === null || $value === '' || $value === []) {
            return null;
        }

        $columns = $this->columns();

        if (is_array($value)) {
            // `value` er hvad et augmenteret felt serialiserer bredden som, så en
            // værdi der har været hele vejen rundt og tilbage stadig kan læses.
            $span = $value['span'] ?? $value['value'] ?? null;
            $start = $value['start'] ?? null;
        } else {
            $span = $value;
            $start = null;
        }

        $span = (int) $span;

        if ($span < 1) {
            return null;
        }

        $span = min($span, $columns);

        if ($start === null || $start === '') {
            return ['span' => $span, 'start' => null];
        }

        $start = max(1, min((int) $start, $columns));

        // Blokken må ikke stikke ud over sidste kolonne. Bredden giver efter,
        // ikke starten: den er der hvor nogen har sat den.
        return ['span' => min($span, $columns - $start + 1), 'start' => $start];
    }

    /**
     * Gemt som det mindste der siger det hele.
     *
     * Uden startkolonne gemmes bare tallet. Så bliver YAML'en ved med at se ud
     * som den gjorde, og en blok der aldrig har haft en mening om hvor den
     * ligger, får ikke en tom `start:` skrevet ind under sig af den grund alene.
     */
    protected function condense(?array $parsed)
    {
        if ($parsed === null) {
            return null;
        }

        return $parsed['start'] === null ? $parsed['span'] : $parsed;
    }

    /**
     * Formen bevares på vej ind i formularen.
     *
     * Et tal skal blive ved med at være et tal: laver vi det om til et array her,
     * ser formularen ændret ud i samme øjeblik den åbnes, og så spørger CP'et om
     * man vil kassere ændringer man aldrig har lavet.
     */
    public function preProcess($data)
    {
        return $this->condense($this->parse($data));
    }

    public function process($data)
    {
        return $this->condense($this->parse($data));
    }

    public function augment($value)
    {
        $parsed = $this->parse($value);

        return $parsed === null ? null : new ColumnSpanValue($parsed['span'], $parsed['start']);
    }

    /** Striben skal kende gitteret for at kunne tegne det. */
    public function preload(): array
    {
        return [
            'columns' => $this->columns(),
            'min' => max(1, (int) ($this->config('min') ?: 1)),
        ];
    }

    /**
     * Der valideres på det der kommer ud af `parse()`, ikke på det der kom ind:
     * hvad striben og Live Preview skriver er allerede klippet til gitteret, og
     * en værdi fra et bredere gitter skal klippes ned, ikke afvises.
     */
    public function rules(): array
    {
        return [
            'nullable',
            function ($attribute, $value, $fail) {
                if ($value !== null && $value !== '' && $value !== [] && $this->parse($value) === null) {
                    $fail(__('validation.integer', ['attribute' => $attribute]));
                }
            },
        ];
    }
}
