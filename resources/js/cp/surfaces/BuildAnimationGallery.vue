<script setup>
/**
 * One kind's presets as a gallery of small tiles that show the motion — in
 * the Animation tab in the library's place (with a way back), and beside the
 * editor from its Preset line (BuildAnimation.vue).
 *
 * The addon's listed presets of the kind in presets.json's order, then the
 * site's own of the kind under «Mine» (presetsFor). A tile plays while the
 * pointer is on it or it has the keyboard's focus, never when the gallery
 * opens. The timed kinds play with the page's own runtime.css and the preset
 * rules BuildAnimation.vue's stage sheet already puts in the Control Panel
 * (`data-anim`, `data-anim-preset`, the preset's timing as the element's own
 * values), so a tile does what the page does. A recipe's tile is a small loop
 * of its own: a parallax moves by its distance, a ticker runs at its speed,
 * a stack shows its offset, the mouse's follows the pointer by its strength.
 * Reduce motion is not asked: like the stage, a tile shows the motion as set.
 *
 * A click picks (`pick`): what it writes, and how it plays it on the page, is
 * BuildAnimation.vue's. Custom presets open with «Create preset» (`create`);
 * each own tile has a pencil (`edit`: the preset changed in place) and a ×
 * that asks how many templates still name the preset before Delete. The
 * addon's own are never changed: their «Start from this» (`start`) makes a
 * new preset from one.
 *
 * A tile plays on the pointer, or on the keyboard's focus — never on the
 * focus a mouse press gives it: playing rebuilds the tile's inside, and a
 * press whose element is gone before the button comes up is no click.
 */
import { computed, inject, ref } from 'vue';
import PRESETS from '../../../animation/presets.json';
import { ownValues, presetsFor, timed } from '../../build-mode/animation.js';
import { deletePreset, ownPresets, presetUsage } from '../../build-mode/animation-presets.js';

const props = defineProps({
  kind: { type: String, required: true },
  /** The handle the element has now, marked. */
  current: { type: String, default: '' },
  /** In the tab: a way back to the library, and the kind's name. */
  back: { type: Boolean, default: false },
});

const emit = defineEmits(['pick', 'create', 'edit', 'start', 'back']);

const port = inject('sveBuild');
const t = (key, params) => port.t(key, params);
const label = (p) => p[t('anim_label')];
const own = ownPresets();
const builtIn = computed(() => presetsFor(props.kind, PRESETS, []));
const mine = computed(() => presetsFor(props.kind, [], own.value));
const isTimed = computed(() => timed(props.kind));

const PATHS = {
  back: '<path d="M15 6l-6 6 6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
};
const icon = (name) => `<svg class="bm-anim-ic" viewBox="0 0 24 24" aria-hidden="true">${PATHS[name]}</svg>`;

/* ---------------- playing ---------------- */

/** The tile playing, and its take: a timed tile starts again from its first frame on each one. */
const hot = ref(null);
const take = ref(0);
/** The pointer over the mouse's tile, from its middle, -1 to 1 each way; null until it moves there. */
const pointer = ref(null);

function play(p) {
  hot.value = p.handle;
  take.value += 1;
  pointer.value = null;
}

/** Tab onto a tile plays it; the focus a mouse press gives does not (see above), nor does a focus on the tile already playing. */
function onFocus(event, p) {
  if (event.target.matches(':focus-visible') && hot.value !== p.handle) {
    play(p);
  }
}

/** A timed tile's one play runs out by itself; a recipe's loop stops when the pointer or the focus leaves. */
function stop(p) {
  if (hot.value === p.handle && !isTimed.value) {
    hot.value = null;
  }

  pointer.value = null;
}

function follow(event, p) {
  if (hot.value !== p.handle || props.kind !== 'mouse') {
    return;
  }

  const box = event.currentTarget.getBoundingClientRect();

  pointer.value = {
    x: ((event.clientX - box.left) / box.width) * 2 - 1,
    y: ((event.clientY - box.top) / box.height) * 2 - 1,
  };
}

