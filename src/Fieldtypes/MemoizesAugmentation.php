<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use Statamic\Facades\Blink;
use WeakMap;

/**
 * Augment a value once per request, not once per read.
 *
 * Statamic's `Value::value()` has no memory: every `{{ field }}` in every
 * partial augments the raw value again from scratch. A responsive field read
 * in twelve CSS partials is built twelve times, all three breakpoints each
 * time, and a `{{ blocks }}` loop written three times in a section augments
 * its rows three times. Measured on the site's test page: 2,288 augmentations
 * in one render, 310 ms of the 750 the page took — 702 of them our responsive
 * field, 252 the replicator.
 *
 * So the fieldtypes that use this trait remember their answer for the rest of
 * the request, keyed on what the answer depends on: the fieldtype, the field's
 * handle and config, the entry it sits on, the raw value, and whether the
 * augmentation was shallow. Same inputs, same object back. Blink is the store,
 * so nothing survives the request — Live Preview renders each preview in its
 * own request and always sees fresh values.
 *
 * The config hash is taken once per Field object (a WeakMap, so it never
 * outlives the field): a replicator's config is the whole set tree, and
 * hashing it on every read would cost what the memo saves.
 */
trait MemoizesAugmentation
{
    /** @var WeakMap<object, string>|null */
    private static ?WeakMap $configHashes = null;

    /**
     * @param  callable(): mixed  $compute  the real augmentation, run at most once per key
     */
    protected function memoizedAugmentation(mixed $value, bool $shallow, callable $compute): mixed
    {
        $key = $this->augmentationKey($value, $shallow);

        if ($key === null) {
            return $compute();
        }

        $store = Blink::store('sve-augment');

        if ($store->has($key)) {
            return $store->get($key);
        }

        $out = $compute();
        $store->put($key, $out);

        return $out;
    }

    /** Null when the value cannot be hashed — then it is simply not remembered. */
    private function augmentationKey(mixed $value, bool $shallow): ?string
    {
        $raw = json_encode($value);

        if ($raw === false) {
            return null;
        }

        $field = $this->field();
        $parent = $field?->parent();
        $parentId = is_object($parent) && method_exists($parent, 'id') ? (string) $parent->id() : '';

        return md5(static::class.'|'.($field?->handle() ?? '').'|'.$this->configHash().'|'.$parentId.'|'.($shallow ? 's' : 'd').'|'.$raw);
    }

    private function configHash(): string
    {
        $field = $this->field();

        if (! $field) {
            return md5(json_encode($this->config()) ?: '');
        }

        self::$configHashes ??= new WeakMap;

        return self::$configHashes[$field] ??= md5(json_encode($field->config()) ?: '');
    }
}
