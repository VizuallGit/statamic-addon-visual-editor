<script setup>
import { computed, ref } from 'vue';

// Sidebars tab: the page-settings panel on the left (mode + width) and what
// the right sidebar opens with (panes + width) — for the preset that is on
// (`activeId`, from the presets row on top of the menu). A preset lists its
// own tools that can sit in the sidebar; ticking one is this user's own
// choice for it, and the sidebar follows at once. All lists every sidebar
// tool and ticks the pins as they are. Local copies so the controls answer at
// once; every change goes straight to lp-more-menu.js.
const props = defineProps({
  activeId: { type: String, default: '' },
  panelLabel: { type: String, required: true },
  modes: { type: Array, required: true },
  panelMode: { type: String, required: true },
  editorWidth: { type: Number, required: true },
  sidebarLabel: { type: String, required: true },
  // ":name" is filled with the preset's name.
  presetHint: { type: String, required: true },
  allHint: { type: String, required: true },
  keepHint: { type: String, required: true },
  emptyHint: { type: String, required: true },
  treeHint: { type: String, required: true },
  dockWidth: { type: Number, required: true },
  widthLabel: { type: String, required: true },
  widthMin: { type: Number, required: true },
  widthMax: { type: Number, required: true },
  on: { type: Object, required: true },
});

const panelMode = ref(props.panelMode);
const editorWidth = ref(props.editorWidth);
const dockWidth = ref(props.dockWidth);
// Read when the tab opens; a switch on the presets row opens it again.
const state = props.on.sidebarState(props.activeId || 'all');
const tools = ref(state.tools.map((tool) => ({ ...tool })));
const keep = ref(state.keep);

const title = computed(() => (state.label ? `${props.sidebarLabel} · ${state.label}` : props.sidebarLabel));
const hint = computed(() => {
  if (state.id === 'all') {
    return props.allHint;
  }

  if (!tools.value.length) {
    return props.emptyHint;
  }

  return keep.value ? props.keepHint : props.presetHint.replace(':name', state.label);
});

function setMode(id) {
  panelMode.value = id;
  props.on.mode(id);
}

function setTool(id, value) {
  const row = tools.value.find((tool) => tool.id === id);

  if (row) {
    row.on = value;
  }

  keep.value = false;
  props.on.presetPane(state.id, id, value);
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

  <div class="sve-lp-settings__section">
    <div class="sve-lp-settings__label">{{ title }}</div>
    <div v-if="tools.length || state.tree" class="sve-lp-settings__grid" :data-sve-sidebar-preset="state.id">
      <label v-if="state.tree" class="sve-lp-settings__row is-fixed" :title="treeHint" data-sve-sidebar-pane="html_tree">
        <input type="checkbox" checked disabled>
        <span>{{ state.tree }}</span>
      </label>
      <label v-for="tool in tools" :key="tool.id" class="sve-lp-settings__row" :title="tool.label" :data-sve-sidebar-pane="tool.id">
        <input type="checkbox" :checked="tool.on" @change="setTool(tool.id, $event.target.checked)">
        <span>{{ tool.label }}</span>
      </label>
    </div>
    <p class="sve-lp-settings__hint">{{ hint }}</p>
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
