<script setup>
/**
 * Build's Add tab, as the approved sketch draws it: where the next element
 * lands, Elements | Components, a search, the tiles in groups, and the
 * Columns picker.
 *
 * The tiles are the dock's own (catalog.js `addGroups` over HTML_TOOLS,
 * HTML_DIVS and HTML_HEADINGS), wearing the toolbar's icons, and each writes
 * what the toolbar writes for it (markup.js). Where it lands is place.js: into
 * the picked element when it holds others, else after it. The file is
 * written through the port — `dock:set-html` in the editor, the door the
 * Tailwind pane writes a class through — and the new element is picked.
 *
 * Loop and If are handed to the port, which runs the dock's own ∞ and if
 * path and opens the inspector those buttons open. Components are the files
 * in partials/components as the dock's component menu lists them
 * (`/!/sve/components`); a tile writes the call that menu writes.
 */
import { computed, inject, ref, watch } from 'vue';
import { STRUCTURES, addGroups } from '../../build-mode/catalog.js';
import { markupFor } from '../../build-mode/markup.js';
import { addAt } from '../../build-mode/place.js';
import { ic, tileIcon } from '../../build-mode/icons.js';

const props = defineProps({
  here: { type: Object, required: true },
  nameOf: { type: Function, required: true },
});

const port = inject('sveBuild');
const sub = ref('el');
const query = ref('');
const picker = ref(false);
const components = ref(null);

const groups = computed(() => addGroups({ htmlTools: port.lists.htmlTools, divs: port.lists.divs, headings: port.lists.headings }));
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function label(entry) {
  if (entry.lang) {
    return port.t(entry.lang);
  }

  if (entry.title) {
    return entry.title;
  }

  const key = `el_${entry.id}`;
  const word = port.t(key);

  return word === key ? entry.id : word;
}

const shown = computed(() => {
  const q = query.value.trim().toLowerCase();

  return groups.value
    .map((group) => ({ ...group, items: group.items.filter((item) => !q || label(item).toLowerCase().includes(q) || item.id.includes(q)) }))
    .filter((group) => group.items.length);
});

watch(sub, (value) => {
  if (value === 'comp' && !components.value) {
    port.components().then((items) => (components.value = items || []), () => (components.value = []));
  }
});

const shownComponents = computed(() => {
  const q = query.value.trim().toLowerCase();

  return (components.value || []).filter((item) => !q || item.name.toLowerCase().includes(q));
});

const humanize = (name) => String(name || '').replace(/[_-]+/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

/** Where the next tile lands, in words — the name in bold, as the sketch has it. */
const target = computed(() => {
  const place = props.here.place;

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

function write(markup) {
  const out = addAt(port.html(), port.plusPath() || port.selectedPath(), markup);

  if (out) {
    port.write(out.html, { select: out.path });
  }
}

function add(entry, structure) {
  if (entry.source === 'columns' && !structure) {
    picker.value = true;

    return;
  }

  picker.value = false;

  if (entry.logic) {
    port.logic(entry.logic, entry.def);

    return;
  }

  write(
    markupFor(entry, {
      sectionTag: port.sectionTag(),
      mobile: port.mobileVariant(),
      structure,
      text: {
        heading: port.t('new_heading'),
        text: port.t('new_text'),
        button: port.t('new_button'),
        link: port.t('new_link'),
        item: port.t('new_item'),
      },
    })
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
    <div class="bm-pk-grid">
      <button
        v-for="structure in STRUCTURES"
        :key="structure.key"
        type="button"
        class="bm-pk"
        :data-sve-build-structure="structure.key"
        @click="add(columnsEntry, structure.key)"
      >
        <span class="bm-bars"><i v-for="(part, n) in structure.parts" :key="n" :style="{ flex: part }"></i></span>
        <span class="bm-pk-l">{{ structure.label }} <i v-if="structure.later" class="bm-soon">{{ port.t('later') }}</i></span>
      </button>
    </div>
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

    <div class="bm-seg bm-sub">
      <button type="button" data-sve-build-sub="el" :aria-pressed="sub === 'el'" @click="sub = 'el'">{{ port.t('elements') }}</button>
      <button type="button" data-sve-build-sub="comp" :aria-pressed="sub === 'comp'" @click="sub = 'comp'">{{ port.t('components') }}</button>
    </div>

    <label class="bm-search">
      <span v-html="ic('search')"></span>
      <input
        v-model="query"
        type="text"
        autocomplete="off"
        :placeholder="port.t(sub === 'el' ? 'search_elements' : 'search_components')"
        :aria-label="port.t(sub === 'el' ? 'search_elements' : 'search_components')"
      />
    </label>

    <template v-if="sub === 'el'">
      <div v-for="group in shown" :key="group.id" class="bm-g">
        <h4>{{ port.t(`group_${group.id}`) }}</h4>
        <div class="bm-tiles">
          <button
            v-for="entry in group.items"
            :key="entry.id"
            type="button"
            class="bm-tile"
            :class="{ 'is-mono': group.mono, [`is-${entry.logic}`]: !!entry.logic }"
            :disabled="target.locked"
            :title="port.t('add_title')"
            :data-sve-build-tile="entry.id"
            @click="add(entry)"
          >
            <span v-html="tileIcon(entry, port.lists.htmlIcons, port.lists.toolIcons)"></span>
            <span>{{ label(entry) }}</span>
          </button>
        </div>
      </div>
      <p v-if="!shown.length" class="bm-muted">{{ port.t('none_found', { q: query }) }}</p>
      <p class="bm-note">{{ port.t('logic_note') }}</p>
    </template>

    <template v-else>
      <p v-if="components === null" class="bm-muted">{{ port.t('components_loading') }}</p>
      <div v-else class="bm-comps">
        <button
          v-for="item in shownComponents"
          :key="item.name"
          type="button"
          class="bm-comp"
          :disabled="target.locked"
          :data-sve-build-component="item.name"
          @click="write(item.tag)"
        >
          <span v-html="port.lists.htmlIcons.component || ic('cube')"></span>
          <span>{{ humanize(item.name) }}</span>
          <code>{{ item.name }}</code>
        </button>
        <p v-if="!shownComponents.length" class="bm-muted">
          {{ query ? port.t('none_found', { q: query }) : port.t('components_none') }}
        </p>
      </div>
      <p class="bm-note" v-html="port.t('components_note', { path: '<code>resources/views/partials/components/</code>' })"></p>
    </template>

    <p class="bm-note" v-html="port.t('add_note', { later: `<i class='bm-soon'>${esc(port.t('later'))}</i>` })"></p>
  </template>
</template>
