<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use MarioHamann\StatamicVisualEditor\ComponentProps;
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
 * Every prop is written and read as `props_<handle>`, and the prefix is the
 * whole mechanism. A partial is handed the entire scope it was called from, so
 * a prop named `headline` and a section field named `headline` were one name
 * with two meanings — and the section's value, being the one that was actually
 * filled in, won every time. `props_headline` is a name no section field has,
 * so there is nothing left to collide with and nothing to detect: the ordinary
 * scope lookup is already the right answer.
 *
 * Which is why there is no second way in. Telling "what this call passed" apart
 * from "what the page happens to have" looked like the fix and is not one:
 * `__frontmatter` is pulled back out of the data before a template is parsed,
 * and `view` is inherited whole by any partial called without parameters — so
 * a card inside a section called with `headline="ttt"` read the section's value
 * out of `view` and showed it, which is the same bug wearing a different name.
 */
class SveDefaults extends Tags
{
    protected static $handle = 'sve_defaults';

    /**
     * Parameters are the declaration: `props_handle="fallback"`, one per prop.
     *
     * Every declared prop ends up in scope, fallback or not — a prop that is
     * only sometimes there would make `{{ props_link }}` a thing you have to
     * test for before you use it.
     */
    public function index()
    {
        $props = [];

        foreach ($this->params->all() as $param => $fallback) {
            if (! is_string($param) || $param === '') {
                continue;
            }

            $name = ComponentProps::param($this->shortHandle($param));
            $given = $this->contextValue($name);

            $props[$name] = $this->isBlank($given) ? $fallback : $given;
        }

        return $this->parse($props);
    }

    /**
     * The short name, whether the parameter wears the prefix or not.
     *
     * A component file written before the prefix declares `headline="…"`, and
     * reads the same either way — the pair is rewritten the first time the
     * component is saved.
     *
     * Not `handle()`: `Tags::handle()` is static, and a tag that shadows it
     * with an instance method is a fatal at class load — every page in the
     * Control Panel, not just this one.
     */
    private function shortHandle(string $param): string
    {
        return str_starts_with($param, ComponentProps::PREFIX)
            ? substr($param, strlen(ComponentProps::PREFIX))
            : $param;
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
