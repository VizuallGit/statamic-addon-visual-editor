<script setup>
import { commentsSidebar as ui } from '../comments/store.js';

function emptyText() {
  if (ui.mode) {
    return ui.filter === 'open'
      ? 'Ingen åbne kommentarer. Klik i preview for at tilføje en.'
      : 'Ingen kommentarer på siden endnu. Klik i preview for at tilføje en.';
  }

  return ui.filter === 'open'
    ? 'Ingen åbne kommentarer. Tryk på taleboblen for at skrive.'
    : 'Ingen kommentarer på siden endnu. Tryk på taleboblen for at skrive.';
}
</script>

<template>
  <div class="sve-comments">
    <div class="sve-comments__tabs">
      <button
        type="button"
        :class="{ 'is-active': ui.filter === 'open' }"
        @click="ui.onFilter?.('open')"
      >
        Åbne ({{ ui.openCount }})
      </button>
      <button
        type="button"
        :class="{ 'is-active': ui.filter === 'all' }"
        @click="ui.onFilter?.('all')"
      >
        Alle ({{ ui.allCount }})
      </button>
    </div>
    <div class="sve-comments__list">
      <div v-if="!ui.rows.length" class="sve-comments__empty">{{ emptyText() }}</div>
      <button
        v-for="row in ui.rows"
        :key="row.id"
        type="button"
        class="sve-comments__row"
        :class="{ 'is-active': row.active, 'is-resolved': row.resolved }"
        @click="ui.onReveal?.(row.id)"
      >
        <div class="sve-comments__meta">
          <span>{{ row.author }}</span>
          <span>{{ row.time }}</span>
        </div>
        <div class="sve-comments__where">{{ row.where }}</div>
        <div class="sve-comments__body">{{ row.snippet }}</div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.sve-comments {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
.sve-comments__tabs {
  display: flex;
  gap: 4px;
  padding: var(--sve-right-body-pad-block, 8px) 0 0;
  flex: 0 0 auto;
}
.sve-comments__tabs button {
  all: unset;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  background: rgba(128, 128, 128, 0.22);
}
.sve-comments__tabs button.is-active {
  font-weight: 600;
  background: var(--theme-color-primary, #4530d8);
  color: #fff;
}
.sve-comments__list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: var(--sve-right-body-pad-block, 8px) 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sve-comments__empty {
  padding: 24px 8px;
  text-align: center;
  opacity: 0.55;
  font-size: 12px;
  line-height: 1.45;
}
.sve-comments__row {
  all: unset;
  cursor: pointer;
  display: block;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.18);
  background: rgba(128, 128, 128, 0.08);
}
.sve-comments__row.is-active {
  border-color: rgba(69, 48, 216, 0.45);
  background: rgba(69, 48, 216, 0.08);
}
.sve-comments__row.is-resolved {
  opacity: 0.62;
}
.sve-comments__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}
.sve-comments__meta span:first-child {
  font-size: 11px;
  font-weight: 650;
}
.sve-comments__meta span:last-child {
  font-size: 10px;
  opacity: 0.55;
}
.sve-comments__where {
  font-size: 10px;
  opacity: 0.55;
  margin-bottom: 4px;
}
.sve-comments__body {
  font-size: 13px;
  line-height: 1.4;
}
</style>
