<script setup>
/**
 * The page's sections, and inside the open one its own tags.
 *
 * Every row here — shut section, open section, tag — is one HtmlTreeRow. It
 * used to be two: a hand-written block for a shut section and the component
 * for everything else, which is why the same section wore a different name,
 * mark and highlight depending on whether it was open. Shut is a state of the
 * row, not a second row.
 */
import { computed } from 'vue';
import { htmlTreeUi as ui } from '../html-tree/store.js';
import { matchesHtmlTreeRow, normalizeHtmlTreeQuery, searchHtmlTreeRows } from '../html-tree/search.js';
import HtmlTreeRow from './HtmlTreeRow.vue';

/**
 * The search, applied to what the last paint produced. The open section's
 * rows are searched through (html-tree.js flattens the whole file while a
 * query is in the box); a shut section is one row, so its name and tag are
 * what a search can find. The open section stays when its own row matches or
 * anything under it does.
 */
const query = computed(() => normalizeHtmlTreeQuery(ui.query));
const found = computed(() => searchHtmlTreeRows(ui.rows, query.value));
const shownRows = computed(() => found.value.rows);
/** A shut section's row, one level in under the loop row that draws it. */
function inLoop(sectionRow, loopRow) {
  return { ...sectionRow, depth: loopRow.depth + 1, guides: [...(loopRow.guides || []), loopRow.cat] };
}

/** The sections fields the open template draws no loop over — not while searching. */
const shownMissing = computed(() => (query.value ? [] : ui.sectionsMissing || []));
const shownSections = computed(() => {
  if (!query.value) {
    return ui.sections;
  }

  return ui.sections.filter((sec) =>
    matchesHtmlTreeRow(sec.row, query.value) || (sec.current && sec.ready && shownRows.value.length > 0)
  );
});
/** A frame row shows when nothing is searched for, or when it is what was. */
function frameShown(row) {
  return !!row && (!query.value || matchesHtmlTreeRow(row, query.value));
}

/**
 * A half fades nothing — the rest is not drawn at all (`halfOnly`) — so the
 * half's own arm is all this still answers for. A component draws neither
 * frame nor sections, so `inComponent` here only reaches an empty page's
 * frame, should the dock hold a component on one.
 */
function frameDim(part) {
  const kind = ui.frame?.kind;

  return ui.inComponent || ((kind === 'header' || kind === 'footer') && kind !== part);
}

/**
 * Standing in the header or the footer, the tree is that half and nothing
 * else.
 *
 * The other two used to stand around it, dimmed, with the page's sections
 * under main — three ways back out. But clicking the header then gave the
 * header's rows *and* the whole page around them, and the reader could not
 * tell which tree they were reading. The way back out is the bar under the
 * preview and the dock's back arrow; the tree keeps one subject.
 */
const halfOnly = computed(() => ui.frame?.kind === 'header' || ui.frame?.kind === 'footer');

const frameFound = computed(
  () => !!ui.frame && ['header', 'main', 'footer'].some((part) => frameShown(ui.frame[part]))
);

/**
 * Is there a <main> row above the sections? Only then do they step in a level
 * under it. On a page's own tree nothing stands above them, and the step was
 * an empty gutter in front of every section.
 */
const underMain = computed(
  () => !!ui.frame && (ui.frame.kind === 'main' || frameShown(ui.frame.main))
);
const nothingFound = computed(
  () => !!query.value && !shownSections.value.length && !shownRows.value.length && !frameFound.value
);

function isDim(row) {
  return !!query.value && !found.value.hits.has(row.path);
}

/**
 * The wrapper around one section's rows: named by uid, so a drag over any of
 * its rows finds the section; the open one marked as the branch; and the
 * drop line above or below it while a section is being dragged.
 */
function wrapBind(sec) {
  const bind = { 'data-sve-ht-sec-uid': sec.uid };

  if (sec.current) {
    bind['data-sve-ht-branch'] = '';
    // The section's family, so the tags look can draw the box in its colour.
    bind['data-sve-ht-cat'] = sec.row?.cat || 'layout';
  }

  if (ui.sectionDrop && ui.sectionDrop.uid === sec.uid) {
    bind['data-sve-ht-drop'] = ui.sectionDrop.place;
  }

  return bind;
}

</script>

