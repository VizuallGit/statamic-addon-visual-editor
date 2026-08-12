<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Fieldtypes\Grid;
use Statamic\Fieldtypes\Replicator;

/**
 * De to ekstra indstillinger på replicator- og grid-felter.
 *
 * Begge lægges på Statamics EGNE klasser, ikke på addonets `Replicator`.
 * `appendConfigFields()` gemmer under `static::class`, så en registrering lagt
 * på addonets klasse ville forsvinde den dag den fil blev fjernet igen. Lagt her
 * læses de af {@see \MarioHamann\StatamicVisualEditor\Fieldtypes\Replicator}
 * gennem `extraConfigFieldItems()`, og de virker uændret uden den.
 *
 * Kaldes pr. CP-request fra {@see Http\Middleware\RegisterPanelVisibility},
 * samme sted som resten af addonets feltindstillinger. At registrere flere gange
 * er gratis: felterne flettes på nøgle.
 */
class ReplicatorSettings
{
    public static function register(): void
    {
        // Låsen giver kun mening de to steder der har rækker at låse — derfor
        // pr. fieldtype-klasse frem for på Fieldtype::class, som "Responsive".
        foreach ([Replicator::class, Grid::class] as $fieldtype) {
            $fieldtype::appendConfigFields([
                'locked_rows' => [
                    'display' => 'Lås rækker',
                    'instructions' => 'Rækkerne kan stadig redigeres og skjules, men ikke flyttes, duplikeres eller slettes. Låste rækker får et hængelås-ikon i stedet for trækhåndtaget.',
                    'type' => 'toggle',
                    'default' => false,
                    'width' => 50,
                ],
            ]);
        }

        // Kun replicator. Grid har ingen sets at skelne imellem, og bards sets
        // tilføjes gennem editorens egen menu, som ikke er den vælger JS'en
        // kender — fluebenet ville stå der og ikke gøre noget.
        Replicator::appendConfigFields([
            'unique_sets' => [
                'display' => 'Kun én af hver',
                'instructions' => 'De afkrydsede typer kan kun tilføjes én gang. Når en af dem ligger i listen, kan den ikke vælges igen før rækken er slettet.',
                'type' => 'unique_sets',
                'full_width_setting' => true,
            ],
        ]);
    }
}
