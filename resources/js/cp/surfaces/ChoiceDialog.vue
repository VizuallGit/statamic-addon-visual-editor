<script setup>
defineProps({
  title: { type: String, required: true },
  body: { type: String, default: '' },
  buttons: { type: Array, required: true },
  onPick: { type: Function, required: true },
  onClose: { type: Function, required: true },
});
</script>

<template>
  <div class="sve-dialog-overlay" @click="(e) => e.target === e.currentTarget && onClose()">
    <div class="sve-dialog" @click.stop>
      <div class="sve-dialog__title">{{ title }}</div>
      <div v-if="body" class="sve-dialog__body">{{ body }}</div>
      <div class="sve-dialog__actions">
        <button
          v-for="btn in buttons"
          :key="String(btn.value)"
          type="button"
          :class="btn.variant"
          @click="onPick(btn.value)"
        >
          {{ btn.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sve-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483600;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
.sve-dialog {
  width: 420px;
  max-width: 92vw;
  background: var(--theme-color-content-bg, #fff);
  color: currentColor;
  border-radius: 12px;
  padding: 22px;
}
.sve-dialog__title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
}
.sve-dialog__body {
  font-size: 13px;
  opacity: 0.7;
  line-height: 1.45;
  margin-bottom: 18px;
}
.sve-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}
button {
  all: unset;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
}
button.ghost {
  opacity: 0.7;
}
button.muted {
  background: rgba(128, 128, 128, 0.16);
  font-weight: 500;
}
button.primary {
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
  font-weight: 600;
}
button.danger {
  background: #dc2626;
  color: #fff;
  font-weight: 600;
}
</style>
