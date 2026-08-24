<script setup>
defineProps({
  hint: { type: String, required: true },
});
</script>

<template>
  <div class="sve-listview-body">
    <div class="sve-pane-hint">{{ hint }}</div>
    <div data-sve-listview-list></div>
  </div>
</template>

<style scoped>
.sve-listview-body {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
.sve-pane-hint {
  padding: var(--sve-right-body-pad-block, 8px) 0 0;
  font-size: 11px;
  opacity: 0.6;
  flex: 0 0 auto;
}
[data-sve-listview-list] {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
</style>
