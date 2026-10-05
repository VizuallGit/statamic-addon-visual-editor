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
            :readonly="locked(f) || !f.fresh"
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
            <input v-if="!locked(f)" type="color" :value="hexOf(f.value)" @input="h.onColor(f.key, $event.target.value)">
          </span>
          <input
            type="text"
            :value="f.value"
            :readonly="locked(f)"
            spellcheck="false"
            autocomplete="off"
            @change="h.onColor(f.key, $event.target.value)"
          >
        </span>
      </label>

      <!-- Two ways to make steps: tints and shades around the base, or the full
           50–950 scale on a fixed ladder. A locked color (gray) only shows its steps. -->
      <template v-if="f.value && !locked(f)">
        <div class="sve-theme__rule"></div>
        <div class="sve-theme__segments" role="radiogroup" :aria-label="ui.labels.colors_mode">
          <button
            v-for="mode in MODES"
            :key="mode"
            type="button"
            role="radio"
            :class="{ 'is-on': modeOf(f) === mode }"
            :aria-checked="modeOf(f) === mode"
            :data-sve-color-mode="mode"
            @click="h.onMode(f.key, mode)"
          >{{ ui.labels[`colors_mode_${mode}`] }}</button>
        </div>
      </template>

      <template v-if="f.scale">
        <div class="sve-theme__swatches">
          <span v-for="s in f.steps" :key="s.name" class="sve-theme__swatch" :title="`--${f.name}-${s.name}  ${s.value}`">
            <span class="sve-theme__swatch-color" :style="{ background: s.value }"></span>
            <span class="sve-theme__swatch-name">{{ s.name }}</span>
          </span>
        </div>
        <p class="sve-theme__hint">{{ ui.labels.colors_scale_hint }}</p>
      </template>

      <template v-for="kind in (f.value && !locked(f) && !f.scale ? ['tints', 'shades'] : [])" :key="kind">
        <div class="sve-theme__rule"></div>
        <div class="sve-theme__switch-row">
          <span class="sve-theme__label">{{ ui.labels[`colors_${kind}`] }}</span>
          <span v-if="f[kind]" class="sve-theme__stepper">
            <button type="button" :disabled="f[kind] <= 1" @click="h.onCount(f.key, kind, f[kind] - 1)">−</button>
            <span>{{ f[kind] }}</span>
            <button type="button" :disabled="f[kind] >= MAX_VARIANTS" @click="h.onCount(f.key, kind, f[kind] + 1)">+</button>
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
        <!-- A step is clicked to nudge it a little lighter or darker; the dot says it is. -->
        <div v-if="f.generated && f[kind]" class="sve-theme__swatches">
          <button
            v-for="s in stepsOf(f, kind)"
            :key="s.name"
            type="button"
            class="sve-theme__swatch is-nudgeable"
            :class="{ 'is-picked': isPicked(f, s.name), 'is-nudged': Boolean(f.nudges?.[s.name]) }"
            :title="`--${f.name}-${s.name}  ${s.value} · ${ui.labels.colors_nudge_hint}`"
            :aria-pressed="isPicked(f, s.name)"
            :data-sve-color-step="s.name"
            @click="pick(f, s.name)"
          >
            <span class="sve-theme__swatch-color" :style="{ background: s.value }"></span>
            <span class="sve-theme__swatch-name">{{ s.name }}</span>
          </button>
        </div>
        <div v-for="r in nudgeRows(f, kind)" :key="r.name" class="sve-theme__nudge" data-sve-color-nudge>
          <div class="sve-theme__nudge-head">
            <span class="sve-theme__label">{{ ui.labels.colors_nudge }} · {{ r.name }}</span>
            <span class="sve-theme__nudge-value">{{ nudgeLabel(r.d) }}</span>
            <button type="button" class="sve-theme__nudge-reset" :disabled="!r.d" @click="h.onNudge(f.key, r.name, 0)">{{ ui.labels.colors_nudge_reset }}</button>
          </div>
          <input
            type="range"
            :min="r.min"
            :max="r.max"
            step="0.001"
            :value="r.d"
            :aria-label="`${ui.labels.colors_nudge} --${f.name}-${r.name}`"
            @input="h.onNudge(f.key, r.name, Number($event.target.value))"
          >
          <div class="sve-theme__nudge-ends">
            <span>{{ ui.labels.colors_nudge_darker }}</span>
            <span>{{ ui.labels.colors_nudge_lighter }}</span>
          </div>
        </div>
      </template>

      <!-- Names stay when the color changes; only these two ever take one away. -->
      <template v-if="gone(f).length || canRename(f)">
        <div class="sve-theme__rule"></div>
        <p v-if="gone(f).length" class="sve-theme__note">{{ goneLabel(f) }}</p>
        <div v-if="canRename(f)" class="sve-theme__rename">
          <button type="button" class="sve-theme__add" @click="h.onRenameByLightness(f.key)">{{ ui.labels.colors_rename }}</button>
          <span class="sve-theme__hint">{{ ui.labels.colors_rename_hint }}</span>
        </div>
      </template>

      <template v-if="!f.generated && f.steps.length">
        <div class="sve-theme__rule"></div>
        <span class="sve-theme__label">{{ ui.labels.colors_steps }}</span>
        <div class="sve-theme__swatches">
          <template v-for="s in f.steps" :key="s.name">
            <span v-if="locked(f)" class="sve-theme__swatch" :title="`--${f.name}-${s.name}  ${s.value}`">
              <span class="sve-theme__swatch-color" :style="{ background: s.value }"></span>
              <span class="sve-theme__swatch-name">{{ s.name }}</span>
            </span>
            <label v-else class="sve-theme__swatch is-editable" :title="`--${f.name}-${s.name}  ${s.value}`">
              <span class="sve-theme__swatch-color" :style="{ background: s.value }">
                <input type="color" :value="hexOf(s.value)" @input="h.onStep(f.key, s.name, $event.target.value)">
              </span>
              <span class="sve-theme__swatch-name">{{ s.name }}</span>
            </label>
          </template>
        </div>
        <p v-if="f.value && !locked(f)" class="sve-theme__note">{{ (ui.labels.colors_replace_warning || '').replace(':count', f.steps.length) }}</p>
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
import { reactive } from 'vue';
import { MAX_VARIANTS, hexToOklch, isCoreColor as isCore, namedByLightness, nudgeRange } from '../theme-panel/palette.js';

