<script setup>
/**
 * Build's Add tab: the HTML toolbar's elements as tiles, and the site's
 * components.
 *
 * The tiles are the dock's own (catalog.js `addGroups` over HTML_TOOLS,
 * HTML_DIVS and HTML_HEADINGS), wearing the toolbar's icons, and each writes
 * what the toolbar writes for it (markup.js). Where it lands is place.js: into
 * the picked element when it holds others, else after it. The file is
 * written through the port — `dock:set-html` in the editor, the one door
 * the Tailwind pane writes a class through — and the new element is picked.
 *
 * Loop and If are not written from here: the port hands them to the dock's
 * own ∞ and if path, which opens the inspector those buttons open.
 * Components are the files in partials/components, as the dock's component
 * menu lists them (`/!/sve/components`); a tile writes the call that menu
 * writes.
 */
import { computed, inject, ref, watch } from 'vue';
import { STRUCTURES, addGroups } from '../../build-mode/catalog.js';
import { markupFor } from '../../build-mode/markup.js';
import { addAt } from '../../build-mode/place.js';
import { BUILD_ICONS, tileIcon } from '../../build-mode/icons.js';

const props = defineProps({
  here: { type: Object, required: true },
  nameOf: { type: Function, required: true },
});

const port = inject('sveBuild');
const sub = ref('elements');
const query = ref('');
const picker = ref(false);
const components = ref(null);

const groups = computed(() => addGroups({ htmlTools: port.lists.htmlTools, divs: port.lists.divs, headings: port.lists.headings }));

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
  if (value === 'components' && !components.value) {
    port.components().then((items) => (components.value = items || []), () => (components.value = []));
  }
});

const shownComponents = computed(() => {
  const q = query.value.trim().toLowerCase();

  return (components.value || []).filter((item) => !q || item.name.toLowerCase().includes(q));
});

