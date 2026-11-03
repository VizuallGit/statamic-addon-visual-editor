<template>
  <div class="sve-theme">
    <!-- The right sidebar's own bar, as every pane has it: title, then pin and
         close together (the sidebar paints the pin). data-sve-close is ours,
         so the hider for Statamic's own Live Preview × leaves it alone. -->
    <div class="sve-pane-bar" data-sve-pane-bar>
      <div data-sve-right-title :title="ui.labels.panel_subtitle">{{ ui.labels.panel_title }}</div>
      <div data-sve-right-actions>
        <button type="button" data-sve-right-pin aria-pressed="false"></button>
        <button type="button" data-sve-close :aria-label="ui.labels.panel_close" :title="ui.labels.panel_close" @click="onClose">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>

    <!-- One section open at a time (`ui.tab`, '' for none). The open one's
         header stays at the top while its body scrolls under it. -->
    <div ref="bodyEl" class="sve-theme__body">
      <section
        v-for="s in SECTIONS"
        :key="s.key"
        class="sve-theme__fold"
        :class="{ 'is-open': ui.tab === s.key }"
        :data-sve-theme-fold="s.key"
      >
        <div class="sve-theme__fold-head">
          <button
            type="button"
            class="sve-theme__fold-toggle"
            :class="{ 'is-on': ui.tab === s.key, 'has-add': !!addFor(s.key) }"
            :aria-expanded="ui.tab === s.key"
            :aria-controls="`sve-theme-fold-${s.key}`"
            :data-sve-theme-tab="s.key"
            @click="onTab(s.key)"
          >
            <span class="sve-theme__fold-icon" aria-hidden="true" v-html="s.icon"></span>
            <span class="sve-theme__fold-title">{{ ui.labels[`panel_tab_${s.key}`] }}</span>
            <span v-if="s.key === 'colors'" class="sve-theme__fold-swatches" aria-hidden="true">
              <span v-for="c in swatches" :key="c.key" :style="{ background: c.color }"></span>
            </span>
            <span v-else class="sve-theme__fold-meta">{{ meta(s.key) }}</span>
            <svg class="sve-theme__fold-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>
          </button>
          <!-- The section's one "new": under Styles the chip says which. -->
          <button
            v-if="addFor(s.key)"
            type="button"
            class="sve-theme__fold-add"
            data-sve-theme-add
            v-bind="{ [`data-sve-${addFor(s.key).attr}-add`]: '' }"
            :title="addFor(s.key).label"
            :aria-label="addFor(s.key).label"
            :disabled="addFor(s.key).off"
            @click="addFor(s.key).run()"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>

        <div
          v-if="ui.tab === s.key"
          :id="`sve-theme-fold-${s.key}`"
          class="sve-theme__fold-body"
          role="region"
          :aria-label="ui.labels[`panel_tab_${s.key}`]"
        >
          <p v-if="ui.loading" class="sve-theme__empty">{{ ui.labels.panel_loading }}</p>
          <component :is="s.view" v-else :h="props" />
        </div>
      </section>
    </div>

    <div class="sve-theme__foot">
      <span class="sve-theme__status">{{ ui.status }}</span>
      <button type="button" class="sve-theme__save" :disabled="!ui.dirty || ui.saving" @click="onSave">{{ ui.labels.panel_save }}</button>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { firstFamily } from '../theme-panel/presets.js';
import { MIN_VIEWPORT } from '../theme-panel/sizes.js';
import ThemeColorsTab from './ThemeColorsTab.vue';
import ThemeSpacingTab from './ThemeSpacingTab.vue';
import ThemeFontsTab from './ThemeFontsTab.vue';
import ThemeTypeTab from './ThemeTypeTab.vue';
import ThemeButtonTab from './ThemeButtonTab.vue';
import ThemeFormsTab from './ThemeFormsTab.vue';
import ThemeStylesTab from './ThemeStylesTab.vue';

const svg = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

/** Each section with its icon: a palette, a ruler, a large and a small A, a T, braces, a button, a text field. */
const SECTIONS = [
  {
    key: 'colors',
    view: ThemeColorsTab,
    icon: svg('<circle cx="13.5" cy="6.5" r="1" fill="currentColor" stroke="none"/><circle cx="17.5" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="8.5" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="6.5" cy="12.5" r="1" fill="currentColor" stroke="none"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z"/>'),
  },
  {
    key: 'spacing',
    view: ThemeSpacingTab,
    icon: svg('<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>'),
  },
  {
    key: 'fonts',
    view: ThemeFontsTab,
    icon: svg('<path d="M21 14h-5"/><path d="M16 16v-3.5a2.5 2.5 0 0 1 5 0V16"/><path d="M4.5 13h6"/><path d="m3 16 4.5-9 4.5 9"/>'),
  },
  {
    key: 'type',
    view: ThemeTypeTab,
    icon: svg('<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>'),
  },
  {
    key: 'styles',
    view: ThemeStylesTab,
    icon: svg('<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/><path d="M10 10h4"/><path d="M10 14h2"/>'),
  },
  {
    key: 'button',
    view: ThemeButtonTab,
    icon: svg('<rect x="2" y="7" width="20" height="10" rx="5"/><path d="M8 12h8"/>'),
  },
  {
    key: 'forms',
    view: ThemeFormsTab,
    icon: svg('<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10v4"/>'),
  },
];

