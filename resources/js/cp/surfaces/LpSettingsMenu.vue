<script setup>
import { ref } from 'vue';
import LpSettingsPresets from './LpSettingsPresets.vue';
import LpSettingsSidebars from './LpSettingsSidebars.vue';
import LpSettingsTree from './LpSettingsTree.vue';
import LpSettingsToolbar from './LpSettingsToolbar.vue';
import LpSettingsShortcuts from './LpSettingsShortcuts.vue';

// The ⋮ menu: the presets on top — a click switches — then four tabs, one
// job each. Sidebars = what is open and how wide, for the preset that is on;
// HTML tree = the tree's face and the tag colours; Top bar = which icons show;
// Shortcuts = this user's own keyboard shortcuts.
// A switch opens the tab again, so it shows the new preset. lp-more-menu.js
// builds the props and owns every write; the tabs only report.
const props = defineProps({
  top: { type: Number, required: true },
  right: { type: Number, required: true },
  title: { type: String, required: true },
  // [{ id, label }] — only the tabs that have something to show.
  tabs: { type: Array, required: true },
  tab: { type: String, required: true },
  presets: { type: Object, required: true },
  sidebars: { type: Object, required: true },
  tree: { type: Object, required: true },
  toolbar: { type: Object, required: true },
  shortcuts: { type: Object, required: true },
  resetLabel: { type: String, required: true },
  resetTitle: { type: String, required: true },
  onTab: { type: Function, required: true },
  on: { type: Object, required: true },
  onReset: { type: Function, required: true },
  onClose: { type: Function, required: true },
});

const current = ref(props.tabs.some((item) => item.id === props.tab) ? props.tab : props.tabs[0]?.id);

function pick(id) {
  current.value = id;
  props.onTab(id);
}

// Which preset is on. Icons ticked by hand, or the dock switched, can make it
// none (or another): read again after each. A switch is marked at once.
const presetState = props.on.presetState();
const presetList = ref(presetState.presets);
const activeId = ref(presetState.activeId);
const switched = ref(0);

function refreshActive() {
  activeId.value = props.on.activePreset();
}

function onSwitched(id) {
  activeId.value = id;
  switched.value += 1;
}

function onAdded(preset) {
  presetList.value = [...presetList.value, preset];
}

function onDeleted(id) {
  presetList.value = presetList.value.filter((preset) => preset.id !== id);
  refreshActive();
}

const on = {
  ...props.on,
  toolbarShown: (key, shown) => {
    props.on.toolbarShown(key, shown);
    refreshActive();
  },
  toolbarShowAll: () => {
    props.on.toolbarShowAll();
    refreshActive();
  },
  codeDock: (value) => {
    props.on.codeDock(value);
    refreshActive();
  },
};
</script>

<template>
  <div
    id="__sve-lp-more-menu"
    class="sve-lp-settings"
    tabindex="-1"
    :style="{ top: top + 'px', right: right + 'px' }"
    @click.stop
    @keydown.escape.stop.prevent="onClose"
  >
    <div class="sve-lp-settings__title">{{ title }}</div>

    <LpSettingsPresets
      v-bind="presets"
      :presets="presetList"
      :active-id="activeId"
      :on="on"
      @switched="onSwitched"
      @added="onAdded"
      @deleted="onDeleted"
    />

    <nav v-if="tabs.length > 1" class="sve-lp-settings__tabs" role="tablist" :aria-label="title">
      <button
        v-for="item in tabs"
        :key="item.id"
        type="button"
        role="tab"
        class="sve-lp-settings__tab"
        :class="{ 'is-on': current === item.id }"
        :aria-selected="current === item.id ? 'true' : 'false'"
        :data-sve-lp-settings-tab="item.id"
        :title="item.label"
        @click="pick(item.id)"
      >
        {{ item.label }}
      </button>
    </nav>

    <div class="sve-lp-settings__body" role="tabpanel">
      <LpSettingsSidebars v-if="current === 'sidebars'" :key="`sidebars-${switched}`" v-bind="sidebars" :active-id="activeId" :on="on" />
      <LpSettingsTree v-else-if="current === 'tree'" :key="`tree-${switched}`" v-bind="tree" :on="on" />
      <LpSettingsToolbar v-else-if="current === 'toolbar'" :key="`toolbar-${switched}`" v-bind="toolbar" :on="on" />
      <LpSettingsShortcuts v-else-if="current === 'shortcuts'" v-bind="shortcuts" :on="on" />
    </div>

    <div class="sve-lp-settings__foot">
      <button type="button" class="sve-lp-settings__reset" :title="resetTitle" @click="onReset">
        {{ resetLabel }}
      </button>
    </div>
  </div>