<template>
  <div
    class="sve-ht-root"
    :data-sve-ht-look="ui.layers ? 'tags' : ui.look"
    :data-sve-ht-layers="ui.layers ? '' : null"
    :style="ui.familyStyle"
    v-bind="ui.dragging ? { 'data-sve-ht-dragging': '' } : {}"
  >
    <!--
      The layers look on trial is the tags look with a few rules on top, so it
      wears data-sve-ht-look="tags" as well; off, the look is exactly as set.
    -->
    <!--
      A page drawn whole by a template it shares with other pages: which one,
      and the way to it. No rows — the file is not this page's to edit.
    -->
    <div v-if="ui.pageTemplate" class="sve-ht-page-template">
      <p v-if="ui.pageTemplate.text" class="sve-ht-page-template__text">{{ ui.pageTemplate.text }}</p>
      <p class="sve-ht-page-template__note">{{ ui.pageTemplate.note }}</p>
      <button
        v-if="ui.pageTemplate.canOpen"
        type="button"
        class="sve-ht-page-template__open"
        @click="ui.pageTemplate.onOpen($event.currentTarget)"
      >{{ ui.pageTemplate.openLabel }}</button>
    </div>
    <div v-else-if="!ui.rows.length && !ui.sections.length && !ui.frame" class="sve-ht-empty">{{ ui.emptyText }}</div>
    <div v-else-if="nothingFound" class="sve-ht-empty">{{ ui.searchEmpty }}</div>

    <!--
      The page's frame around the sections: header, then main with the
      sections in it, then footer. On the header's or footer's own file that
      half's rows stand alone, in a box (`halfOnly` — the other two and the
      page under them are not drawn). Without a frame (a collection's
      template, a component) the list is the file's rows, as it always was.
    -->
    <template v-if="(ui.frame || ui.sections.length) && !ui.sectionsInLoop">
      <!-- An own page's file, above the sections it draws: the way back to it. -->
      <HtmlTreeRow v-if="ui.ownFile && !query" :row="ui.ownFile" />
      <template v-if="ui.frame">
        <div v-if="ui.frame.kind === 'header'" data-sve-ht-branch data-sve-ht-cat="header">
          <HtmlTreeRow v-for="row in shownRows" :key="row.id" :row="row" :dim="isDim(row)" />
          <div v-if="!ui.rows.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
        </div>
        <HtmlTreeRow v-else-if="!halfOnly && frameShown(ui.frame.header)" :row="ui.frame.header" :dim="frameDim('header')" />
      </template>
      <!--
        Main and what it holds. With the layout open, main's own rows and the
        page's sections sit in one box — the sections are main's children, the
        way a block's rows are its. Otherwise main is a shut row with the
        sections (or the slot where they go) stepping in under it.
      -->
      <div v-if="!halfOnly" v-bind="ui.frame?.kind === 'main' ? { 'data-sve-ht-branch': '', 'data-sve-ht-cat': 'main' } : {}">
        <template v-if="ui.frame?.kind === 'main'">
          <HtmlTreeRow v-for="row in shownRows" :key="row.id" :row="row" :dim="isDim(row)" />
          <div v-if="!ui.rows.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
        </template>
        <HtmlTreeRow v-else-if="ui.frame && frameShown(ui.frame.main)" :row="ui.frame.main" :dim="frameDim('main')" />
        <!-- A collection's template: its rows inside main, where the page's sections would be. -->
        <div v-if="ui.frame?.kind === 'template'" v-show="!ui.mainShut" data-sve-ht-frame-body :data-sve-ht-under-main="underMain ? '' : null">
          <div data-sve-ht-branch data-sve-ht-cat="main">
            <HtmlTreeRow v-for="row in shownRows" :key="row.id" :row="row" :dim="isDim(row)" />
            <div v-if="!ui.rows.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
          </div>
        </div>
      <div v-if="ui.sections.length || ui.frame" v-show="!ui.frame || !ui.mainShut" data-sve-ht-frame-body :data-sve-ht-under-main="underMain ? '' : null">
        <!-- Standing elsewhere on a template's entry: the template, the way back. -->
        <HtmlTreeRow v-if="ui.frame?.template && frameShown(ui.frame.template)" :row="ui.frame.template" :dim="frameDim('template')" />
        <!--
          No sections: the slot where they go, the same slot an empty block
          shows — it belongs to main, so it stands there whatever part of the
          frame is open.
        -->
        <div v-if="ui.frame && !ui.frame.template && !ui.sections.length && !query" data-sve-ht-frame-slot :data-dim="frameDim('') ? '' : undefined">{{ ui.frameEmptyText }}</div>
        <div
          v-for="sec in shownSections"
          :key="sec.uid"
          v-bind="wrapBind(sec)"
        >
          <!--
            Open: the file's own rows, the first of which IS this section — it
            carries the name and mark built alongside the shut row, so the two
            states say the same thing. Shut: that row, with nothing under it yet.
          -->
          <template v-if="sec.ready">
            <HtmlTreeRow v-for="row in shownRows" :key="row.id" :row="row" :dim="isDim(row)" />
            <div v-if="!ui.rows.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
          </template>
          <!-- Inside a component, or another part of the frame, every section fades. -->
          <HtmlTreeRow v-else :row="sec.row" :dim="frameDim('')" />
        </div>
      </div>
      </div>
      <template v-if="ui.frame">
        <div v-if="ui.frame.kind === 'footer'" data-sve-ht-branch data-sve-ht-cat="footer">
          <HtmlTreeRow v-for="row in shownRows" :key="row.id" :row="row" :dim="isDim(row)" />
          <div v-if="!ui.rows.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
        </div>
        <HtmlTreeRow v-else-if="!halfOnly && frameShown(ui.frame.footer)" :row="ui.frame.footer" :dim="frameDim('footer')" />
      </template>
    </template>
    <!--
      Inside a component the tree is that component and nothing else — its
      rows in a box of its own family, the way the header's stand alone in
      the header's. No frame, no sections (html-tree.js leaves both out).
    -->
    <div v-else-if="ui.inComponent && ui.rows.length" data-sve-ht-branch data-sve-ht-cat="component">
      <HtmlTreeRow v-for="row in shownRows" :key="row.id" :row="row" :dim="isDim(row)" />
    </div>
    <template v-else-if="ui.rows.length">
      <template v-for="row in shownRows" :key="row.id">
        <HtmlTreeRow :row="row" :dim="isDim(row)" />
        <!-- An own page's file: the page's sections under the loop that draws them. -->
        <template v-if="!query && ui.sectionsInLoop && row.kind === 'sections' && row.tag === ui.sectionsInLoop">
          <HtmlTreeRow v-for="sec in ui.sections" :key="sec.uid" :row="inLoop(sec.row, row)" />
        </template>
      </template>
    </template>
    <!--
      The template's pages keep sections in a field this file draws no loop
      over, so they are not on the page. One click writes the loop at the end
      of the file, and its row — the page's sections — takes this one's place.
    -->
    <div v-for="field in shownMissing" :key="field" data-sve-ht-sections-missing :data-sve-ht-field="field">
      <span>{{ ui.sectionsMissingText }}<template v-if="ui.sectionsMissing.length > 1"> · <code>{{ field }}</code></template></span>
      <button type="button" data-sve-ht-sections-add @click="ui.onAddSections?.(field)">{{ ui.sectionsAddText }}</button>
    </div>
  </div>
