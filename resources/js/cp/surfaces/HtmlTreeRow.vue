<script setup>
import { canEditFields, currentSetHandle, openFieldsetOverlay } from '../../section-fields.js';
import { t } from '../../cp-t.js';

const FIELDS =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>';

const canFields = canEditFields(window);
const fieldsLabel = t(window, 'section_fields');

function onFields() {
  const handle = currentSetHandle();

  if (!handle) {
    window.Statamic?.$toast?.error(t(window, 'section_fields_none'));

    return;
  }

  openFieldsetOverlay(window, handle);
}

/**
 * One row in the HTML tree — a tag, or a section that has not been opened yet.
 *
 * Both, deliberately, and this is the whole point of the component: a section
 * used to be drawn by its own markup in HtmlTreeList, so the same section wore
 * one name, one mark and one highlight while shut and different ones once it
 * was open. Renaming it showed on one and not the other. There is one row, and
 * shut is a state of it.
 *
 * What a shut section cannot offer, it does not draw: there is no file loaded,
 * so nothing to rename, hide, duplicate or delete yet. That is the state
 * differing — not the row.
 */
import { htmlTreeUi as ui } from '../html-tree/store.js';

defineProps({
  row: { type: Object, required: true },
});

const TWIST =
  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

const EYE =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';

const EYE_OFF =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>';

const DUP =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>';

const DEL =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>';

function rowTitle(row) {
  if (row.kind === 'component') {
    return row.src ? `partial:${row.src}` : row.tag;
  }

  return row.name ? `${row.tag} ${row.name}` : row.tag;
}

/** A section nobody has opened yet: the same row, without a file behind it. */
function isShutSection(row) {
  return !!row.section;
}

function onRowClick(row) {
  if (isShutSection(row)) {
    ui.onSection?.(row.section);

    return;
  }

  ui.onSelect?.(row.id);
}

function rowBind(row) {
  const bind = { 'data-sve-ht-id': row.id };

  if (row.current) {
    bind['data-sve-ht-current'] = '';
  }

  if (row.hidden) {
    bind['data-sve-ht-hidden'] = '';
  }

  // Kept so the old stylesheet rules and the verify scripts still find a
  // section by name; it marks which state the row is in, nothing more.
  if (isShutSection(row)) {
    bind['data-sve-ht-sec'] = '';
  }

  if (!isShutSection(row) && ui.dropId === row.id && ui.dropPlace) {
    bind['data-sve-ht-drop'] = ui.dropPlace;
  }

  return bind;
}

function canHide(row) {
  return !row.hidden || row.wrapFrom != null;
}
</script>

