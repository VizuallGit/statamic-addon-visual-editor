<template>
  <div class="sve-colors">
    <header class="sve-colors__head">
      <span class="sve-colors__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="1" fill="currentColor" stroke="none"/><circle cx="17.5" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="8.5" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="6.5" cy="12.5" r="1" fill="currentColor" stroke="none"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z"/></svg>
      </span>
      <span class="sve-colors__titles">
        <span class="sve-colors__title">{{ ui.labels.title }}</span>
        <span class="sve-colors__subtitle">{{ ui.labels.subtitle }}</span>
      </span>
      <button type="button" class="sve-colors__ghost-icon" :title="ui.labels.close" @click="onClose">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </header>

    <div class="sve-colors__actions">
      <button type="button" class="sve-colors__add" @click="onAdd">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
        {{ ui.labels.add }}
      </button>
      <span class="sve-colors__status">{{ ui.status }}</span>
      <button type="button" class="sve-colors__save" :disabled="!ui.dirty || ui.saving" @click="onSave">{{ ui.labels.save }}</button>
    </div>

    <div class="sve-colors__list">
      <p v-if="ui.loading" class="sve-colors__empty">{{ ui.labels.loading }}</p>

      <section
        v-for="f in ui.families"
        :key="f.key"
        class="sve-colors__card"
        :class="{ 'is-open': ui.openKey === f.key }"
      >
        <button type="button" class="sve-colors__row" @click="onOpen(f.key)">
          <span class="sve-colors__chip" :style="{ background: f.value || f.steps[0]?.value }"></span>
          <span class="sve-colors__row-text">
            <span class="sve-colors__token">--{{ f.name || '…' }}</span>
            <span class="sve-colors__meta">{{ f.steps.length ? stepsLabel(f) : ui.labels.no_steps }}</span>
          </span>
        </button>

        <div v-if="ui.openKey === f.key" class="sve-colors__body">
          <label class="sve-colors__field">
            <span class="sve-colors__label">{{ ui.labels.name }}</span>
            <span class="sve-colors__input sve-colors__input--name" :class="{ 'is-bad': f.problem }">
              <span class="sve-colors__dashes">--</span>
              <input
                type="text"
                :value="f.name"
                :readonly="!f.fresh"
                spellcheck="false"
                autocomplete="off"
                @input="onName(f.key, $event.target.value)"
              >
            </span>
          </label>
          <p v-if="f.problem" class="sve-colors__problem">{{ problemLabel(f) }}</p>

          <label class="sve-colors__field">
            <span class="sve-colors__label">{{ ui.labels.color }}</span>
            <span class="sve-colors__input">
              <span class="sve-colors__picker" :style="{ background: f.value }">
                <input type="color" :value="hexOf(f.value)" @input="onColor(f.key, $event.target.value)">
              </span>
              <input
                type="text"
                :value="f.value"
                spellcheck="false"
                autocomplete="off"
                @change="onColor(f.key, $event.target.value)"
              >
            </span>
          </label>

          <template v-for="kind in ['tints', 'shades']" :key="kind">
            <div class="sve-colors__rule"></div>
            <div class="sve-colors__switch-row">
              <span class="sve-colors__label">{{ ui.labels[kind] }}</span>
              <span v-if="f[kind]" class="sve-colors__stepper">
                <button type="button" :disabled="f[kind] <= 1" @click="onCount(f.key, kind, f[kind] - 1)">−</button>
                <span>{{ f[kind] }}</span>
                <button type="button" :disabled="f[kind] >= 5" @click="onCount(f.key, kind, f[kind] + 1)">+</button>
              </span>
              <button
                type="button"
                role="switch"
                class="sve-colors__switch"
                :class="{ 'is-on': f[kind] > 0 }"
                :aria-checked="f[kind] > 0"
                :aria-label="ui.labels[kind]"
                @click="onToggle(f.key, kind, !f[kind])"
              ><span></span></button>
            </div>
            <div v-if="f.generated && f[kind]" class="sve-colors__swatches">
              <span
                v-for="s in stepsOf(f, kind)"
                :key="s.name"
                class="sve-colors__swatch"
                :title="`--${f.name}-${s.name}  ${s.value}`"
              >
                <span class="sve-colors__swatch-color" :style="{ background: s.value }"></span>
                <span class="sve-colors__swatch-name">{{ s.name }}</span>
              </span>
            </div>
          </template>

          <template v-if="!f.generated && f.steps.length">
            <div class="sve-colors__rule"></div>
            <span class="sve-colors__label">{{ ui.labels.steps }}</span>
            <div class="sve-colors__swatches">
              <label
                v-for="s in f.steps"
                :key="s.name"
                class="sve-colors__swatch is-editable"
                :title="`--${f.name}-${s.name}  ${s.value}`"
              >
                <span class="sve-colors__swatch-color" :style="{ background: s.value }">
                  <input type="color" :value="hexOf(s.value)" @input="onStep(f.key, s.name, $event.target.value)">
                </span>
                <span class="sve-colors__swatch-name">{{ s.name }}</span>
              </label>
            </div>
            <p class="sve-colors__note">{{ ui.labels.replace_warning.replace(':count', f.steps.length) }}</p>
          </template>

          <div class="sve-colors__rule"></div>
          <button type="button" class="sve-colors__remove" @click="onRemove(f.key)">{{ ui.labels.remove }}</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { themeColorsUi as ui } from '../theme-colors/store.js';
