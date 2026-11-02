<script setup>
/**
 * Style, written as Tailwind or as CSS, the one door into the panel
 * (BuildPanel.vue). The CSS side is a chunk of its own (BuildStyleCss.vue), loaded
 * the first time it is chosen, and it brings its port with it.
 */
import { defineAsyncComponent, provide } from 'vue';
import BuildStyle from './BuildStyle.vue';
import BuildStyleSwitch from './BuildStyleSwitch.vue';
import { styleMode } from '../../build-mode/css-mode/flag.js';

defineProps({
  node: { type: Object, required: true },
});

// A field's own reset and a colour's alpha (BuildFieldReset.vue, BuildFieldAlpha.vue), in both modes.
provide('sveFieldReset', true);

const BuildStyleCss = defineAsyncComponent(() => import('./BuildStyleCss.vue'));
</script>

<template>
  <BuildStyleSwitch v-if="styleMode === 'tw'" />
  <BuildStyle v-if="styleMode === 'tw'" :node="node" />
  <BuildStyleCss v-else :node="node" />
</template>
