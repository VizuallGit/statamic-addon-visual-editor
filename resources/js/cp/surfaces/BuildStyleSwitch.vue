<script setup>
/**
 * Style's `Tailwind | CSS`, with the icons and the words of the dock's own switch
 * (dock/style-modes.js). Part of the CSS mode demo: only loaded with the demo on.
 */
import { inject, onMounted } from 'vue';
import { CSS_MODE_ICON, TW_MODE_ICON } from '../../build-mode/css-mode/icons.js';
import { setStyleMode, styleMode } from '../../build-mode/css-mode/flag.js';
import look from '../../build-mode/css-mode/look.css?inline';

const port = inject('sveBuild');
const STYLE_ID = '__sve-css-mode-look';

onMounted(() => {
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');

    style.id = STYLE_ID;
    style.textContent = look;
    document.head.appendChild(style);
  }
});
</script>

<template>
  <div class="fg-seg" data-sve-style-mode-switch role="group" :aria-label="port.t('style_mode')">
    <button type="button" :aria-pressed="styleMode === 'tw'" :title="port.t('code_dock_style_to_tw')" data-sve-style-mode="tw" @click="setStyleMode('tw')"><span v-html="TW_MODE_ICON"></span>{{ port.t('code_dock_style_tw') }}</button>
    <button type="button" :aria-pressed="styleMode === 'css'" :title="port.t('code_dock_style_to_css')" data-sve-style-mode="css" @click="setStyleMode('css')"><span v-html="CSS_MODE_ICON"></span>{{ port.t('code_dock_css') }}</button>
  </div>
</template>
