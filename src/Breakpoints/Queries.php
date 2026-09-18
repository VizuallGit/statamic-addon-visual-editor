<?php

namespace MarioHamann\StatamicVisualEditor\Breakpoints;

/**
 * What a limit becomes in CSS: the media query in its own unit, the
 * inclusive px form `{{ responsive_css }}` writes, and the Tailwind prefix.
 * Moved verbatim out of Breakpoints in WP7d.
 */
final class Queries
{
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
    public static function query(array $row): string
    {
        $unit = $row['unit'] === 'px' ? 'px' : $row['unit'];

        if ($unit === 'px') {
            return static::queryPx((float) $row['min']);
        }

        return '(width < '.static::num((float) $row['min']).$unit.')';
    }

    /** Den inklusive px-form, som `{{ responsive_css }}` altid har skrevet. */
    public static function queryPx(float $px): string
    {
        return '(max-width: '.static::maxPx($px).'px)';
    }

    /** En anelse under grænsen, så de to størrelser ikke overlapper. */
    public static function maxPx(float $px): string
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
    public static function tailwindPrefix(?float $min): string
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
}
