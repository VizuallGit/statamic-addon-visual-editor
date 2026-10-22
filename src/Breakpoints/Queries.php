<?php

namespace MarioHamann\StatamicVisualEditor\Breakpoints;

/**
 * What a limit becomes in CSS: the media query in its own unit, the px form
 * `{{ responsive_css }}` has always written, and the Tailwind variant.
 *
 * Two directions, one limit. Desktop-first writes the sizes *below* a limit
 * (`(width < 64em)`, `max-lg:`); mobile-first writes the sizes *from* a limit
 * up (`(width >= 48em)`, `md:`). Which side a row is written on is decided in
 * `Breakpoints::all()`; here each form is just spelled out.
 */
final class Queries
{
    /** Tailwind's own scale, in px. A limit that lands on one of these gets the named variant. */
    public const TAILWIND_SCALE = [640 => 'sm', 768 => 'md', 1024 => 'lg', 1280 => 'xl', 1536 => '2xl'];

    /** Et tal uden efterslæbende nuller — `64.00` bliver `64`. */
    protected static function num(float $value): string
    {
        return rtrim(rtrim(number_format($value, 4, '.', ''), '0'), '.');
    }

    /**
     * "Narrower than this limit", in the limit's own unit.
     *
     * `width < 64em` er strengt mindre end, så der er ingen grund til at trække
     * en hundrededel fra: de to størrelser kan ikke begge gælde på grænsen.
     * `max-width` er inklusiv og skal stadig have sit nøk.
     */
    public static function below(array $row): string
    {
        if ($row['unit'] === 'px') {
            return static::belowPx((float) $row['min']);
        }

        return '(width < '.static::num((float) $row['min']).$row['unit'].')';
    }

    /** Den inklusive px-form, som `{{ responsive_css }}` altid har skrevet. */
    public static function belowPx(float $px): string
    {
        return '(max-width: '.static::maxPx($px).'px)';
    }

    /** "This limit and wider", in the limit's own unit. Inclusive, so no nudge. */
    public static function from(array $row): string
    {
        if ($row['unit'] === 'px') {
            return static::fromPx((float) $row['min']);
        }

        return '(width >= '.static::num((float) $row['min']).$row['unit'].')';
    }

    /** The px form of "from here up": `min-width` is inclusive already. */
    public static function fromPx(float $px): string
    {
        return '(min-width: '.static::num($px).'px)';
    }

    /** En anelse under grænsen, så de to størrelser ikke overlapper. */
    public static function maxPx(float $px): string
    {
        return static::num(round($px - 0.02, 2));
    }

    /**
     * The Tailwind variant for a limit.
     *
     * Tailwinds egen skala har kun fem trin. Rammer grænsen et af dem, er
     * `max-lg:` (eller `lg:` mobile-first) det man ville skrive i hånden;
     * ellers er der ingen klasse, og så er den vilkårlige `max-[56.25em]:`
     * den eneste rigtige — skrevet i grænsens egen enhed, som media query'en
     * er, så en grænse i em bliver ved med at følge læserens skriftstørrelse.
     *
     * @param  'desktop'|'mobile'  $direction
     */
    public static function tailwind(array $row, string $direction): string
    {
        $px = (float) $row['min_px'];
        $key = (int) $px;
        $named = isset(static::TAILWIND_SCALE[$key]) && (float) $key === $px
            ? static::TAILWIND_SCALE[$key]
            : null;

        if ($direction === 'mobile') {
            return $named ?? 'min-['.static::num((float) $row['min']).$row['unit'].']';
        }

        return $named ? 'max-'.$named : 'max-['.static::num((float) $row['min']).$row['unit'].']';
    }
}
