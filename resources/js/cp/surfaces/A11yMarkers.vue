<script setup>
import { markerUi as ui } from '../a11y/store.js';
</script>

<template>
  <button
    v-for="marker in ui.markers"
    :key="marker.id"
    type="button"
    class="sve-a11y-badge"
    :data-level="marker.level"
    :data-dim="marker.dim ? '' : undefined"
    :style="{ left: marker.left + 'px', top: marker.top + 'px', zIndex: marker.z }"
    :title="marker.title"
    @click.stop="ui.onPick?.(marker.key)"
  >
    {{ marker.label }}
  </button>
</template>
