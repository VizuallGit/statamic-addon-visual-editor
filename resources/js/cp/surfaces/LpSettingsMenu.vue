<script setup>
import { ref } from 'vue';

const props = defineProps({
  top: { type: Number, required: true },
  right: { type: Number, required: true },
  title: { type: String, required: true },
  panelLabel: { type: String, required: true },
  sidebarLabel: { type: String, required: true },
  widthLabel: { type: String, required: true },
  resetLabel: { type: String, required: true },
  resetTitle: { type: String, required: true },
  modes: { type: Array, required: true },
  panelMode: { type: String, required: true },
  editorWidth: { type: Number, required: true },
  dockWidth: { type: Number, required: true },
  widthMin: { type: Number, required: true },
  widthMax: { type: Number, required: true },
  tools: { type: Array, required: true },
  codeDock: { type: Object, required: true },
  // The HTML tree's face: on = coloured tag chips, off = the classic cards.
  htmlTree: { type: Object, default: () => ({ show: false, on: true, label: '' }) },
  // The tag families' colours — one picker each, read by the tree and the code.
  familyColors: { type: Object, default: () => ({ show: false, label: '', resetLabel: '', rows: [] }) },
  onMode: { type: Function, required: true },
  onWidth: { type: Function, required: true },
  onTool: { type: Function, required: true },
  onCodeDock: { type: Function, required: true },
  onHtmlTree: { type: Function, default: null },
  onFamilyColor: { type: Function, default: null },
  onFamilyReset: { type: Function, default: null },
  onReset: { type: Function, required: true },
  onClose: { type: Function, required: true },
});

const panelMode = ref(props.panelMode);
const editorWidth = ref(props.editorWidth);
const dockWidth = ref(props.dockWidth);
const tools = ref(props.tools.map((tool) => ({ ...tool })));
const codeDockOn = ref(props.codeDock.on);
const htmlTreeOn = ref(props.htmlTree.on);
const familyRows = ref(props.familyColors.rows.map((row) => ({ ...row })));

function setMode(id) {
  panelMode.value = id;
  props.onMode(id);
}

function setTool(id, on) {
  const row = tools.value.find((tool) => tool.id === id);

  if (row) {
    row.on = on;
  }

  props.onTool(id, on);
}

function setEditorWidth(value) {
  editorWidth.value = value;
  props.onWidth('editor', value);
}

function setDockWidth(value) {
  dockWidth.value = value;
  props.onWidth('dock', value);
}

function setCodeDock(on) {
  codeDockOn.value = on;
  props.onCodeDock(on);
}

function setHtmlTree(on) {
  htmlTreeOn.value = on;
  props.onHtmlTree?.(on);
}

function setFamilyColor(id, hex) {
  const row = familyRows.value.find((item) => item.id === id);

  if (row) {
    row.value = hex;
  }

  props.onFamilyColor?.(id, hex);
}

