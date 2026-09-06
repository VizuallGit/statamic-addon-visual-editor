<script setup>
import { computed } from 'vue';
import { a11yUi as ui } from '../a11y/store.js';

/**
 * The count on a tab is the reason to open it. Each tab answers for itself, and
 * only once it has actually read the page — an unopened tab never claims a page
 * is clean, which would be the one lie a checker must not tell.
 */
const badges = computed(() => ({
  headings: ui.headingIssues ? { count: ui.headingIssues, level: ui.headingLevel } : null,
  contrast:
    ui.scanned.contrast && ui.found.contrast
      ? { count: ui.found.contrast, level: 'critical' }
      : null,
  checks:
    ui.scanned.checks && ui.found.checks ? { count: ui.found.checks, level: 'critical' } : null,
  tree: ui.scanned.tree && ui.found.tree ? { count: ui.found.tree, level: 'critical' } : null,
}));
</script>

<template>
  <div class="sve-a11y-tabs">
    <button
      v-for="tab in ui.tabs"
      :key="tab.key"
      type="button"
      :data-tab="tab.key"
      :class="{ 'is-on': ui.tab === tab.key }"
      @click="ui.onTab?.(tab.key)"
    >
      {{ tab.label }}
      <span
        v-if="badges[tab.key]"
        class="sve-a11y-tab-badge"
        :data-level="badges[tab.key].level"
      >{{ badges[tab.key].count }}</span>
    </button>
  </div>
</template>

<style scoped>
.sve-a11y-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 6px 0 2px;
  flex: 0 0 auto;
}
button {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 12px;
  color: currentColor;
  opacity: 0.7;
  font-weight: 500;
}
button.is-on {
  background: rgba(128, 128, 128, 0.2);
  font-weight: 600;
  opacity: 1;
}
.sve-a11y-tab-badge {
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  padding: 2px 5px;
  border-radius: 99px;
  color: #fff;
  background: #d97706;
}
.sve-a11y-tab-badge[data-level="critical"],
.sve-a11y-tab-badge[data-level="fail"] {
  background: #dc2626;
}
</style>
