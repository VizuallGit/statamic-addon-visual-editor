<script setup>
/**
 * The picked element's Animation tab, as the approved canvas draws it
 * (animationer-forslag.canvas.tsx, "Animation og Action i build-panelet"):
 * the element's animation as a chip, its triggers, and the library. The chip
 * opens the editor over the panel, which dims under it; the editor's curve
 * button opens the curve beside the editor.
 *
 * Everything is read from the dock's file and written back through the port
 * in one write (build-mode/animation.js). The editor's stage plays the
 * animation with the page's own runtime.css and presets.json, so what it
 * shows is what the page does; ▶ and every change also replay it on Build's
 * canvas. On a computer set to reduce motion, the stage leaves
 * reduced-motion.css out and the canvas reverts it while the tab is open
 * (canvas-motion.css): the author sees the motion as set, such visitors a fade.
 *
 * A switch comes from Action: the trigger binds the nearest one in reach. The
 * canvas runs no Alpine, so there ▶ plays it as when the switch turns on.
 *
 * «Save as preset» keeps the animation's look (its effects and curve, not its
 * timing) under a name in the site's animations.yaml and puts the element on
 * it; My presets lists them beside the library and in the preset list.
 *
 * Words in turn and the mouse are runtime.js's work on the page: the canvas
 * runs no scripts, so there a heading stands whole and an element stays
 * put; the stage shows the words as children, Live Preview shows both as
 * the page does. Picking children stands as the canvas draws it and says so
 * when pressed.
 */
import { computed, defineComponent, h, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import PRESETS from '../../../animation/presets.json';
import CANVAS_MOTION_CSS from '../../../animation/canvas-motion.css?raw';
import RUNTIME_CSS from '../../../animation/runtime.css?raw';
import { animationStill, playInPreview, setAnimationStill } from '../../animation-mode.js';
import { statesInScope } from '../../build-mode/alpine.js';
import {
  animationOf,
  bezierCss,
  bezierOf,
  EASES,
  easeKey,
  effectsOf,
  groupPresets,
  isChanged,
  missingEffects,
  moves,
  newAnimation,
  onPreset,
  ownValues,
  presetLook,
  presetOf,
  presetRules,
  recipeAnimation,
  RUNTIME_DEFAULTS,
  SETTINGS,
  springEase,
  stepped,
  TICKER_DURATION,
  timed,
  TIMING_RANGE,
  valueOf,
  withAnimation,
  withEffect,
  withVar,
} from '../../build-mode/animation.js';
import { deletePreset, ownPresets, presetUsage, savePreset } from '../../build-mode/animation-presets.js';
import { CANVAS_PATH } from '../../build-mode/canvas-paint.js';
import { findByPath } from '../../build-mode/place.js';
import { parseTemplateTree } from '../../html-tree-parse.js';
import { besideSpot, overSpot } from '../../lib/beside.js';
import { buildCanvasFrame } from '../../lib/build-canvas.js';

const props = defineProps({
  node: { type: Object, required: true },
});

const port = inject('sveBuild');
const t = (key) => port.t(key);
const path = computed(() => props.node.path);
const html = computed(() => (port.rev.value, port.html()));
const anim = computed(() => animationOf(html.value, findByPath(parseTemplateTree(html.value), path.value)));
const own = ownPresets();
const presets = computed(() => [...PRESETS, ...own.value]);
const preset = computed(() => presetOf(presets.value, anim.value?.preset));
const label = (p) => (p ? p[t('anim_label')] : '');
const decimal = computed(() => t('anim_decimal'));

/* ---------------- the canvas's icons (viewBox 24, stroke 1.8) ---------------- */

const PATHS = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  play: '<path d="M7 5l12 7-12 7z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  caret: '<path d="M6 9l6 6 6-6"/>',
  curve: '<path d="M4 20C10 20 14 4 20 4"/><circle cx="4" cy="20" r="1.5"/><circle cx="20" cy="4" r="1.5"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  scroll: '<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 7v3"/>',
  hover: '<path d="M5 3l6 16 2-6 6-2z"/>',
  tap: '<path d="M9 11V5a2 2 0 0 1 4 0v6M13 10a2 2 0 0 1 4 0v4a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-3-4a2 2 0 0 1 3-2l1 1"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  move: '<path d="M12 2v20M2 12h20M5 9l-3 3 3 3M19 9l3 3-3 3M9 5l3-3 3 3M9 19l3 3 3-3"/>',
  ticker: '<rect x="3" y="8" width="5" height="5" rx="1"/><rect x="10" y="8" width="5" height="5" rx="1"/><rect x="17" y="8" width="4" height="5" rx="1"/><path d="M15 18H7M9 16l-2 2 2 2"/>',
  stack: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M7 7h10M9 4h6"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
};

const icon = (name, size = 14) =>
  `<svg class="bm-anim-ic" style="width:${size / 16}rem;height:${size / 16}rem" viewBox="0 0 24 24" aria-hidden="true">${PATHS[name]}</svg>`;

/* ---------------- the tab ---------------- */

/** [trigger, icon, word]: the five the runtime plays a preset on, and the mouse, which is the recipe of its own (RECIPES.mouse). */
const TRIGGERS = [
  ['view', 'eye', 'anim_on_view'],
  ['scroll', 'scroll', 'anim_on_scroll'],
  ['load', 'bolt', 'anim_on_load'],
  ['hover', 'hover', 'anim_on_hover'],
  ['switch', 'tap', 'anim_on_switch'],
  ['mouse', 'move', 'anim_on_mouse'],
];

const RECIPE_ICONS = { parallax: 'scroll', ticker: 'ticker', stack: 'stack', mouse: 'move' };

const stroke = 'stroke:var(--bm-accent);stroke-width:1.3';
const tint = (p) => `fill:color-mix(in srgb,var(--bm-accent) ${p}%,transparent)`;
const framed = (p, more = '') => `style="${tint(p)};${stroke}${more}"`;

/** The library's recipes, drawn as the canvas draws them: a `target` keeps the preset, a `recipe` is one of its own (RECIPES). */
const TILES = [
  { key: 'self', word: 'anim_r_self', target: 'self', art: `<rect x="20" y="10" width="24" height="22" rx="3" ${framed(30)}/><path d="M32 6V2M29 5l3-3 3 3" style="${stroke}"/>` },
  {
    key: 'children',
    word: 'anim_r_children',
    target: 'children',
    art: `<rect x="8" y="6" width="14" height="28" rx="3" ${framed(45)}/><rect x="25" y="10" width="14" height="24" rx="3" ${framed(28)}/><rect x="42" y="14" width="14" height="20" rx="3" ${framed(12, ';stroke-opacity:.5')}/>`,
  },
  {
    key: 'parallax',
    word: 'anim_r_parallax',
    recipe: 'parallax',
    art: `<rect x="10" y="12" width="20" height="20" rx="3" ${framed(20)}/><rect x="36" y="4" width="18" height="18" rx="3" ${framed(40)}/><path d="M45 26v10M42 33l3 3 3-3" style="${stroke}"/>`,
  },
  {
    key: 'ticker',
    word: 'anim_r_ticker',
    recipe: 'ticker',
    art: `${[2, 18, 34, 50].map((x) => `<rect x="${x}" y="14" width="12" height="12" rx="2" ${framed(28)}/>`).join('')}<path d="M40 34H24M27 31l-3 3 3 3" style="${stroke}"/>`,
  },
  {
    key: 'stack',
    word: 'anim_r_stack',
    recipe: 'stack',
    art: `<rect x="16" y="18" width="32" height="18" rx="3" ${framed(18)}/><rect x="19" y="11" width="26" height="18" rx="3" ${framed(30)}/><rect x="22" y="4" width="20" height="18" rx="3" ${framed(45)}/>`,
  },
  {
    key: 'lift',
    word: 'anim_r_lift',
    recipe: 'lift',
    art: `<rect x="16" y="6" width="26" height="20" rx="3" ${framed(35)}/><path d="M18 32h22" style="${stroke};stroke-dasharray:2 2"/><path d="M44 22l4 10 1.5-4 4-1.5z" style="fill:var(--bm-accent)"/>`,
  },
  {
    key: 'words',
    word: 'anim_r_words',
    target: 'words',
    art: `<rect x="6" y="15" width="14" height="10" rx="2" style="${tint(50)}"/><rect x="23" y="15" width="18" height="10" rx="2" style="${tint(30)}"/><rect x="44" y="15" width="14" height="10" rx="2" style="${tint(12)}"/>`,
  },
  { key: 'mouse', word: 'anim_r_mouse', recipe: 'mouse', art: `<circle cx="26" cy="20" r="10" ${framed(30)}/><path d="M40 22l4 10 1.5-4 4-1.5z" style="fill:var(--bm-accent)"/>` },
];

const groups = computed(() => groupPresets(presets.value));
const plays = computed(() => !!anim.value && timed(anim.value.target));

