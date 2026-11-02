<script setup>
/**
 * Style, written as Tailwind or as CSS: the CSS mode demo's one door into the
 * panel (BuildPanel.vue). With the demo off this is BuildStyle and nothing
 * else, and with it on, Tailwind is still BuildStyle with its own port: the CSS
 * side is a chunk of its own (BuildStyleCss.vue), loaded the first time it is
 * chosen, and it brings its port with it.
 */
import { defineAsyncComponent, provide } from 'vue';
import BuildStyle from './BuildStyle.vue';
import { cssDemoOn, styleMode } from '../../build-mode/css-mode/flag.js';

defineProps({
  node: { type: Object, required: true },
});

const demo = cssDemoOn();

// A field's own reset (BuildFieldReset.vue), in either mode, while the demo is on.
provide('sveFieldReset', demo);
const BuildStyleCss = demo ? defineAsyncComponent(() => import('./BuildStyleCss.vue')) : null;
const BuildStyleSwitch = demo ? defineAsyncComponent(() => import('./BuildStyleSwitch.vue')) : null;
</script>

<template>
  <BuildStyle v-if="!demo" :node="node" />
  <template v-else>
    <BuildStyleSwitch v-if="styleMode === 'tw'" />
    <BuildStyle v-if="styleMode === 'tw'" :node="node" />
    <BuildStyleCss v-else :node="node" />
  </template>
</template>
