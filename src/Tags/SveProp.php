<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use Statamic\Fields\Value;
use Statamic\Support\Arr;
use Statamic\Tags\Tags;

/**
 * Output the entry field named by a template prop.
 *
 * `prop` is the author's name (`headline_field`). The chosen collection
 * field lives in `sve_props`. Rename the prop in the template — this tag
 * follows the name.
 */
class SveProp extends Tags
{
    protected static $handle = 'sve_prop';

    public function index()
    {
        $prop = $this->params->get('prop') ?? $this->params->get('handle');
        $fallback = $this->params->get('fallback');
        $chosen = $this->chosenField(is_string($prop) ? $prop : '', is_string($fallback) ? $fallback : '');
        $resolved = $this->contextValue($chosen);

        if (! $this->isBlank($resolved)) {
            return $resolved;
        }

        $empty = $this->params->get('empty');

        return is_string($empty) ? $empty : $resolved;
    }

    /**
     * The collection field handle — not the asset.
     *
     * Colon params (`:imagePath="image"`) look up a name in context.
     * Passing the Asset itself makes Antlers treat it as a key.
     */
    public function field()
    {
        $prop = $this->params->get('prop') ?? $this->params->get('handle');
        $fallback = $this->params->get('fallback');

        return $this->chosenField(is_string($prop) ? $prop : '', is_string($fallback) ? $fallback : '');
    }

    private function chosenField(string $prop, string $fallback): string
    {
        $map = $this->unwrap($this->contextValue('sve_props'));

        if (is_array($map) && $prop !== '' && is_string($map[$prop] ?? null) && $map[$prop] !== '') {
            return $map[$prop];
        }

        $flat = $this->unwrap($this->contextValue($prop));

        if (is_string($flat) && preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $flat)) {
            return $flat;
        }

        return $fallback;
    }

    private function contextValue(string $key): mixed
    {
        if ($key === '') {
            return null;
        }

        $context = $this->context->all();

        if (array_key_exists($key, $context)) {
            return $context[$key];
        }

        return Arr::get($context, $key);
    }

    private function unwrap(mixed $value): mixed
    {
        return $value instanceof Value ? $value->value() : $value;
    }

    private function isBlank(mixed $value): bool
    {
        $value = $this->unwrap($value);

        return $value === null || $value === '' || $value === [];
    }
}
