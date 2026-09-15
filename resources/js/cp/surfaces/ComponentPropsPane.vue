<script setup>
/**
 * The fields a component takes, one card each.
 *
 * A card says the three things worth knowing at a glance — what kind of field
 * it is, what it is called, and what it says when nobody fills it in. The
 * boxes that change those stay folded away until the card is opened, because
 * this list is read far more often than it is edited.
 *
 * Every edit writes the file. There is no draft state to lose and no Save to
 * forget, which is the same bargain the panes already make.
 */
import { ref } from 'vue';
import { componentPropsUi as ui } from '../component-props/store.js';
import PropValues from './PropValues.vue';

const ICONS = {
  bard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  media:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m3 16 4.5-4.5L13 17"/><path d="m14 14 2.5-2.5L21 16"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',
};

const rowEls = ref([]);
const dragFrom = ref(-1);
const dragOver = ref(-1);
const broken = ref({});

function onField(index, key, event) {
  ui.onEdit?.(index, key, event.target.value);
}

/**
 * A media field shows what it points at. Only when that is something a browser
 * can actually fetch — a bare word like `imagePath` is a variable name, and
 * asking for it as an image is a request for a 404.
 */
function thumb(row, index) {
  if (row.type !== 'media' || broken.value[index]) {
    return '';
  }

  const value = String(row.default || '').trim();

  return /^(https?:)?\/\//.test(value) || value.startsWith('/') ? value : '';
}

/**
 * Dragging starts on the row, not on the card.
 *
 * The card is the row *plus* the boxes that open under it, and a draggable
 * ancestor is what stops those boxes from being selected with the mouse in
 * every browser. The row has no boxes in it, so it can carry the gesture
 * itself — press and move, no handle to find — and still lend the whole card
 * its picture on the way past.
 */
function onDragStart(index, event) {
  dragFrom.value = index;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', String(index));

  const el = rowEls.value[index];

  if (el) {
    event.dataTransfer.setDragImage(el, 8, 8);
  }
}

function onDragOver(index, event) {
  if (dragFrom.value < 0) {
    return;
  }

  event.preventDefault();
  dragOver.value = index;
}

function onDrop(index) {
  const from = dragFrom.value;

  dragFrom.value = -1;
  dragOver.value = -1;

  if (from >= 0) {
    ui.onReorder?.(from, index);
  }
}

function onDragEnd() {
  dragFrom.value = -1;
  dragOver.value = -1;
}

/** What to write in the HTML pane to use this field. Built here, because the
 *  braces would close the interpolation if they stood in the template.
 *
 *  Prefixed, because a bare `{{ headline }}` is also whatever the page around
 *  the component calls `headline`, and the page's is the one that wins —
 *  `props_` is a name only the component has. */
function usage(handle) {
  return `{{ props_${handle || 'handle'} }}`;
}
</script>

