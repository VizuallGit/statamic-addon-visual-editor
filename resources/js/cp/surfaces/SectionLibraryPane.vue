<script setup>
defineProps({
  title: { type: String, required: true },
  hint: { type: String, required: true },
  searchPlaceholder: { type: String, required: true },
  // Shown only when auto-update is off: with the timer running there is nothing
  // for a button to add.
  showRefresh: { type: Boolean, default: false },
  refreshLabel: { type: String, default: 'Update previews' },
});
</script>

<template>
  <div class="sve-library">
    <div class="sve-pane-bar" data-sve-pane-bar>
      <div data-sve-right-title>{{ title }}</div>
      <div data-sve-right-actions>
        <button
          v-if="showRefresh"
          type="button"
          data-sve-previews-refresh
          :aria-label="refreshLabel"
          :title="refreshLabel"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
          <span data-sve-previews-spinner aria-hidden="true"></span>
        </button>
        <button type="button" data-sve-right-pin aria-pressed="false"></button>
        <button type="button" data-sve-close aria-label="Close">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
    <div data-sve-hint class="sve-pane-hint">{{ hint }}</div>
    <div data-sve-tabs></div>
    <div data-sve-search-wrap>
      <input data-sve-search type="text" autocomplete="sve-off" :placeholder="searchPlaceholder">
    </div>
    <div data-sve-groups-wrap>
      <div data-sve-groups></div>
      <div data-sve-groups-fade aria-hidden="true"></div>
    </div>
    <div data-sve-scroll>
      <div data-sve-grid></div>
    </div>
  </div>
</template>

<style scoped>
.sve-library {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
.sve-pane-hint {
  padding: var(--sve-right-body-pad-block, 8px) 0 0;
  font-size: 11px;
  opacity: 0.6;
  flex: 0 0 auto;
}
[data-sve-tabs] {
  display: flex;
  gap: 3px;
  padding: 2px 0 0;
  flex: 0 0 auto;
}
[data-sve-search-wrap] {
  padding: var(--sve-right-body-pad-block, 8px) 0 0;
  flex: 0 0 auto;
}
[data-sve-search] {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.3);
  background: rgba(128, 128, 128, 0.06);
  color: currentColor;
  font: inherit;
  font-size: 12px;
  outline: none;
}
[data-sve-groups-wrap] {
  display: none;
  position: relative;
  flex: 0 0 auto;
  align-self: stretch;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}
[data-sve-groups] {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  padding: var(--sve-right-body-pad-block, 8px) 0 0;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
[data-sve-groups]::-webkit-scrollbar {
  display: none;
}
[data-sve-groups-fade] {
  display: none;
  position: absolute;
  top: var(--sve-right-body-pad-block, 8px);
  right: 0;
  bottom: 0;
  width: 36px;
  pointer-events: none;
  background: linear-gradient(to right, transparent, var(--theme-color-content-bg, Canvas));
}
[data-sve-scroll] {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  margin-top: var(--sve-right-body-pad-block, 8px);
  padding: 0 0 var(--sve-right-body-pad-block, 8px);
}
[data-sve-grid] {
  column-gap: 12px;
}
</style>