/** The chip's and the editor's name: a recipe's own, else what the element or its children do. */
const recipe = computed(() => {
  const now = anim.value;

  if (now && !plays.value) {
    return t(`anim_r_${now.target}`);
  }

  if (now?.on === 'hover') {
    return t(`anim_r_hover_${now.target}`);
  }

  return t(`anim_r_${now?.target || 'self'}`);
});
const chipIcon = computed(() => (plays.value ? TRIGGERS.find(([on]) => on === anim.value.on)[1] : RECIPE_ICONS[anim.value?.target]));
const chipSub = computed(() => (plays.value ? label(preset.value) || anim.value.preset || t('anim_own') : ''));

/** ▶ shows something only where the motion runs in time: not on hover, while scrolling, on a stack or toward the mouse. */
const playable = computed(() => (plays.value ? !['hover', 'scroll'].includes(anim.value.on) : anim.value?.target === 'ticker'));
const tagName = computed(() => {
  const first = String(props.node.classes || '').split(/\s+/).find((name) => /^[a-z_-]/i.test(name) && !name.includes('{'));

  return first ? `${props.node.tag}.${first}` : props.node.tag;
});
const switches = computed(() => statesInScope(html.value, path.value).map((state) => state.name));

function write(next) {
  port.write(withAnimation(port.html(), path.value, next), { select: path.value });
}

const soon = () => port.toast('info', 'anim_coming');

/** On a switch, the one it had while it is still in reach, else the nearest. */
function withTrigger(now, on) {
  const keep = now.switch && switches.value.includes(now.switch) ? now.switch : switches.value[0];

  return { ...now, on, switch: on === 'switch' ? keep : null };
}

/** A trigger on the element's preset; the mouse is no trigger but the recipe of its own, and takes the preset's place. */
function pickTrigger(on) {
  if (on === 'mouse') {
    write(recipeAnimation('mouse'));
    open.value = true;

    return;
  }

  if (on === 'switch' && !switches.value.length) {
    port.toast('info', 'anim_no_switch');

    return;
  }

  write(withTrigger(anim.value, on));
}

/** A recipe replaces what was there; "Element in", "Children in turn" and "Words in turn" keep the preset, unless it was a hover's or a recipe's. */
function useTile(tile) {
  if (tile.recipe) {
    write(recipeAnimation(tile.recipe));
  } else {
    const keep = plays.value && anim.value.on !== 'hover';

    write(keep ? { ...anim.value, target: tile.target } : newAnimation('fade-up', tile.target));
  }

  open.value = true;
}

/* ---------------- My presets ---------------- */

const mineOpen = ref(false);
/** The × asked to delete `handle`; Delete is offered once `used` says how many templates still name it. */
const dropping = ref(null);

/** An own preset, as the preset list sets one: on an animation that plays in time, else on the element in. */
function useOwn(p) {
  write(plays.value ? onPreset(anim.value, p.handle) : newAnimation(p.handle, 'self'));
  open.value = true;
}

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

/* «Save as preset»: the name typed in the editor's foot, then the element on the new preset. */
const naming = ref(false);
const newName = ref('');
const saving = ref(false);
const nameInput = ref(null);

function startNaming() {
  if (!Object.keys(presetLook(anim.value, preset.value)).length) {
    port.toast('info', 'anim_save_nothing');

    return;
  }

  newName.value = '';
  naming.value = true;
  nextTick(() => nameInput.value?.focus());
}

async function saveLook() {
  const name = newName.value.trim();

  if (!name || saving.value) {
    return;
  }

  saving.value = true;

  const saved = await savePreset(name, presetLook(anim.value, preset.value));

  saving.value = false;

  if (!saved) {
    port.toast('error', 'anim_save_failed');

    return;
  }

  naming.value = false;
  write(onPreset(anim.value, saved.handle));
  port.toast('success', 'anim_saved');
}

function canvasEl() {
  const doc = buildCanvasFrame(window)?.contentDocument;

  return doc?.querySelector(`[${CANVAS_PATH}="${CSS.escape(path.value)}"]`) || null;
}

/**
 * A finished CSS animation is gone from getAnimations(): the runtime's own off
 * switch, on and off again across a style flush, starts it from its first
 * frame. The canvas runs no Alpine, so a switch is turned on there, until the
 * next paint.
 */
function replay(el) {
  if (!el || anim.value?.off) {
    return;
  }

  if (anim.value?.on === 'switch') {
    el.setAttribute('data-anim-active', '');
  }

  el.setAttribute('data-anim-off', '');
  void el.offsetWidth;
  el.removeAttribute('data-anim-off');
}

/**
 * ▶: on the canvas, and in the real preview (animation-mode.js). An animation
 * on a switch plays when the switch turns on, so the switch is turned through
 * the tree's Alpine state (port.flipAlpine; two or more keys open its menu at
 * the button) — never by a click let through to the page.
 */
function play(event) {
  take.value += 1;
  replay(canvasEl());

  if (anim.value?.on === 'switch' && anim.value.switch) {
    const owner = statesInScope(html.value, path.value).find((state) => state.name === anim.value.switch);
    const row = owner ? port.alpineRows([owner.path])[0] : null;

    if (row) {
      port.flipAlpine(event, row.id);
    }
  }

  playInPreview(window, path.value);
}

/** «Stille | Kører»: Live Preview's animations held at their end frame, or playing as the public site. */
const still = animationStill();
const setStill = (on) => setAnimationStill(window, on);

/**
 * The element's animation as the canvas paints it. New values on an animation
 * that has finished show nothing, so the canvas plays it again on the paint
 * that brings them, not when the file is written.
 */
const drawn = (el) => (el
  ? [
      el.getAttribute('data-anim'),
      el.getAttribute('data-anim-preset'),
      el.getAttribute('data-anim-on'),
      el.hasAttribute('data-anim-off'),
      ...[...el.classList].filter((name) => name.startsWith('[--anim-')).sort(),
      ...[...el.style].filter((name) => name.startsWith('--anim-')).sort().map((name) => `${name}:${el.style.getPropertyValue(name)}`),
    ].join('\n')
  : null);

const MOTION_ID = 'sve-anim-canvas-motion';

/** Hung on the canvas's root after its body, as the canvas hangs its own sheets: a read of the page again never meets it. */
function showMotion() {
  const doc = buildCanvasFrame(window)?.contentDocument;

  if (doc?.documentElement && !doc.getElementById(MOTION_ID)) {
    const sheet = doc.createElement('style');

    sheet.id = MOTION_ID;
    sheet.textContent = CANVAS_MOTION_CSS;
    doc.documentElement.append(sheet);
  }
}

let seen = { path: path.value, drawn: drawn(canvasEl()) };

watch(() => port.painted.value, () => {
  showMotion();

  const el = canvasEl();
  const now = drawn(el);
  const changed = seen.path === path.value && seen.drawn !== null && now !== seen.drawn;

  seen = { path: path.value, drawn: now };

  if (changed) {
    replay(el);
  }
});

/* The chip's ⋯ menu. */
const menu = ref(false);
const menuEl = ref(null);

function remove() {
  menu.value = false;
  open.value = false;
  write(null);
}

/* ---------------- the editor ---------------- */

const root = ref(null);
const chip = ref(null);
const editor = ref(null);
const open = ref(false);
const editorSpot = ref({ left: 0, top: 0, width: 0 });

/** The panel's box: the dimmed layer under the editor covers it, and only it, so the canvas stays in sight. */
const panelSpot = ref(null);
const panelEl = () => root.value?.closest('.sve-build');

/** The stage plays again on every change, as the canvas promises ("spiller når du ændrer noget"). */
const take = ref(0);
watch(() => JSON.stringify(anim.value), () => {
  take.value += 1;
});

const stageStyle = computed(() => Object.fromEntries(ownValues(anim.value)));

/** runtime.css and a rule per preset, as {{ sve_animation }} pushes them onto the page, in the Control Panel for the stage; again when My presets change. */
function stageSheet() {
  let sheet = document.getElementById('sve-anim-stage-css');

  if (!sheet) {
    sheet = document.createElement('style');
    sheet.id = 'sve-anim-stage-css';
    document.head.appendChild(sheet);
  }

  sheet.textContent = `${RUNTIME_CSS}\n${presetRules(presets.value)}`;
}

watch(own, stageSheet);

const lessMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const reduced = ref(lessMotion.matches);
const onMotion = (event) => {
  reduced.value = event.matches;
};

const presetText = computed(() => {
  const name = label(preset.value) || anim.value?.preset;

  return name ? `${name}${isChanged(anim.value) ? ` · ${t('anim_changed')}` : ''}` : t('anim_own');
});
const effects = computed(() => (anim.value ? effectsOf(anim.value, preset.value) : []));
const missing = computed(() => (anim.value ? missingEffects(anim.value, preset.value) : []));
const hasEffects = computed(() => plays.value || moves(anim.value?.target));
/** What the effects mean here: on a hover, while scrolling, for a parallax or the mouse, and for words, where the page cuts the heading. */
const NOTES = { parallax: 'anim_parallax_note', mouse: 'anim_mouse_note', words: 'anim_words_note' };
const effectsNote = computed(() => ({ hover: 'anim_hover_note', scroll: 'anim_scroll_note' })[anim.value?.on] || NOTES[anim.value?.target] || '');

