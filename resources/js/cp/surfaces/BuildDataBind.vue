<script setup>
/**
 * The little data icon on a Style field, in CSS mode on an ID that is one
 * section's alone: the dock's list of the fields that fit, and a pick is the
 * style's value (css-mode/port.js). A field's own class (`bm-sp-t`, a side of
 * Spacing's box) comes along, so the icon knows which side it stands by.
 */
import { computed, inject, ref } from 'vue';
import { DATA_ICON } from '../../build-mode/css-mode/icons.js';

const props = defineProps({
  property: { type: String, required: true },
  twin: { type: String, default: '' },
  label: { type: String, default: '' },
});

const port = inject('sveBuild');
const button = ref(null);
const shown = computed(() => port.bindable(props.twin || props.property));
const bound = computed(() => port.boundOf(props.property, props.twin));
const title = computed(() => (bound.value ? port.t('css_mode_field_bound', { name: bound.value }) : port.t('css_mode_field_bind')));
</script>

<template>
  <button
    v-if="shown"
    ref="button"
    type="button"
    class="sve-css-bind"
    :class="{ 'is-bound': !!bound }"
    :title="title"
    :aria-label="title"
    :aria-pressed="!!bound"
    :data-sve-css-bind="label || property"
    @pointerdown.stop
    @click.stop.prevent="port.pickFieldFor(button, property, twin)"
    v-html="DATA_ICON"
  ></button>
</template>
