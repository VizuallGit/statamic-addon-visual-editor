<template>
  <div class="sve-theme__section">
    <div class="sve-theme__button-sample">
      <span :style="sample">{{ ui.labels.button_sample }}</span>
    </div>

    <div class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.button_font }}</span>
      <div class="sve-theme__segments" role="radiogroup">
        <button
          v-for="choice in FONT_CHOICES"
          :key="choice.value"
          type="button"
          role="radio"
          :class="{ 'is-on': ui.button['button-font'] === choice.value }"
          :aria-checked="ui.button['button-font'] === choice.value"
          @click="h.onButton('button-font', choice.value)"
        >{{ ui.labels[choice.label] }}</button>
      </div>
    </div>

    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.button_size }}</span>
      <span class="sve-theme__input">
        <select :value="sizeRef(ui.button['button-size']) || ''" @change="h.onButton('button-size', `var(--${$event.target.value})`)">
          <option v-for="s in ui.sizes" :key="s.key" :value="s.name">{{ s.name }} · {{ px(s) }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>

    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.button_weight }}</span>
      <span class="sve-theme__input">
        <select :value="weight" @change="h.onButton('button-weight', $event.target.value)">
          <option v-for="[name, value] in WEIGHTS" :key="value" :value="value">{{ name }} · {{ value }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>

    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.button_radius }}</span>
      <span class="sve-theme__input">
        <select :value="radius" @change="h.onButton('button-radius', $event.target.value)">
          <option v-for="[name, value] in radiiWith(radius)" :key="value" :value="value">{{ name ? `${name} · ${value}` : value }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>

    <div class="sve-theme__switch-row">
      <span class="sve-theme__label">{{ ui.labels.button_uppercase }}</span>
      <button
        type="button"
        role="switch"
        class="sve-theme__switch"
        :class="{ 'is-on': ui.button['button-transform'] === 'uppercase' }"
        :aria-checked="ui.button['button-transform'] === 'uppercase'"
        :aria-label="ui.labels.button_uppercase"
        @click="h.onButton('button-transform', ui.button['button-transform'] === 'uppercase' ? 'none' : 'uppercase')"
      ><span></span></button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { RADII, WEIGHTS, firstFamily, literalOf, sizeRef } from '../theme-panel/presets.js';

defineProps({ h: { type: Object, required: true } });

const FONT_CHOICES = [
  { value: 'var(--font-base)', label: 'type_body' },
  { value: 'var(--font-heading)', label: 'type_headings' },
];

const weight = computed(() => literalOf(ui.button['button-weight'], WEIGHTS, 'font-weight'));
const radius = computed(() => literalOf(ui.button['button-radius'], RADII, 'radius'));

function radiiWith(value) {
  return RADII.some(([, v]) => v === value) || !value ? RADII : [['', value], ...RADII];
}

function px(s) {
  const r = (n) => Math.round(n * 100) / 100;

  return s.min === s.max ? `${r(s.min)} px` : `${r(s.min)}–${r(s.max)} px`;
}

/** A button drawn with the chosen values, in the site's primary color, at its desktop size. */
const sample = computed(() => {
  const size = ui.sizes.find((s) => s.name === sizeRef(ui.button['button-size']));
  const stack = ui.button['button-font'] === 'var(--font-heading)' ? ui.type['font-heading'] : ui.type['font-base'];
  const primary = ui.families.find((f) => f.name === 'primary')?.value || '#0d9488';

  return {
    background: primary,
    color: '#fff',
    fontFamily: `'${firstFamily(stack)}', ui-sans-serif, system-ui, sans-serif`,
    fontSize: size ? `${size.max / 16}rem` : '0.9375rem',
    fontWeight: weight.value,
    borderRadius: radius.value,
    textTransform: ui.button['button-transform'] || 'none',
  };
});
</script>
