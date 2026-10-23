<template>
  <span class="sve-theme__input">
    <span class="sve-theme__forms-swatch" :class="{ 'is-clear': !swatch || swatch === 'transparent' }" :style="swatch && swatch !== 'transparent' ? { background: swatch } : null" aria-hidden="true"></span>
    <select :value="value" :aria-label="label" :data-sve-input="token" @change="onChange($event.target.value)">
      <option v-if="value && !known" :value="value">{{ value }}</option>
      <optgroup v-for="group in groups" :key="group.key" :label="group.label">
        <option v-for="o in group.options" :key="o.value" :value="o.value">{{ o.label }}</option>
      </optgroup>
    </select>
    <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
  </span>
</template>

<script setup>
/**
 * A theme color as a token: white, black and transparent first, then a group
 * per color of the Colors tab — its base, then each step — so a field points at
 * `var(--color-primary-500)` and follows the palette. A value the list does not
 * have (written by hand in site.css) is still shown, as the first option.
 */
import { computed } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { sampleColor } from '../theme-panel/samples.js';

const props = defineProps({
  value: { type: String, default: '' },
  /** The token it writes, for the select's `data-sve-input`. */
  token: { type: String, default: '' },
  label: { type: String, default: '' },
  /** Only the palette's colors — no white, black or transparent (a highlight points at the palette). */
  paletteOnly: { type: Boolean, default: false },
  onChange: { type: Function, required: true },
});

const groups = computed(() => {
  const basics = [
    { value: 'var(--color-white)', label: 'white' },
    { value: 'var(--color-black)', label: 'black' },
    { value: 'transparent', label: ui.labels.forms_transparent || 'transparent' },
  ];
  const seen = new Set(basics.map((o) => o.value));
  const once = (o) => !seen.has(o.value) && seen.add(o.value);
  const families = ui.families
    .filter((f) => f.name && !f.problem)
    .map((f) => ({
      key: `family-${f.name}`,
      label: f.name,
      options: [
        ...(f.value ? [{ value: `var(--color-${f.name})`, label: f.name }] : []),
        ...(f.steps || []).map((s) => ({ value: `var(--color-${f.name}-${s.name})`, label: `${f.name}-${s.name}` })),
      ].filter(once),
    }))
    .filter((g) => g.options.length);

  return props.paletteOnly ? families : [{ key: 'basics', label: ui.labels.forms_basics || '', options: basics }, ...families];
});

const known = computed(() => groups.value.some((g) => g.options.some((o) => o.value === props.value)));

const swatch = computed(() => sampleColor(props.value, ui.families));
</script>
