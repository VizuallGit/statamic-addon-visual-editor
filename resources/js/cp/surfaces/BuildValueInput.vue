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
  /** In a narrow field: the custom property without `var()`. */
  compact: { type: Boolean, default: false },
  /** A token from the site's scale reads as a chip (`primary`, `500`) until the field is focused. */
  chip: { type: Boolean, default: false },
  /** What an empty field says. */
  empty: { type: String, default: '—' },
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

const focused = ref(false);
const input = ref(null);
/** A name from the site's scale, not a typed value or a custom property. */
const isToken = computed(() => !!current.value && !/[[(]/.test(current.value.name));

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

function onInput(event) {
  typedFor = port.selectedPath();

  // A row picked from the list (not typed): written at once, as a pick is.
  if (event?.inputType === 'insertReplacementText') {
    commit();
  }
}

/** Backspace or Delete in the emptied field: the value is to go — Enter or leaving writes that. */
function onDelete() {
  if (!text.value && held.value) {
    typedFor = port.selectedPath();
    held.value = '';
  }
}

/*
 * The browser filters the list by what the field holds, so a field showing
 * `heading` offered only `heading`. Focused, the field is empty and its value
 * stands as the placeholder: the whole list shows. Left without a change, the
 * value comes back.
 */
const held = ref('');

function onFocus() {
  focused.value = true;
  held.value = text.value;
  text.value = '';
}

function onBlur() {
  focused.value = false;
  commit();

  if (typedFor === null && !text.value) {
    text.value = own.value ? display(shown.value) : '';
  }

  held.value = '';
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
  <span
    v-if="chip && isToken && !focused"
    class="fg-chip"
    :class="{ inh: current.inherited }"
    @mousedown.prevent="input?.focus()"
  >{{ display(shown) }}</span>
  <input
    v-bind="$attrs"
    ref="input"
    v-model="text"
    class="bm-vin"
    :class="{ inh: current && current.inherited, 'has-chip': chip && isToken && !focused }"
    type="text"
    autocomplete="off"
    spellcheck="false"
    :list="listId"
    :placeholder="held || (current && current.inherited ? display(shown) : empty)"
    :title="label || property"
    :aria-label="label || property"
    :data-sve-build-value="label || property"
    @input="onInput"
    @focus="onFocus"
    @keydown.enter.prevent="commit"
    @keydown.delete="onDelete"
    @blur="onBlur"
  />
  <datalist :id="listId">
    <option v-for="item in suggestions" :key="item" :value="item"></option>
  </datalist>
</template>
