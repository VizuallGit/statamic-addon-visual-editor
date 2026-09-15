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
 * Every prop is written and read as `props_<handle>`, and that prefix is the
 * whole point of it. A partial is handed the entire scope it was called from,
 * so a prop named `headline` and a section field named `headline` were the
 * same name — and the section's value, being the one that was actually filled
 * in, won every time. The card showed the section's heading and there was
 * nothing on screen to say why. `props_headline` is a name no section field
 * has.
 *
 * The value is what the *call* passed, and nothing else. Reading it out of the
 * surrounding scope is what the prefix was added to stop; taking it from the
 * call means `{{ partial:components/card }}` inside a collection loop shows
 * the declared fallback, and shows the entry's title exactly when somebody
 * wrote `:props_headline="title"` on it.
 */
class SveDefaults extends Tags
{
    protected static $handle = 'sve_defaults';

    /**
     * Parameters are the declaration: `props_handle="fallback"`, one per prop.
     *
     * Every declared prop ends up in `props_*`, fallback or not — a prop that
     * is only sometimes there would make `{{ props_link }}` a thing you have
     * to test for before you use it.
     */
    public function index()
    {
        $passed = $this->passedParams();
        $props = [];
        $prefixed = [];

        foreach ($this->params->all() as $param => $fallback) {
            if (! is_string($param) || $param === '') {
                continue;
            }

            $handle = $this->shortHandle($param);

            if ($handle === '') {
                continue;
            }

            $given = $this->passedValue($passed, ComponentProps::param($handle));

            // A file written before the prefix is still a file, and so is a
            // call written before it: `{{ partial:components/card headline="Hi" }}`
            // keeps meaning what it meant. Only the call's own parameters are
            // read this way — the surrounding scope never is, which is the
            // collision the prefix exists to end.
            if ($this->isBlank($given)) {
                $given = $this->passedValue($passed, $handle);
            }

            $value = $this->isBlank($given) ? $fallback : $given;

            $props[$handle] = $value;
            $prefixed[ComponentProps::param($handle)] = $value;
        }

        // `props` carries the same values under the shape components used
        // before the prefix — `{{ props.headline }}`. It reads from the same
        // place, so a file that still says it is correct rather than merely
        // still rendering.
        return $this->parse(['props' => $props] + $prefixed);
    }

    /**
     * The short name, whether the parameter wears the prefix or not.
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

    /**
     * What the call actually passed.
     *
     * A partial's parameters are merged into the scope it was called from, and
     * once they are in there nothing tells the two apart — which is the whole
     * bug. `view` is the one place they are kept separately: Statamic's Antlers
     * engine hands every view its own parameters and front matter under that
     * name, so `{{ view:headline }}` is the call's value and `{{ headline }}`
     * is whatever the page happens to have. Reading it here is what makes a
     * prop the call's, and never the section's.
     *
     * Not `__frontmatter`: the engine pulls that key back out of the data
     * before the template is parsed, so by the time a tag runs it is gone.
     */
    private function passedParams(): array
    {
        $passed = $this->unwrap($this->contextValue('view'));

        return is_array($passed) ? $passed : [];
    }

    private function passedValue(array $passed, string $key): mixed
    {
        return array_key_exists($key, $passed) ? $passed[$key] : null;
    }

    private function contextValue(string $key): mixed
    {
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
