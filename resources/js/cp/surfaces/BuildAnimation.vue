<script setup>
/**
 * The picked element's Animation tab: its animation as one chip, what it
 * animates (the element, or its children in turn), when, and how long; under
 * it the presets library. A tile applies its preset and keeps the rest.
 *
 * Everything is read from the dock's file and written back through the port
 * in one write (build-mode/animation.js), as Action's changes are. ▶ replays
 * the element's CSS animations on Build's canvas, where no script holds them.
 */
import { computed, inject } from 'vue';
import PRESETS from '../../../animation/presets.json';
import { animationOf, groupPresets, newAnimation, RUNTIME_DEFAULTS, TARGETS, withAnimation } from '../../build-mode/animation.js';
import { CANVAS_PATH } from '../../build-mode/canvas-paint.js';
import { ic } from '../../build-mode/icons.js';
import { findByPath } from '../../build-mode/place.js';
import { parseTemplateTree } from '../../html-tree-parse.js';
import { buildCanvasFrame } from '../../lib/build-canvas.js';

const props = defineProps({
  node: { type: Object, required: true },
});

const port = inject('sveBuild');
const path = computed(() => props.node.path);

const anim = computed(() => {
  port.rev.value;

  const html = port.html();

  return animationOf(html, findByPath(parseTemplateTree(html), path.value));
});

const PLAY = '<svg class="bm-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
const GROUPS = groupPresets(PRESETS);
const current = computed(() => PRESETS.find((preset) => preset.handle === anim.value?.preset) || null);
const label = (preset) => preset[port.t('anim_label')];

/** [trigger, icon, word, later]: the two the runtime has, then the ones still to come. */
const TRIGGERS = [
  ['view', 'eye', 'anim_on_view', false],
  ['scroll', 'chev', 'anim_on_scroll', true],
  ['load', 'zap', 'anim_on_load', false],
  ['hover', 'cursor', 'anim_on_hover', true],
  ['switch', 'button', 'anim_on_switch', true],
  ['mouse', 'svg', 'anim_on_mouse', true],
];

const times = computed(() => [
  ['duration', 'anim_duration'],
  ['delay', 'anim_delay'],
  ...(anim.value?.target === 'children' ? [['step', 'anim_step']] : []),
]);

function write(next) {
  port.write(withAnimation(port.html(), path.value, next), { select: path.value });
}

function apply(handle) {
  write({ ...(anim.value || newAnimation(handle)), preset: handle });
}

function setTarget(target) {
  write({ ...anim.value, target, step: target === 'children' ? anim.value.step : null });
}

function setTime(key, event) {
  const raw = event.target.value.trim();
  const ms = raw === '' ? null : Math.round(Number(raw));

  if (ms !== null && !(ms >= 0)) {
    event.target.value = anim.value[key] ?? '';

    return;
  }

  write({ ...anim.value, [key]: ms });
}

function play() {
  const doc = buildCanvasFrame(window)?.contentDocument;
  const el = doc?.querySelector(`[${CANVAS_PATH}="${CSS.escape(path.value)}"]`);

  for (const animation of el?.getAnimations({ subtree: true }) || []) {
    animation.cancel();
    animation.play();
  }
}
</script>

<template>
  <div class="bm-anim" data-sve-build-animation>
    <div class="fg-lab">{{ port.t('anim_on_element') }}</div>
    <template v-if="anim">
      <div class="bm-anim-chip" data-sve-build-anim-chip>
        <span v-html="ic(anim.on === 'load' ? 'zap' : 'eye')"></span>
        <b>{{ port.t(`anim_target_${anim.target}`) }}</b>
        <span v-if="current" class="bm-anim-chip__sub">· {{ label(current) }}</span>
      </div>
      <div class="bm-anim-acts">
        <button type="button" class="bm-anim-btn" :title="port.t('anim_play_tip')" data-sve-build-anim-play @click="play">
          <span v-html="PLAY"></span>{{ port.t('anim_play') }}
        </button>
        <button type="button" class="bm-anim-btn" data-sve-build-anim-remove @click="write(null)">
          <span v-html="ic('trash')"></span>{{ port.t('anim_remove') }}
        </button>
      </div>

      <div class="fg-lab">{{ port.t('anim_target') }}</div>
      <div class="fg-seg">
        <button
          v-for="target in TARGETS"
          :key="target"
          type="button"
          :aria-pressed="anim.target === target"
          :data-sve-build-anim-target="target"
          @click="setTarget(target)"
        >{{ port.t(`anim_target_${target}`) }}</button>
      </div>

      <div class="fg-lab">{{ port.t('anim_trigger') }}</div>
      <div class="bm-anim-triggers">
        <button
          v-for="[on, icon, word, later] in TRIGGERS"
          :key="on"
          type="button"
          :disabled="later"
          :aria-pressed="anim.on === on"
          :data-sve-build-anim-on="on"
          @click="write({ ...anim, on })"
        >
          <span v-html="ic(icon)"></span>
          <span class="bm-anim-triggers__word">{{ port.t(word) }}</span>
          <em v-if="later" class="bm-soon">{{ port.t('anim_soon') }}</em>
        </button>
      </div>

      <div class="fg-lab">{{ port.t('anim_timing') }}</div>
      <div class="fg-grid">
        <label v-for="[key, word] in times" :key="key" class="fg-cell">
          <span class="fg-lab">{{ port.t(word) }}</span>
          <span class="fg-field">
            <input
              class="bm-vin"
              type="number"
              min="0"
              step="50"
              :value="anim[key] ?? ''"
              :placeholder="RUNTIME_DEFAULTS[key]"
              :data-sve-build-anim-time="key"
              @change="setTime(key, $event)"
            />
            <span class="fg-suf">ms</span>
          </span>
        </label>
      </div>
    </template>
    <p v-else class="fg-hint" data-sve-build-anim-none>{{ port.t('anim_none') }}</p>

    <div class="fg-lab">{{ port.t('anim_library') }}</div>
    <div v-for="[group, presets] in GROUPS" :key="group" class="bm-anim-group">
      <h4>{{ port.t(`anim_group_${group}`) }}</h4>
      <div class="bm-anim-tiles">
        <button
          v-for="preset in presets"
          :key="preset.handle"
          type="button"
          class="bm-anim-tile"
          :aria-pressed="anim?.preset === preset.handle"
          :data-sve-build-anim-preset="preset.handle"
          @click="apply(preset.handle)"
        >{{ label(preset) }}</button>
      </div>
    </div>
  </div>
