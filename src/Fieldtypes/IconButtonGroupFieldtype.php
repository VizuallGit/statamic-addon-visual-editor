<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use Statamic\Fields\Fieldtype;
use Statamic\Fieldtypes\HasSelectOptions;

/**
 * Knapgruppe med ikoner — Statamics `button_group`, hvor knappen kan være et
 * billede i stedet for et ord.
 *
 * Værdien er den samme som før: én nøgle ud af en håndfuld, gemt som tekst og
 * læst som `LabeledValue`. Det eneste nye er, at hver mulighed også må have et
 * ikon. Har den det, tegnes ikonet alene og labelen bliver knappens tooltip;
 * har den ikke, står ordet der, præcis som i den almindelige knapgruppe.
 *
 * Det er en forskel man kan se, ikke en man skal læse: venstre/midt/højre er
 * tre streger med hver sin kant, ikke tre ord der ligner hinanden. Samme greb
 * virker til lodret placering, retning, fordeling — alt hvor valget har en form.
 *
 * Ikonnavnet er Statamics eget (`paragraph-align-left`), eller `sæt::navn` hvis
 * der er registreret et ikonsæt med `Icon::register()`.
 *
 * Muligheder skrives i et gitter med tre kolonner, men den gamle skrivemåde fra
 * `button_group` læses stadig, så et felt kan skiftes over ved kun at rette
 * `type:` — ikonerne kan tilføjes bagefter.
 */
class IconButtonGroupFieldtype extends Fieldtype
{
    use HasSelectOptions;

    protected $categories = ['controls'];

    protected $icon = 'fieldtype-button_group';

    protected $indexComponent = 'tags';

    protected static $handle = 'icon_button_group';

    public function component(): string
    {
        return 'icon-button-group';
    }

    protected function configFieldItems(): array
    {
        return [
            [
                'display' => 'Muligheder',
                'fields' => [
                    'options' => [
                        'display' => 'Muligheder',
                        'instructions' => 'Nøglen er den værdi der gemmes. Ikonet vises på knappen, og labelen bliver dens tooltip — er der intet ikon, står labelen på knappen i stedet.',
                        'type' => 'grid',
                        'mode' => 'table',
                        'add_row' => 'Tilføj mulighed',
                        'reorderable' => true,
                        'fullscreen' => false,
                        'fields' => [
                            [
                                'handle' => 'key',
                                'field' => [
                                    'type' => 'text',
                                    'display' => 'Nøgle',
                                    'width' => 33,
                                ],
                            ],
                            [
                                'handle' => 'label',
                                'field' => [
                                    'type' => 'text',
                                    'display' => 'Label',
                                    'width' => 33,
                                ],
                            ],
                            [
                                'handle' => 'icon',
                                'field' => [
                                    'type' => 'icon',
                                    'display' => 'Ikon',
                                    'width' => 33,
                                ],
                            ],
                        ],
                    ],
                    'show_labels' => [
                        'display' => 'Vis label ved siden af ikonet',
                        'instructions' => 'Normalt står ikonet alene, og labelen er tooltip. Slå til for at vise begge dele.',
                        'type' => 'toggle',
                        'default' => false,
                        'width' => 50,
                    ],
                    'clearable' => [
                        'display' => 'Kan ryddes',
                        'instructions' => 'Lad et klik på den valgte knap fravælge den igen.',
                        'type' => 'toggle',
                        'default' => false,
                        'width' => 50,
                    ],
                ],
            ],
            [
                'display' => 'Data & Format',
                'fields' => [
                    'default' => [
                        'display' => 'Standardværdi',
                        'instructions' => 'Nøglen der gemmes, hvis feltet efterlades tomt.',
                        'type' => 'text',
                    ],
                ],
            ],
        ];
    }

    /**
     * Mulighederne, som knapperne skal tegnes af.
     *
     * `HasSelectOptions` forventer `value` og `label`; `icon` er det eneste vi
     * lægger oveni, og trait'ens egne opslag rører den ikke.
     *
     * Tre skrivemåder læses, fordi feltet skal kunne overtage et eksisterende
     * `button_group` uden at nogen skriver mulighederne om:
     *
     *   - gitteret:      `- {key: left, label: Venstre, icon: paragraph-align-left}`
     *   - nøgle → label: `left: Venstre`
     *   - bare en liste: `- left`
     *
     * @return array<int, array{value: string, label: ?string, icon: ?string}>
     */
    protected function getOptions(): array
    {
        return collect($this->config('options') ?? [])
            ->map(function ($option, $key) {
                if (is_array($option)) {
                    return [
                        'value' => (string) ($option['key'] ?? $key),
                        'label' => $this->blankToNull($option['label'] ?? null),
                        'icon' => $this->blankToNull($option['icon'] ?? null),
                    ];
                }

                // En liste uden nøgler er værdier uden labels; en nøglet liste er
                // det omvendte. Nøglen er det der gemmes i begge tilfælde.
                return is_int($key)
                    ? ['value' => (string) $option, 'label' => null, 'icon' => null]
                    : ['value' => (string) $key, 'label' => $this->blankToNull($option), 'icon' => null];
            })
            // En tom række i gitteret er en mulighed man er begyndt på og ikke
            // blev færdig med. Den skal ikke blive til en navnløs knap.
            ->reject(fn ($option) => $option['value'] === '')
            ->values()
            ->all();
    }

    private function blankToNull($value): ?string
    {
        $value = is_string($value) ? trim($value) : $value;

        return ($value === '' || $value === null) ? null : (string) $value;
    }
}
