<script setup>
/**
 * The left column in Visual Build, two sides as Bricks has them: Add (All |
 * Elements | Components and the tiles) when nothing is picked, and the picked
 * element (Content | Style) once it is clicked on the canvas or in the HTML
 * tree. Content is the element's text (BuildContent.vue), a component's
 * fields, a loop's or condition's Settings.
 *
 * Which side shows is the port's (`port.panel`): a click on an element sets
 * it, a + or Escape puts Add back — the canvas's Escape reads it too, so the
 * first Escape lets go of the element and only the next one leaves the
 * section. Adding something keeps Add open: only a click opens the element.
 *
 * Drawn in the Figma look (Figma and Paper's design panels), on the approved
 * sketch's content, in the editor's blue. Everything the panel knows and does goes
 * through one object, the port (`provide('sveBuild')`), which
 * build-mode/boot.js builds from the editor: the dock's file and lists, the
 * HTML tree's pick, the Tailwind pane's class functions and its state menu.
 * The panel holds only what it shows: which tab, and the flash a + on the
 * canvas sets off. A write bumps `port.rev`,
 * and everything drawn from the file reads it.
 *
 * Fields and Settings are not drawn here: a component's fields are the props
 * panel's, a loop's or condition's settings the HTML tree inspector's. The
 * port mounts those into the host this panel gives them.
 */
import { computed, nextTick, onBeforeUnmount, provide, ref, watch } from 'vue';
import BuildAdd from './BuildAdd.vue';
import BuildContent from './BuildContent.vue';
import BuildGallery from './BuildGallery.vue';
import BuildStyle from './BuildStyle.vue';
import { describeAt } from '../../build-mode/place.js';
import { ic } from '../../build-mode/icons.js';

const props = defineProps({
  port: { type: Object, required: true },
});

provide('sveBuild', props.port);

const port = props.port;
const here = computed(() => {
  port.rev.value;

  return describeAt(port.html(), port.plusPath() || port.selectedPath());
});
const picked = computed(() => {
  port.rev.value;

  return port.plusPath() ? describeAt(port.html(), port.selectedPath()).node : here.value.node;
});

/** What Content is about: the picked element, or the rich text it stands in. */
const contentNode = computed(() => {
  port.rev.value;

  const owner = picked.value ? port.wholeOwner?.(picked.value.path) : '';

  return owner ? describeAt(port.html(), owner).node : picked.value;
});
const isRich = computed(() => (port.rev.value, !!picked.value && port.isRichBlock()));
const isGallery = computed(() => (port.rev.value, !!contentNode.value && !!port.isGallery?.(contentNode.value.path)));

/** Add, or the element — the element only while there is one to show. */
const side = computed(() => (port.panel.value === 'element' && picked.value ? 'element' : 'add'));

/** All | Elements | Components, at the top of Add. */
const SUBS = [
  ['all', 'all'],
  ['el', 'elements'],
  ['comp', 'components'],
];
const sub = ref('all');

/** What the element's Content is: a component's fields, a loop's or condition's settings, or its own. */
const content = computed(() => {
  const kind = picked.value?.kind;

  return kind === 'component' ? 'fields' : kind === 'loop' || kind === 'if' ? 'settings' : 'content';
});
/** A component, a loop and a condition have no classes of their own: Content is all they have. */
const styled = computed(() => content.value === 'content');

/* Content | Style: the last one chosen, kept in this browser. */
const TAB_KEY = 'sve-build-element-tab';

function readTab() {
  try {
    return window.localStorage.getItem(TAB_KEY) === 'content' ? 'content' : 'style';
  } catch {
    return 'style';
  }
}

const chosen = ref(readTab());
const tab = computed(() => (styled.value ? chosen.value : 'content'));

watch(port.contentAsked, () => {
  chosen.value = 'content';
});

function choose(value) {
  chosen.value = value;

  try {
    window.localStorage.setItem(TAB_KEY, value);
  } catch {
    /* the choice lasts this visit */
  }
}

/** The element's tabs: [value, icon, word]. A loop's or condition's one tab is its Settings. */
const TABS = computed(() => {
  if (styled.value) {
    return [
      ['content', 'form', 'tab_content'],
      ['style', 'sliders', 'tab_style'],
    ];
  }

  return content.value === 'fields' ? [['content', 'form', 'tab_content']] : [['content', 'sliders', 'tab_settings']];
});

/** A row's name in the panel: what it is, a column's number, a component's file. */
function nameOf(row) {
  if (!row) {
    return '';
  }

  if (row.kind === 'component') {
    return row.label || row.src || port.t('el_component');
  }

  if (row.kind === 'column') {
    return port.t('el_column', { n: row.index });
  }

  if (row.kind === 'tag') {
    return row.tag;
  }

  const key = `el_${row.kind}`;
  const word = port.t(key);

  return word === key ? row.tag : word;
}

/* A + target set anywhere — the canvas's +, the tree's — is Add's. */
watch(
  () => port.plusPath(),
  (plus, before) => {
    if (plus && plus !== before) {
      port.panel.value = 'add';
    }
  }
);

/*
 * A + pressed on the canvas (`port.pointed` counts them) opens Add at its top,
 * and Add's place and tiles flash once — the same + pressed again too.
 */
const scroller = ref(null);
const nudged = ref(false);

watch(
  () => port.pointed?.value,
  async () => {
    port.panel.value = 'add';
    nudged.value = false;
    await nextTick();

    if (scroller.value) {
      scroller.value.scrollTop = 0;
      // Read once the class is off, so a second + starts the flash over.
      void scroller.value.offsetWidth;
    }

    nudged.value = true;
  }
);

function nudgeEnd(event) {
  if (event.animationName === 'sve-bm-nudge') {
    nudged.value = false;
  }
}

/* Fields / Settings: the editor's own panels, mounted into our host. */
const host = ref(null);
let unmountHost = null;

function remount() {
  unmountHost?.();
  unmountHost = null;

  if (!host.value || !picked.value) {
    return;
  }

  const mount = side.value !== 'element' || tab.value !== 'content' ? null : content.value === 'fields' ? port.mountFields : content.value === 'settings' ? port.mountSettings : null;

  unmountHost = mount ? mount(host.value, picked.value) || null : null;
}

watch([host, side, tab, () => picked.value?.path], remount);
onBeforeUnmount(() => unmountHost?.());
</script>

