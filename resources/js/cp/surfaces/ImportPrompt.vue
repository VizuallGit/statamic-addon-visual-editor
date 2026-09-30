<script setup>
/**
 * Paste markup from somewhere else and make a section of it.
 *
 * The HTML field is the dialog — the other two are folded away, because most
 * pastes are a block of markup and nothing else. CSS and JS open when there is
 * something to put in them.
 *
 * The switch above them is the one question the markup cannot answer: a class
 * called `card` is either a utility or a name the site styles itself, and
 * which one decides whether it goes in the brackets and whether the pasted
 * stylesheet is scoped to the section. Tailwind is the common case, so it
 * starts there.
 */
import { nextTick, onMounted, ref } from 'vue';

const props = defineProps({
  heading: { type: String, required: true },
  nameLabel: { type: String, required: true },
  namePlaceholder: { type: String, default: '' },
  htmlLabel: { type: String, required: true },
  htmlPlaceholder: { type: String, default: '' },
  modeLabel: { type: String, required: true },
  tailwindLabel: { type: String, required: true },
  cssModeLabel: { type: String, required: true },
  modeNote: { type: String, default: '' },
  cssNote: { type: String, default: '' },
  addCssLabel: { type: String, required: true },
  addJsLabel: { type: String, required: true },
  cssLabel: { type: String, required: true },
  jsLabel: { type: String, required: true },
  cancelLabel: { type: String, required: true },
  saveLabel: { type: String, required: true },
  onOk: { type: Function, required: true },
  onClose: { type: Function, required: true },
});

const name = ref('');
const html = ref('');
const css = ref('');
const js = ref('');
const mode = ref('tailwind');
const showCss = ref(false);
const showJs = ref(false);
const nameInput = ref(null);
const htmlInput = ref(null);
const cssInput = ref(null);
const jsInput = ref(null);
const busy = ref(false);

onMounted(() => nextTick(() => nameInput.value?.focus()));

function openCss() {
  showCss.value = true;
  nextTick(() => cssInput.value?.focus());
}

function openJs() {
  showJs.value = true;
  nextTick(() => jsInput.value?.focus());
}

function submit() {
  const title = name.value.trim();
  const markup = html.value.trim();

  if (!title) {
    nameInput.value?.focus();

    return;
  }

  if (!markup) {
    htmlInput.value?.focus();

    return;
  }

  // Held while the files are written, so a second Enter cannot start a second
  // section under the same name.
  busy.value = true;

  props.onOk({
    display: title,
    html: markup,
    css: showCss.value ? css.value : '',
    js: showJs.value ? js.value : '',
    mode: mode.value,
  });
}

function onOverlay(event) {
  if (event.target === event.currentTarget) {
    props.onClose();
  }
}

/**
 * Escape closes. Enter submits from the name, never from the code fields —
 * a newline is what Enter means in markup.
 */
function onKey(event) {
  if (event.key === 'Escape') {
    props.onClose();
  }
}

function onNameKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    submit();
  } else {
    onKey(event);
  }
}
</script>