/** Every handler from theme-panel.js; the sections get them all as `h`. */
const props = defineProps({
  onClose: { type: Function, required: true },
  onSave: { type: Function, required: true },
  onTab: { type: Function, required: true },
  onAddColor: { type: Function, required: true },
  onOpen: { type: Function, required: true },
  onName: { type: Function, required: true },
  onColor: { type: Function, required: true },
  onMode: { type: Function, required: true },
  onToggle: { type: Function, required: true },
  onCount: { type: Function, required: true },
  onStep: { type: Function, required: true },
  onRemoveColor: { type: Function, required: true },
  onRenameByLightness: { type: Function, required: true },
  onNudge: { type: Function, required: true },
  onAddSize: { type: Function, required: true },
  onSizeName: { type: Function, required: true },
  onSize: { type: Function, required: true },
  onSelectSize: { type: Function, required: true },
  onRemoveSize: { type: Function, required: true },
  onViewport: { type: Function, required: true },
  onGutter: { type: Function, required: true },
  onAddHighlight: { type: Function, required: true },
  onHighlightName: { type: Function, required: true },
  onHighlightValue: { type: Function, required: true },
  onRemoveHighlight: { type: Function, required: true },
  onAddFont: { type: Function, required: true },
  onType: { type: Function, required: true },
  onClassQuery: { type: Function, required: true },
  onClassChip: { type: Function, required: true },
  onOpenClass: { type: Function, required: true },
  onClassName: { type: Function, required: true },
  onClassBody: { type: Function, required: true },
  onRemoveClass: { type: Function, required: true },
  onOpenClassKey: { type: Function, required: true },
  onAddUtilityFromClasses: { type: Function, required: true },
  onButton: { type: Function, required: true },
  onInput: { type: Function, required: true },
  onAddUtility: { type: Function, required: true },
  onOpenUtility: { type: Function, required: true },
  onUtilityName: { type: Function, required: true },
  onUtilityBody: { type: Function, required: true },
  onLockUtility: { type: Function, required: true },
  onRemoveUtility: { type: Function, required: true },
  onAddProp: { type: Function, required: true },
  onOpenProp: { type: Function, required: true },
  onPropName: { type: Function, required: true },
  onPropValue: { type: Function, required: true },
  onRemoveProp: { type: Function, required: true },
  // CSS snippets under Styles — their own files, saved row by row.
  onAddSnippet: { type: Function, required: true },
  onSnippetName: { type: Function, required: true },
  onSnippetBody: { type: Function, required: true },
  onSaveSnippet: { type: Function, required: true },
  onRemoveSnippet: { type: Function, required: true },
});

/**
 * The open section's "new", or null: none on a closed section, none while the
 * theme loads. `attr` names the button for the browser tests.
 */
function addFor(key) {
  if (ui.tab !== key || ui.loading) {
    return null;
  }

  if (key === 'colors') {
    return { attr: 'color', label: ui.labels.colors_add, run: props.onAddColor };
  }

  if (key === 'spacing') {
    return { attr: 'size', label: ui.labels.spacing_add, run: props.onAddSize };
  }

  if (key === 'fonts') {
    return { attr: 'font', label: ui.labels.fonts_add, run: props.onAddFont, off: !ui.fontsWritable };
  }

  if (key === 'styles' && ui.classChip === 'class') {
    // Not while saving: the save reads the list in again, and a row made now would be left with nothing behind it.
    return { attr: 'class', label: ui.labels.classes_add, run: props.onAddUtilityFromClasses, off: ui.saving };
  }

  if (key === 'styles' && ui.classChip === 'variable') {
    return { attr: 'prop', label: ui.labels.props_add, run: props.onAddProp };
  }

  if (key === 'styles' && ui.classChip === 'snippet') {
    return { attr: 'snippet', label: ui.labels.classes_add_snippet, run: props.onAddSnippet };
  }

  return null;
}

/** The palette on the Colors header: each color's base, or its first step. */
const swatches = computed(() => ui.families
  .map((f) => ({ key: f.key, color: f.value || f.steps[0]?.value }))
  .filter((c) => c.color));

/** What a closed section holds, in a few words on its header. */
function meta(key) {
  if (key === 'spacing') {
    return ui.sizes.length
      ? (ui.labels.panel_meta_spacing || '').replace(':count', ui.sizes.length).replace(':min', MIN_VIEWPORT).replace(':max', ui.maxViewport)
      : '';
  }

  if (key === 'fonts') {
    const kits = ui.kits.flatMap((kit) => kit.families || []).map((f) => (typeof f === 'string' ? f : f?.name));

    return [...new Set([...ui.installed.map((f) => f.name), ...kits].filter(Boolean))].join(', ');
  }

  if (key === 'type') {
    return [...new Set([firstFamily(ui.type['font-base']), firstFamily(ui.type['font-heading'])].filter(Boolean))].join(' · ');
  }

  return ui.labels[`panel_meta_${key}`] || '';
}

const bodyEl = ref(null);

// The section just opened starts at the top of the list, its header in sight.
watch(() => ui.tab, (tab) => nextTick(() => {
  const body = bodyEl.value;
  const fold = tab ? body?.querySelector(`[data-sve-theme-fold="${tab}"]`) : null;

  if (fold) {
    body.scrollTop = fold.offsetTop - body.firstElementChild.offsetTop;
  }
}));
</script>
