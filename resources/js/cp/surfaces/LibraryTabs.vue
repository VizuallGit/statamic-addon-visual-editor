<script setup>
defineProps({
  tabs: { type: Array, required: true },
  onPick: { type: Function, required: true },
});
</script>

<template>
  <div class="sve-lib-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      :data-tab="tab.key"
      :class="{ 'is-on': tab.on }"
      @click="onPick(tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.sve-lib-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
button {
  all: unset;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: currentColor;
  opacity: 0.7;
  font-weight: 500;
}
button.is-on {
  background: rgba(128, 128, 128, 0.2);
  font-weight: 600;
  opacity: 1;
}
</style>
