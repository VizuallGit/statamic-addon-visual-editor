<script setup>
defineProps({
  chrome: { type: String, required: true },
});
</script>

<template>
  <div data-sve-right-resize></div>
  <div data-sve-right-slot></div>
</template>
