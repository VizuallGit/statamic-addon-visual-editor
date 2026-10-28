<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import { moveKey } from '../../lib/toolbar-groups.js';

// Top bar tab: one box per group, left to right as the bar draws them, one
// row per icon inside — drag the handle to move it (also into another group),
// the box to show or hide it, Open to press a hidden one. A group's own handle
// moves the group, its name is typed in place, × merges it into its neighbour.
// It is the mode Live Preview is in (`modeLabel`, said only to someone who has
// Build): only the icons the site gave that mode, and only the groups with
// some of them — places are counted among those, and lp-more-menu.js makes
// them places among all. The list is read off the toolbar itself, so a tool
// this user may not use — no button — is not in it. lp-more-menu.js owns every write (`on.*`); this keeps the rows in step,
// and reads the groups back after each structural write — storage decides.
const props = defineProps({
  label: { type: String, required: true },
  // 'Content' or 'Build'; '' for someone without Build.
  modeLabel: { type: String, default: '' },
  hint: { type: String, required: true },
  // Where the site says what each mode may have; '' for someone who may not edit it.
  editUrl: { type: String, default: '' },
  editLabel: { type: String, required: true },
  emptyLabel: { type: String, required: true },
  openLabel: { type: String, required: true },
  closeLabel: { type: String, required: true },
  showAllLabel: { type: String, required: true },
  dragLabel: { type: String, required: true },
  groupsResetLabel: { type: String, required: true },
  newGroupLabel: { type: String, required: true },
  groupNamePlaceholder: { type: String, required: true },
  // ":n" is filled with the group's place, from 1.
  groupUnnamedLabel: { type: String, required: true },
  groupMoveLabel: { type: String, required: true },
  // ":name" is filled with the group's name, or its unnamed label.
  groupDeleteLabel: { type: String, required: true },
  groupDropHint: { type: String, required: true },
  nameMax: { type: Number, required: true },
  on: { type: Object, required: true },
});

const groups = ref([]);
const grouped = ref(false);

function read() {
  const state = props.on.toolbarState();

  groups.value = state.groups.map((group) => ({ ...group, tools: group.tools.map((tool) => ({ ...tool })) }));
  grouped.value = state.grouped;
}

read();

const allTools = computed(() => groups.value.flatMap((group) => group.tools));
const anyHidden = computed(() => allTools.value.some((tool) => !tool.shown));

function setShown(key, value) {
  const row = allTools.value.find((tool) => tool.key === key);

  if (row) {
    row.shown = value;
  }

  props.on.toolbarShown(key, value);
}

function showAll() {
  allTools.value.forEach((tool) => {
    tool.shown = true;
  });
  props.on.toolbarShowAll();
}

const groupTitle = (group, at) => group.name.trim() || props.groupUnnamedLabel.replace(':n', String(at + 1));
const deleteTitle = (group, at) => props.groupDeleteLabel.replace(':name', groupTitle(group, at));

// ── Names: written on blur (Enter blurs), Escape puts the stored one back ──
function rename(group, event) {
  const name = event.target.value.trim();

  event.target.value = name;

  if (name === group.name) {
    return;
  }

  group.name = name;
  props.on.toolbarGroupRename(group.id, name);
}

function restoreName(group, event) {
  event.target.value = group.name;
  event.target.blur();
}

function removeGroup(id) {
  props.on.toolbarGroupDelete(id);
  read();
}

function resetGroups() {
  props.on.toolbarGroupsReset();
  read();
}

// ── The draft: a box to drop a tool into. Storage never holds an empty group,
// so it lives here until a tool lands in it and makes it a real one. ──
const draft = ref(null);
const draftEl = ref(null);
const draftInput = ref(null);

async function addDraft() {
  draft.value = { name: '' };
  await nextTick();
  draftInput.value?.focus();
}

// ── Moves: the local copy first, so a drag stays smooth, then one write ──

/**
 * Tool `key` into `target` (a group of the local copy) at `index` among its
 * other tools — the storage index, hidden tools included. A target with no
 * tools is not in storage (the draft, or a group a drag just emptied), so it
 * is made there anew at its place, under its name, and takes the new id.
 */
function place(key, target, index) {
  const from = groups.value.find((group) => group.tools.some((tool) => tool.key === key));
  const at = from.tools.findIndex((tool) => tool.key === key);

  if (from === target && at === index) {
    return false;
  }

  const stored = target.tools.length > 0;
  // Storage's groups as they are before the move: the ones that hold tools.
  const groupIndex = groups.value.slice(0, groups.value.indexOf(target)).filter((group) => group.tools.length).length;
  const [tool] = from.tools.splice(at, 1);

  target.tools.splice(Math.min(index, target.tools.length), 0, tool);

  if (stored) {
    props.on.toolbarMove(key, target.id, index);
  } else {
    target.id = props.on.toolbarMoveToNewGroup(key, groupIndex, target.name);
  }

  return true;
}

