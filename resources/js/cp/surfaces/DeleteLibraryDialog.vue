<script setup>
import { deleteLibraryUi as ui } from '../library/delete-store.js';
</script>

<template>
  <div class="sve-dialog-overlay" @click="(e) => e.target === e.currentTarget && ui.onClose?.()">
    <div class="sve-dialog" @click.stop>
      <div class="sve-dialog__title">{{ ui.title }}</div>
      <div class="sve-dialog__body">
        <template v-if="ui.usages.length">
          <div v-for="(lead, i) in ui.leads" :key="i" class="sve-dialog__lead">{{ lead }}</div>
          <div class="sve-dialog__usage-head">{{ ui.usageHeading }}</div>
          <ul>
            <li v-for="(usage, i) in ui.usages" :key="i">
              <span class="sve-dialog__name">{{ usage.title }}</span>
              <span class="sve-dialog__where">{{ usage.where }}</span>
            </li>
          </ul>
        </template>
        <template v-else>{{ ui.body }}</template>
      </div>
      <div class="sve-dialog__actions">
        <button
          v-for="btn in ui.buttons"
          :key="btn.id"
          type="button"
          :class="btn.variant"
          @click="ui.onPick?.(btn.id)"
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
  padding: 20px;
}
.sve-dialog__title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
}
.sve-dialog__body {
  font-size: 13px;
  opacity: 0.75;
  line-height: 1.45;
  margin-bottom: 18px;
}
.sve-dialog__lead {
  margin-bottom: 10px;
}
.sve-dialog__usage-head {
  font-weight: 600;
  opacity: 0.9;
  margin-bottom: 4px;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 180px;
  overflow-y: auto;
}
li {
  display: flex;
  gap: 6px;
  align-items: baseline;
  padding: 3px 0;
  border-top: 1px solid rgba(128, 128, 128, 0.18);
}
.sve-dialog__name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sve-dialog__where {
  flex: 0 0 auto;
  opacity: 0.6;
  font-size: 12px;
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
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  opacity: 0.75;
}
button.primary {
  opacity: 1;
  font-weight: 600;
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
}
button.danger {
  opacity: 1;
  font-weight: 600;
  background: #dc2626;
  color: #fff;
}
</style>
