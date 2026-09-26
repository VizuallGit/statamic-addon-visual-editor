<template>
  <div class="sve-fontdlg-overlay" @mousedown.self="onClose">
    <div class="sve-theme sve-fontdlg" role="dialog" aria-modal="true" :aria-label="title" data-sve-font-dialog>
      <header class="sve-fontdlg__head">
        <span class="sve-fontdlg__title">{{ title }}</span>
        <!-- data-sve-close: ours, so the hider for Statamic's own Live Preview × leaves it alone. -->
        <button type="button" class="sve-theme__ghost" data-sve-close :title="ui.labels.panel_close" @click="onClose">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </header>

      <nav v-if="!detail" class="sve-theme__segments sve-fontdlg__sources" role="tablist">
        <button
          v-for="key in SOURCES"
          :key="key"
          type="button"
          role="tab"
          :class="{ 'is-on': source === key }"
          :aria-selected="source === key"
          :data-sve-font-source="key"
          @click="source = key"
        >{{ ui.labels[`fonts_source_${key}`] }}</button>
      </nav>

      <FontGoogle v-if="source === 'google'" :win="win" @detail="(name) => (detail = name)" @installed="done" />
      <FontUpload v-else-if="source === 'upload'" :win="win" @installed="done" />
      <FontAdobe v-else :win="win" @installed="done" />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import FontGoogle from './FontGoogle.vue';
import FontUpload from './FontUpload.vue';
import FontAdobe from './FontAdobe.vue';

/** Where a font comes from: Google's catalog, a file, an Adobe Fonts kit. */
const SOURCES = ['google', 'upload', 'adobe'];

const props = defineProps({
  win: { type: Object, required: true },
  onInstalled: { type: Function, required: true },
  onClose: { type: Function, required: true },
});

const source = ref('google');
/** The Google family being looked at, for the title; '' on the list. */
const detail = ref('');

const title = computed(() => (detail.value ? `${ui.labels.fonts_add} — ${detail.value}` : ui.labels.fonts_add));

function done(listing, message) {
  props.onInstalled(listing, message);
}

/** Escape closes the dialog, not Live Preview behind it. */
function onKey(event) {
  if (event.key === 'Escape') {
    event.stopPropagation();
    event.preventDefault();
    props.onClose();
  }
}

onMounted(() => props.win.document.addEventListener('keydown', onKey, true));
onBeforeUnmount(() => props.win.document.removeEventListener('keydown', onKey, true));
</script>