/** While scrolling the scroll is the clock: no delay, duration or wait between children or words. */
const timing = computed(() => (anim.value?.on === 'scroll'
  ? []
  : [
      ['delay', 'anim_delay'],
      ['duration', 'anim_duration'],
      ...(stepped(anim.value?.target) ? [['step', 'anim_step']] : []),
    ]));
const staggers = computed(() => stepped(anim.value?.target) && anim.value.on !== 'scroll');

/* A ticker's and a stack's own lengths, in rem; the runtime's own is written as nothing. */
const remOf = (name) => parseFloat(valueOf(anim.value, null, name) ?? SETTINGS[name]);
const setRem = (name, rem) => setVar(name, rem === null || `${rem}rem` === SETTINGS[name] ? null : `${rem}rem`);
const SETTING_FIELDS = {
  ticker: [['--anim-gap', 'anim_ticker_gap', { max: 8, step: 0.25 }]],
  stack: [
    ['--anim-stack-top', 'anim_stack_top', { max: 20, step: 0.25 }],
    ['--anim-stack-gap', 'anim_stack_gap', { max: 4, step: 0.125 }],
  ],
};
const tickerSeconds = computed(() => (anim.value?.duration ?? TICKER_DURATION) / 1000);
const reversed = computed(() => valueOf(anim.value, null, '--anim-dir') === 'reverse');
const stepCurve = computed(() => valueOf(anim.value, preset.value, '--anim-step-curve') ?? '1');
const easeRaw = computed(() => valueOf(anim.value, preset.value, '--anim-ease') ?? 'ease');
const ease = computed(() => easeKey(easeRaw.value));
const duration = computed(() => anim.value?.duration ?? RUNTIME_DEFAULTS.duration);

function setPreset(handle) {
  const keep = anim.value.vars['--anim-step-curve'];

  write({ ...anim.value, preset: handle, vars: keep ? { '--anim-step-curve': keep } : {} });
}

const setEffect = (key, value) => write(withEffect(anim.value, preset.value, key, value));
const addEffect = (effect) => setEffect(effect.key, effect.add);

/* The effects' + menu: the effect to add, by name. */
const addMenu = ref(false);
const addMenuEl = ref(null);

function pickEffect(effect) {
  addMenu.value = false;
  addEffect(effect);
}
const setTime = (key, ms) => write({ ...anim.value, [key]: ms === null ? null : Math.round(ms) });
const setVar = (name, value) => write(withVar(anim.value, preset.value, name, value));

/** The runtime's own curve is `ease`: written only where the preset has another. */
function setEaseCss(css) {
  setVar('--anim-ease', css === 'ease' && !preset.value?.vars?.['--anim-ease'] ? null : css);
}

function setEase(key) {
  setEaseCss(key === 'spring' ? springEase(spring.value.stiffness, spring.value.damping, spring.value.mass) : EASES.find(([k]) => k === key)[1]);
}

/* ---------------- the curve ---------------- */

const curveBtn = ref(null);
const curvePop = ref(null);
const curveOpen = ref(false);
const curveSpot = ref({ left: 0, top: 0 });
const curveMode = ref('ease');
const spring = ref({ stiffness: 100, damping: 10, mass: 1 });
const SPRING = [
  ['stiffness', 'anim_stiffness', { max: 300, min: 10, step: 5 }],
  ['damping', 'anim_damping', { max: 50, min: 1, step: 1 }],
  ['mass', 'anim_mass', { max: 5, min: 0.1, step: 0.1 }],
];

watch(curveOpen, (now) => {
  if (now) {
    curveMode.value = ease.value === 'spring' ? 'spring' : 'ease';
  }
});

function setMode(mode) {
  curveMode.value = mode;

  if (mode === 'spring' && ease.value !== 'spring') {
    setEase('spring');
  } else if (mode === 'ease' && ease.value === 'spring') {
    setEase('in-out');
  }
}

function setSpring(key, value) {
  spring.value = { ...spring.value, [key]: value };
  setEase('spring');
}

const S = 168;
const P = 14;
const gx = (v) => P + v * (S - 2 * P);
const gy = (v) => S - P - v * (S - 2 * P);
const short = (n) => String(Number(Number(n).toFixed(2)));
const graph = ref(null);
const dragging = ref(null);
const draft = ref(null);
const points = computed(() => draft.value ?? bezierOf(easeRaw.value));
const bezierText = computed(() => (points.value ? points.value.map(short).join(', ').replace(/(^|\s)0\./g, '$1.') : easeRaw.value));

/** A spring's linear() as the graph's line: stops without a place share out the room between the ones with one. */
const springLine = computed(() => {
  const match = /^linear\((.*)\)$/.exec(easeRaw.value);

  if (points.value || !match) {
    return '';
  }

  const stops = match[1].split(',').map((part) => {
    const [y, x] = part.trim().split(/\s+/);

    return { y: Number(y), x: x ? parseFloat(x) / 100 : null };
  });

  stops[0].x ??= 0;
  stops[stops.length - 1].x ??= 1;

  for (let i = 1; i < stops.length - 1; i += 1) {
    if (stops[i].x === null) {
      const next = stops.findIndex((stop, j) => j > i && stop.x !== null);

      stops[i].x = stops[i - 1].x + (stops[next].x - stops[i - 1].x) / (next - i + 1);
    }
  }

  return stops.map((stop) => `${gx(stop.x)},${gy(stop.y)}`).join(' ');
});

function grab(index, event) {
  event.preventDefault();
  dragging.value = index;
  draft.value = [...points.value];
  graph.value.setPointerCapture(event.pointerId);
}

function pull(event) {
  if (dragging.value === null) {
    return;
  }

  const box = graph.value.getBoundingClientRect();
  const x = (((event.clientX - box.left) * S) / box.width - P) / (S - 2 * P);
  const y = (S - P - ((event.clientY - box.top) * S) / box.height) / (S - 2 * P);
  const next = [...draft.value];

  next[dragging.value * 2] = Number(Math.min(1, Math.max(0, x)).toFixed(2));
  next[dragging.value * 2 + 1] = Number(Math.min(1.5, Math.max(-0.5, y)).toFixed(2));
  draft.value = next;
}

function drop() {
  if (dragging.value === null) {
    return;
  }

  const next = draft.value;

  dragging.value = null;
  draft.value = null;
  setEaseCss(bezierCss(next));
}

function setBezier(event) {
  const numbers = event.target.value.split(',').map((n) => Number(n.trim()));

  if (numbers.length === 4 && numbers.every(Number.isFinite)) {
    setEaseCss(bezierCss([Math.min(1, Math.max(0, numbers[0])), numbers[1], Math.min(1, Math.max(0, numbers[2])), numbers[3]]));
  } else {
    event.target.value = bezierText.value;
  }
}

/* ---------------- placing, closing ---------------- */

const view = () => ({ width: window.innerWidth, height: window.innerHeight });
const size = (el) => ({ width: el.offsetWidth, height: el.offsetHeight });

function placeCurve() {
  if (curvePop.value && curveBtn.value && editor.value) {
    curveSpot.value = besideSpot(curveBtn.value.getBoundingClientRect(), editor.value.getBoundingClientRect(), size(curvePop.value), view());
  }
}

function place() {
  const panel = panelEl();

  if (editor.value && chip.value && panel) {
    const box = panel.getBoundingClientRect();

    editorSpot.value = overSpot(chip.value.getBoundingClientRect(), box, size(editor.value), view());
    panelSpot.value = { left: box.left, top: box.top, width: box.width, height: box.height };
  }

  nextTick(placeCurve);
}

let sized = null;

watch([editor, curvePop], ([e, c]) => {
  sized?.disconnect();
  sized = new ResizeObserver(place);
  [e, c, e ? panelEl() : null].filter(Boolean).forEach((el) => sized.observe(el));
  place();
}, { flush: 'post' });

watch(anim, (now) => {
  if (!now) {
    open.value = false;
  }
});

watch(open, (now) => {
  if (!now) {
    curveOpen.value = false;
    addMenu.value = false;
    naming.value = false;
  }
});

