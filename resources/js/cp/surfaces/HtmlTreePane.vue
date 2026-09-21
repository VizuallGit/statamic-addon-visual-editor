<script setup>
import ComponentPropsPane from './ComponentPropsPane.vue';
import { componentPropsUi } from '../component-props/store.js';
import HtmlTreeInspector from './HtmlTreeInspector.vue';
import { htmlTreeUi as ui } from '../html-tree/store.js';
import { canCreateSections, chooseSectionKind, insertTemplateSection, openNewSectionDialog, openStaticSectionDialog, revealWhenRendered } from '../../section-create.js';
import { ask } from '../bus.js';
import { t } from '../../lib/i18n.js';
import { nextTick, ref } from 'vue';

defineProps({
  title: { type: String, default: '' },
});

const searchLabel = t(window, 'html_tree_search');

// Making a section writes files into the repository, so it is the developer
// permission that decides — the same gate as deleting one. An editor never
// sees the button at all.
const canCreate = canCreateSections(window);
const newSectionLabel = t(window, 'section_new');
const creating = ref(false);

const PLUS =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>';

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

  // The row is on the form the moment it was placed. The tree's own list
  // cannot be waited for: it names sections only while the dock holds one of
  // them, and on an empty page (or with the header open) it holds none.
  await nextTick();
  ui.onRefresh?.();

  const opened = ask('html-tree:open-section', uid);

  if (opened) {
    // Stepping in asks the preview for the section straight away, and the
    // preview has not drawn it yet. So ask again when it has.
    revealWhenRendered(window, opened.ids);
  }
}

function onNewSection() {
  if (creating.value) {
    return;
  }

  creating.value = true;

  void (async () => {
    // A template (a service, a product) is not built from sections, so there
    // is nothing to ask: the section is static markup written into the open
    // file. Its fields, if any, are the page's blueprint — the top bar's.
    if (!(ui.sections.length || ui.pageBuilder)) {
      insertTemplateSection(window);
      release();

      return;
    }

    // A page built from sections: static markup, or a section with fields.
    const kind = await chooseSectionKind(window);

    if (!kind) {
      release();

      return;
    }

    // The new section lands after the last one on the page — the end of the
    // list the button sits above. Static: a set with markup and no fieldset,
    // placed and opened like any other.
    const afterUid = ui.sections.length ? ui.sections[ui.sections.length - 1].uid : null;
    const done = (data) => {
      release();
      void openNewlyMade(data?.uid);
    };

    if (kind === 'static') {
      openStaticSectionDialog(window, { afterUid, onDone: done, onError: release, onClose: release });

      return;
    }

    openNewSectionDialog(window, { afterUid, onDone: done, onError: release, onClose: release });
  })();
}

const SEARCH =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

const CLEAR =
  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

/**
 * The list filters on every keystroke by itself. The tree is only painted
 * again when the box goes from empty to not, or back: a search reads through
 * folded rows too, and that paint is the one that flattens the whole file.
 */
function setQuery(value) {
  const had = !!ui.query;

  ui.query = value;

  if (had !== !!value) {
    ui.onQuery?.();
  }
}
</script>

