<script setup>
defineProps({
  title: { type: String, required: true },
});
</script>

<template>
  <div class="sve-listview">
    <div class="sve-pane-bar" data-sve-pane-bar>
      <div data-sve-right-title>{{ title }}</div>
      <div data-sve-right-actions>
        <button type="button" data-sve-right-pin aria-pressed="false"></button>
        <button type="button" data-sve-close aria-label="Close">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
    <div data-sve-lv-body></div>
  </div>
</template>

<style scoped>
.sve-listview {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
[data-sve-lv-body] {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
