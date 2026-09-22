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

const frameFound = computed(
  () => !!ui.frame && ['header', 'main', 'footer'].some((part) => frameShown(ui.frame[part]))
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
  <div class="sve-ht-root" :data-sve-ht-look="ui.look" :style="ui.familyStyle" v-bind="ui.dragging ? { 'data-sve-ht-dragging': '' } : {}">
    <div v-if="!ui.rows.length && !ui.sections.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
    <div v-else-if="nothingFound" class="sve-ht-empty">{{ ui.searchEmpty }}</div>

    <!--
      The page's frame around the sections: header, then main with the
      sections in it, then footer. On the header's or footer's own file that
      half's rows stand in its place, in a box, and the other two stand shut.
      Without a frame (a collection's template, a component) the list is the
      file's rows, as it always was.
    -->
    <template v-if="ui.frame || ui.sections.length">
      <template v-if="ui.frame">
        <div v-if="ui.frame.kind === 'header'" data-sve-ht-branch data-sve-ht-cat="layout">
          <HtmlTreeRow v-for="row in shownRows" :key="row.id" :row="row" :dim="isDim(row)" />
          <div v-if="!ui.rows.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
        </div>
        <HtmlTreeRow v-else-if="frameShown(ui.frame.header)" :row="ui.frame.header" :dim="ui.inComponent" />
        <HtmlTreeRow v-if="frameShown(ui.frame.main)" :row="ui.frame.main" :dim="ui.inComponent" />
      </template>
      <div v-if="ui.sections.length" v-show="!ui.frame || !ui.mainShut" data-sve-ht-frame-body>
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
          <!-- Inside a component every other section fades, as the preview fades them. -->
          <HtmlTreeRow v-else :row="sec.row" :dim="ui.inComponent" />
        </div>
      </div>
      <template v-if="ui.frame">
        <div v-if="ui.frame.kind === 'footer'" data-sve-ht-branch data-sve-ht-cat="layout">
          <HtmlTreeRow v-for="row in shownRows" :key="row.id" :row="row" :dim="isDim(row)" />
          <div v-if="!ui.rows.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
        </div>
        <HtmlTreeRow v-else-if="frameShown(ui.frame.footer)" :row="ui.frame.footer" :dim="ui.inComponent" />
      </template>
    </template>
    <template v-else-if="ui.rows.length">
      <HtmlTreeRow v-for="row in shownRows" :key="row.id" :row="row" :dim="isDim(row)" />
    </template>
  </div>
</template>

<style scoped>
.sve-ht-empty {
  padding: 28px 6px;
  text-align: center;
  opacity: 0.55;
  font-size: 12px;
}
.sve-ht-root[data-sve-ht-dragging] {
  cursor: grabbing;
}
</style>