const humanize = (name) => String(name || '').replace(/[_-]+/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

/** Where the next tile lands, in words. */
const target = computed(() => {
  const place = props.here.place;

  if (!place) {
    return { locked: true, text: port.t('insert_locked') };
  }

  if (place.mode === 'into') {
    return { text: port.t('insert_into', { name: props.nameOf(place.parent) }) };
  }

  if (place.mode === 'after') {
    return { text: port.t('insert_after', { name: props.nameOf(place.after) }) };
  }

  return { text: port.t('insert_end') };
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
  <div class="sve-build-add">
    <div class="sve-build-target" :class="{ 'is-locked': target.locked }">
      <i v-html="target.locked ? BUILD_ICONS.lock : BUILD_ICONS.arrowDown"></i>
      <span>{{ target.text }}</span>
      <button
        v-if="port.plusPath()"
        type="button"
        class="sve-build-icon"
        :title="port.t('insert_reset')"
        :aria-label="port.t('insert_reset')"
        @click="port.setPlus('')"
        v-html="BUILD_ICONS.close"
      ></button>
    </div>

    <div v-if="picker" class="sve-build-picker">
      <h3>
        <span>{{ port.t('columns_title') }}</span>
        <button type="button" class="sve-build-icon" :title="port.t('close')" :aria-label="port.t('close')" @click="picker = false" v-html="BUILD_ICONS.close"></button>
      </h3>
      <p class="sve-build-hint">{{ port.t('columns_note') }}</p>
      <div class="sve-build-picker__grid">
        <button
          v-for="structure in STRUCTURES"
          :key="structure.key"
          type="button"
          class="sve-build-picker__pick"
          :disabled="structure.later"
          @click="add(columnsEntry, structure.key)"
        >
          <span class="sve-build-picker__bars"><i v-for="(part, n) in structure.parts" :key="n" :style="{ flex: part }"></i></span>
          <span>{{ structure.label }} <em v-if="structure.later" class="sve-build-soon">{{ port.t('later') }}</em></span>
        </button>
      </div>
    </div>

    <template v-else>
      <div class="sve-build-seg sve-build-add__sub">
        <button type="button" :data-active="sub === 'elements' ? '' : null" @click="sub = 'elements'">{{ port.t('elements') }}</button>
        <button type="button" :data-active="sub === 'components' ? '' : null" @click="sub = 'components'">{{ port.t('components') }}</button>
      </div>

      <label class="sve-build-search">
        <i v-html="BUILD_ICONS.search"></i>
        <input
          v-model="query"
          type="text"
          autocomplete="off"
          :placeholder="port.t(sub === 'elements' ? 'search_elements' : 'search_components')"
          :aria-label="port.t(sub === 'elements' ? 'search_elements' : 'search_components')"
        />
      </label>

      <template v-if="sub === 'elements'">
        <section v-for="group in shown" :key="group.id" class="sve-build-add__group">
          <h4>{{ port.t(`group_${group.id}`) }}</h4>
          <div class="sve-build-tiles">
            <button
              v-for="entry in group.items"
              :key="entry.id"
              type="button"
              class="sve-build-tile"
              :class="{ 'is-mono': group.mono, [`is-${entry.logic}`]: !!entry.logic }"
              :disabled="target.locked"
              :data-sve-build-tile="entry.id"
              @click="add(entry)"
            >
              <i v-html="tileIcon(entry, port.lists.htmlIcons, port.lists.toolIcons)"></i>
              <span>{{ label(entry) }}</span>
            </button>
          </div>
        </section>
        <p v-if="!shown.length" class="sve-build-hint">{{ port.t('none_found', { q: query }) }}</p>
        <p class="sve-build-note">{{ port.t('logic_note') }}</p>
      </template>

      <template v-else>
        <p v-if="components === null" class="sve-build-hint">{{ port.t('components_loading') }}</p>
        <div v-else class="sve-build-comps">
          <button
            v-for="item in shownComponents"
            :key="item.name"
            type="button"
            class="sve-build-comp"
            :disabled="target.locked"
            :data-sve-build-component="item.name"
            @click="write(item.tag)"
          >
            <i v-html="port.lists.htmlIcons.component"></i>
            <span>{{ humanize(item.name) }}</span>
            <code>{{ item.name }}</code>
          </button>
          <p v-if="!shownComponents.length" class="sve-build-hint">
            {{ query ? port.t('none_found', { q: query }) : port.t('components_none') }}
          </p>
        </div>
        <p class="sve-build-note">{{ port.t('components_note', { path: 'resources/views/partials/components/' }) }}</p>
      </template>

      <p class="sve-build-note">{{ port.t('add_note') }}</p>
    </template>
  </div>
</template>

<style scoped>
.sve-build-target {
  display: flex;
  align-items: center;
  gap: 0.45em;
  padding: 0.45em 0.55em;
  border-radius: 0.45rem;
  background: var(--sve-build-accent-soft);
  font-size: 0.75rem;
}
.sve-build-target > i {
  display: inline-flex;
  color: var(--sve-build-accent-text);
}
.sve-build-target span {
  flex: 1;
  min-width: 0;
}
.sve-build-target.is-locked {
  background: rgba(128, 128, 128, 0.14);
  opacity: 0.8;
}
.sve-build-add__sub {
  margin: 0.65em 0;
}
.sve-build-add__sub button {
  padding: 0.45em;
  font-size: 0.75rem;
}
.sve-build-search {
  display: flex;
  align-items: center;
  gap: 0.45em;
  height: 2.1rem;
  padding: 0 0.55em;
  border-radius: 0.45rem;
  border: 1px solid rgba(128, 128, 128, 0.35);
  background: rgba(128, 128, 128, 0.1);
}
.sve-build-search i {
  display: inline-flex;
  opacity: 0.6;
}
.sve-build-search input {
  all: unset;
  flex: 1;
  min-width: 0;
  font-size: 0.75rem;
}
.sve-build-add__group h4 {
  margin: 1em 0 0.5em;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.6;
}
.sve-build-tiles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.375em;
}
.sve-build-tile {
  all: unset;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4em;
  padding: 0.75em 0.2em 0.55em;
  border-radius: 0.5rem;
  border: 1px solid rgba(128, 128, 128, 0.28);
  background: rgba(128, 128, 128, 0.12);
  font-size: 0.6875rem;
  text-align: center;
  cursor: pointer;
}
.sve-build-tile i {
  display: inline-flex;
  opacity: 0.8;
}
.sve-build-tile :deep(svg) {
  width: 1.25rem;
  height: 1.25rem;
}
.sve-build-tile:hover:not(:disabled) {
  border-color: var(--sve-build-accent);
  background: rgba(128, 128, 128, 0.2);
}
.sve-build-tile:hover:not(:disabled) i {
  opacity: 1;
}
.sve-build-tile:focus-visible {
  outline: 2px solid var(--sve-build-accent);
}
.sve-build-tile:disabled {
  cursor: default;
  opacity: 0.4;
}
.sve-build-tile.is-mono span {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
/* Loop and If wear their family's colour, as in the tree and the dock. */
.sve-build-tile.is-loop i {
  color: var(--sve-fam-loop, #a5b4fc);
}
.sve-build-tile.is-if i {
  color: var(--sve-fam-if, #e8c468);
}
.sve-build-comps {
  display: grid;
  gap: 0.375em;
  margin-top: 0.75em;
}
.sve-build-comp {
  all: unset;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.6em;
  padding: 0.55em 0.65em;
  border-radius: 0.5rem;
  border: 1px solid rgba(128, 128, 128, 0.28);
  background: rgba(128, 128, 128, 0.12);
  font-size: 0.75rem;
  cursor: pointer;
}
.sve-build-comp i {
  display: inline-flex;
  color: var(--sve-fam-component, #5eead4);
}
.sve-build-comp code {
  font-size: 0.625rem;
  opacity: 0.5;
}
.sve-build-comp:hover:not(:disabled) {
  border-color: var(--sve-fam-component, #5eead4);
}
.sve-build-picker h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  font-size: 0.875rem;
}
.sve-build-picker__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5em;
  margin-top: 0.6em;
}
.sve-build-picker__pick {
  all: unset;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.45em;
  padding: 0.6em;
  border-radius: 0.5rem;
  border: 1px solid rgba(128, 128, 128, 0.28);
  background: rgba(128, 128, 128, 0.12);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}
.sve-build-picker__pick:hover:not(:disabled) {
  border-color: var(--sve-build-accent);
}
.sve-build-picker__pick:disabled {
  cursor: default;
  opacity: 0.55;
}
.sve-build-picker__bars {
  display: flex;
  gap: 0.2em;
  height: 1.5rem;
}
.sve-build-picker__bars i {
  border-radius: 0.2rem;
  background: rgba(128, 128, 128, 0.35);
}
.sve-build-picker__pick:hover:not(:disabled) .sve-build-picker__bars i {
  background: var(--sve-build-accent);
}
</style>
