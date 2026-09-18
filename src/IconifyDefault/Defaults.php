<?php

namespace MarioHamann\StatamicVisualEditor\IconifyDefault;

use Statamic\Fields\Value;

/**
 * Where a field's default icon comes from when the stored value is empty:
 * the fieldset's own default, walked out of the context.
 * Moved verbatim out of IconifyDefault in WP7d.
 */
final class Defaults
{
    public static function fallback(mixed $fieldValue): mixed
    {
        if (! $fieldValue instanceof Value || ! $fieldValue->fieldtype()) {
            return null;
        }

        $default = $fieldValue->field()?->defaultValue();

        return is_string($default) && $default !== '' ? $default : null;
    }

    public static function fromContext(mixed $context, string $key): mixed
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
    public static function collectIconifyDefaults(mixed $node, string $handle, array &$matches, string $enclosingSet = '', int $depth = 0): void
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
