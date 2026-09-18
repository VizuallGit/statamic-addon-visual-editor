<?php

namespace MarioHamann\StatamicVisualEditor\Breakpoints;

use MarioHamann\StatamicVisualEditor\Features;

/**
 * The rows as they are written — settings screen, then config, then the
 * three defaults — before anything is derived.
 * Moved verbatim out of Breakpoints in WP7d.
 */
final class Rows
{
    /**
     * De tre der altid har været her, med de bredder Live Preview brugte i
     * forvejen. `label` er en sprognøgle (`responsive_*`); et selvvalgt
     * breakpoint bærer sin egen tekst i stedet.
     */
    public const DEFAULTS = [
        [
            'handle' => 'laptop',
            'label' => 'desktop',
            'device' => 'Desktop',
            'min' => 64,
            'unit' => 'em',
            'width' => 1440,
            'height' => 900,
            'icon' => 'desktop',
        ],
        [
            'handle' => 'tablet',
            'label' => 'tablet',
            'device' => 'Tablet',
            'min' => 48,
            'unit' => 'em',
            'width' => 810,
            'height' => 1080,
            'icon' => 'tablet',
        ],
        [
            'handle' => 'mobile',
            'label' => 'mobile',
            'device' => 'Mobile',
            'min' => 0,
            'unit' => 'em',
            'width' => 375,
            'height' => 812,
            'icon' => 'mobile',
        ],
    ];

    /**
     * Enhederne en grænse kan skrives i.
     *
     * `em` og `rem` er det samme i en media query — begge måles mod browserens
     * initielle skriftstørrelse, ikke mod `html { font-size }`, for relative
     * enheder i en media query bygger pr. definition på startværdien. Rådet om
     * at `em` er sikrest stammer fra en gammel Safari-fejl, som er rettet.
     *
     * Det der betyder noget, er at begge følger brugerens egen indstilling af
     * skriftstørrelse. Det gør `px` ikke: sætter nogen deres standard op, så
     * de kan læse, flytter et `px`-breakpoint sig ikke en tøddel. Derfor er
     * `em` standarden her, og `px` noget man vælger bevidst.
     */
    public const UNITS = ['em', 'rem', 'px'];

    /** Rod-skriftstørrelsen en relativ grænse måles mod. */
    public const ROOT_PX = 16;

    /**
     * Rækkerne som de er skrevet, før noget udledes.
     *
     * Indstillingsskærmen vinder, config svarer for det den ikke dækker, og
     * ellers er det de tre der altid har været her. En række uden `handle`
     * eller uden et tal i `min` er ikke et breakpoint og springes over.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function rows(): array
    {
        $saved = Features::setting('breakpoints');

        if (! is_array($saved) || $saved === []) {
            $saved = config('statamic-visual-editor.breakpoints');
        }

        if (! is_array($saved) || $saved === []) {
            return static::DEFAULTS;
        }

        $rows = [];

        foreach ($saved as $row) {
            if (! is_array($row)) {
                continue;
            }

            $handle = static::handle($row['handle'] ?? $row['device'] ?? '');

            if ($handle === '' || ! is_numeric($row['min'] ?? null)) {
                continue;
            }

            $unit = strtolower(trim((string) ($row['unit'] ?? 'em')));
            $unit = in_array($unit, static::UNITS, true) ? $unit : 'em';
            $min = (float) $row['min'];

            $rows[$handle] = [
                'handle' => $handle,
                'label' => (string) ($row['label'] ?? $handle),
                'device' => (string) ($row['device'] ?? ucfirst($handle)),
                'min' => $min,
                'unit' => $unit,
                'width' => (int) ($row['width'] ?? max(360, (int) static::toPx($min, $unit))),
                'height' => (int) ($row['height'] ?? 900),
                'icon' => (string) ($row['icon'] ?? 'desktop'),
            ];
        }

        // Uden et basis-breakpoint har ingenting et sted at stå: det der ikke
        // er en undtagelse, er reglen. Falder tilbage frem for at tegne intet.
        return $rows === [] ? static::DEFAULTS : array_values($rows);
    }

    /** Et handle er en datanøgle, ikke en overskrift. */
    protected static function handle(string $raw): string
    {
        $handle = strtolower(trim($raw));
        $handle = preg_replace('/[^a-z0-9_]+/', '_', $handle) ?? '';
        $handle = trim($handle, '_');

        return preg_match('/^[a-z]/', $handle) ? $handle : '';
    }

    /** En grænse i pixels, uanset hvilken enhed den er skrevet i. */
    public static function toPx(float $value, string $unit): float
    {
        return $unit === 'px' ? $value : $value * static::ROOT_PX;
    }
}
