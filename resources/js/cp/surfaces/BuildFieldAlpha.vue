<script setup>
/**
 * How see-through a chosen colour is, beside the colour: empty until it is wanted,
 * and with nothing typed, or 100, the class has no alpha at all. Written as any
 * value of the field is (`bg-primary-300/50`), so the CSS mode writes what that
 * compiles to. The arrows step it; a value from a wider size is shown, and typing
 * writes the field's own.
 *
 * Drawn by Style (BuildStyleMode.vue provides it), in either
 * mode. Its looks are css-mode/panel-look.js's.
 */
import { computed, inject, ref, watch } from 'vue';
import { alphaOf, withAlpha } from '../../build-mode/color-alpha.js';

const props = defineProps({
  hit: { type: Object, default: null },
});

const port = inject('sveBuild');
const on = inject('sveFieldReset', false);
const shows = computed(() => on && !!props.hit && !/^sve-bound/.test(props.hit.name));
const alpha = computed(() => (props.hit ? alphaOf(props.hit.raw) : null));
const text = ref('');

watch(alpha, (now) => {
  text.value = now === null ? '' : String(now);
}, { immediate: true });

function write(value) {
  const next = withAlpha(props.hit.name, value);

  if (next !== withAlpha(props.hit.name, alpha.value ?? '')) {
    port.setFieldClass(next, props.hit.inherited ? '' : props.hit.raw);
  }
}

function step(by) {
  const now = Math.min(100, Math.max(0, (alpha.value ?? 100) + by));

  text.value = String(now);
  write(now);
}

function restore() {
  text.value = alpha.value === null ? '' : String(alpha.value);
}
</script>

<template>
  <span v-if="shows" class="sve-alpha" :class="{ 'is-set': alpha !== null, inh: hit.inherited }" :title="port.t('field_alpha')">
    <input
      v-model="text"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      spellcheck="false"
      placeholder="100"
      :aria-label="port.t('field_alpha')"
      data-sve-field-alpha
      @click.stop.prevent
      @change="write(text)"
      @keydown.enter.prevent="$event.target.blur()"
      @keydown.esc.stop.prevent="restore"
      @keydown.up.prevent="step(1)"
      @keydown.down.prevent="step(-1)"
    /><span>%</span>
  </span>
</template>
