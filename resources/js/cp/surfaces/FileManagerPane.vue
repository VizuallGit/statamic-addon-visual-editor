<script setup>
import { computed } from 'vue';
import { fileManagerUi as ui } from '../file-manager/store.js';

defineProps({
  onSelect: { type: Function, required: true },
  onSelectDir: { type: Function, required: true },
  onToggleDir: { type: Function, required: true },
  onAddFile: { type: Function, required: true },
  onAddFolder: { type: Function, required: true },
  onRename: { type: Function, required: true },
  onDelete: { type: Function, required: true },
  onSave: { type: Function, required: true },
  onReload: { type: Function, required: true },
});

/**
 * The tree, flattened to rows the template can draw in one pass. A folder that
 * is closed hides its children rather than unmounting them from the data — the
 * open/closed map is the only state, so reloading the tree keeps the shape the
 * reader had.
 */
function flatten(nodes, depth = 0) {
  const out = [];

  (nodes || []).forEach((node) => {
    out.push({ ...node, depth });

    if (node.type === 'dir' && ui.open[node.path]) {
      out.push(...flatten(node.children || [], depth + 1));
    }
  });

  return out;
}

const rows = computed(() => flatten(ui.tree));
const target = computed(() => ui.path || ui.dir);
</script>

<template>
  <div class="sve-files" data-sve-files-frame>
    <div class="sve-files__bar">
      <span class="sve-files__title">{{ ui.title }}</span>
      <span class="sve-files__path">{{ ui.path ? ui.root + '/' + ui.path : ui.root }}</span>
      <span class="sve-files__status">{{ ui.status }}</span>
      <button type="button" class="sve-files__icon" :title="ui.reloadTitle" :disabled="!ui.path" @click="onReload">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3.2-6.8"/><path d="M21 3v6h-6"/></svg>
      </button>
      <button type="button" class="sve-files__plain" :disabled="!target" @click="onRename">{{ ui.renameLabel }}</button>
      <button type="button" class="sve-files__danger" :disabled="!target" @click="onDelete">{{ ui.deleteLabel }}</button>
      <button type="button" class="sve-files__save" :disabled="!ui.path || !ui.dirty" @click="onSave">{{ ui.saveLabel }}</button>
    </div>
    <div class="sve-files__body">
      <aside class="sve-files__side">
        <div class="sve-files__side-label">{{ ui.root }}</div>
        <div class="sve-files__tree">
          <template v-for="row in rows" :key="row.type + row.path">
            <button
              v-if="row.type === 'dir'"
              type="button"
              class="sve-files__dir"
              :class="{ 'is-on': ui.dir === row.path && !ui.path }"
              :style="{ paddingLeft: 0.5 + row.depth * 0.75 + 'rem' }"
              @click="onToggleDir(row.path); onSelectDir(row.path)"
            >
              <span class="sve-files__caret" :class="{ 'is-open': ui.open[row.path] }">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
              </span>
              {{ row.name }}
            </button>
            <button
              v-else
              type="button"
              class="sve-files__file"
              :class="{ 'is-on': ui.path === row.path }"
              :style="{ paddingLeft: 1.25 + row.depth * 0.75 + 'rem' }"
              @click="onSelect(row.path)"
            >{{ row.name }}</button>
          </template>
        </div>
        <div class="sve-files__adds">
          <button type="button" @click="onAddFile">{{ ui.newFile }}</button>
          <button type="button" @click="onAddFolder">{{ ui.newFolder }}</button>
        </div>
      </aside>
      <div class="sve-files__main">
        <div data-sve-files-host class="sve-files__host"></div>
        <div v-if="!ui.path" class="sve-files__empty">{{ ui.emptyLabel }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * Same palette and type scale as the Live Preview style manager
 * (cp/surfaces/SiteCssPane.vue) — this is the second pane of its kind, and two
 * code editors in one Control Panel should not look like two different
 * products. Sizes in rem rather than that file's px.
 */
/*
 * A frame that sits away from the Control Panel around it.
 *
 * Flush against Statamic's own sidebar, in the same dark grey, the two read as
 * one surface and it is not obvious that the sidebar belongs to the CP and this
 * does not. Inset on three sides, a border all the way round, and a shade
 * lighter than the CP behind it.
 */
.sve-files {
  --sve-files-inset: 1rem;

  display: flex;
  flex-direction: column;
  margin: 0.75rem var(--sve-files-inset) 0;
  /*
   * Whatever is left below. file-manager.js measures where this frame lands —
   * after the margin above — and writes --sve-files-height; the fallback is only
   * what shows for the instant before it does.
   */
  height: var(--sve-files-height, 60vh);
  min-height: 20rem;
  border: 1px solid #3c3c3c;
  border-radius: 0.625rem;
  overflow: hidden;
  background: #242424;
  color: #d4d4d4;
  font: 500 0.8125rem/1.3 ui-sans-serif, system-ui, sans-serif;
}
.sve-files__bar {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  height: 2.5rem;
  padding: 0 0.625rem;
  border-bottom: 1px solid #3c3c3c;
  flex: none;
}
.sve-files__title {
  font-weight: 600;
  color: #fff;
  flex: none;
}
.sve-files__path {
  opacity: 0.55;
  font-size: 0.75rem;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sve-files__status {
  margin-left: auto;
  font-size: 0.75rem;
  opacity: 0.7;
  white-space: nowrap;
}
.sve-files__icon,
.sve-files__save,
.sve-files__plain,
.sve-files__danger {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
}
.sve-files__icon {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
}
.sve-files__icon:hover:not(:disabled),
.sve-files__plain:hover:not(:disabled),
.sve-files__danger:hover:not(:disabled),
.sve-files__save:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
}
.sve-files__icon:disabled,
.sve-files__save:disabled,
.sve-files__plain:disabled,
.sve-files__danger:disabled {
  opacity: 0.35;
  cursor: default;
}
.sve-files__plain {
  height: 1.75rem;
  padding: 0 0.625rem;
  border-radius: 0.375rem;
  font-weight: 600;
}
.sve-files__danger {
  height: 1.75rem;
  padding: 0 0.625rem;
  border-radius: 0.375rem;
  color: #f2a2a2;
  font-weight: 600;
}
.sve-files__save {
  height: 1.75rem;
  padding: 0 0.625rem;
  border-radius: 0.375rem;
  background: #0d9488;
  color: #fff;
  font-weight: 600;
}
.sve-files__save:disabled {
  background: #2a2a2a;
  color: inherit;
}
.sve-files__body {
  display: flex;
  min-height: 0;
  flex: 1;
}
.sve-files__side {
  width: 15rem;
  flex: none;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #3c3c3c;
  background: #1e1e1e;
}
.sve-files__side-label {
  padding: 0.75rem 1rem 0.5rem;
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.55;
  flex: none;
}
.sve-files__tree {
  flex: 1;
  overflow: auto;
  padding: 0.375rem 0;
}
.sve-files__dir,
.sve-files__file {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  color: inherit;
  padding: 0.375rem 1rem;
  cursor: pointer;
  font: inherit;
}
/*
 * Folders read as the small grey headings the style manager uses for its
 * groups, rather than as another row of file names.
 */
.sve-files__dir {
  gap: 0.375rem;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.6875rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.sve-files__caret {
  display: inline-flex;
  width: 0.625rem;
  line-height: 1;
  opacity: 0.7;
  transition: transform 0.12s ease;
}
.sve-files__caret.is-open {
  transform: rotate(90deg);
}
.sve-files__dir:hover,
.sve-files__file:hover {
  background: rgba(255, 255, 255, 0.06);
}
.sve-files__dir.is-on,
.sve-files__file.is-on {
  background: #264f78;
  color: #fff;
}
.sve-files__adds {
  display: flex;
  gap: 0.5rem;
  margin: 0.625rem 0.75rem 0.75rem;
  flex: none;
}
.sve-files__adds button {
  flex: 1;
  height: 2.25rem;
  border: 0;
  border-radius: 0.5rem;
  background: color-mix(in oklab, var(--theme-color-primary, #4f46e5) 90%, transparent);
  color: #fff;
  font: 600 0.75rem/1 ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
}
.sve-files__adds button:hover {
  filter: brightness(1.08);
}
.sve-files__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}
.sve-files__host {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
.sve-files__empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.45;
  pointer-events: none;
}
</style>