<template>
  <div v-if="ui.open" class="sve-cprops" :class="{ 'sve-cprops--pane': !ui.inSidebar }">
    <div class="sve-cprops__head">
      <span>{{ ui.title }}</span>
      <button
        type="button"
        class="sve-cprops__add"
        :title="ui.addLabel"
        :aria-label="ui.addLabel"
        :disabled="ui.locked"
        @click="ui.onAdd?.($event.currentTarget)"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>

    <button
      v-if="!ui.rows.length"
      type="button"
      class="sve-cprops__first"
      :disabled="ui.locked"
      @click="ui.onAdd?.($event.currentTarget)"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
      <span>{{ ui.addLabel }}</span>
    </button>
    <p v-if="!ui.rows.length" class="sve-cprops__empty">{{ ui.emptyText }}</p>

    <div
      v-for="(row, index) in ui.rows"
      :key="row.key"
      :ref="(el) => (rowEls[index] = el)"
      class="sve-cprops__card"
      :data-over="dragOver === index && dragFrom !== index ? '' : undefined"
      :data-lifted="dragFrom === index ? '' : undefined"
      :data-binding="row.binding ? '' : undefined"
      :data-open="row.open ? '' : undefined"
      @dragover="onDragOver(index, $event)"
      @drop.prevent="onDrop(index)"
    >
      <div
        class="sve-cprops__line"
        :draggable="!ui.locked"
        :title="ui.moveLabel"
        @click="ui.onOpen?.(index)"
        @dragstart="onDragStart(index, $event)"
        @dragend="onDragEnd"
      >
        <span class="sve-cprops__tile" :data-kind="row.type">
          <span v-if="row.type === 'text'" class="sve-cprops__letter">T</span>
          <span v-else class="sve-cprops__glyph" v-html="ICONS[row.type] || ICONS.bard"></span>
        </span>

        <span class="sve-cprops__what">
          <span class="sve-cprops__name">{{ row.handle }}</span>
          <span class="sve-cprops__value">{{ row.default || ui.defaultLabel }}</span>
        </span>

        <img
          v-if="thumb(row, index)"
          class="sve-cprops__thumb"
          :src="thumb(row, index)"
          alt=""
          @error="broken[index] = true"
        />

        <span class="sve-cprops__acts">
          <button
            type="button"
            class="sve-cprops__act"
            :title="ui.bindLabel"
            :aria-label="ui.bindLabel"
            :aria-pressed="row.binding"
            :disabled="ui.locked"
            @click.stop="ui.onBind?.(index)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/><path d="M12 1.6v3.2M12 19.2v3.2M1.6 12h3.2M19.2 12h3.2" stroke-linecap="round"/></svg>
          </button>
          <button
            type="button"
            class="sve-cprops__act"
            :title="ui.removeLabel"
            :aria-label="ui.removeLabel"
            :disabled="ui.locked"
            @click.stop="ui.onRemove?.(index)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </button>
        </span>
      </div>

      <p v-if="row.binding" class="sve-cprops__hint">{{ ui.bindHint }}</p>

      <div v-if="row.open" class="sve-cprops__edit">
        <div class="sve-cprops__pair">
          <input
            class="sve-cprops__box"
            type="text"
            :value="row.handle"
            :placeholder="ui.handleLabel"
            :disabled="ui.locked"
            spellcheck="false"
            @change="onField(index, 'handle', $event)"
          />
          <select
            class="sve-cprops__box sve-cprops__kind"
            :value="row.type"
            :disabled="ui.locked"
            @change="onField(index, 'type', $event)"
          >
            <option v-for="kind in ui.types" :key="kind.id" :value="kind.id">{{ kind.label }}</option>
          </select>
        </div>
        <!--
          The Control Panel's own field for the default. Rich text gets Bard,
          a picture gets the asset browser, a link gets the page picker — none
          of it drawn here. The plain box below is what is left when the
          Control Panel cannot lend its fields.
        -->
        <!--
          The default is edited with the Control Panel's own field — Bard for
          rich text, the asset browser for a picture, the page picker for a
          link. An ordinary child, not a second app: this panel is already
          mounted somewhere that can see Statamic's components.
        -->
        <PropValues v-if="ui.statamicFields && ui.defaultStore" :store="ui.defaultStore" class="sve-cprops__form" />
        <input
          v-else
          class="sve-cprops__box"
          type="text"
          :value="row.default"
          :placeholder="ui.defaultLabel"
          :disabled="ui.locked"
          @change="onField(index, 'default', $event)"
        />

        <code class="sve-cprops__use">{{ usage(row.handle) }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sve-cprops {
  /* The tree's own blue for anything with an edge, and a lighter mix of it for
     icons and text — #3858e9 on a dark card is a colour you cannot read. */
  --sve-cprops-accent: #3858e9;
  --sve-cprops-accent-soft: #93a6f7;
  padding: .5rem 0 .625rem;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
/* In the right pane the tree sits directly under it and needs the line. In the
   left column it is the whole panel and has nothing to be separated from. */
.sve-cprops--pane {
  padding-left: .625rem;
  padding-right: .625rem;
  border-bottom: 1px solid var(--sve-line, rgba(255, 255, 255, .1));
}
.sve-cprops__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: .6875rem;
  letter-spacing: .06em;
  text-transform: uppercase;
  opacity: .6;
  margin-bottom: .5rem;
}
.sve-cprops__add,
.sve-cprops__act {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6em;
  height: 1.6em;
  border-radius: .3rem;
  line-height: 1;
  opacity: .65;
}
.sve-cprops__add {
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, .22);
  background: rgba(255, 255, 255, .08);
}
.sve-cprops__add:hover,
.sve-cprops__act:hover:not([disabled]) {
  opacity: 1;
  background: rgba(255, 255, 255, .18);
}
.sve-cprops__add[disabled],
.sve-cprops__act[disabled] {
  cursor: default;
  opacity: .3;
}
/* With no fields yet there is nothing else on screen to click, so the button
   says what it does in words rather than leaving a plus to be found. */
.sve-cprops__first {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .375em;
  width: 100%;
  box-sizing: border-box;
  padding: .625em;
  margin-bottom: .5em;
  border: 1px dashed rgba(255, 255, 255, .28);
  border-radius: .5rem;
  font-size: .8125rem;
}
.sve-cprops__first:hover {
  background: rgba(255, 255, 255, .08);
  border-color: rgba(255, 255, 255, .45);
}
.sve-cprops__first[disabled] {
  cursor: default;
  opacity: .35;
}
.sve-cprops__empty {
  margin: 0;
  font-size: .75rem;
  opacity: .55;
  line-height: 1.5;
}