function reorderGroup(id, index) {
  const ids = groups.value.map((group) => group.id);
  const next = moveKey(ids, id, index);

  if (next.join() === ids.join()) {
    return false;
  }

  const byId = new Map(groups.value.map((group) => [group.id, group]));

  groups.value = next.map((item) => byId.get(item));
  props.on.toolbarGroupMove(id, next.indexOf(id));

  return true;
}

// ── Drag: the handle of a tool or of a group ────────────────────────────
// The places are read live on each move, leaving the dragged item out: the
// others only shift by its own size as it passes them, so the pointer stays on
// the same side of each and the target holds. A group a drag empties stays
// here as a box until the drag ends, so nothing jumps under the pointer.
// The window follows the pointer, not the handle: Vue moves the row's node as
// the rows swap, and a moved node loses a pointer capture.
const listEl = ref(null);
const dragged = ref(null);
let dragWin = null;

const isDragging = (kind, id) => dragged.value?.kind === kind && dragged.value.id === id;
const middle = (el) => {
  const box = el.getBoundingClientRect();

  return box.top + box.height / 2;
};

function startDrag(kind, id, event) {
  if (event.button !== 0) {
    return;
  }

  event.preventDefault();
  dragged.value = { kind, id };
  dragWin = event.currentTarget.ownerDocument.defaultView;
  dragWin.addEventListener('pointermove', drag);
  dragWin.addEventListener('pointerup', endDrag);
  dragWin.addEventListener('pointercancel', endDrag);
}

function drag(event) {
  if (dragged.value?.kind === 'tool') {
    dragTool(dragged.value.id, event.clientY);
  } else if (dragged.value?.kind === 'group') {
    dragGroup(dragged.value.id, event.clientY);
  }
}

// The box the pointer is in, or the closest one when it is between or past them.
function boxAt(boxes, y) {
  let best = null;
  let gap = Infinity;

  boxes.forEach((el, at) => {
    const box = el.getBoundingClientRect();
    const away = y < box.top ? box.top - y : y > box.bottom ? y - box.bottom : 0;

    if (away < gap) {
      gap = away;
      best = { el, at };
    }
  });

  return best;
}

function dragTool(key, y) {
  const boxes = [...listEl.value.querySelectorAll('[data-sve-toolbar-group-row]')];

  if (draftEl.value) {
    boxes.push(draftEl.value);
  }

  const hit = boxAt(boxes, y);

  if (!hit) {
    return;
  }

  if (hit.el === draftEl.value) {
    groups.value.push({ id: '', name: draft.value.name.trim(), tools: [] });
    draft.value = null;
    place(key, groups.value[groups.value.length - 1], 0);

    return;
  }

  const index = [...hit.el.querySelectorAll('[data-sve-toolbar-tool]')]
    .filter((row) => row.getAttribute('data-sve-toolbar-tool') !== key)
    .filter((row) => middle(row) < y).length;

  place(key, groups.value[hit.at], index);
}

function dragGroup(id, y) {
  const index = [...listEl.value.querySelectorAll('[data-sve-toolbar-group-row]')]
    .filter((el) => el.getAttribute('data-sve-toolbar-group-row') !== id)
    .filter((el) => middle(el) < y).length;

  reorderGroup(id, index);
}

function stopDrag() {
  const was = dragged.value !== null;

  dragged.value = null;
  dragWin?.removeEventListener('pointermove', drag);
  dragWin?.removeEventListener('pointerup', endDrag);
  dragWin?.removeEventListener('pointercancel', endDrag);
  dragWin = null;

  return was;
}

// Storage drops the groups the drag emptied: read it back once it is done.
function endDrag() {
  if (stopDrag()) {
    read();
  }
}

onBeforeUnmount(stopDrag);

// ── Arrow keys on a handle ──────────────────────────────────────────────
// A tool or group that changes box is a new node: the focus goes back to it.
async function refocus(selector) {
  await nextTick();
  listEl.value?.querySelector(selector)?.focus();
}

function nudgeTool(key, step) {
  const at = groups.value.findIndex((group) => group.tools.some((tool) => tool.key === key));
  const group = groups.value[at];
  const to = group.tools.findIndex((tool) => tool.key === key) + step;
  let moved = false;

  if (to >= 0 && to < group.tools.length) {
    moved = place(key, group, to);
  } else if (step < 0 && at > 0) {
    moved = place(key, groups.value[at - 1], groups.value[at - 1].tools.length);
  } else if (step > 0 && at < groups.value.length - 1) {
    moved = place(key, groups.value[at + 1], 0);
  }

  if (moved) {
    read();
    refocus(`[data-sve-toolbar-tool="${key}"] [data-sve-toolbar-drag]`);
  }
}

function nudgeGroup(id, step) {
  const at = groups.value.findIndex((group) => group.id === id);

  if (reorderGroup(id, at + step)) {
    read();
    refocus(`[data-sve-toolbar-group-row="${id}"] [data-sve-toolbar-group-drag]`);
  }
}
</script>

