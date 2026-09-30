<script setup>
defineProps({
  title: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  noPreview: { type: String, required: true },
  canDelete: { type: Boolean, default: false },
  onDelete: { type: Function, default: null },
});
</script>

<template>
  <div class="sve-lib-card">
    <div class="sve-lib-card__preview">
      <img v-if="imageUrl" :src="imageUrl" alt="">
      <div v-else class="sve-lib-card__empty">{{ noPreview }}</div>
    </div>
    <div class="sve-lib-card__bar">
      <div data-sve-card-title>{{ title }}</div>
      <button
        v-if="canDelete"
        type="button"
        class="sve-lib-card__del"
        @pointerdown.stop
        @click.stop="onDelete?.()"
      >
        <!-- The same trash the HTML tree's rows carry. -->
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.sve-lib-card {
  cursor: grab;
  display: inline-block;
  width: 100%;
  break-inside: avoid;
  margin: 0 0 12px;
  border: 1px solid rgba(128, 128, 128, 0.25);
  border-radius: 10px;
  overflow: hidden;
  background: rgba(128, 128, 128, 0.05);
  user-select: none;
  vertical-align: top;
}
.sve-lib-card:hover {
  border-color: var(--theme-color-primary, #4f46e5);
}
.sve-lib-card__preview {
  width: 100%;
  background: rgba(128, 128, 128, 0.12);
  pointer-events: none;
}
img {
  width: 100%;
  height: auto;
  display: block;
}
.sve-lib-card__empty {
  width: 100%;
  aspect-ratio: 3 / 1;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.4;
  font-size: 12px;
}
.sve-lib-card__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
}
[data-sve-card-title] {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sve-lib-card__del {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  opacity: 0.55;
  transition: opacity 0.12s, color 0.12s;
}
.sve-lib-card__del:hover {
  opacity: 1;
  color: #dc2626;
}
.sve-lib-card__del svg {
  display: block;
  pointer-events: none;
}
</style>
