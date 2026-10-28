<script setup>
/**
 * The harness page: the real Build panel beside a preview of the file, and
 * nothing else. It is a test page, not the editor — in Live Preview the
 * panel sits in the left column, and the top bar, the HTML tree and the dock
 * are the editor's own, unchanged.
 *
 * The preview renders the file with Antlers taken out and the site's own
 * <head> CSS, and compiles the file's classes with the editor's own Tailwind
 * compiler (tw-compile-core.js), as Instant does. A click picks an element;
 * a click on an empty box is "+ Add element" there, as in the sketch.
 *
 * The one menu drawn here stands in for the Tailwind pane's (its scale menu
 * and its State | Prose menu), which live in the editor.
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import BuildPanel from '../../../resources/js/cp/surfaces/BuildPanel.vue';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';
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
});

const port = props.port;
const frame = ref(null);
const html = computed(() => (port.rev.value, port.html()));
const selected = computed(() => (port.rev.value, port.selectedPath()));
const plus = computed(() => (port.rev.value, port.plusPath()));

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
    const kids = [...(el?.children || [])].filter((kid) => kid.tagName !== 'SVE-COMP');

    el = kids[Number(part.split(':')[0])];

    if (!el) {
      return null;
    }
  }

  return el;
}

const AID = `
  body { margin: 0; }
  img:not([src]), img[src=""] { min-height: 10rem; background: linear-gradient(135deg, #13204f, #3b4f9e 60%, #8d9de0); }
  video:not([src]), video[src=""] { min-height: 10rem; background: #222; }
  sve-comp { display: block; padding: 1rem; border: 1px dashed #52d9b1; color: #0f766e; font: 600 .8rem ui-monospace, monospace; }
  [data-sve-build-empty] { position: relative; min-height: 3.5rem; outline: 1px dashed rgba(56, 88, 233, .55); outline-offset: -1px; cursor: pointer; }
  [data-sve-build-empty]::after { content: '+  Add element'; position: absolute; inset: 0; display: grid; place-items: center; color: #3858e9; font: 600 .8125rem ui-sans-serif, system-ui, sans-serif; }
  [data-sve-sel] { outline: 2px solid #3858e9 !important; outline-offset: 2px; }
  [data-sve-plus] { outline: 2px solid #3858e9 !important; outline-offset: -2px; background: rgba(56, 88, 233, .06); }
  * { cursor: default; }
`;

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

    const el = event.target;
    // Below the page's content a click lands on <html>: that picks nothing.
    const path = el === doc.body || !doc.body.contains(el) ? '' : pathOf(doc, el);

    if (el.hasAttribute?.('data-sve-build-empty')) {
      port.setPlus(path);
    } else {
      port.select(path);
    }
  });
  paint();
});

watch([html, selected, plus], () => nextTick(paint));

const width = computed(() => {
  const size = (port.rev.value, port.size());

  return size === 'mobile' ? '390px' : size === 'tablet' ? '820px' : '100%';
});

/* ---------------- the stand-in for the Tailwind pane's menus ---------------- */

const menuTab = ref(0);
const menuQuery = ref('');

watch([() => props.menu.open, () => props.menu.anchor], () => {
  menuTab.value = 0;
  menuQuery.value = '';
});

const menuStyle = computed(() => {
  const r = props.menu.anchor?.getBoundingClientRect?.();

  return r ? { top: `${Math.min(r.bottom + 4, innerHeight - 320)}px`, left: `${Math.min(r.left, innerWidth - 260)}px` } : {};
});
const menuNames = computed(() => {
  const list = props.menu.tabs ? props.menu.tabs[menuTab.value].names : props.menu.names || [];
  const q = menuQuery.value.trim().toLowerCase();

  return list.filter((name) => name && (!q || name.includes(q)));
});

function pick(name) {
  props.menu.pick?.(name);
  props.menu.open = false;
}

/** Enter in the search — TwClassMenu's rule: what was typed, when it reads as a class, else the one row left. */
function submit() {
  const typed = props.menu.free && menuQuery.value.trim() ? props.menu.free(menuQuery.value.trim()) : '';

  if (typed) {
    pick(typed);
  } else if (menuNames.value.length === 1) {
    pick(menuNames.value[0]);
  }
}

function remove() {
  props.menu.remove?.();
  props.menu.open = false;
}
</script>

<template>
  <div class="hx">
    <aside class="hx-left">
      <BuildPanel :port="port" />
    </aside>
    <main class="hx-center">
      <iframe ref="frame" class="hx-frame" title="Preview" :style="{ width }"></iframe>
    </main>

    <div v-if="menu.open" class="hx-veil" @click="menu.open = false"></div>
    <div v-if="menu.open" class="hx-menu" :style="menuStyle" data-harness-menu>
      <input v-model="menuQuery" class="hx-menu__q" type="text" placeholder="Search… e.g. hover, prose-p" @keydown.enter.prevent="submit" />
      <div v-if="menu.tabs" class="hx-menu__tabs">
        <button v-for="(tab, i) in menu.tabs" :key="tab.id" type="button" :data-on="menuTab === i ? '' : null" @click="menuTab = i">{{ tab.label }}</button>
      </div>
      <div class="hx-menu__list">
        <button v-if="menu.tabs && menuTab === 0" type="button" :data-on="!menu.active ? '' : null" @click="pick('')">{{ menu.none }}</button>
        <button v-for="name in menuNames" :key="name" type="button" :data-on="name === menu.active ? '' : null" :data-harness-pick="name" @click="pick(name)">{{ name }}</button>
        <button v-if="menu.remove" type="button" data-harness-remove @click="remove">Remove</button>
      </div>
    </div>
  </div>
</template>

<style>
body { margin: 0; background: #1e1e21; }
.hx { height: 100vh; display: grid; grid-template-columns: 20rem minmax(0, 1fr); }
.hx-left { min-height: 0; border-right: 1px solid rgba(255,255,255,.08); }
.hx-center { min-height: 0; display: flex; justify-content: center; overflow: auto; background: #252526; }
.hx-frame { height: 100%; border: 0; background: #fff; transition: width .2s; }
.hx-veil { position: fixed; inset: 0; }
.hx-menu { position: fixed; z-index: 10; width: 15rem; max-height: 20rem; display: flex; flex-direction: column; gap: .4rem; padding: .5rem; border-radius: .6rem; background: #252526; border: 1px solid rgba(255,255,255,.12); box-shadow: 0 16px 40px rgba(0,0,0,.45); color: #d4d4d4; font: .75rem ui-monospace, monospace; }
.hx-menu__q { all: unset; padding: .4rem .5rem; border-radius: .4rem; border: 1px solid #3858e9; }
.hx-menu__tabs { display: flex; gap: .125rem; padding: .125rem; border-radius: .4rem; background: #1e1e21; }
.hx-menu__tabs button { all: unset; flex: 1; text-align: center; padding: .3rem; border-radius: .3rem; color: rgba(212,212,212,.7); cursor: pointer; font-family: ui-sans-serif, system-ui, sans-serif; }
.hx-menu__tabs button[data-on] { background: #39393c; color: #d4d4d4; }
.hx-menu__list { overflow: auto; display: grid; }
.hx-menu__list button { all: unset; padding: .35rem .45rem; border-radius: .3rem; cursor: pointer; }
.hx-menu__list button:hover, .hx-menu__list button[data-on] { background: rgba(128,128,128,.28); }
</style>
