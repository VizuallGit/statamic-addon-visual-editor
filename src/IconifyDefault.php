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
            $raw = self::fallback($fieldValue);
        }

        if (self::isEmpty($raw) && is_string($fallbackName) && $fallbackName !== '') {
            $raw = $fallbackName;
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

    /**
     * Blueprint / field default when the stored value is empty. Live preview
     * may pass a raw null instead of a Value, so the Value fallback is not enough.
     */
    public static function fallbackName(mixed $context, string $fieldName): ?string
    {
        $fromValue = self::fallback(self::fromContext($context, $fieldName));

        if (is_string($fromValue) && $fromValue !== '') {
            return $fromValue;
        }

        $page = self::fromContext($context, 'page');
        $blueprint = ($page && is_object($page) && method_exists($page, 'blueprint'))
            ? $page->blueprint()
            : null;

        if (! $blueprint) {
            return null;
        }

        $setType = (string) (self::fromContext($context, 'type') ?? '');
        $walkKey = spl_object_id($blueprint).'|'.$fieldName;
        $matches = self::$defaultsWalk[$walkKey] ?? null;

        if ($matches === null) {
            $matches = [];
            self::collectIconifyDefaults($blueprint->contents(), $fieldName, $matches);
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

    private static function fromContext(mixed $context, string $key): mixed
    {
        if (is_array($context)) {
            return $context[$key] ?? null;
        }

        if (is_object($context) && method_exists($context, 'get')) {
            return $context->get($key);
        }

        return null;
    }

    /**
     * @param  array<int, array{set: string, default: string}>  $matches
     */
    private static function collectIconifyDefaults(mixed $node, string $handle, array &$matches, string $enclosingSet = '', int $depth = 0): void
    {
        if ($depth > 14 || ! is_array($node)) {
            return;
        }

        foreach (['tabs', 'sections'] as $group) {
            foreach (($node[$group] ?? []) as $child) {
                self::collectIconifyDefaults($child, $handle, $matches, $enclosingSet, $depth + 1);
            }
        }

        foreach (($node['sets'] ?? []) as $setHandle => $set) {
            if (! is_array($set)) {
                continue;
            }

            $nextSet = is_string($setHandle) && ! is_numeric($setHandle)
                ? $setHandle
                : (string) ($set['handle'] ?? $enclosingSet);

            self::collectIconifyDefaults($set, $handle, $matches, $nextSet, $depth + 1);
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            if (isset($item['import'])) {
                $fieldset = \Statamic\Facades\Fieldset::find($item['import']);

                if ($fieldset) {
                    self::collectIconifyDefaults($fieldset->contents(), $handle, $matches, $enclosingSet, $depth + 1);
                }

                continue;
            }

            $field = $item['field'] ?? null;

            if (is_string($field)) {
                $fieldset = \Statamic\Facades\Fieldset::find($field)
                    ?: \Statamic\Facades\Fieldset::find(strstr($field, '.', true) ?: '');

                if ($fieldset) {
                    self::collectIconifyDefaults($fieldset->contents(), $handle, $matches, $enclosingSet, $depth + 1);
                }

                continue;
            }

            if (! is_array($field)) {
                continue;
            }

            if (
                strcasecmp((string) ($item['handle'] ?? ''), $handle) === 0
                && ($field['type'] ?? null) === 'iconify'
            ) {
                $default = $field['default'] ?? null;

                if (is_string($default) && $default !== '') {
                    $matches[] = [
                        'set' => $enclosingSet,
                        'default' => $default,
                    ];
                }
            }

            self::collectIconifyDefaults($field, $handle, $matches, $enclosingSet, $depth + 1);
        }
    }
}
