<script setup>
/**
 * A value the element has itself, at the size and state picked: a small dot, the
 * family's dot (`.fg-set`), and hovered or focused the reset it does. What reaches
 * the element from a wider size has no dot, as there is nothing here to take off.
 * Pressed, it does what the family's dot does for all of them, and the same call
 * (`port.setClass`, a second set takes a class off).
 *
 * `hit` is one class; `names` several, for a row of buttons that writes more than
 * one (a border side by side, alignment's two axes).
 *
 * Drawn in Style (BuildStyleMode.vue provides it), in either mode. Its looks are
 * css-mode/panel-look.js's.
 */
import { computed, inject } from 'vue';
import { ic } from '../../build-mode/icons.js';

const props = defineProps({
  hit: { type: Object, default: null },
  names: { type: Array, default: () => [] },
  label: { type: String, default: '' },
});

const port = inject('sveBuild');
const on = inject('sveFieldReset', false);
const own = computed(() => (props.hit ? [props.hit.name] : props.names));
</script>

<template>
  <button
    v-if="on && own.length"
    type="button"
    class="sve-field-reset"
    data-sve-field-reset
    :data-sve-field-reset-of="label"
    :title="port.t('field_reset', { name: label })"
    :aria-label="port.t('field_reset', { name: label })"
    @click.stop.prevent="own.forEach((name) => port.setClass(name))"
  ><i></i><span v-html="ic('reset')"></span></button>
</template>