</template>

<style scoped>
/* The same slot an empty block shows ([data-sve-ht-slot] in the row), one level in. */
[data-sve-ht-frame-slot] {
  box-sizing: border-box;
  margin-left: 12px;
  min-height: 2em;
  margin-bottom: 0.2em;
  padding: 0.45em 0.6em;
  border: 1px dashed rgba(128, 128, 128, 0.45);
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  line-height: 1.3;
  opacity: 0.5;
}
[data-sve-ht-frame-slot][data-dim] {
  opacity: 0.3;
}
/* Where the page's sections would be: the same dashed slot, with its one action. */
[data-sve-ht-sections-missing] {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0.25rem 0 0.2rem;
  padding: 0.4em 0.4em 0.4em 0.6em;
  border: 1px dashed rgba(128, 128, 128, 0.45);
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  line-height: 1.3;
}
[data-sve-ht-sections-missing] > span {
  opacity: 0.65;
}
[data-sve-ht-sections-add] {
  flex: none;
  padding: 0.25em 0.6em;
  border: 0;
  border-radius: 0.3rem;
  background: rgba(56, 88, 233, 0.16);
  color: inherit;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
[data-sve-ht-sections-add]:hover {
  background: rgba(56, 88, 233, 0.28);
}
.sve-ht-empty {
  padding: 28px 6px;
  text-align: center;
  opacity: 0.55;
  font-size: 12px;
}
.sve-ht-root[data-sve-ht-dragging] {
  cursor: grabbing;
}
/* The shared template's name and the way to it: a note, not a row. */
.sve-ht-page-template {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1.25rem 0.375rem;
  font-size: 0.75rem;
  line-height: 1.4;
}
.sve-ht-page-template__text {
  margin: 0;
  font-weight: 600;
}
.sve-ht-page-template__note {
  margin: 0;
  opacity: 0.65;
}
.sve-ht-page-template__open {
  all: unset;
  box-sizing: border-box;
  cursor: pointer;
  margin-top: 0.25rem;
  padding: 0.45rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
}
.sve-ht-page-template__open:focus-visible {
  outline: 2px solid #3858e9;
  outline-offset: 2px;
}
</style>
