<script setup>
defineProps({
  text: { type: String, required: true },
});
</script>

<template>
  <div class="sve-lib-empty">{{ text }}</div>
</template>

<style scoped>
.sve-lib-empty {
  padding: 30px 6px;
  text-align: center;
  opacity: 0.55;
  font-size: 12px;
  column-span: all;
  break-inside: avoid;
}
</style>
