<script setup>
import { computed, nextTick, ref } from 'vue';
import { NONE, comboFromEvent, formatCombo, isLocked } from '../../lib/shortcuts.js';
import { t } from '../../lib/i18n.js';

// One keyboard shortcut, recorded by pressing it. A click starts recording;
// the next keypress with ⌘, ⌃ or ⌥ (Ctrl or Alt elsewhere) is the shortcut.
// Esc cancels, Backspace or Delete records "none". A locked one is refused
// with a note; one another action has asks to move it here when the parent
// can (`owner` says), and names the other otherwise. With no shortcut of its
// own the field shows the inherited one greyed out; ↺ goes back to it.
//
// Used by the ⋮ menu's Shortcuts tab, the new-size popover and the settings
// screen's fieldtypes — on a dark menu and on the Control Panel's own
// surface, so everything is drawn in currentColor. The parent writes; this
// only reports `change(value, moveFrom)`: value '' (inherit), 'none' or a
// shortcut, and the action that gives its shortcut up, if any. The strings
// are read here, so every parent gets the same words.
const props = defineProps({
  // This layer's own: '' follows `inherited`, 'none' has none, else a shortcut.
  value: { type: String, default: '' },
  // What applies without this layer's own.
  inherited: { type: String, default: '' },
  mac: { type: Boolean, default: false },
  locked: { type: Array, default: () => [] },
  // (combo) => { action, label, movable } | null — another action that has it.
  owner: { type: Function, default: () => null },
  // The action's name, for screen readers.
  label: { type: String, default: '' },
});

const emit = defineEmits(['change']);

const ONLY_MODIFIER = ['Shift', 'Control', 'Alt', 'Meta', 'AltGraph', 'OS'];

const keyEl = ref(null);
const recording = ref(false);
const note = ref('');
// { combo, other } while asking whether to move it here.
const asking = ref(null);

const say = (key, replacements) => t(window, key, replacements);

const shown = computed(() => {
  if (recording.value) {
    return { text: say('shortcut_recording'), quiet: false, struck: false };
  }

  if (props.value === NONE) {
    // None over an inherited one: that one, struck through.
    return props.inherited
      ? { text: formatCombo(props.inherited, props.mac), quiet: true, struck: true }
      : { text: say('shortcut_none'), quiet: true, struck: false };
  }

  if (props.value) {
    return { text: formatCombo(props.value, props.mac), quiet: false, struck: false };
  }

  return props.inherited
    ? { text: formatCombo(props.inherited, props.mac), quiet: true, struck: false }
    : { text: say('shortcut_none'), quiet: true, struck: false };
});

const resetTitle = computed(() =>
  props.inherited ? say('shortcut_reset', { combo: formatCombo(props.inherited, props.mac) }) : say('shortcut_reset_none')
);

async function focusKey() {
  await nextTick();
  keyEl.value?.focus();
}

function start() {
  if (recording.value) {
    return;
  }

  recording.value = true;
  note.value = '';
  asking.value = null;
  // Safari and Firefox on a Mac do not focus a button on click.
  focusKey();
}

function stop() {
  recording.value = false;
  note.value = '';
}

function finish(value, moveFrom = null) {
  stop();
  asking.value = null;
  emit('change', value, moveFrom);
}

function onKey(event) {
  if (!recording.value) {
    return;
  }

  // Tab still moves on, and stops recording on the way out.
  if (event.key === 'Tab' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    stop();

    return;
  }

  // Ours while recording: no shortcut runs and no field gets it.
  event.preventDefault();
  event.stopPropagation();

  if (event.repeat || ONLY_MODIFIER.includes(event.key)) {
    return;
  }

  const plain = !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;

  if (plain && event.key === 'Escape') {
    stop();

    return;
  }

  if (plain && (event.key === 'Backspace' || event.key === 'Delete')) {
    finish(NONE);

    return;
  }

  const combo = comboFromEvent(event, props.mac);

  if (!combo) {
    note.value = say(props.mac ? 'shortcut_need_modifier_mac' : 'shortcut_need_modifier');

    return;
  }

  if (isLocked(combo, props.locked)) {
    note.value = say('shortcut_locked', { combo: formatCombo(combo, props.mac) });

    return;
  }

  if (combo === props.value) {
    stop();

    return;
  }

  const other = props.owner(combo);

  if (other && !other.movable) {
    note.value = say('shortcut_used_elsewhere', { name: other.label });

    return;
  }

  if (other) {
    stop();
    asking.value = { combo, other };

    return;
  }

  finish(combo);
}