// Ahead of Build's own Escape, which would let go of the pick.
const onKey = (event) => {
  if (event.key !== 'Escape' || !(open.value || menu.value)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (menu.value) {
    menu.value = false;
  } else if (addMenu.value) {
    addMenu.value = false;
  } else if (naming.value) {
    naming.value = false;
  } else if (curveOpen.value) {
    curveOpen.value = false;
  } else {
    open.value = false;
  }
};

const onDown = (event) => {
  if (menu.value && !menuEl.value?.contains(event.target)) {
    menu.value = false;
  }

  if (addMenu.value && !addMenuEl.value?.contains(event.target)) {
    addMenu.value = false;
  }
};

onMounted(() => {
  stageSheet();
  showMotion();
  lessMotion.addEventListener('change', onMotion);
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('resize', place);
  document.addEventListener('pointerdown', onDown, true);
});

onBeforeUnmount(() => {
  sized?.disconnect();
  buildCanvasFrame(window)?.contentDocument?.getElementById(MOTION_ID)?.remove();
  lessMotion.removeEventListener('change', onMotion);
  window.removeEventListener('keydown', onKey, true);
  window.removeEventListener('resize', place);
  document.removeEventListener('pointerdown', onDown, true);
});

/* ---------------- a number field with a fill, as the canvas's Num ---------------- */

/**
 * The value as text, the fill as how far along `max` it is. Drag sideways to
 * scrub (written once, on release); a click types; ↑ ↓ step (⇧ ten steps).
 * `blank` lets an emptied field mean "the runtime's own" (null).
 */
const Num = defineComponent({
  name: 'BuildAnimationNum',
  props: {
    value: { type: Number, default: null },
    raw: { type: String, default: '' },
    unit: { type: String, default: '' },
    max: { type: Number, required: true },
    min: { type: Number, default: 0 },
    step: { type: Number, default: 1 },
    cap: { type: Boolean, default: false },
    blank: { type: Boolean, default: false },
    decimal: { type: String, default: '.' },
  },
  emits: ['set'],
  setup(own, { emit }) {
    const input = ref(null);
    const scrub = ref(null);
    let start = null;
    const shown = computed(() => scrub.value ?? own.value);
    const fmt = (n) => String(Number(Number(n).toFixed(3))).replace('.', own.decimal);
    const bound = (n) => Math.min(own.cap ? own.max : Infinity, Math.max(own.min, n));
    const snap = (n) => bound(Number((Math.round(n / own.step) * own.step).toFixed(3)));

    const move = (event) => {
      const dx = event.clientX - start.x;

      if (!start.moved && Math.abs(dx) < 3) {
        return;
      }

      start.moved = true;
      scrub.value = snap(start.value + (dx / start.width) * own.max);
    };

    const up = () => {
      window.removeEventListener('pointermove', move);

      const moved = start?.moved;
      const next = scrub.value;

      start = null;
      scrub.value = null;

      if (moved && next !== null && next !== own.value) {
        emit('set', next);
      } else if (!moved) {
        input.value?.focus();
        input.value?.select();
      }
    };

    const down = (event) => {
      if (event.button !== 0 || document.activeElement === input.value || own.value === null) {
        return;
      }

      event.preventDefault();
      start = { x: event.clientX, value: own.value, width: event.currentTarget.getBoundingClientRect().width, moved: false };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up, { once: true });
    };

    const commit = (event) => {
      const text = event.target.value.trim().replace(',', '.');
      const n = Number(text);

      if (text === '' && own.blank) {
        emit('set', null);
      } else if (text === '' || !Number.isFinite(n)) {
        event.target.value = own.value === null ? own.raw : fmt(own.value);
      } else {
        emit('set', bound(n));
      }
    };

    const key = (event) => {
      if (event.key === 'Enter') {
        event.target.blur();
      } else if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && own.value !== null) {
        event.preventDefault();
        emit('set', snap(own.value + (event.key === 'ArrowUp' ? 1 : -1) * own.step * (event.shiftKey ? 10 : 1)));
      }
    };

    onBeforeUnmount(() => window.removeEventListener('pointermove', move));

    return () => {
      const value = shown.value;
      const fill = value === null ? 0 : Math.min(100, (Math.abs(value) / own.max) * 100);

      return h('div', { class: ['bm-anim-num', { 'is-raw': value === null }], onPointerdown: down }, [
        h('i', { class: 'bm-anim-num__fill', style: { width: `${fill}%` } }),
        h('input', {
          ref: input,
          class: 'bm-anim-num__in',
          type: 'text',
          inputmode: 'decimal',
          value: value === null ? own.raw : fmt(value),
          readonly: value === null,
          onChange: commit,
          onKeydown: key,
        }),
        own.unit ? h('span', { class: 'bm-anim-num__unit' }, own.unit) : null,
      ]);
    };
  },
});
</script>

