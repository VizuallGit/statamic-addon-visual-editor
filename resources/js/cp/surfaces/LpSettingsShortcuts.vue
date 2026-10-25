<script setup>
import { computed, ref } from 'vue';
import ShortcutInput from './ShortcutInput.vue';
import { conflictsWith, resolveShortcuts } from '../../lib/shortcuts.js';

// Shortcuts tab: this user's own keyboard shortcuts. Top bar lists every icon
// — hidden ones too, Page settings first — with its icon and name as the Top
// bar tab shows them; Screen sizes lists the sizes. One recorder per row:
// greyed out is the site's shortcut, which applies until the user records
// their own. A shortcut another action has is moved here on a yes, and that
// one gets none, in this user's own layer. Reset shortcuts empties that layer.
// lp-more-menu.js builds the rows and owns every write (`on.*`); the layers
// are read back after each, so storage decides what shows.
const props = defineProps({
  toolbarLabel: { type: String, required: true },
  sizesLabel: { type: String, required: true },
  hint: { type: String, required: true },
  resetLabel: { type: String, required: true },
  emptyLabel: { type: String, required: true },
  // [{ action: 'tool:pages', label, icon }] — the bar's icons, in its order.
  tools: { type: Array, required: true },
  // [{ action: 'size:laptop', label, icon }] — widest first, as the buttons stand.
  sizes: { type: Array, required: true },
  mac: { type: Boolean, required: true },
  on: { type: Object, required: true },
});

const layers = ref(props.on.shortcutLayers());

function read() {
  layers.value = props.on.shortcutLayers();
}

const active = computed(() => resolveShortcuts(layers.value.builtIn, layers.value.site, layers.value.user));
const sites = computed(() => resolveShortcuts(layers.value.builtIn, layers.value.site, {}));
const names = computed(() => Object.fromEntries([...props.tools, ...props.sizes].map((row) => [row.action, row.label])));
const anyOwn = computed(() => Object.keys(layers.value.user).length > 0);

/** Who else has a shortcut: any action, as the user's own layer can give every one of them none. */
function ownerFor(action) {
  return (combo) => {
    const other = conflictsWith(active.value, combo, action);

    return other ? { action: other, label: names.value[other] || other, movable: true } : null;
  };
}

function change(action, value, moveFrom) {
  props.on.shortcutSet(action, value, moveFrom);
  read();
}

function reset() {
  props.on.shortcutsReset();
  read();
}

const groups = computed(() => [
  { id: 'toolbar', label: props.toolbarLabel, rows: props.tools },
  { id: 'sizes', label: props.sizesLabel, rows: props.sizes },
]);
</script>

<template>
  <div
    v-for="group in groups"
    :key="group.id"
    class="sve-lp-settings__section is-tight"
    :data-sve-shortcuts-group="group.id"
  >
    <span class="sve-lp-settings__label">{{ group.label }}</span>
    <p v-if="!group.rows.length" class="sve-lp-settings__hint">{{ emptyLabel }}</p>
    <div
      v-for="row in group.rows"
      :key="row.action"
      class="sve-lp-settings__tool"
      :data-sve-shortcut-row="row.action"
    >
      <span class="sve-lp-settings__shortcut-name" :title="row.label">
        <span v-if="row.icon" class="sve-lp-settings__tool-icon" aria-hidden="true" v-html="row.icon"></span>
        <span class="sve-lp-settings__tool-name">{{ row.label }}</span>
      </span>
      <ShortcutInput
        :value="layers.user[row.action] || ''"
        :inherited="sites[row.action] || ''"
        :mac="mac"
        :locked="layers.locked"
        :owner="ownerFor(row.action)"
        :label="row.label"
        @change="(value, moveFrom) => change(row.action, value, moveFrom)"
      />
    </div>
  </div>
  <div class="sve-lp-settings__line">
    <span class="sve-lp-settings__hint">{{ hint }}</span>
    <button v-if="anyOwn" type="button" class="sve-lp-settings__small" data-sve-shortcuts-reset @click="reset">
      {{ resetLabel }}
    </button>
  </div>
</template>
