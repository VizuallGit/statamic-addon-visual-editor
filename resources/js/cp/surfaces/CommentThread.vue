<script setup>
import { ref } from 'vue';

const props = defineProps({
  theme: { type: Object, required: true },
  threadId: { type: String, required: true },
  zIndex: { type: Number, default: 40 },
  title: { type: String, required: true },
  isDraft: { type: Boolean, default: false },
  resolved: { type: Boolean, default: false },
  sectionLabel: { type: String, required: true },
  sectionOptions: { type: Array, required: true },
  sectionValue: { type: String, default: '__page' },
  messages: { type: Array, default: () => [] },
  placeholder: { type: String, required: true },
  draftBody: { type: String, default: '' },
  submitLabel: { type: String, required: true },
  resolveLabel: { type: String, default: '' },
  deleteLabel: { type: String, default: '' },
  cancelLabel: { type: String, default: '' },
  onClose: { type: Function, required: true },
  onAssign: { type: Function, required: true },
  onSend: { type: Function, required: true },
  onResolve: { type: Function, default: null },
  onDelete: { type: Function, default: null },
  onCancel: { type: Function, default: null },
  onDraftInput: { type: Function, default: null },
});

const body = ref(props.draftBody || '');

function stop(event) {
  event.stopPropagation();
}

function send() {
  props.onSend(body.value);
}

function onInput(value) {
  body.value = value;
  props.onDraftInput?.(value);
}
</script>

<template>
  <div
    class="sve-thread"
    :style="{
      background: theme.card,
      color: theme.text,
      colorScheme: theme.scheme,
      borderRadius: theme.radius,
    }"
    @pointerdown="stop"
    @mousedown="stop"
    @click="stop"
    @keydown="stop"
  >
    <header :style="{ borderBottomColor: theme.line }">
      <strong>{{ title }}</strong>
      <button type="button" @click="onClose">×</button>
    </header>
    <div class="sve-thread__section">
      <label>{{ sectionLabel }}</label>
      <select
        :value="sectionValue"
        :style="{
          borderColor: theme.inputBorder,
          background: theme.input,
          color: 'inherit',
          colorScheme: theme.scheme,
          borderRadius: theme.radius,
        }"
        @mousedown="stop"
        @pointerdown="stop"
        @change="onAssign($event.target.value)"
      >
        <option v-for="opt in sectionOptions" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
      </select>
    </div>
    <div v-if="!isDraft" class="sve-thread__messages">
      <div v-for="(message, i) in messages" :key="i">
        <div class="sve-thread__who">
          <span>{{ message.author }}</span>
          <span>{{ message.time }}</span>
        </div>
        <p>{{ message.body }}</p>
      </div>
    </div>
    <form class="sve-thread__form" :style="{ borderTopColor: theme.line }" @submit.prevent>
      <textarea
        :placeholder="placeholder"
        :value="body"
        required
        :style="{
          borderColor: theme.inputBorder,
          borderRadius: theme.radius,
          background: theme.input,
        }"
        @mousedown="(e) => { stop(e); if (document.activeElement !== e.currentTarget) { e.preventDefault(); e.currentTarget.focus(); } }"
        @pointerdown="stop"
        @keydown="stop"
        @input="onInput($event.target.value)"
      ></textarea>
      <div class="sve-thread__actions">
        <button type="button" class="is-primary" :style="{ background: theme.primary, borderRadius: theme.radius }" @click="send">
          {{ submitLabel }}
        </button>
        <button
          v-if="!isDraft"
          type="button"
          :style="{ background: theme.ghost, borderRadius: theme.radius }"
          @click="onResolve"
        >
          {{ resolveLabel }}
        </button>
        <button
          v-if="!isDraft"
          type="button"
          :style="{ background: theme.ghost, borderRadius: theme.radius }"
          @click="onDelete"
        >
          {{ deleteLabel }}
        </button>
        <button
          v-if="isDraft"
          type="button"
          :style="{ background: theme.ghost, borderRadius: theme.radius }"
          @click="onCancel"
        >
          {{ cancelLabel }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.sve-thread {
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.22);
  pointer-events: auto;
  overflow: hidden;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px 8px;
  border-bottom: 1px solid;
}
header strong {
  font-size: 13px;
}
header button {
  all: unset;
  cursor: pointer;
  opacity: 0.55;
  font-size: 16px;
  padding: 0 4px;
}
.sve-thread__section {
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
label {
  font-size: 10px;
  font-weight: 650;
  opacity: 0.55;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
select {
  box-sizing: border-box;
  display: block;
  width: 100%;
  font: inherit;
  font-size: 12px;
  padding: 6px 8px;
  border: 1px solid;
  cursor: pointer;
}
.sve-thread__messages {
  max-height: 220px;
  overflow: auto;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sve-thread__who {
  display: flex;
  align-items: baseline;
}
.sve-thread__who span:first-child {
  font-size: 11px;
  font-weight: 650;
}
.sve-thread__who span:last-child {
  font-size: 10px;
  opacity: 0.55;
  margin-left: 6px;
}
p {
  margin: 3px 0 0;
  font-size: 13px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}
.sve-thread__form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px 12px;
  border-top: 1px solid;
}
textarea {
  width: 100%;
  min-height: 64px;
  resize: vertical;
  border: 1px solid;
  padding: 8px;
  font: inherit;
  font-size: 13px;
  box-sizing: border-box;
  pointer-events: auto;
  color: inherit;
}
.sve-thread__actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.sve-thread__form button {
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 650;
  padding: 6px 10px;
  border: 0;
  pointer-events: auto;
  color: inherit;
}
.sve-thread__form button.is-primary {
  color: #fff;
}
</style>
