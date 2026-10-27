<script setup>
/**
 * Figma's alignment box for a flex container: nine cells, one click sets
 * both axes — `justify-*` along the direction, `items-*` across it. In a
 * column the main axis runs down, so the grid turns with it, as Figma's does.
 *
 * It writes the same classes the Tailwind pane's justify and align buttons
 * write, through the same function (`port.setClass` → twSetClass), and only
 * when the class is not already the one at this size and state — a click
 * never takes an axis off.
 */
import { computed, inject } from 'vue';

const props = defineProps({
  column: { type: Boolean, default: false },
});

const port = inject('sveBuild');
const AXIS = ['start', 'center', 'end'];

const now = computed(() => {
  port.rev.value;

  return { main: port.activeClass('justify-content'), cross: port.activeClass('align-items') };
});

const cells = computed(() =>
  [0, 1, 2].flatMap((row) =>
    [0, 1, 2].map((col) => {
      const main = `justify-${AXIS[props.column ? row : col]}`;
      const cross = `items-${AXIS[props.column ? col : row]}`;

      return { key: `${row}-${col}`, main, cross, on: now.value.main === main && now.value.cross === cross };
    })
  )
);

function pick(cell) {
  if (port.activeClass('justify-content') !== cell.main) {
    port.setClass(cell.main);
  }

  if (port.activeClass('align-items') !== cell.cross) {
    port.setClass(cell.cross);
  }
}
</script>

<template>
  <div class="fg-matrix" :class="{ 'is-col': column }" data-sve-build-matrix>
    <button
      v-for="cell in cells"
      :key="cell.key"
      type="button"
      :aria-pressed="cell.on"
      :title="`justify-content: ${cell.main.slice(8)} · align-items: ${cell.cross.slice(6)}`"
      :data-sve-build-cell="cell.key"
      @click="pick(cell)"
    ><i></i><i></i><i></i></button>
  </div>
</template>
