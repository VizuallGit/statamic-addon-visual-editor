<script setup>
import { computed, ref } from 'vue';

// Top bar tab: one row per icon in the row, left to right. The box says
// whether the icon shows; Open presses a hidden one (toolbar-visibility.js).
// The list is read off the toolbar itself, so a tool this user may not use —
// no button — is not in it, and there is no second list to keep in step.
const props = defineProps({
  label: { type: String, required: true },
  hint: { type: String, required: true },
  emptyLabel: { type: String, required: true },
  openLabel: { type: String, required: true },
  closeLabel: { type: String, required: true },
  showAllLabel: { type: String, required: true },
  // [{ key, label, icon, shown, open, here }]
  tools: { type: Array, required: true },
  on: { type: Object, required: true },
});

const tools = ref(props.tools.map((tool) => ({ ...tool })));
const anyHidden = computed(() => tools.value.some((tool) => !tool.shown));

function setShown(key, value) {
  const row = tools.value.find((tool) => tool.key === key);

  if (row) {
    row.shown = value;
  }

  props.on.toolbarShown(key, value);
}

function showAll() {
  tools.value.forEach((tool) => {
    tool.shown = true;
  });
  props.on.toolbarShowAll();
}
</script>

<template>
  <div class="sve-lp-settings__section is-tight">
    <div class="sve-lp-settings__line">
      <span class="sve-lp-settings__label">{{ label }}</span>
      <button v-if="anyHidden" type="button" class="sve-lp-settings__small" data-sve-toolbar-all @click="showAll">
        {{ showAllLabel }}
      </button>
    </div>
    <p v-if="!tools.length" class="sve-lp-settings__hint">{{ emptyLabel }}</p>
    <div
      v-for="tool in tools"
      :key="tool.key"
      class="sve-lp-settings__tool"
      :class="{ 'is-off': !tool.shown }"
      :data-sve-toolbar-tool="tool.key"
    >
      <label class="sve-lp-settings__row" :title="tool.label">
        <input type="checkbox" :checked="tool.shown" @change="setShown(tool.key, $event.target.checked)">
        <span class="sve-lp-settings__tool-icon" aria-hidden="true" v-html="tool.icon"></span>
        <span class="sve-lp-settings__tool-name">{{ tool.label }}</span>
      </label>
      <button
        v-if="!tool.shown && tool.here"
        type="button"
        class="sve-lp-settings__small"
        data-sve-toolbar-open
        @click="on.toolbarOpen(tool.key)"
      >
        {{ tool.open ? closeLabel : openLabel }}
      </button>
    </div>
    <p v-if="tools.length" class="sve-lp-settings__hint">{{ hint }}</p>
  </div>
</template>
