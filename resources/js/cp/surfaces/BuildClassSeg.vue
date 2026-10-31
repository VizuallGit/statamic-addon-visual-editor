<script setup>
/**
 * A choice among a few fixed classes, as buttons: an underline, italic, upper
 * case. Pressed, one takes the place of the other; pressed again it comes off,
 * as a second click on the Tailwind pane's row takes a class off. An option
 * shows a glyph (`ic`) or, with a leading `#`, the words themselves (`#AB`).
 */
import { computed, inject } from 'vue';
import { fieldHas } from '../../build-mode/catalog.js';
import { effectiveClass, variantChain } from '../../build-mode/classes.js';
import { ic } from '../../build-mode/icons.js';

const props = defineProps({
  field: { type: Object, required: true },
});

const port = inject('sveBuild');

const current = computed(() => {
  port.rev.value;

  const chain = variantChain(port.sizes(), port.size(), port.state());

  return effectiveClass(port.pickedClasses().join(' '), ['field'], chain, (name) => (fieldHas(props.field, name) ? 'field' : ''));
});

function pick(name) {
  const own = current.value && !current.value.inherited ? current.value : null;

  if (own?.name === name) {
    port.setClass(name);
  } else {
    port.setFieldClass(name, own?.raw || '');
  }
}
</script>

<template>
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
