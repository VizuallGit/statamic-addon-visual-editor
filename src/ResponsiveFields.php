<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Arr;
use Statamic\Facades\Fieldset;
use Statamic\Fields\Fieldtype;

/**
 * Fluebenet "Responsive" på hvert felts indstillinger.
 *
 * Feltet bliver stående som det er — Padding er stadig Padding. Krydset siger kun
 * at dets værdi skal kunne sættes pr. skærmstørrelse, og resten sker når
 * blueprintet læses: feltet pakkes ind i `responsive`-fieldtypen, som gemmer
 * værdien i tre skuffer (laptop/tablet/mobil) i stedet for én.
 *
 * Ingen beholder at flytte felter ind i, ingen YAML at skrive. Samme greb som
 * "Where it is edited" i visual editor-addonet: et spørgsmål stillet på det felt
 * det handler om, oversat til maskineri bagefter.
 */
class ResponsiveFields
{
    /** Config-nøglen, som den gemmes på feltet. */
    public const KEY = 'sve_responsive';

    /**
     * Statamics egne betingelsesnøgler, som de står i `Field::conditions()`.
     *
     * De hører til på indpakningen, ikke på feltet indeni: inde i `responsive`
     * er feltet sit eget eneste søskende, så en betingelse der peger på et
     * naboFelt aldrig kan blive sand. Indpakningen står derimod stadig blandt
     * de rigtige søskende, og det er derfra betingelsen kan se dem.
     */
    public const CONDITION_KEYS = [
        'if',
        'if_any',
        'show_when',
        'show_when_any',
        'unless',
        'unless_any',
        'hide_when',
        'hide_when_any',
    ];

    /**
     * Lægger fluebenet på alle felttyper.
     *
     * Kaldes fra {@see \MarioHamann\StatamicVisualEditor\Http\Middleware\RegisterPanelVisibility},
     * ikke fra en service provider: teksterne skal være på brugerens sprog, og
     * sproget vælges af en middleware der kører længe efter providerne er bootet.
     * Registreres der tidligere, står der hvad sitets standardsprog siger,
     * uanset hvem der kigger.
     */
    public static function register(): void
    {
        Fieldtype::appendConfigFields([
            static::KEY => [
                'display' => __('sve::messages.responsive_setting'),
                'instructions' => __('sve::messages.responsive_setting_instructions'),
                'type' => 'toggle',
                'default' => false,
                'width' => 50,
            ],
        ]);
    }

    /**
     * Går blueprintet igennem og pakker hvert afkrydset felt ind.
     *
     * Rekursivt over hele træet — faner, sektioner, sets i en replicator, felter i
     * et grid — fordi krydset kan sidde hvor som helst. Importerede fieldsets
     * ekspanderes ikke her; de læses gennem deres egne felt-definitioner, og et
     * kryds i dem fanges når Statamic slår referencen op.
     *
     * @param  array<string, mixed>  $node
     * @return array<string, mixed>
     */
    public static function walk(array $node, int $depth = 0): array
    {
        // Dybden tæller importer, ikke array-niveauer. Et blueprint-træ er
        // endeligt og kan ikke løbe løbsk; det kan en fieldset-import derimod,
        // hvis to fieldsets importerer hinanden. Talte begge dele mod samme
        // budget, slap det op på vejen ned gennem faner, sektioner, sets og
        // felter — og et kryds i et set inde i en replicator blev aldrig set.
        if ($depth > 20) {
            return $node;
        }

        foreach ($node as $key => $value) {
            if (! is_array($value)) {
                continue;
            }

            // `- import: hero.style_1` — felterne står i fieldsettet, ikke her, så
            // blueprintet alene når aldrig frem til dem. Fieldsettet hentes og får
            // sit indhold sat om i hukommelsen; importen selv bliver stående, så
            // filen på disken og fieldset-synkroniseringen er urørt.
            if (isset($value['import']) && is_string($value['import'])) {
                if ($fieldset = Fieldset::find($value['import'])) {
                    $contents = $fieldset->contents();
                    $contents['fields'] = static::walk($contents['fields'] ?? [], $depth + 1);
                    $fieldset->setContents($contents);
                }

                continue;
            }

            // Et felt-element: {handle: …, field: {…}} eller {handle: …, field: 'ref', config: {…}}
            if (isset($value['handle'])) {
                if (isset($value['field']) && is_array($value['field'])) {
                    $value['field'] = static::apply($value['handle'], $value['field']);
                } elseif (is_string($value['field'] ?? null) && ! empty($value['config'][static::KEY])) {
                    // Et felt der peger på et andet (`field: common.section_spacing`).
                    // Referencen slås op og lægges ind på stedet, for et felt der kun
                    // er et navn kan ikke pakkes ind — dets rigtige type står et
                    // andet sted. Kun når krydset er sat: ellers lades referencen i
                    // fred, så fieldset-synkronisering bliver ved med at virke.
                    $resolved = static::resolveReference($value['field'], $value['config']);

                    if ($resolved) {
                        $value = [
                            'handle' => $value['handle'],
                            'field' => static::apply($value['handle'], $resolved),
                        ];
                    }
                }
            }

            $node[$key] = static::walk($value, $depth);
        }

        return $node;
    }

