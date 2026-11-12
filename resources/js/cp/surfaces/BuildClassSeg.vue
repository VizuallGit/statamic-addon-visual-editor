<script setup>
/**
 * A choice among a few fixed classes, as buttons: an underline, italic, upper
 * case. Pressed, one takes the place of the other; pressed again it comes off,
 * as a second click on the Tailwind pane's row takes a class off. An option
 * shows a glyph (`ic`) or, with a leading `#`, the words themselves (`#AB`).
 * Its label is drawn here, for the dot beside it (BuildFieldReset.vue).
 */
import { computed, inject } from 'vue';
import { fieldHas } from '../../build-mode/catalog.js';
import { effectiveClass, variantChain } from '../../build-mode/classes.js';
import { ic } from '../../build-mode/icons.js';
import BuildFieldReset from './BuildFieldReset.vue';

const props = defineProps({
  field: { type: Object, required: true },
});

const port = inject('sveBuild');

/* A placement field (Order) on an element whose place follows a field: read and written for the value that field stands on (boot.js `placedAt`). */
const placed = computed(() => (port.rev.value, props.field.placement ? port.placedAt?.(port.selectedPath()) : null));

const current = computed(() => {
  port.rev.value;

  const chain = placed.value?.scope ? placed.value.chain : variantChain(port.sizes(), port.size(), port.state());

  return effectiveClass(port.pickedClasses().join(' '), ['field'], chain, (name) =>
    fieldHas(props.field, name) ? 'field' : ''
  );
});

const own = computed(() => (current.value && !current.value.inherited ? current.value : null));

function pick(name) {
  if (placed.value?.scope) {
    port.setPlacedOneOf(props.field.names, own.value?.name === name ? null : name);

    return;
  }

  if (own.value?.name === name) {
    port.setClass(name);
  } else {
    port.setFieldClass(name, own.value?.raw || '');
  }
}
</script>

<template>
  <div class="fg-lab">{{ field.label }}<BuildFieldReset :hit="own" :label="field.label" /></div>
  <div class="fg-seg" :data-sve-build-seg="field.label">
    <button
      v-for="[name, glyph, title] in field.seg"
      :key="name"
      type="button"
      :aria-pressed="current?.name === name"
      :class="{ inh: current?.name === name && current.inherited }"
      :title="`${field.label}: ${title}`"
      :aria-label="`${field.label}: ${title}`"
      :data-sve-build-class="name"
      @click="pick(name)"
    >
      <span v-if="glyph.startsWith('#')">{{ glyph.slice(1) }}</span>
      <span v-else v-html="ic(glyph)"></span>
    </button>
  </div>
</template>
