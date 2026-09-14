<script setup>
import ComponentPropsPane from './ComponentPropsPane.vue';
import { componentPropsUi } from '../component-props/store.js';
import HtmlTreeInspector from './HtmlTreeInspector.vue';
import { htmlTreeUi as ui } from '../html-tree/store.js';

defineProps({
  title: { type: String, default: '' },
});
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