import { hexToOklch } from '../theme-colors/palette.js';

defineProps({
  onClose: { type: Function, required: true },
  onSave: { type: Function, required: true },
  onAdd: { type: Function, required: true },
  onOpen: { type: Function, required: true },
  onName: { type: Function, required: true },
  onColor: { type: Function, required: true },
  onToggle: { type: Function, required: true },
  onCount: { type: Function, required: true },
  onStep: { type: Function, required: true },
  onRemove: { type: Function, required: true },
});

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
  return (ui.labels[`name_${f.problem}`] || '').replace(':name', f.name);
}
</script>

<style scoped>
.sve-colors {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #1E1E21;
  color: #d4d4d4;
  border-left: 1px solid #3c3c3c;
  font: 500 0.8125rem/1.3 ui-sans-serif, system-ui, sans-serif;
}
.sve-colors button {
  font: inherit;
  color: inherit;
  line-height: 1;
}
.sve-colors__head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 0.875rem 0.75rem;
  flex: none;
}
.sve-colors__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.625rem;
  background: rgba(13, 148, 136, 0.18);
  color: #5eead4;
  flex: none;
}
.sve-colors__icon svg {
  width: 1.25rem;
  height: 1.25rem;
}
.sve-colors__titles {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
  flex: 1;
}
.sve-colors__title {
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 650;
}
.sve-colors__subtitle {
  font-size: 0.75rem;
  opacity: 0.55;
}
.sve-colors__ghost-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 0.5rem;
  background: transparent;
  cursor: pointer;
  flex: none;
}
.sve-colors__ghost-icon svg {
  width: 1.05em;
  height: 1.05em;
}
.sve-colors__ghost-icon:hover {
  background: rgba(255, 255, 255, 0.08);
}
.sve-colors__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.875rem 0.75rem;
  border-bottom: 1px solid #3c3c3c;
  flex: none;
}
.sve-colors__add {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  height: 2rem;
  padding: 0 0.75rem;
  border: 0;
  border-radius: 0.625rem;
  background: rgba(255, 255, 255, 0.07);
  font-weight: 600;
  cursor: pointer;
}
.sve-colors__add svg {
  width: 1em;
  height: 1em;
}
.sve-colors__add:hover {
  background: rgba(255, 255, 255, 0.12);
}
.sve-colors__status {
  margin-left: auto;
  font-size: 0.75rem;
  opacity: 0.7;
}
.sve-colors__save {
  height: 2rem;
  padding: 0 0.875rem;
  border: 0;
  border-radius: 0.625rem;
  background: #0d9488;
  color: #fff !important;
  font-weight: 600;
  cursor: pointer;
}
.sve-colors__save:disabled {
  background: #2a2a2a;
  color: inherit !important;
  opacity: 0.5;
  cursor: default;
}
.sve-colors__list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.625rem;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}
.sve-colors__empty {
  margin: 1rem 0.5rem;
  opacity: 0.6;
}
.sve-colors__card {
  border: 1px solid transparent;
  border-radius: 1rem;
  background: #26262a;
}
.sve-colors__card.is-open {
  border-color: #3c3c3c;
  background: #222225;
}
.sve-colors__row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem;
  border: 0;
  border-radius: 1rem;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.sve-colors__row:hover {
  background: rgba(255, 255, 255, 0.04);
}
.sve-colors__chip {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
  flex: none;
}
.sve-colors__row-text {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}
.sve-colors__token {
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 650;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sve-colors__meta {
  font-size: 0.75rem;
  opacity: 0.5;
}
.sve-colors__body {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.25rem 0.875rem 0.875rem;
}
.sve-colors__field {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  align-items: center;
  gap: 0.75rem;
}
.sve-colors__label {
  font-weight: 600;
  opacity: 0.75;
}
.sve-colors__input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 2.375rem;
  padding: 0 0.75rem;
  border: 1px solid #3c3c3c;
  border-radius: 0.875rem;
  background: #161618;
  min-width: 0;
}
.sve-colors__input:focus-within {
  border-color: #0d9488;
}
.sve-colors__input.is-bad {
  border-color: #f2a2a2;
}
.sve-colors__input input[type='text'] {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  font: inherit;
  font-size: 0.875rem;
}
.sve-colors__input input[readonly] {
  color: #d4d4d4;
}
.sve-colors__dashes {
  flex: none;
  white-space: nowrap;
  opacity: 0.45;
  letter-spacing: 0.1em;
}
.sve-colors__picker {
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
  overflow: hidden;
  flex: none;
}
.sve-colors__picker input,
.sve-colors__swatch-color input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.sve-colors__problem {
  margin: -0.25rem 0 0 6.25rem;
  color: #f2a2a2;
  font-size: 0.75rem;
}
.sve-colors__rule {
  height: 1px;
  background: #3c3c3c;
  margin: 0.125rem 0;
}
.sve-colors__switch-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-height: 2.25rem;
}
.sve-colors__switch-row .sve-colors__label {
  flex: 1;
}
.sve-colors__switch {
  position: relative;
  width: 2.5rem;
  height: 1.5rem;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: #3a3a3f;
  cursor: pointer;
  flex: none;
  transition: background 0.15s;
}
.sve-colors__switch span {
  position: absolute;
  top: 0.1875rem;
  left: 0.1875rem;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  background: #e5e5e5;
  transition: transform 0.15s;
}
.sve-colors__switch.is-on {
  background: #0d9488;
}
.sve-colors__switch.is-on span {
  transform: translateX(1rem);
  background: #fff;
}
.sve-colors__stepper {
  display: inline-flex;
  align-items: stretch;
  height: 2.125rem;
  border: 1px solid #3c3c3c;
  border-radius: 0.75rem;
  overflow: hidden;
}
.sve-colors__stepper button,
.sve-colors__stepper span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.125rem;
  border: 0;
  background: transparent;
  font-size: 0.9375rem;
  font-weight: 600;
}
.sve-colors__stepper span {
  border-left: 1px solid #3c3c3c;
  border-right: 1px solid #3c3c3c;
  color: #fff;
}
.sve-colors__stepper button {
  cursor: pointer;
}
.sve-colors__stepper button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
}
.sve-colors__stepper button:disabled {
  opacity: 0.3;
  cursor: default;
}
.sve-colors__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.sve-colors__swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}
.sve-colors__swatch-color {
  position: relative;
  display: block;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.625rem;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}
.sve-colors__swatch.is-editable .sve-colors__swatch-color:hover {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}
.sve-colors__swatch-name {
  font-size: 0.6875rem;
  opacity: 0.55;
  font-variant-numeric: tabular-nums;
}
.sve-colors__note {
  margin: 0;
  font-size: 0.75rem;
  color: #fcd34d;
  opacity: 0.85;
}
.sve-colors__remove {
  align-self: flex-start;
  height: 1.875rem;
  padding: 0 0.625rem;
  border: 0;
  border-radius: 0.5rem;
  background: transparent;
  color: #f2a2a2 !important;
  font-weight: 600;
  cursor: pointer;
}
.sve-colors__remove:hover {
  background: rgba(242, 162, 162, 0.1);
}
</style>