<template>
  <div class="sve-build" data-sve-build-root :data-sve-build-side="side">
    <template v-if="side === 'add'">
      <div class="bm-tabs" role="tablist">
        <button
          v-for="[value, word] in SUBS"
          :key="value"
          type="button"
          role="tab"
          :aria-selected="sub === value"
          :data-sve-build-sub="value"
          @click="sub = value"
        >{{ port.t(word) }}</button>
      </div>

      <div ref="scroller" class="bm-scroll" :class="{ 'is-nudged': nudged }" @animationend="nudgeEnd">
        <BuildAdd :here="here" :name-of="nameOf" :sub="sub" />
      </div>
    </template>

    <template v-else>
      <div class="fg-head bm-el-head">
        <span class="bm-chip-tag" :class="{ 'bm-chip-comp': picked.kind === 'component' }">{{ picked.kind === 'component' ? 'component' : picked.tag }}</span>
        <b>{{ isRich ? port.t('content_rich') : isGallery ? port.t('content_gallery') : nameOf(picked) }}</b>
        <span class="fg-head__acts">
          <button type="button" class="fg-ib" :title="port.t('tab_add')" :aria-label="port.t('tab_add')" data-sve-build-add @click="port.panel.value = 'add'" v-html="ic('plus')"></button>
          <template v-if="styled">
            <button type="button" class="fg-ib" :title="port.t('duplicate')" :aria-label="port.t('duplicate')" @click="port.duplicate()" v-html="ic('copy')"></button>
            <button type="button" class="fg-ib" :title="port.t('delete')" :aria-label="port.t('delete')" @click="port.remove()" v-html="ic('trash')"></button>
          </template>
        </span>
      </div>

      <div class="bm-tabs" role="tablist">
        <button
          v-for="[value, icon, word] in TABS"
          :key="value"
          type="button"
          role="tab"
          :aria-selected="tab === value"
          :data-sve-build-tab="value"
          @click="choose(value)"
        ><span v-html="ic(icon)"></span>{{ port.t(word) }}</button>
      </div>

      <div ref="scroller" class="bm-scroll">
        <BuildStyle v-if="tab === 'style'" :key="picked.path" :node="picked" />

        <div v-else-if="!styled" class="bm-content">
          <p v-if="content === 'fields'" class="bm-note is-top" v-html="port.t('fields_note', { path: `<code>partials/components/${picked.label}.antlers.html</code>` })"></p>
          <p v-else class="bm-note is-top">{{ port.t('settings_note') }}</p>
          <div ref="host" class="bm-host"></div>
        </div>

        <BuildGallery v-else-if="isGallery" :key="contentNode.path" :node="contentNode" />
        <BuildContent v-else :key="contentNode.path" :node="contentNode" />
      </div>
    </template>
  </div>
</template>

<style>
/*
 * The approved sketch's left panel (~/Sites/build-mode/sketch.html), rule
 * for rule, in the editor's blue (#3858e9 where the sketch had its violet).
 * Always dark, as Live Preview's chrome and the dock are. Every selector is
 * under the panel's own root and every class is `bm-`, so nothing here can
 * reach Statamic's markup or another panel.
 */