<template>
  <div ref="root" class="bm-anim" data-sve-build-animation>
    <section class="bm-anim-block is-first bm-anim-mode">
      <div class="bm-anim-head"><span>{{ t('anim_preview') }}</span></div>
      <span class="bm-seg" role="group" :aria-label="t('anim_preview')" data-sve-build-anim-mode>
        <button type="button" :aria-pressed="still" data-sve-build-anim-still @click="setStill(true)"><span v-html="icon('pause', 12)"></span>{{ t('anim_still') }}</button>
        <button type="button" :aria-pressed="!still" data-sve-build-anim-running @click="setStill(false)"><span v-html="icon('play', 12)"></span>{{ t('anim_running') }}</button>
      </span>
      <p class="bm-anim-hint">{{ t(still ? 'anim_still_note' : 'anim_running_note') }}</p>
    </section>

    <section class="bm-anim-block">
      <div class="bm-anim-head"><span>{{ t('anim_on_element') }}</span></div>
      <div v-if="anim" ref="menuEl" class="bm-anim-chipwrap">
        <button
          ref="chip"
          type="button"
          class="bm-anim-chip"
          :aria-pressed="open"
          :aria-expanded="open"
          data-sve-build-anim-chip
          @click="open = !open"
        >
          <span class="bm-anim-chip__ic" v-html="icon(chipIcon)"></span>
          <b>{{ recipe }}</b>
          <span v-if="chipSub" class="bm-anim-chip__sub">· {{ chipSub }}</span>
        </button>
        <button type="button" class="bm-anim-chip__more" :aria-expanded="menu" :aria-label="t('anim_remove')" data-sve-build-anim-more @click="menu = !menu" v-html="icon('dots', 12)"></button>
        <div v-if="menu" class="bm-anim-menu" role="menu">
          <button v-if="playable" type="button" role="menuitem" data-sve-build-anim-play @click="menu = false; play($event)"><span v-html="icon('play', 12)"></span>{{ t('anim_play') }}</button>
          <button type="button" role="menuitem" data-sve-build-anim-remove @click="remove"><span v-html="icon('trash', 12)"></span>{{ t('anim_remove') }}</button>
        </div>
      </div>
      <p v-else class="bm-anim-none" data-sve-build-anim-none>{{ t('anim_none') }}</p>
    </section>

    <section v-if="plays" class="bm-anim-block" data-sve-build-anim-triggers>
      <div class="bm-anim-head"><span>{{ t('anim_triggers') }}</span></div>
      <div class="bm-anim-triggers">
        <button
          v-for="[on, ic, word] in TRIGGERS"
          :key="on"
          type="button"
          class="bm-anim-trigger"
          :aria-pressed="anim.on === on"
          :data-sve-build-anim-on="on"
          @click="pickTrigger(on)"
        >
          <span class="bm-anim-trigger__ic" v-html="icon(ic)"></span>
          <span class="bm-anim-trigger__word">{{ t(word) }}</span>
        </button>
      </div>
      <div v-if="switches.length" class="bm-anim-switches">
        {{ t('anim_switches') }}
        <code v-for="name in switches" :key="name">{{ name }}</code>
      </div>
    </section>

    <section class="bm-anim-block" data-sve-build-anim-library>
      <div class="bm-anim-head"><span>{{ t('anim_library') }}</span></div>
      <div class="bm-anim-lib">
        <button
          v-for="tile in TILES"
          :key="tile.key"
          type="button"
          class="bm-anim-tile"
          :data-sve-build-anim-tile="tile.key"
          @click="useTile(tile)"
        >
          <svg viewBox="0 0 64 40" fill="none" aria-hidden="true" v-html="tile.art"></svg>
          <span>{{ t(tile.word) }}</span>
        </button>
      </div>
      <div class="bm-anim-mine">
        <button type="button" class="bm-anim-btn" :aria-expanded="mineOpen" data-sve-build-anim-mine @click="mineOpen = !mineOpen">{{ t('anim_mine') }} · {{ own.length }}</button>
      </div>
      <div v-if="mineOpen" class="bm-anim-own" data-sve-build-anim-own-list>
        <p v-if="!own.length" class="bm-anim-hint">{{ t('anim_mine_empty') }}</p>
        <div v-for="p in own" :key="p.handle" class="bm-anim-own__row" :data-sve-build-anim-own="p.handle">
          <button type="button" class="bm-anim-own__use" :aria-pressed="anim?.preset === p.handle" @click="useOwn(p)">{{ label(p) }}</button>
          <template v-if="dropping?.handle === p.handle">
            <span v-if="dropping.used" class="bm-anim-own__used">{{ port.t('anim_mine_used', { n: dropping.used }) }}</span>
            <button type="button" class="bm-anim-own__sure" data-sve-build-anim-own-sure :disabled="dropping.used === null" @click="dropOwn(p)">{{ t(dropping.used ? 'anim_mine_delete_anyway' : 'anim_mine_delete') }}</button>
            <button type="button" class="bm-anim-own__x" :aria-label="t('anim_cancel')" @click="dropping = null" v-html="icon('x', 12)"></button>
          </template>
          <button
            v-else
            type="button"
            class="bm-anim-own__x"
            :aria-label="t('anim_mine_delete')"
            :title="t('anim_mine_delete')"
            data-sve-build-anim-own-delete
            @click="askDrop(p)"
            v-html="icon('trash', 12)"
          ></button>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="open && anim && panelSpot"
        class="sve-build bm-anim-scrim"
        aria-hidden="true"
        data-sve-build-anim-scrim
        :style="{ left: `${panelSpot.left}px`, top: `${panelSpot.top}px`, width: `${panelSpot.width}px`, height: `${panelSpot.height}px` }"
        @click="open = false"
      ></div>

      <div
        v-if="open && anim"
        ref="editor"
        class="sve-build bm-anim-pop"
        role="dialog"
        :aria-label="recipe"
        data-sve-build-anim-editor
        :style="{ left: `${editorSpot.left}px`, top: `${editorSpot.top}px`, width: editorSpot.width ? `${editorSpot.width}px` : null }"
      >
        <header class="bm-anim-pop__head">
          <b>{{ recipe }}</b>
          <span class="bm-anim-pop__tag">{{ tagName }}</span>
          <button type="button" class="bm-anim-pop__x" :aria-label="t('close')" @click="open = false" v-html="icon('x', 12)"></button>
        </header>
        <div class="bm-anim-pop__body">
          <div v-if="plays" class="bm-anim-stage" data-sve-build-anim-stage>
            <div
              :key="take"
              class="bm-anim-stage__set"
              :data-anim="anim.target === 'words' ? 'children' : anim.target"
              :data-anim-preset="anim.preset || null"
              :data-anim-on="anim.on === 'hover' ? 'hover' : null"
              :style="stageStyle"
            >
              <i v-for="n in 4" :key="n"></i>
            </div>
            <span class="bm-anim-stage__note">{{ t(anim.on === 'hover' ? 'anim_stage_hover' : 'anim_stage_note') }}</span>
          </div>
          <p v-if="reduced" class="bm-anim-reduced" data-sve-build-anim-reduced>{{ t('anim_reduced_note') }}</p>

          <section class="bm-anim-block is-first">
            <template v-if="plays">
              <div class="bm-anim-line">
                <span>{{ t('anim_trigger') }}</span>
                <span class="bm-anim-box">
                  <span class="bm-anim-box__val">{{ t(`anim_on_${anim.on}`) }}</span>
                  <span class="bm-anim-caret" v-html="icon('caret', 10)"></span>
                  <select :value="anim.on" :aria-label="t('anim_trigger')" data-sve-build-anim-trigger @change="pickTrigger($event.target.value)">
                    <option v-for="[on, , word] in TRIGGERS" :key="on" :value="on" :disabled="on === 'switch' && !switches.length">
                      {{ t(word) }}
                    </option>
                  </select>
                </span>
              </div>
              <div v-if="anim.on === 'switch'" class="bm-anim-line">
                <span>{{ t('anim_switch') }}</span>
                <span class="bm-anim-box">
                  <code class="bm-anim-box__val">{{ anim.switch }}</code>
                  <span class="bm-anim-caret" v-html="icon('caret', 10)"></span>
                  <select :value="anim.switch" :aria-label="t('anim_switch')" data-sve-build-anim-switch @change="write({ ...anim, switch: $event.target.value })">
                    <option v-for="name in switches" :key="name" :value="name">{{ name }}</option>
                  </select>
                </span>
              </div>
              <div class="bm-anim-line">
                <span>{{ t('anim_preset') }}</span>
                <span class="bm-anim-box">
                  <span class="bm-anim-box__val">{{ presetText }}</span>
                  <span class="bm-anim-caret" v-html="icon('caret', 10)"></span>
                  <select :value="anim.preset" :aria-label="t('anim_preset')" data-sve-build-anim-preset @change="setPreset($event.target.value)">
                    <option v-if="!anim.preset" value="" disabled>{{ t('anim_own') }}</option>
                    <optgroup v-for="[group, list] in groups" :key="group" :label="t(`anim_group_${group}`)">
                      <option v-for="p in list" :key="p.handle" :value="p.handle">{{ label(p) }}</option>
                    </optgroup>
                  </select>
                </span>
              </div>
              <div v-if="anim.on === 'view'" class="bm-anim-line">
                <span>{{ t('anim_repeat') }}</span>
                <button type="button" role="switch" class="bm-anim-switch" :aria-checked="anim.repeat" :aria-label="t('anim_repeat')" data-sve-build-anim-repeat @click="write({ ...anim, repeat: !anim.repeat })"></button>
              </div>
            </template>
            <div class="bm-anim-line">
              <span>{{ t('anim_active') }}</span>
              <button type="button" role="switch" class="bm-anim-switch" :aria-checked="!anim.off" :aria-label="t('anim_active')" data-sve-build-anim-active @click="write({ ...anim, off: !anim.off })"></button>
            </div>
          </section>

          <section v-if="hasEffects" class="bm-anim-block" data-sve-build-anim-effects>
            <div class="bm-anim-head">
              <span>{{ t('anim_effects') }}</span>
              <span v-if="missing.length" ref="addMenuEl" class="bm-anim-head__add">
                <button
                  type="button"
                  class="bm-anim-head__plus"
                  :aria-label="t('anim_add_effect')"
                  :title="t('anim_add_effect')"
                  aria-haspopup="menu"
                  :aria-expanded="addMenu"
                  data-sve-build-anim-add-menu
                  @click="addMenu = !addMenu"
                  v-html="icon('plus', 12)"
                ></button>
                <div v-if="addMenu" class="bm-anim-menu" role="menu">
                  <button v-for="effect in missing" :key="effect.key" type="button" role="menuitem" :data-sve-build-anim-add-item="effect.key" @click="pickEffect(effect)">
                    {{ t(`anim_fx_${effect.key}`) }}
                  </button>
                </div>
              </span>
            </div>
            <p v-if="effectsNote" class="bm-anim-hint" data-sve-build-anim-effects-note>{{ t(effectsNote) }}</p>
            <div v-for="effect in effects" :key="effect.key" class="bm-anim-line is-effect" :data-sve-build-anim-effect="effect.key">
              <span>{{ t(`anim_fx_${effect.key}`) }}</span>
              <Num
                :value="effect.value"
                :raw="effect.raw"
                :unit="effect.unit"
                :max="effect.max"
                :min="effect.min"
                :step="effect.step"
                :cap="!!effect.cap"
                :decimal="decimal"
                @set="(v) => setEffect(effect.key, v)"
              />
              <button type="button" class="bm-anim-minus" :aria-label="t('anim_remove')" @click="setEffect(effect.key, null)" v-html="icon('minus', 12)"></button>
            </div>
            <div v-if="missing.length" class="bm-anim-more">
              <span>+</span>
              <template v-for="(effect, i) in missing" :key="effect.key">
                <span v-if="i" aria-hidden="true">·</span>
                <button type="button" :data-sve-build-anim-add="effect.key" @click="addEffect(effect)">{{ t(`anim_fx_${effect.key}`) }}</button>
              </template>
            </div>
          </section>

          <section v-if="plays" class="bm-anim-block" data-sve-build-anim-timing>
            <div class="bm-anim-head"><span>{{ t('anim_timing') }}</span></div>
            <div v-for="[key, word] in timing" :key="key" class="bm-anim-line" :data-sve-build-anim-time="key">
              <span>{{ t(word) }}</span>
              <Num
                :value="anim[key] ?? RUNTIME_DEFAULTS[key]"
                unit="ms"
                :max="TIMING_RANGE[key].max"
                :step="TIMING_RANGE[key].step"
                blank
                :decimal="decimal"
                @set="(v) => setTime(key, v)"
              />
            </div>
            <div v-if="staggers" class="bm-anim-line">
              <span>{{ t('anim_step_curve') }}</span>
              <span class="bm-anim-box">
                <span class="bm-anim-box__val">{{ stepCurve === '1.5' ? t('anim_step_faster') : stepCurve === '1' ? t('anim_step_linear') : stepCurve }}</span>
                <span class="bm-anim-caret" v-html="icon('caret', 10)"></span>
                <select :value="stepCurve" :aria-label="t('anim_step_curve')" data-sve-build-anim-step-curve @change="setVar('--anim-step-curve', $event.target.value === '1' ? null : $event.target.value)">
                  <option value="1">{{ t('anim_step_linear') }}</option>
                  <option value="1.5">{{ t('anim_step_faster') }}</option>
                  <option v-if="stepCurve !== '1' && stepCurve !== '1.5'" :value="stepCurve">{{ stepCurve }}</option>
                </select>
              </span>
            </div>
            <div class="bm-anim-line">
              <span>{{ t('anim_ease') }}</span>
              <span class="bm-anim-ease">
                <span class="bm-anim-box">
                  <span class="bm-anim-box__val">{{ t(`anim_ease_${ease}`) }}</span>
                  <span class="bm-anim-caret" v-html="icon('caret', 10)"></span>
                  <select :value="ease" :aria-label="t('anim_ease')" data-sve-build-anim-ease @change="setEase($event.target.value)">
                    <option v-for="[key] in EASES" :key="key" :value="key">{{ t(`anim_ease_${key}`) }}</option>
                    <option value="spring">{{ t('anim_ease_spring') }}</option>
                    <option v-if="ease === 'custom'" value="custom" disabled>{{ t('anim_ease_custom') }}</option>
                  </select>
                </span>
                <button
                  ref="curveBtn"
                  type="button"
                  class="bm-anim-curvebtn"
                  :aria-pressed="curveOpen"
                  :aria-label="t('anim_curve_open')"
                  :title="t('anim_curve_open')"
                  data-sve-build-anim-curve
                  @click="curveOpen = !curveOpen"
                  v-html="icon('curve', 13)"
                ></button>
              </span>
            </div>
            <div v-if="anim.target === 'children'" class="bm-anim-line">
              <span>{{ t('anim_target') }}</span>
              <span class="bm-anim-seg">
                <button type="button" :aria-pressed="false" @click="soon">{{ t('anim_target_pick') }}</button>
                <button type="button" :aria-pressed="true">{{ t('anim_target_all') }}</button>
              </span>
            </div>
          </section>

          <section v-if="SETTING_FIELDS[anim.target]" class="bm-anim-block" data-sve-build-anim-settings>
            <div class="bm-anim-head"><span>{{ t('anim_settings') }}</span></div>
            <p class="bm-anim-hint">{{ t(`anim_${anim.target}_note`) }}</p>
            <template v-if="anim.target === 'ticker'">
              <div class="bm-anim-line" data-sve-build-anim-ticker-time>
                <span>{{ t('anim_ticker_time') }}</span>
                <Num :value="tickerSeconds" unit="s" :max="60" :min="1" :step="0.5" blank :decimal="decimal" @set="(v) => setTime('duration', v === null ? null : v * 1000)" />
              </div>
            </template>
            <div v-for="[name, word, range] in SETTING_FIELDS[anim.target]" :key="name" class="bm-anim-line" :data-sve-build-anim-setting="name">
              <span>{{ t(word) }}</span>
              <Num :value="remOf(name)" unit="rem" :max="range.max" :step="range.step" blank :decimal="decimal" @set="(v) => setRem(name, v)" />
            </div>
            <template v-if="anim.target === 'ticker'">
              <div class="bm-anim-line">
                <span>{{ t('anim_ticker_dir') }}</span>
                <span class="bm-anim-seg" data-sve-build-anim-ticker-dir>
                  <button type="button" :aria-pressed="!reversed" @click="setVar('--anim-dir', null)">{{ t('anim_dir_left') }}</button>
                  <button type="button" :aria-pressed="reversed" @click="setVar('--anim-dir', 'reverse')">{{ t('anim_dir_right') }}</button>
                </span>
              </div>
              <div class="bm-anim-line">
                <span>{{ t('anim_ticker_pause') }}</span>
                <button type="button" role="switch" class="bm-anim-switch" :aria-checked="anim.pause" :aria-label="t('anim_ticker_pause')" data-sve-build-anim-pause @click="write({ ...anim, pause: !anim.pause })"></button>
              </div>
            </template>
          </section>

          <section v-if="naming" class="bm-anim-block bm-anim-naming" data-sve-build-anim-naming>
            <div class="bm-anim-head"><span>{{ t('anim_save_preset') }}</span></div>
            <p class="bm-anim-hint">{{ t('anim_save_note') }}</p>
            <input
              ref="nameInput"
              v-model="newName"
              class="bm-anim-name"
              type="text"
              :maxlength="40"
              :placeholder="t('anim_preset_name')"
              :aria-label="t('anim_preset_name')"
              data-sve-build-anim-name
              @keydown.enter.prevent="saveLook"
            />
            <div class="bm-anim-foot">
              <button type="button" class="bm-anim-btn" @click="naming = false">{{ t('anim_cancel') }}</button>
              <button type="button" class="bm-anim-btn is-primary" :disabled="!newName.trim() || saving" data-sve-build-anim-save-confirm @click="saveLook">{{ t('anim_save') }}</button>
            </div>
          </section>
          <section v-else class="bm-anim-block bm-anim-foot">
            <button v-if="playable" type="button" class="bm-anim-btn" data-sve-build-anim-replay @click="play"><span v-html="icon('play', 12)"></span>{{ t('anim_play') }}</button>
            <button v-if="plays" type="button" class="bm-anim-btn is-primary" data-sve-build-anim-save @click="startNaming">{{ t('anim_save_preset') }}</button>
          </section>
        </div>
      </div>

      <div
        v-if="open && curveOpen && anim"
        ref="curvePop"
        class="sve-build bm-anim-pop is-curve"
        role="dialog"
        :aria-label="t('anim_ease')"
        data-sve-build-anim-curve-pop
        :style="{ left: `${curveSpot.left}px`, top: `${curveSpot.top}px` }"
      >
        <header class="bm-anim-pop__head">
          <b>{{ t('anim_ease') }}</b>
          <button type="button" class="bm-anim-pop__x" :aria-label="t('close')" @click="curveOpen = false" v-html="icon('x', 12)"></button>
        </header>
        <div class="bm-anim-pop__body">
          <section class="bm-anim-block is-first">
            <span class="bm-anim-seg">
              <button type="button" :aria-pressed="curveMode === 'ease'" data-sve-build-anim-mode="ease" @click="setMode('ease')">{{ t('anim_ease_ease') }}</button>
              <button type="button" :aria-pressed="curveMode === 'spring'" data-sve-build-anim-mode="spring" @click="setMode('spring')">{{ t('anim_ease_spring') }}</button>
            </span>

            <template v-if="curveMode === 'ease'">
              <div class="bm-anim-line">
                <span>{{ t('anim_ease') }}</span>
                <span class="bm-anim-box">
                  <span class="bm-anim-box__val">{{ t(`anim_ease_${ease}`) }}</span>
                  <span class="bm-anim-caret" v-html="icon('caret', 10)"></span>
                  <select :value="ease" :aria-label="t('anim_ease')" @change="setEase($event.target.value)">
                    <option v-for="[key] in EASES" :key="key" :value="key">{{ t(`anim_ease_${key}`) }}</option>
                    <option v-if="ease === 'custom' || ease === 'spring'" :value="ease" disabled>{{ t(`anim_ease_${ease}`) }}</option>
                  </select>
                </span>
              </div>
              <div class="bm-anim-line">
                <span>{{ t('anim_duration') }}</span>
                <Num :value="duration" unit="ms" :max="TIMING_RANGE.duration.max" :step="TIMING_RANGE.duration.step" blank :decimal="decimal" @set="(v) => setTime('duration', v)" />
              </div>
              <div class="bm-anim-line">
                <span>{{ t('anim_bezier') }}</span>
                <span class="bm-anim-box">
                  <input class="bm-anim-bezier" type="text" :value="bezierText" :readonly="!points" :aria-label="t('anim_bezier')" data-sve-build-anim-bezier @change="setBezier" @keydown.enter="$event.target.blur()" />
                </span>
              </div>
            </template>
            <template v-else>
              <div v-for="[key, word, range] in SPRING" :key="key" class="bm-anim-line" :data-sve-build-anim-spring="key">
                <span>{{ t(word) }}</span>
                <Num :value="spring[key]" :max="range.max" :min="range.min" :step="range.step" :decimal="decimal" @set="(v) => setSpring(key, v)" />
              </div>
            </template>

            <div class="bm-anim-graph">
              <svg
                ref="graph"
                :viewBox="`0 0 ${S} ${S}`"
                aria-hidden="true"
                data-sve-build-anim-graph
                @pointermove="pull"
                @pointerup="drop"
                @pointercancel="drop"
              >
                <rect :x="P" :y="P" :width="S - 2 * P" :height="S - 2 * P" class="g-line" />
                <g v-for="g in [0.25, 0.5, 0.75]" :key="g">
                  <line :x1="gx(g)" :y1="P" :x2="gx(g)" :y2="S - P" class="g-line" />
                  <line :x1="P" :y1="gy(g)" :x2="S - P" :y2="gy(g)" class="g-line" />
                </g>
                <line :x1="gx(0)" :y1="gy(0)" :x2="gx(1)" :y2="gy(1)" class="g-diag" />
                <template v-if="points">
                  <line :x1="gx(0)" :y1="gy(0)" :x2="gx(points[0])" :y2="gy(points[1])" class="g-arm" />
                  <line :x1="gx(1)" :y1="gy(1)" :x2="gx(points[2])" :y2="gy(points[3])" class="g-arm" />
                  <path :d="`M ${gx(0)} ${gy(0)} C ${gx(points[0])} ${gy(points[1])}, ${gx(points[2])} ${gy(points[3])}, ${gx(1)} ${gy(1)}`" class="g-curve" />
                  <circle :cx="gx(points[0])" :cy="gy(points[1])" r="5" class="g-h1" data-sve-build-anim-handle="0" @pointerdown="grab(0, $event)" />
                  <circle :cx="gx(points[2])" :cy="gy(points[3])" r="5" class="g-h2" data-sve-build-anim-handle="1" @pointerdown="grab(1, $event)" />
                  <text :x="gx(points[0]) - 4" :y="gy(points[1]) - 8" font-size="9" class="g-text">{{ short(points[0]) }}, {{ short(points[1]) }}</text>
                  <text :x="gx(points[2]) + 8" :y="gy(points[3]) + 3" font-size="9" class="g-text">{{ short(points[2]) }}, {{ short(points[3]) }}</text>
                </template>
                <polyline v-else :points="springLine" class="g-curve" />
              </svg>
            </div>
            <div class="bm-anim-strip" :style="{ '--strip-ease': easeRaw, '--strip-time': `${duration}ms` }" data-sve-build-anim-strip>
              <i class="bm-anim-strip__sq"></i>
              <span class="bm-anim-strip__room"></span>
              <span class="bm-anim-strip__line"></span>
              <span class="bm-anim-strip__end"></span>
            </div>
            <div class="bm-anim-strip__hint">{{ t('anim_curve_hover') }}</div>
          </section>
          <section class="bm-anim-block">
            <p class="bm-anim-note" v-html="t('anim_curve_note')"></p>
          </section>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style>
