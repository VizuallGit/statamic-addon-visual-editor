<script setup>
import { ref } from 'vue';
import LpSettingsSidebars from './LpSettingsSidebars.vue';
import LpSettingsTree from './LpSettingsTree.vue';
import LpSettingsToolbar from './LpSettingsToolbar.vue';

// The ⋮ menu: three tabs, one job each. Sidebars = what is open and how wide;
// HTML tree = the tree's face and the tag colours; Top bar = which icons show.
// lp-more-menu.js builds the props and owns every write; the tabs only report.
const props = defineProps({
  top: { type: Number, required: true },
  right: { type: Number, required: true },
  title: { type: String, required: true },
  // [{ id, label }] — only the tabs that have something to show.
  tabs: { type: Array, required: true },
  tab: { type: String, required: true },
  sidebars: { type: Object, required: true },
  tree: { type: Object, required: true },
  toolbar: { type: Object, required: true },
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
        @click="pick(item.id)"
      >
        {{ item.label }}
      </button>
    </nav>

    <div class="sve-lp-settings__body" role="tabpanel">
      <LpSettingsSidebars v-if="current === 'sidebars'" v-bind="sidebars" :on="on" />
      <LpSettingsTree v-else-if="current === 'tree'" v-bind="tree" :on="on" />
      <LpSettingsToolbar v-else-if="current === 'toolbar'" v-bind="toolbar" :on="on" />
    </div>

    <div class="sve-lp-settings__foot">
      <button type="button" class="sve-lp-settings__reset" :title="resetTitle" @click="onReset">
        {{ resetLabel }}
      </button>
    </div>
  </div>
</template>

<style>
/* Not scoped: the three tab components share these parts. Everything sits
   under .sve-lp-settings, and the menu is the only thing that uses it. */
.sve-lp-settings {
  position: fixed;
  z-index: 2147483001;
  width: 20rem;
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
.sve-lp-settings__tab {
  all: unset;
  box-sizing: border-box;
  flex: 1 1 0;
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
