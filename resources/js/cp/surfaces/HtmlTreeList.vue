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
const nothingFound = computed(
  () => !!query.value && !shownSections.value.length && !shownRows.value.length
);

function isDim(row) {
  return !!query.value && !found.value.hits.has(row.path);
}

// The page template's static sections stand on either side of the sections
// list; the open section's box holds only the rows of its own file.
const staticAbove = computed(() => shownRows.value.filter((row) => row.staticSide === 'above'));
const staticBelow = computed(() => shownRows.value.filter((row) => row.staticSide === 'below'));
const sectionRows = computed(() => shownRows.value.filter((row) => !row.staticSide));
</script>

<template>
  <div class="sve-ht-root" :data-sve-ht-look="ui.look" :style="ui.familyStyle" v-bind="ui.dragging ? { 'data-sve-ht-dragging': '' } : {}">
    <div v-if="!ui.rows.length && !ui.sections.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
    <div v-else-if="nothingFound" class="sve-ht-empty">{{ ui.searchEmpty }}</div>

    <template v-if="ui.sections.length">
      <!-- Static sections written into the page template, above the loop. -->
      <HtmlTreeRow v-for="row in staticAbove" :key="row.id" :row="row" :dim="isDim(row)" />
      <div
        v-for="sec in shownSections"
        :key="sec.uid"
        v-bind="sec.current ? { 'data-sve-ht-branch': '' } : {}"
      >
        <!--
          Open: the file's own rows, the first of which IS this section — it
          carries the name and mark built alongside the shut row, so the two
          states say the same thing. Shut: that row, with nothing under it yet.
        -->
        <template v-if="sec.ready">
          <HtmlTreeRow v-for="row in sectionRows" :key="row.id" :row="row" :dim="isDim(row)" />
          <div v-if="!sectionRows.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
        </template>
        <!-- Inside a component every other section fades, as the preview fades them. -->
        <HtmlTreeRow v-else :row="sec.row" :dim="ui.inComponent" />
      </div>
      <!-- …and below it. -->
      <HtmlTreeRow v-for="row in staticBelow" :key="row.id" :row="row" :dim="isDim(row)" />
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
