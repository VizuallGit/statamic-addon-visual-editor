<script setup>
/**
 * Style, written as Tailwind or as CSS: the CSS mode demo's one door into the
 * panel (BuildPanel.vue). With the demo off this is BuildStyle and nothing
 * else, and with it on, Tailwind is still BuildStyle with its own port: the CSS
 * side is a chunk of its own (BuildStyleCss.vue), loaded the first time it is
 * chosen, and it brings its port with it.
 */
import { defineAsyncComponent, inject } from 'vue';
import BuildStyle from './BuildStyle.vue';
import { cssDemoOn, setStyleMode, styleMode } from '../../build-mode/css-mode/flag.js';

defineProps({
  node: { type: Object, required: true },
});

const port = inject('sveBuild');
const demo = cssDemoOn();
const BuildStyleCss = demo ? defineAsyncComponent(() => import('./BuildStyleCss.vue')) : null;
</script>

<template>
  <BuildStyle v-if="!demo" :node="node" />
  <template v-else>
    <div class="fg-seg" data-sve-style-mode-switch role="group" :aria-label="port.t('style_mode')">
      <button type="button" :aria-pressed="styleMode === 'tw'" data-sve-style-mode="tw" @click="setStyleMode('tw')">Tailwind</button>
      <button type="button" :aria-pressed="styleMode === 'css'" data-sve-style-mode="css" @click="setStyleMode('css')">CSS</button>
    </div>
    <BuildStyle v-if="styleMode === 'tw'" :node="node" />
    <BuildStyleCss v-else :node="node" />
  </template>
</template>
