<script setup>
import { nextTick, ref } from 'vue';

// The presets row on top of the ⋮ menu, above the tabs: All, the site's two
// (Developer, Content editor — edited on the settings screen) and the user's
// own. A click switches to the preset; the menu then shows the Sidebars and
// Top bar tabs for it. lp-more-menu.js owns every write (`on.*`); the menu
// owns which preset is marked (`activeId`) and is told when it changes.
const props = defineProps({
  presets: { type: Array, required: true },
  activeId: { type: String, default: '' },
  presetsLabel: { type: String, required: true },
  newPresetLabel: { type: String, required: true },
  namePlaceholder: { type: String, required: true },
  saveLabel: { type: String, required: true },
  cancelLabel: { type: String, required: true },
  // ":name" is filled with the preset's name.
  deleteLabel: { type: String, required: true },
  editLabel: { type: String, required: true },
  editUrl: { type: String, default: '' },
  nameMax: { type: Number, default: 40 },
  on: { type: Object, required: true },
});

const emit = defineEmits(['switched', 'added', 'deleted']);

function pick(preset) {
  props.on.presetSwitch(preset.id);
  emit('switched', preset.id);
}

const adding = ref(false);
const newName = ref('');
const nameInput = ref(null);

async function startAdding() {
  adding.value = true;
  newName.value = '';
  await nextTick();
  nameInput.value?.focus();
}

function saveNew() {
  const name = newName.value.trim();

  if (!name) {
    nameInput.value?.focus();

    return;
  }

  const preset = props.on.presetSave(name);

  adding.value = false;

  // A new preset is the bar as it stands: it is the one on now.
  if (preset) {
    emit('added', preset);
    pick(preset);
  }
}

function remove(preset) {
  props.on.presetDelete(preset.id);
  emit('deleted', preset.id);
}

const deleteTitle = (preset) => props.deleteLabel.replace(':name', preset.label);
</script>

<template>
  <div class="sve-lp-settings__section">
    <div class="sve-lp-settings__line">
      <span class="sve-lp-settings__label">{{ presetsLabel }}</span>
      <a
        v-if="editUrl"
        class="sve-lp-settings__link"
        :href="editUrl"
        target="_blank"
        rel="noopener"
        data-sve-toolbar-presets-edit
      >{{ editLabel }} ↗</a>
    </div>
    <div class="sve-lp-settings__pills" role="radiogroup" :aria-label="presetsLabel">
      <span
        v-for="preset in presets"
        :key="preset.id"
        class="sve-lp-settings__pill"
        :class="{ 'is-on': activeId === preset.id, 'is-own': preset.own }"
        :data-sve-toolbar-preset="preset.id"
      >
        <button type="button" role="radio" :aria-checked="activeId === preset.id ? 'true' : 'false'" @click="pick(preset)">
          {{ preset.label }}
        </button>
        <button
          v-if="preset.own"
          type="button"
          class="sve-lp-settings__pill-x"
          :title="deleteTitle(preset)"
          :aria-label="deleteTitle(preset)"
          data-sve-toolbar-preset-delete
          @click="remove(preset)"
        >×</button>
      </span>
      <button
        v-if="!adding"
        type="button"
        class="sve-lp-settings__pill is-add"
        data-sve-toolbar-preset-new
        @click="startAdding"
      >+ {{ newPresetLabel }}</button>
    </div>
    <form v-if="adding" class="sve-lp-settings__name" @submit.prevent="saveNew" @keydown.escape.stop.prevent="adding = false">
      <input
        ref="nameInput"
        v-model="newName"
        type="text"
        :maxlength="nameMax"
        :placeholder="namePlaceholder"
        :aria-label="newPresetLabel"
        data-sve-toolbar-preset-name
      >
      <button type="submit" class="sve-lp-settings__small is-primary" data-sve-toolbar-preset-save>{{ saveLabel }}</button>
      <button type="button" class="sve-lp-settings__small" @click="adding = false">{{ cancelLabel }}</button>
    </form>
  </div>
</template>
