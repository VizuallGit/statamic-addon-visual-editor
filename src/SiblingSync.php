<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Fields\Fieldtype;

/**
 * Fluebenet "Synk søskende" på hvert felts indstillinger.
 *
 * Feltet bliver stående som det er — Bg color er stadig Bg color. Krydset siger
 * kun at feltet i live preview kan låses til de andre rækker i samme liste med
 * samme handle. Selve synk, kilde og oplåsning bor i `sibling-sync.js`.
 *
 * Samme greb som {@see ResponsiveFields}: et spørgsmål stillet på det felt det
 * handler om. Ingen wrap, ingen ny fieldtype.
 */
class SiblingSync
{
    /** Config-nøglen, som den gemmes på feltet. */
    public const KEY = 'sve_sync_siblings';

    /** Gemmes på hver replicator-række, så en save beholder kilden. */
    public const STATE_HANDLE = '_sve_sync';

    /** Klasse på feltets wrapper, så panelet kan finde det uden Vue-config. */
    public const CLASS_NAME = 'sve-sync-siblings';

    /**
     * Sætter klassen når fluebenet er tændt. Feltet er uændret ellers.
     *
     * @param  array<string, mixed>  $field
     * @return array<string, mixed>
     */
    public static function apply(array $field): array
    {
        if (empty($field[static::KEY])) {
            return $field;
        }

        $classes = preg_split('/\s+/', (string) ($field['classes'] ?? ''), -1, PREG_SPLIT_NO_EMPTY) ?: [];

        if (! in_array(static::CLASS_NAME, $classes, true)) {
            $classes[] = static::CLASS_NAME;
        }

        $field['classes'] = implode(' ', $classes);

        return $field;
    }

    /**
     * Lægger fluebenet på alle felttyper.
     *
     * Kaldes fra {@see Http\Middleware\RegisterPanelVisibility}, samme sted og
     * af samme grund som Responsive: teksten skal være på brugerens sprog.
     */
    public static function register(): void
    {
        Fieldtype::appendConfigFields([
            static::KEY => [
                'display' => __('sve::messages.sync_siblings_setting'),
                'instructions' => __('sve::messages.sync_siblings_setting_instructions'),
                'type' => 'toggle',
                'default' => false,
                'width' => 50,
            ],
        ]);
    }
}