function resetFamilyColors() {
  familyRows.value.forEach((row) => {
    row.value = row.def;
  });
  props.onFamilyReset?.();
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

    <div class="sve-lp-settings__section">
      <div class="sve-lp-settings__label">{{ panelLabel }}</div>
      <div class="sve-lp-settings__modes" role="radiogroup" :aria-label="panelLabel">
        <button
          v-for="mode in modes"
          :key="mode.id"
          type="button"
          role="radio"
          :aria-checked="panelMode === mode.id ? 'true' : 'false'"
          :class="{ 'is-on': panelMode === mode.id }"
          @click="setMode(mode.id)"
        >
          {{ mode.label }}
        </button>
      </div>
      <label class="sve-lp-settings__range">
        <span>{{ widthLabel }}</span>
        <span class="sve-lp-settings__px">{{ editorWidth }}px</span>
        <input
          type="range"
          :min="widthMin"
          :max="widthMax"
          :value="editorWidth"
          @input="setEditorWidth(Number($event.target.value))"
        >
      </label>
    </div>

    <div v-if="tools.length" class="sve-lp-settings__section">
      <div class="sve-lp-settings__label">{{ sidebarLabel }}</div>
      <label v-for="tool in tools" :key="tool.id" class="sve-lp-settings__row">
        <input type="checkbox" :checked="tool.on" @change="setTool(tool.id, $event.target.checked)">
        <span>{{ tool.label }}</span>
      </label>
      <label class="sve-lp-settings__range">
        <span>{{ widthLabel }}</span>
        <span class="sve-lp-settings__px">{{ dockWidth }}px</span>
        <input
          type="range"
          :min="widthMin"
          :max="widthMax"
          :value="dockWidth"
          @input="setDockWidth(Number($event.target.value))"
        >
      </label>
    </div>

    <div v-if="codeDock.show || htmlTree.show" class="sve-lp-settings__section">
      <label v-if="codeDock.show" class="sve-lp-settings__row">
        <input type="checkbox" :checked="codeDockOn" @change="setCodeDock($event.target.checked)">
        <span>{{ codeDock.label }}</span>
      </label>
      <label v-if="htmlTree.show" class="sve-lp-settings__row">
        <input type="checkbox" :checked="htmlTreeOn" @change="setHtmlTree($event.target.checked)">
        <span>{{ htmlTree.label }}</span>
      </label>
    </div>

    <div v-if="familyColors.show" class="sve-lp-settings__section">
      <div class="sve-lp-settings__label">{{ familyColors.label }}</div>
      <label v-for="row in familyRows" :key="row.id" class="sve-lp-settings__row">
        <input
          type="color"
          class="sve-lp-settings__swatch"
          :value="row.value"
          @input="setFamilyColor(row.id, $event.target.value)"
        >
        <span>{{ row.label }}</span>
      </label>
      <button type="button" class="sve-lp-settings__small" @click="resetFamilyColors">
        {{ familyColors.resetLabel }}
      </button>
    </div>

    <div class="sve-lp-settings__foot">
      <button type="button" class="sve-lp-settings__reset" :title="resetTitle" @click="onReset">
        {{ resetLabel }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.sve-lp-settings {
  position: fixed;
  z-index: 2147483001;
  width: 300px;
  max-height: calc(100vh - 72px);
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 8px;
  border-radius: 10px;
  background: #343439;
  color: rgba(255, 255, 255, 0.92);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.12);
  font: 500 13px/1.3 ui-sans-serif, system-ui, sans-serif;
  outline: none;
}
.sve-lp-settings__title {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px 10px;
}
.sve-lp-settings__section {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 8px;
  border-radius: 8px;
  background: #2c2c31;
  margin-bottom: 8px;
}
.sve-lp-settings__label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  opacity: 0.55;
}
.sve-lp-settings__modes {
  display: flex;
  gap: 4px;
}
.sve-lp-settings__modes button {
  all: unset;
  cursor: pointer;
  flex: 1 1 0;
  text-align: center;
  padding: 6px 4px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
}
.sve-lp-settings__modes button.is-on {
  background: color-mix(in oklab, var(--theme-color-primary, #4f46e5) 90%, transparent);
  color: #fff;
}
.sve-lp-settings__row {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
}
.sve-lp-settings__row input {
  margin: 0;
  accent-color: var(--theme-color-primary, #4f46e5);
}
/* The picker is the swatch: no chrome around the colour it holds. */
.sve-lp-settings__swatch {
  appearance: none;
  -webkit-appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: none;
  cursor: pointer;
}
.sve-lp-settings__swatch::-webkit-color-swatch-wrapper {
  padding: 0;
}
.sve-lp-settings__swatch::-webkit-color-swatch {
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 4px;
}
.sve-lp-settings__small {
  all: unset;
  cursor: pointer;
  align-self: flex-start;
  padding: 5px 9px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
}
.sve-lp-settings__small:hover {
  background: rgba(255, 255, 255, 0.16);
}
.sve-lp-settings__range {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 8px;
  align-items: center;
  font-size: 12px;
  opacity: 0.9;
}
.sve-lp-settings__range input[type='range'] {
  grid-column: 1 / -1;
  width: 100%;
  margin: 0;
  accent-color: var(--theme-color-primary, #4f46e5);
}
.sve-lp-settings__px {
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
}
.sve-lp-settings__foot {
  margin-top: 2px;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.sve-lp-settings__reset {
  all: unset;
  cursor: pointer;
  display: block;
  box-sizing: border-box;
  width: 100%;
  padding: 9px 8px;
  border-radius: 7px;
  text-align: center;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.12);
}
.sve-lp-settings__reset:hover {
  background: rgba(255, 255, 255, 0.18);
}
</style>
