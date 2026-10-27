<script setup>
/**
 * One value a designer can type: a token (`500`), a value (`10px`, `4rem`,
 * `calc(…)`) or a custom property (`--gutter`, `var(--gutter)`).
 *
 * `tool` is a CSS_TOOLS tool or child (`css` the property it sets, `tw` the
 * property Tailwind's own scale is built on). What it reads is the picked
 * tag's class for that property at the size picked, through the site's own
 * Tailwind catalog (`port.propertyOf`); what it writes goes through the
 * dock's class functions (`port.addClass`, `port.setClass`,
 * `port.replaceClasses`). The small arrow opens the dock's own menu of the
 * site's values for the property — the one the Tailwind pane opens.
 *
 * Shown light when the value comes from a wider size or a broader property
 * (all four sides, the axis): typing over it writes the field's own class.
 */
import { computed, inject, ref, watch } from 'vue';
import { effectiveClass, fromClass, kindOf, rootFor, rootOf, toClass, variantChain } from '../../build-mode/classes.js';
import { BUILD_ICONS } from '../../build-mode/icons.js';

const props = defineProps({
  tool: { type: Object, required: true },
  /** Broader properties that show through when this one is not set, nearest first. */
  fallbacks: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  compact: { type: Boolean, default: false },
  menu: { type: Boolean, default: true },
});
const emit = defineEmits(['own']);

const port = inject('sveBuild');
const menuBtn = ref(null);

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

  const chain = variantChain(port.sizes(), port.size());
  const properties = [property.value, twin.value, ...props.fallbacks].filter(Boolean);

  return effectiveClass(port.pickedClasses().join(' '), properties, chain, port.propertyOf);
});
const own = computed(() => (current.value && !current.value.inherited ? current.value : null));
const shown = computed(() => (current.value ? fromClass(current.value.name, rootFor(current.value.name, scale.value)) : ''));

watch(own, (value) => emit('own', !!value), { immediate: true });

/** In the narrow box a custom property reads as itself; `var()` would not fit. */
const display = (value) => (props.compact ? value.replace(/^var\((--[\w-]+)\)$/, '$1') : value);

const text = ref('');
/**
 * Only what a person typed is written, and only onto the element it was
 * typed for. Without this a field that still had focus when the pick moved
 * wrote its old text onto the new element as it blurred.
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

const listId = computed(() => `sve-build-dl-${property.value}`);
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

function openMenu() {
  port.openMenu(property.value, menuBtn.value);
}
</script>

<template>
  <span class="sve-build-vin" :class="{ 'is-compact': compact, 'is-own': !!own }">
    <input
      v-model="text"
      type="text"
      autocomplete="off"
      spellcheck="false"
      :list="listId"
      :placeholder="current && current.inherited ? display(shown) : '—'"
      :title="label || property"
      :aria-label="label || property"
      :class="{ 'is-inherited': current && current.inherited }"
      @input="onInput"
      @keydown.enter.prevent="commit"
      @blur="commit"
    />
    <button
      v-if="menu && !compact"
      ref="menuBtn"
      type="button"
      class="sve-build-vin__menu"
      :title="port.t('value_menu')"
      :aria-label="port.t('value_menu')"
      @click="openMenu"
      v-html="BUILD_ICONS.menu"
    ></button>
    <datalist :id="listId">
      <option v-for="item in suggestions" :key="item" :value="item"></option>
    </datalist>
  </span>
</template>

<style scoped>
.sve-build-vin {
  display: flex;
  align-items: center;
  gap: 0.2em;
  min-width: 0;
}
input {
  box-sizing: border-box;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  height: 1.875rem;
  padding: 0 0.5em;
  border-radius: 0.35rem;
  border: 1px solid rgba(128, 128, 128, 0.35);
  background: rgba(128, 128, 128, 0.1);
  color: inherit;
  font: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.6875rem;
}
input:focus {
  outline: 2px solid var(--sve-build-accent);
  outline-offset: -1px;
}
input::placeholder {
  color: inherit;
  opacity: 0.4;
}
input.is-inherited::placeholder {
  color: var(--sve-build-accent-text);
  font-style: italic;
  opacity: 0.85;
}
.is-compact input {
  width: 4.75rem;
  height: 1.5rem;
  padding: 0 0.3em;
  text-align: center;
  background: transparent;
  border-color: transparent;
}
.is-compact input:hover,
.is-compact input:focus {
  background: rgba(128, 128, 128, 0.18);
  border-color: var(--sve-build-accent);
}
.is-compact.is-own input {
  color: var(--sve-build-accent-text);
}
.sve-build-vin__menu {
  all: unset;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.875rem;
  border-radius: 0.3rem;
  cursor: pointer;
  opacity: 0.55;
}
.sve-build-vin__menu:hover {
  opacity: 1;
  background: rgba(128, 128, 128, 0.22);
}
</style>