<template>
  <div class="sve-lp-settings__section is-tight">
    <div class="sve-lp-settings__line">
      <span class="sve-lp-settings__label" data-sve-toolbar-mode>{{ modeLabel ? `${label} · ${modeLabel}` : label }}</span>
      <a
        v-if="editUrl"
        class="sve-lp-settings__link"
        :href="editUrl"
        target="_blank"
        rel="noopener"
        data-sve-toolbar-modes-edit
      >{{ editLabel }} ↗</a>
      <button v-if="anyHidden" type="button" class="sve-lp-settings__small" data-sve-toolbar-all @click="showAll">
        {{ showAllLabel }}
      </button>
    </div>
    <p v-if="!allTools.length" class="sve-lp-settings__hint">{{ emptyLabel }}</p>
    <div v-else ref="listEl" class="sve-lp-settings__groups">
      <div
        v-for="(group, at) in groups"
        :key="group.id"
        class="sve-lp-settings__group"
        :class="{ 'is-dragging': isDragging('group', group.id) }"
        role="group"
        :aria-label="groupTitle(group, at)"
        :data-sve-toolbar-group-row="group.id"
      >
        <div class="sve-lp-settings__group-head">
          <button
            type="button"
            class="sve-lp-settings__handle"
            :title="groupMoveLabel"
            :aria-label="groupMoveLabel + ': ' + groupTitle(group, at)"
            data-sve-toolbar-group-drag
            @pointerdown="startDrag('group', group.id, $event)"
            @keydown.up.prevent="nudgeGroup(group.id, -1)"
            @keydown.down.prevent="nudgeGroup(group.id, 1)"
          >⠿</button>
          <input
            type="text"
            class="sve-lp-settings__group-name"
            :value="group.name"
            :placeholder="groupNamePlaceholder"
            :maxlength="nameMax"
            :aria-label="groupNamePlaceholder"
            data-sve-toolbar-group-name
            @blur="rename(group, $event)"
            @keydown.enter.prevent="$event.target.blur()"
            @keydown.escape.stop.prevent="restoreName(group, $event)"
          >
          <button
            v-if="groups.length > 1"
            type="button"
            class="sve-lp-settings__group-x"
            :title="deleteTitle(group, at)"
            :aria-label="deleteTitle(group, at)"
            data-sve-toolbar-group-delete
            @click="removeGroup(group.id)"
          >×</button>
        </div>
        <p v-if="!group.tools.length" class="sve-lp-settings__group-hint">{{ groupDropHint }}</p>
        <div
          v-for="tool in group.tools"
          :key="tool.key"
          class="sve-lp-settings__tool"
          :class="{ 'is-off': !tool.shown, 'is-dragging': isDragging('tool', tool.key) }"
          :data-sve-toolbar-tool="tool.key"
        >
          <button
            type="button"
            class="sve-lp-settings__handle"
            :title="dragLabel"
            :aria-label="dragLabel + ': ' + tool.label"
            data-sve-toolbar-drag
            @pointerdown="startDrag('tool', tool.key, $event)"
            @keydown.up.prevent="nudgeTool(tool.key, -1)"
            @keydown.down.prevent="nudgeTool(tool.key, 1)"
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
      <div
        v-if="draft"
        ref="draftEl"
        class="sve-lp-settings__group is-draft"
        role="group"
        :aria-label="groupTitle(draft, groups.length)"
        data-sve-toolbar-group-draft
      >
        <div class="sve-lp-settings__group-head">
          <span class="sve-lp-settings__group-spacer" aria-hidden="true"></span>
          <input
            ref="draftInput"
            v-model="draft.name"
            type="text"
            class="sve-lp-settings__group-name"
            :placeholder="groupNamePlaceholder"
            :maxlength="nameMax"
            :aria-label="groupNamePlaceholder"
            data-sve-toolbar-group-draft-name
            @keydown.enter.prevent
            @keydown.escape.stop.prevent="draft = null"
          >
          <button
            type="button"
            class="sve-lp-settings__group-x"
            :title="deleteTitle(draft, groups.length)"
            :aria-label="deleteTitle(draft, groups.length)"
            data-sve-toolbar-group-draft-cancel
            @click="draft = null"
          >×</button>
        </div>
        <p class="sve-lp-settings__group-hint">{{ groupDropHint }}</p>
      </div>
      <button
        v-else
        type="button"
        class="sve-lp-settings__pill is-add sve-lp-settings__group-new"
        data-sve-toolbar-group-new
        @click="addDraft"
      >+ {{ newGroupLabel }}</button>
    </div>
    <div v-if="allTools.length" class="sve-lp-settings__line">
      <span class="sve-lp-settings__hint">{{ hint }}</span>
      <button v-if="grouped" type="button" class="sve-lp-settings__small" data-sve-toolbar-groups-reset @click="resetGroups">
        {{ groupsResetLabel }}
      </button>
    </div>
  </div>
</template>
