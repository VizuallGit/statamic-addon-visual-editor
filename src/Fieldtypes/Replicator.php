<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Rules\UniqueSetTypes;
use Statamic\Support\Arr;

/**
 * ⚠️  Denne klasse ERSTATTER Statamics egen `replicator`-fieldtype.
 *
 * Statamic registrerer først sine egne fieldtypes og derefter alt i
 * `app/Fieldtypes` (se ExtensionServiceProvider::registerAppExtensions). Handlen
 * udledes af klassenavnet, så en klasse der hedder `Replicator` overtager
 * `replicator` — også uden at bede om det. Filen kan altså ikke omdøbes eller
 * flyttes uden at det får konsekvenser, og ALT replicator-arbejde i hele
 * projektet går igennem den her klasse.
 *
 * Derfor er der kun én ting i den: den validering `unique_sets` lover. Resten
 * arves uændret. Skal der mere til, så overvej først om det kan ligge et andet
 * sted — en fejl her rammer hvert eneste replicator-felt i CP'et.
 *
 * Selve begrænsningen i brugerfladen ligger i CP'ets JS
 * (resources/js/components/UniqueSets.js). Reglen her er bagstopperen for data
 * der ikke kommer fra en formular.
 */
class Replicator extends \Statamic\Fieldtypes\Replicator
{
    /**
     * Indstillinger som andre har lagt på `Statamic\Fieldtypes\Replicator`.
     *
     * `appendConfigFields()` gemmer under `static::class`, og `static::class` er
     * nu den her klasse. Uden den her metode ville alt der er meldt ind på
     * Statamics egen klasse falde på gulvet i samme øjeblik filen findes —
     * "Lås rækker" forsvandt fra feltets indstillinger, uden en fejl nogen steder.
     *
     * Registreringen skal derfor ikke flyttes over på App\Fieldtypes\Replicator.
     * Den bliver stående på Statamics klasse, og læses herfra — så virker den
     * også den dag den her fil bliver slettet igen.
     */
    protected function extraConfigFieldItems(): array
    {
        return array_merge(
            parent::extraConfigFieldItems(),
            self::$extraConfigFields[\Statamic\Fieldtypes\Replicator::class] ?? [],
        );
    }

    public function rules(): array
    {
        $rules = parent::rules();

        $handles = $this->config('unique_sets');

        if (is_array($handles) && $handles) {
            $rules[] = new UniqueSetTypes($handles, $this->setLabels());
        }

        return $rules;
    }

    /**
     * Handle → det navn redaktøren ser på blokken.
     *
     * `sets` står i blueprintet i to former: grupper med sets under sig, og den
     * gamle form hvor sets ligger direkte. Begge læses, for fejlbeskeden skal
     * kunne sige "Indhold" og ikke "content_block".
     */
    protected function setLabels(): array
    {
        $sets = collect($this->config('sets') ?? []);

        if ($sets->isEmpty()) {
            return [];
        }

        // Har den første ingen `sets`-nøgle, er det den gamle form uden grupper.
        if (! Arr::has($sets->first(), 'sets')) {
            $sets = collect(['main' => ['sets' => $sets->all()]]);
        }

        return $sets
            ->flatMap(fn ($group) => is_array($group) ? ($group['sets'] ?? []) : [])
            ->map(fn ($set, $handle) => (is_array($set) ? ($set['display'] ?? null) : null) ?: $handle)
            ->all();
    }
}
