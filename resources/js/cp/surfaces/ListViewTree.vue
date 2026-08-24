<script setup>
import { listViewUi as ui } from '../listview/store.js';

const TWIST =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
const DOTS =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>';
const HANDLE =
  '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.7"/><circle cx="15" cy="6" r="1.7"/><circle cx="9" cy="12" r="1.7"/><circle cx="15" cy="12" r="1.7"/><circle cx="9" cy="18" r="1.7"/><circle cx="15" cy="18" r="1.7"/></svg>';

function rowBind(row) {
  const bind = { 'data-sve-lv-row': '' };

  if (row.uid) {
    bind['data-sve-lv-uid'] = row.uid;
  }

  if (row.current) {
    bind['data-sve-lv-current'] = '';
  }

  if (row.off) {
    bind['data-sve-lv-off'] = '';
  }

  return bind;
}

function handleBind(row) {
  const bind = { 'data-sve-lv-handle': '' };

  if (row.handleLocked) {
    bind['data-sve-lv-locked'] = '';
  }

  if (row.handleUnlockable) {
    bind['data-sve-lv-unlockable'] = '';
  }

  return bind;
}
</script>

<template>
  <div class="sve-lv-root">
    <div v-if="!ui.groups.length" class="sve-lv-empty">{{ ui.emptyText }}</div>
    <template v-for="(group, gi) in ui.groups" :key="gi">
      <div v-if="group.boxed" data-sve-lv-branch v-bind="group.here ? { 'data-sve-lv-here': '' } : {}">
        <div
          v-for="row in group.rows"
          :key="row.key"
          v-bind="rowBind(row)"
          role="button"
          :tabindex="row.uid ? 0 : -1"
          :title="row.title"
          :draggable="row.draggable"
          :style="{ marginLeft: row.depth * 14 + 'px', opacity: row.dim ? '.4' : '', cursor: row.dim ? 'default' : '' }"
          @click="row.uid && ui.onSelect?.(row.uid)"
          @keydown.enter.prevent="row.uid && ui.onSelect?.(row.uid)"
          @keydown.space.prevent="row.uid && ui.onSelect?.(row.uid)"
          @dragstart="ui.onDragStart?.(row.uid, $event)"
          @dragend="ui.onDragEnd?.(row.uid, $event)"
          @dragover="ui.onDragOver?.(row.uid, $event)"
          @dragleave="ui.onDragLeave?.(row.uid, $event)"
          @drop="ui.onDrop?.(row.uid, $event)"
        >
          <button
            v-if="row.hasChildren"
            type="button"
            data-sve-lv-twist
            v-bind="row.shut ? { 'data-sve-lv-shut': '' } : {}"
            :title="row.twistTitle"
            v-html="TWIST"
            @click.stop.prevent="ui.onTwist?.(row.uid)"
          ></button>
          <span data-sve-lv-icon style="flex:none"></span>
          <span
            data-sve-lv-text
            :title="row.renameTitle"
            @dblclick.stop.prevent="row.canRename && ui.onRename?.(row.uid, $event)"
          >{{ row.label }}</span>
          <span v-if="row.global" data-sve-lv-global :title="row.globalTitle">{{ row.global }}</span>
          <span data-sve-lv-actions>
            <button
              v-for="act in row.actions"
              :key="act.id"
              type="button"
              data-sve-lv-act
              v-bind="act.danger ? { 'data-sve-lv-danger': '' } : {}"
              :title="act.title"
              v-html="act.svg"
              @click.stop.prevent="ui.onAction?.(row.uid, act.id)"
            ></button>
            <button
              v-if="row.hasMenu"
              type="button"
              data-sve-lv-act
              :title="row.menuTitle"
              v-html="DOTS"
              @click.stop.prevent="ui.onMenu?.(row.uid, $event.currentTarget)"
            ></button>
          </span>
          <span
            v-if="row.uid"
            v-bind="handleBind(row)"
            :title="row.handleTitle"
            v-html="HANDLE"
            @click.stop.prevent="row.handleUnlockable && ui.onUnlock?.(row.uid)"
          ></span>
        </div>
      </div>
      <template v-else>
        <div
          v-for="row in group.rows"
          :key="row.key"
          v-bind="rowBind(row)"
          role="button"
          :tabindex="row.uid ? 0 : -1"
          :title="row.title"
          :draggable="row.draggable"
          :style="{ marginLeft: row.depth * 14 + 'px', opacity: row.dim ? '.4' : '', cursor: row.dim ? 'default' : '' }"
          @click="row.uid && ui.onSelect?.(row.uid)"
          @keydown.enter.prevent="row.uid && ui.onSelect?.(row.uid)"
          @keydown.space.prevent="row.uid && ui.onSelect?.(row.uid)"
          @dragstart="ui.onDragStart?.(row.uid, $event)"
          @dragend="ui.onDragEnd?.(row.uid, $event)"
          @dragover="ui.onDragOver?.(row.uid, $event)"
          @dragleave="ui.onDragLeave?.(row.uid, $event)"
          @drop="ui.onDrop?.(row.uid, $event)"
        >
          <button
            v-if="row.hasChildren"
            type="button"
            data-sve-lv-twist
            v-bind="row.shut ? { 'data-sve-lv-shut': '' } : {}"
            :title="row.twistTitle"
            v-html="TWIST"
            @click.stop.prevent="ui.onTwist?.(row.uid)"
          ></button>
          <span data-sve-lv-icon style="flex:none"></span>
          <span
            data-sve-lv-text
            :title="row.renameTitle"
            @dblclick.stop.prevent="row.canRename && ui.onRename?.(row.uid, $event)"
          >{{ row.label }}</span>
          <span v-if="row.global" data-sve-lv-global :title="row.globalTitle">{{ row.global }}</span>
          <span data-sve-lv-actions>
            <button
              v-for="act in row.actions"
              :key="act.id"
              type="button"
              data-sve-lv-act
              v-bind="act.danger ? { 'data-sve-lv-danger': '' } : {}"
              :title="act.title"
              v-html="act.svg"
              @click.stop.prevent="ui.onAction?.(row.uid, act.id)"
            ></button>
            <button
              v-if="row.hasMenu"
              type="button"
              data-sve-lv-act
              :title="row.menuTitle"
              v-html="DOTS"
              @click.stop.prevent="ui.onMenu?.(row.uid, $event.currentTarget)"
            ></button>
          </span>
          <span
            v-if="row.uid"
            v-bind="handleBind(row)"
            :title="row.handleTitle"
            v-html="HANDLE"
            @click.stop.prevent="row.handleUnlockable && ui.onUnlock?.(row.uid)"
          ></span>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.sve-lv-empty {
  padding: 30px 6px;
  text-align: center;
  opacity: 0.55;
  font-size: 12px;
}
</style>
