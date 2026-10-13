<script setup>
import { computed, ref } from 'vue';

// Sidebars tab: the page-settings panel on the left (mode + width) and what
// the right sidebar opens with (panes + width). The panes are per preset: a
// pill per preset, the one on now picked first; All is the pins as they are.
// Ticking for a preset is this user's own choice for it, and on the preset
// that is on now the sidebar follows at once. Local copies so the controls
// answer at once; every change goes straight to lp-more-menu.js.
const props = defineProps({
  panelLabel: { type: String, required: true },
  modes: { type: Array, required: true },
  panelMode: { type: String, required: true },
  editorWidth: { type: Number, required: true },
  sidebarLabel: { type: String, required: true },
  // ":name" is filled with the preset's name.
  presetHint: { type: String, required: true },
  allHint: { type: String, required: true },
  keepHint: { type: String, required: true },
  dockWidth: { type: Number, required: true },
  widthLabel: { type: String, required: true },
  widthMin: { type: Number, required: true },
  widthMax: { type: Number, required: true },
  on: { type: Object, required: true },
});

const panelMode = ref(props.panelMode);
const editorWidth = ref(props.editorWidth);
const dockWidth = ref(props.dockWidth);
// Read when the tab opens: a preset picked on the Top bar tab moves the pins.
const state = props.on.sidebarState();
const tools = ref(state.tools.map((tool) => ({ ...tool })));
const presets = state.presets;
const picked = ref(state.presetId);
const presetPanes = ref({ ...state.presetPanes });

const pickedPanes = computed(() => (picked.value === 'all' ? null : presetPanes.value[picked.value]));
const pickedHint = computed(() => {
  if (picked.value === 'all') {
    return props.allHint;
  }

  if (!pickedPanes.value) {
    return props.keepHint;
  }

  return props.presetHint.replace(':name', presets.find((preset) => preset.id === picked.value)?.label || '');
});

function isOn(tool) {
  return picked.value === 'all' ? tool.on : (pickedPanes.value || []).includes(tool.id);
}

function setMode(id) {
  panelMode.value = id;
  props.on.mode(id);
}

function setTool(id, value) {
  const row = tools.value.find((tool) => tool.id === id);

  if (picked.value !== 'all') {
    const current = presetPanes.value[picked.value] || [];

    presetPanes.value[picked.value] = tools.value
      .map((tool) => tool.id)
      .filter((key) => (key === id ? value : current.includes(key)));
  }

  // The pins follow too when this is All, or the preset that is on now.
  if (props.on.presetPane(picked.value, id, value) && row) {
    row.on = value;
  }
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
    <div class="sve-lp-settings__pills" role="radiogroup" :aria-label="sidebarLabel">
      <span
        v-for="preset in presets"
        :key="preset.id"
        class="sve-lp-settings__pill"
        :class="{ 'is-on': picked === preset.id }"
        :data-sve-sidebar-preset="preset.id"
      >
        <button
          type="button"
          role="radio"
          :aria-checked="picked === preset.id ? 'true' : 'false'"
          @click="picked = preset.id"
        >
          {{ preset.label }}
        </button>
      </span>
    </div>
    <div class="sve-lp-settings__grid">
      <label v-for="tool in tools" :key="tool.id" class="sve-lp-settings__row" :title="tool.label" :data-sve-sidebar-pane="tool.id">
        <input type="checkbox" :checked="isOn(tool)" @change="setTool(tool.id, $event.target.checked)">
        <span>{{ tool.label }}</span>
      </label>
    </div>
    <p class="sve-lp-settings__hint">{{ pickedHint }}</p>
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
