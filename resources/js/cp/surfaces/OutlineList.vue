<script setup>
import { outlineUi as ui } from '../outline/store.js';
</script>

<template>
  <div class="sve-outline-list">
    <p
      v-for="(notice, i) in ui.notices"
      :key="'n' + i"
      :data-sve-outline-note="notice.severity"
    >
      {{ notice.message }}
    </p>
    <div v-if="!ui.rows.length" class="sve-outline-empty">{{ ui.emptyText }}</div>
    <button
      v-for="row in ui.rows"
      :key="row.index"
      type="button"
      data-sve-outline-item
      :aria-current="row.current ? 'true' : 'false'"
      :data-sve-outline-warn="row.warn || undefined"
      :title="row.title"
      @click="ui.onJump?.(row.index)"
    >
      <span v-for="n in row.depth" :key="n" data-sve-outline-rail></span>
      <span data-sve-outline-branch></span>
      <span data-sve-outline-level>{{ row.level }}</span>
      <span data-sve-outline-text :data-sve-outline-blank="row.blank ? '' : undefined">{{ row.text }}</span>
      <span v-if="row.warn" data-sve-outline-flag>!</span>
    </button>
  </div>
</template>

<style scoped>
.sve-outline-empty {
  padding: 30px 6px;
  text-align: center;
  opacity: 0.55;
  font-size: 12px;
}
</style>
