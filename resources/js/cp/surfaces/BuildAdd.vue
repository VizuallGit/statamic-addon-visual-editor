<script setup>
/**
 * Build's Add side, as the approved sketch draws it: where the next element
 * lands, a search beside the grid / list view, the tiles in groups, and the
 * Grid picker (BuildGridPicker.vue). All | Elements | Components are the
 * panel's tabs above it (`sub`).
 *
 * The tiles are the dock's own (catalog.js `addGroups` over HTML_TOOLS,
 * HTML_DIVS and HTML_HEADINGS), wearing the toolbar's icons, and each writes
 * what the toolbar writes for it (build-mode/add.js). Where it lands is
 * place.js: into the picked element when it holds others, else after it. The
 * file is written through the port — `dock:set-html` in the editor, the door
 * the Tailwind pane writes a class through — and the new element is picked.
 *
 * A tile pressed and moved is dragged onto Build's canvas instead and lands
 * where it is let go (`port.drag`, canvas-ui.js); a press that does not move
 * stays a click.
 *
 * On a page built from sections, Section is always a section of its own, and
 * a layout or an HTML tag is one where it has no parent: the HTML tree's
 * "Static HTML / With fields" popup, then a row on the page
 * (build-mode/new-section.js, through the port).
 *
 * Loop and If are handed to the port, which writes them and opens their
 * settings in a popup — clicked, not dragged. SVG opens the site's SVGs in a
 * popup of the same kind (BuildSvgPopup.vue) and writes Statamic's
 * `{{ svg }}` for the one picked (build-mode/svg.js). Components are the files in
 * partials/components as the dock's component menu lists them
 * (`/!/sve/components`); a tile writes the call that menu writes.
 *
 * All is the elements, then the components. Both wear the same tile, and the
 * view — a grid of tiles or a list of rows — is both's, kept in this browser.
 */
import { computed, inject, ref, watch } from 'vue';
import BuildGridPicker from './BuildGridPicker.vue';
import BuildSvgPopup from './BuildSvgPopup.vue';
import { addGroups } from '../../build-mode/catalog.js';
import { tileLabel, tileMarkup, writeAt } from '../../build-mode/add.js';
import { svgMarkup } from '../../build-mode/svg.js';
import { ic, tileIcon } from '../../build-mode/icons.js';

const props = defineProps({
  here: { type: Object, required: true },
  nameOf: { type: Function, required: true },
  /** All | Elements | Components — the tabs at the top of the panel (BuildPanel.vue). */
  sub: { type: String, default: 'all' },
});

const VIEW_KEY = 'sve-build-add-view';
const SEARCH = { all: 'search_all', el: 'search_elements', comp: 'search_components' };