    /**
     * Slår `fieldset.felt` op og lægger elementets egne overrides ovenpå — samme
     * sammenlægning som Statamic selv laver, bare tidligere, så der er et rigtigt
     * felt at pakke ind.
     *
     * @param  array<string, mixed>  $config
     * @return array<string, mixed>|null
     */
    protected static function resolveReference(string $reference, array $config): ?array
    {
        $parts = explode('.', $reference, 2);

        if (count($parts) !== 2 || ! ($fieldset = Fieldset::find($parts[0]))) {
            return null;
        }

        foreach ($fieldset->contents()['fields'] ?? [] as $field) {
            if (($field['handle'] ?? null) !== $parts[1] || ! is_array($field['field'] ?? null)) {
                continue;
            }

            return array_merge($field['field'], $config);
        }

        return null;
    }

    /**
     * Pakker et afkrydset felt ind i `responsive`.
     *
     * Det oprindelige felt bliver det eneste felt indeni, med sit eget handle, så
     * hverken display, instruktioner eller konfiguration går tabt. Værdien læses i
     * Antlers som `{{ padding.laptop.padding }}` — skuffen, og så feltet i den.
     *
     * @param  array<string, mixed>  $field
     * @return array<string, mixed>
     */
    public static function apply(string $handle, array $field): array
    {
        if (empty($field[static::KEY]) || ($field['type'] ?? null) === 'responsive') {
            return $field;
        }

        $inner = $field;
        unset($inner[static::KEY], $inner['instructions']);

        // Betingelsen følger med udenpå. Blev den stående på det indre felt, ville
        // den pege på et søskendefelt der ikke findes derinde og aldrig blive sand:
        // indpakningen tegnede sin label, og kontrollen under den var væk for altid.
        $conditions = Arr::only($field, static::CONDITION_KEYS);
        $inner = Arr::except($inner, static::CONDITION_KEYS);

        // Ydersiden bærer navnet. Uden det står "Padding" to gange under hinanden
        // — én gang for indpakningen og én for feltet i den.
        $inner['hide_display'] = true;

        return $conditions + [
            'type' => 'responsive',
            // Label + override-dot + reset tegnes af fieldtypen selv, så Statamics
            // egen label ikke står ovenover og forhindrer prikken i at sidde
            // ved siden af navnet.
            'display' => $field['display'] ?? null,
            'hide_display' => true,
            'instructions' => $field['instructions'] ?? null,
            static::KEY => true,
            'fields' => [
                ['handle' => $handle, 'field' => $inner],
            ],
        ];
    }
}
