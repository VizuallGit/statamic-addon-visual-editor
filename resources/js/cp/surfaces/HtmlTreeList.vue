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
import { computed, nextTick, ref } from 'vue';
import { htmlTreeUi as ui } from '../html-tree/store.js';
import { matchesHtmlTreeRow, normalizeHtmlTreeQuery, searchHtmlTreeRows } from '../html-tree/search.js';
import HtmlTreeRow from './HtmlTreeRow.vue';
import { canCreateSections, openNewSectionDialog, revealWhenRendered } from '../../section-create.js';
import { t } from '../../lib/i18n.js';

// Making a section writes files into the repository, so it is the developer
// permission that decides — the same gate as deleting one. An editor never
// sees the button at all.
const canCreate = canCreateSections(window);
const newSectionLabel = t(window, 'section_new');
const creating = ref(false);

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

function release() {
  creating.value = false;
}

// Locked from click until the dialog is gone — created, failed, or cancelled.
// Without onClose, Cancel left the lock on and the plus did nothing next time.

/**
 * Step into the section that was just made, the same move a click on its row
 * makes.
 *
 * Not straight away: the row is written onto the publish form, and the tree,
 * the panel beside the preview and the preview itself each catch up on their
 * own clock. `onSection` bails on a uid it cannot find in the list it was
 * built with, so the list is re-read first, and re-read again while the form
 * renders — a second at the outside, then it is left alone.
 */
async function openNewlyMade(uid) {
  if (!uid) {
    return;
  }

  for (let attempt = 0; attempt < 20; attempt += 1) {
    await nextTick();
    ui.onRefresh?.();

    const section = ui.sections.find((item) => item.uid === uid);

    if (section) {
      ui.onSection?.(uid);
      // Stepping in asks the preview for the section straight away, and the
      // preview has not drawn it yet. So ask again when it has.
      revealWhenRendered(window, section.ids);

      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

function onNewSection() {
  if (creating.value) {
    return;
  }

  creating.value = true;

  openNewSectionDialog(window, {
    // The plus is the last thing under the sections, so the section lands where
    // the button is: after the last one on the page.
    afterUid: ui.sections.length ? ui.sections[ui.sections.length - 1].uid : null,
    onDone: (data) => {
      release();
      void openNewlyMade(data?.uid);
    },
    onError: release,
    onClose: release,
  });
}
</script>

<template>
  <div class="sve-ht-root" :data-sve-ht-look="ui.look" v-bind="ui.dragging ? { 'data-sve-ht-dragging': '' } : {}">
    <div v-if="!ui.rows.length && !ui.sections.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
    <div v-else-if="nothingFound" class="sve-ht-empty">{{ ui.searchEmpty }}</div>

    <template v-if="ui.sections.length">
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
          <HtmlTreeRow v-for="row in shownRows" :key="row.id" :row="row" :dim="isDim(row)" />
          <div v-if="!ui.rows.length" class="sve-ht-empty">{{ ui.emptyText }}</div>
        </template>
        <HtmlTreeRow v-else :row="sec.row" />
      </div>
    </template>
    <template v-else-if="ui.rows.length">
      <HtmlTreeRow v-for="row in shownRows" :key="row.id" :row="row" :dim="isDim(row)" />
    </template>
    <!--
      The last thing under the sections, and shaped like one: adding a section
      belongs at the end of the list you are adding it to, not in the pane bar
      above it, where it sat among close and pin and read as a window control.
      Shown on an empty page builder too — otherwise deleting the last section
      left no way to add the next one.
    -->
    <button
      v-if="canCreate && (ui.sections.length || ui.pageBuilder)"
      type="button"
      class="sve-ht-new"
      :title="newSectionLabel"
      :aria-label="newSectionLabel"
      @click="onNewSection"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
    </button>
  </div>
</template>

<style scoped>
/* Same box as a section row (html-tree.js draws those), so it reads as the next
   one in the list — and the same blue on hover that a row wears when it is the
   one being worked on. */
.sve-ht-new {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  aspect-ratio: 1;
  margin: 0.5rem 0 0.1875rem;
  background: rgba(128, 128, 128, 0.16);
  border-radius: 0.375rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
}
.sve-ht-new:hover {
  background: #3858e9;
  color: #fff;
  opacity: 1;
}
.sve-ht-new:focus-visible {
  outline: 2px solid #3858e9;
  outline-offset: -2px;
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
</style>
