<script setup>
defineProps({
  title: { type: String, default: '' },
  hint: { type: String, required: true },
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
    <div class="sve-pane-hint">{{ hint }}</div>
    <div data-sve-html-tree-list></div>
  </div>
</template>

<style scoped>
.sve-html-tree {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
.sve-pane-hint {
  padding: var(--sve-right-body-pad-block, 8px) 0 6px;
  font-size: 12px;
  line-height: 1.35;
  opacity: 0.55;
  flex: 0 0 auto;
}
[data-sve-html-tree-list] {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
</style>
