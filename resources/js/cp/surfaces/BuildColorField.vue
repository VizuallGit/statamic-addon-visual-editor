<script setup>
/**
 * A colour the way Figma's Fill row and Paper's draw it: a swatch, then the
 * value — a token from the site's palette as a chip (`primary`), or what was
 * typed (`#13204f`, `var(--brand)`). The swatch opens the Tailwind pane's own
 * colour menu for the property (`port.openMenu`); the value is a
 * BuildValueInput, so typing writes the class the pane would.
 */
import { computed, inject, ref } from 'vue';
import BuildValueInput from './BuildValueInput.vue';
import { effectiveClass, fromClass, variantChain } from '../../build-mode/classes.js';

const props = defineProps({
  tool: { type: Object, required: true },
});

const port = inject('sveBuild');
const swatch = ref(null);
const property = computed(() => props.tool.css || props.tool.tw);

const color = computed(() => {
  port.rev.value;

  const hit = effectiveClass(port.pickedClasses().join(' '), [property.value], variantChain(port.sizes(), port.size(), port.state()), port.propertyOf);

  if (!hit) {
    return '';
  }

  const known = port.swatches(property.value).find((sw) => sw.name === hit.name);

  if (known) {
    return known.color;
  }

  const value = fromClass(hit.name, hit.name.split('-')[0]);

  return /^(#|rgb|hsl|oklch|var\()/.test(value) ? value : '';
});
</script>

<template>
  <div class="fg-field fg-color">
    <button
      ref="swatch"
      type="button"
      class="fg-swatch"
      :class="{ 'is-empty': !color }"
      :style="color ? { background: color } : null"
      :title="port.t('value_menu')"
      :aria-label="port.t('value_menu')"
      :data-sve-build-swatch="property"
      @click="port.openMenu(tool.tw || property, swatch)"
    ></button>
    <BuildValueInput :tool="tool" :label="property" chip />
  </div>
</template>
