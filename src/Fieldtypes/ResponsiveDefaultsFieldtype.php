<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Breakpoints;
use Statamic\Fields\Fieldtype;

/**
 * "Default pr. skærmstørrelse" i et felts indstillinger.
 *
 * Feltets almindelige Default Value bliver hvor den er og betyder stadig det
 * samme: værdien på basis-breakpointet. Den her ligger ved siden af og dækker
 * de smallere — én rubrik pr. breakpoint, læst fra {@see Breakpoints}, så en
 * ny skærmstørrelse dukker op af sig selv uden at nogen skal rette her.
 *
 * Værdien gemmes som `{tablet: …, mobile: …}` og læses af
 * {@see ResponsiveFieldtype::defaultFor()}. Tomme rubrikker skrives ikke, og
 * den skuffe arver så opad som hidtil — det er hele grunden til at dette er et
 * felt for sig og ikke bare en default skrevet ind i alle skuffer.
 */
class ResponsiveDefaultsFieldtype extends Fieldtype
{
    protected static $handle = 'sve_defaults';

    protected static $title = 'Responsive defaults';

    /** Kun til feltindstillinger — den skal ikke kunne vælges som felttype. */
    protected $selectable = false;

    protected $defaultable = false;

    public function component(): string
    {
        return 'sve-defaults';
    }

    protected function configFieldItems(): array
    {
        return [];
    }

    /**
     * De breakpoints rubrikkerne tegnes for — alle undtagen basis.
     *
     * Basis har feltets egen Default Value-række længere oppe, og den bliver
     * hvor den er. To rubrikker for samme tal gjorde det kun uklart hvilken
     * der gjaldt.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function rows(): array
    {
        return array_values(array_filter(
            Breakpoints::all(),
            fn ($row) => empty($row['base'])
        ));
    }

    public function preload(): array
    {
        return ['breakpoints' => static::rows()];
    }

    public function preProcess($value): array
    {
        return is_array($value) ? $value : [];
    }

    public function process($value): ?array
    {
        if (! is_array($value)) {
            return null;
        }

        $out = array_filter(
            $value,
            fn ($v) => $v !== null && $v !== '' && $v !== []
        );

        return $out ?: null;
    }
}
