<script setup>
/** Spacing as the box or as fields: small and plain, it says how the rest is drawn and nothing more. */
import { inject } from 'vue';
import { ic } from '../../build-mode/icons.js';

defineProps({
  view: { type: String, required: true },
});

defineEmits(['flip']);

const port = inject('sveBuild');
</script>

<template>
  <button
    type="button"
    class="bm-sp-view"
    :title="port.t(view === 'box' ? 'spacing_fields' : 'spacing_box')"
    :aria-label="port.t(view === 'box' ? 'spacing_fields' : 'spacing_box')"
    data-sve-build-spacing-view
    @click="$emit('flip')"
    v-html="ic('container')"
  ></button>
</template>
