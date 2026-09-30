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
  // A yes/no under the name, when the dialog has one to ask: shown with its
  // label, on to start with. Handed to onOk as the third argument.
  toggleLabel: { type: String, default: '' },
  toggleOn: { type: Boolean, default: true },
  cancelLabel: { type: String, required: true },
  saveLabel: { type: String, required: true },
  onOk: { type: Function, required: true },
  onClose: { type: Function, required: true },
  // A plus beside the group, when the dialog may make one: `onAddGroup(name)`
  // answers with `{ key, display }` (or null when it could not), and the new
  // group is selected at once.
  addGroupLabel: { type: String, default: '' },
  addGroupNameLabel: { type: String, default: '' },
  addGroupPlaceholder: { type: String, default: '' },
  onAddGroup: { type: Function, default: null },
});

const name = ref('');
const groupList = ref([...props.groups]);
const group = ref(props.groups[0]?.key ?? '');
const addingGroup = ref(false);
const groupName = ref('');
const groupInput = ref(null);
const groupBusy = ref(false);

function startAddGroup() {
  addingGroup.value = true;
  groupName.value = '';
  nextTick(() => groupInput.value?.focus());
}

function cancelAddGroup() {
  addingGroup.value = false;
  groupName.value = '';
  nextTick(() => input.value?.focus());
}

async function submitGroup() {
  const value = groupName.value.trim();

  if (!value || groupBusy.value || !props.onAddGroup) {
    groupInput.value?.focus();
    return;
  }

  groupBusy.value = true;

  const made = await props.onAddGroup(value);

  groupBusy.value = false;

  if (!made?.key) {
    groupInput.value?.focus();
    return;
  }

  if (!groupList.value.some((g) => g.key === made.key)) {
    groupList.value.push(made);
  }

  group.value = made.key;
  addingGroup.value = false;
  groupName.value = '';
  nextTick(() => input.value?.focus());
}

function onGroupKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitGroup();
  } else if (event.key === 'Escape') {
    event.stopPropagation();
    cancelAddGroup();
  }
}
const toggle = ref(props.toggleOn);
const input = ref(null);
const busy = ref(false);

onMounted(() => nextTick(() => input.value?.focus()));

function submit() {
  const value = name.value.trim();

  // A group only where there are groups to choose from — a static section
  // has none, it is in no library.
  if (!value || (groupList.value.length && !group.value) || busy.value) {
    input.value?.focus();
    return;
  }

  // The dialog stays up while the files are being written — three of them, on
  // a fieldset the whole site imports — so a second Enter cannot start a
  // second section with the same name.
  busy.value = true;

  props.onOk(value, group.value, toggle.value);
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

      <template v-if="groupList.length">
        <label for="sve-new-section-group">{{ groupLabel }}</label>
        <div class="sve-dialog__row">
          <select id="sve-new-section-group" v-model="group" :disabled="addingGroup" @keydown="onKey">
            <option v-for="g in groupList" :key="g.key" :value="g.key">{{ g.display }}</option>
          </select>
          <button
            v-if="onAddGroup && !addingGroup"
            type="button"
            class="is-add"
            :title="addGroupLabel"
            :aria-label="addGroupLabel"
            data-sve-new-group
            @click="startAddGroup"
          ><span aria-hidden="true">+</span></button>
        </div>
        <div v-if="addingGroup" class="sve-dialog__add-group">
          <label for="sve-new-section-group-name">{{ addGroupNameLabel || addGroupLabel }}</label>
          <div class="sve-dialog__row">
            <input
              id="sve-new-section-group-name"
              ref="groupInput"
              v-model="groupName"
              type="text"
              :placeholder="addGroupPlaceholder"
              :disabled="groupBusy"
              data-sve-new-group-name
              @keydown="onGroupKey"
            >
            <button type="button" class="is-primary is-small" :disabled="groupBusy" data-sve-new-group-create @click="submitGroup">{{ saveLabel }}</button>
            <button type="button" class="is-cancel is-small" :disabled="groupBusy" @click="cancelAddGroup">{{ cancelLabel }}</button>
          </div>
        </div>
      </template>

      <label for="sve-new-section-name">{{ nameLabel }}</label>
      <input
        id="sve-new-section-name"
        ref="input"
        v-model="name"
        type="text"
        :placeholder="placeholder"
        @keydown="onKey"
      >

      <label v-if="toggleLabel" class="sve-dialog__toggle">
        <input v-model="toggle" type="checkbox" @keydown="onKey">
        <span>{{ toggleLabel }}</span>
      </label>

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
.sve-dialog__row {
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.sve-dialog__row select,
.sve-dialog__row input[type='text'] {
  flex: 1 1 auto;
  min-width: 0;
}
/* Everything in a row stands as tall as the field beside it (2.6em at the
   dialog's size): the plus next to the select, Create and Cancel next to the
   group's name. The buttons keep their smaller type, so their height is
   scaled back up to the field's. */
.sve-dialog__row > button {
  flex: 0 0 auto;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1em;
}
button.is-add {
  width: 2.6em;
  height: 2.6em;
  padding: 0;
  font-size: 1em;
  line-height: 1;
  border: 0;
  background: rgba(100, 116, 145, 0.45);
  opacity: 1;
}
button.is-add span {
  font-size: 1.3em;
  line-height: 1;
}
button.is-add:hover {
  background: rgba(100, 116, 145, 0.65);
}
button.is-small {
  padding: 0 0.95em;
  font-size: 0.93em;
  height: calc(2.6em / 0.93);
  line-height: 1;
}
.sve-dialog__toggle {
  display: flex;
  align-items: center;
  gap: 0.55em;
  margin: -0.2em 0 1em;
  font-weight: 400;
  cursor: pointer;
}
.sve-dialog__toggle input {
  margin: 0;
  width: 1em;
  height: 1em;
  accent-color: var(--theme-color-primary, #4f46e5);
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
