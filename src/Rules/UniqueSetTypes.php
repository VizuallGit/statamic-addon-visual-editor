<?php

namespace MarioHamann\StatamicVisualEditor\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * En set-type må kun optræde én gang i listen.
 *
 * Reglen er bagstopperen for `unique_sets`. CP'et fjerner de brugte typer fra
 * "Tilføj"-vælgeren, og replicatorens egen `addSet` siger nej — men det er JS,
 * og det dækker kun der hvor formularen er tegnet. Data der kommer ind ad andre
 * veje (import, API, en YAML-fil skrevet i hånden) møder kun den her.
 *
 * Der tælles kun på de typer der ER krydset af. Alt andet i listen er reglen
 * ligeglad med, og en tom eller ugyldig værdi er ikke dens bord — det har
 * `array`-reglen ved siden af taget sig af.
 */
class UniqueSetTypes implements ValidationRule
{
    /**
     * @param  array<int, string>  $handles  De typer der kun må optræde én gang.
     * @param  array<string, string>  $labels  Handle → navnet redaktøren kender.
     */
    public function __construct(
        protected array $handles,
        protected array $labels = [],
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_array($value)) {
            return;
        }

        $duplicates = collect($value)
            ->map(fn ($row) => is_array($row) ? ($row['type'] ?? null) : null)
            ->filter(fn ($type) => is_string($type) && in_array($type, $this->handles, true))
            ->countBy()
            ->filter(fn ($count) => $count > 1)
            ->keys();

        if ($duplicates->isEmpty()) {
            return;
        }

        $names = $duplicates
            ->map(fn ($handle) => $this->labels[$handle] ?? $handle)
            ->implode(', ');

        $fail(sprintf('Disse blokke kan kun bruges én gang: %s.', $names));
    }
}
