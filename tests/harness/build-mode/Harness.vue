<script setup>
/**
 * The harness around Build's panel: what the editor has around the left
 * column, drawn just enough to click — a preview of the file (the site's own
 * CSS), the HTML tree with Build's + on the rows that hold elements, and the
 * file itself, the way the dock shows it. One file, two doors: everything
 * here is drawn from `port.html()`.
 *
 * Not the editor. The preview here renders the file with Antlers taken out
 * and paints what the site's built CSS already has; a value nobody has used
 * on the site yet shows in the file and the panel, and in the editor once
 * Instant compiles it.
 */
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import BuildPanel from '../../../resources/js/cp/surfaces/BuildPanel.vue';
import { holdsElements } from '../../../resources/js/build-mode/catalog.js';
import { treeRows, HTML_ICONS } from './port.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';
import { findByPath } from '../../../resources/js/build-mode/place.js';
import { compile } from 'tailwindcss';
import themeSource from 'tailwindcss/theme.css?raw';
import utilitiesSource from 'tailwindcss/utilities.css?raw';
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import { buildTailwind, makeTailwindCompiler } from '../../../resources/js/tw-compile-core.js';

const props = defineProps({
  port: { type: Object, required: true },
  siteHead: { type: String, default: '' },
  tailwind: { type: Object, default: () => ({ css: '', plugins: [] }) },
  menu: { type: Object, required: true },
  ui: { type: Object, required: true },
});

const port = props.port;
const frame = ref(null);
const html = computed(() => (port.rev.value, port.html()));
const rows = computed(() => treeRows(html.value));
const selected = computed(() => (port.rev.value, port.selectedPath()));
const plus = computed(() => (port.rev.value, port.plusPath()));

/* ---------------- the preview ---------------- */

