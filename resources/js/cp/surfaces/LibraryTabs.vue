<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

defineProps({
  tabs: { type: Array, required: true },
  onPick: { type: Function, required: true },
});

// The tabs scroll sideways instead of wrapping, like the group chips below
// them. The fade sits on a sibling, not on the scroller: mask-image on a
// scrollable element resets scrollLeft in Chrome.
const rowEl = ref(null);
const more = ref(false);

const syncFade = () => {
  const row = rowEl.value;

  more.value = !!row && row.scrollWidth - row.clientWidth - row.scrollLeft > 1;
};

let ro = null;

onMounted(() => {
  syncFade();

  try {
    ro = new ResizeObserver(syncFade);
    ro.observe(rowEl.value);
  } catch {
    // No observer, no live resize — the mount and scroll syncs still run.
  }
});

onBeforeUnmount(() => ro?.disconnect());
</script>

<template>
  <div class="sve-lib-tabs-wrap">
    <div ref="rowEl" class="sve-lib-tabs" @scroll="syncFade">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        :data-tab="tab.key"
        :class="{ 'is-on': tab.on }"
        @click="onPick(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div v-show="more" class="sve-lib-tabs-fade" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
.sve-lib-tabs-wrap {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
}
.sve-lib-tabs {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.sve-lib-tabs::-webkit-scrollbar {
  display: none;
}
.sve-lib-tabs-fade {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 36px;
  pointer-events: none;
  background: linear-gradient(to right, transparent, var(--theme-color-content-bg, Canvas));
}
button {
  all: unset;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: currentColor;
  opacity: 0.7;
  font-weight: 500;
  white-space: nowrap;
  flex: 0 0 auto;
}
button.is-on {
  background: rgba(128, 128, 128, 0.2);
  font-weight: 600;
  opacity: 1;
}
</style>
