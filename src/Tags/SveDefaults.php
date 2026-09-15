<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use Statamic\Fields\Value;
use Statamic\Support\Arr;
use Statamic\Tags\Tags;

/**
 * The scope a component's props live in.
 *
 * A component is a partial, and Antlers hands a partial's parameters to it as
 * plain variables. That part works. What did not work was the fallbacks: they
 * used to be written as assignments above the markup —
 *
 *     {{ headline = headline ?? "Overskrift" }}
 *
 * — and an Antlers assignment does not stay inside the partial it is written
 * in. It lands in the page's scope and stays there for the rest of the render,
 * so every later section reading a bare `{{ headline }}` with nothing of its
 * own got the last card's headline instead. A component was quietly writing
 * into the page around it.
 *
 * A tag pair does not do that. Its data covers its own contents and the outer
 * scope comes back untouched afterwards — including when pairs nest, which is
 * the case that a shared `props` variable could never have survived: a card
 * that renders an image component would have had its own props overwritten by
 * the inner one halfway down its markup.
 *
 * Inside the pair every declared prop is reachable two ways: `{{ props.headline }}`,
 * which can never collide with a section field of the same name, and a bare
 * `{{ headline }}`, which is what components written before this still say.
 * Both carry the same value — whatever the call passed, or the declared
 * fallback when the call passed nothing.
 */
class SveDefaults extends Tags
{
    protected static $handle = 'sve_defaults';

    /**
     * Parameters are the declaration: `handle="fallback"`, one per prop.
     *
     * Every declared prop ends up in `props`, fallback or not — a prop that is
     * only sometimes there would make `{{ props.link }}` a thing you have to
     * test for before you use it.
     */
    public function index()
    {
        $props = [];

        foreach ($this->params->all() as $handle => $fallback) {
            if (! is_string($handle) || $handle === '') {
                continue;
            }

            $given = $this->contextValue($handle);

            $props[$handle] = $this->isBlank($given) ? $fallback : $given;
        }

        return $this->parse(['props' => $props] + $props);
    }

    private function contextValue(string $key): mixed
    {
        $context = $this->context->all();

        if (array_key_exists($key, $context)) {
            return $context[$key];
        }

        return Arr::get($context, $key);
    }

    private function isBlank(mixed $value): bool
    {
        $value = $value instanceof Value ? $value->value() : $value;

        return $value === null || $value === '' || $value === [];
    }
}
