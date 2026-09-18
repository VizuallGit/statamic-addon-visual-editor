<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Breakpoints;
use Statamic\Fields\Fields;
use Statamic\Fields\Fieldtype;
use Statamic\Fields\Values;
use Statamic\Support\Arr;

/**
 * Ét felt, én gruppe felter — tre breakpoints.
 *
 * Værdien er `{laptop: {...}, tablet: {...}, mobile: {...}}` under ét handle, så en
 * sektion har ét design-fieldset i stedet for et pr. skærmstørrelse. Felterne
 * defineres én gang i `fields:`; fieldtypen kører dem igennem én gang pr.
 * breakpoint og holder værdierne adskilt.
 *
 * Kaskaden er desktop-first, altså omvendt af Tailwinds: laptop er basis og
 * skrives uden media query, tablet og mobil er overrides der lægges ovenpå med
 * `max-width`. Tomme felter på tablet/mobil skrives ikke ud, og arver dermed
 * opad — ændrer du noget på tablet, følger mobil med, medmindre mobil selv siger
 * noget andet. Selve CSS-udskrivningen ligger i skabelonen; her handler det kun om
 * at gemme det rigtige sted.
 *
 * Bygget som Statamics egen Group-fieldtype, bare gentaget pr. breakpoint: samme
 * `Fields`-objekt, samme fire metoder (preProcess/process/preload/augment).
 */
class ResponsiveFieldtype extends Fieldtype
{
    use MemoizesAugmentation;

    protected $categories = ['structured'];

    protected $defaultable = false;

    protected static $handle = 'responsive';

    public function component(): string
    {
        return 'responsive';
    }

    /**
     * Breakpointene med den media query de skrives ud i, og et navn der kan læses.
     *
     * Listen selv bor i {@see Breakpoints} — ét sted, fordi Live Preview,
     * Tailwind-rækken, CSS-panelet og dette felt alle skal svare det samme på
     * "hvor går grænsen". Her er den kun læst.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function breakpoints(): array
    {
        return Breakpoints::all();
    }

    protected function configFieldItems(): array
    {
        return [
            'fields' => [
                'display' => __('sve::messages.responsive_fields'),
                'instructions' => __('sve::messages.responsive_fields_instructions'),
                'type' => 'fields',
                'full_width_setting' => true,
            ],
        ];
    }

    /** @return array<int, string> */
    public static function handles(): array
    {
        return Breakpoints::handles();
    }

    /** Basis-breakpointet — det der skrives ud uden media query. */
    public static function base(): string
    {
        return Breakpoints::base();
    }

    /**
     * Underfelterne, bygget til ét breakpoint.
     *
     * Tablet og mobil er overrides, ikke felter der starter forfra, og derfor har
     * de ingen default. En default hører til basis: skrives den ind i hver skuffe,
     * står der en værdi i alle tre fra første gem, og "tom = arver opad" gælder så
     * aldrig for et felt der havde en default — man kan override, men ikke lade
     * være. Uden `default` står tablet og mobil tomme, indtil nogen sætter noget.
     */
    public function fields(?string $breakpoint = null): Fields
    {
        $config = $this->config('fields');

        if ($breakpoint !== null) {
            $config = array_map(
                fn ($item) => static::defaultFor($item, $breakpoint),
                $config
            );
        }

        return new Fields($config, $this->field()->parent(), $this->field());
    }