</template>

<style>
/* Under the panel's root, `bm-anim-` only: the tab's own pieces beside the panel's shared ones (BuildPanel.vue). */
.sve-build .bm-anim { display: grid; gap: 0.5rem; padding-bottom: 0.75rem; }
.sve-build .bm-anim > .fg-lab { margin-top: 0.5rem; }
.sve-build .bm-anim > .fg-lab:first-child { margin-top: 0; }
.sve-build .bm-anim-chip { display: flex; align-items: center; gap: 0.5rem; min-width: 0; height: 1.875rem; padding: 0 0.5rem; border-radius: 0.375rem; background: var(--bm-accent-soft); border: 1px solid var(--bm-accent); color: var(--bm-ink); font-size: 0.75rem; }
.sve-build .bm-anim-chip > span:first-child { color: var(--bm-accent-text); }
.sve-build .bm-anim-chip b { flex: none; font-weight: 600; }
.sve-build .bm-anim-chip__sub { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--bm-muted); }
.sve-build .bm-anim-acts { display: flex; gap: 0.375rem; }
.sve-build .bm-anim-btn { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.375rem; height: 1.875rem; border: 1px solid var(--bm-line); border-radius: 0.375rem; color: var(--bm-muted); font-size: 0.75rem; white-space: nowrap; }
.sve-build .bm-anim-btn:hover { background: var(--bm-raise); color: var(--bm-ink); }
.sve-build .bm-anim-btn .bm-ic { width: 0.8125rem; height: 0.8125rem; }
.sve-build .bm-anim-triggers { display: grid; gap: 0.0625rem; }
.sve-build .bm-anim-triggers button { display: flex; align-items: center; gap: 0.625rem; min-height: 1.75rem; padding: 0.25rem 0.5rem; border-radius: 0.375rem; color: var(--bm-ink); font-size: 0.75rem; text-align: start; }
.sve-build .bm-anim-triggers button > span:first-child { color: var(--bm-accent-text); }
.sve-build .bm-anim-triggers .bm-ic { width: 0.875rem; height: 0.875rem; }
.sve-build .bm-anim-triggers__word { flex: 1; min-width: 0; }
.sve-build .bm-anim-triggers button:hover:not(:disabled) { background: var(--bm-hover); }
.sve-build .bm-anim-triggers button[aria-pressed='true'] { background: var(--bm-raise); }
.sve-build .bm-anim-triggers button:disabled { cursor: default; color: var(--bm-faint); }
.sve-build .bm-anim-triggers button:disabled > span:first-child { color: var(--bm-faint); }
.sve-build .bm-anim-group h4 { margin: 0.25rem 0 0.375rem; font-size: 0.6875rem; font-weight: 600; color: var(--bm-muted); }
.sve-build .bm-anim-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr)); gap: 0.375rem; }
.sve-build .bm-anim-tile { min-width: 0; padding: 0.55rem 0.4rem; border-radius: 0.375rem; background: var(--bm-raise); border: 1px solid transparent; color: var(--bm-ink); font-size: 0.6875rem; text-align: center; overflow-wrap: anywhere; }
.sve-build .bm-anim-tile:hover { border-color: var(--bm-accent); background: var(--bm-hover); }
.sve-build .bm-anim-tile[aria-pressed='true'] { border-color: var(--bm-accent); background: var(--bm-accent-soft); color: var(--bm-accent-text); }
</style>
