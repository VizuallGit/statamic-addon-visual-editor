<template>
  <div class="sve-theme">
    <header class="sve-theme__head">
      <span class="sve-theme__icon" aria-hidden="true" v-html="THEME_PANEL_ICON"></span>
      <span class="sve-theme__titles">
        <span class="sve-theme__title">{{ ui.labels.panel_title }}</span>
        <span class="sve-theme__subtitle">{{ ui.labels.panel_subtitle }}</span>
      </span>
      <!-- data-sve-close: ours, so the hider for Statamic's own Live Preview × leaves it alone. -->
      <button type="button" class="sve-theme__ghost" data-sve-close :title="ui.labels.panel_close" @click="onClose">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </header>

    <nav class="sve-theme__tabs" role="tablist">
      <button
        v-for="tab in TABS"
        :key="tab"
        type="button"
        role="tab"
        class="sve-theme__tab"
        :class="{ 'is-on': ui.tab === tab }"
        :aria-selected="ui.tab === tab"
        :data-sve-theme-tab="tab"
        @click="onTab(tab)"
      >{{ ui.labels[`panel_tab_${tab}`] }}</button>
    </nav>

    <div class="sve-theme__actions">
      <button v-if="ui.tab === 'colors'" type="button" class="sve-theme__add" @click="onAddColor">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
        {{ ui.labels.colors_add }}
      </button>
      <button v-else-if="ui.tab === 'spacing'" type="button" class="sve-theme__add" @click="onAddSize">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
        {{ ui.labels.spacing_add }}
      </button>
      <span class="sve-theme__status">{{ ui.status }}</span>
      <button type="button" class="sve-theme__save" :disabled="!ui.dirty || ui.saving" @click="onSave">{{ ui.labels.panel_save }}</button>
    </div>

    <div class="sve-theme__body">
      <p v-if="ui.loading" class="sve-theme__empty">{{ ui.labels.panel_loading }}</p>
      <ThemeColorsTab v-else-if="ui.tab === 'colors'" :h="props" />
      <ThemeSpacingTab v-else-if="ui.tab === 'spacing'" :h="props" />
      <ThemeTypeTab v-else-if="ui.tab === 'type'" :h="props" />
      <ThemeButtonTab v-else-if="ui.tab === 'button'" :h="props" />
    </div>
  </div>
</template>

<script setup>
import { themePanelUi as ui } from '../theme-panel/store.js';
import { THEME_PANEL_ICON } from '../../theme-panel-lazy.js';
import ThemeColorsTab from './ThemeColorsTab.vue';
import ThemeSpacingTab from './ThemeSpacingTab.vue';
import ThemeTypeTab from './ThemeTypeTab.vue';
import ThemeButtonTab from './ThemeButtonTab.vue';

const TABS = ['colors', 'spacing', 'type', 'button'];

/** Every handler from theme-panel.js; the tabs get them all as `h`. */
const props = defineProps({
  onClose: { type: Function, required: true },
  onSave: { type: Function, required: true },
  onTab: { type: Function, required: true },
  onAddColor: { type: Function, required: true },
  onOpen: { type: Function, required: true },
  onName: { type: Function, required: true },
  onColor: { type: Function, required: true },
  onToggle: { type: Function, required: true },
  onCount: { type: Function, required: true },
  onStep: { type: Function, required: true },
  onRemoveColor: { type: Function, required: true },
  onAddSize: { type: Function, required: true },
  onSizeName: { type: Function, required: true },
  onSize: { type: Function, required: true },
  onSelectSize: { type: Function, required: true },
  onRemoveSize: { type: Function, required: true },
  onViewport: { type: Function, required: true },
  onType: { type: Function, required: true },
  onButton: { type: Function, required: true },
});
</script>
