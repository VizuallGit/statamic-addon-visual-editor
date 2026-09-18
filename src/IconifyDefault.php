<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\IconifyDefault\Defaults;
use MarioHamann\StatamicVisualEditor\IconifyDefault\Svg;
use Statamic\Fields\Value;

/**
 * Extra setting on Iconify fields: a text box for an Iconify name.
 *
 * Same idea as {@see GridIcon} — `appendConfigFields` on the addon's own
 * class. We do not subclass it, do not re-register the `iconify` handle,
 * do not wrap its Vue component, and do not rebuild addon.js.
 *
 * The name is Statamic's own `default`, so new rows get it the same way a
 * text field's default works. `{{ iconify:icon }}` only draws SVG from
 * `{ body, attributes }`; a name string is fetched once and rendered that
 * way, so the Antlers partial does not change.
 *
 * This class keeps the registration, the render and the per-request walk
 * cache; SVG lookup lives in `IconifyDefault\Svg` and the default search
 * in `IconifyDefault\Defaults`. Split in WP7d, code moved verbatim.
 */
class IconifyDefault
{
    public const KEY = 'default';

    /** @var array<string, array<int, array{set: string, default: string}>> */
    private static array $defaultsWalk = [];

    public static function register(): void
    {
        if (! class_exists(\StatamicIconify\Fieldtypes\IconifyFieldtype::class)) {
            return;
        }

        \StatamicIconify\Fieldtypes\IconifyFieldtype::appendConfigFields([
            self::KEY => [
                'display' => __('sve::messages.iconify_default'),
                'instructions' => __('sve::messages.iconify_default_instructions'),
                'type' => 'text',
                'placeholder' => 'simple-line-icons:check',
            ],
        ]);
    }

    /**
     * After every addon has registered its tags, take the `iconify` handle
     * so a name is drawn as SVG. Iconify's own tag returns the name as text.
     */
    public static function registerTag(): void
    {
        if (! class_exists(\StatamicIconify\Tags\IconifyTag::class)) {
            return;
        }

        IconifyDefaultTag::register();
    }

    public static function storedValueIsEmpty(mixed $fieldValue): bool
    {
        return self::isEmpty(self::raw($fieldValue));
    }

    /**
     * @param  callable(array): mixed  $renderSvg
     */
    public static function render(mixed $fieldValue, callable $renderSvg, mixed $fallbackName = null): mixed
    {
        $raw = self::raw($fieldValue);

        if (self::isEmpty($raw)) {
            $raw = Defaults::fallback($fieldValue);
        }

        if (self::isEmpty($raw) && is_string($fallbackName) && $fallbackName !== '') {
            $raw = $fallbackName;
        }

        if (is_string($raw) && Svg::isName($raw)) {
            $data = Svg::svgData($raw);

            return $data ? $renderSvg($data) : null;
        }

        if (is_array($raw) && array_key_exists('body', $raw)) {
            return $renderSvg($raw);
        }

        return $raw;
    }

    private static function raw(mixed $fieldValue): mixed
    {
        if ($fieldValue instanceof Value) {
            return $fieldValue->raw();
        }

        return $fieldValue;
    }

    /**
     * Blueprint / field default when the stored value is empty. Live preview
     * may pass a raw null instead of a Value, so the Value fallback is not enough.
     */
    public static function fallbackName(mixed $context, string $fieldName): ?string
    {
        $fromValue = Defaults::fallback(Defaults::fromContext($context, $fieldName));

        if (is_string($fromValue) && $fromValue !== '') {
            return $fromValue;
        }

        $page = Defaults::fromContext($context, 'page');
        $blueprint = ($page && is_object($page) && method_exists($page, 'blueprint'))
            ? $page->blueprint()
            : null;

        if (! $blueprint) {
            return null;
        }

        $setType = (string) (Defaults::fromContext($context, 'type') ?? '');
        $walkKey = spl_object_id($blueprint).'|'.$fieldName;
        $matches = self::$defaultsWalk[$walkKey] ?? null;

        if ($matches === null) {
            $matches = [];
            Defaults::collectIconifyDefaults($blueprint->contents(), $fieldName, $matches);
            self::$defaultsWalk[$walkKey] = $matches;
        }

        if ($setType !== '') {
            foreach ($matches as $match) {
                if (($match['set'] ?? '') === $setType) {
                    return $match['default'];
                }
            }
        }

        return $matches[0]['default'] ?? null;
    }

    private static function isEmpty(mixed $raw): bool
    {
        return $raw === null || $raw === '' || $raw === [];
    }

    /**
     * @see Svg::svgData()
     */
    public static function svgData(string $name): ?array
    {
        return Svg::svgData($name);
    }

    /**
     * @see Svg::isName()
     */
    public static function isName(string $value): bool
    {
        return Svg::isName($value);
    }
}
