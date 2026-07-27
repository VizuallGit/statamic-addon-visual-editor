<?php

namespace MarioHamann\StatamicVisualEditor\Modifiers;

use Statamic\Facades\Fieldset;
use Statamic\Fields\Value;
use Statamic\Modifiers\Modifier;
use Statamic\Support\Str;

/**
 * True when $value still equals the field's configured default.
 *
 * Usage: {{ if headline | is_default('blocks.headline') }}
 * Optional 2nd param = field handle (defaults to the fieldset's last segment).
 */
class IsDefault extends Modifier
{
    protected static $handle = 'is_default';

    public function index($value, $params, $context): bool
    {
        $fieldsetHandle = $params[0] ?? null;

        if (! $fieldsetHandle) {
            return false;
        }

        $fieldset = Fieldset::find($fieldsetHandle);

        if (! $fieldset) {
            return false;
        }

        $fields = $fieldset->fields()->all();
        $fieldHandle = $params[1] ?? Str::afterLast($fieldsetHandle, '.');
        $field = $fields->get($fieldHandle) ?? ($fields->count() === 1 ? $fields->first() : null);

        if (! $field) {
            return false;
        }

        $type = $field->type();

        return $this->normalize($value, $type) === $this->normalize($field->defaultValue(), $type);
    }

    private function normalize(mixed $value, string $type): string
    {
        if ($value instanceof Value) {
            $value = $value->raw();
        }

        if (is_array($value)) {
            return $this->plainTextFromArray($value);
        }

        if (! is_string($value) && ! is_numeric($value)) {
            return '';
        }

        $text = (string) $value;

        // Bard (and similar) may arrive as already-rendered HTML in templates.
        if (in_array($type, ['bard', 'markdown', 'textarea'], true) || str_contains($text, '<')) {
            $text = html_entity_decode(strip_tags($text), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }

        return trim(preg_replace('/\s+/u', ' ', $text) ?? '');
    }

    private function plainTextFromArray(array $nodes): string
    {
        $parts = [];

        $walk = function ($node) use (&$walk, &$parts): void {
            if (! is_array($node)) {
                return;
            }

            if (($node['type'] ?? null) === 'text' && isset($node['text'])) {
                $parts[] = (string) $node['text'];
            }

            foreach ($node['content'] ?? [] as $child) {
                $walk($child);
            }

            // Top-level list of nodes (Bard value).
            if (array_is_list($node) && ! isset($node['type'])) {
                foreach ($node as $child) {
                    $walk($child);
                }
            }
        };

        $walk($nodes);

        return trim(preg_replace('/\s+/u', ' ', implode(' ', $parts)) ?? '');
    }
}
