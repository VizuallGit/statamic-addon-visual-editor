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
import { htmlTreeUi as ui } from '../html-tree/store.js';
import HtmlTreeRow from './HtmlTreeRow.vue';
</script>

<template>
  <div class="sve-ht-root" v-bind="ui.dragging ? { 'data-sve-ht-dragging': '' } : {}">
    <div v-if="!ui.rows.length && !ui.sections.length" class="sve-ht-empty">{{ ui.emptyText }}</div>

    <template v-if="ui.sections.length">
      <div
        v-for="sec in ui.sections"
        :key="sec.uid"
        v-bind="sec.current ? { 'data-sve-ht-branch': '' } : {}"
      >
        <!--
          Open: the file's own rows, the first of which IS this section — it
          carries the name and mark built alongside the shut row, so the two
          states say the same thing. Shut: that row, with nothing under it yet.
        -->
        <template v-if="sec.ready">
          <HtmlTreeRow v-for="row in ui.rows" :key="row.id" :row="row" />
          <div v-if="!ui.rows.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
        </template>
        <HtmlTreeRow v-else :row="sec.row" />
      </div>
    </template>
    <template v-else>
      <HtmlTreeRow v-for="row in ui.rows" :key="row.id" :row="row" />
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