/* One field, one card. */
.sve-cprops__card {
  border: 1px solid transparent;
  border-radius: .55rem;
  background: rgba(255, 255, 255, .05);
  margin-bottom: .375rem;
}
.sve-cprops__card:hover {
  background: rgba(255, 255, 255, .08);
}
.sve-cprops__card[data-open] {
  background: rgba(255, 255, 255, .08);
}
/* Where the card being dragged would land. */
.sve-cprops__card[data-over] {
  border-color: var(--sve-cprops-accent);
}
.sve-cprops__card[data-lifted] {
  opacity: .4;
}
/* Waiting for something in the preview to be pointed at. */
.sve-cprops__card[data-binding] {
  border-color: var(--sve-cprops-accent);
  background: rgba(56, 88, 233, .16);
}
.sve-cprops__card[data-binding] .sve-cprops__act[aria-pressed='true'] {
  opacity: 1;
  color: var(--sve-cprops-accent-soft);
}

.sve-cprops__line {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .5rem;
  cursor: pointer;
}
.sve-cprops__line:active {
  cursor: grabbing;
}
/* The kind, as a thing rather than a word — the same read as the block icons
   in the tree, so the two lists feel like one editor. */
.sve-cprops__tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 2.125em;
  height: 2.125em;
  border-radius: .45rem;
  background: rgba(56, 88, 233, .28);
  color: var(--sve-cprops-accent-soft);
}
.sve-cprops__letter {
  font-size: .9375rem;
  font-weight: 600;
  line-height: 1;
}
.sve-cprops__glyph {
  display: inline-flex;
  width: 1em;
  height: 1em;
  font-size: 1.0625rem;
  line-height: 1;
}
.sve-cprops__glyph :deep(svg) {
  width: 100%;
  height: 100%;
}
.sve-cprops__what {
  display: flex;
  flex-direction: column;
  gap: .1em;
  flex: 1 1 auto;
  min-width: 0;
}
.sve-cprops__name,
.sve-cprops__value {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sve-cprops__name {
  font-size: .8125rem;
  font-weight: 600;
}
.sve-cprops__value {
  font-size: .75rem;
  opacity: .5;
}
.sve-cprops__thumb {
  flex: 0 0 auto;
  width: 3.25em;
  height: 2.125em;
  object-fit: cover;
  border-radius: .3rem;
  background: rgba(255, 255, 255, .08);
}
/* Synlige uden at pege på rækken. De stod på opacity 0 indtil hover, og en
   kontrol man ikke kan se, findes ikke: sletningen har været der hele tiden og
   blev bedt om som en ny funktion. Dæmpet i hvile, fuld styrke når rækken er
   under musen, åben eller bundet — til stede uden at råbe. */
.sve-cprops__acts {
  display: flex;
  gap: .125rem;
  flex: 0 0 auto;
  opacity: .45;
}
.sve-cprops__card:hover .sve-cprops__acts,
.sve-cprops__card[data-binding] .sve-cprops__acts,
.sve-cprops__card[data-open] .sve-cprops__acts {
  opacity: 1;
}
.sve-cprops__hint {
  margin: 0;
  padding: 0 .5rem .5rem calc(.5rem + 2.125em + .5rem);
  font-size: .6875rem;
  line-height: 1.4;
  color: var(--sve-cprops-accent-soft);
}

.sve-cprops__edit {
  padding: 0 .5rem .5rem calc(.5rem + 2.125em + .5rem);
}
.sve-cprops__pair {
  display: flex;
  gap: .25rem;
  margin-bottom: .25rem;
}
.sve-cprops__box {
  font: inherit;
  font-size: .8125rem;
  color: inherit;
  background: rgba(0, 0, 0, .25);
  border: 1px solid rgba(255, 255, 255, .14);
  border-radius: .3rem;
  padding: .3rem .4rem;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
}
.sve-cprops__kind {
  width: auto;
  flex: 0 0 auto;
  /* The browser paints the arrow against the border and lays nothing out for
     it, so no amount of padding moves it. Switched off and drawn here instead,
     where it can be given room on both sides. */
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-opacity='.65' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right .55rem center;
  background-size: .7em;
  padding-right: 1.9rem;
}
.sve-cprops__pair .sve-cprops__box:first-child {
  flex: 1 1 auto;
}
/* The publish form brings its own look; this only gives it the room. */
.sve-cprops__form {
  margin-top: .25rem;
}
.sve-cprops__use {
  display: block;
  margin-top: .3rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: .6875rem;
  opacity: .45;
}
</style>