.sve-build {
  /* The dock's own greys — the Tailwind pane's (dock/layout.js, TwClassList.vue):
     #1E1E21 under everything, #d4d4d4 text, chips rgba(128,128,128,.16) / .28
     on hover (solid here, so a clipped shape can wear them), white hairlines.
     The editor's blue for what is picked; the yellow for "later". */
  --bm-bg: #18181a;
  --bm-panel: #1e1e21;
  --bm-raise: #2e2e30;
  --bm-hover: #39393c;
  --bm-line: rgba(255, 255, 255, 0.08);
  --bm-edge: rgba(255, 255, 255, 0.16);
  --bm-ink: #d4d4d4;
  --bm-muted: #9d9d9e;
  --bm-faint: #79797a;
  --bm-accent: #3858e9;
  --bm-accent-soft: rgba(56, 88, 233, 0.28);
  --bm-accent-text: #b4c1ff;
  --bm-inh: #a9b8ff;
  --bm-inh-line: rgba(56, 88, 233, 0.55);
  --bm-zone-side: #252528;
  --bm-zone-end: #2b2b2e;
  --bm-bar: #4a4a4e;
  --bm-tag-bg: #1c2846;
  --bm-tag: #94b5ff;
  --bm-comp-bg: #103a30;
  --bm-comp: #52d9b1;
  --bm-lock: #e4b24f;
  --bm-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color-scheme: dark;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: var(--bm-panel);
  color: var(--bm-ink);
  font: 450 0.75rem/1.35 Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
}
.sve-build *, .sve-build *::before, .sve-build *::after { box-sizing: border-box; }
.sve-build :where(button) { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
.sve-build :where(input, select, textarea) { font: inherit; color: inherit; }
.sve-build :where(p, h3, h4) { margin: 0; }
.sve-build :is(button, input, select, textarea):focus-visible { outline: 2px solid var(--bm-accent); outline-offset: 1px; }
.sve-build code { font-family: var(--bm-mono); font-size: 0.88em; }
.sve-build .bm-ic { width: 1rem; height: 1rem; flex: none; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
.sve-build span:has(> .bm-ic), .sve-build span:has(> svg) { display: inline-flex; }
.sve-build .bm-ib { width: 1.875rem; height: 1.875rem; display: grid; place-items: center; border-radius: 0.375rem; color: var(--bm-muted); }
.sve-build .bm-ib:hover { background: var(--bm-hover); color: var(--bm-ink); }
.sve-build .bm-ib.is-on, .sve-build .bm-ib[aria-pressed='true'] { background: var(--bm-accent); color: #fff; }
.sve-build .bm-ib.sm { width: 1.375rem; height: 1.375rem; }

/* Tabs and scroll */
/* Add | Style: a light grey track, the open tab in the blue of Style's "This element" (`.fg-target`). */
.sve-build .bm-tabs { display: flex; flex: none; gap: 0.1875rem; margin: 0.625rem 0.75rem 0; padding: 0.15rem; border-radius: 0.375rem; background: var(--bm-raise); }
.sve-build .bm-tabs button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.35rem; padding: 0.375rem 0; border-radius: 0.28rem; color: var(--bm-muted); font-weight: 600; font-size: 0.6875rem; letter-spacing: 0.05em; text-transform: uppercase; transition: background 0.12s, color 0.12s; }
.sve-build .bm-tabs .bm-ic, .sve-build .bm-tabs svg { width: 0.875rem; height: 0.875rem; }
.sve-build .bm-tabs button:hover { color: var(--bm-ink); background: var(--bm-hover); }
.sve-build .bm-tabs button[aria-selected='true'] { background: var(--bm-accent); color: #fff; }
/* The picked element's name and its +, duplicate and delete, above Content | Style, on the tabs' side gutter. */
.sve-build .bm-el-head { flex: none; margin: 0.625rem 0.75rem 0; }
.sve-build .bm-scroll { flex: 1; min-height: 0; overflow: auto; padding: 0.75rem; }
/* Style: the panel's own side gutter and none of the families' — their lines end where their fields do. */
.sve-build .bm-scroll:has(> .fg-style) { padding: 0 0.75rem; }

/* Add */
.sve-build .bm-target { display: flex; align-items: center; gap: 0.45rem; padding: 0.4rem 0.55rem; border-radius: 0.3rem; background: var(--bm-accent-soft); color: var(--bm-accent-text); font-size: 0.75rem; }
.sve-build .bm-target b { color: #fff; font-weight: 600; }
.sve-build .bm-target > span:nth-child(2) { flex: 1; min-width: 0; display: block; }
.sve-build .bm-target.is-none { background: var(--bm-raise); color: var(--bm-muted); }
.sve-build .bm-seg { display: flex; gap: 0.125rem; padding: 0.125rem; background: var(--bm-raise); border: 1px solid transparent; border-radius: 0.3rem; min-width: 0; }
.sve-build .bm-seg button { flex: 1; min-width: 0; display: flex; align-items: center; justify-content: center; gap: 0.3rem; padding: 0.32rem 0.2rem; border-radius: 0.28rem; color: var(--bm-muted); font-size: 0.6875rem; font-weight: 600; position: relative; white-space: nowrap; }
.sve-build .bm-seg button:hover { color: var(--bm-ink); }
.sve-build .bm-seg button[aria-pressed='true'] { background: var(--bm-panel); color: var(--bm-ink); box-shadow: inset 0 0 0 1px var(--bm-edge); }
.sve-build .bm-seg button.inh { background: transparent; color: var(--bm-inh); box-shadow: inset 0 0 0 1px var(--bm-inh-line); font-style: italic; }
.sve-build .bm-seg .bm-ic, .sve-build .bm-seg svg { width: 0.875rem; height: 0.875rem; }
.sve-build .bm-search { display: flex; align-items: center; gap: 0.45rem; padding: 0 0.55rem; height: 1.875rem; border-radius: 0.3rem; background: var(--bm-raise); border: 1px solid transparent; color: var(--bm-muted); }
.sve-build .bm-search:focus-within { border-color: var(--bm-accent); }
.sve-build .bm-search input { flex: 1; min-width: 0; background: none; border: 0; outline: 0; color: var(--bm-ink); }
.sve-build .bm-find { display: flex; align-items: center; gap: 0.375rem; }
.sve-build .bm-target + .bm-find { margin-top: 0.65rem; }
.sve-build .bm-find .bm-search { flex: 1; min-width: 0; }
.sve-build .bm-view { flex: none; }
.sve-build .bm-view button { padding: 0.32rem 0.4rem; }
.sve-build .bm-g h4 { margin: 1rem 0 0.5rem; font-size: 0.75rem; font-weight: 600; color: var(--bm-ink); }
/* As many tiles as the column has room for, 5.5rem each at the least: one in a narrow column, five at the most. */
.sve-build .bm-tiles { --bm-tile-gap: 0.375rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(max(5.5rem, calc((100% - 4 * var(--bm-tile-gap)) / 5)), 1fr)); gap: var(--bm-tile-gap); }
.sve-build .bm-tile { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; padding: 0.7rem 0.2rem 0.5rem; border-radius: 0.375rem; background: var(--bm-raise); border: 1px solid transparent; font-size: 0.6875rem; text-align: center; user-select: none; }
.sve-build .bm-tile > span:first-child { color: var(--bm-muted); }
.sve-build .bm-tile > span:nth-child(2) { max-width: 100%; overflow-wrap: anywhere; }
.sve-build .bm-tile svg { width: 1.25rem; height: 1.25rem; }
.sve-build .bm-tile:hover:not(:disabled) { border-color: var(--bm-accent); background: var(--bm-hover); }
.sve-build .bm-tile:hover:not(:disabled) > span:first-child { color: #fff; }
.sve-build .bm-tile:disabled { cursor: default; opacity: 0.45; }
.sve-build .bm-tile.is-mono > span:last-child { font-family: var(--bm-mono); }
.sve-build .bm-tile.is-loop > span:first-child { color: var(--sve-fam-loop, #a5b4fc); }
.sve-build .bm-tile.is-if > span:first-child { color: var(--sve-fam-if, #e8c468); }
/* A component wears an element's tile, in the components' green; its handle is the tooltip, and the list's right edge. */
.sve-build .bm-tile.is-comp > span:first-child,
.sve-build .bm-tile.is-comp:hover:not(:disabled) > span:first-child { color: var(--bm-comp); }
.sve-build .bm-tile.is-comp:hover:not(:disabled) { border-color: var(--bm-comp); }
.sve-build .bm-tile > code { display: none; color: var(--bm-faint); font-size: 0.625rem; }
/* The list view: one row per tile, icon and name on a line. */
.sve-build .bm-tiles.is-list { grid-template-columns: minmax(0, 1fr); gap: 0.25rem; }
.sve-build .bm-tiles.is-list .bm-tile { flex-direction: row; gap: 0.6rem; padding: 0.45rem 0.65rem; font-size: 0.75rem; text-align: start; }
.sve-build .bm-tiles.is-list .bm-tile svg { width: 1.125rem; height: 1.125rem; }
.sve-build .bm-tiles.is-list .bm-tile > span:nth-child(2) { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sve-build .bm-tiles.is-list .bm-tile > code { display: block; }
/* A + pressed on the canvas: one blue outline round the whole of Add, fading as the tiles' flash did (BuildPanel `nudged`). */
.sve-build .bm-scroll.is-nudged { animation: sve-bm-nudge 0.9s ease-out; }
@keyframes sve-bm-nudge {
  0%, 35% { box-shadow: inset 0 0 0 0.125rem var(--bm-accent); }
  100% { box-shadow: inset 0 0 0 0.125rem transparent; }
}
.sve-build .bm-note { margin: 1rem 0 0; padding-top: 0.75rem; border-top: 1px solid var(--bm-line); font-size: 0.6875rem; line-height: 1.55; color: var(--bm-faint); }
.sve-build .bm-note + .bm-note { margin-top: 0.5rem; padding-top: 0; border-top: 0; }
.sve-build .bm-note.is-top { margin: 0 0 0.5rem; padding: 0; border: 0; }
.sve-build .bm-note code { color: var(--bm-muted); }
.sve-build .bm-muted { color: var(--bm-muted); font-size: 0.75rem; }
.sve-build .bm-empty { display: grid; justify-items: center; gap: 0.5rem; padding: 3rem 1rem; text-align: center; color: var(--bm-muted); }
.sve-build .bm-empty .bm-ic { width: 1.5rem; height: 1.5rem; }
.sve-build .bm-soon { display: inline-block; font-style: normal; font-size: 0.5625rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--bm-lock); border: 1px solid rgba(228, 178, 79, 0.45); border-radius: 999px; padding: 0 0.35rem; line-height: 1.5; vertical-align: middle; }
.sve-build .bm-legend { margin: 0.75rem 0 0; font-size: 0.6875rem; color: var(--bm-faint); display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; }
/* SVG's popup (BuildSvgPopup.vue): the panel's look on the body, beside the panel — the frame Loop and If's popup wears. */
.sve-build.bm-pop { position: fixed; z-index: 99999; width: 20rem; height: auto; max-height: min(30rem, calc(100vh - 1rem)); border: 1px solid var(--bm-edge); border-radius: 0.6rem; box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4); overflow: hidden; }
.sve-build .bm-pop-head { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin: 0; padding: 0.4rem 0.4rem 0.4rem 0.75rem; border-bottom: 1px solid var(--bm-line); font-size: 0.625rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--bm-muted); }
.sve-build .bm-pop-body { min-height: 0; overflow: auto; padding: 0.625rem 0.75rem 0.75rem; }
/* The site's SVGs (BuildSvgPicker.vue): each on a light ground, as currentColor draws black in an <img>. */
.sve-build .bm-svgs { display: grid; gap: 0.625rem; }
.sve-build .bm-svg-g h4 { margin: 0 0 0.375rem; font-size: 0.6875rem; font-weight: 600; color: var(--bm-muted); overflow-wrap: anywhere; }
.sve-build .bm-svg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(4.25rem, 1fr)); gap: 0.375rem; }
.sve-build .bm-svg { display: flex; flex-direction: column; align-items: stretch; gap: 0.3rem; min-width: 0; padding: 0.3rem; border-radius: 0.375rem; background: var(--bm-raise); border: 1px solid transparent; font-size: 0.625rem; color: var(--bm-muted); }
.sve-build .bm-svg > img, .sve-build .bm-svg > .bm-svg-big { display: grid; place-items: center; width: 100%; height: 2.75rem; padding: 0.4rem; border-radius: 0.25rem; background: #f4f4f5; color: #52525b; object-fit: contain; }
.sve-build .bm-svg > .bm-svg-big svg { width: 1.25rem; height: 1.25rem; }
.sve-build .bm-svg > span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center; }
.sve-build .bm-svg:hover { border-color: var(--bm-accent); color: var(--bm-ink); }
.sve-build .bm-svg.is-on { border-color: var(--bm-accent); background: var(--bm-accent-soft); color: var(--bm-accent-text); }
.sve-build .bm-picker h3 { display: flex; align-items: center; justify-content: space-between; font-size: 0.875rem; }
.sve-build .bm-picker p { margin: 0.25rem 0 0.75rem; font-size: 0.75rem; color: var(--bm-muted); }
.sve-build .bm-pk-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; }
.sve-build .bm-pk, .sve-build .bm-sp-o { display: flex; flex-direction: column; gap: 0.45rem; padding: 0.6rem; border-radius: 0.5rem; background: var(--bm-raise); border: 1px solid var(--bm-line); text-align: left; }
.sve-build .bm-pk:hover:not(:disabled), .sve-build .bm-sp-o:hover { border-color: var(--bm-accent); }
.sve-build .bm-pk:disabled { cursor: default; }
.sve-build .bm-bars { display: flex; gap: 0.2rem; height: 2.25rem; }
.sve-build .bm-bars i { display: block; border-radius: 0.2rem; background: var(--bm-bar); }
.sve-build .bm-pk:hover:not(:disabled) .bm-bars i, .sve-build .bm-sp-o[aria-pressed='true'] .bm-bars i { background: var(--bm-accent); }
.sve-build .bm-pk-l { font-weight: 600; display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap; }
.sve-build .bm-sp { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.35rem; }
.sve-build .bm-sp-o { padding: 0.4rem; gap: 0.3rem; }
.sve-build .bm-sp-o .bm-bars { height: 1.1rem; gap: 0.12rem; }
.sve-build .bm-sp-o[aria-pressed='true'] { border-color: var(--bm-accent); }
.sve-build .bm-sp-l { font-size: 0.625rem; color: var(--bm-muted); text-align: center; }

/* A Grid's rows and columns (BuildGridPicker.vue): each structure drawn as its cells */
.sve-build .bm-gp h4 { margin: 0.75rem 0 0.4rem; font-size: 0.6875rem; font-weight: 600; color: var(--bm-muted); }
.sve-build .bm-gp h4:first-child { margin-top: 0; }
.sve-build .bm-cells { display: flex; flex-direction: column; gap: 0.2rem; height: 2.25rem; }
.sve-build .bm-cells .bm-bars { flex: 1; height: auto; min-height: 0; }

/* Content: the element's text, in a box the colour of a field */
.sve-build .bm-content { display: grid; gap: 0.875rem; }
.sve-build .bm-text { display: grid; gap: 0.4rem; }
.sve-build .bm-text .fg-lab { margin: 0; }
.sve-build .bm-text textarea { display: block; width: 100%; min-height: 3.25rem; max-height: 20rem; padding: 0.45rem 0.55rem; border-radius: 0.3rem; background: var(--bm-raise); border: 1px solid transparent; outline: 0; color: var(--bm-ink); font: 450 0.8125rem/1.45 Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; resize: vertical; field-sizing: content; }
.sve-build .bm-text textarea:hover { border-color: var(--bm-edge); }
.sve-build .bm-text textarea:focus { border-color: var(--bm-accent); }
.sve-build .bm-text textarea::placeholder { color: var(--bm-faint); }
/* One line: a box of one line's height, its words and its icon on the middle. Text: a box that looks like room for text, the icon in its corner. */
.sve-build .bm-text-box { position: relative; }
.sve-build .bm-text-box .bm-inp, .sve-build .bm-text-box textarea { display: block; width: 100%; padding-right: 1.75rem; font: 450 0.8125rem/1.45 Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; }
.sve-build .bm-text-box .bm-inp { height: 1.875rem; outline: 0; }
.sve-build .bm-text-box .bm-inp:focus { border-color: var(--bm-accent); }
.sve-build .bm-text-box textarea { min-height: 6.5rem; padding-block: 0.45rem; border-color: var(--bm-line); }
.sve-build .bm-pick-field { position: absolute; top: 0.3125rem; right: 0.3rem; display: grid; place-items: center; width: 1.25rem; height: 1.25rem; padding: 0; border: 0; border-radius: 0.25rem; background: transparent; color: var(--bm-muted); cursor: pointer; }
.sve-build .bm-remove-file { display: inline-flex; align-items: center; justify-content: center; gap: 0.375rem; width: 100%; height: 1.875rem; border: 1px solid var(--bm-line); border-radius: 0.375rem; background: transparent; color: var(--bm-muted); font-size: 0.75rem; cursor: pointer; }
.sve-build .bm-remove-file:hover { background: var(--bm-raise); color: var(--bm-ink); }
.sve-build .bm-remove-file span { display: grid; place-items: center; }
.sve-build .bm-remove-file .bm-ic { width: 0.8125rem; height: 0.8125rem; }
.sve-build .bm-link-more { display: grid; gap: 0.625rem; margin-top: 0.75rem; }
.sve-build .bm-link-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; font-size: 0.6875rem; color: var(--bm-muted); }
.sve-build .bm-switch { flex: none; position: relative; width: 1.75rem; height: 1rem; padding: 0; border: 0; border-radius: 1rem; background: var(--bm-line); cursor: pointer; }
.sve-build .bm-switch::after { content: ''; position: absolute; top: 0.125rem; left: 0.125rem; width: 0.75rem; height: 0.75rem; border-radius: 50%; background: #fff; transition: transform 0.12s ease; }
.sve-build .bm-switch[aria-checked="true"] { background: var(--bm-accent); }
.sve-build .bm-switch[aria-checked="true"]::after { transform: translateX(0.75rem); }
.sve-build .bm-pick-field:hover { background: var(--bm-line); color: var(--bm-ink); }
.sve-build .bm-pick-field .bm-ic { width: 0.8125rem; height: 0.8125rem; }
/* The Control Panel's own field (an image, a video, a link — PropValues.vue): its label as the panel's labels are. */
.sve-build .bm-field-host .sve-pv__label { font-size: 0.6875rem; font-weight: 450; color: var(--bm-muted); }

/* Style */
.sve-build .bm-chip-tag { flex: none; font: 500 0.6875rem/1.3 var(--bm-mono); padding: 0.1rem 0.35rem; border-radius: 0.25rem; background: var(--bm-tag-bg); color: var(--bm-tag); }
.sve-build .bm-chip-tag.bm-chip-comp { background: var(--bm-comp-bg); color: var(--bm-comp); }
.sve-build .bm-st-sel { display: flex; gap: 0.35rem; flex-wrap: wrap; padding: 0.35rem; margin-bottom: 0.6rem; border-radius: 0.5rem; background: var(--bm-raise); border: 1px solid var(--bm-line); }
.sve-build .bm-selchip { display: flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.6875rem; font-weight: 600; }
.sve-build .bm-selchip .bm-ic { width: 0.75rem; height: 0.75rem; }
.sve-build .bm-selchip.is-on { background: var(--bm-accent); color: #fff; }
.sve-build .bm-selchip.is-ghost { color: var(--bm-muted); border: 1px dashed var(--bm-line); }
.sve-build .bm-st-bp { display: grid; grid-template-columns: 1fr auto; gap: 0.35rem; }
.sve-build .bm-st-bp .bm-state { gap: 0.25rem; padding: 0.32rem 0.55rem; }
.sve-build .bm-st-bp .bm-state .bm-ic { width: 0.75rem; height: 0.75rem; }
.sve-build .bm-st-bp .bm-state.is-set { color: var(--bm-accent-text); font-family: var(--bm-mono); }
.sve-build .bm-st-hint { margin: 0.4rem 0 0.2rem; font-size: 0.6875rem; color: var(--bm-faint); }
.sve-build .bm-st-hint b { color: var(--bm-accent-text); font-weight: 600; }
.sve-build .bm-st-hint code { color: var(--bm-muted); }
.sve-build .bm-st-g { border-top: 1px solid var(--bm-line); margin-top: 0.6rem; }
.sve-build .bm-st-g summary { list-style: none; display: flex; align-items: center; gap: 0.4rem; padding: 0.65rem 0 0.2rem; cursor: pointer; font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--bm-muted); }
.sve-build .bm-st-g summary::-webkit-details-marker { display: none; }
.sve-build .bm-st-g:not([open]) .bm-st-chev { transform: rotate(-90deg); }
.sve-build .bm-st-chev { width: 0.75rem; height: 0.75rem; }
.sve-build .bm-st-g summary svg:not(.bm-st-chev) { width: 0.85rem; height: 0.85rem; color: var(--bm-muted); }
.sve-build .bm-st-row { display: grid; grid-template-columns: 5.25rem minmax(0, 1fr); align-items: center; gap: 0.5rem; margin: 0.45rem 0; }
.sve-build .bm-st-row.is-wide { grid-template-columns: 1fr; gap: 0.35rem; }
.sve-build .bm-st-l { font: 500 0.6875rem var(--bm-mono); color: var(--bm-muted); display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; min-width: 0; overflow-wrap: anywhere; }
.sve-build .bm-al-l { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; width: 100%; font: 500 0.75rem ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; color: var(--bm-ink); }
.sve-build .bm-al-l code { font-size: 0.625rem; color: var(--bm-faint); }
.sve-build .bm-sel, .sve-build .bm-inp { width: 100%; height: 1.875rem; padding: 0 0.45rem; border-radius: 0.375rem; background: var(--bm-raise); border: 1px solid var(--bm-line); color: var(--bm-ink); font-size: 0.75rem; }
.sve-build .bm-sel.inh { color: var(--bm-inh); font-style: italic; border-color: var(--bm-inh-line); }
.sve-build .bm-sws { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.sve-build .bm-sw { width: 1.375rem; height: 1.375rem; border-radius: 0.35rem; border: 1px solid var(--bm-edge); }
.sve-build .bm-sw[aria-pressed='true'] { box-shadow: 0 0 0 2px var(--bm-panel), 0 0 0 4px var(--bm-accent); }
.sve-build .bm-sw.inh { box-shadow: 0 0 0 2px var(--bm-panel), 0 0 0 4px var(--bm-inh-line); }
.sve-build .bm-seg-cols button { flex-direction: column; gap: 0.2rem; padding: 0.35rem 0.1rem; }
.sve-build .bm-mini { display: flex; gap: 0.08rem; width: 1.4rem; height: 0.55rem; }
.sve-build .bm-mini i { flex: 1; border-radius: 0.1rem; background: currentColor; opacity: 0.55; }
.sve-build .bm-st-cls { margin-top: 0.75rem; padding-top: 0.7rem; border-top: 1px solid var(--bm-line); }
.sve-build .bm-cls-list { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.45rem; }
.sve-build .bm-cls { padding: 0.12rem 0.4rem; border-radius: 0.25rem; background: var(--bm-raise); border: 1px solid var(--bm-line); color: var(--bm-ink); font-size: 0.6875rem; }
.sve-build .bm-cls em { font-style: normal; color: var(--bm-inh); }
.sve-build .bm-vin { display: block; width: 100%; height: 1.875rem; padding: 0 0.45rem; border-radius: 0.375rem; background: var(--bm-raise); border: 1px solid var(--bm-line); color: var(--bm-ink); font: 500 0.6875rem var(--bm-mono); text-align: start; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sve-build .bm-vin.is-empty { color: var(--bm-faint); }
.sve-build .bm-vin.inh { color: var(--bm-inh); font-style: italic; }
.sve-build .bm-vin:hover { border-color: var(--bm-edge); }
.sve-build .bm-vin-after { margin-top: 0.4rem; }
.sve-build .bm-seg-al button { padding: 0.4rem 0; }
.sve-build .bm-seg-al .bm-ic, .sve-build .bm-seg-al svg { width: 1.15rem; height: 1.15rem; }
.sve-build .bm-seg-al.is-col .bm-ic, .sve-build .bm-seg-al.is-col svg { transform: rotate(90deg); }
.sve-build .bm-st-jump { margin: 0.6rem 0 0.2rem; }
.sve-build .bm-st-jump button { padding: 0.35rem 0; }
.sve-build .bm-st-jump svg { width: 0.95rem; height: 0.95rem; }
.sve-build .bm-st-el { margin-top: 0.4rem; }

/* Margin and padding, one box */
.sve-build .bm-sp-top { display: flex; align-items: center; gap: 0.4rem; margin: 0.4rem 0 0.5rem; }
.sve-build .bm-sp-mode { flex: 1; }
.sve-build .bm-sp-mode button { font-family: var(--bm-mono); font-size: 0.6875rem; }
/* The unit a side is dragged in, beside padding | margin. */
.sve-build .bm-sp-unit { flex: none; }
.sve-build .bm-sp-unit button { flex: none; padding: 0.32rem 0.35rem; font-family: var(--bm-mono); font-size: 0.625rem; }
/* A side that drags: up and down, and the value it is on while it moves. */
.sve-build .bm-spx .bm-vin.is-scrub { cursor: ns-resize; touch-action: none; }
.sve-build .bm-spx .bm-vin.is-live { color: #fff; background: var(--bm-bg); border-color: var(--bm-accent); }
.sve-build .bm-spx { position: relative; display: block; height: 9.5rem; padding: 0; margin-top: 0.2rem; border-radius: 0.45rem; overflow: hidden; border: 1px solid var(--bm-line); background: var(--bm-bg); }
.sve-build .bm-tz { position: absolute; inset: 0; background: var(--bm-raise); transition: background 0.12s; }
.sve-build .bm-tz-t, .sve-build .bm-tz-b { background: var(--bm-zone-end); }
.sve-build .bm-tz-l, .sve-build .bm-tz-r { background: var(--bm-zone-side); }
.sve-build .bm-tz-t { clip-path: polygon(0 0, 100% 0, 72% 34%, 28% 34%); }
.sve-build .bm-tz-b { clip-path: polygon(28% 66%, 72% 66%, 100% 100%, 0 100%); }
.sve-build .bm-tz-l { clip-path: polygon(0 0, 28% 34%, 28% 66%, 0 100%); }
.sve-build .bm-tz-r { clip-path: polygon(100% 0, 100% 100%, 72% 66%, 72% 34%); }
.sve-build .bm-spx-c { position: absolute; left: 28%; right: 28%; top: 34%; bottom: 34%; display: grid; place-items: center; border-radius: 0.2rem; background: var(--bm-panel); border: 1px solid var(--bm-line); font: 500 0.5625rem var(--bm-mono); color: var(--bm-faint); }
.sve-build .bm-spx .bm-vin { position: absolute; z-index: 2; width: 4.75rem; height: 1.5rem; padding: 0 0.3rem; text-align: center; background: transparent; border-color: transparent; font-size: 0.6875rem; }
.sve-build .bm-spx .bm-vin:hover, .sve-build .bm-spx .bm-vin:focus { background: var(--bm-bg); border-color: var(--bm-accent); outline: 0; }
.sve-build .bm-spx .bm-vin:not(.inh, .is-empty) { color: var(--bm-accent-text); }
.sve-build .bm-spx .bm-sp-t { top: 7%; left: 50%; transform: translateX(-50%); }
.sve-build .bm-spx .bm-sp-b { bottom: 7%; left: 50%; transform: translateX(-50%); }
.sve-build .bm-spx .bm-sp-l { left: 1.5%; top: 50%; transform: translateY(-50%); width: 25%; }
.sve-build .bm-spx .bm-sp-r { right: 1.5%; top: 50%; transform: translateY(-50%); width: 25%; }
/* A side with a value of its own (BuildValueInput: not empty, not inherited) is tinted. */
.sve-build .bm-spx:has(.bm-sp-t:not(.is-empty, .inh)) .bm-tz-t,
.sve-build .bm-spx:has(.bm-sp-b:not(.is-empty, .inh)) .bm-tz-b { background: rgba(56, 88, 233, 0.12); }
.sve-build .bm-spx:has(.bm-sp-l:not(.is-empty, .inh)) .bm-tz-l,
.sve-build .bm-spx:has(.bm-sp-r:not(.is-empty, .inh)) .bm-tz-r { background: rgba(56, 88, 233, 0.22); }
.sve-build .bm-spx:has(.bm-sp-t:hover, .bm-sp-t:focus) .bm-tz-t,
.sve-build .bm-spx:has(.bm-sp-b:hover, .bm-sp-b:focus) .bm-tz-b,
.sve-build .bm-spx:has(.bm-sp-l:hover, .bm-sp-l:focus) .bm-tz-l,
.sve-build .bm-spx:has(.bm-sp-r:hover, .bm-sp-r:focus) .bm-tz-r { background: var(--bm-accent-soft); }
.sve-build .bm-sp-link { margin-top: 0.45rem; }
.sve-build .bm-sp-link button { font-family: var(--bm-mono); font-size: 0.625rem; }

/* ------------------------------------------------------------------ *
 * The Figma look (Style): sections, labels over fields, fields with a
 * prefix inside, two to a row, Figma's alignment box
 * ------------------------------------------------------------------ */
.sve-build .bm-ic [fill='currentColor'] { fill: currentColor; }
.sve-build .fg-top { padding: 0.75rem 0 0.6rem; border-bottom: 1px solid var(--bm-line); display: grid; gap: 0.5rem; }
.sve-build .fg-head { display: flex; align-items: center; gap: 0.5rem; }
.sve-build .fg-head b { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.8125rem; font-weight: 600; }
.sve-build .fg-head__acts { display: flex; gap: 0.125rem; }
.sve-build .fg-ib { width: 1.75rem; height: 1.75rem; display: grid; place-items: center; flex: none; border-radius: 0.3rem; color: var(--bm-muted); }
.sve-build .fg-ib .bm-ic, .sve-build .fg-ib svg { width: 0.9375rem; height: 0.9375rem; }
.sve-build button.fg-ib:hover:not(:disabled) { background: var(--bm-raise); color: var(--bm-ink); }
.sve-build .fg-ib[aria-pressed='true'] { background: var(--bm-accent-soft); color: var(--bm-accent-text); }
.sve-build .fg-ib:disabled { opacity: 0.35; cursor: default; }
.sve-build .fg-ib.is-quiet { color: var(--bm-faint); }
.sve-build .fg-seg { display: flex; gap: 0.125rem; padding: 0.125rem; min-width: 0; border-radius: 0.3rem; background: var(--bm-raise); }
.sve-build .fg-seg button { flex: 1; min-width: 0; height: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 0.3rem; padding: 0 0.35rem; border-radius: 0.25rem; color: var(--bm-muted); font-size: 0.6875rem; font-weight: 500; white-space: nowrap; }
.sve-build .fg-seg button:hover:not(:disabled) { color: var(--bm-ink); }
.sve-build .fg-seg button[aria-pressed='true'] { background: var(--bm-panel); color: var(--bm-ink); box-shadow: inset 0 0 0 1px var(--bm-edge); }
.sve-build .fg-seg button.inh { background: transparent; color: var(--bm-inh); box-shadow: inset 0 0 0 1px var(--bm-inh-line); }
.sve-build .fg-seg button:disabled { cursor: default; }
.sve-build .fg-seg .bm-ic, .sve-build .fg-seg svg { width: 0.9375rem; height: 0.9375rem; }
.sve-build .fg-target button[aria-pressed='true'] { background: var(--bm-accent); color: #fff; box-shadow: none; }
.sve-build .fg-line { display: flex; align-items: center; gap: 0.375rem; min-width: 0; }
.sve-build .fg-line > :first-child { flex: 1; min-width: 0; }
.sve-build .fg-sizes button span:last-child { overflow: hidden; text-overflow: ellipsis; }
.sve-build .fg-sizes button span:first-child { display: inline-flex; flex: none; }
.sve-build .fg-sizes svg { width: 0.75rem; height: 0.75rem; }
.sve-build .fg-state { height: 1.75rem; display: flex; align-items: center; gap: 0.25rem; padding: 0 0.5rem; border-radius: 0.3rem; background: var(--bm-raise); color: var(--bm-muted); font-size: 0.6875rem; font-weight: 500; }
.sve-build .fg-state:hover { color: var(--bm-ink); }
.sve-build .fg-state .bm-ic { width: 0.75rem; height: 0.75rem; }
.sve-build .fg-state.is-set { color: var(--bm-accent-text); font-family: var(--bm-mono); }
.sve-build .fg-hint { margin: 0; font-size: 0.6875rem; line-height: 1.45; color: var(--bm-faint); }
.sve-build .fg-hint b { color: var(--bm-ink); font-weight: 600; }
.sve-build .fg-hint code { color: var(--bm-muted); }
.sve-build .fg-jump { display: flex; justify-content: space-between; }
.sve-build .fg-sec { border-bottom: 1px solid var(--bm-line); }
.sve-build .fg-sec__h { display: flex; align-items: center; gap: 0.4rem; min-height: 2.5rem; padding: 0.25rem 0; font-size: 0.75rem; font-weight: 600; color: var(--bm-ink); user-select: none; }
.sve-build .fg-sec:not(.is-open) .fg-sec__h { color: var(--bm-muted); }
.sve-build .fg-sec__acts { margin-left: auto; display: flex; align-items: center; gap: 0.25rem; }
/* The icon and the name: a button as wide as they are, so the room after them is no target. */
.sve-build .fg-sec__name { display: inline-flex; align-items: center; gap: 0.4rem; min-width: 0; padding: 0.25rem 0; color: inherit; font-weight: inherit; }
.sve-build .fg-sec__name:hover { color: var(--bm-ink); }
/* The + / − that opens and closes a family, on the light grey of a field. */
/* 40 % smaller than a field's icon button (1.75rem, its icon 0.9375rem). */
.sve-build .fg-sec__tog { width: 1.05rem; height: 1.05rem; border-radius: 0.25rem; background: var(--bm-raise); }
.sve-build .fg-sec__tog .bm-ic, .sve-build .fg-sec__tog svg { width: 0.5625rem; height: 0.5625rem; }
.sve-build button.fg-sec__tog:hover:not(:disabled) { background: var(--bm-hover); color: var(--bm-ink); }
/* Set on the element: a blue dot beside the family's name; hovered or focused, it shows the reset it does. */
.sve-build .fg-set { width: 1.25rem; height: 1.25rem; display: grid; place-items: center; flex: none; border-radius: 999px; color: var(--bm-accent-text); }
/* The blue of "This element", solid — no soft ring, which read as a darker blue. */
.sve-build .fg-set > i { width: 0.5rem; height: 0.5rem; border-radius: 999px; background: var(--bm-accent); }
.sve-build .fg-set > span { display: none; }
.sve-build .fg-set svg { width: 0.8125rem; height: 0.8125rem; }
.sve-build .fg-set:is(:hover, :focus-visible) { background: var(--bm-accent-soft); }
.sve-build .fg-set:is(:hover, :focus-visible) > i { display: none; }
.sve-build .fg-set:is(:hover, :focus-visible) > span { display: inline-flex; }
.sve-build .fg-sec__icon { display: inline-flex; color: var(--bm-muted); }
.sve-build .fg-sec__icon svg { width: 0.9375rem; height: 0.9375rem; }
.sve-build .fg-sec__b { display: grid; gap: 0.5rem; padding: 0.15rem 0 1rem; }
.sve-build .fg-sec:not(:has(.fg-sec__h)) .fg-sec__b { padding-top: 0.75rem; }
.sve-build .fg-row { display: grid; grid-template-columns: 5.25rem minmax(0, 1fr); align-items: center; gap: 0.5rem; }
.sve-build .fg-rlab { font: 500 0.6875rem var(--bm-mono); color: var(--bm-muted); }
.sve-build .fg-lab { margin: 0.1rem 0 -0.2rem; font-size: 0.6875rem; color: var(--bm-muted); }
.sve-build .fg-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; }
.sve-build .fg-cols { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.5rem; align-items: start; }
.sve-build .fg-cols > div { display: grid; gap: 0.5rem; align-content: start; }
.sve-build .fg-field { position: relative; display: flex; align-items: center; gap: 0.35rem; min-width: 0; height: 1.875rem; padding: 0 0.4rem; border-radius: 0.3rem; background: var(--bm-raise); border: 1px solid transparent; }
.sve-build .fg-field:hover { border-color: var(--bm-edge); }
.sve-build .fg-field:focus-within { border-color: var(--bm-accent); }
.sve-build .fg-pre { flex: none; display: grid; place-items: center; min-width: 1rem; color: var(--bm-faint); font-size: 0.6875rem; font-weight: 500; }
.sve-build .fg-pre .bm-ic, .sve-build .fg-pre svg { width: 0.875rem; height: 0.875rem; }
.sve-build .fg-suf { flex: none; display: flex; align-items: center; color: var(--bm-muted); }
.sve-build .fg-field .bm-vin, .sve-build .fg-select { flex: 1; min-width: 0; width: 100%; height: 100%; padding: 0; background: transparent; border: 0; outline: 0; color: var(--bm-ink); font: 450 0.75rem Inter, ui-sans-serif, system-ui, sans-serif; }
.sve-build .fg-field .bm-vin.is-empty { color: var(--bm-faint); }
.sve-build .fg-field .bm-vin.inh { color: var(--bm-inh); font-style: normal; }
.sve-build .fg-field .bm-vin.has-chip { color: transparent; }
.sve-build .fg-select { appearance: none; -webkit-appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' fill='none' stroke='%239d9d9e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.15rem center; background-size: 0.55rem; padding-right: 1rem; }
.sve-build .fg-select.inh { color: var(--bm-inh); }
.sve-build .fg-select option { background: var(--bm-panel); color: var(--bm-ink); }
.sve-build .fg-mode { appearance: none; -webkit-appearance: none; background: none; border: 0; color: var(--bm-muted); font: 500 0.6875rem Inter, ui-sans-serif, system-ui, sans-serif; cursor: pointer; text-align: right; }
.sve-build .fg-mode:hover { color: var(--bm-ink); }
.sve-build .fg-chip { position: absolute; left: 1.75rem; top: 50%; transform: translateY(-50%); z-index: 1; max-width: calc(100% - 2.2rem); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0.05rem 0.4rem; border-radius: 0.25rem; background: var(--bm-hover); color: var(--bm-ink); font-size: 0.6875rem; cursor: pointer; }
.sve-build .fg-chip.inh { background: transparent; box-shadow: inset 0 0 0 1px var(--bm-inh-line); color: var(--bm-inh); }
.sve-build .fg-color .fg-chip { left: 2.05rem; }
.sve-build .fg-swatch { flex: none; width: 1.125rem; height: 1.125rem; border-radius: 0.2rem; border: 1px solid var(--bm-edge); }
.sve-build .fg-swatch.is-empty { background: repeating-conic-gradient(var(--bm-bar) 0 25%, var(--bm-raise) 0 50%) 50% / 0.5rem 0.5rem; }
.sve-build .fg-matrix { display: grid; grid-template-columns: repeat(3, 1fr); width: 100%; aspect-ratio: 1.45; padding: 0.3rem; border-radius: 0.3rem; background: var(--bm-raise); }
.sve-build .fg-matrix button { position: relative; display: grid; place-items: center; border-radius: 0.2rem; }
.sve-build .fg-matrix button i { display: none; }
.sve-build .fg-matrix button::before { content: ''; width: 0.2rem; height: 0.2rem; border-radius: 50%; background: var(--bm-faint); }
.sve-build .fg-matrix button:hover::before { background: var(--bm-ink); }
.sve-build .fg-matrix button[aria-pressed='true']::before { display: none; }
.sve-build .fg-matrix button[aria-pressed='true'] { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.12rem; }
.sve-build .fg-matrix button[aria-pressed='true'] i { display: block; height: 0.14rem; border-radius: 1px; background: var(--bm-accent-text); }
.sve-build .fg-matrix button[aria-pressed='true'] i:nth-child(1) { width: 0.7rem; }
.sve-build .fg-matrix button[aria-pressed='true'] i:nth-child(2) { width: 0.95rem; }
.sve-build .fg-matrix button[aria-pressed='true'] i:nth-child(3) { width: 0.5rem; }
.sve-build .fg-matrix.is-col button[aria-pressed='true'] { flex-direction: row; }
.sve-build .fg-matrix.is-col button[aria-pressed='true'] i { width: 0.14rem; }
.sve-build .fg-matrix.is-col button[aria-pressed='true'] i:nth-child(1) { height: 0.7rem; }
.sve-build .fg-matrix.is-col button[aria-pressed='true'] i:nth-child(2) { height: 0.95rem; }
.sve-build .fg-matrix.is-col button[aria-pressed='true'] i:nth-child(3) { height: 0.5rem; }
.sve-build .fg-box { display: flex; align-items: flex-start; gap: 0.375rem; }
.sve-build .fg-box > .fg-grid { flex: 1; min-width: 0; }
.sve-build .fg-box > .fg-ib { margin-top: 0.06rem; }
.sve-build .fg-colsn button { flex-direction: column; gap: 0.15rem; height: auto; padding: 0.3rem 0.1rem; }
.sve-build .fg-check { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; cursor: pointer; }
.sve-build .fg-check input { appearance: none; -webkit-appearance: none; width: 0.875rem; height: 0.875rem; margin: 0; display: grid; place-content: center; border-radius: 0.2rem; border: 1px solid var(--bm-edge); background: var(--bm-raise); cursor: pointer; }
.sve-build .fg-check input::after { content: ''; width: 0.25rem; height: 0.5rem; margin-top: -0.1rem; border: solid #fff; border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); opacity: 0; }
.sve-build .fg-check input:checked { background: var(--bm-accent); border-color: var(--bm-accent); }
.sve-build .fg-check input:checked::after { opacity: 1; }
.sve-build .fg-sec .bm-seg-al button { padding: 0.3rem 0; }
.sve-build .fg-sec .bm-cls-list { margin-top: 0; }
</style>
