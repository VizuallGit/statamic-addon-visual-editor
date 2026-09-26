<template>
  <p class="sve-theme__hint">{{ ui.labels.props_hint }}</p>
  <p v-if="!ui.props.length" class="sve-theme__empty">{{ ui.labels.props_empty }}</p>

  <section
    v-for="p in ui.props"
    :key="p.key"
    class="sve-theme__card"
    :class="{ 'is-open': ui.openProp === p.key }"
    :data-sve-prop="p.name"
  >
    <button type="button" class="sve-theme__row" :aria-expanded="ui.openProp === p.key" @click="h.onOpenProp(p.key)">
      <span class="sve-theme__row-text">
        <span class="sve-theme__token">--{{ p.name || '…' }}</span>
        <span class="sve-theme__meta">{{ p.value || '…' }}</span>
      </span>
    </button>

    <div v-if="ui.openProp === p.key" class="sve-theme__card-body">
      <label class="sve-theme__field">
        <span class="sve-theme__label">{{ ui.labels.props_name }}</span>
        <span class="sve-theme__input" :class="{ 'is-bad': nameBad(p) }">
          <span class="sve-theme__dashes">--</span>
          <input
            type="text"
            :value="p.name"
            :readonly="!p.fresh"
            spellcheck="false"
            autocomplete="off"
            data-sve-prop-name
            @input="h.onPropName(p.key, $event.target.value)"
          >
        </span>
      </label>

      <label class="sve-theme__field">
        <span class="sve-theme__label">{{ ui.labels.props_value }}</span>
        <span class="sve-theme__input" :class="{ 'is-bad': valueBad(p) }">
          <input
            type="text"
            :value="p.value"
            spellcheck="false"
            autocomplete="off"
            data-sve-prop-value
            @input="h.onPropValue(p.key, $event.target.value)"
          >
        </span>
      </label>
      <p v-if="p.problem" class="sve-theme__problem">{{ problemLabel(p) }}</p>

      <button type="button" class="sve-theme__remove" @click="h.onRemoveProp(p.key)">{{ ui.labels.props_remove }}</button>
    </div>
  </section>
</template>

<script setup>
import { themePanelUi as ui } from '../theme-panel/store.js';

defineProps({ h: { type: Object, required: true } });

function nameBad(p) {
  return p.problem === 'empty' || p.problem === 'chars' || p.problem === 'taken';
}

function valueBad(p) {
  return p.problem === 'value' || p.problem === 'valuechars';
}

function problemLabel(p) {
  const key = {
    empty: 'props_name_empty',
    chars: 'props_name_chars',
    taken: 'props_name_taken',
    value: 'props_value_empty',
    valuechars: 'props_value_chars',
  }[p.problem];

  return (ui.labels[key] || '').replace(':name', p.name);
}
</script>