const port = inject('sveBuild');
const sub = computed(() => props.sub);
const view = ref(window.localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid');
const query = ref('');
const picker = ref(false);
/** The SVG tile's popup, open: the tile's box and the panel's, to stand beside. */
const svgAt = ref(null);
const components = ref(null);

function setView(value) {
  view.value = value;
  window.localStorage.setItem(VIEW_KEY, value);
}

const groups = computed(() => addGroups({ htmlTools: port.lists.htmlTools, divs: port.lists.divs, headings: port.lists.headings }));
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const label = (entry) => tileLabel(port, entry);
const q = computed(() => query.value.trim().toLowerCase());
const withElements = computed(() => sub.value !== 'comp');
const withComponents = computed(() => sub.value !== 'el');

const shown = computed(() =>
  groups.value
    .map((group) => ({ ...group, items: group.items.filter((item) => !q.value || label(item).toLowerCase().includes(q.value) || item.id.includes(q.value)) }))
    .filter((group) => group.items.length)
);

watch(
  withComponents,
  (wanted) => {
    if (wanted && !components.value) {
      port.components().then((items) => (components.value = items || []), () => (components.value = []));
    }
  },
  { immediate: true }
);

/** The categories in use, and the one chosen: '' is all. A search reads the name, the category and the description. */
const category = ref('');
const categories = computed(() => [...new Set((components.value || []).map((item) => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)));
const shownComponents = computed(() =>
  (components.value || []).filter(
    (item) =>
      (!category.value || item.category === category.value) &&
      (!q.value || [item.name, item.category, item.description].some((text) => String(text || '').toLowerCase().includes(q.value)))
  )
);

/** A search hides a part with nothing to show; without one, Components says it is loading or empty. */
const componentsPart = computed(() => withComponents.value && (!q.value || components.value === null || shownComponents.value.length > 0));
const nothing = computed(() => !!q.value && !(withElements.value && shown.value.length) && !componentsPart.value);

const humanize = (name) => String(name || '').replace(/[_-]+/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

/** Where the next tile lands, in words — the name in bold, as the sketch has it. */
const target = computed(() => {
  const place = props.here.place;

  // Nothing open on a page built from sections: only a section of its own lands anywhere.
  if (port.onlySections?.()) {
    return { nowhere: true, html: esc(port.t('insert_new_section')) };
  }

  if (!place) {
    return { locked: true, html: esc(port.t('insert_locked')) };
  }

  if (place.mode === 'into') {
    return { html: port.t('insert_into', { name: `<b>${esc(props.nameOf(place.parent))}</b>` }) };
  }

  if (place.mode === 'after') {
    return { html: port.t('insert_after', { name: `<b>${esc(props.nameOf(place.after))}</b>` }) };
  }

  return { html: esc(port.t('insert_end')) };
});

const write = (markup) => writeAt(port, port.plusPath() || port.selectedPath(), markup);
const markupOf = (entry, grid) => tileMarkup(port, entry, grid);

function add(entry, structure, rows) {
  if (entry.source === 'columns' && !structure) {
    picker.value = true;

    return;
  }

  picker.value = false;

  const markup = markupOf(entry, { structure, rows });

  // On a page built from sections, Section — and a layout with no parent — is a section of its own.
  if (!port.addSection?.(entry, markup)) {
    write(markup);
  }
}

/**
 * A tile clicked. Loop and If are written, then their settings open beside the
 * panel, level with the tile; SVG's pictures open there first.
 */
function press(entry, event) {
  if (entry.logic) {
    port.logic(entry.logic, entry.def, event.currentTarget);

    return;
  }

  if (entry.def?.svg) {
    const tile = event.currentTarget;

    svgAt.value = { row: tile.getBoundingClientRect(), column: (tile.closest('[data-sve-build-root]') || tile).getBoundingClientRect() };

    return;
  }

  add(entry);
}

/** A picture picked in SVG's popup: its `{{ svg }}`, where Add points. */
function addSvg(src) {
  svgAt.value = null;

  const markup = svgMarkup(src);

  if (markup) {
    write(markup);
  }
}

/** A tile with nowhere to land: beside a lock only Section, with nothing open only a section's tiles still go. */
function offFor(entry) {
  const kind = port.sectionKind?.(entry) || '';

  return target.value.nowhere ? !kind : !!target.value.locked && kind !== 'always';
}

/** Loop, If, Grid and SVG open something first, so they are clicked, not dragged. */
const draggable = (entry) => !entry.logic && entry.source !== 'columns' && !entry.def?.svg;

/**
 * A tile pressed: the canvas takes it over once the pointer moves. `markup` is
 * asked for when it lands; `entry` says whether it may be a section of its own.
 */
function grab(event, label, markup, entry = null) {
  port.drag?.(event, { label, markup, section: entry ? port.sectionKind?.(entry) || '' : '' });
}

/** A Grid structure pressed: dropped on the canvas, the picker has done its job. */
function grabStructure(event, structure, rows) {
  grab(
    event,
    structure.label,
    () => {
      picker.value = false;

      return markupOf(columnsEntry.value, { structure: structure.key, rows });
    },
    columnsEntry.value
  );
}

const columnsEntry = computed(() => groups.value.flatMap((group) => group.items).find((item) => item.source === 'columns'));
</script>

<template>
  <div v-if="picker" class="bm-picker">
    <h3>
      <span>{{ port.t('columns_title') }}</span>
      <button type="button" class="bm-ib sm" :title="port.t('close')" :aria-label="port.t('close')" @click="picker = false" v-html="ic('x')"></button>
    </h3>
    <p>{{ port.t('columns_note') }}</p>
    <BuildGridPicker :grab="grabStructure" @pick="(key, rows) => add(columnsEntry, key, rows)" />
  </div>

  <template v-else>
    <div class="bm-target" :class="{ 'is-none': target.locked }" data-sve-build-target>
      <span v-html="ic(target.locked ? 'lock' : 'arrowD')"></span>
      <span v-html="target.html"></span>
      <button
        v-if="port.plusPath()"
        type="button"
        class="bm-ib sm"
        :title="port.t('insert_reset')"
        :aria-label="port.t('insert_reset')"
        @click="port.setPlus('')"
        v-html="ic('x')"
      ></button>
    </div>

    <div class="bm-find">
      <label class="bm-search">
        <span v-html="ic('search')"></span>
        <input v-model="query" type="text" autocomplete="off" :placeholder="port.t(SEARCH[sub])" :aria-label="port.t(SEARCH[sub])" />
      </label>
      <div class="bm-seg bm-view">
        <button
          v-for="mode in ['grid', 'list']"
          :key="mode"
          type="button"
          :data-sve-build-view="mode"
          :aria-pressed="view === mode"
          :title="port.t(`view_${mode}`)"
          :aria-label="port.t(`view_${mode}`)"
          @click="setView(mode)"
          v-html="ic(mode)"
        ></button>
      </div>
    </div>

    <template v-if="withElements">
      <div v-for="group in shown" :key="group.id" class="bm-g">
        <h4>{{ port.t(`group_${group.id}`) }}</h4>
        <div class="bm-tiles" :class="{ 'is-list': view === 'list' }">
          <button
            v-for="entry in group.items"
            :key="entry.id"
            type="button"
            class="bm-tile"
            :class="{ 'is-mono': group.mono, [`is-${entry.logic}`]: !!entry.logic }"
            :disabled="offFor(entry)"
            :title="port.t('add_title')"
            :data-sve-build-tile="entry.id"
            @pointerdown="draggable(entry) && grab($event, label(entry), () => markupOf(entry), entry)"
            @click="press(entry, $event)"
          >
            <span v-html="tileIcon(entry, port.lists.htmlIcons, port.lists.toolIcons)"></span>
            <span>{{ label(entry) }}</span>
          </button>
        </div>
      </div>
    </template>

    <div v-if="componentsPart" class="bm-g">
      <h4>{{ port.t('components') }}</h4>
      <p v-if="components === null" class="bm-muted">{{ port.t('components_loading') }}</p>
      <p v-else-if="!components.length" class="bm-muted">{{ port.t('components_none') }}</p>
      <div v-if="categories.length" class="bm-cats" data-sve-build-cats>
        <button type="button" :aria-pressed="!category" @click="category = ''">{{ port.t('component_category_all') }}</button>
        <button v-for="name in categories" :key="name" type="button" :aria-pressed="category === name" @click="category = name">{{ name }}</button>
      </div>
      <div v-if="components && components.length" class="bm-tiles" :class="{ 'is-list': view === 'list' }">
        <button
          v-for="item in shownComponents"
          :key="item.name"
          type="button"
          class="bm-tile is-comp"
          :disabled="target.locked || target.nowhere"
          :title="item.description || item.name"
          :data-sve-build-component="item.name"
          @pointerdown="grab($event, humanize(item.name), () => item.tag)"
          @click="write(item.tag)"
        >
          <span v-html="port.lists.htmlIcons.component || ic('cube')"></span>
          <span>{{ humanize(item.name) }}</span>
          <code>{{ item.name }}</code>
        </button>
      </div>
    </div>

    <BuildSvgPopup v-if="svgAt" :row="svgAt.row" :column="svgAt.column" @pick="addSvg" @close="svgAt = null" />

    <p v-if="nothing" class="bm-muted">{{ port.t('none_found', { q: query }) }}</p>
    <p v-if="withElements" class="bm-note">{{ port.t('logic_note') }}</p>
    <p v-if="withComponents" class="bm-note" v-html="port.t('components_note', { path: '<code>resources/views/partials/components/</code>' })"></p>
    <p class="bm-note" v-html="port.t('add_note', { later: `<i class='bm-soon'>${esc(port.t('later'))}</i>` })"></p>
  </template>
</template>
