<script setup>
/**
 * One field's value taken off, without its menu: what the family's dot does for
 * all of them, and the same call (`port.setClass`, a second set takes a class
 * off). Only a value the field has itself, at the size and state picked: what
 * reaches it from a wider size has nothing here to take off.
 *
 * Drawn while the CSS mode demo is on (BuildStyleMode.vue provides it), in either
 * mode. Its looks are css-mode/panel-look.js's.
 */
import { inject } from 'vue';
import { ic } from '../../build-mode/icons.js';

defineProps({
  hit: { type: Object, default: null },
  label: { type: String, default: '' },
});

const port = inject('sveBuild');
const on = inject('sveFieldReset', false);
</script>

<template>
  <button
    v-if="on && hit"
    type="button"
    class="sve-field-reset"
    data-sve-field-reset
    :title="port.t('field_reset', { name: label })"
    :aria-label="port.t('field_reset', { name: label })"
    @click.stop.prevent="port.setClass(hit.name)"
    v-html="ic('reset')"
  ></button>
</template>
