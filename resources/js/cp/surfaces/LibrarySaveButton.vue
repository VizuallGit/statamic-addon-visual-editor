<script setup>
defineProps({
  label: { type: String, required: true },
  onSave: { type: Function, required: true },
});
</script>

<template>
  <button type="button" class="sve-lib-save" @click="onSave">{{ label }}</button>
</template>

<style scoped>
.sve-lib-save {
  all: unset;
  cursor: pointer;
  display: block;
  width: 100%;
  box-sizing: border-box;
  column-span: all;
  break-inside: avoid;
  text-align: center;
  padding: 10px;
  margin: 0 0 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
}
</style>