</template>

<style>
/* Not scoped: the tab components share these parts. Everything sits
   under .sve-lp-settings, and the menu is the only thing that uses it. */
.sve-lp-settings {
  position: fixed;
  z-index: 2147483001;
  width: 24rem;
  max-width: calc(100vw - 1rem);
  max-height: calc(100vh - 4.5rem);
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-radius: 0.625rem;
  background: #343439;
  color: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0.75rem 2.5rem rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.12);
  font: 500 0.8125rem/1.3 ui-sans-serif, system-ui, sans-serif;
  outline: none;
}
.sve-lp-settings__title {
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.25rem 0.375rem 0.5rem;
}
.sve-lp-settings__tabs {
  display: flex;
  gap: 0.125rem;
  padding: 0.1875rem;
  margin-bottom: 0.5rem;
  border-radius: 0.375rem;
  background: #2a2a2d;
  flex: none;
}
/* Equal parts that never push each other out: a long label ends in … */
.sve-lp-settings__tab {
  all: unset;
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 1.75rem;
  padding: 0 0.5rem;
  border-radius: 0.25rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.75rem;
  white-space: nowrap;
  opacity: 0.65;
  cursor: pointer;
}
.sve-lp-settings__tab:hover {
  opacity: 1;
}
.sve-lp-settings__tab.is-on {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  opacity: 1;
}
.sve-lp-settings__tab:focus-visible {
  outline: 2px solid var(--theme-color-primary, #4f46e5);
  outline-offset: -2px;
}
.sve-lp-settings__body {
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
}
.sve-lp-settings__section {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: #2c2c31;
  margin-bottom: 0.375rem;
}
/* A long list: rows closer together. */
.sve-lp-settings__section.is-tight {
  gap: 0.25rem;
}
.sve-lp-settings__label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  opacity: 0.55;
}
.sve-lp-settings__hint {
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.35;
  opacity: 0.55;
}
/* Label left, control right, one line. */
.sve-lp-settings__line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
/* Hidden / Auto / Visible: a small segmented control, not three big buttons. */
.sve-lp-settings__modes {
  display: inline-flex;
  gap: 0.125rem;
  padding: 0.125rem;
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.06);
}
.sve-lp-settings__modes button {
  all: unset;
  cursor: pointer;
  padding: 0.1875rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  opacity: 0.75;
}
.sve-lp-settings__modes button:hover {
  opacity: 1;
}
.sve-lp-settings__modes button.is-on {
  background: color-mix(in oklab, var(--theme-color-primary, #4f46e5) 90%, transparent);
  color: #fff;
  opacity: 1;
}
.sve-lp-settings__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  cursor: pointer;
  font-weight: 500;
}
.sve-lp-settings__row.is-fixed {
  opacity: 0.6;
  cursor: default;
}
/* A row that belongs to the one above it (how the help behaves, under its tick). */
.sve-lp-settings__row--sub {
  padding-left: 1.375rem;
}
.sve-lp-settings__row input {
  margin: 0;
  flex: none;
  accent-color: var(--theme-color-primary, #4f46e5);
}
/* Two columns of names; a long one ends in … and says itself in the tooltip. */
.sve-lp-settings__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.375rem 0.5rem;
}
.sve-lp-settings__grid .sve-lp-settings__row > span,
.sve-lp-settings__tool-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Top bar tab: box, icon, name — and Open on a hidden one. */
.sve-lp-settings__tool {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: 1.5rem;
}
.sve-lp-settings__tool .sve-lp-settings__row {
  flex: 1 1 auto;
}
.sve-lp-settings__tool .sve-lp-settings__small,
.sve-lp-settings__line .sve-lp-settings__small {
  align-self: center;
  flex: none;
}
.sve-lp-settings__tool-icon {
  display: inline-flex;
  flex: none;
  opacity: 0.85;
}
.sve-lp-settings__tool-icon svg {
  display: block;
  width: 0.9375rem;
  height: 0.9375rem;
}
.sve-lp-settings__tool.is-off .sve-lp-settings__tool-icon,
.sve-lp-settings__tool.is-off .sve-lp-settings__tool-name {
  opacity: 0.5;
}
.sve-lp-settings__tools {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
/* Shortcuts tab: icon and name on the left, the recorder on the right. */
.sve-lp-settings__shortcut-name {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}
.sve-lp-settings__tool > .sve-shortcut {
  flex: 0 1 auto;
}
/* The row being dragged lifts a little; the others make room as it passes. */
.sve-lp-settings__tool.is-dragging {
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.35);
}
.sve-lp-settings__handle {
  all: unset;
  flex: none;
  width: 0.875rem;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1;
  opacity: 0.4;
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.sve-lp-settings__handle:hover,
.sve-lp-settings__handle:focus-visible {
  opacity: 0.9;
}
.sve-lp-settings__tool.is-dragging .sve-lp-settings__handle {
  cursor: grabbing;
  opacity: 0.9;
}
/* Top bar groups: one box per group, its name on top, its tools under it. */
.sve-lp-settings__groups {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.sve-lp-settings__group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.375rem;
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.04);
}
/* Not a group yet: an outline to drop a tool into. */
.sve-lp-settings__group.is-draft {
  background: transparent;
  outline: 1px dashed rgba(255, 255, 255, 0.2);
  outline-offset: -1px;
}
.sve-lp-settings__group.is-dragging {
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.35);
}
.sve-lp-settings__group.is-dragging > .sve-lp-settings__group-head .sve-lp-settings__handle {
  cursor: grabbing;
  opacity: 0.9;
}
.sve-lp-settings__group-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 1.5rem;
}
/* The draft has no handle: its name lines up with the groups' names. */
.sve-lp-settings__group-spacer {
  flex: none;
  width: 0.875rem;
}
/* At rest the name reads as a label; it shows it is a field when focused. */
.sve-lp-settings__group-name {
  flex: 1 1 auto;
  min-width: 0;
  box-sizing: border-box;
  height: 1.5rem;
  margin: 0;
  padding: 0 0.375rem;
  border: 0;
  border-radius: 0.25rem;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  outline: none;
}
.sve-lp-settings__group-name::placeholder {
  color: inherit;
  opacity: 0.45;
}
.sve-lp-settings__group-name:hover {
  background: rgba(255, 255, 255, 0.05);
}
.sve-lp-settings__group-name:focus {
  background: rgba(0, 0, 0, 0.25);
  outline: 1px solid var(--theme-color-primary, #4f46e5);
  outline-offset: -1px;
}
.sve-lp-settings__group-x {
  all: unset;
  flex: none;
  padding: 0 0.25rem;
  font-size: 0.875rem;
  line-height: 1;
  opacity: 0.5;
  cursor: pointer;
}
.sve-lp-settings__group-x:hover,
.sve-lp-settings__group-x:focus-visible {
  opacity: 1;
}
.sve-lp-settings__group-hint {
  margin: 0;
  min-height: 1.5rem;
  padding-left: 1.375rem;
  font-size: 0.6875rem;
  line-height: 1.5rem;
  opacity: 0.55;
}
button.sve-lp-settings__group-new {
  align-self: flex-start;
}
/* Presets: one pill each; the user's own carry an × to delete them. */
.sve-lp-settings__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
.sve-lp-settings__pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.75rem;
  font-weight: 600;
}
.sve-lp-settings__pill > button,
button.sve-lp-settings__pill {
  all: unset;
  cursor: pointer;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  white-space: nowrap;
}
.sve-lp-settings__pill.is-own > button:first-child {
  padding-right: 0.25rem;
}
.sve-lp-settings__pill:hover {
  background: rgba(255, 255, 255, 0.14);
}
.sve-lp-settings__pill.is-on {
  background: color-mix(in oklab, var(--theme-color-primary, #4f46e5) 90%, transparent);
  color: #fff;
}
.sve-lp-settings__pill.is-add {
  background: transparent;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  opacity: 0.8;
}
.sve-lp-settings__pill.is-add:hover {
  opacity: 1;
}
.sve-lp-settings__pill .sve-lp-settings__pill-x {
  padding: 0.25rem 0.5rem 0.25rem 0.125rem;
  opacity: 0.6;
}
.sve-lp-settings__pill .sve-lp-settings__pill-x:hover {
  opacity: 1;
}
.sve-lp-settings__name {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}
.sve-lp-settings__name input {
  flex: 1 1 auto;
  min-width: 0;
  box-sizing: border-box;
  height: 1.625rem;
  padding: 0 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.375rem;
  background: rgba(0, 0, 0, 0.25);
  color: inherit;
  font: inherit;
  font-size: 0.75rem;
  outline: none;
}
.sve-lp-settings__name input:focus {
  border-color: var(--theme-color-primary, #4f46e5);
}
.sve-lp-settings__small.is-primary {
  background: color-mix(in oklab, var(--theme-color-primary, #4f46e5) 90%, transparent);
  color: #fff;
}
.sve-lp-settings__link {
  font-size: 0.6875rem;
  font-weight: 600;
  color: inherit;
  opacity: 0.65;
  text-decoration: none;
  white-space: nowrap;
}
.sve-lp-settings__link:hover {
  opacity: 1;
  text-decoration: underline;
}
/* Width: label, slider and value on one line. */
.sve-lp-settings__range {
  display: grid;
  grid-template-columns: auto 1fr 3rem;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.75rem;
}
.sve-lp-settings__range input[type='range'] {
  width: 100%;
  margin: 0;
  accent-color: var(--theme-color-primary, #4f46e5);
}
.sve-lp-settings__px {
  text-align: right;
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
}
/* The picker is the swatch: no chrome around the colour it holds. */
.sve-lp-settings__swatch {
  appearance: none;
  -webkit-appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0.25rem;
  background: none;
  cursor: pointer;
}
.sve-lp-settings__swatch::-webkit-color-swatch-wrapper {
  padding: 0;
}
.sve-lp-settings__swatch::-webkit-color-swatch {
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.25rem;
}
.sve-lp-settings__small {
  all: unset;
  cursor: pointer;
  align-self: flex-start;
  white-space: nowrap;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
}
.sve-lp-settings__small:hover {
  background: rgba(255, 255, 255, 0.16);
}
.sve-lp-settings__small:disabled {
  opacity: 0.4;
  cursor: default;
}
.sve-lp-settings__foot {
  flex: none;
  margin-top: 0.125rem;
  padding-top: 0.375rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.sve-lp-settings__reset {
  all: unset;
  cursor: pointer;
  display: block;
  box-sizing: border-box;
  width: 100%;
  padding: 0.4375rem 0.5rem;
  border-radius: 0.4375rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.1);
}
.sve-lp-settings__reset:hover {
  background: rgba(255, 255, 255, 0.16);
}
</style>