/*
 * The canvas's panel primitives (Block, Head, Line, Box, Num, Seg, Switch,
 * Chip, Trigger, Tile, SmallBtn, Popover), px over 16 in rem, its host theme
 * in the panel's own greys (BuildPanel.vue): fill.tertiary --bm-raise,
 * fill.secondary --bm-hover, text.secondary --bm-muted, text.tertiary
 * --bm-faint, stroke.tertiary --bm-line, stroke.secondary --bm-edge.
 * `bm-anim-` only, under the panel's root.
 */
.sve-build .bm-scroll:has(> .bm-anim) { padding: 0; border-top-width: 0; }
.sve-build .bm-anim, .sve-build.bm-anim-pop { --bm-quiet: color-mix(in srgb, var(--bm-ink) 38%, transparent); }
.sve-build .bm-anim { padding-bottom: 0.25rem; }
.sve-build .bm-anim-ic { flex: none; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.sve-build .bm-anim-block { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.625rem 0.75rem; border-top: 1px solid var(--bm-line); }
.sve-build .bm-anim-block.is-first { border-top: 0; }
:root[data-sve-zones] .sve-build .bm-anim > .bm-anim-block { padding-inline: 0; }
.sve-build .bm-anim-head { display: flex; align-items: center; font-size: 0.75rem; font-weight: 600; }
.sve-build .bm-anim-head__add { position: relative; display: flex; margin-left: auto; font-weight: 400; }
.sve-build .bm-anim-head__plus { display: flex; color: var(--bm-muted); }
.sve-build .bm-anim-head__plus:hover { color: var(--bm-ink); }
.sve-build .bm-anim-none { color: var(--bm-muted); font-size: 0.6875rem; line-height: 1.45; }

/* Chip */
.sve-build .bm-anim-chipwrap { position: relative; }
.sve-build .bm-anim-chip { display: flex; align-items: center; gap: 0.5rem; width: 100%; height: 1.75rem; padding: 0 1.75rem 0 0.5rem; border-radius: 0.375rem; background: var(--bm-raise); border: 1px solid transparent; text-align: start; }
.sve-build .bm-anim-chip:hover { background: var(--bm-hover); }
.sve-build .bm-anim-chip[aria-pressed='true'] { background: color-mix(in srgb, var(--bm-accent) 22%, transparent); border-color: color-mix(in srgb, var(--bm-accent) 50%, transparent); }
.sve-build .bm-anim-chip__ic { display: flex; color: var(--bm-muted); }
.sve-build .bm-anim-chip[aria-pressed='true'] .bm-anim-chip__ic { color: var(--bm-accent); }
.sve-build .bm-anim-chip b { flex: none; font-weight: 600; }
.sve-build .bm-anim-chip__sub { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--bm-muted); }
.sve-build .bm-anim-chip__more { position: absolute; top: 50%; right: 0.25rem; display: grid; place-items: center; width: 1.25rem; height: 1.25rem; border-radius: 0.25rem; color: var(--bm-muted); transform: translateY(-50%); }
.sve-build .bm-anim-chip__more:hover { background: var(--bm-hover); color: var(--bm-ink); }
.sve-build .bm-anim-menu { position: absolute; top: calc(100% + 0.25rem); right: 0; z-index: 5; display: grid; min-width: 11rem; padding: 0.25rem; border: 1px solid var(--bm-edge); border-radius: 0.5rem; background: var(--bm-panel); box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4); }
.sve-build .bm-anim-menu button { display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.5rem; border-radius: 0.375rem; text-align: start; }
.sve-build .bm-anim-menu button:hover { background: var(--bm-hover); }

