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
 * Listen står altid bredeste først — det er den orden knapper, faner og
 * oversigten tegner den i. Hvilken ende der er basis, afgør retningen:
 *
 * - **Desktop-first** (standard): den bredeste er basis og skrives uden media
 *   query; hver smallere er en undtagelse under `(width < …)`, grænsen er det
 *   foregående breakpoints `min`.
 * - **Mobile-first**: den smalleste er basis; hver bredere er en undtagelse
 *   under `(width >= …)`, grænsen er dens eget `min`.
 *
 * Kaskaden — rækkefølgen CSS skrives ud i, og hvad et tomt felt arver fra —
 * er `cascade()`: basis først. Desktop-first er det samme som listen;
 * mobile-first er den vendt om. Retningen vælges når sitet startes: gemt
 * indhold og `max-lg:`-klasser i skabelonerne skifter ikke betydning med.
 *
 * `handle` er den nøgle gemt indhold ligger under. Den kan tilføjes, men aldrig
 * omdøbes uden at værdier i hver eneste entry mister deres ejer.
 *
 * This class keeps the resolved list (cached per request) and everything
 * read from it; the parsing lives in `Breakpoints\Rows`, the button text in
 * `Breakpoints\Labels` and the CSS forms in `Breakpoints\Queries`.
 */
class Breakpoints
{
    public const DEFAULTS = Rows::DEFAULTS;
    public const UNITS = Rows::UNITS;
    public const ROOT_PX = Rows::ROOT_PX;
    public const MAX = Rows::MAX;
    public const LABEL_KEYS = Labels::LABEL_KEYS;
    public const DIRECTIONS = Rows::DIRECTIONS;

    /** Ikonerne der kan vælges pr. breakpoint. Navnet slås op i cp-shell/preview-chrome.js. */
    public const ICONS = ['mobile', 'mobile_landscape', 'tablet', 'tablet_landscape', 'laptop', 'desktop', 'widescreen', 'ultrawide', 'tv'];

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
            return static::labelled(static::$resolved);
        }

        $direction = Rows::direction();

        $rows = array_map(function ($row) {
            $row['min_px'] = Rows::toPx((float) $row['min'], $row['unit']);

            return $row;
        }, Rows::rows());

        // Bredeste først. Sorteret på pixels, så en liste der blander em og px
        // stadig står i orden. Dette er visningsordenen; kaskaden er cascade().
        usort($rows, fn ($a, $b) => $b['min_px'] <=> $a['min_px']);

        $last = count($rows) - 1;
        $out = [];

        foreach ($rows as $i => $row) {
            $row['direction'] = $direction;

            if ($direction === 'mobile') {
                // Den smalleste er basis. Hver bredere skrives fra sit eget
                // `min` og op — grænsen er dens egen, ikke naboens.
                $row['base'] = $i === $last;
                $row['media'] = $row['base'] ? '' : Queries::from($row);
                $row['media_px'] = $row['base'] ? '' : Queries::fromPx($row['min_px']);
                $row['max'] = null;
                $row['tw'] = $row['base'] ? '' : Queries::tailwind($row, 'mobile');
            } else {
                $previous = $rows[$i - 1] ?? null;

                // Grænsen er det foregående breakpoints `min`, skrevet i DEN
                // rækkes enhed: det er dér grænsen blev besluttet.
                $row['base'] = $i === 0;
                $row['media'] = $previous ? Queries::below($previous) : '';
                $row['media_px'] = $previous ? Queries::belowPx($previous['min_px']) : '';
                $row['max'] = $previous ? Queries::maxPx($previous['min_px']).'px' : null;
                $row['tw'] = $previous ? Queries::tailwind($previous, 'desktop') : '';
            }

            // `label` bliver stående som den nøgle den er skrevet som. Den
            // slås op ved hvert opslag, ikke her — se kommentaren på $resolved.

            $out[] = $row;
        }

        static::$resolved = $out;

        return static::labelled($out);
    }

    /** @param  array<int, array<string, mixed>>  $rows */
    protected static function labelled(array $rows): array
    {
        return array_map(function ($row) {
            $row['label'] = Labels::label($row);

            return $row;
        }, $rows);
    }

    /** Glem den læste liste — indstillingerne er gemt om. */
    public static function forget(): void
    {
        static::$resolved = null;
    }

    /** `desktop` (bredeste er basis) eller `mobile` (smalleste er basis). */
    public static function direction(): string
    {
        return Rows::direction();
    }

    /**
     * Listen i kaskade-orden: basis først, derefter hver undtagelse i den
     * rækkefølge CSS skal skrive dem, så den sidste vinder hvor to gælder.
     *
     * Desktop-first er listen selv; mobile-first er den vendt om. Alt der
     * regner arv eller skriver `@media`-blokke læser denne — ikke `all()`.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function cascade(): array
    {
        $all = static::all();

        return static::direction() === 'mobile' ? array_reverse($all) : $all;
    }

    /** Handles i visningsorden — bredeste først. Ingen kaskade-betydning. */
    /** @return array<int, string> */
    public static function handles(): array
    {
        return array_column(static::all(), 'handle');
    }

    /** Handles i kaskade-orden — basis først. Det et tomt felt arver langs. */
    /** @return array<int, string> */
    public static function cascadeHandles(): array
    {
        return array_column(static::cascade(), 'handle');
    }

    /** Basis-breakpointet — det der skrives ud uden media query. */
    public static function base(): string
    {
        return static::cascade()[0]['handle'];
    }

    /**
     * Hvad hvert breakpoint arver fra, nærmeste først.
     *
     * Desktop-first: tomt på tablet betyder "det samme som desktop", og tomt
     * på mobil betyder "det samme som tablet, som måske selv arver".
     * Mobile-first: det omvendte — tablet arver fra mobil, desktop fra tablet.
     *
     * @return array<string, array<int, string>>
     */
    public static function inherits(): array
    {
        $out = [];
        $above = [];

        foreach (static::cascadeHandles() as $handle) {
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
            'direction' => $row['direction'],
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
