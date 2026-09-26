<script setup>
import { ref } from 'vue';

// Sidebars tab: the page-settings panel on the left (mode + width) and what
// the right sidebar opens with (panes + width). Local copies so the controls
// answer at once; every change goes straight to lp-more-menu.js.
const props = defineProps({
  panelLabel: { type: String, required: true },
  modes: { type: Array, required: true },
  panelMode: { type: String, required: true },
  editorWidth: { type: Number, required: true },
  sidebarLabel: { type: String, required: true },
  tools: { type: Array, required: true },
  dockWidth: { type: Number, required: true },
  widthLabel: { type: String, required: true },
  widthMin: { type: Number, required: true },
  widthMax: { type: Number, required: true },
  on: { type: Object, required: true },
});

const panelMode = ref(props.panelMode);
const editorWidth = ref(props.editorWidth);
const dockWidth = ref(props.dockWidth);
const tools = ref(props.tools.map((tool) => ({ ...tool })));

function setMode(id) {
  panelMode.value = id;
  props.on.mode(id);
}

function setTool(id, value) {
  const row = tools.value.find((tool) => tool.id === id);

  if (row) {
    row.on = value;
  }

  props.on.tool(id, value);
}

function setEditorWidth(value) {
  editorWidth.value = value;
  props.on.width('editor', value);
}

function setDockWidth(value) {
  dockWidth.value = value;
  props.on.width('dock', value);
}
</script>

<template>
  <div class="sve-lp-settings__section">
    <div class="sve-lp-settings__line">
      <span class="sve-lp-settings__label">{{ panelLabel }}</span>
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
    </div>
    <label class="sve-lp-settings__range">
      <span>{{ widthLabel }}</span>
      <input
        type="range"
        :min="widthMin"
        :max="widthMax"
        :value="editorWidth"
        :aria-label="panelLabel + ' – ' + widthLabel"
        @input="setEditorWidth(Number($event.target.value))"
      >
      <span class="sve-lp-settings__px">{{ editorWidth }}px</span>
    </label>
  </div>

  <div v-if="tools.length" class="sve-lp-settings__section">
    <div class="sve-lp-settings__label">{{ sidebarLabel }}</div>
    <div class="sve-lp-settings__grid">
      <label v-for="tool in tools" :key="tool.id" class="sve-lp-settings__row" :title="tool.label">
        <input type="checkbox" :checked="tool.on" @change="setTool(tool.id, $event.target.checked)">
        <span>{{ tool.label }}</span>
      </label>
    </div>
    <label class="sve-lp-settings__range">
      <span>{{ widthLabel }}</span>
      <input
        type="range"
        :min="widthMin"
        :max="widthMax"
        :value="dockWidth"
        :aria-label="sidebarLabel + ' – ' + widthLabel"
        @input="setDockWidth(Number($event.target.value))"
      >
      <span class="sve-lp-settings__px">{{ dockWidth }}px</span>
    </label>
  </div>
</template>
