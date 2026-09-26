<template>
  <div class="sve-theme">
    <!-- data-sve-pane-bar: the right sidebar puts its pin next to our close here. -->
    <header class="sve-theme__head" data-sve-pane-bar>
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

    <!-- One row that scrolls sideways when the tabs do not fit, with a fade saying
         there is more. The fades are siblings: a mask on the scroller resets its
         scrollLeft in Chrome (same as the a11y and Patterns rows). -->
    <div class="sve-theme__tabs-wrap">
      <nav ref="tabsEl" class="sve-theme__tabs" role="tablist" @scroll="syncFades">
        <button
          v-for="tab in TABS"
          :key="tab.key"
          type="button"
          role="tab"
          class="sve-theme__tab"
          :class="{ 'is-on': ui.tab === tab.key }"
          :aria-selected="ui.tab === tab.key"
          :data-sve-theme-tab="tab.key"
          @click="onTab(tab.key)"
        >
          <span class="sve-theme__tab-icon" aria-hidden="true" v-html="tab.icon"></span>
          <span>{{ ui.labels[`panel_tab_${tab.key}`] }}</span>
        </button>
      </nav>
      <span class="sve-theme__tabs-fade is-start" :class="{ 'is-on': fades.start }" aria-hidden="true"></span>
      <span class="sve-theme__tabs-fade is-end" :class="{ 'is-on': fades.end }" aria-hidden="true"></span>
    </div>

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
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { THEME_PANEL_ICON } from '../../theme-panel-lazy.js';
import ThemeColorsTab from './ThemeColorsTab.vue';
import ThemeSpacingTab from './ThemeSpacingTab.vue';
import ThemeTypeTab from './ThemeTypeTab.vue';
import ThemeButtonTab from './ThemeButtonTab.vue';

const svg = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

/** Each tab with its icon: a palette, a ruler, a T, a button. */
const TABS = [
  {
    key: 'colors',
    icon: svg('<circle cx="13.5" cy="6.5" r="1" fill="currentColor" stroke="none"/><circle cx="17.5" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="8.5" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="6.5" cy="12.5" r="1" fill="currentColor" stroke="none"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z"/>'),
  },
  {
    key: 'spacing',
    icon: svg('<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>'),
  },
  {
    key: 'type',
    icon: svg('<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>'),
  },
  {
    key: 'button',
    icon: svg('<rect x="2" y="7" width="20" height="10" rx="5"/><path d="M8 12h8"/>'),
  },
];

const tabsEl = ref(null);
const fades = reactive({ start: false, end: false });
let resize = null;

/** A fade only while there is more that way — otherwise it reads as a shadow on nothing. */
function syncFades() {
  const el = tabsEl.value;

  if (!el) {
    return;
  }

  fades.start = el.scrollLeft > 1;
  fades.end = el.scrollWidth - el.clientWidth - el.scrollLeft > 1;
}

onMounted(() => {
  syncFades();

  if (typeof ResizeObserver !== 'undefined' && tabsEl.value) {
    resize = new ResizeObserver(syncFades);
    resize.observe(tabsEl.value);
  }
});

onBeforeUnmount(() => resize?.disconnect());

// The chosen tab stays in sight, and the fades follow.
watch(() => ui.tab, () => nextTick(() => {
  tabsEl.value?.querySelector('.is-on')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  syncFades();
}));

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
  onRenameByLightness: { type: Function, required: true },
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
