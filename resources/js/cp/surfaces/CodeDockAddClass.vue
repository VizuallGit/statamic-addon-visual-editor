<script setup>
import { nextTick, onMounted, ref } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  placeholder: { type: String, default: '' },
  initial: { type: String, default: '' },
  onAdd: { type: Function, required: true },
});

const value = ref(props.initial || '');
const input = ref(null);

onMounted(() => nextTick(() => {
  input.value?.focus();
  input.value?.select();
}));

function submit() {
  const next = value.value.trim();

  if (!next) {
    input.value?.focus();
    return;
  }

  props.onAdd(next);
}
</script>

<template>
  <label data-sve-css-add-label>{{ label }}</label>
  <input
    ref="input"
    data-sve-css-add-input
    v-model="value"
    type="text"
    :placeholder="placeholder"
    @keydown.enter.prevent="submit"
    @keydown.escape.stop
  >
</template>
