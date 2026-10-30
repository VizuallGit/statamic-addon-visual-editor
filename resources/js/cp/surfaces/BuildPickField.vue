<script setup>
/** The data icon in a box of Content: says which field to read from (port.pickField). */
import { inject } from 'vue';
import { ic } from '../../build-mode/icons.js';

defineEmits(['pick']);

const port = inject('sveBuild');
</script>

<template>
  <button
    type="button"
    class="bm-pick-field"
    :title="port.t('content_field_pick')"
    :aria-label="port.t('content_field_pick')"
    data-sve-build-pick-field
    @click="$emit('pick', $event.currentTarget)"
    v-html="ic('data')"
  ></button>
</template>
