<script setup>
defineProps({
  chips: { type: Array, required: true },
  onPick: { type: Function, required: true },
});
</script>

<template>
  <div class="sve-lib-groups">
    <button
      v-for="chip in chips"
      :key="chip.key === '' ? '__all' : chip.key"
      type="button"
      :data-sve-group="chip.key"
      :class="{ 'is-on': chip.on }"
      @click="onPick(chip.key)"
    >
      {{ chip.label }}
    </button>
  </div>
</template>

<style scoped>
.sve-lib-groups {
  display: flex;
  gap: 6px;
}
button {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  white-space: nowrap;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  color: currentColor;
  background: rgba(128, 128, 128, 0.22);
  font-weight: 500;
}
button.is-on {
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
  font-weight: 600;
}
</style>
