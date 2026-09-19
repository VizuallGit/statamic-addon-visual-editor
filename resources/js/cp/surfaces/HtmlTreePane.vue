<script setup>
import ComponentPropsPane from './ComponentPropsPane.vue';
import { componentPropsUi } from '../component-props/store.js';
import HtmlTreeInspector from './HtmlTreeInspector.vue';
import { htmlTreeUi as ui } from '../html-tree/store.js';
import { t } from '../../lib/i18n.js';

defineProps({
  title: { type: String, default: '' },
});

const searchLabel = t(window, 'html_tree_search');

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
      Between the bar and the sections: the way to a row in a long page. Escape
      empties it; the keys stay here, so the dock's shortcuts do not fire while
      typing a name.
    -->
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
   ours. Same grey as a row, a touch rounder: a field, not another row. */
.sve-ht-search {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  height: 2rem;
  margin: 10px 0 6px;
  padding: 0 0.5rem 0 0.625rem;
  border-radius: 0.5rem;
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
