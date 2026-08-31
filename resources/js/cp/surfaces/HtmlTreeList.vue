<script setup>
import { htmlTreeUi as ui } from '../html-tree/store.js';

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
  return row.name ? `${row.tag} ${row.name}` : row.tag;
}

function rowBind(row) {
  const bind = { 'data-sve-ht-id': row.id };

  if (row.current) {
    bind['data-sve-ht-current'] = '';
  }

  if (row.hidden) {
    bind['data-sve-ht-hidden'] = '';
  }

  if (ui.dropId === row.id && ui.dropPlace) {
    bind['data-sve-ht-drop'] = ui.dropPlace;
  }

  return bind;
}

function canHide(row) {
  return !row.hidden || row.wrapFrom != null;
}
</script>

<template>
  <div class="sve-ht-root" v-bind="ui.dragging ? { 'data-sve-ht-dragging': '' } : {}">
    <div v-if="!ui.rows.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
    <div
      v-for="row in ui.rows"
      :key="row.id"
      data-sve-ht-row
      v-bind="rowBind(row)"
      role="button"
      tabindex="0"
      :title="rowTitle(row)"
      :style="{ marginLeft: row.depth * 12 + 'px' }"
      @click="ui.onSelect?.(row.id)"
      @dblclick.prevent="ui.onRename?.(row.id)"
      @keydown.enter.prevent="ui.onSelect?.(row.id)"
      @keydown.space.prevent="ui.onSelect?.(row.id)"
      @pointerdown="ui.onPointerDown?.($event, row.id)"
    >
      <button
        v-if="row.hasChildren"
        type="button"
        data-sve-ht-twist
        v-bind="row.shut ? { 'data-sve-ht-shut': '' } : {}"
        v-html="TWIST"
        @click.stop.prevent="ui.onTwist?.(row.id)"
        @pointerdown.stop
        @dblclick.stop
      ></button>
      <span v-if="row.letter" data-sve-ht-letter>{{ row.letter }}</span>
      <span v-else data-sve-ht-icon v-html="row.svg"></span>
      <span data-sve-ht-text :title="ui.renameTitle">
        <span data-sve-ht-tag>{{ row.tag }}</span>
        <input
          v-if="ui.editingId === row.id"
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
      <span v-if="ui.canEdit" data-sve-ht-actions>
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
  </div>
</template>

<style scoped>
.sve-ht-empty {
  padding: 28px 6px;
  text-align: center;
  opacity: 0.55;
  font-size: 12px;
}
.sve-ht-root[data-sve-ht-dragging] {
  cursor: grabbing;
}
</style>
