<template>
  <div class="sve-theme__section" data-sve-theme-containers>
    <div class="sve-theme__widths-chart" aria-hidden="true">
      <span
        v-for="row in rows"
        :key="row.key"
        class="sve-theme__widths-bar"
        :class="{ 'is-fluid': row.key === ui.fluidWidth }"
        :style="{ width: `${share(row)}%` }"
      ></span>
    </div>

    <div class="sve-theme__widths">
      <template v-for="row in rows" :key="row.key">
        <span class="sve-theme__widths-name">
          <span class="sve-theme__grid-name">{{ ui.labels[`containers_${row.key.replace('-', '_')}`] }}</span>
          <span class="sve-theme__widths-class">{{ row.cls || CONTAINER_CLASS }}</span>
        </span>
        <span v-if="row.full" class="sve-theme__widths-full">100%</span>
        <label v-else class="sve-theme__input" :title="row.px ? widthRem(row.px) : ''">
          <input
            type="number"
            min="1"
            step="1"
            :value="row.px ?? ''"
            :aria-label="ui.labels[`containers_${row.key.replace('-', '_')}`]"
            :data-sve-theme-width="row.key"
            @change="h.onWidth(row.key, $event.target.value)"
          />
          <span class="sve-theme__unit">px</span>
        </label>
      </template>
    </div>
    <p class="sve-theme__hint">{{ ui.labels.containers_hint }}</p>
  </div>

  <div class="sve-theme__section">
    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.spacing_gutter }}</span>
      <span class="sve-theme__input">
        <select data-sve-gutter :value="gutterName" @change="h.onGutter(`var(--${$event.target.value})`)">
          <option v-if="gutterName && !ui.sizes.some((s) => s.name === gutterName)" :value="gutterName">{{
            ui.gutter
          }}</option>
          <option v-for="s in ui.sizes" :key="s.key" :value="s.name">{{ s.name }}</option>
        </select>
        <svg
          class="sve-theme__chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </label>
    <p class="sve-theme__hint">{{ ui.labels.spacing_gutter_hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { sizeRef } from '../theme-panel/presets.js';
import { CONTAINER_CLASS, CONTAINER_WIDTHS, FULL_WIDTH, widthRem } from '../../lib/container-widths.js';

defineProps({ h: { type: Object, required: true } });

/** Every width with the class it is, Full width last. */
const rows = computed(() => [
  ...CONTAINER_WIDTHS.map((w) => ({ ...w, px: ui.widths.find((x) => x.key === w.key)?.px ?? null })),
  { ...FULL_WIDTH, full: true },
]);

/** `var(--size-700)` → `size-700`, so the select matches a row of the scale. */
const gutterName = computed(() => sizeRef(ui.gutter) || '');

const widest = computed(() => Math.max(1, ...ui.widths.map((w) => w.px || 0)));

/** A bar's width in the chart: the widest width just short of Full width's whole line. */
function share(row) {
  if (row.full) {
    return 100;
  }

  return row.px ? Math.max(6, (row.px / widest.value) * 90) : 0;
}
</script>
