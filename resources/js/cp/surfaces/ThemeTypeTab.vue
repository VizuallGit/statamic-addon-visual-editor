<template>
  <div class="sve-theme__section">
    <span class="sve-theme__section-title">{{ ui.labels.type_fonts }}</span>
    <label v-for="token in ['font-base', 'font-heading']" :key="token" class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels[token === 'font-base' ? 'type_body' : 'type_headings'] }}</span>
      <span class="sve-theme__input">
        <select :value="firstFamily(ui.type[token])" @change="h.onType(token, withFamily(ui.type[token], $event.target.value))">
          <option v-for="family in familiesWith(ui.type[token])" :key="family" :value="family">{{ family }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>
  </div>

  <div class="sve-theme__section">
    <span class="sve-theme__section-title">{{ ui.labels.type_use }}</span>
    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.type_body_size }}</span>
      <span class="sve-theme__input">
        <select :value="sizeRef(ui.type['font-size']) || ''" @change="h.onType('font-size', `var(--${$event.target.value})`)">
          <option v-for="s in ui.sizes" :key="s.key" :value="s.name">{{ s.name }} · {{ px(s) }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>
    <div class="sve-theme__headings">
      <label v-for="level in HEADINGS" :key="level" class="sve-theme__field">
        <span class="sve-theme__label">{{ level.toUpperCase() }}</span>
        <span class="sve-theme__input">
          <select :value="sizeRef(ui.type[`font-size-${level}`]) || ''" @change="h.onType(`font-size-${level}`, `var(--${$event.target.value})`)">
            <option v-for="s in ui.sizes" :key="s.key" :value="s.name">{{ s.name.replace(/^size-/, '') }}</option>
          </select>
          <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </label>
    </div>
    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.type_line_height }}</span>
      <span class="sve-theme__input">
        <select :value="lineHeight" @change="h.onType('line-height', $event.target.value)">
          <option v-for="l in leadingsWith(lineHeight)" :key="l.value" :value="l.value">{{ l.name ? `${l.name} · ${l.value}` : l.value }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>
    <div class="sve-theme__switch-row">
      <span class="sve-theme__label">{{ ui.labels.type_uppercase }}</span>
      <button
        type="button"
        role="switch"
        class="sve-theme__switch"
        :class="{ 'is-on': ui.type['heading-text-transform'] === 'uppercase' }"
        :aria-checked="ui.type['heading-text-transform'] === 'uppercase'"
        :aria-label="ui.labels.type_uppercase"
        @click="h.onType('heading-text-transform', ui.type['heading-text-transform'] === 'uppercase' ? 'none' : 'uppercase')"
      ><span></span></button>
    </div>
  </div>

  <div class="sve-theme__section">
    <span class="sve-theme__section-title">{{ ui.labels.type_sizes }}</span>
    <p class="sve-theme__hint" style="margin: -0.375rem 0 0">{{ ui.labels.type_sizes_hint }}</p>
    <div class="sve-theme__aa" :style="{ '--sve-theme-aa-font': `'${firstFamily(ui.type['font-heading'])}', ui-sans-serif, system-ui, sans-serif` }">
      <div v-for="s in ui.sizes" :key="s.key" class="sve-theme__aa-row">
        <div class="sve-theme__aa-top">
          <span class="sve-theme__aa-name">--{{ s.name }}</span>
          <span class="sve-theme__aa-uses">
            <span v-for="use in usesOf(s.name)" :key="use">{{ use }}</span>
          </span>
          <span class="sve-theme__aa-px">{{ round(s.min) }} / {{ round(s.max) }} px</span>
        </div>
        <div class="sve-theme__aa-samples">
          <span :style="{ fontSize: `${s.min / 16}rem` }">Aa</span>
          <span :style="{ fontSize: `${s.max / 16}rem` }">Aa</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { HEADINGS, firstFamily, sizeRef, withFamily } from '../theme-panel/presets.js';

defineProps({ h: { type: Object, required: true } });

/** The line height as a number: `var(--leading-normal)` → the token's `1.5`. */
const lineHeight = computed(() => {
  const value = String(ui.type['line-height'] || '').trim();
  const ref = /^var\(\s*--leading-([\w-]+)\s*\)$/.exec(value);

  return ref ? ui.leadings.find((l) => l.name === ref[1])?.value || value : value;
});

function familiesWith(stack) {
  const current = firstFamily(stack);

  return ui.fonts.includes(current) || !current ? ui.fonts : [current, ...ui.fonts];
}

function leadingsWith(value) {
  return ui.leadings.some((l) => l.value === value) || !value ? ui.leadings : [{ name: '', value }, ...ui.leadings];
}

/** What uses a size: "Brødtekst", "H1"… */
function usesOf(name) {
  const uses = [];

  if (sizeRef(ui.type['font-size']) === name) {
    uses.push(ui.labels.type_body || 'Body');
  }

  HEADINGS.forEach((level) => {
    if (sizeRef(ui.type[`font-size-${level}`]) === name) {
      uses.push(level.toUpperCase());
    }
  });

  return uses;
}

function round(px) {
  return Math.round(px * 100) / 100;
}

function px(s) {
  return s.min === s.max ? `${round(s.min)} px` : `${round(s.min)}–${round(s.max)} px`;
}
</script>
