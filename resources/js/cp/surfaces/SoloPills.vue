<script setup>
defineProps({
  backId: { type: String, required: true },
  saveId: { type: String, required: true },
  label: { type: String, required: true },
  saveLabel: { type: String, default: '' },
  showSave: { type: Boolean, default: false },
  onBack: { type: Function, required: true },
  onSave: { type: Function, default: null },
});
</script>

<template>
  <button :id="backId" type="button" class="sve-solo-pill" @click="onBack">
    <span class="sve-solo-pill__chev">‹</span>
    <span data-sve-back-label>{{ label }}</span>
  </button>
  <button
    v-if="showSave"
    :id="saveId"
    type="button"
    class="sve-solo-pill"
    @click="onSave"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
    <span>{{ saveLabel }}</span>
  </button>
</template>

<style scoped>
.sve-solo-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
  height: 28px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;
  background: rgba(128, 128, 128, 0.16);
  color: currentColor;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
}
.sve-solo-pill:hover {
  background: rgba(128, 128, 128, 0.28);
}
.sve-solo-pill__chev {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  line-height: 1;
  font-weight: 600;
  transform: translateY(-1.5px);
}
</style>
