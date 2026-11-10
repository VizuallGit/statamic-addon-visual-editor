<script setup>
/**
 * «Page transition» in Build's Animation tab, in the library's place as a
 * kind's gallery is (BuildAnimation.vue); ← goes back to the library.
 *
 * The element flies to the element with the same pair name on the next page
 * (build-mode/page-transition.js). A motion tile puts it on that motion with
 * the pair name and what it matches by; changing those changes one that is
 * on. Nothing plays here: a page transition runs between two real pages.
 */
import { computed, inject, ref, watch } from 'vue';
import { parseTemplateTree } from '../../html-tree-parse.js';
import { findByPath } from '../../build-mode/place.js';
import { KEYS, MOTIONS, MOTION_BASE, MOTION_MS, cleanPair, defaultPair, keyFor, motionPath, pageTransitionOf, withPageTransition } from '../../build-mode/page-transition.js';

const props = defineProps({
  node: { type: Object, required: true },
});

const emit = defineEmits(['back']);

const port = inject('sveBuild');
const t = (key, params) => port.t(key, params);
const path = computed(() => props.node.path);
const html = computed(() => (port.rev.value, port.html()));
const current = computed(() => pageTransitionOf(html.value, findByPath(parseTemplateTree(html.value), path.value)));

const BACK = '<svg class="bm-anim-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';

const pair = ref('');
const key = ref(KEYS.page);

watch(
  () => [path.value, current.value?.pair, current.value?.key],
  () => {
    pair.value = current.value?.pair || defaultPair(props.node);
    key.value = current.value?.key || keyFor(html.value, path.value);
  },
  { immediate: true }
);

const preview = computed(() => `${cleanPair(pair.value) || defaultPair(props.node)}-${key.value}`);
const seconds = (motion) => `${MOTION_MS[motion] / 1000} s`;

function write(next) {
  port.write(withPageTransition(port.html(), path.value, next), { select: path.value });
}

function pickMotion(motion) {
  write({ pair: pair.value, key: key.value, motion });
}

function setPair() {
  pair.value = cleanPair(pair.value) || defaultPair(props.node);

  if (current.value) {
    write({ ...current.value, pair: pair.value });
  }
}

function setKey(next) {
  key.value = next;

  if (current.value) {
    write({ ...current.value, key: next });
  }
}
</script>

<template>
  <div class="bm-anim-gal bm-pt" data-sve-build-page-transition>
    <div class="bm-anim-gal__head">
      <button type="button" class="bm-anim-gal__back" :aria-label="t('anim_gallery_back')" :title="t('anim_gallery_back')" data-sve-build-anim-gallery-back @click="emit('back')" v-html="BACK"></button>
      <b>{{ t('anim_r_page') }}</b>
    </div>
    <p class="bm-anim-note">{{ t('pt_hint') }}</p>

    <label class="bm-anim-line">
      <span>{{ t('pt_pair') }}</span>
      <input v-model="pair" class="bm-anim-name" type="text" spellcheck="false" autocomplete="off" data-sve-build-pt-pair @change="setPair" @keydown.enter="$event.target.blur()" />
    </label>
    <div class="bm-anim-line">
      <span>{{ t('pt_match') }}</span>
      <span class="bm-anim-seg" role="group" :aria-label="t('pt_match')">
        <button type="button" :aria-pressed="key === KEYS.page" data-sve-build-pt-key="page" @click="setKey(KEYS.page)">{{ t('pt_match_page') }}</button>
        <button type="button" :aria-pressed="key === KEYS.loop" data-sve-build-pt-key="loop" @click="setKey(KEYS.loop)">{{ t('pt_match_loop') }}</button>
      </span>
    </div>
    <code class="bm-pt-name" :title="preview" data-sve-build-pt-name>{{ preview }}</code>

    <div class="bm-anim-head"><span>{{ t('pt_motion') }}</span></div>
    <div class="bm-anim-gal__grid">
      <div v-for="m in MOTIONS" :key="m" class="bm-anim-gal__cell">
        <button type="button" class="bm-anim-gal__tile" :aria-pressed="current?.motion === m" :data-sve-build-pt-motion="m" @click="pickMotion(m)">
          <span class="bm-anim-gal__stage bm-pt-stage">
            <svg viewBox="0 0 100 56" aria-hidden="true"><path class="bm-pt-base" :d="MOTION_BASE" /><path class="bm-pt-curve" :d="motionPath(m)" /></svg>
          </span>
          <span class="bm-anim-gal__label">{{ t(`pt_${m}`) }} · {{ seconds(m) }}</span>
        </button>
      </div>
    </div>

    <button v-if="current" type="button" class="bm-pt-remove" data-sve-build-pt-remove @click="write(null)">{{ t('pt_remove') }}</button>
    <p class="bm-anim-note">{{ t('pt_note') }}</p>
  </div>
</template>

<style>
.sve-build .bm-pt .bm-anim-gal__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.sve-build .bm-pt-stage { height: 3rem; padding: 0.25rem; }
.sve-build .bm-pt-stage svg { width: 100%; height: 100%; }
.sve-build .bm-pt-base { fill: none; stroke: var(--bm-line); stroke-width: 1; stroke-dasharray: 2 2; }
.sve-build .bm-pt-curve { fill: none; stroke: var(--bm-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.sve-build .bm-pt-name { align-self: start; max-width: 100%; overflow: hidden; padding: 0.125rem 0.375rem; border-radius: 0.25rem; background: var(--bm-raise); color: var(--bm-muted); font-size: 0.625rem; text-overflow: ellipsis; white-space: nowrap; }
.sve-build .bm-pt-remove { align-self: start; color: var(--bm-muted); font-size: 0.6875rem; text-decoration: underline; }
.sve-build .bm-pt-remove:hover { color: var(--bm-ink); }
</style>