<template>
  <div class="sve-html-tree">
    <div class="sve-pane-bar" data-sve-pane-bar>
      <div data-sve-right-title>{{ title }}</div>
      <div data-sve-right-actions>
        <button type="button" data-sve-right-pin aria-pressed="false"></button>
        <button type="button" data-sve-close aria-label="Close">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
    <!--
      Between the bar and the sections: the search, and beside it the plus
      that makes a new section. The plus used to sit at the end of the list,
      shaped like a row; up here, in our blue, it reads as the one action the
      panel offers rather than as one more thing in the tree. Shown on an
      empty page builder too — otherwise deleting the last section left no
      way to add the next one. The search: Escape empties it; the keys stay
      here, so the dock's shortcuts do not fire while typing a name.
    -->
    <div class="sve-ht-tools">
    <label class="sve-ht-search" :title="searchLabel">
      <span class="sve-ht-search__icon" aria-hidden="true" v-html="SEARCH"></span>
      <input
        type="text"
        class="sve-ht-search__input"
        data-sve-ht-search
        :placeholder="searchLabel"
        :aria-label="searchLabel"
        :value="ui.query"
        autocomplete="off"
        spellcheck="false"
        @input="setQuery($event.target.value)"
        @keydown.stop
        @keydown.escape.prevent="setQuery('')"
      >
      <button
        v-if="ui.query"
        type="button"
        class="sve-ht-search__clear"
        :aria-label="searchLabel"
        v-html="CLEAR"
        @click="setQuery('')"
      ></button>
    </label>
    <button
      v-if="canCreate && (ui.sections.length || ui.pageBuilder || ui.rows.length)"
      type="button"
      class="sve-ht-new"
      :title="newSectionLabel"
      :aria-label="newSectionLabel"
      v-html="PLUS"
      @click="onNewSection"
    ></button>
    </div>
    <!--
      Only when there is no Live Preview column to draw them in. Inside a
      component the fields belong on the left, where the section's own fields
      would otherwise be sitting in the way.
    -->
    <ComponentPropsPane v-if="!componentPropsUi.inSidebar" />
    <div data-sve-html-tree-list></div>
    <HtmlTreeInspector />

    <!-- Only while a component is open: on a section there is nothing to leave.
         The left column carries it instead whenever it has taken the fields. -->
    <div v-if="ui.exitOpen && !componentPropsUi.inSidebar" class="sve-tree-exit">
      <span class="sve-tree-exit__name" :title="ui.exitName">{{ ui.exitName }}</span>
      <button
        type="button"
        class="sve-tree-exit__go"
        :title="ui.exitTitle"
        @click="ui.onExit?.()"
      >{{ ui.exitLabel }}</button>
    </div>
  </div>
</template>

<style scoped>
.sve-html-tree {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
[data-sve-html-tree-list] {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
/* The pane owns the gutter (right-dock.css), so only the block margins are
   ours. */
.sve-ht-tools {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 6px;
}
/* Same grey as a row, a touch rounder: a field, not another row. */
.sve-ht-search {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  height: 2rem;
  padding: 0 0.5rem 0 0.625rem;
  border-radius: 4px;
  background: rgba(128, 128, 128, 0.14);
  color: inherit;
  cursor: text;
}
.sve-ht-search:focus-within {
  outline: 2px solid #3858e9;
  outline-offset: -2px;
}
.sve-ht-search__icon {
  flex: none;
  display: inline-flex;
  line-height: 1;
  opacity: 0.55;
}
.sve-ht-search__input {
  all: unset;
  flex: 1 1 auto;
  min-width: 0;
  font: 500 12px/1.3 ui-sans-serif, system-ui, sans-serif;
  color: inherit;
}
.sve-ht-search__input::placeholder {
  color: inherit;
  opacity: 0.45;
}
.sve-ht-search__clear {
  all: unset;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  opacity: 0.6;
}
.sve-ht-search__clear:hover {
  opacity: 1;
  background: rgba(128, 128, 128, 0.25);
}
/* The search field's own grey at rest, and the blue the tree marks the
   picked row with under the pointer: quiet until it is the thing to press. */
.sve-ht-new {
  all: unset;
  box-sizing: border-box;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  background: rgba(128, 128, 128, 0.14);
  color: inherit;
  cursor: pointer;
}
.sve-ht-new:hover {
  background: #3858e9;
  color: #fff;
}
.sve-ht-new:focus-visible {
  outline: 2px solid #3858e9;
  outline-offset: 2px;
}
.sve-tree-exit {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px var(--sve-right-gutter, 12px);
  border-top: 1px solid rgba(128, 128, 128, 0.28);
}
.sve-tree-exit__name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  opacity: 0.65;
}
.sve-tree-exit__go {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  padding: 7px 13px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
}
</style>
