<template>
  <div class="sve-theme__section">
    <div class="sve-theme__viewport">
      <span class="sve-theme__device" :title="ui.labels.spacing_mobile">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/></svg>
        {{ MIN_VIEWPORT }} px
      </span>
      <span aria-hidden="true">→</span>
      <span class="sve-theme__device" :title="ui.labels.spacing_container">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
      </span>
      <label class="sve-theme__input">
        <input type="number" min="400" step="10" :value="ui.maxViewport" :aria-label="ui.labels.spacing_container" @change="h.onViewport($event.target.value)">
        <span class="sve-theme__unit">px</span>
      </label>
    </div>
    <p class="sve-theme__hint">{{ ui.labels.spacing_viewport_hint }}</p>

    <div class="sve-theme__chart" aria-hidden="true">
      <span class="sve-theme__chart-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
      </span>
      <div class="sve-theme__bars is-desktop">
        <button
          v-for="s in ui.sizes"
          :key="s.key"
          type="button"
          tabindex="-1"
          class="sve-theme__bar"
          :class="{ 'is-selected': ui.selectedSize === s.key }"
          @click="h.onSelectSize(s.key)"
        >
          <span class="sve-theme__bar-value">{{ round(s.max) }}</span>
          <span class="sve-theme__bar-fill" :style="{ height: `${barRem(s.max, 6.25)}rem` }"></span>
        </button>
      </div>

      <span></span>
      <div class="sve-theme__bar-names">
        <span v-for="s in ui.sizes" :key="s.key" :class="{ 'is-selected': ui.selectedSize === s.key }">{{ short(s.name) }}</span>
      </div>

      <span class="sve-theme__chart-icon is-mobile">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/></svg>
      </span>
      <div class="sve-theme__bars is-mobile">
        <button
          v-for="s in ui.sizes"
          :key="s.key"
          type="button"
          tabindex="-1"
          class="sve-theme__bar"
          :class="{ 'is-selected': ui.selectedSize === s.key }"
          @click="h.onSelectSize(s.key)"
        >
          <span class="sve-theme__bar-value">{{ round(s.min) }}</span>
          <span class="sve-theme__bar-fill" :style="{ height: `${barRem(s.min, 4)}rem` }"></span>
        </button>
      </div>
    </div>
  </div>

  <div class="sve-theme__section">
    <div class="sve-theme__grid">
      <span class="sve-theme__grid-head">{{ ui.labels.spacing_name }}</span>
      <span class="sve-theme__grid-head">{{ ui.labels.spacing_mobile }}</span>
      <span class="sve-theme__grid-head">{{ ui.labels.spacing_desktop }}</span>
      <span></span>

      <template v-for="s in ui.sizes" :key="s.key">
        <label v-if="s.fresh" class="sve-theme__input" :class="{ 'is-bad': s.problem }">
          <span class="sve-theme__unit">size-</span>
          <input
            type="text"
            :value="s.name.replace(/^size-/, '')"
            spellcheck="false"
            autocomplete="off"
            :aria-label="ui.labels.spacing_name"
            @input="h.onSizeName(s.key, $event.target.value)"
            @focus="h.onSelectSize(s.key)"
          >
        </label>
        <span
          v-else
          class="sve-theme__grid-name"
          :class="{ 'is-selected': ui.selectedSize === s.key }"
          :title="`--${s.name}`"
          @click="h.onSelectSize(s.key)"
        >{{ s.name }}</span>

        <label class="sve-theme__input">
          <input type="number" min="1" step="1" :value="round(s.min)" :aria-label="`${s.name} ${ui.labels.spacing_mobile}`" @input="h.onSize(s.key, 'min', $event.target.value)" @focus="h.onSelectSize(s.key)">
        </label>
        <label class="sve-theme__input">
          <input type="number" min="1" step="1" :value="round(s.max)" :aria-label="`${s.name} ${ui.labels.spacing_desktop}`" @input="h.onSize(s.key, 'max', $event.target.value)" @focus="h.onSelectSize(s.key)">
        </label>
        <button type="button" class="sve-theme__icon-button" :title="ui.labels.spacing_remove" @click="h.onRemoveSize(s.key)">
          <!-- A bin, not an ×: an × in Live Preview is taken for Statamic's own close button and hidden. -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </template>
    </div>
    <p v-if="ui.sizes.some((s) => s.problem)" class="sve-theme__problem" style="margin-left: 0">{{ ui.labels.spacing_name_problem }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { MIN_VIEWPORT } from '../theme-panel/sizes.js';

defineProps({ h: { type: Object, required: true } });

/** The largest desktop value: the bars are drawn against it, so desktop and mobile compare. */
const largest = computed(() => Math.max(1, ...ui.sizes.map((s) => s.max)));

function barRem(px, room) {
  return Math.max(0.375, Math.min(room, (px / largest.value) * 6.25)).toFixed(3);
}

function round(px) {
  return Math.round(px * 100) / 100;
}

function short(name) {
  return name.replace(/^size-/, '');
}
</script>
