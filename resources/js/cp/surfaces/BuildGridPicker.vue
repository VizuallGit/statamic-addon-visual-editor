<script setup>
/**
 * A Grid's rows and columns, for Add's tab (BuildAdd.vue) and the menu at a +
 * on the canvas (BuildQuickAdd.vue). Each structure draws its cells — one bar
 * per column, one line of bars per row — and is clicked (`pick`) or, where
 * `grab` is given, pressed and dragged onto the canvas.
 */
import { inject, ref } from 'vue';
import { ROWS, STRUCTURES } from '../../build-mode/catalog.js';

defineProps({
  grab: { type: Function, default: null },
});

const emit = defineEmits(['pick']);
const port = inject('sveBuild');
const rows = ref(1);
</script>

<template>
  <div class="bm-gp">
    <h4>{{ port.t('grid_rows') }}</h4>
    <div class="bm-seg">
      <button v-for="n in ROWS" :key="n" type="button" :aria-pressed="rows === n" :data-sve-build-rows="n" @click="rows = n">{{ n }}</button>
    </div>
    <h4>{{ port.t('grid_columns') }}</h4>
    <div class="bm-pk-grid">
      <button
        v-for="structure in STRUCTURES"
        :key="structure.key"
        type="button"
        class="bm-pk"
        :data-sve-build-structure="structure.key"
        @pointerdown="grab && grab($event, structure, rows)"
        @click="emit('pick', structure.key, rows)"
      >
        <span class="bm-cells">
          <span v-for="row in rows" :key="row" class="bm-bars"><i v-for="(part, n) in structure.parts" :key="n" :style="{ flex: part }"></i></span>
        </span>
        <span class="bm-pk-l">{{ structure.label }} <i v-if="structure.later" class="bm-soon">{{ port.t('later') }}</i></span>
      </button>
    </div>
  </div>
</template>