defineProps({ h: { type: Object, required: true } });

/** The step being nudged: one at a time, in the open color. */
const picked = reactive({ key: '', name: '' });

function isPicked(f, name) {
  return picked.key === f.key && picked.name === name;
}

/** A second click on the same step puts the slider away. */
function pick(f, name) {
  const again = isPicked(f, name);

  picked.key = again ? '' : f.key;
  picked.name = again ? '' : name;
}

/** The slider for the picked step, under its own row — none when it is in the other row or gone. */
function nudgeRows(f, kind) {
  if (picked.key !== f.key || !stepsOf(f, kind).some((s) => s.name === picked.name)) {
    return [];
  }

  const range = nudgeRange(f.value, { tints: f.tints, shades: f.shades }, f.steps, picked.name);

  return range ? [{ name: picked.name, ...range, d: f.nudges?.[picked.name] || 0 }] : [];
}

/** Lightness points, signed: +2.5 is a little lighter. */
function nudgeLabel(d) {
  const points = Math.round(d * 1000) / 10;

  return points > 0 ? `+${points}` : String(points);
}

/** Tints and shades, or the full 50–950 scale. */
const MODES = ['tones', 'scale'];

function modeOf(f) {
  return f.scale ? 'scale' : 'tones';
}

/** Gray is part of every site. It can be opened and read, never edited. */
function locked(f) {
  return isCore(f.name);
}

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

/** Step names that were saved and are not there now: the next save takes them away. */
function gone(f) {
  if (f.fresh) {
    return [];
  }

  const now = new Set(f.steps.map((s) => String(s.name)));

  return (ui.savedSteps[f.name] || []).filter((name) => !now.has(name));
}

function goneLabel(f) {
  return (ui.labels.colors_gone || '').replace(':names', gone(f).map((name) => `${f.name}-${name}`).join(', '));
}

/** A saved color's made steps whose names no longer say how light they are — after a big change of base. */
function canRename(f) {
  return !f.fresh && f.generated && (f.tints || f.shades) && f.steps.length > 0 && !namedByLightness(f, { tints: f.tints, shades: f.shades });
}

function problemLabel(f) {
  return (ui.labels[`colors_name_${f.problem}`] || '').replace(':name', f.name);
}
</script>
