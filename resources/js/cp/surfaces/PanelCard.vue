<script setup>
defineProps({
  panelKey: { type: String, required: true },
  groupKey: { type: String, required: true },
  label: { type: String, required: true },
  iconName: { type: String, default: '' },
  onToggle: { type: Function, required: true },
});
</script>

<template>
  <button type="button" data-sve-panel-head @click.prevent.stop="onToggle">
    <span data-sve-panel-icon-slot></span>
    <span data-sve-panel-title>{{ label }}</span>
    <span data-sve-panel-tile>
      <svg data-sve-chevron viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </span>
  </button>
  <div data-sve-panel-body></div>
</template>
