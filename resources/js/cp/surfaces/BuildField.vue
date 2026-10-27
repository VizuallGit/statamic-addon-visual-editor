<script setup>
/**
 * One field in the Figma look: a prefix inside the box (a letter — W, H — or
 * an icon), the value, and an optional suffix (Fill / Hug, a menu). The value
 * is whatever sits in the default slot, usually a BuildValueInput, drawn
 * frameless inside this box.
 */
import { ic } from '../../build-mode/icons.js';

defineProps({
  letter: { type: String, default: '' },
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
});
</script>

<template>
  <label class="fg-field" :title="title">
    <span v-if="letter" class="fg-pre is-letter">{{ letter }}</span>
    <span v-else-if="icon" class="fg-pre" v-html="ic(icon)"></span>
    <slot></slot>
    <span v-if="$slots.suffix" class="fg-suf"><slot name="suffix"></slot></span>
  </label>
</template>
