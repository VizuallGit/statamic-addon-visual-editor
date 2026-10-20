<template>
  <div class="sve-theme__section">
    <div
      class="sve-theme__forms-sample"
      :class="{ 'is-focusing': focusing }"
      :style="card"
      data-sve-forms-sample
    >
      <input type="text" class="sve-theme__forms-field" autocomplete="off" :placeholder="ui.labels.forms_sample_input" :style="field">
      <textarea class="sve-theme__forms-field" rows="2" :placeholder="ui.labels.forms_sample_textarea" :style="area"></textarea>
      <div class="sve-theme__forms-foot">
        <div class="sve-theme__forms-checks" :style="{ fontSize: field.fontSize }">
          <label><input type="checkbox" checked :style="check"> {{ ui.labels.forms_sample_check }}</label>
          <label><input type="radio" checked :style="check"> {{ ui.labels.forms_sample_radio }}</label>
        </div>
        <span class="sve-theme__forms-send" :style="button">{{ ui.labels.forms_sample_send }}</span>
      </div>
    </div>

    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.forms_bg }}</span>
      <ThemeColorSelect token="input-bg" :value="ui.input['input-bg']" :label="ui.labels.forms_bg" :on-change="(v) => h.onInput('input-bg', v)" />
    </label>

    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.forms_opacity }}</span>
      <span class="sve-theme__input">
        <select data-sve-input="input-bg-opacity" :value="ui.input['input-bg-opacity']" @change="h.onInput('input-bg-opacity', $event.target.value)">
          <option v-for="[, value] in opacities" :key="value" :value="value">{{ value }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>

    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.forms_color }}</span>
      <ThemeColorSelect token="input-color" :value="ui.input['input-color']" :label="ui.labels.forms_color" :on-change="(v) => h.onInput('input-color', v)" />
    </label>

    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.forms_size }}</span>
      <span class="sve-theme__input">
        <select data-sve-input="input-size" :value="sizeRef(ui.input['input-size']) || ''" @change="h.onInput('input-size', `var(--${$event.target.value})`)">
          <option v-for="s in ui.sizes" :key="s.key" :value="s.name">{{ s.name }} · {{ sizeLabel(s) }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>

    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.forms_radius }}</span>
      <span class="sve-theme__input">
        <select data-sve-input="input-radius" :value="radius" @change="h.onInput('input-radius', $event.target.value)">
          <option v-for="[name, value] in withCurrent(RADII, radius)" :key="value" :value="value">{{ name ? `${name} · ${value}` : value }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>

    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.forms_border }}</span>
      <span class="sve-theme__input">
        <select data-sve-input="input-border-width" :value="ui.input['input-border-width']" @change="h.onInput('input-border-width', $event.target.value)">
          <option v-for="[name, value] in withCurrent(BORDERS, ui.input['input-border-width'])" :key="value" :value="value">{{ name ? `${ui.labels[`forms_border_${name}`]} · ${value}` : value }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>

    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.forms_border_color }}</span>
      <ThemeColorSelect token="input-border-color" :value="ui.input['input-border-color']" :label="ui.labels.forms_border_color" :on-change="(v) => h.onInput('input-border-color', v)" />
    </label>

    <label class="sve-theme__field" @focusin="focusing = true" @focusout="focusing = false">
      <span class="sve-theme__label">{{ ui.labels.forms_focus }}</span>
      <ThemeColorSelect token="input-focus" :value="ui.input['input-focus']" :label="ui.labels.forms_focus" :on-change="(v) => h.onInput('input-focus', v)" />
    </label>

    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.forms_accent }}</span>
      <ThemeColorSelect token="input-accent" :value="ui.input['input-accent']" :label="ui.labels.forms_accent" :on-change="(v) => h.onInput('input-accent', v)" />
    </label>

    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.forms_check_size }}</span>
      <span class="sve-theme__input">
        <select data-sve-input="input-check-size" :value="ui.input['input-check-size']" @change="h.onInput('input-check-size', $event.target.value)">
          <option v-for="[name, value] in withCurrent(CHECK_SIZES, ui.input['input-check-size'])" :key="value" :value="value">{{ name ? `${ui.labels[`forms_check_${name}`]} · ${value}` : value }}</option>
        </select>
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </label>
  </div>
</template>

<script setup>
/**
 * Forms: the site's text inputs, textareas and selects, and its checkboxes and
 * radios, through the `--input-*` tokens — as the Button tab does `.btn` with
 * `--button-*`. A sample on top draws them with the chosen values, a Send
 * button with the button's; each row writes one token.
 */
import { computed, ref } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { BORDERS, CHECK_SIZES, OPACITIES, RADII, literalOf, sizeRef, withCurrent } from '../theme-panel/presets.js';
import { buttonSample, checkSample, fieldSample, sampleColor, sampleFont, sizeLabel } from '../theme-panel/samples.js';
import ThemeColorSelect from './ThemeColorSelect.vue';

defineProps({ h: { type: Object, required: true } });

/** While the Focus row is in use, the sample's text field wears its focus ring. */
const focusing = ref(false);

const radius = computed(() => literalOf(ui.input['input-radius'], RADII, 'radius'));
const opacities = computed(() => withCurrent(OPACITIES.map((v) => [v, v]), ui.input['input-bg-opacity']));

/** The page around the fields: the body font, and the focus ring's color for the stylesheet's `:focus` rule. */
const card = computed(() => ({
  fontFamily: sampleFont(ui.type['font-base']),
  fontWeight: ui.type['body-weight'] || '400',
  '--sve-forms-focus': sampleColor(ui.input['input-focus'], ui.families) || '#0d9488',
}));

const field = computed(() => fieldSample(ui));
const area = computed(() => ({ ...field.value, minHeight: '3.5rem', resize: 'none' }));
const check = computed(() => checkSample(ui));
const button = computed(() => buttonSample(ui));
</script>