/** The timed kinds' element: the bar for an element in, the row for children and for words (the stage shows words as children). */
const animOf = (kind) => (kind === 'self' ? 'self' : 'children');
const bars = computed(() => (props.kind === 'self' ? 1 : 3));

/** The preset's timing as the element's own values, as a page element picked from it carries them. */
const timingStyle = (p) => Object.fromEntries(ownValues({ duration: p.timing?.duration ?? null, delay: p.timing?.delay ?? null, step: p.timing?.step ?? null, vars: {} }));

const rem = (value) => parseFloat(value) || 0;

/** A recipe's numbers, scaled to the tile. */
function loopStyle(p) {
  const vars = p.vars || {};

  switch (props.kind) {
    case 'parallax':
      return { '--bm-d': `${rem(vars['--anim-y'] ?? '4rem') / 4}rem` };
    case 'ticker':
      return { '--bm-t': `${(p.timing?.duration ?? 20000) / 10000}s` };
    case 'stack':
      return { '--bm-gap': `${rem(vars['--anim-stack-gap'] ?? '1rem') / 2}rem` };
    case 'mouse': {
      const at = hot.value === p.handle ? pointer.value : null;

      return {
        '--bm-sx': `${rem(vars['--anim-x'] ?? '1rem') / 2}rem`,
        '--bm-sy': `${rem(vars['--anim-y'] ?? '1rem') / 2}rem`,
        '--bm-mx': at ? at.x.toFixed(3) : 0,
        '--bm-my': at ? at.y.toFixed(3) : 0,
      };
    }
    default:
      return {};
  }
}

/* ---------------- «Mine»: the × asks first ---------------- */

/** The × asked to delete `handle`; Delete is offered once `used` says how many templates still name it. */
const dropping = ref(null);

async function askDrop(p) {
  dropping.value = { handle: p.handle, used: null };

  const used = await presetUsage(p.handle);

  if (dropping.value?.handle !== p.handle) {
    return;
  }

  if (used === null) {
    dropping.value = null;
    port.toast('error', 'anim_mine_failed');
  } else {
    dropping.value = { handle: p.handle, used };
  }
}

async function dropOwn(p) {
  const done = await deletePreset(p.handle);

  dropping.value = null;
  port.toast(done ? 'success' : 'error', done ? 'anim_mine_deleted' : 'anim_mine_failed');
}
</script>