<template>
  <div class="sve-dialog-overlay" @click="onOverlay" @keydown="onKey">
    <div class="sve-dialog" @click.stop>
      <div class="sve-dialog__title">{{ heading }}</div>

      <label for="sve-import-name">{{ nameLabel }}</label>
      <input
        id="sve-import-name"
        ref="nameInput"
        v-model="name"
        type="text"
        :placeholder="namePlaceholder"
        data-sve-import-name
        @keydown="onNameKey"
      >

      <span class="sve-dialog__label">{{ modeLabel }}</span>
      <div class="sve-import__modes" role="group" :aria-label="modeLabel">
        <button
          type="button"
          :class="{ 'is-on': mode === 'tailwind' }"
          :aria-pressed="mode === 'tailwind' ? 'true' : 'false'"
          data-sve-import-mode="tailwind"
          @click="mode = 'tailwind'"
        >{{ tailwindLabel }}</button>
        <button
          type="button"
          :class="{ 'is-on': mode === 'css' }"
          :aria-pressed="mode === 'css' ? 'true' : 'false'"
          data-sve-import-mode="css"
          @click="mode = 'css'"
        >{{ cssModeLabel }}</button>
      </div>
      <p v-if="mode === 'css' ? cssNote : modeNote" class="sve-dialog__note">
        {{ mode === 'css' ? cssNote : modeNote }}
      </p>

      <label for="sve-import-html">{{ htmlLabel }}</label>
      <textarea
        id="sve-import-html"
        ref="htmlInput"
        v-model="html"
        rows="9"
        spellcheck="false"
        :placeholder="htmlPlaceholder"
        data-sve-import-html
        @keydown="onKey"
      ></textarea>

      <template v-if="showCss">
        <label for="sve-import-css">{{ cssLabel }}</label>
        <textarea
          id="sve-import-css"
          ref="cssInput"
          v-model="css"
          rows="5"
          spellcheck="false"
          data-sve-import-css
          @keydown="onKey"
        ></textarea>
      </template>

      <template v-if="showJs">
        <label for="sve-import-js">{{ jsLabel }}</label>
        <textarea
          id="sve-import-js"
          ref="jsInput"
          v-model="js"
          rows="5"
          spellcheck="false"
          data-sve-import-js
          @keydown="onKey"
        ></textarea>
      </template>

      <div class="sve-import__adders">
        <button v-if="!showCss" type="button" class="is-add-pane" data-sve-import-add-css @click="openCss">{{ addCssLabel }}</button>
        <button v-if="!showJs" type="button" class="is-add-pane" data-sve-import-add-js @click="openJs">{{ addJsLabel }}</button>
      </div>

      <div class="sve-dialog__actions">
        <button type="button" class="is-cancel" :disabled="busy" @click="onClose">{{ cancelLabel }}</button>
        <button type="button" class="is-primary" :disabled="busy" data-sve-import-ok @click="submit">{{ saveLabel }}</button>
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
/* Wider than the dialogs that ask for a name: this one is read as markup, and
   wrapped lines are what make pasted HTML unreadable. Capped against the
   window so it still fits a laptop with the dock open. */
.sve-dialog {
  width: 42rem;
  max-width: 92vw;
  max-height: 88vh;
  overflow-y: auto;
  background: var(--theme-color-content-bg, #fff);
  color: currentColor;
  border-radius: 0.25rem;
  padding: 1.25em;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
.sve-dialog__title {
  font-size: 1.07em;
  font-weight: 600;
  margin-bottom: 0.9em;
}
label,
.sve-dialog__label {
  display: block;
  font-size: 0.86em;
  font-weight: 500;
  margin-bottom: 0.36em;
}
input[type='text'],
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.6em 0.7em;
  border-radius: 0.25rem;
  border: 1px solid rgba(128, 128, 128, 0.4);
  background: transparent;
  color: currentColor;
  font-size: 1em;
  margin-bottom: 1em;
}
input[type='text'] {
  height: 2.6em;
  padding: 0 0.7em;
}
textarea {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.82em;
  line-height: 1.55;
  resize: vertical;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
}
/* The one question the markup cannot answer, so it sits above the paste and
   not below it: two halves of one control, the chosen one lit. */
.sve-import__modes {
  display: flex;
  gap: 0.25em;
  padding: 0.25em;
  margin-bottom: 0.7em;
  border-radius: 0.25rem;
  background: rgba(128, 128, 128, 0.16);
}
.sve-import__modes button {
  flex: 1 1 0;
  text-align: center;
  padding: 0.5em 0.8em;
  border-radius: 0.25rem;
  font-size: 0.9em;
  opacity: 0.65;
}
.sve-import__modes button.is-on {
  background: var(--theme-color-content-bg, #fff);
  font-weight: 600;
  opacity: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
}
.sve-import__adders {
  display: flex;
  gap: 0.5em;
  margin-bottom: 1.1em;
}
/* Same grey as Annullér below: they are the dialog's two quiet buttons, and
   one of them sitting a shade lighter read as the lesser of the two. */
button.is-add-pane {
  padding: 0.42em 0.85em;
  border-radius: 0.25rem;
  font-size: 0.86em;
  background: rgba(160, 160, 160, 0.32);
  opacity: 1;
}
button.is-add-pane:hover {
  background: rgba(160, 160, 160, 0.45);
}
.sve-dialog__note {
  margin: -0.2em 0 1.1em;
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
  border-radius: 0.25rem;
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
