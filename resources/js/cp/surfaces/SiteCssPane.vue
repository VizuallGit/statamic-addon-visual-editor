<script setup>
import { computed } from 'vue';
import { siteCssUi as ui } from '../site-css/store.js';

defineProps({
  onClose: { type: Function, required: true },
  onSelect: { type: Function, required: true },
  onAdd: { type: Function, required: true },
  onSave: { type: Function, required: true },
  onReload: { type: Function, required: true },
  onImport: { type: Function, required: true },
});

function flatten(nodes, depth = 0) {
  const out = [];

  (nodes || []).forEach((node) => {
    out.push({ ...node, depth });

    if (node.type === 'dir') {
      out.push(...flatten(node.children || [], depth + 1));
    }
  });

  return out;
}

const rows = computed(() => flatten(ui.tree));
</script>

<template>
  <div class="sve-site-css">
    <div class="sve-site-css__bar">
      <div class="sve-site-css__title">{{ ui.title }}</div>
      <span class="sve-site-css__root">{{ ui.root }}</span>
      <span class="sve-site-css__status">{{ ui.status }}</span>
      <button type="button" class="sve-site-css__icon" :title="ui.reloadTitle" :disabled="!ui.path" @click="onReload">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3.2-6.8"/><path d="M21 3v6h-6"/></svg>
      </button>
      <button type="button" class="sve-site-css__save" :disabled="!ui.path || !ui.dirty" @click="onSave">{{ ui.saveLabel }}</button>
      <button type="button" class="sve-site-css__icon" title="Close" @click="onClose">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="sve-site-css__body">
      <aside class="sve-site-css__side">
        <div class="sve-site-css__side-label">{{ ui.title }}</div>
        <div class="sve-site-css__tree">
          <template v-for="row in rows" :key="row.path">
            <div v-if="row.type === 'dir'" class="sve-site-css__dir" :style="{ paddingLeft: 16 + row.depth * 14 + 'px' }">{{ row.name }}</div>
            <button
              v-else
              type="button"
              class="sve-site-css__file"
              :class="{ 'is-on': ui.path === row.path }"
              :style="{ paddingLeft: 16 + row.depth * 14 + 'px' }"
              @click="onSelect(row.path)"
            >{{ row.name }}</button>
          </template>
        </div>
        <button type="button" class="sve-site-css__add" @click="onAdd">{{ ui.addLabel }}</button>
      </aside>
      <div class="sve-site-css__main">
        <div v-if="ui.path && !ui.imported" class="sve-site-css__hint">
          <span>{{ ui.notImported }}</span>
          <button type="button" @click="onImport">{{ ui.importLabel }}</button>
        </div>
        <div data-sve-site-css-host class="sve-site-css__host"></div>
        <div v-if="!ui.path" class="sve-site-css__empty">{{ ui.emptyLabel }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sve-site-css {
  position: absolute;
  inset: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  color: #d4d4d4;
  font: 500 13px/1.3 ui-sans-serif, system-ui, sans-serif;
}
.sve-site-css__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 10px;
  border-bottom: 1px solid #3c3c3c;
  flex: none;
}
.sve-site-css__title {
  font-weight: 600;
  color: #fff;
}
.sve-site-css__root {
  opacity: 0.55;
  font-size: 12px;
}
.sve-site-css__status {
  margin-left: auto;
  font-size: 12px;
  opacity: 0.7;
}
.sve-site-css__icon,
.sve-site-css__save {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.sve-site-css__icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}
.sve-site-css__icon:hover:not(:disabled),
.sve-site-css__save:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
}
.sve-site-css__icon:disabled,
.sve-site-css__save:disabled {
  opacity: 0.35;
  cursor: default;
}
.sve-site-css__save {
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  background: #0d9488;
  color: #fff;
  font-weight: 600;
}
.sve-site-css__save:disabled {
  background: #2a2a2a;
  color: inherit;
}
.sve-site-css__body {
  display: flex;
  min-height: 0;
  flex: 1;
}
.sve-site-css__side {
  width: 240px;
  flex: none;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #3c3c3c;
  background: #181818;
}
.sve-site-css__side-label {
  padding: 12px 16px 8px;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.55;
}
.sve-site-css__tree {
  flex: 1;
  overflow: auto;
  padding: 6px 0;
}
.sve-site-css__dir {
  padding: 6px 16px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 11px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.sve-site-css__file {
  display: block;
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  color: inherit;
  padding: 6px 16px;
  cursor: pointer;
  font: inherit;
}
.sve-site-css__file:hover {
  background: rgba(255, 255, 255, 0.06);
}
.sve-site-css__file.is-on {
  background: #264f78;
  color: #fff;
}
.sve-site-css__add {
  margin: 10px 12px 12px;
  height: 36px;
  border: 0;
  border-radius: 8px;
  background: color-mix(in oklab, var(--theme-color-primary, #4f46e5) 90%, transparent);
  color: #fff;
  font: 600 13px/1 ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
}
.sve-site-css__add:hover {
  filter: brightness(1.08);
}
.sve-site-css__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}
.sve-site-css__hint {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #3b2f12;
  color: #f5d67b;
  font-size: 12px;
  flex: none;
}
.sve-site-css__hint button {
  margin-left: auto;
  border: 0;
  border-radius: 6px;
  background: #0d9488;
  color: #fff;
  height: 26px;
  padding: 0 10px;
  font: 600 12px/1 ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
}
.sve-site-css__host {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
.sve-site-css__empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.45;
  pointer-events: none;
}
</style>
