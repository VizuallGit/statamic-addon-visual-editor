<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { moveKey } from '../../lib/toolbar-presets.js';

// Top bar tab: one row per icon, in the user's order — drag the handle to move
// it, the box to show or hide it, Open to press a hidden one. The presets sit
// on top of the menu (LpSettingsPresets.vue), and a switch remounts this tab
// with the icons the new preset shows. The list is read off the toolbar
// itself, so a tool this user may not use — no button — is not in it.
// lp-more-menu.js owns every write (`on.*`); this keeps the rows in step.
const props = defineProps({
  label: { type: String, required: true },
  hint: { type: String, required: true },
  emptyLabel: { type: String, required: true },
  openLabel: { type: String, required: true },
  closeLabel: { type: String, required: true },
  showAllLabel: { type: String, required: true },
  dragLabel: { type: String, required: true },
  orderResetLabel: { type: String, required: true },
  on: { type: Object, required: true },
});

const state = props.on.toolbarState();
const tools = ref(state.tools.map((tool) => ({ ...tool })));
const ordered = ref(state.ordered);

const anyHidden = computed(() => tools.value.some((tool) => !tool.shown));

function setShown(key, value) {
  const row = tools.value.find((tool) => tool.key === key);

  if (row) {
    row.shown = value;
  }

  props.on.toolbarShown(key, value);
}

function showAll() {
  tools.value.forEach((tool) => {
    tool.shown = true;
  });
  props.on.toolbarShowAll();
}

// ── Order: drag the handle, or arrow keys on it ─────────────────────────
const listEl = ref(null);
const dragging = ref('');
let slots = [];

function commitOrder() {
  ordered.value = true;
  props.on.toolbarOrder(tools.value.map((tool) => tool.key));
}

function moveTo(key, index) {
  const keys = moveKey(tools.value.map((tool) => tool.key), key, index);

  if (keys.join() === tools.value.map((tool) => tool.key).join()) {
    return false;
  }

  const byKey = new Map(tools.value.map((tool) => [tool.key, tool]));

  tools.value = keys.map((item) => byKey.get(item));

  return true;
}

// The rows' places are measured once, when the drag starts: they do not move
// while the rows inside them swap, so "which place is the pointer over" holds.
// The window follows the pointer, not the handle: Vue moves the row's node as
// the rows swap, and a moved node loses a pointer capture.
let dragWin = null;

function startDrag(key, event) {
  if (event.button !== 0) {
    return;
  }

  event.preventDefault();
  slots = [...(listEl.value?.querySelectorAll('[data-sve-toolbar-tool]') || [])].map((row) => {
    const box = row.getBoundingClientRect();

    return box.top + box.height / 2;
  });
  dragging.value = key;
  dragWin = event.currentTarget.ownerDocument.defaultView;
  dragWin.addEventListener('pointermove', drag);
  dragWin.addEventListener('pointerup', endDrag);
  dragWin.addEventListener('pointercancel', endDrag);
}

function drag(event) {
  if (!dragging.value) {
    return;
  }

  const index = slots.filter((middle) => middle < event.clientY).length;
  const at = tools.value.findIndex((tool) => tool.key === dragging.value);

  // Past its own middle counts the row itself; the place is one less going down.
  if (moveTo(dragging.value, index > at ? index - 1 : index)) {
    commitOrder();
  }
}

function endDrag() {
  dragging.value = '';
  dragWin?.removeEventListener('pointermove', drag);
  dragWin?.removeEventListener('pointerup', endDrag);
  dragWin?.removeEventListener('pointercancel', endDrag);
  dragWin = null;
}

onBeforeUnmount(endDrag);

function nudge(key, step) {
  const at = tools.value.findIndex((tool) => tool.key === key);

  if (moveTo(key, at + step)) {
    commitOrder();
  }
}

function resetOrder() {
  ordered.value = false;
  props.on.toolbarOrderReset();

  // The rows come back in the order the bar draws them, each as it was.
  const byKey = new Map(tools.value.map((tool) => [tool.key, tool]));

  tools.value = props.on.toolbarState().tools.map((tool) => byKey.get(tool.key) || { ...tool });
}
</script>

<template>
  <div class="sve-lp-settings__section is-tight">
    <div class="sve-lp-settings__line">
      <span class="sve-lp-settings__label">{{ label }}</span>
      <button v-if="anyHidden" type="button" class="sve-lp-settings__small" data-sve-toolbar-all @click="showAll">
        {{ showAllLabel }}
      </button>
    </div>
    <p v-if="!tools.length" class="sve-lp-settings__hint">{{ emptyLabel }}</p>
    <div ref="listEl" class="sve-lp-settings__tools">
      <div
        v-for="tool in tools"
        :key="tool.key"
        class="sve-lp-settings__tool"
        :class="{ 'is-off': !tool.shown, 'is-dragging': dragging === tool.key }"
        :data-sve-toolbar-tool="tool.key"
      >
        <button
          type="button"
          class="sve-lp-settings__handle"
          :title="dragLabel"
          :aria-label="dragLabel + ': ' + tool.label"
          data-sve-toolbar-drag
          @pointerdown="startDrag(tool.key, $event)"
          @keydown.up.prevent="nudge(tool.key, -1)"
          @keydown.down.prevent="nudge(tool.key, 1)"
        >⠿</button>
        <label class="sve-lp-settings__row" :title="tool.label">
          <input type="checkbox" :checked="tool.shown" @change="setShown(tool.key, $event.target.checked)">
          <span class="sve-lp-settings__tool-icon" aria-hidden="true" v-html="tool.icon"></span>
          <span class="sve-lp-settings__tool-name">{{ tool.label }}</span>
        </label>
        <button
          v-if="!tool.shown && tool.here"
          type="button"
          class="sve-lp-settings__small"
          data-sve-toolbar-open
          @click="on.toolbarOpen(tool.key)"
        >
          {{ tool.open ? closeLabel : openLabel }}
        </button>
      </div>
    </div>
    <div v-if="tools.length" class="sve-lp-settings__line">
      <span class="sve-lp-settings__hint">{{ hint }}</span>
      <button v-if="ordered" type="button" class="sve-lp-settings__small" data-sve-toolbar-order-reset @click="resetOrder">
        {{ orderResetLabel }}
      </button>
    </div>
  </div>
</template>