function moveHere() {
  finish(asking.value.combo, asking.value.other.action);
}

function keepThere() {
  asking.value = null;
  focusKey();
}
</script>

<template>
  <span class="sve-shortcut" :data-sve-shortcut-recording="recording ? '' : undefined">
    <button
      ref="keyEl"
      type="button"
      class="sve-shortcut__key"
      :class="{ 'is-quiet': shown.quiet, 'is-struck': shown.struck, 'is-recording': recording }"
      :title="say('shortcut_record_title')"
      :aria-label="label ? `${label}: ${shown.text}` : shown.text"
      data-sve-shortcut-key
      @click="start"
      @keydown="onKey"
      @blur="recording && stop()"
    >{{ shown.text }}</button>
    <button
      v-if="value && !recording && !asking"
      type="button"
      class="sve-shortcut__reset"
      :title="resetTitle"
      :aria-label="resetTitle"
      data-sve-shortcut-reset
      @click="finish('')"
    >↺</button>
    <span
      v-if="asking"
      class="sve-shortcut__note"
      role="alertdialog"
      :aria-label="say('shortcut_used_by', { name: asking.other.label })"
      data-sve-shortcut-ask
    >
      {{ say('shortcut_used_by', { name: asking.other.label }) }}
      <button type="button" class="sve-shortcut__choice is-primary" data-sve-shortcut-move @click="moveHere">{{ say('shortcut_move') }}</button>
      <button type="button" class="sve-shortcut__choice" @click="keepThere">{{ say('shortcut_cancel') }}</button>
    </span>
    <span v-else-if="note" class="sve-shortcut__note" role="status">{{ note }}</span>
  </span>
</template>

<style>
/* Not scoped, like the menus that use it: everything sits under .sve-shortcut.
   Drawn in currentColor, so it reads on the dark Live Preview menus and on
   the Control Panel's own surface alike. */
.sve-shortcut {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
  min-width: 0;
  max-width: 100%;
}
.sve-shortcut__key {
  all: unset;
  box-sizing: border-box;
  min-width: 3.5rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
  border-radius: 0.375rem;
  background: color-mix(in srgb, currentColor 6%, transparent);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.375rem;
  text-align: center;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
}
.sve-shortcut__key:hover {
  background: color-mix(in srgb, currentColor 12%, transparent);
}
.sve-shortcut__key:focus-visible,
.sve-shortcut__key.is-recording {
  outline: 0.125rem solid var(--theme-color-primary, #4f46e5);
  outline-offset: -0.0625rem;
}
.sve-shortcut__key.is-quiet {
  font-weight: 500;
  opacity: 0.5;
}
.sve-shortcut__key.is-struck {
  text-decoration: line-through;
}
.sve-shortcut__reset {
  all: unset;
  box-sizing: border-box;
  padding: 0 0.25rem;
  font-size: 0.8125rem;
  line-height: 1.5rem;
  opacity: 0.5;
  cursor: pointer;
}
.sve-shortcut__reset:hover,
.sve-shortcut__reset:focus-visible {
  opacity: 1;
}
.sve-shortcut__note {
  flex-basis: 100%;
  font-size: 0.6875rem;
  line-height: 1.35;
  text-align: right;
  opacity: 0.85;
}
.sve-shortcut__choice {
  all: unset;
  margin-left: 0.25rem;
  padding: 0.0625rem 0.375rem;
  border-radius: 0.25rem;
  background: color-mix(in srgb, currentColor 12%, transparent);
  font-weight: 600;
  cursor: pointer;
}
.sve-shortcut__choice.is-primary {
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
}
.sve-shortcut__choice:focus-visible {
  outline: 0.125rem solid var(--theme-color-primary, #4f46e5);
}
</style>
