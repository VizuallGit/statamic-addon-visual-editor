<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\Breakpoints\Labels;
use MarioHamann\StatamicVisualEditor\Breakpoints\Queries;
use MarioHamann\StatamicVisualEditor\Breakpoints\Rows;

/**
 * Skærmstørrelserne dette site designer til — én liste, læst af alt.
 *
 * Før lå grænsen syv steder: fieldtypens konstant, Live Previews enheder,
 * ikonerne i cp.js, Tailwind-rækkens præfikser, kolonnespændets buckets og
 * arve-kæden. Et tal skrevet syv steder bliver før eller siden syv tal.
 *
 * Listen er desktop-first: bredeste først, og den bredeste er basis — den
 * skrives uden media query, og de smallere er undtagelser fra den. Derfor
 * udledes `max` af det foregående breakpoints `min`, så de to aldrig kan komme
 * til at gælde på præcis den samme pixel.
 *
 * `handle` er den nøgle gemt indhold ligger under. Den kan tilføjes, men aldrig
 * omdøbes uden at værdier i hver eneste entry mister deres ejer.
 *
 * This class keeps the resolved list (cached per request) and everything
 * read from it; the parsing lives in `Breakpoints\Rows`, the button text in
 * `Breakpoints\Labels` and the CSS forms in `Breakpoints\Queries`. Split in
 * WP7d, code moved verbatim.
 */
class Breakpoints
{
    public const DEFAULTS = Rows::DEFAULTS;
    public const UNITS = Rows::UNITS;
    public const ROOT_PX = Rows::ROOT_PX;
    public const LABEL_KEYS = Labels::LABEL_KEYS;

    /** Ikonerne der kan vælges pr. breakpoint. Navnet slås op i cp.js. */
    public const ICONS = ['desktop', 'laptop', 'tablet', 'mobile', 'watch', 'tv'];

    /**
     * Cachet pr. request: indstillingerne læses fra disk.
     *
     * Kun det udledte — ikke navnene. Navnet er en oversættelse, og
     * oversættelserne er først indlæst et stykke inde i boot; den første der
     * spørger om listen er tit `config()`-kaldet der sætter Live Previews
     * enheder, og det sker før. Blev navnet cachet dér, stod der `desktop`
     * med lille d resten af requesten.
     */
    protected static ?array $resolved = null;

    /**
     * Listen som den er nu — bredeste først, med alt udledt fyldt ud.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function all(): array
    {
        if (static::$resolved !== null) {
            return array_map(function ($row) {
                $row['label'] = Labels::label($row);

                return $row;
            }, static::$resolved);
        }

        $rows = array_map(function ($row) {
            $row['min_px'] = Rows::toPx((float) $row['min'], $row['unit']);

            return $row;
        }, Rows::rows());

        // Bredeste først. Rækkefølgen er hele kaskaden: den første er basis,
        // og hver følgende er en undtagelse fra dem over den. Sorteret på
        // pixels, så en liste der blander em og px stadig står i orden.
        usort($rows, fn ($a, $b) => $b['min_px'] <=> $a['min_px']);

        $out = [];

        foreach ($rows as $i => $row) {
            $previous = $rows[$i - 1] ?? null;

            $row['base'] = $i === 0;

            // Grænsen er det foregående breakpoints `min`, skrevet i DEN
            // rækkes enhed: det er dér grænsen blev besluttet.
            $row['media'] = $previous ? Queries::query($previous) : '';
            $row['media_px'] = $previous ? Queries::queryPx($previous['min_px']) : '';
            $row['max'] = $previous ? Queries::maxPx($previous['min_px']).'px' : null;
            $row['tw'] = Queries::tailwindPrefix($previous['min_px'] ?? null);

            // `label` bliver stående som den nøgle den er skrevet som. Den
            // slås op ved hvert opslag, ikke her — se kommentaren på $resolved.

            $out[] = $row;
        }

        static::$resolved = $out;

        return array_map(function ($row) {
            $row['label'] = Labels::label($row);

            return $row;
        }, $out);
    }

    /** Glem den læste liste — indstillingerne er gemt om. */
    public static function forget(): void
    {
        static::$resolved = null;
    }

    /** @return array<int, string> */
    public static function handles(): array
    {
        return array_column(static::all(), 'handle');
    }

    /** Basis-breakpointet — det der skrives ud uden media query. */
    public static function base(): string
    {
        return static::all()[0]['handle'];
    }

    /**
     * Hvad hvert breakpoint arver fra, nærmeste først.
     *
     * Tomt på tablet betyder "det samme som desktop", og tomt på mobil betyder
     * "det samme som tablet, som måske selv arver".
     *
     * @return array<string, array<int, string>>
     */
    public static function inherits(): array
    {
        $out = [];
        $above = [];

        foreach (static::handles() as $handle) {
            $out[$handle] = $above;
            $above = array_merge([$handle], $above);
        }

        return $out;
    }

    /**
     * Enhederne Live Preview skal vise, i Statamics eget format.
     *
     * Basis er den bredeste og får ingen `max`, men har stadig en knap — det er
     * den man designer på.
     *
     * @return array<string, array<string, int>>
     */
    public static function devices(): array
    {
        $out = [];

        foreach (static::all() as $row) {
            $out[$row['device']] = ['width' => $row['width'], 'height' => $row['height']];
        }

        return $out;
    }

    /** Listen som browseren skal have den. */
    public static function forScript(): array
    {
        return array_map(fn ($row) => [
            'handle' => $row['handle'],
            'label' => $row['label'],
            'device' => $row['device'],
            'icon' => $row['icon'],
            'base' => $row['base'],
            'min' => $row['min'],
            'unit' => $row['unit'],
            'min_px' => $row['min_px'],
            'max' => $row['max'],
            'media' => $row['media'],
            'media_px' => $row['media_px'],
            'tw' => $row['tw'],
        ], static::all());
    }
}