/* Triggers */
.sve-build .bm-anim-triggers { display: flex; flex-direction: column; gap: 0.0625rem; margin-inline: -0.5rem; }
.sve-build .bm-anim-trigger { display: flex; align-items: center; gap: 0.625rem; padding: 0.375rem 0.5rem; border-radius: 0.375rem; text-align: start; }
.sve-build .bm-anim-trigger:hover { background: color-mix(in srgb, var(--bm-raise) 60%, transparent); }
.sve-build .bm-anim-trigger[aria-pressed='true'] { background: var(--bm-raise); }
.sve-build .bm-anim-trigger__ic { display: flex; color: var(--bm-accent); }
.sve-build .bm-anim-trigger__word { flex: 1; min-width: 0; }
.sve-build .bm-anim-switches { display: flex; flex-wrap: wrap; align-items: center; gap: 0.375rem; padding-left: 1.875rem; color: var(--bm-faint); font-size: 0.625rem; }
.sve-build .bm-anim-switches code { padding: 0.0625rem 0.3125rem; border-radius: 0.25rem; background: var(--bm-hover); color: var(--bm-muted); font-size: 0.625rem; white-space: nowrap; }

/* Library */
.sve-build .bm-anim-lib { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.375rem; }
.sve-build .bm-anim-tile { display: flex; flex-direction: column; align-items: center; gap: 0.375rem; padding: 0.625rem 0.375rem 0.5rem; border-radius: 0.5rem; background: var(--bm-raise); transition: background 0.12s; }
.sve-build .bm-anim-tile:hover { background: var(--bm-hover); }
.sve-build .bm-anim-tile svg { width: 4rem; height: 2.5rem; }
.sve-build .bm-anim-tile > span { color: var(--bm-muted); font-size: 0.625rem; line-height: 1.2; text-align: center; }
.sve-build .bm-anim-mine { display: flex; justify-content: center; margin-top: 0.125rem; }

