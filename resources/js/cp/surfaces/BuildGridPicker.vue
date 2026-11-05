<script setup>
/**
 * A Grid's columns and rows, for Add's tab (BuildAdd.vue): every preset
 * Style's tiles have (GRID_PRESETS), each drawn as its cells — one bar per
 * column, one line of bars per row — and clicked (`pick`) or, where `grab`
 * is given, pressed and dragged onto the canvas. The grid is written empty.
 */
import { GRID_PRESETS } from '../../build-mode/catalog.js';

defineProps({
  grab: { type: Function, default: null },
});

const emit = defineEmits(['pick']);
</script>

<template>
  <div class="bm-gp">
    <div class="bm-pk-grid">
      <button
        v-for="preset in GRID_PRESETS"
        :key="preset.key"
        type="button"
        class="bm-pk"
        :title="preset.label"
        :data-sve-build-structure="preset.key"
        @pointerdown="grab && grab($event, preset)"
        @click="emit('pick', preset.key)"
      >
        <span class="bm-cells">
          <span v-for="row in preset.rows" :key="row" class="bm-bars"><i v-for="(part, n) in preset.parts" :key="n" :style="{ flex: part }"></i></span>
        </span>
        <span class="bm-pk-l">{{ preset.label }}</span>
      </button>
    </div>
  </div>
</template>
