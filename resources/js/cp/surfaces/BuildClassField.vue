<script setup>
/**
 * A field that is one utility or a list named by hand, where the CSS property
 * alone says too little: `blur` and `contrast` both print `filter`, and
 * `outline-2` sets a style as well as a width. Which classes are its own is
 * `fieldHas` (catalog.js); everything else is BuildValueInput's: the Tailwind
 * pane's menu with its search and canvas preview, light text for a value from
 * a wider size, and a typed value where the utility takes one.
 *
 * `field.image` writes what is typed as `bg-[url(…)]`.
 */
import { computed, inject, ref } from 'vue';
import { fieldHas } from '../../build-mode/catalog.js';
import { effectiveClass, fromClass, kindOf, rootFor, typedClass, variantChain } from '../../build-mode/classes.js';

const props = defineProps({
  field: { type: Object, required: true },
});

const port = inject('sveBuild');
const trigger = ref(null);

const names = computed(() => {
  port.rev.value;

  return props.field.names || (props.field.roots?.length ? port.utilityNames(props.field.roots, props.field.only) : []);
});

const current = computed(() => {
  port.rev.value;

  const chain = variantChain(port.sizes(), port.size(), port.state());

  return effectiveClass(port.pickedClasses().join(' '), ['field'], chain, (name) => (fieldHas(props.field, name, port.utilityRoot) ? 'field' : ''));
});
const root = computed(() => props.field.roots?.[0] || rootFor(names.value[0] || ''));

function imageOf(name) {
  return /^bg-\[url\((.*)\)\]$/.exec(name)?.[1] || name;
}

const text = computed(() => {
  if (!current.value) {
    return '—';
  }

  return props.field.image ? imageOf(current.value.name) : fromClass(current.value.name, rootFor(current.value.name, names.value)) || current.value.name;
});

const dot = computed(() => (props.field.swatch && current.value ? port.colorOf(current.value.name) : ''));

function free(typed) {
  if (props.field.image) {
    const address = String(typed || '').trim().replace(/\s/g, '%20').replace(/^url\((.*)\)$/, '$1').replace(/^['"]|['"]$/g, '');

    return address ? `bg-[url(${address})]` : '';
  }

  return typedClass(typed, names.value, root.value, props.field.swatch ? kindOf('color') : 'space') || '';
}

function open() {
  const own = current.value && !current.value.inherited ? current.value : null;

  port.openValueMenu(trigger.value.closest('.fg-field') || trigger.value, {
    names: names.value,
    title: props.field.label,
    own: own ? { raw: own.raw, name: own.name } : null,
    free: root.value || props.field.image ? free : null,
  });
}
</script>

<template>
  <label class="fg-field">
    <span v-if="field.swatch" class="fg-swatch" :class="{ 'is-empty': !dot }" :style="dot ? { background: dot } : null"></span>
    <button
      ref="trigger"
      type="button"
      class="bm-vin"
      :class="{ inh: current?.inherited, 'is-empty': !current }"
      :title="field.label"
      :aria-label="field.label"
      aria-haspopup="listbox"
      :data-sve-build-value="field.label"
      @click="open"
      @keydown.down.prevent="open"
    >{{ text }}</button>
  </label>
</template>
