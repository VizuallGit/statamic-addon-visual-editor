<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
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
 */
class IconifyDefault
{
    public const KEY = 'default';

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

    /**
     * @param  callable(array): mixed  $renderSvg
     */
    public static function render(mixed $fieldValue, callable $renderSvg): mixed
    {
        $raw = self::raw($fieldValue);

        if (self::isEmpty($raw)) {
            $raw = self::fallback($fieldValue);
        }

        if (is_string($raw) && self::isName($raw)) {
            $data = self::svgData($raw);

            return $data ? $renderSvg($data) : null;
        }

        if (is_array($raw) && array_key_exists('body', $raw)) {
            return $renderSvg($raw);
        }

        return $raw;
    }

    /**
     * @return array{name: string, body: string, attributes: array<string, string>}|null
     */
    public static function svgData(string $name): ?array
    {
        $name = trim($name);

        if (! self::isName($name)) {
            return null;
        }

        $cacheKey = 'sve.iconify.svg.'.$name;

        if (Cache::has($cacheKey)) {
            $cached = Cache::get($cacheKey);

            return is_array($cached) ? $cached : null;
        }

        [$prefix, $icon] = explode(':', $name, 2);

        try {
            $response = Http::timeout(10)->get('https://api.iconify.design/'.$prefix.'.json', [
                'icons' => $icon,
            ]);
        } catch (\Throwable) {
            return null;
        }

        if (! $response->successful()) {
            return null;
        }

        $json = $response->json();
        $data = is_array($json) ? ($json['icons'][$icon] ?? null) : null;

        if (! is_array($data) || empty($data['body'])) {
            return null;
        }

        $width = $data['width'] ?? $json['width'] ?? 16;
        $height = $data['height'] ?? $json['height'] ?? 16;
        $left = $data['left'] ?? 0;
        $top = $data['top'] ?? 0;

        $result = [
            'name' => $name,
            'body' => $data['body'],
            'attributes' => [
                'width' => '1em',
                'height' => '1em',
                'viewBox' => $left.' '.$top.' '.$width.' '.$height,
            ],
        ];

        Cache::put($cacheKey, $result, 86400);

        return $result;
    }

    public static function isName(string $value): bool
    {
        return (bool) preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*$/i', trim($value));
    }

    private static function raw(mixed $fieldValue): mixed
    {
        if ($fieldValue instanceof Value) {
            return $fieldValue->raw();
        }

        return $fieldValue;
    }

    private static function fallback(mixed $fieldValue): mixed
    {
        if (! $fieldValue instanceof Value || ! $fieldValue->fieldtype()) {
            return null;
        }

        $default = $fieldValue->field()?->defaultValue();

        return is_string($default) && $default !== '' ? $default : null;
    }

    private static function isEmpty(mixed $raw): bool
    {
        return $raw === null || $raw === '' || $raw === [];
    }
}
