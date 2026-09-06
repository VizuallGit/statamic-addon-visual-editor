<script setup>
import { paneUi as ui } from '../a11y/store.js';
</script>

<template>
  <div class="sve-a11y-pane">
    <div class="sve-a11y-hint">{{ ui.hint }}</div>

    <div v-if="ui.ready && ui.counts.length" class="sve-a11y-counts">
      <span
        v-for="count in ui.counts"
        :key="count.level"
        class="sve-a11y-count"
        :data-level="count.level"
        :title="count.label"
      >
        <i></i>{{ count.n }}
      </span>
      <button
        v-if="ui.showToggle"
        type="button"
        class="sve-a11y-toggle"
        :aria-pressed="ui.toggleOn"
        @click="ui.onToggle?.()"
      >
        {{ ui.toggleLabel }}
      </button>
    </div>

    <div class="sve-a11y-groups-wrap" :hidden="!ui.showGroups">
      <div class="sve-a11y-groups" data-sve-a11y-groups>
        <button
          v-for="chip in ui.groups"
          :key="chip.key || '__all'"
          type="button"
          :class="{ 'is-on': chip.on }"
          @click="ui.onGroup?.(chip.key)"
        >
          {{ chip.label }}
        </button>
      </div>
      <div class="sve-a11y-groups-fade" data-sve-a11y-groups-fade aria-hidden="true"></div>
    </div>

    <div class="sve-a11y-list">
      <div v-if="!ui.ready || !ui.rows.length" class="sve-a11y-empty">{{ ui.emptyText }}</div>

      <button
        v-for="row in ui.rows"
        :key="row.key"
        type="button"
        class="sve-a11y-row"
        :data-level="row.level"
        :aria-current="ui.active === row.key ? 'true' : 'false'"
        :title="row.tip"
        @click="ui.onJump?.(row.key)"
        @mouseenter="ui.onHover?.(row.key)"
        @mouseleave="ui.onHover?.('')"
      >
        <span class="sve-a11y-tag">{{ row.tag }}</span>
        <span class="sve-a11y-body">
          <span class="sve-a11y-title">{{ row.title }}</span>
          <span v-if="row.fg || row.help" class="sve-a11y-sub">
            <i v-if="row.fg" class="sve-a11y-swatch" :style="{ background: row.fg }"></i>
            <i v-if="row.bg" class="sve-a11y-swatch" :style="{ background: row.bg }"></i>
            <span class="sve-a11y-help">{{ row.help }}</span>
          </span>
        </span>
        <span v-if="row.n" class="sve-a11y-n">{{ row.n }}</span>
      </button>
    </div>
  </div>
</template>
