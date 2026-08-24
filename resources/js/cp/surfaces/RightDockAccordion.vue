<script setup>
defineProps({
  sections: { type: Array, required: true },
  grip: { type: String, required: true },
  pin: { type: String, required: true },
  reorderTitle: { type: String, required: true },
});
</script>

<template>
  <div data-sve-right-resize></div>
  <div data-sve-right-panes>
    <div v-for="section in sections" :key="section.key" :data-sve-right-section="section.key">
      <div data-sve-right-head>
        <button type="button" data-sve-right-reorder :title="reorderTitle" v-html="grip"></button>
        <button type="button" :data-sve-right-pane-btn="section.key">
          <svg data-sve-right-chevron viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
          <span>{{ section.label }}</span>
        </button>
        <button type="button" :data-sve-right-pin="section.key" v-html="pin"></button>
      </div>
      <div :data-sve-right-pane="section.key" :id="section.id || undefined" hidden>
        <div v-if="section.key === 'comments'" data-sve-comments-host class="sve-comments-host"></div>
      </div>
      <div data-sve-right-split :data-sve-right-split-after="section.key" hidden></div>
    </div>
  </div>
</template>

<style scoped>
.sve-comments-host {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
</style>
