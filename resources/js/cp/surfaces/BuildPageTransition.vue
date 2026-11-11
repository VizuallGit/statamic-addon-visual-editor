<script setup>
/**
 * «Page transition» in Build's Animation tab: in the library's place as a
 * kind's gallery is (BuildAnimation.vue, ← back to the library), and on a
 * component, whose Animation tab has nothing else (BuildPanel.vue).
 *
 * The element flies to the element with the same pair name on the next page
 * (build-mode/page-transition.js). A motion tile puts it on that motion with
 * the pair name and what it matches by; changing those changes one that is
 * on. Nothing plays here: a page transition runs between two real pages.
 *
 * «Whole site» at the top: how every page changes to the next — on or off,
 * fade, crossfade, slide or none, how long, and whether the header stands
 * still (page-transition-site.js, one state for every panel).
 *
 * «Where it lands»: an element in a loop over entries (the list) lands on the
 * template the collection's own pages are drawn with. Its rows stand here;
 * a click gives that row the same pair name and motion — and takes the pair
 * from any other row there, a page holds it once. The file is read and
 * saved through the dock's own endpoint, as any file the dock opens.
 */
import { computed, inject, reactive, ref, watch } from 'vue';
import { parseTemplateTree } from '../../html-tree-parse.js';
import { findByPath } from '../../build-mode/place.js';
import { csrfToken } from '../../lib/csrf.js';
import { DURATION, SITE_STYLES, cleanDuration, saveSiteTransitions, siteTransitions } from '../../page-transition-site.js';
import {
  KEYS,
  MOTIONS,
  MOTION_BASE,
  MOTION_MS,
  cleanPair,
  defaultPair,
  keyFor,
  loopCollectionOf,
  motionPath,
  pageTransitionOf,
  samePair,
  transitionRows,
  withLanding,
  withPageTransition,
} from '../../build-mode/page-transition.js';

const props = defineProps({
  node: { type: Object, required: true },
  /** In the library's place: a way back to it. */
  back: { type: Boolean, default: false },
});

const emit = defineEmits(['back']);

const port = inject('sveBuild');
const t = (key, params) => port.t(key, params);
const path = computed(() => props.node.path);
const html = computed(() => (port.rev.value, port.html()));
const current = computed(() => pageTransitionOf(html.value, findByPath(parseTemplateTree(html.value), path.value)));
const isComponent = computed(() => props.node.kind === 'component');

/* ---------------- whole site ---------------- */

const site = siteTransitions(window, reactive);
const durationText = ref('');

watch(() => site.settings.duration, (now) => {
  durationText.value = String(now);
}, { immediate: true });

function setSite(patch) {
  saveSiteTransitions(patch);
}

function setDuration() {
  const next = cleanDuration(durationText.value);

  durationText.value = String(next);

  if (next !== site.settings.duration) {
    setSite({ duration: next });
  }
}

const siteNote = computed(() => {
  if (site.status === 'saving') {
    return t('pt_site_saving');
  }

  if (site.status === 'failed') {
    return t('pt_site_failed');
  }

  if (site.status === 'unread') {
    return t('pt_site_unread');
  }

  if (!site.settings.enabled) {
    return t('pt_site_off_note');
  }

  return site.saved ? t('pt_site_saved') : t('pt_site_unsaved');
});

/* ---------------- this element ---------------- */

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

const shownPair = computed(() => cleanPair(pair.value) || defaultPair(props.node));
const preview = computed(() => `${shownPair.value}-${key.value}`);
const seconds = (motion) => `${MOTION_MS[motion] / 1000} s`;
const clash = computed(() => samePair(html.value, path.value, shownPair.value).length > 0);

function write(next) {
  port.write(withPageTransition(port.html(), path.value, next), { select: path.value });
}

function pickMotion(motion) {
  write({ pair: shownPair.value, key: key.value, motion });
}