/* My presets: a row each, its × asking first */
.sve-build .bm-anim-own { display: flex; flex-direction: column; gap: 0.125rem; }
.sve-build .bm-anim-own__row { display: flex; align-items: center; gap: 0.375rem; min-height: 1.625rem; padding: 0 0.25rem 0 0.5rem; border-radius: 0.375rem; background: var(--bm-raise); }
.sve-build .bm-anim-own__use { flex: 1; min-width: 0; padding: 0.3125rem 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: start; }
.sve-build .bm-anim-own__use:hover { color: var(--bm-ink); text-decoration: underline; }
.sve-build .bm-anim-own__use[aria-pressed='true'] { color: var(--bm-accent); font-weight: 600; }
.sve-build .bm-anim-own__used { color: var(--bm-faint); font-size: 0.625rem; white-space: nowrap; }
.sve-build .bm-anim-own__sure { padding: 0.125rem 0.375rem; border-radius: 0.25rem; background: var(--bm-accent); color: #fff; font-size: 0.625rem; font-weight: 600; white-space: nowrap; }
.sve-build .bm-anim-own__sure:disabled { opacity: 0.4; cursor: default; }
.sve-build .bm-anim-own__x { display: flex; padding: 0.25rem; color: var(--bm-faint); }
.sve-build .bm-anim-own__x:hover { color: var(--bm-ink); }

/* SmallBtn */
.sve-build .bm-anim-btn { display: inline-flex; align-items: center; gap: 0.375rem; height: 1.625rem; padding: 0 0.625rem; border-radius: 0.375rem; background: var(--bm-raise); color: var(--bm-ink); font-size: 0.6875rem; font-weight: 600; white-space: nowrap; }
.sve-build .bm-anim-btn:hover { background: var(--bm-hover); }
.sve-build .bm-anim-btn.is-primary { background: var(--bm-accent); color: #fff; }
.sve-build .bm-anim-btn.is-primary:hover { background: color-mix(in srgb, var(--bm-accent) 85%, #fff); }
.sve-build .bm-anim-btn:disabled { opacity: 0.5; cursor: default; }

/* Popover: the editor over the panel, the curve beside the editor (lib/beside.js) */
.sve-build.bm-anim-pop { position: fixed; z-index: 99999; display: flex; flex-direction: column; width: 20rem; height: auto; max-height: calc(100vh - 1rem); border: 1px solid var(--bm-edge); border-radius: 0.75rem; box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.45); overflow: hidden; }
.sve-build.bm-anim-pop.is-curve { width: 16.875rem; }
.sve-build .bm-anim-pop__head { flex: none; display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 0.75rem; }
.sve-build .bm-anim-pop__head b { font-weight: 600; }
.sve-build .bm-anim-pop__tag { padding: 0.0625rem 0.375rem; border-radius: 0.25rem; background: var(--bm-hover); color: var(--bm-muted); font-size: 0.625rem; }
.sve-build .bm-anim-pop__x { display: flex; margin-left: auto; color: var(--bm-faint); }
.sve-build .bm-anim-pop__x:hover { color: var(--bm-ink); }
.sve-build .bm-anim-pop__body { min-height: 0; overflow: auto; }

/* Stage: the page's own runtime.css on four bars */
.sve-build .bm-anim-stage { position: relative; display: flex; align-items: center; justify-content: center; height: 8rem; background: var(--bm-bg); overflow: hidden; }
.sve-build .bm-anim-stage__set { display: flex; flex-direction: column; gap: 0.3125rem; }
.sve-build .bm-anim-stage__set > i { display: block; width: 8.75rem; height: 1.25rem; border-radius: 0.3125rem; background: color-mix(in srgb, var(--bm-accent) 50%, transparent); border: 1px solid color-mix(in srgb, var(--bm-accent) 90%, transparent); }
.sve-build .bm-anim-stage__note { position: absolute; right: 0.5rem; bottom: 0.375rem; color: var(--bm-faint); font-size: 0.625rem; }
.sve-build .bm-anim-reduced { margin: 0; padding: 0.4375rem 0.75rem; border-top: 1px solid var(--bm-line); background: color-mix(in srgb, var(--bm-accent) 8%, transparent); color: var(--bm-faint); font-size: 0.6875rem; line-height: 1.4; }

/* Line, Box, Select, Num, Seg, Switch */
.sve-build .bm-anim-line { display: grid; grid-template-columns: 5.75rem minmax(0, 1fr); align-items: center; gap: 0.5rem; }
.sve-build .bm-anim-line > span:first-child { color: var(--bm-muted); font-size: 0.6875rem; white-space: nowrap; }
.sve-build .bm-anim-line.is-effect { grid-template-columns: 5.75rem minmax(0, 1fr) 1rem; }
.sve-build .bm-anim-box { position: relative; display: flex; align-items: center; gap: 0.375rem; min-width: 0; height: 1.625rem; padding: 0 0.5rem; border-radius: 0.375rem; background: var(--bm-raise); }
.sve-build .bm-anim-box:hover { background: var(--bm-hover); }
.sve-build .bm-anim-box__val { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sve-build .bm-anim-caret { display: flex; color: var(--bm-faint); }
.sve-build .bm-anim-box select { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
.sve-build .bm-anim-box:has(select:focus-visible) { outline: 2px solid var(--bm-accent); outline-offset: 1px; }
.sve-build .bm-anim-num { position: relative; display: flex; align-items: center; min-width: 0; height: 1.625rem; padding: 0 0.5rem; border-radius: 0.375rem; background: var(--bm-raise); overflow: hidden; cursor: ew-resize; touch-action: none; }
.sve-build .bm-anim-num.is-raw { cursor: default; }
.sve-build .bm-anim-num__fill { position: absolute; top: 0; bottom: 0; left: 0; background: var(--bm-hover); pointer-events: none; }
.sve-build .bm-anim-num__in { position: relative; flex: 1; min-width: 0; padding: 0; border: 0; background: none; color: var(--bm-ink); font: inherit; cursor: inherit; pointer-events: none; }
.sve-build .bm-anim-num__in:focus { outline: 0; cursor: text; pointer-events: auto; }
.sve-build .bm-anim-num:has(.bm-anim-num__in:focus) { outline: 2px solid var(--bm-accent); outline-offset: 1px; cursor: text; }
.sve-build .bm-anim-num__unit { position: relative; color: var(--bm-faint); font-size: 0.625rem; pointer-events: none; }
.sve-build .bm-anim-seg { display: flex; gap: 0.125rem; padding: 0.125rem; border-radius: 0.375rem; background: var(--bm-raise); }
.sve-build .bm-anim-seg button { flex: 1; padding: 0.25rem 0.375rem; border-radius: 0.25rem; color: var(--bm-faint); font-size: 0.6875rem; white-space: nowrap; text-align: center; }
.sve-build .bm-anim-seg button:hover { color: var(--bm-ink); }
.sve-build .bm-anim-seg button[aria-pressed='true'] { background: var(--bm-accent); color: #fff; }
.sve-build .bm-anim-switch { position: relative; justify-self: end; width: 1.75rem; height: 1rem; border-radius: 0.5rem; background: var(--bm-hover); transition: background 0.15s; }
.sve-build .bm-anim-switch::after { content: ''; position: absolute; top: 0.125rem; left: 0.125rem; width: 0.75rem; height: 0.75rem; border-radius: 50%; background: var(--bm-ink); transition: left 0.15s; }
.sve-build .bm-anim-switch[aria-checked='true'] { background: var(--bm-accent); }
.sve-build .bm-anim-switch[aria-checked='true']::after { left: 0.875rem; }

/* Effects */
.sve-build .bm-anim-minus { display: flex; color: var(--bm-faint); }
.sve-build .bm-anim-minus:hover { color: var(--bm-ink); }
.sve-build .bm-anim-more { display: flex; flex-wrap: wrap; gap: 0.25rem; color: var(--bm-faint); font-size: 0.625rem; }
.sve-build .bm-anim-more button:hover { color: var(--bm-ink); text-decoration: underline; }

/* Curve */
.sve-build .bm-anim-ease { display: grid; grid-template-columns: minmax(0, 1fr) 1.625rem; gap: 0.375rem; }
.sve-build .bm-anim-curvebtn { display: flex; align-items: center; justify-content: center; height: 1.625rem; border-radius: 0.375rem; background: var(--bm-raise); border: 1px solid color-mix(in srgb, var(--bm-accent) 60%, transparent); color: var(--bm-accent); }
.sve-build .bm-anim-curvebtn:hover, .sve-build .bm-anim-curvebtn[aria-pressed='true'] { background: color-mix(in srgb, var(--bm-accent) 22%, transparent); }
.sve-build .bm-anim-bezier { flex: 1; min-width: 0; padding: 0; border: 0; background: none; color: var(--bm-ink); font: 0.6875rem var(--bm-mono); }
.sve-build .bm-anim-bezier:focus { outline: 0; }
.sve-build .bm-anim-graph { display: flex; justify-content: center; padding: 0.5rem; border-radius: 0.5rem; background: var(--bm-bg); }
.sve-build .bm-anim-graph svg { width: 10.5rem; height: 10.5rem; overflow: visible; touch-action: none; }
.sve-build .bm-anim-graph .g-line { fill: none; stroke: var(--bm-line); }
.sve-build .bm-anim-graph .g-diag { stroke: var(--bm-quiet); stroke-dasharray: 3 3; }
.sve-build .bm-anim-graph .g-arm { stroke: var(--bm-faint); stroke-dasharray: 2 2; }
.sve-build .bm-anim-graph .g-curve { fill: none; stroke: var(--bm-accent); stroke-width: 2; stroke-linejoin: round; }
.sve-build .bm-anim-graph .g-h1 { fill: var(--bm-ink); cursor: grab; }
.sve-build .bm-anim-graph .g-h2 { fill: var(--bm-accent); cursor: grab; }
.sve-build .bm-anim-graph .g-text { fill: var(--bm-faint); pointer-events: none; }
.sve-build .bm-anim-strip { position: relative; display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.5rem; border-radius: 0.375rem; background: var(--bm-raise); }
.sve-build .bm-anim-strip__sq { position: absolute; top: 50%; left: 0.5rem; width: 0.875rem; height: 0.875rem; border-radius: 0.1875rem; background: var(--bm-accent); transform: translateY(-50%); transition: left var(--strip-time, 0.6s) var(--strip-ease, ease); }
.sve-build .bm-anim-strip:hover .bm-anim-strip__sq { left: calc(100% - 1.875rem - 1px); }
.sve-build .bm-anim-strip__room { flex: none; width: 0.875rem; height: 0.875rem; }
.sve-build .bm-anim-strip__line { flex: 1; height: 0; border-top: 1px dashed var(--bm-quiet); }
.sve-build .bm-anim-strip__end { flex: none; width: 1px; height: 0.875rem; background: var(--bm-faint); }
.sve-build .bm-anim-strip__hint { color: var(--bm-faint); font-size: 0.625rem; text-align: center; }
.sve-build .bm-anim-note { color: var(--bm-muted); font-size: 0.6875rem; line-height: 1.45; }
.sve-build .bm-anim-foot { flex-direction: row; justify-content: space-between; }
.sve-build .bm-anim-foot:not(:has(> *)) { display: none; }
.sve-build .bm-anim-naming .bm-anim-foot { display: flex; justify-content: flex-end; gap: 0.375rem; }
.sve-build .bm-anim-name { height: 1.625rem; padding: 0 0.5rem; border: 0; border-radius: 0.375rem; background: var(--bm-raise); color: var(--bm-ink); font: inherit; }
.sve-build .bm-anim-name:focus { outline: 0.125rem solid var(--bm-accent); outline-offset: 1px; }
.sve-build .bm-anim-hint { margin: 0; color: var(--bm-faint); font-size: 0.625rem; line-height: 1.45; }
.sve-build .bm-anim-box code.bm-anim-box__val { font: 0.6875rem var(--bm-mono); }

/* Scrim: the panel dimmed and softened under the editor; the canvas beside it stays clear */
.sve-build.bm-anim-scrim { position: fixed; z-index: 99998; height: auto; min-height: 0; background: color-mix(in srgb, var(--bm-bg) 55%, transparent); -webkit-backdrop-filter: blur(0.1875rem); backdrop-filter: blur(0.1875rem); }
</style>