/** The file as a page: partial calls become a labelled box, every other Antlers tag goes. */
function previewHtml(source) {
  const comps = [];
  const walk = (nodes) => nodes.forEach((node) => (node.kind === 'component' ? comps.push(node) : walk(node.children)));

  walk(parseTemplateTree(source));

  let out = source;

  comps.sort((a, b) => b.from - a.from).forEach((node) => {
    out = `${out.slice(0, node.from)}<sve-comp data-path="${node.path}">${node.label}</sve-comp>${out.slice(node.to)}`;
  });

  return out.replace(/\{\{#[\s\S]*?#\}\}/g, '').replace(/\{\{[\s\S]*?\}\}/g, '');
}

function pathOf(doc, el) {
  const comp = el.closest('sve-comp');

  if (comp) {
    return comp.getAttribute('data-path');
  }

  const parts = [];

  while (el && el !== doc.body) {
    const parent = el.parentElement;
    const kids = [...parent.children].filter((kid) => kid.tagName !== 'SVE-COMP');

    parts.unshift(`${kids.indexOf(el)}:${el.tagName.toLowerCase()}`);
    el = parent;
  }

  return parts.join('/');
}

function elementAt(doc, path) {
  if (!path) {
    return null;
  }

  const comp = doc.querySelector(`sve-comp[data-path="${CSS.escape(path)}"]`);

  if (comp) {
    return comp;
  }

  let el = doc.body;

  for (const part of path.split('/')) {
    const [index] = part.split(':');
    const kids = [...(el?.children || [])].filter((kid) => kid.tagName !== 'SVE-COMP');

    el = kids[Number(index)];

    if (!el) {
      return null;
    }
  }

  return el;
}

const AID = `
  html { scrollbar-width: thin; }
  body { margin: 0; }
  img:not([src]), img[src=""] { min-height: 10rem; background: linear-gradient(135deg, #13204f, #3b4f9e 60%, #8d9de0); }
  video:not([src]), video[src=""] { min-height: 10rem; background: #222; }
  sve-comp { display: block; padding: 1rem; border: 1px dashed #5eead4; color: #0f766e; font: 600 .8rem ui-monospace, monospace; }
  [data-sve-build-empty] { min-height: 3.25rem; outline: 1px dashed rgba(56, 88, 233, .6); outline-offset: -1px; }
  [data-sve-sel] { outline: 2px solid #3858e9 !important; outline-offset: 2px; }
  [data-sve-plus] { outline: 2px dashed #3858e9 !important; outline-offset: 2px; }
  * { cursor: default; }
`;

/**
 * The file's classes compiled the way Instant compiles them: the editor's own
 * compiler on the site's theme, one unlayered sheet last in <head>.
 */
let tw = null;

makeTailwindCompiler({
  compile,
  sources: { theme: themeSource, utilities: utilitiesSource },
  site: props.tailwind,
  modules: { '@tailwindcss/typography': typography, '@tailwindcss/forms': forms },
}).then((state) => {
  tw = state;
  paint();
});

function paint() {
  const doc = frame.value?.contentDocument;

  if (!doc?.body) {
    return;
  }

  if (tw) {
    let sheet = doc.getElementById('sve-tw-harness');

    if (!sheet) {
      sheet = doc.createElement('style');
      sheet.id = 'sve-tw-harness';
    }

    sheet.textContent = buildTailwind(tw, html.value);
    doc.head.appendChild(sheet);
  }

  doc.body.innerHTML = previewHtml(html.value);
  doc.body.querySelectorAll('div, section, article, aside, nav, header, footer, figure, li, main').forEach((el) => {
    if (!el.children.length && !el.textContent.trim()) {
      el.setAttribute('data-sve-build-empty', '');
    }
  });
  elementAt(doc, selected.value)?.setAttribute('data-sve-sel', '');
  elementAt(doc, plus.value)?.setAttribute('data-sve-plus', '');
}

onMounted(() => {
  const doc = frame.value.contentDocument;

  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8">${props.siteHead}<style>${AID}</style></head><body></body></html>`);
  doc.close();
  doc.addEventListener('click', (event) => {
    event.preventDefault();

    const path = event.target === doc.body ? '' : pathOf(doc, event.target);

    port.select(path);
  });
  paint();
});

watch([html, selected, plus], () => nextTick(paint));

const width = computed(() => {
  const size = (port.rev.value, port.size());

  return size === 'mobile' ? '390px' : size === 'tablet' ? '820px' : '100%';
});

/* ---------------- the file, as the dock shows it ---------------- */

const code = computed(() => {
  const node = selected.value ? findByPath(parseTemplateTree(html.value), selected.value) : null;
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

  if (!node) {
    return esc(html.value);
  }

  return `${esc(html.value.slice(0, node.from))}<mark>${esc(html.value.slice(node.from, node.to))}</mark>${esc(html.value.slice(node.to))}`;
});

const treeIcon = (row) => HTML_ICONS[row.kind === 'component' ? 'component' : row.kind === 'antlers' ? (row.antlers === 'loop' ? 'loop' : 'if') : row.tag] || HTML_ICONS.div;

/* ---------------- the stand-in for the dock's scale menu ---------------- */

const menuStyle = computed(() => {
  const r = props.menu.rect;

  return r ? { top: `${Math.min(r.bottom + 4, innerHeight - 260)}px`, left: `${Math.min(r.left, innerWidth - 230)}px` } : {};
});
</script>

<template>
  <div class="hx" :data-theme="ui.theme">
    <header class="hx-top">
      <b>Build mode · harness</b>
      <span>The left panel is the real Build panel. Preview, tree and code stand in for the editor around it.</span>
      <span class="hx-sw">
        <button type="button" :aria-pressed="ui.lang === 'en'" @click="ui.setLang('en')">EN</button>
        <button type="button" :aria-pressed="ui.lang === 'da'" @click="ui.setLang('da')">DA</button>
      </span>
      <span class="hx-sw">
        <button type="button" :aria-pressed="ui.theme === 'dark'" @click="ui.theme = 'dark'">Dark</button>
        <button type="button" :aria-pressed="ui.theme === 'light'" @click="ui.theme = 'light'">Light</button>
      </span>
    </header>

    <aside class="hx-left" data-harness-left>
      <BuildPanel :port="port" />
    </aside>

    <main class="hx-center">
      <iframe ref="frame" class="hx-frame" title="Preview" :style="{ width }"></iframe>
    </main>

    <aside class="hx-right">
      <div class="hx-h">HTML tree</div>
      <div class="hx-tree">
        <div
          v-for="row in rows"
          :key="row.id"
          class="hx-row"
          :class="{ 'is-sel': row.path === selected, 'is-plus': row.path === plus }"
          :style="{ paddingLeft: `${0.5 + row.depth * 0.85}rem` }"
          @click="port.select(row.path)"
        >
          <i v-html="treeIcon(row)"></i>
          <span class="hx-chip">{{ row.kind === 'component' ? 'component' : row.kind === 'antlers' ? row.antlers : row.tag }}</span>
          <span class="hx-nm">{{ row.label || row.klass }}</span>
          <button v-if="holdsElements(row)" type="button" class="hx-plus" title="Add here" @click.stop="port.setPlus(row.path)">+</button>
        </div>
      </div>
      <div class="hx-h">File (the dock's HTML)</div>
      <pre class="hx-code" v-html="code"></pre>
    </aside>

    <div v-if="menu.names" class="hx-menu-veil" @click="menu.names = null"></div>
    <div v-if="menu.names" class="hx-menu" :style="menuStyle">
      <div class="hx-menu__h">{{ menu.title }}</div>
      <button
        v-for="name in menu.names"
        :key="name"
        type="button"
        :data-active="name === menu.active ? '' : null"
        @click="menu.pick(name); menu.names = null"
      >{{ name }}</button>
      <p v-if="!menu.names.length">Nothing on this site's scale.</p>
    </div>
  </div>
</template>

<style>
body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; }
.hx { --bg: #121317; --panel: #1b1c22; --ink: #e7e8ef; --line: #2b2d38; height: 100vh; display: grid; grid-template: auto minmax(0, 1fr) / 22rem minmax(0, 1fr) 20rem; background: var(--bg); color: var(--ink); }
.hx[data-theme='light'] { --bg: #eef0f5; --panel: #ffffff; --ink: #1d1f2b; --line: #dcdfe9; }
.hx-top { grid-column: 1 / -1; display: flex; align-items: center; gap: 1rem; padding: .55rem 1rem; border-bottom: 1px solid var(--line); background: var(--panel); font-size: .8125rem; }
.hx-top span:first-of-type { flex: 1; opacity: .6; }
.hx-sw { display: flex; gap: .2rem; }
.hx-sw button { all: unset; padding: .25rem .55rem; border-radius: .3rem; background: rgba(128,128,128,.16); font-size: .75rem; cursor: pointer; }
.hx-sw button[aria-pressed='true'] { background: #3858e9; color: #fff; }
.hx-left { min-height: 0; background: var(--panel); border-right: 1px solid var(--line); }
.hx-center { min-height: 0; display: flex; justify-content: center; overflow: auto; background: #25262d; }
.hx-frame { height: 100%; border: 0; background: #fff; transition: width .2s; }
.hx-right { min-height: 0; display: flex; flex-direction: column; background: var(--panel); border-left: 1px solid var(--line); font-size: .75rem; }
.hx-h { padding: .55rem .75rem; font-size: .6875rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; opacity: .6; border-bottom: 1px solid var(--line); }
.hx-tree { flex: 1 1 50%; overflow: auto; padding: .3rem 0; }
.hx-row { display: flex; align-items: center; gap: .4rem; padding: .25rem .5rem; cursor: pointer; white-space: nowrap; }
.hx-row:hover { background: rgba(128,128,128,.12); }
.hx-row.is-sel { background: rgba(56,88,233,.22); }
.hx-row.is-plus { box-shadow: inset 2px 0 0 #3858e9; }
.hx-row i { display: inline-flex; opacity: .7; }
.hx-chip { padding: 0 .35rem; border-radius: .2rem; background: rgba(96,165,250,.16); color: #60a5fa; font: 600 .6875rem ui-monospace, monospace; }
.hx-nm { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; opacity: .75; font-family: ui-monospace, monospace; }
.hx-plus { all: unset; width: 1.2rem; height: 1.2rem; display: grid; place-items: center; border-radius: .25rem; color: #8ea2ff; font-weight: 700; cursor: pointer; }
.hx-plus:hover { background: rgba(56,88,233,.3); }
.hx-code { flex: 1 1 50%; overflow: auto; margin: 0; padding: .6rem .75rem; font: .6875rem/1.55 ui-monospace, monospace; white-space: pre; }
.hx-code mark { background: rgba(56,88,233,.28); color: inherit; }
.hx-menu-veil { position: fixed; inset: 0; }
.hx-menu { position: fixed; z-index: 10; width: 13rem; max-height: 16rem; overflow: auto; padding: .3rem; border-radius: .5rem; background: var(--panel); border: 1px solid var(--line); box-shadow: 0 12px 32px rgba(0,0,0,.35); }
.hx-menu__h { padding: .3rem .4rem; font-size: .6875rem; opacity: .6; font-family: ui-monospace, monospace; }
.hx-menu button { all: unset; display: block; width: 100%; box-sizing: border-box; padding: .3rem .45rem; border-radius: .3rem; font: .75rem ui-monospace, monospace; cursor: pointer; }
.hx-menu button:hover { background: rgba(128,128,128,.18); }
.hx-menu button[data-active] { background: #3858e9; color: #fff; }
.hx-menu p { margin: .4rem; font-size: .75rem; opacity: .6; }
</style>