function setPair() {
  pair.value = shownPair.value;

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

/* ---------------- where it lands ---------------- */

const collection = computed(() => (current.value && current.value.key === KEYS.loop ? loopCollectionOf(html.value, path.value) : ''));
/** `{ state: 'loading'|'ready'|'none'|'error', view, type, title, file }` for the collection's template. */
const landing = ref(null);
const saving = ref(false);
let asked = 0;

const json = { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' };

async function readLanding(handle) {
  const ask = ++asked;

  if (!handle) {
    landing.value = null;

    return;
  }

  landing.value = { state: 'loading', view: handle };

  try {
    const info = await (await fetch(`/!/sve/page-transition/landing?collection=${encodeURIComponent(handle)}`, { credentials: 'same-origin', headers: json })).json();

    if (ask !== asked) {
      return;
    }

    if (!info?.type) {
      landing.value = { state: 'none', view: info?.view || '', title: info?.title || handle };

      return;
    }

    const file = await (await fetch(`/!/sve/section-template?type=${encodeURIComponent(info.type)}`, { credentials: 'same-origin', headers: json })).json();

    if (ask === asked) {
      landing.value = typeof file?.html === 'string' ? { state: 'ready', view: info.view, type: info.type, title: info.title, file } : { state: 'error', view: info.view };
    }
  } catch {
    if (ask === asked) {
      landing.value = { state: 'error', view: handle };
    }
  }
}

watch(collection, readLanding, { immediate: true });

const rows = computed(() => (landing.value?.state === 'ready' ? transitionRows(landing.value.file.html) : []));
const partner = computed(() => rows.value.find((row) => row.pt && current.value && row.pt.pair === current.value.pair) || null);

function rowLabel(row) {
  const node = row.node;

  if (node.kind === 'component') {
    return { tag: 'component', text: node.label || node.src || '' };
  }

  const source = landing.value.file.html;
  const inner = node.children?.some((child) => !child.kind || child.kind === 'component')
    ? ''
    : source.slice(node.openTo, node.to).replace(/<\/[^>]+>\s*$/, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const klass = String(node.classes || '').split(/\s+/).find((name) => name && !name.includes('{')) || '';

  return { tag: `<${node.tag}>`, text: [klass && `.${klass}`, inner.slice(0, 28)].filter(Boolean).join(' ') };
}

async function land(row) {
  const now = landing.value;

  if (!now || now.state !== 'ready' || !current.value || saving.value) {
    return;
  }

  const next = withLanding(now.file.html, row.node.path, { pair: current.value.pair, key: keyFor(now.file.html, row.node.path), motion: current.value.motion });

  if (next === now.file.html) {
    return;
  }

  saving.value = true;

  try {
    const body = { type: now.type, html: next, css: now.file.css ?? '', js: now.file.js ?? '' };

    if (typeof now.file.tw === 'string') {
      body.tw = now.file.tw;
    }

    const res = await fetch('/!/sve/section-template', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { ...json, 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken(window) },
      body: JSON.stringify(body),
    });
    const said = await res.json().catch(() => null);

    if (res.ok && said?.ok) {
      landing.value = { ...now, file: { ...now.file, html: next } };
    } else {
      landing.value = { ...now, failed: true };
    }
  } catch {
    landing.value = { ...now, failed: true };
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="bm-anim-gal bm-pt" :class="{ 'is-standalone': !back }" data-sve-build-page-transition>
    <div v-if="back" class="bm-anim-gal__head">
      <button type="button" class="bm-anim-gal__back" :aria-label="t('anim_gallery_back')" :title="t('anim_gallery_back')" data-sve-build-anim-gallery-back @click="emit('back')" v-html="BACK"></button>
      <b>{{ t('anim_r_page') }}</b>
    </div>
    <div v-else class="bm-anim-head"><span>{{ t('anim_r_page') }}</span></div>

    <section class="bm-pt-site" data-sve-build-pt-site>
      <div class="bm-anim-head"><span>{{ t('pt_site') }}</span></div>
      <div class="bm-anim-line">
        <span>{{ t('pt_site_enabled') }}</span>
        <span class="bm-anim-seg" role="group" :aria-label="t('pt_site_enabled')">
          <button type="button" :aria-pressed="site.settings.enabled" data-sve-build-pt-site-enabled="on" @click="setSite({ enabled: true })">{{ t('pt_on') }}</button>
          <button type="button" :aria-pressed="!site.settings.enabled" data-sve-build-pt-site-enabled="off" @click="setSite({ enabled: false })">{{ t('pt_off') }}</button>
        </span>
      </div>
      <template v-if="site.settings.enabled">
        <span class="bm-pt-label">{{ t('pt_site_style') }}</span>
        <span class="bm-anim-seg" role="group" :aria-label="t('pt_site_style')">
          <button v-for="s in SITE_STYLES" :key="s" type="button" :aria-pressed="site.settings.style === s" :data-sve-build-pt-site-style="s" @click="setSite({ style: s })">{{ t(`pt_style_${s}`) }}</button>
        </span>
        <p class="bm-anim-note">{{ t(`pt_style_hint_${site.settings.style}`) }}</p>
        <label class="bm-anim-line">
          <span>{{ t('pt_site_duration') }}</span>
          <span class="bm-pt-duration">
            <input v-model="durationText" class="bm-anim-name" type="number" :min="DURATION.min" :max="DURATION.max" :step="DURATION.step" data-sve-build-pt-site-duration @change="setDuration" @keydown.enter="$event.target.blur()" />
            s
          </span>
        </label>
        <div class="bm-anim-line">
          <span>{{ t('pt_site_header') }}</span>
          <span class="bm-anim-seg" role="group" :aria-label="t('pt_site_header')">
            <button type="button" :aria-pressed="site.settings.header" data-sve-build-pt-site-header="on" @click="setSite({ header: true })">{{ t('pt_on') }}</button>
            <button type="button" :aria-pressed="!site.settings.header" data-sve-build-pt-site-header="off" @click="setSite({ header: false })">{{ t('pt_off') }}</button>
          </span>
        </div>
      </template>
      <p class="bm-anim-note" :class="{ 'is-warn': site.status === 'failed' }" data-sve-build-pt-site-note>{{ siteNote }}</p>
    </section>

    <div class="bm-anim-head"><span>{{ t('pt_element') }}</span></div>
    <p class="bm-anim-note">{{ t('pt_hint') }}</p>
    <p v-if="isComponent" class="bm-anim-note">{{ t('pt_component_note') }}</p>

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
    <p v-if="clash" class="bm-anim-note is-warn" data-sve-build-pt-clash>{{ t('pt_same_pair', { pair: shownPair }) }}</p>

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

    <template v-if="landing">
      <div class="bm-anim-head"><span>{{ t('pt_land') }}</span></div>
      <p v-if="landing.state === 'loading'" class="bm-anim-note">{{ t('pt_land_loading', { view: landing.view }) }}</p>
      <p v-else-if="landing.state === 'none'" class="bm-anim-note">{{ t('pt_land_nofile', { collection: landing.title }) }}</p>
      <p v-else-if="landing.state === 'error'" class="bm-anim-note is-warn">{{ t('pt_land_error') }}</p>
      <template v-else>
        <p v-if="partner" class="bm-pt-paired" data-sve-build-pt-paired>{{ t('pt_land_on', { view: landing.view, element: rowLabel(partner).tag + (rowLabel(partner).text ? ` ${rowLabel(partner).text}` : '') }) }}</p>
        <p class="bm-anim-note">{{ partner ? t('pt_land_move') : t('pt_land_pick', { view: landing.view }) }}</p>
        <div class="bm-pt-rows" role="list" :aria-busy="saving" data-sve-build-pt-landing>
          <button
            v-for="row in rows"
            :key="row.node.path"
            type="button"
            role="listitem"
            class="bm-pt-row"
            :style="{ paddingLeft: `${0.5 + row.depth * 0.75}rem` }"
            :aria-pressed="row === partner"
            :disabled="saving"
            :data-sve-build-pt-land="row.node.path"
            @click="land(row)"
          >
            <span class="bm-pt-row__tag" :class="{ 'is-comp': row.node.kind === 'component' }">{{ rowLabel(row).tag }}</span>
            <span class="bm-pt-row__text">{{ rowLabel(row).text }}</span>
            <span v-if="row === partner" class="bm-pt-row__ok" aria-hidden="true">✓</span>
          </button>
        </div>
        <p v-if="landing.failed" class="bm-anim-note is-warn">{{ t('pt_land_save_error', { view: landing.view }) }}</p>
      </template>
    </template>

    <button v-if="current" type="button" class="bm-pt-remove" data-sve-build-pt-remove @click="write(null)">{{ t('pt_remove') }}</button>
    <p class="bm-anim-note">{{ t('pt_note') }}</p>
  </div>
</template>

<style>
.sve-build .bm-pt.is-standalone { padding: 0.625rem 0.75rem; }
.sve-build .bm-pt-site { display: flex; flex-direction: column; gap: 0.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--bm-line); }
.sve-build .bm-pt-label { color: var(--bm-muted); font-size: 0.6875rem; }
.sve-build .bm-pt-duration { display: flex; align-items: center; gap: 0.375rem; color: var(--bm-muted); font-size: 0.6875rem; }
.sve-build .bm-pt-duration input { width: 4.5rem; }
.sve-build .bm-pt .bm-anim-gal__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.sve-build .bm-pt-stage { height: 3rem; padding: 0.25rem; }
.sve-build .bm-pt-stage svg { width: 100%; height: 100%; }
.sve-build .bm-pt-base { fill: none; stroke: var(--bm-line); stroke-width: 1; stroke-dasharray: 2 2; }
.sve-build .bm-pt-curve { fill: none; stroke: var(--bm-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.sve-build .bm-pt-name { align-self: start; max-width: 100%; overflow: hidden; padding: 0.125rem 0.375rem; border-radius: 0.25rem; background: var(--bm-raise); color: var(--bm-muted); font-size: 0.625rem; text-overflow: ellipsis; white-space: nowrap; }
.sve-build .bm-pt .bm-anim-note.is-warn { color: #f0b35f; }
.sve-build .bm-pt-paired { margin: 0; padding: 0.375rem 0.5rem; border-radius: 0.375rem; background: color-mix(in srgb, #4fd1a0 16%, transparent); color: #4fd1a0; font-size: 0.6875rem; line-height: 1.4; }
.sve-build .bm-pt-rows { display: flex; flex-direction: column; gap: 0.125rem; max-height: 14rem; overflow: auto; padding: 0.25rem; border-radius: 0.5rem; background: var(--bm-bg); }
.sve-build .bm-pt-row { display: flex; align-items: center; gap: 0.375rem; min-height: 1.625rem; padding-right: 0.5rem; border-radius: 0.3125rem; font-size: 0.6875rem; text-align: left; }
.sve-build .bm-pt-row:hover:not(:disabled) { background: var(--bm-raise); }
.sve-build .bm-pt-row[aria-pressed='true'] { background: color-mix(in srgb, var(--bm-accent) 22%, transparent); }
.sve-build .bm-pt-row:disabled { opacity: 0.6; cursor: progress; }
.sve-build .bm-pt-row__tag { flex: none; color: #e88cc4; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.625rem; }
.sve-build .bm-pt-row__tag.is-comp { color: #4fd1a0; }
.sve-build .bm-pt-row__text { min-width: 0; overflow: hidden; color: var(--bm-muted); text-overflow: ellipsis; white-space: nowrap; }
.sve-build .bm-pt-row__ok { margin-left: auto; color: #4fd1a0; font-weight: 700; }
.sve-build .bm-pt-remove { align-self: start; color: var(--bm-muted); font-size: 0.6875rem; text-decoration: underline; }
.sve-build .bm-pt-remove:hover { color: var(--bm-ink); }
</style>
