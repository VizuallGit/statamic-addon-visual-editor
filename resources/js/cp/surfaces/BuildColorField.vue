<script setup>
/**
 * A colour the way Figma's Fill row and Paper's draw it: a swatch, then the
 * value — a token from the site's palette as a chip (`primary-500`), or what
 * was typed (`#13204f`, `var(--brand)`). The value is a BuildValueInput, and
 * the swatch opens the same menu. The swatch paints what the menu's dot for
 * the class paints (`port.colorOf`): the catalog's colour, or the preview's
 * for a theme variable such as `--color-primary-500`.
 */
import { computed, inject, ref } from 'vue';
import BuildValueInput from './BuildValueInput.vue';
import { effectiveClass, fromClass, isColorValue, variantChain } from '../../build-mode/classes.js';

const props = defineProps({
  tool: { type: Object, required: true },
});

const port = inject('sveBuild');
const value = ref(null);
const property = computed(() => props.tool.css || props.tool.tw);

const color = computed(() => {
  port.rev.value;

  const hit = effectiveClass(port.pickedClasses().join(' '), [property.value], variantChain(port.sizes(), port.size(), port.state()), port.propertyOf);

  if (!hit) {
    return '';
  }

  const typed = fromClass(hit.name, hit.name.split('-')[0]);

  return port.colorOf(hit.name) || (isColorValue(typed) ? typed : '');
});
</script>

<template>
  <div class="fg-field fg-color">
    <button
      type="button"
      class="fg-swatch"
      :class="{ 'is-empty': !color }"
      :style="color ? { background: color } : null"
      :title="port.t('value_menu')"
      :aria-label="port.t('value_menu')"
      :data-sve-build-swatch="property"
      @click="value?.open()"
    ></button>
    <BuildValueInput ref="value" :tool="tool" :label="property" chip />
  </div>
</template>