<template>
  <div
    data-sve-ht-row
    v-bind="rowBind(row)"
    role="button"
    tabindex="0"
    :title="rowTitle(row)"
    :style="{ marginLeft: row.depth * 12 + 'px' }"
    @click="onRowClick(row)"
    @dblclick.prevent="isShutSection(row) ? null : ui.onRename?.(row.id)"
    @keydown.enter.prevent="onRowClick(row)"
    @keydown.space.prevent="onRowClick(row)"
    @pointerdown="isShutSection(row) ? null : ui.onPointerDown?.($event, row.id)"
    @contextmenu.prevent.stop="isShutSection(row) ? null : ui.onContext?.($event, row.id)"
  >
    <button
      v-if="row.hasChildren || row.emptyBlock"
      type="button"
      data-sve-ht-twist
      v-bind="row.shut ? { 'data-sve-ht-shut': '' } : {}"
      v-html="TWIST"
      @click.stop.prevent="isShutSection(row) ? ui.onSection?.(row.section) : ui.onTwist?.(row.id)"
      @pointerdown.stop
      @dblclick.stop
    ></button>
    <span v-if="row.letter" data-sve-ht-letter>{{ row.letter }}</span>
    <span v-else data-sve-ht-icon v-html="row.svg"></span>
    <span data-sve-ht-text :title="ui.renameTitle">
      <!--
        Only a real tag can be changed into another one. A loop, a condition and
        a component are not tags at all: offering `<div>` for `{{ collection }}`
        is offering to write something that cannot be written.
      -->
      <!--
        Double-click, not single. The tag sits in the middle of a row you click
        to select — a single click there kept opening a menu nobody asked for.
      -->
      <button
        v-if="!row.kind && !isShutSection(row)"
        type="button"
        data-sve-ht-tag
        :title="ui.tagTitle"
        @click.stop.prevent
        @pointerdown.stop
        @dblclick.stop.prevent="ui.onTagChange?.($event, row.id)"
      >{{ row.tag }}</button>
      <!--
        Shut, the tag is not a button: there is no file open to rename it in.
        Same chip, same place, same words — only the door is closed.
      -->
      <span v-else data-sve-ht-kind>{{ row.tag }}</span>

      <input
        v-if="ui.editingId === row.id && !isShutSection(row)"
        data-sve-ht-rename
        v-model="ui.draft"
        @mousedown.stop
        @pointerdown.stop
        @click.stop
        @dblclick.stop
        @keydown.stop
        @keydown.enter.prevent="ui.onRenameCommit?.()"
        @keydown.escape.prevent="ui.onRenameCancel?.()"
        @blur="ui.onRenameCommit?.()"
      >
      <span v-else data-sve-ht-name>{{ row.name }}</span>
    </span>
    <span v-if="ui.canEdit && !isShutSection(row)" data-sve-ht-actions>
      <button
        v-if="ui.canEdit && canHide(row)"
        type="button"
        data-sve-ht-eye
        :title="row.hidden ? ui.showTitle : ui.hideTitle"
        v-html="row.hidden ? EYE_OFF : EYE"
        @click.stop.prevent="ui.onHide?.(row.id)"
        @pointerdown.stop
        @dblclick.stop
      ></button>
      <!--
        The section's own fields, on the row that stands for the whole section.
        Only there: every tag inside it belongs to the same fieldset, so an icon
        on each would be the same button drawn twenty times.
      -->
      <button
        v-if="canFields && row.depth === 0"
        type="button"
        data-sve-ht-fields
        :title="fieldsLabel"
        v-html="FIELDS"
        @click.stop.prevent="onFields"
        @pointerdown.stop
        @dblclick.stop
      ></button>
      <button
        v-if="ui.canEdit"
        type="button"
        data-sve-ht-dup
        :title="ui.duplicateTitle"
        v-html="DUP"
        @click.stop.prevent="ui.onDuplicate?.(row.id)"
        @pointerdown.stop
        @dblclick.stop
      ></button>
      <button
        v-if="ui.canEdit"
        type="button"
        data-sve-ht-del
        :title="ui.deleteTitle"
        v-html="DEL"
        @click.stop.prevent="ui.onDelete?.(row.id)"
        @pointerdown.stop
        @dblclick.stop
      ></button>
    </span>
  </div>
  <div
    v-if="row.emptyBlock && !row.shut"
    data-sve-ht-slot
    :data-sve-ht-id="row.id"
    v-bind="ui.dropId === row.id && ui.dropPlace === 'inside' ? { 'data-sve-ht-over': '' } : {}"
    :style="{ marginLeft: (row.depth + 1) * 12 + 'px' }"
  >{{ ui.slotText }}</div>
</template>

<style scoped>
/* Moved here with the markup: a scoped rule only reaches the component that
   draws the element, and the slot is drawn here now. */
[data-sve-ht-slot] {
  box-sizing: border-box;
  min-height: 2em;
  margin-bottom: 0.2em;
  padding: 0.45em 0.6em;
  border: 1px dashed rgba(128, 128, 128, 0.45);
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  line-height: 1.3;
  opacity: 0.5;
}
[data-sve-ht-slot][data-sve-ht-over] {
  border-color: #93c5fd;
  border-style: solid;
  opacity: 1;
}
</style>
