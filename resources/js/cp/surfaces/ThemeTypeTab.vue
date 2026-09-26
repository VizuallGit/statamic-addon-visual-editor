<template>
  <div class="sve-theme__section" data-sve-type-body>
    <span class="sve-theme__section-title">{{ ui.labels.type_body }}</span>
    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.type_font }}</span>
      <span class="sve-theme__input">
        <select :value="firstFamily(ui.type['font-base'])" @change="h.onType('font-base', withFamily(ui.type['font-base'], $event.target.value))">
          <option v-for="family in familiesWith(ui.type['font-base'])" :key="family" :value="family">{{ family }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>
    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.type_size }}</span>
      <span class="sve-theme__input">
        <select :value="sizeRef(ui.type['font-size']) || ''" @change="h.onType('font-size', `var(--${$event.target.value})`)">
          <option v-for="o in sizeOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>
    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.type_weight }}</span>
      <span class="sve-theme__input">
        <select :value="bodyWeight" data-sve-type="body-weight" @change="h.onType('body-weight', $event.target.value)">
          <option v-for="o in withCurrent(weightOptions(ui.type['font-base']), bodyWeight)" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>
    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.type_line_height }}</span>
      <span class="sve-theme__input">
        <select :value="bodyLeading" data-sve-type="line-height" @change="h.onType('line-height', $event.target.value)">
          <option v-for="o in withCurrent(leadingOptions, bodyLeading)" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>
  </div>

  <div class="sve-theme__section" data-sve-type-headings>
    <span class="sve-theme__section-title">{{ ui.labels.type_headings }}</span>
    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.type_font }}</span>
      <span class="sve-theme__input">
        <select :value="firstFamily(ui.type['font-heading'])" @change="h.onType('font-heading', withFamily(ui.type['font-heading'], $event.target.value))">
          <option v-for="family in familiesWith(ui.type['font-heading'])" :key="family" :value="family">{{ family }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>
    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.type_weight }}</span>
      <span class="sve-theme__input">
        <select :value="headingWeight" data-sve-type="heading-weight" @change="h.onType('heading-weight', $event.target.value)">
          <option v-for="o in withCurrent(weightOptions(ui.type['font-heading']), headingWeight)" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>
    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.type_line_height }}</span>
      <span class="sve-theme__input">
        <select :value="headingLeading" data-sve-type="heading-line-height" @change="h.onType('heading-line-height', $event.target.value)">
          <option v-for="o in withCurrent(leadingOptions, headingLeading)" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>
    <div class="sve-theme__switch-row">
      <span class="sve-theme__label">{{ ui.labels.type_capitals }}</span>
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

    <!-- Each level: its size, and a weight and line height of its own or the headings' (dimmed). -->
    <div class="sve-theme__levels" data-sve-type-levels>
      <span></span>
      <span class="sve-theme__levels-head">{{ ui.labels.type_size }}</span>
      <span class="sve-theme__levels-head">{{ ui.labels.type_weight }}</span>
      <span class="sve-theme__levels-head">{{ ui.labels.type_line_height }}</span>
      <template v-for="level in HEADINGS" :key="level">
        <span class="sve-theme__level-name">{{ level.toUpperCase() }}</span>
        <ThemeLevelCell
          :value="sizeRef(ui.type[`font-size-${level}`]) || ''"
          :options="sizeOptions"
          :label="`${level.toUpperCase()} · ${ui.labels.type_size}`"
          :on-change="(v) => h.onType(`font-size-${level}`, `var(--${v})`)"
          :data-sve-type-cell="`${level}-size`"
        />
        <ThemeLevelCell
          :value="ui.type[`${level}-weight`] || ''"
          :inherit="headingWeight"
          :inherit-label="followText(headingWeight)"
          :options="weightOptions(ui.type['font-heading'])"
          overridable
          :label="`${level.toUpperCase()} · ${ui.labels.type_weight}`"
          :on-change="(v) => h.onType(`${level}-weight`, v)"
          :data-sve-type-cell="`${level}-weight`"
        />
        <ThemeLevelCell
          :value="leading(ui.type[`${level}-line-height`])"
          :inherit="headingLeading"
          :inherit-label="followText(headingLeading)"
          :options="leadingOptions"
          overridable
          :label="`${level.toUpperCase()} · ${ui.labels.type_line_height}`"
          :on-change="(v) => h.onType(`${level}-line-height`, v)"
          :data-sve-type-cell="`${level}-line-height`"
        />
      </template>
    </div>
    <p class="sve-theme__hint" style="margin: 0">{{ ui.labels.type_levels_hint }}</p>
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
import { HEADINGS, TYPE_DEFAULTS, firstFamily, sizeRef, withFamily } from '../theme-panel/presets.js';
import { WEIGHT_NAMES, hasVariant } from '../theme-panel/font-helpers.js';
import { installedFamily } from '../theme-panel/fonts.js';
import ThemeLevelCell from './ThemeLevelCell.vue';

defineProps({ h: { type: Object, required: true } });

/** A token as the page has it: the file's value, else what the site's CSS falls back to. */
const valueOf = (token) => ui.type[token] || TYPE_DEFAULTS[token] || '';

/** A line height as a number: `var(--leading-normal)` → the token's `1.5`. */
function leading(value) {
  const v = String(value || '').trim();
  const ref = /^var\(\s*--leading-([\w-]+)\s*\)$/.exec(v);

  return ref ? ui.leadings.find((l) => l.name === ref[1])?.value || v : v;
}

const bodyWeight = computed(() => valueOf('body-weight'));
const bodyLeading = computed(() => leading(valueOf('line-height')));
const headingWeight = computed(() => valueOf('heading-weight'));
const headingLeading = computed(() => leading(valueOf('heading-line-height')));

const sizeOptions = computed(() => ui.sizes.map((s) => ({ value: s.name, label: `${s.name} · ${px(s)}`, short: s.name.replace(/^size-/, '') })));
const leadingOptions = computed(() => ui.leadings.map((l) => ({ value: l.value, label: `${l.name} · ${l.value}`, short: l.value })));

/** The weights the family has (an installed one says which); every weight when it is not known. */
function weightOptions(stack) {
  const family = installedFamily(firstFamily(stack));
  const all = Object.keys(WEIGHT_NAMES).map(Number);
  const has = family ? all.filter((w) => hasVariant(family, w, false)) : all;

  return (has.length ? has : all).map((w) => ({ value: String(w), label: `${w} · ${WEIGHT_NAMES[w]}`, short: String(w) }));
}

/** A value the list does not offer (written by hand) stays a choice. */
function withCurrent(options, current) {
  return !current || options.some((o) => o.value === current) ? options : [{ value: current, label: current, short: current }, ...options];
}

const followText = (value) => String(ui.labels.type_follow || ':value').replace(':value', value);

function familiesWith(stack) {
  const current = firstFamily(stack);

  return ui.fonts.includes(current) || !current ? ui.fonts : [current, ...ui.fonts];
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
