<script setup>
import { nextTick, onMounted, ref } from 'vue';

const props = defineProps({
  heading: { type: String, required: true },
  groupLabel: { type: String, required: true },
  nameLabel: { type: String, required: true },
  placeholder: { type: String, default: '' },
  note: { type: String, default: '' },
  // [{ key, display }] in the order the page-builder fieldset lists them, so
  // the picker reads the way the section library does.
  groups: { type: Array, required: true },
  cancelLabel: { type: String, required: true },
  saveLabel: { type: String, required: true },
  onOk: { type: Function, required: true },
  onClose: { type: Function, required: true },
});

const name = ref('');
const group = ref(props.groups[0]?.key ?? '');
const input = ref(null);
const busy = ref(false);

onMounted(() => nextTick(() => input.value?.focus()));

function submit() {
  const value = name.value.trim();

  if (!value || !group.value || busy.value) {
    input.value?.focus();
    return;
  }

  // The dialog stays up while the files are being written — three of them, on
  // a fieldset the whole site imports — so a second Enter cannot start a
  // second section with the same name.
  busy.value = true;

  props.onOk(value, group.value);
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

      <label for="sve-new-section-group">{{ groupLabel }}</label>
      <select id="sve-new-section-group" v-model="group" @keydown="onKey">
        <option v-for="g in groups" :key="g.key" :value="g.key">{{ g.display }}</option>
      </select>

      <label for="sve-new-section-name">{{ nameLabel }}</label>
      <input
        id="sve-new-section-name"
        ref="input"
        v-model="name"
        type="text"
        :placeholder="placeholder"
        @keydown="onKey"
      >

      <p v-if="note" class="sve-dialog__note">{{ note }}</p>

      <div class="sve-dialog__actions">
        <button type="button" class="is-cancel" :disabled="busy" @click="onClose">{{ cancelLabel }}</button>
        <button type="button" class="is-primary" :disabled="busy" @click="submit">{{ saveLabel }}</button>
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
  border-radius: 0.75em;
  padding: 1.25em;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
.sve-dialog__title {
  font-size: 1.07em;
  font-weight: 600;
  margin-bottom: 0.9em;
}
label {
  display: block;
  font-size: 0.86em;
  font-weight: 500;
  margin-bottom: 0.36em;
}
select,
input[type='text'] {
  width: 100%;
  box-sizing: border-box;
  height: 2.6em;
  padding: 0 0.7em;
  border-radius: 0.5em;
  border: 1px solid rgba(128, 128, 128, 0.4);
  background: transparent;
  color: currentColor;
  font-size: 1em;
  margin-bottom: 1em;
}
/* The browser's own arrow sits hard against the right edge and `padding-right`
   does not move it — that pads the text. So: our own chevron, placed where
   there is room to breathe. Grey rather than `currentColor`, which a
   background image cannot read; it carries in both a light and a dark panel. */
select {
  appearance: none;
  padding-right: 2.3em;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23919191' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.85em center;
  background-size: 0.85em;
}
.sve-dialog__note {
  margin: 0 0 1.1em;
  font-size: 0.8em;
  line-height: 1.45;
  opacity: 0.6;
}
.sve-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5em;
}
button {
  all: unset;
  cursor: pointer;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  font-size: 0.93em;
  opacity: 0.75;
}
button.is-cancel {
  background: rgba(160, 160, 160, 0.32);
  opacity: 1;
}
button.is-primary {
  padding: 0.5em 1.15em;
  font-weight: 600;
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
  opacity: 1;
}
button:disabled {
  cursor: default;
  opacity: 0.4;
}
</style>
