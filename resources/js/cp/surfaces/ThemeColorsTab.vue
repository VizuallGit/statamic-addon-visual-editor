<template>
  <section
    v-for="f in ui.families"
    :key="f.key"
    class="sve-theme__card"
    :class="{ 'is-open': ui.openKey === f.key }"
  >
    <button type="button" class="sve-theme__row" @click="h.onOpen(f.key)">
      <span class="sve-theme__chip" :style="{ background: f.value || f.steps[0]?.value }"></span>
      <span class="sve-theme__row-text">
        <span class="sve-theme__token">--{{ f.name || '…' }}</span>
        <span class="sve-theme__meta">{{ f.steps.length ? stepsLabel(f) : ui.labels.colors_no_steps }}</span>
      </span>
    </button>

    <div v-if="ui.openKey === f.key" class="sve-theme__card-body">
      <label class="sve-theme__field">
        <span class="sve-theme__label">{{ ui.labels.colors_name }}</span>
        <span class="sve-theme__input" :class="{ 'is-bad': f.problem }">
          <span class="sve-theme__dashes">--</span>
          <input
            type="text"
            :value="f.name"
            :readonly="!f.fresh"
            spellcheck="false"
            autocomplete="off"
            @input="h.onName(f.key, $event.target.value)"
          >
        </span>
      </label>
      <p v-if="f.problem" class="sve-theme__problem">{{ problemLabel(f) }}</p>

      <label class="sve-theme__field">
        <span class="sve-theme__label">{{ ui.labels.colors_color }}</span>
        <span class="sve-theme__input">
          <span class="sve-theme__picker" :style="{ background: f.value }">
            <input type="color" :value="hexOf(f.value)" @input="h.onColor(f.key, $event.target.value)">
          </span>
          <input
            type="text"
            :value="f.value"
            spellcheck="false"
            autocomplete="off"
            @change="h.onColor(f.key, $event.target.value)"
          >
        </span>
      </label>

      <!-- Tints and shades are made from the base; a family of steps only (the gray scale) keeps its steps. -->
      <template v-for="kind in (f.value ? ['tints', 'shades'] : [])" :key="kind">
        <div class="sve-theme__rule"></div>
        <div class="sve-theme__switch-row">
          <span class="sve-theme__label">{{ ui.labels[`colors_${kind}`] }}</span>
          <span v-if="f[kind]" class="sve-theme__stepper">
            <button type="button" :disabled="f[kind] <= 1" @click="h.onCount(f.key, kind, f[kind] - 1)">−</button>
            <span>{{ f[kind] }}</span>
            <button type="button" :disabled="f[kind] >= 5" @click="h.onCount(f.key, kind, f[kind] + 1)">+</button>
          </span>
          <button
            type="button"
            role="switch"
            class="sve-theme__switch"
            :class="{ 'is-on': f[kind] > 0 }"
            :aria-checked="f[kind] > 0"
            :aria-label="ui.labels[`colors_${kind}`]"
            @click="h.onToggle(f.key, kind, !f[kind])"
          ><span></span></button>
        </div>
        <div v-if="f.generated && f[kind]" class="sve-theme__swatches">
          <span v-for="s in stepsOf(f, kind)" :key="s.name" class="sve-theme__swatch" :title="`--${f.name}-${s.name}  ${s.value}`">
            <span class="sve-theme__swatch-color" :style="{ background: s.value }"></span>
            <span class="sve-theme__swatch-name">{{ s.name }}</span>
          </span>
        </div>
      </template>

      <template v-if="!f.generated && f.steps.length">
        <div class="sve-theme__rule"></div>
        <span class="sve-theme__label">{{ ui.labels.colors_steps }}</span>
        <div class="sve-theme__swatches">
          <label v-for="s in f.steps" :key="s.name" class="sve-theme__swatch is-editable" :title="`--${f.name}-${s.name}  ${s.value}`">
            <span class="sve-theme__swatch-color" :style="{ background: s.value }">
              <input type="color" :value="hexOf(s.value)" @input="h.onStep(f.key, s.name, $event.target.value)">
            </span>
            <span class="sve-theme__swatch-name">{{ s.name }}</span>
          </label>
        </div>
        <p v-if="f.value" class="sve-theme__note">{{ (ui.labels.colors_replace_warning || '').replace(':count', f.steps.length) }}</p>
      </template>

      <template v-if="!isCore(f.name)">
        <div class="sve-theme__rule"></div>
        <button type="button" class="sve-theme__remove" @click="h.onRemoveColor(f.key)">{{ ui.labels.colors_remove }}</button>
      </template>
    </div>
  </section>
</template>

<script setup>
import { themePanelUi as ui } from '../theme-panel/store.js';
import { hexToOklch, isCoreColor as isCore } from '../theme-panel/palette.js';

defineProps({ h: { type: Object, required: true } });

/** A native color input only takes `#rrggbb`. */
function hexOf(value) {
  const v = String(value || '').trim();

  if (/^#[0-9a-f]{6}$/i.test(v)) {
    return v.toLowerCase();
  }

  if (/^#[0-9a-f]{3}$/i.test(v)) {
    return `#${v.slice(1).replace(/./g, '$&$&')}`.toLowerCase();
  }

  return '#000000';
}

/** Tints are the steps lighter than the base, shades the darker ones. */
function stepsOf(f, kind) {
  const base = hexToOklch(f.value)?.l ?? 0.5;

  return f.steps.filter((s) => {
    const l = hexToOklch(s.value)?.l ?? base;

    return kind === 'tints' ? l > base : l <= base;
  });
}

function stepsLabel(f) {
  const first = f.steps[0].name;
  const last = f.steps[f.steps.length - 1].name;

  return f.steps.length === 1 ? first : `${f.steps.length} · ${first}–${last}`;
}

function problemLabel(f) {
  return (ui.labels[`colors_name_${f.problem}`] || '').replace(':name', f.name);
}
</script>
