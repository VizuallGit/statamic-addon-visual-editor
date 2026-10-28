<script setup>
/**
 * One value a designer sets: a token (`500`), a value (`10px`, `4rem`,
 * `calc(…)`) or a custom property (`--gutter`, `var(--gutter)`).
 *
 * `tool` is a CSS_TOOLS tool or child (`css` the property it sets, `tw` the
 * property Tailwind's classic scale is built on). What it reads is the
 * picked tag's class for that property at the size and state picked, through
 * the site's own Tailwind catalog (`port.propertyOf`).
 *
 * A click opens the Tailwind pane's menu under the field
 * (`port.openValueMenu`, tw-classes.js): the site's scale, its search, and the
 * row under the pointer or the arrows shown on the canvas before it is
 * picked — the background field's menu, for every value. Text typed into the
 * search that is not a row is written as the value it reads as (`typedClass`),
 * unless `typed` is off: a list of named values (position, font-weight) takes
 * its rows only.
 *
 * Light text is a value that comes from a wider size, the plain state, or a
 * broader property (all four sides, the axis): a pick writes the field's own
 * class. A physical class the file already had for this side (`pt-800` under
 * padding-block-start) is the field's own, and a pick takes its place.
 */
import { computed, inject, ref } from 'vue';
import { effectiveClass, fromClass, kindOf, rootFor, rootOf, typedClass, variantChain } from '../../build-mode/classes.js';

const props = defineProps({
  tool: { type: Object, required: true },
  /** Broader properties that show through when this one is not set, nearest first. */
  fallbacks: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  /** In a narrow field: the custom property without `var()`. */
  compact: { type: Boolean, default: false },
  /** A token from the site's scale reads as a chip (`primary`, `500`). */
  chip: { type: Boolean, default: false },
  /** What an empty field says. */
  empty: { type: String, default: '—' },
  /** Text typed into the menu's search is written as a value; off for a list of named values. */
  typed: { type: Boolean, default: true },
});

defineOptions({ inheritAttrs: false });

const port = inject('sveBuild');

const property = computed(() => props.tool.css || props.tool.tw || '');
/** The physical twin Tailwind's classic scale uses (`padding-top` for `padding-block-start`). */
const twin = computed(() => (props.tool.tw && props.tool.tw !== property.value ? props.tool.tw : ''));

/** The property the scale is offered for: the field's own, or its twin's when only the twin has one. */
const scaleProperty = computed(() => {
  port.rev.value;

  return port.scale(property.value).length || !twin.value ? property.value : twin.value;
});
const scale = computed(() => (port.rev.value, port.scale(scaleProperty.value)));
const prefix = computed(() => rootOf(scale.value));

const current = computed(() => {
  port.rev.value;

  const chain = variantChain(port.sizes(), port.size(), port.state());
  const properties = [property.value, twin.value, ...props.fallbacks].filter(Boolean);

  return effectiveClass(port.pickedClasses().join(' '), properties, chain, port.propertyOf);
});
const own = computed(() => (current.value && !current.value.inherited ? current.value : null));
const shown = computed(() => (current.value ? fromClass(current.value.name, rootFor(current.value.name, scale.value)) : ''));

/** A name from the site's scale, not a typed value or a custom property. */
const isToken = computed(() => !!current.value && !/[[(]/.test(current.value.name));

const display = (value) => (props.compact ? value.replace(/^var\((--[\w-]+)\)$/, '$1') : value);
const text = computed(() => (current.value ? display(shown.value) : props.empty));

const trigger = ref(null);

/** The field's menu, under the field — or under `anchor` (a colour field's swatch). */
function open(anchor) {
  const at = anchor || trigger.value?.closest('.fg-field') || trigger.value;

  if (!at) {
    return;
  }

  const root = prefix.value || (own.value ? rootFor(own.value.name) : '');

  port.openValueMenu(at, {
    property: scaleProperty.value,
    title: property.value,
    own: own.value ? { raw: own.value.raw, name: own.value.name } : null,
    free: props.typed ? (value) => typedClass(value, scale.value, root, kindOf(property.value)) || '' : null,
  });
}

defineExpose({ open });
</script>

<template>
  <span
    v-if="chip && isToken"
    class="fg-chip"
    :class="{ inh: current.inherited }"
    @click.prevent="open()"
  >{{ display(shown) }}</span>
  <button
    v-bind="$attrs"
    ref="trigger"
    type="button"
    class="bm-vin"
    :class="{ inh: current && current.inherited, 'is-empty': !current, 'has-chip': chip && isToken }"
    :title="label || property"
    :aria-label="label || property"
    aria-haspopup="listbox"
    :data-sve-build-value="label || property"
    @click="open()"
    @keydown.down.prevent="open()"
  >{{ text }}</button>
</template>