<template>
  <div class="bm-anim-gal" :data-sve-build-anim-gallery="kind">
    <div v-if="back" class="bm-anim-gal__head">
      <button type="button" class="bm-anim-gal__back" :aria-label="t('anim_gallery_back')" :title="t('anim_gallery_back')" data-sve-build-anim-gallery-back @click="emit('back')" v-html="icon('back')"></button>
      <b>{{ t(`anim_r_${kind}`) }}</b>
    </div>

    <template v-for="[list, isOwn] in [[builtIn, false], [mine, true]]" :key="isOwn ? 'mine' : 'built-in'">
      <div v-if="isOwn" class="bm-anim-head"><span>{{ t('anim_mine') }}</span></div>
      <div v-if="list.length || isOwn" class="bm-anim-gal__grid">
        <div v-if="isOwn" class="bm-anim-gal__cell">
          <button type="button" class="bm-anim-gal__tile is-create" data-sve-build-anim-create @click="emit('create')">
            <span class="bm-anim-gal__stage" v-html="icon('plus')"></span>
            <span class="bm-anim-gal__label">{{ t('anim_create_preset') }}</span>
          </button>
        </div>
        <div v-for="p in list" :key="p.handle" class="bm-anim-gal__cell">
          <button
            type="button"
            class="bm-anim-gal__tile"
            :aria-pressed="current === p.handle"
            :data-sve-build-anim-preset-tile="p.handle"
            @click="emit('pick', p, $event)"
            @pointerenter="play(p)"
            @pointerleave="stop(p)"
            @pointermove="follow($event, p)"
            @focus="onFocus($event, p)"
            @blur="stop(p)"
          >
            <span v-if="isTimed" class="bm-anim-gal__stage" :class="`is-${kind}`">
              <span
                :key="hot === p.handle ? `${p.handle}-${take}` : p.handle"
                class="bm-anim-gal__set"
                :data-anim="animOf(kind)"
                :data-anim-preset="p.handle"
                :data-anim-off="hot === p.handle ? null : ''"
                :style="timingStyle(p)"
              >
                <i v-for="n in bars" :key="n"></i>
              </span>
            </span>
            <span v-else class="bm-anim-gal__stage" :class="[`is-${kind}`, { 'is-hot': hot === p.handle, 'is-follow': hot === p.handle && pointer }]" :style="loopStyle(p)">
              <template v-if="kind === 'parallax'"><i class="is-back"></i><i class="is-front"></i></template>
              <span v-else-if="kind === 'ticker'" class="bm-anim-gal__row"><i v-for="n in 16" :key="n"></i></span>
              <template v-else-if="kind === 'stack'"><i v-for="n in 3" :key="n" :class="`is-${n}`"></i></template>
              <i v-else class="is-dot"></i>
            </span>
            <span class="bm-anim-gal__label">{{ label(p) }}</span>
          </button>

          <button
            v-if="!isOwn"
            type="button"
            class="bm-anim-gal__start"
            :title="t('anim_start_from_hint')"
            :data-sve-build-anim-start="p.handle"
            @click="emit('start', p)"
          >{{ t('anim_start_from_btn') }}</button>
          <template v-if="isOwn">
            <div v-if="dropping?.handle === p.handle" class="bm-anim-gal__ask" :data-sve-build-anim-own="p.handle">
              <span v-if="dropping.used" class="bm-anim-gal__used">{{ t('anim_mine_used', { n: dropping.used }) }}</span>
              <button type="button" class="bm-anim-gal__sure" data-sve-build-anim-own-sure :disabled="dropping.used === null" @click="dropOwn(p)">{{ t(dropping.used ? 'anim_mine_delete_anyway' : 'anim_mine_delete') }}</button>
              <button type="button" class="bm-anim-gal__x" :aria-label="t('anim_cancel')" @click="dropping = null" v-html="icon('x')"></button>
            </div>
            <span v-else class="bm-anim-gal__tools">
              <button
                type="button"
                :aria-label="t('anim_edit_preset_btn')"
                :title="t('anim_edit_preset_btn')"
                :data-sve-build-anim-own-edit="p.handle"
                @click="emit('edit', p)"
                v-html="icon('pencil')"
              ></button>
              <button
                type="button"
                :aria-label="t('anim_mine_delete')"
                :title="t('anim_mine_delete')"
                data-sve-build-anim-own-delete
                @click="askDrop(p)"
                v-html="icon('trash')"
              ></button>
            </span>
          </template>
        </div>
      </div>
      <p v-if="isOwn && !list.length" class="bm-anim-hint">{{ t('anim_mine_empty') }}</p>
    </template>
  </div>
</template>

<style>
/*
 * The gallery: two columns of small dark stages, the label under each.
 * `bm-anim-gal` only, under the panel's root (BuildAnimation.vue's primitives
 * and greys). The timed tiles' motion is runtime.css's; only the recipes'
 * loops are drawn here.
 */
