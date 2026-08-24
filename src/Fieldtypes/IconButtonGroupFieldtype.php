<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use MarioHamann\StatamicVisualEditor\IconifyDefault;
use Statamic\Fields\Fieldtype;
use Statamic\Fieldtypes\HasSelectOptions;

/**
 * Knapgruppe med ikoner — Statamics `button_group`, hvor knappen kan være et
 * billede i stedet for et ord.
 *
 * Værdien er den samme som før: én nøgle ud af en håndfuld, gemt som tekst og
 * læst som `LabeledValue`. Ikonet er et Iconify-navn i et tekstfelt, samme
 * greb som `tab_icon`. Det tegnes på knappen i Control Panel; det offentlige
 * site får kun nøglen (`left`).
 *
 * Den gamle skrivemåde (Statamic-ikon, `icon_source`, Iconify-vælger) læses
 * stadig, så eksisterende YAML ikke skal skrives om.
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
                'display' => __('sve::messages.ibg_options'),
                'fields' => [
                    'options' => [
                        'display' => __('sve::messages.ibg_options'),
                        'instructions' => __('sve::messages.ibg_options_instructions'),
                        'type' => 'grid',
                        'add_row' => __('sve::messages.ibg_add_option'),
                        'reorderable' => true,
                        'fullscreen' => false,
                        'fields' => [
                            [
                                'handle' => 'key',
                                'field' => [
                                    'type' => 'text',
                                    'display' => __('sve::messages.ibg_key'),
                                    'width' => 50,
                                ],
                            ],
                            [
                                'handle' => 'iconify',
                                'field' => [
                                    'type' => 'text',
                                    'display' => __('sve::messages.ibg_icon'),
                                    'instructions' => __('sve::messages.ibg_icon_instructions'),
                                    'placeholder' => 'mdi:palette',
                                    'width' => 50,
                                ],
                            ],
                        ],
                    ],
                    'show_labels' => [
                        'display' => __('sve::messages.ibg_show_labels'),
                        'instructions' => __('sve::messages.ibg_show_labels_instructions'),
                        'type' => 'toggle',
                        'default' => false,
                        'width' => 50,
                    ],
                    'clearable' => [
                        'display' => __('sve::messages.ibg_clearable'),
                        'instructions' => __('sve::messages.ibg_clearable_instructions'),
                        'type' => 'toggle',
                        'default' => false,
                        'width' => 50,
                    ],
                ],
            ],
            [
                'display' => __('sve::messages.ibg_data_format'),
                'fields' => [
                    'default' => [
                        'display' => __('sve::messages.ibg_default'),
                        'instructions' => __('sve::messages.ibg_default_instructions'),
                        'type' => 'text',
                    ],
                ],
            ],
        ];
    }

    /**
     * Gammel Iconify-vælger gemte `{name: …}`. Tekstfeltet skal have strengen.
     */
    public function preProcessConfig($data)
    {
        if (! is_array($data) || ! is_array($data['options'] ?? null)) {
            return $data;
        }

        $data['options'] = collect($data['options'])
            ->map(function ($option) {
                if (! is_array($option)) {
                    return $option;
                }

                $name = $this->iconifyName($option)
                    ?? $this->iconifyNameFromStatamicField($option);

                if ($name) {
                    $option['iconify'] = $name;
                }

                return $option;
            })
            ->all();

        return $data;
    }

    /**
     * Mulighederne, som knapperne skal tegnes af.
     *
     * `HasSelectOptions` forventer `value` og `label`; `icon` og `icon_html` er
     * det vi lægger oveni. `icon_html` er SVG'en addon.js allerede tegner i
     * slottet. Navnet hentes via IconifyDefault (cachet), samme vej som
     * `{{ iconify:icon }}`.
     *
     * @return array<int, array{value: string, label: ?string, icon: ?string, icon_html: ?string}>
     */
    protected function getOptions(): array
    {
        return collect($this->config('options') ?? [])
            ->map(function ($option, $key) {
                if (is_array($option)) {
                    $icon = $this->optionIcon($option);

                    return [
                        'value' => (string) ($option['key'] ?? $key),
                        'label' => $this->blankToNull($option['label'] ?? null),
                        'icon' => $icon,
                        'icon_html' => $this->optionIconHtml($option),
                    ];
                }

                return is_int($key)
                    ? ['value' => (string) $option, 'label' => null, 'icon' => null, 'icon_html' => null]
                    : ['value' => (string) $key, 'label' => $this->blankToNull($option), 'icon' => null, 'icon_html' => null];
            })
            ->reject(fn ($option) => $option['value'] === '')
            ->values()
            ->all();
    }

    /**
     * Iconify-navn først. Gammel Statamic-`icon` læses kun hvis der ikke er et navn.
     */
    private function optionIcon(array $option): ?string
    {
        if ($name = $this->iconifyName($option) ?? $this->iconifyNameFromStatamicField($option)) {
            return $name;
        }

        if (($option['icon_source'] ?? null) === 'iconify') {
            return null;
        }

        $icon = $this->blankToNull($option['icon'] ?? null);

        return ($icon && ! IconifyDefault::isName($icon)) ? $icon : null;
    }

    private function iconifyName(array $option): ?string
    {
        $iconify = $option['iconify'] ?? null;

        if (is_array($iconify)) {
            return $this->blankToNull($iconify['name'] ?? null);
        }

        return $this->blankToNull(is_string($iconify) ? $iconify : null);
    }

    private function iconifyNameFromStatamicField(array $option): ?string
    {
        $icon = $this->blankToNull($option['icon'] ?? null);

        return ($icon && IconifyDefault::isName($icon)) ? $icon : null;
    }

    /**
     * SVG til knappen. Addon.js tegner kun `icon_html` — uden den er knappen tom.
     */
    private function optionIconHtml(array $option): ?string
    {
        $raw = $option['iconify'] ?? null;

        if (is_array($raw) && array_key_exists('body', $raw)) {
            $html = $this->svgFromData($raw);

            return $html !== '' ? $html : null;
        }

        $name = $this->iconifyName($option)
            ?? $this->iconifyNameFromStatamicField($option);

        if (! $name || ! IconifyDefault::isName($name)) {
            return null;
        }

        $html = IconifyDefault::render($name, fn (array $data) => $this->svgFromData($data));

        return is_string($html) && $html !== '' ? $html : null;
    }

    /**
     * @param  array{body?: string, attributes?: array<string, string>}  $icon
     */
    private function svgFromData(array $icon): string
    {
        $viewBox = $icon['attributes']['viewBox'] ?? '0 0 24 24';
        $body = $icon['body'] ?? '';

        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'.e($viewBox).'" fill="currentColor" width="1em" height="1em" aria-hidden="true">'.$body.'</svg>';
    }

    private function blankToNull($value): ?string
    {
        $value = is_string($value) ? trim($value) : $value;

        return ($value === '' || $value === null) ? null : (string) $value;
    }
}
