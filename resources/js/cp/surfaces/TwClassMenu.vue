<script setup>
defineProps({
  title: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  removeLabel: { type: String, default: '' },
  onPick: { type: Function, required: true },
  onRemove: { type: Function, required: true },
});
</script>

<template>
  <div v-if="title" data-sve-tw-menu-title>{{ title }}</div>
  <div data-sve-tw-menu-list>
    <button
      v-for="option in options"
      :key="option.label"
      type="button"
      data-sve-tw-option
      :data-active="option.active ? '' : undefined"
      :title="option.css"
      @click.prevent.stop="onPick(option.label)"
    >
      <span data-sve-tw-tick>{{ option.active ? '✓' : '' }}</span>
      <span v-if="option.color" data-sve-tw-dot :style="{ background: option.color }"></span>
      <span data-sve-tw-label>{{ option.label }}</span>
    </button>
  </div>
  <button type="button" data-sve-tw-remove @click.prevent.stop="onRemove()">
    <span data-sve-tw-tick>✕</span>{{ removeLabel }}
  </button>
</template>