.sve-build .bm-anim-gal { display: flex; flex-direction: column; gap: 0.5rem; }
.sve-build .bm-anim-gal__head { display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem; }
.sve-build .bm-anim-gal__head b { font-weight: 600; }
.sve-build .bm-anim-gal__back { display: grid; place-items: center; width: 1.25rem; height: 1.25rem; margin-left: -0.25rem; border-radius: 0.25rem; color: var(--bm-muted); }
.sve-build .bm-anim-gal__back:hover { background: var(--bm-hover); color: var(--bm-ink); }
.sve-build .bm-anim-gal .bm-anim-ic { width: 0.75rem; height: 0.75rem; }
.sve-build .bm-anim-gal__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.375rem; }
.sve-build .bm-anim-gal__cell { position: relative; display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }
.sve-build .bm-anim-gal__tile { display: flex; flex-direction: column; gap: 0.3125rem; padding: 0.25rem 0.25rem 0.375rem; border-radius: 0.5rem; background: var(--bm-raise); outline: 1px solid transparent; transition: background 0.12s; }
.sve-build .bm-anim-gal__tile:hover { background: var(--bm-hover); }
.sve-build .bm-anim-gal__tile:focus-visible { outline: 2px solid color-mix(in srgb, var(--bm-accent) 60%, transparent); outline-offset: 1px; }
.sve-build .bm-anim-gal__tile[aria-pressed='true'] { outline: 2px solid var(--bm-accent); outline-offset: -1px; }
.sve-build .bm-anim-gal__label { overflow: hidden; color: var(--bm-muted); font-size: 0.625rem; line-height: 1.2; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
.sve-build .bm-anim-gal__tile[aria-pressed='true'] .bm-anim-gal__label { color: var(--bm-ink); font-weight: 600; }

/* The stage: about 4.5rem of dark, the kind's shape in the middle */
.sve-build .bm-anim-gal__stage { position: relative; display: flex; align-items: center; justify-content: center; height: 4.5rem; border-radius: 0.375rem; background: var(--bm-bg); overflow: hidden; }
.sve-build .bm-anim-gal__stage i { display: block; border-radius: 0.1875rem; background: color-mix(in srgb, var(--bm-accent) 50%, transparent); border: 1px solid color-mix(in srgb, var(--bm-accent) 90%, transparent); }
.sve-build .bm-anim-gal__set { display: flex; flex-direction: column; gap: 0.25rem; }
.sve-build .bm-anim-gal__stage.is-self i { width: 3.5rem; height: 1.75rem; }
.sve-build .bm-anim-gal__stage.is-children i { width: 3.75rem; height: 0.625rem; }
.sve-build .bm-anim-gal__stage.is-words .bm-anim-gal__set { flex-direction: row; gap: 0.25rem; }
.sve-build .bm-anim-gal__stage.is-words i { height: 0.75rem; border-radius: 0.125rem; }
.sve-build .bm-anim-gal__stage.is-words i:nth-child(1) { width: 1.375rem; }
.sve-build .bm-anim-gal__stage.is-words i:nth-child(2) { width: 1.875rem; }
.sve-build .bm-anim-gal__stage.is-words i:nth-child(3) { width: 1.125rem; }

/* Parallax: the front block moves by its distance, the back one stays */
.sve-build .bm-anim-gal__stage.is-parallax i.is-back { position: absolute; left: 22%; width: 1.75rem; height: 1.75rem; opacity: 0.45; }
.sve-build .bm-anim-gal__stage.is-parallax i.is-front { position: absolute; right: 22%; width: 1.5rem; height: 1.5rem; }
.sve-build .bm-anim-gal__stage.is-parallax.is-hot i.is-front { animation: bm-anim-gal-parallax 1.6s ease-in-out infinite alternate; }

/* Ticker: a row twice as long as it shows, round and round at its speed */
.sve-build .bm-anim-gal__row { display: flex; gap: 0.375rem; position: absolute; left: 0; }
.sve-build .bm-anim-gal__row i { flex: none; width: 1rem; height: 1rem; }
.sve-build .bm-anim-gal__stage.is-ticker.is-hot .bm-anim-gal__row { animation: bm-anim-gal-ticker var(--bm-t, 2s) linear infinite; }

/* Stack: three cards at their offset; on play they come up and stack */
.sve-build .bm-anim-gal__stage.is-stack i { position: absolute; top: calc(0.75rem + var(--bm-gap, 0.5rem) * var(--bm-i, 0)); width: 4rem; height: 2rem; background: color-mix(in srgb, var(--bm-accent) 35%, var(--bm-bg)); }
.sve-build .bm-anim-gal__stage.is-stack i.is-2 { --bm-i: 1; }
.sve-build .bm-anim-gal__stage.is-stack i.is-3 { --bm-i: 2; }
.sve-build .bm-anim-gal__stage.is-stack.is-hot i { animation: bm-anim-gal-stack 1.8s ease-out infinite; animation-delay: calc(var(--bm-i, 0) * 0.25s); }

/* The mouse: the dot leans toward the pointer by its strength, or away */
.sve-build .bm-anim-gal__stage.is-mouse i.is-dot { width: 1.5rem; height: 1.5rem; border-radius: 50%; translate: calc(var(--bm-mx, 0) * var(--bm-sx, 0.5rem)) calc(var(--bm-my, 0) * var(--bm-sy, 0.5rem)); transition: translate 0.35s ease-out; }
.sve-build .bm-anim-gal__stage.is-mouse.is-hot:not(.is-follow) i.is-dot { animation: bm-anim-gal-orbit 2s linear infinite; }

@keyframes bm-anim-gal-parallax {
  from { translate: 0 var(--bm-d, 1rem); }
  to { translate: 0 calc(var(--bm-d, 1rem) * -1); }
}

@keyframes bm-anim-gal-ticker {
  to { translate: calc(-50% - 0.1875rem) 0; }
}

@keyframes bm-anim-gal-stack {
  from { translate: 0 4.5rem; opacity: 0; }
  40%, to { translate: 0 0; opacity: 1; }
}

@keyframes bm-anim-gal-orbit {
  0%, 100% { translate: var(--bm-sx, 0.5rem) 0; }
  25% { translate: 0 var(--bm-sy, 0.5rem); }
  50% { translate: calc(var(--bm-sx, 0.5rem) * -1) 0; }
  75% { translate: 0 calc(var(--bm-sy, 0.5rem) * -1); }
}

/* «Create preset»: a dashed stage with a plus, first among the custom presets */
.sve-build .bm-anim-gal__tile.is-create .bm-anim-gal__stage { border: 1px dashed color-mix(in srgb, var(--bm-accent) 55%, transparent); background: transparent; color: var(--bm-accent); }
.sve-build .bm-anim-gal__tile.is-create .bm-anim-ic { width: 1.25rem; height: 1.25rem; }
.sve-build .bm-anim-gal__tile.is-create .bm-anim-gal__label { color: var(--bm-ink); }

/* Custom presets: the × over the stage's corner, its question under the tile */
.sve-build .bm-anim-gal__tools { position: absolute; top: 0.375rem; right: 0.375rem; display: flex; gap: 0.125rem; opacity: 0; transition: opacity 0.12s; }
.sve-build .bm-anim-gal__tools button { display: grid; place-items: center; width: 1.125rem; height: 1.125rem; border-radius: 0.25rem; background: color-mix(in srgb, var(--bm-bg) 70%, transparent); color: var(--bm-faint); }
.sve-build .bm-anim-gal__tools button:hover { color: var(--bm-ink); }
.sve-build .bm-anim-gal__cell:hover .bm-anim-gal__tools, .sve-build .bm-anim-gal__tools:focus-within { opacity: 1; }

/* The addon's own: «Start from this», small, in the stage's corner while the pointer or the keyboard is on the tile */
.sve-build .bm-anim-gal__start { position: absolute; top: 0.375rem; left: 0.375rem; padding: 0.0625rem 0.3125rem; border-radius: 0.25rem; background: color-mix(in srgb, var(--bm-bg) 75%, transparent); color: var(--bm-muted); font-size: 0.5625rem; line-height: 1.4; white-space: nowrap; opacity: 0; transition: opacity 0.12s; }
.sve-build .bm-anim-gal__start:hover { background: var(--bm-accent); color: #fff; }
.sve-build .bm-anim-gal__cell:hover .bm-anim-gal__start, .sve-build .bm-anim-gal__cell:focus-within .bm-anim-gal__start { opacity: 1; }
.sve-build .bm-anim-gal__ask { display: flex; flex-wrap: wrap; align-items: center; gap: 0.25rem; }
.sve-build .bm-anim-gal__used { width: 100%; color: var(--bm-faint); font-size: 0.625rem; }
.sve-build .bm-anim-gal__sure { padding: 0.125rem 0.375rem; border-radius: 0.25rem; background: var(--bm-accent); color: #fff; font-size: 0.625rem; font-weight: 600; white-space: nowrap; }
.sve-build .bm-anim-gal__sure:disabled { opacity: 0.4; cursor: default; }
.sve-build .bm-anim-gal__x { display: flex; padding: 0.25rem; color: var(--bm-faint); }
.sve-build .bm-anim-gal__x:hover { color: var(--bm-ink); }
</style>
