<?php

namespace MarioHamann\StatamicVisualEditor;

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
 */
class Breakpoints
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

    /** Ikonerne der kan vælges pr. breakpoint. Navnet slås op i cp.js. */
    public const ICONS = ['desktop', 'laptop', 'tablet', 'mobile', 'watch', 'tv'];

    /** De navne der er sprognøgler. Alt andet er tekst nogen har skrevet. */
    public const LABEL_KEYS = ['desktop', 'tablet', 'mobile'];

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
                $row['label'] = static::label($row);

                return $row;
            }, static::$resolved);
        }

        $rows = array_map(function ($row) {
            $row['min_px'] = static::toPx((float) $row['min'], $row['unit']);

            return $row;
        }, static::rows());

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
            $row['media'] = $previous ? static::query($previous) : '';
            $row['media_px'] = $previous ? static::queryPx($previous['min_px']) : '';
            $row['max'] = $previous ? static::maxPx($previous['min_px']).'px' : null;
            $row['tw'] = static::tailwindPrefix($previous['min_px'] ?? null);

            // `label` bliver stående som den nøgle den er skrevet som. Den
            // slås op ved hvert opslag, ikke her — se kommentaren på $resolved.

            $out[] = $row;
        }

        static::$resolved = $out;

        return array_map(function ($row) {
            $row['label'] = static::label($row);

            return $row;
        }, $out);
    }

    /** Glem den læste liste — indstillingerne er gemt om. */
    public static function forget(): void
    {
        static::$resolved = null;
    }

    /**
     * Rækkerne som de er skrevet, før noget udledes.
     *
     * Indstillingsskærmen vinder, config svarer for det den ikke dækker, og
     * ellers er det de tre der altid har været her. En række uden `handle`
     * eller uden et tal i `min` er ikke et breakpoint og springes over.
     *
     * @return array<int, array<string, mixed>>
     */
    protected static function rows(): array
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

    /**
     * Navnet der står på knappen.
     *
     * De tre indbyggede bærer en sprognøgle, så de kan oversættes; et selvvalgt
     * breakpoint bærer den tekst nogen har skrevet, og den skal stå som skrevet.
     * Derfor en fast liste og ikke "prøv at slå op": ellers ville et
     * breakpoint nogen kaldte "mobile" pludselig hedde noget andet på dansk.
     *
     * Slår opslaget fejl — sproget er ikke indlæst endnu — bliver det stadig
     * til `Desktop` og aldrig til `desktop`.
     */
    protected static function label(array $row): string
    {
        $raw = trim((string) ($row['label'] ?? ''));

        if ($raw === '') {
            return ucfirst((string) $row['handle']);
        }

        if (! in_array($raw, static::LABEL_KEYS, true)) {
            return $raw;
        }

        if (! static::translationsReady()) {
            return ucfirst($raw);
        }

        $key = 'sve::messages.responsive_'.$raw;
        $out = __($key);

        return is_string($out) && $out !== $key ? $out : ucfirst($raw);
    }

    /**
     * Er `sve::` fortalt hvor den bor endnu?
     *
     * At spørge om en oversættelse for tidligt er ikke bare et tomt svar:
     * Laravel husker det tomme svar for resten af requesten, og så er hver
     * eneste `sve::`-tekst på siden en rå nøgle. Listen læses under boot —
     * enhedsknapperne skal stå der før noget rendres — så den kan udmærket
     * blive spurgt før. Derfor spørger vi først, om der er nogen at spørge.
     */
    protected static function translationsReady(): bool
    {
        try {
            $loader = app('translator')->getLoader();

            return method_exists($loader, 'namespaces')
                && array_key_exists('sve', $loader->namespaces());
        } catch (\Throwable) {
            return false;
        }
    }

    /** En grænse i pixels, uanset hvilken enhed den er skrevet i. */
    protected static function toPx(float $value, string $unit): float
    {
        return $unit === 'px' ? $value : $value * static::ROOT_PX;
    }

    /** Et tal uden efterslæbende nuller — `64.00` bliver `64`. */
    protected static function num(float $value): string
    {
        return rtrim(rtrim(number_format($value, 4, '.', ''), '0'), '.');
    }

    /**
     * Media query'en for "smallere end denne grænse", i grænsens egen enhed.
     *
     * `width < 64em` er strengt mindre end, så der er ingen grund til at trække
     * en hundrededel fra: de to størrelser kan ikke begge gælde på grænsen.
     * `max-width` er inklusiv og skal stadig have sit nøk.
     */
    protected static function query(array $row): string
    {
        $unit = $row['unit'] === 'px' ? 'px' : $row['unit'];

        if ($unit === 'px') {
            return static::queryPx((float) $row['min']);
        }

        return '(width < '.static::num((float) $row['min']).$unit.')';
    }

    /** Den inklusive px-form, som `{{ responsive_css }}` altid har skrevet. */
    protected static function queryPx(float $px): string
    {
        return '(max-width: '.static::maxPx($px).'px)';
    }

    /** En anelse under grænsen, så de to størrelser ikke overlapper. */
    protected static function maxPx(float $px): string
    {
        return static::num(round($px - 0.02, 2));
    }

    /**
     * Tailwind-præfikset for "smallere end denne grænse".
     *
     * Tailwinds egen skala har kun fem trin. Rammer grænsen et af dem, er
     * `max-lg:` det man ville skrive i hånden; ellers er der ingen klasse, og
     * så er den vilkårlige `max-[900px]:` den eneste rigtige.
     */
    protected static function tailwindPrefix(?float $min): string
    {
        if ($min === null) {
            return '';
        }

        $scale = [640 => 'sm', 768 => 'md', 1024 => 'lg', 1280 => 'xl', 1536 => '2xl'];
        $key = (int) $min;

        return isset($scale[$key]) && (float) $key === $min
            ? 'max-'.$scale[$key]
            : 'max-['.rtrim(rtrim(number_format($min, 2, '.', ''), '0'), '.').'px]';
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
