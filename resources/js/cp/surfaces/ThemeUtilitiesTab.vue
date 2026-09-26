<template>
  <p class="sve-theme__hint">{{ ui.labels.utilities_hint }}</p>
  <p v-if="ui.buildNote" class="sve-theme__note" data-sve-utility-build-note>{{ ui.buildNote }}</p>
  <p v-if="!ui.utilities.length" class="sve-theme__empty">{{ ui.labels.utilities_empty }}</p>

  <section
    v-for="u in ui.utilities"
    :key="u.key"
    class="sve-theme__card"
    :class="{ 'is-open': ui.openUtility === u.key }"
    :data-sve-utility="u.name"
  >
    <button type="button" class="sve-theme__row" :aria-expanded="ui.openUtility === u.key" @click="h.onOpenUtility(u.key)">
      <span class="sve-theme__utility-mark" aria-hidden="true">.</span>
      <span class="sve-theme__row-text">
        <span class="sve-theme__token">{{ u.name || '…' }}</span>
        <span class="sve-theme__meta">{{ summary(u) }}</span>
      </span>
      <span v-if="unsaved(u)" class="sve-theme__utility-dot" :title="ui.labels.utilities_unsaved"></span>
    </button>

    <div v-if="ui.openUtility === u.key" class="sve-theme__card-body">
      <template v-if="u.fresh">
        <label class="sve-theme__field">
          <span class="sve-theme__label">{{ ui.labels.utilities_name }}</span>
          <span class="sve-theme__input" :class="{ 'is-bad': u.problem && u.problem !== 'braces' }">
            <span class="sve-theme__dashes">.</span>
            <input
              type="text"
              :value="u.name"
              spellcheck="false"
              autocomplete="off"
              data-sve-utility-name
              @input="h.onUtilityName(u.key, $event.target.value)"
            >
          </span>
        </label>
      </template>
      <p v-if="u.problem" class="sve-theme__utility-problem">{{ problemLabel(u) }}</p>

      <ThemeUtilityEditor
        :value="u.body"
        :label="`${ui.labels.utilities_css} .${u.name}`"
        :on-change="(body) => h.onUtilityBody(u.key, body)"
        :on-save="h.onSave"
      />
      <p v-if="u.name" class="sve-theme__hint">{{ (ui.labels.utilities_use || '').replaceAll(':name', u.name) }}</p>

      <button type="button" class="sve-theme__remove" @click="h.onRemoveUtility(u.key)">{{ ui.labels.utilities_remove }}</button>
    </div>
  </section>
</template>

<script setup>
import { themePanelUi as ui } from '../theme-panel/store.js';
import { bodyProperties, dedent } from '../theme-panel/utilities.js';
import ThemeUtilityEditor from './ThemeUtilityEditor.vue';

defineProps({ h: { type: Object, required: true } });

/** What the utility sets, in a line: `padding, background-color`. */
function summary(u) {
  return bodyProperties(u.body).join(', ') || ui.labels.utilities_no_props;
}

function unsaved(u) {
  return u.fresh || ui.savedUtilities[u.name] !== dedent(u.body);
}

function problemLabel(u) {
  return u.problem === 'braces' ? ui.labels.utilities_braces : ui.labels[`utilities_name_${u.problem}`] || '';
}
</script>
