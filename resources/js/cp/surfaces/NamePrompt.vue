<script setup>
import { nextTick, onMounted, ref } from 'vue';

const props = defineProps({
  heading: { type: String, required: true },
  nameLabel: { type: String, required: true },
  placeholder: { type: String, default: '' },
  // Renaming starts from the name you have; creating starts from nothing.
  value: { type: String, default: '' },
  cancelLabel: { type: String, required: true },
  saveLabel: { type: String, required: true },
  // More to ask beside the name, all optional: { key, label, placeholder, rows, options }.
  // Answered as onOk's second argument.
  extras: { type: Array, default: () => [] },
  onOk: { type: Function, required: true },
  onClose: { type: Function, required: true },
});

const name = ref(props.value);
const answers = ref({});
const input = ref(null);

onMounted(() =>
  nextTick(() => {
    input.value?.focus();
    input.value?.select();
  })
);

function submit() {
  const value = name.value.trim();

  if (!value) {
    input.value?.focus();
    return;
  }

  props.onOk(value, answers.value);
}

function onOverlay(event) {
  if (event.target === event.currentTarget) {
    props.onClose();
  }
}

function onKey(event) {
  if (event.key === 'Enter') {
    submit();
  } else if (event.key === 'Escape') {
    props.onClose();
  }
}
</script>

<template>
  <div class="sve-dialog-overlay" @click="onOverlay">
    <div class="sve-dialog" @click.stop>
      <div class="sve-dialog__title">{{ heading }}</div>
      <label>{{ nameLabel }}</label>
      <input ref="input" v-model="name" type="text" :placeholder="placeholder" @keydown="onKey">
      <template v-for="extra in extras" :key="extra.key">
        <label>{{ extra.label }}</label>
        <textarea v-if="extra.rows" v-model="answers[extra.key]" :rows="extra.rows" :placeholder="extra.placeholder"></textarea>
        <template v-else>
          <input v-model="answers[extra.key]" type="text" :placeholder="extra.placeholder" :list="`sve-prompt-${extra.key}`" @keydown="onKey">
          <datalist :id="`sve-prompt-${extra.key}`">
            <option v-for="option in extra.options || []" :key="option" :value="option"></option>
          </datalist>
        </template>
      </template>
      <div class="sve-dialog__actions">
        <button type="button" @click="onClose">{{ cancelLabel }}</button>
        <button type="button" class="is-primary" @click="submit">{{ saveLabel }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sve-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483600;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
}
.sve-dialog {
  width: 380px;
  max-width: 92vw;
  background: var(--theme-color-content-bg, #fff);
  color: currentColor;
  border-radius: 12px;
  padding: 20px;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
.sve-dialog__title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 14px;
}
label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 5px;
}
textarea,
input[type='text'] {
  width: 100%;
  box-sizing: border-box;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.4);
  background: transparent;
  color: currentColor;
  font-size: 14px;
  margin-bottom: 18px;
}
textarea {
  height: auto;
  padding: 8px 10px;
  resize: vertical;
}
.sve-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
button {
  all: unset;
  cursor: pointer;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  opacity: 0.75;
}
button.is-primary {
  padding: 7px 16px;
  font-weight: 600;
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
  opacity: 1;
}
</style>