    /**
     * Ét underfelt, gjort klar til ét breakpoint.
     *
     * `default` alene betyder stadig basis, som den altid har gjort. Ved siden af
     * den kan der stå en default pr. skærmstørrelse i `sve_defaults`, og så er det
     * den der gælder for netop den skuffe:
     *
     *     sve_defaults:
     *       tablet: 2
     *       mobile: 1
     *
     * Har en skuffe ingen af delene, ryger `default` ud — se kommentaren ovenfor
     * om hvorfor tablet og mobil ellers aldrig kunne arve.
     *
     * Nøglerne er breakpoint-handles, så listen udvider sig selv: laver nogen et
     * nyt breakpoint, er dets handle bare endnu en nøgle her.
     *
     * @param  array<string, mixed>  $item
     * @return array<string, mixed>
     */
    protected static function defaultFor(array $item, string $breakpoint): array
    {
        $defaults = $item['field']['sve_defaults'] ?? $item['config']['sve_defaults'] ?? null;

        // Indpakningens eget nøgleord hører ikke hjemme på feltet indeni.
        if (is_array($item['field'] ?? null)) {
            unset($item['field']['sve_defaults']);
        }

        unset($item['config']['sve_defaults']);

        if (is_array($defaults) && array_key_exists($breakpoint, $defaults)) {
            if (is_array($item['field'] ?? null)) {
                $item['field']['default'] = $defaults[$breakpoint];
            } else {
                $item['config']['default'] = $defaults[$breakpoint];
            }

            return $item;
        }

        if ($breakpoint === static::base()) {
            return $item;
        }

        if (is_array($item['field'] ?? null)) {
            unset($item['field']['default']);
        }

        unset($item['config']['default']);

        return $item;
    }

    /**
     * Værdier gemt før feltet blev responsivt.
     *
     * Sådan en værdi har ingen skuffer — den *er* værdien. Den regnes som desktop,
     * altså basis, hvilket er præcis hvad den var: det eneste der fandtes. Uden
     * det ville et flueben på et felt tømme hver side der brugte det.
     *
     * @param  mixed  $data
     * @return array<string, mixed>
     */
    protected function normalize($data): array
    {
        $data = is_array($data) ? $data : [];

        if (! $data || array_intersect(array_keys($data), static::handles())) {
            return $data;
        }

        $handles = $this->fields()->all()->keys()->all();

        return [static::base() => count($handles) === 1 ? [$handles[0] => $data] : $data];
    }

    /** Ingen værdi — feltet arver i stedet for at sige noget selv. */
    protected function isBlank($value): bool
    {
        return $value === null || $value === '' || $value === [];
    }

    /**
     * Formularen viser hvad der gælder, ikke hvad der er gemt.
     *
     * Et tomt felt på tablet siger ikke "ingenting" — det siger "det samme som
     * desktop". Den forskel kan man ikke se på en tom rubrik, så tablet og mobil
     * fyldes op med det de arver, og man går fra desktop til mobil uden at
     * indstillingerne forsvinder undervejs.
     *
     * Det er kun en visning. Hvad der rent faktisk gemmes, afgøres i `process()`,
     * som fjerner det igen — de to hænger sammen og skal læses sammen.
     */
    public function preProcess($data)
    {
        $data = $this->normalize($data);
        $out = [];
        $effective = [];

        foreach (static::handles() as $breakpoint) {
            // Blankhed afgøres på den rå gemte værdi — ikke efter fieldtype-
            // preProcess. Spacing (og lign.) erstatter tom input med en
            // placeholder-række (`value: 0`), som ellers blokerer arven og får
            // tablet/mobil til at ligne overrides, når laptop har en default.
            $raw = $data[$breakpoint] ?? [];

            $values = $this->fields($breakpoint)
                ->addValues($raw)
                ->preProcess()
                ->values()
                ->all();

            foreach ($values as $handle => $value) {
                if ($this->isBlank($raw[$handle] ?? null) && isset($effective[$handle])) {
                    $values[$handle] = $effective[$handle];
                }
            }

            $out[$breakpoint] = $effective = $values;
        }

        return $out;
    }

    public function process($data)
    {
        $data = is_array($data) ? $data : [];
        $out = [];
        $effective = [];

        foreach (static::handles() as $breakpoint) {
            $raw = $data[$breakpoint] ?? [];

            $values = Arr::removeNullValues(
                $this->fields($breakpoint)
                    ->addValues($raw)
                    ->process()
                    ->values()
                    ->all()
            );

            // Modstykket til opfyldningen i `preProcess()`. Feltet fik den arvede
            // værdi at se; kommer den uændret tilbage, er den ikke et valg, men
            // arven der er sluppet igennem — og gemmes den, er den ikke længere
            // arv. Så ville ét besøg på tabletfanen fastfryse alt hvad desktop
            // havde stående, og en senere ændring på desktop ville aldrig nå
            // derned. Er værdien en anden, har nogen rørt den, og så gemmes den.
            //
            // Det giver også en vej tilbage: sæt tablet til det samme som
            // desktop, og feltet arver igen.
            foreach ($values as $handle => $value) {
                // Tom skuffe i rå data = arv, ikke fieldtype-placeholder som override.
                if ($breakpoint !== static::base() && $this->isBlank($raw[$handle] ?? null)) {
                    unset($values[$handle]);

                    continue;
                }

                if (array_key_exists($handle, $effective) && $effective[$handle] == $value) {
                    unset($values[$handle]);
                }
            }

            $effective = array_merge($effective, $values);

            // Et tomt breakpoint gemmes ikke: tomt betyder "arver", og en tom
            // skuffe i filen ville kun være støj at læse sig igennem.
            if (! empty($values)) {
                $out[$breakpoint] = $values;
            }
        }

        return $out ?: null;
    }

