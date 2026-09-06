<script setup>
defineProps({
  title: { type: String, default: '' },
  hint: { type: String, required: true },
  withChrome: { type: Boolean, default: false },
});
</script>

<template>
  <div class="sve-outline">
    <div v-if="withChrome" class="sve-pane-bar" data-sve-pane-bar>
      <div data-sve-right-title>{{ title }}</div>
      <div data-sve-right-actions>
        <button type="button" data-sve-right-pin aria-pressed="false"></button>
        <button type="button" data-sve-close aria-label="Close">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
    <div data-sve-a11y-tabs></div>
    <div class="sve-a11y-body" data-sve-a11y-body="headings">
      <div class="sve-pane-hint">{{ hint }}</div>
      <div data-sve-outline-notice></div>
      <div data-sve-outline-list></div>
    </div>
    <div class="sve-a11y-body" data-sve-a11y-body="contrast" hidden></div>
    <div class="sve-a11y-body" data-sve-a11y-body="checks" hidden></div>
    <div class="sve-a11y-body" data-sve-a11y-body="tree" hidden></div>
  </div>
</template>

<style scoped>
.sve-outline {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
/* Tabs swap by `hidden`, so the flex display has to yield to it — an explicit
   display on the body would otherwise keep both panes on screen at once. */
.sve-a11y-body {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1 1 auto;
}
.sve-a11y-body[hidden] {
  display: none;
}
.sve-pane-hint {
  padding: var(--sve-right-body-pad-block, 8px) 0 0;
  font-size: 11px;
  opacity: 0.6;
  flex: 0 0 auto;
}
[data-sve-outline-notice] {
  flex: 0 0 auto;
}
[data-sve-outline-list] {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
</style>
