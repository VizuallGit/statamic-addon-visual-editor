<script setup>
/**
 * One value a designer can type: a token (`500`), a value (`10px`, `4rem`,
 * `calc(…)`) or a custom property (`--gutter`, `var(--gutter)`).
 *
 * `tool` is a CSS_TOOLS tool or child (`css` the property it sets, `tw` the
 * property Tailwind's classic scale is built on). What it reads is the
 * picked tag's class for that property at the size and state picked, through
 * the site's own Tailwind catalog (`port.propertyOf`); what it writes goes
 * through the Tailwind pane's class functions (`port.addClass`,
 * `port.setClass`, `port.replaceClasses`). The site's scale is offered as
 * suggestions while typing.
 *
 * Light text is a value that comes from a wider size, the plain state, or a
 * broader property (all four sides, the axis): typing over it writes the
 * field's own class.
 */
import { computed, inject, ref, watch } from 'vue';
import { effectiveClass, fromClass, kindOf, rootFor, rootOf, toClass, variantChain } from '../../build-mode/classes.js';

const props = defineProps({
  tool: { type: Object, required: true },
  /** Broader properties that show through when this one is not set, nearest first. */
  fallbacks: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  /** In the margin/padding box: no frame, the custom property without `var()`. */
  compact: { type: Boolean, default: false },
});

defineOptions({ inheritAttrs: false });

const port = inject('sveBuild');

const property = computed(() => props.tool.css || props.tool.tw || '');
/** The physical twin Tailwind's classic scale uses (`padding-top` for `padding-block-start`). */
const twin = computed(() => (props.tool.tw && props.tool.tw !== property.value ? props.tool.tw : ''));

const scale = computed(() => {
  port.rev.value;

  const own = port.scale(property.value);

  return own.length ? own : twin.value ? port.scale(twin.value) : [];
});
const prefix = computed(() => rootOf(scale.value));

const current = computed(() => {
  port.rev.value;

  const chain = variantChain(port.sizes(), port.size(), port.state());
  const properties = [property.value, twin.value, ...props.fallbacks].filter(Boolean);

  return effectiveClass(port.pickedClasses().join(' '), properties, chain, port.propertyOf);
});
const own = computed(() => (current.value && !current.value.inherited ? current.value : null));
const shown = computed(() => (current.value ? fromClass(current.value.name, rootFor(current.value.name, scale.value)) : ''));

const display = (value) => (props.compact ? value.replace(/^var\((--[\w-]+)\)$/, '$1') : value);

const text = ref('');
/**
 * Only what a person typed is written, and only onto the element it was
 * typed for: a field that still had focus when the pick moved used to write
 * its old text onto the new element as it blurred.
 */
let typedFor = null;

watch(
  [own, shown],
  () => {
    text.value = own.value ? display(shown.value) : '';
    typedFor = null;
  },
  { immediate: true }
);

function onInput() {
  typedFor = port.selectedPath();
}

const listId = computed(() => `bm-dl-${property.value}`);
const suggestions = computed(() => scale.value.slice(0, 40).map((name) => fromClass(name, prefix.value)));

function commit() {
  const typed = text.value.trim();
  const mine = typedFor !== null && typedFor === port.selectedPath();

  typedFor = null;

  if (!mine || typed === (own.value ? display(shown.value) : '')) {
    return;
  }

  if (!typed) {
    if (own.value) {
      port.setClass(own.value.name);
    }

    return;
  }

  const name = toClass(prefix.value || (own.value ? rootFor(own.value.name) : ''), typed, kindOf(property.value));

  if (!name) {
    return;
  }

  // A physical class the file already had for this side is replaced by the
  // logical one in its slot, not left beside it.
  if (own.value && own.value.property !== property.value) {
    port.replaceClasses([own.value.raw], name);
  } else {
    port.addClass(name);
  }
}
</script>

<template>
  <input
    v-bind="$attrs"
    v-model="text"
    class="bm-vin"
    :class="{ inh: current && current.inherited }"
    type="text"
    autocomplete="off"
    spellcheck="false"
    :list="listId"
    :placeholder="current && current.inherited ? display(shown) : '—'"
    :title="label || property"
    :aria-label="label || property"
    :data-sve-build-value="label || property"
    @input="onInput"
    @keydown.enter.prevent="commit"
    @blur="commit"
  />
  <datalist :id="listId">
    <option v-for="item in suggestions" :key="item" :value="item"></option>
  </datalist>
</template>
