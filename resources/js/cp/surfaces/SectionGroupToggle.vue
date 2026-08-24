<script setup>
defineProps({
  groups: { type: Array, required: true },
  onPick: { type: Function, required: true },
});
</script>

<template>
  <div data-sve-section-track>
    <button
      v-for="group in groups"
      :key="group.key"
      type="button"
      :data-sve-section-seg="group.key"
      @click.prevent.stop="onPick(group.key)"
    >
      <span data-sve-seg-icon></span>
      <span>{{ group.label }}</span>
    </button>
  </div>
</template>
