<script setup>
import { treeUi as ui } from '../a11y/store.js';

const TWIST =
  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" '
  + 'stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
</script>

<template>
  <div class="sve-a11y-pane">
    <div class="sve-a11y-hint">{{ ui.hint }}</div>

    <div class="sve-a11y-counts">
      <button
        type="button"
        class="sve-a11y-toggle"
        :aria-pressed="ui.showAll"
        @click="ui.onToggleAll?.()"
      >{{ ui.showAllLabel }}</button>
    </div>

    <div class="sve-a11y-list">
      <div v-if="!ui.rows.length" class="sve-a11y-empty">{{ ui.emptyText }}</div>

      <div
        v-for="row in ui.rows"
        :key="row.path"
        class="sve-tree-row"
        :data-issue="row.issue || undefined"
        :aria-current="ui.active === row.path ? 'true' : 'false'"
        role="button"
        tabindex="0"
        :title="row.tip"
        :style="{ marginLeft: row.depth * 12 + 'px' }"
        @click="ui.onPick?.(row.path)"
        @keydown.enter.prevent="ui.onPick?.(row.path)"
        @keydown.space.prevent="ui.onPick?.(row.path)"
      >
        <button
          v-if="row.hasChildren"
          type="button"
          class="sve-tree-twist"
          :data-shut="row.shut ? '' : undefined"
          v-html="TWIST"
          @click.stop.prevent="ui.onTwist?.(row.path)"
        ></button>
        <span v-else class="sve-tree-twist-gap"></span>

        <span class="sve-tree-role">{{ row.role }}</span>
        <span v-if="row.name" class="sve-tree-name">{{ row.name }}</span>
        <span v-else-if="row.issue" class="sve-tree-missing">{{ row.missingLabel }}</span>
        <span class="sve-tree-tag">{{ row.tag }}</span>
      </div>

      <p v-if="ui.note" class="sve-a11y-empty">{{ ui.note }}</p>
    </div>
  </div>
</template>