    /**
     * Meta pr. breakpoint, lagt fladt ud under breakpointets handle, så
     * `meta-path-prefix` i browseren kan pege samme sted som værdien:
     * `design.tablet`. Breakpoint-listen ligger under en nøgle med `_` foran, som
     * intet breakpoint kan hedde.
     *
     * Arven gælder også her. Meta er hvad feltet skal bruge for at kunne tegne sin
     * værdi — et assets-felt skal kende sit billede, et select sin etiket — så et
     * felt der viser den arvede værdi skal have den arvede metadata med. Ellers
     * står tabletten med desktops værdi og sin egen tomme beskrivelse af den.
     */
    public function preload()
    {
        $value = $this->normalize($this->field->value());

        // Teksterne følger med feltet i stedet for at ligge i en global
        // JS-konfiguration. Meta bygges under den request der spørger, altså efter
        // Statamic har afgjort hvilket sprog brugeren læser — her er svaret sikkert.
        $meta = [
            '_breakpoints' => static::breakpoints(),
            '_strings' => [
                'changed' => __('sve::messages.responsive_changed'),
                'changed_count' => __('sve::messages.responsive_changed_count'),
                'reset' => __('sve::messages.responsive_reset'),
                'inherit_from' => __('sve::messages.responsive_inherit_from'),
            ],
        ];
        $effective = [];

        foreach (static::handles() as $breakpoint) {
            $values = $value[$breakpoint] ?? [];

            if ($breakpoint === static::base() && ! $values) {
                $values = $this->defaultValues($breakpoint);
            }

            $effective = array_merge(
                $effective,
                array_filter($values, fn ($v) => ! $this->isBlank($v))
            );

            $meta[$breakpoint] = $this->fields($breakpoint)
                ->addValues($effective)
                ->meta()
                ->toArray();
        }

        return $meta;
    }

    /** @return array<string, mixed> */
    protected function defaultValues(string $breakpoint): array
    {
        return $this->fields($breakpoint)
            ->all()
            ->map(fn ($field) => $field->fieldtype()->preProcess($field->defaultValue()))
            ->all();
    }

    public function augment($value)
    {
        return $this->performAugmentation($value, false);
    }

    public function shallowAugment($value)
    {
        return $this->performAugmentation($value, true);
    }

    /**
     * Ingen arv her, i modsætning til `preProcess()`.
     *
     * Skabelonen skriver et breakpoint ud som en media query, og arven er noget
     * CSS selv klarer: det der ikke står i `@media`, gælder stadig. Fyldte vi
     * op, ville hver media query gentage alt, og en ændring på desktop ville
     * blive overskrevet af tabletten et par linjer længere nede.
     */
    private function performAugmentation($value, bool $shallow)
    {
        $value = $this->normalize($value);

        // Read twelve times per section by the CSS partials, and each read used
        // to rebuild all three breakpoints — see MemoizesAugmentation.
        return $this->memoizedAugmentation($value, $shallow, function () use ($value, $shallow) {
            $method = $shallow ? 'shallowAugment' : 'augment';
            $out = [];

            foreach (static::handles() as $breakpoint) {
                $out[$breakpoint] = new Values(
                    $this->fields($breakpoint)
                        ->addValues($value[$breakpoint] ?? [])
                        ->{$method}()
                        ->values()
                        ->all()
                );
            }

            return new Values($out);
        });
    }

    public function rules(): array
    {
        return ['array'];
    }
}
