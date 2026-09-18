<script setup>
import { computed } from 'vue';
import { perfUi as ui, perfRows as rows, psiUi as psi, serverUi as server, editorUi as editor } from '../perf/store.js';

defineProps({
  title: { type: String, default: '' },
  withChrome: { type: Boolean, default: false },
});

/**
 * The count on a tab is the reason to open it — and only once the page has
 * actually been read. Before that the tabs stay bare rather than claiming a
 * page has nothing in it.
 */
const badges = computed(() => ({
  images: ui.state === 'done' && ui.found.images ? ui.found.images : 0,
  files: ui.state === 'done' && ui.found.files ? ui.found.files : 0,
}));

const visibleFiles = computed(() =>
  rows.picked ? rows.files.filter((row) => row.kind === rows.picked) : rows.files
);
</script>

<template>
  <div class="sve-perf">
    <div v-if="withChrome" class="sve-pane-bar" data-sve-pane-bar>
      <div data-sve-right-title>{{ title }}</div>
      <div data-sve-right-actions>
        <button type="button" data-sve-right-pin aria-pressed="false"></button>
        <button type="button" data-sve-close aria-label="Close">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>

    <div class="sve-perf-tabs">
      <button
        v-for="tab in ui.tabs"
        :key="tab.key"
        type="button"
        :data-tab="tab.key"
        :class="{ 'is-on': ui.tab === tab.key }"
        @click="ui.onTab?.(tab.key)"
      >
        {{ tab.label }}
        <span v-if="badges[tab.key]" class="sve-perf-tab-badge">{{ badges[tab.key] }}</span>
      </button>
    </div>

    <div v-if="ui.tab === 'server'" class="sve-perf-body">
      <div v-if="server.state === 'running'" class="sve-perf-wait">
        <span class="sve-perf-spin" aria-hidden="true"></span>
        <span>{{ server.message }}</span>
      </div>

      <div v-else-if="server.state === 'error'" class="sve-perf-wait sve-perf-error">
        <span>{{ server.message }}</span>
        <button type="button" class="sve-perf-run" @click="server.onRun?.()">{{ server.runLabel }}</button>
      </div>

      <template v-else-if="server.state === 'done'">
        <div class="sve-perf-kvs">
          <div class="sve-perf-kv" :data-level="server.level">
            <span class="sve-perf-kv-label">{{ server.url }}</span>
            <span class="sve-perf-kv-value">{{ server.total }}</span>
          </div>
          <div v-for="row in server.split" :key="row.key" class="sve-perf-kv" :data-level="row.level">
            <span class="sve-perf-kv-label">{{ row.label }}</span>
            <span class="sve-perf-kv-value">{{ row.value }}</span>
          </div>
        </div>

        <div class="sve-perf-section">
          <div class="sve-perf-section-title">{{ server.rowsTitle }}</div>
          <div class="sve-perf-list">
            <div
              v-for="row in server.rows"
              :key="row.key"
              class="sve-perf-row is-static"
              :data-level="row.level"
            >
              <span class="sve-perf-tag">{{ row.tag }}</span>
              <span class="sve-perf-rowbody">
                <span class="sve-perf-title">{{ row.title }}</span>
                <span class="sve-perf-help">{{ row.help }}</span>
              </span>
            </div>
          </div>
          <div class="sve-perf-help">{{ server.renders }}</div>
        </div>

        <ul class="sve-perf-notes">
          <li>{{ server.note }}</li>
        </ul>

        <button type="button" class="sve-perf-run" @click="server.onRun?.()">{{ server.runLabel }}</button>
      </template>

      <div v-else class="sve-perf-wait">
        <span>{{ server.hint }}</span>
        <button type="button" class="sve-perf-run" @click="server.onRun?.()">{{ server.runLabel }}</button>
      </div>
    </div>

    <div v-else-if="ui.tab === 'editor'" class="sve-perf-body">
      <div v-if="editor.state !== 'live'" class="sve-perf-wait">
        <span class="sve-perf-spin" aria-hidden="true"></span>
        <span>{{ editor.hint }}</span>
      </div>

      <template v-else>
        <div class="sve-perf-kvs">
          <div v-for="metric in editor.metrics" :key="metric.key" class="sve-perf-kv" :data-level="metric.level">
            <span class="sve-perf-kv-label">{{ metric.label }}</span>
            <span class="sve-perf-kv-value">{{ metric.value }}</span>
          </div>
        </div>

        <div v-if="editor.unsupported" class="sve-perf-help">{{ editor.unsupported }}</div>

        <ul class="sve-perf-notes">
          <li>{{ editor.note }}</li>
        </ul>
      </template>
    </div>

    <div v-else-if="ui.tab === 'psi'" class="sve-perf-body">
      <div class="sve-perf-strategy">
        <button
          v-for="item in psi.strategies"
          :key="item.key"
          type="button"
          :class="{ 'is-on': psi.strategy === item.key }"
          @click="psi.onStrategy?.(item.key)"
        >{{ item.label }}</button>
      </div>

      <div v-if="psi.state === 'running'" class="sve-perf-wait">
        <span class="sve-perf-spin" aria-hidden="true"></span>
        <span>{{ psi.message }}</span>
      </div>

      <div v-else-if="psi.state === 'local'" class="sve-perf-wait">
        <span>{{ psi.message }}</span>
      </div>

      <div v-else-if="psi.state === 'error'" class="sve-perf-wait sve-perf-error">
        <span>{{ psi.message }}</span>
        <button type="button" class="sve-perf-run" @click="psi.onRun?.()">{{ psi.runLabel }}</button>
      </div>

      <template v-else-if="psi.state === 'done'">
        <div class="sve-perf-score" :data-grade="psi.grade">
          <span class="sve-perf-score-n">{{ psi.score === null ? '–' : psi.score }}</span>
          <span class="sve-perf-score-side">
            <span class="sve-perf-score-label">{{ psi.gradeLabel }}</span>
            <span class="sve-perf-score-url">{{ psi.hint }}</span>
          </span>
        </div>

        <div class="sve-perf-kvs">
          <div v-for="row in psi.lab" :key="row.key" class="sve-perf-kv" :data-level="row.level">
            <span class="sve-perf-kv-label">{{ row.label }}</span>
            <span class="sve-perf-kv-value">{{ row.value }}</span>
          </div>
        </div>

        <div class="sve-perf-section">
          <div class="sve-perf-section-title">{{ psi.fieldTitle }}</div>
          <div v-if="!psi.field.length" class="sve-perf-help">{{ psi.fieldEmpty }}</div>
          <div v-else class="sve-perf-kvs">
            <div v-for="row in psi.field" :key="row.key" class="sve-perf-kv" :data-level="row.level">
              <span class="sve-perf-kv-label">{{ row.label }}</span>
              <span class="sve-perf-kv-value">{{ row.value }}</span>
            </div>
          </div>
          <div v-if="psi.fieldNote" class="sve-perf-help">{{ psi.fieldNote }}</div>
        </div>

        <div v-if="psi.opportunities.length" class="sve-perf-section">
          <div class="sve-perf-section-title">{{ psi.opportunitiesTitle }}</div>
          <div
            v-for="row in psi.opportunities"
            :key="row.key"
            class="sve-perf-row is-static"
            :data-level="row.level"
          >
            <span class="sve-perf-tag">{{ row.time }}</span>
            <span class="sve-perf-rowbody">
              <span class="sve-perf-title">{{ row.label }}</span>
              <span class="sve-perf-help">{{ row.help }}</span>
            </span>
          </div>
        </div>

        <button type="button" class="sve-perf-run" @click="psi.onRun?.()">{{ psi.runLabel }}</button>
      </template>

      <div v-else class="sve-perf-wait">
        <span>{{ psi.hint }}</span>
        <button type="button" class="sve-perf-run" @click="psi.onRun?.()">{{ psi.runLabel }}</button>
      </div>
    </div>

    <div v-else-if="ui.state === 'running'" class="sve-perf-wait">
      <span class="sve-perf-spin" aria-hidden="true"></span>
      <span>{{ ui.message }}</span>
    </div>

    <div v-else-if="ui.state === 'error'" class="sve-perf-wait sve-perf-error">
      <span>{{ ui.message }}</span>
      <button type="button" class="sve-perf-run" @click="ui.onRun?.()">{{ ui.runLabel }}</button>
    </div>

    <template v-else-if="ui.state === 'done'">
      <div v-if="ui.tab === 'summary'" class="sve-perf-body">
        <div class="sve-perf-score" :data-grade="ui.grade">
          <span class="sve-perf-score-n">{{ ui.score }}</span>
          <span class="sve-perf-score-side">
            <span class="sve-perf-score-label">{{ ui.gradeLabel }}</span>
            <span class="sve-perf-score-url">{{ ui.url }}</span>
          </span>
        </div>

        <div class="sve-perf-metrics">
          <div v-for="metric in ui.metrics" :key="metric.key" class="sve-perf-metric" :data-level="metric.level">
            <span class="sve-perf-metric-label">{{ metric.label }}</span>
            <span class="sve-perf-metric-value">{{ metric.value }}</span>
            <span v-if="metric.note" class="sve-perf-metric-note">{{ metric.note }}</span>
          </div>
        </div>

        <div class="sve-perf-bars">
          <div v-for="bar in ui.bars" :key="bar.key" class="sve-perf-bar">
            <span class="sve-perf-bar-label">{{ bar.label }}</span>
            <span class="sve-perf-bar-track"><i :style="{ width: bar.share + '%' }"></i></span>
            <span class="sve-perf-bar-value">{{ bar.text }}</span>
          </div>
        </div>

        <ul class="sve-perf-notes">
          <li v-for="(note, i) in ui.notes" :key="i">{{ note }}</li>
        </ul>

        <button type="button" class="sve-perf-run" @click="ui.onRun?.()">{{ ui.runLabel }}</button>
      </div>

      <div v-else-if="ui.tab === 'images'" class="sve-perf-body">
        <div class="sve-perf-list">
          <div v-if="!rows.images.length" class="sve-perf-empty">{{ rows.emptyImages }}</div>
          <button
            v-for="row in rows.images"
            :key="row.key"
            type="button"
            class="sve-perf-row"
            :data-level="row.level"
            :aria-current="rows.active === row.key ? 'true' : 'false'"
            :title="row.tip"
            @click="rows.onJump?.(row)"
          >
            <span class="sve-perf-tag">{{ row.tag }}</span>
            <span class="sve-perf-rowbody">
              <span class="sve-perf-title">{{ row.title }}</span>
              <span class="sve-perf-help">{{ row.help }}</span>
            </span>
          </button>
        </div>
      </div>

      <div v-else class="sve-perf-body">
        <div v-if="rows.groups.length > 1" class="sve-perf-groups">
          <button
            v-for="chip in rows.groups"
            :key="chip.key || '__all'"
            type="button"
            :class="{ 'is-on': chip.key === rows.picked }"
            @click="rows.onGroup?.(chip.key)"
          >
            {{ chip.label }}
          </button>
        </div>

        <div class="sve-perf-list">
          <div v-if="!visibleFiles.length" class="sve-perf-empty">{{ rows.emptyFiles }}</div>
          <button
            v-for="row in visibleFiles"
            :key="row.key"
            type="button"
            class="sve-perf-row"
            :data-level="row.level"
            :title="row.tip"
            @click="rows.onJump?.(row)"
          >
            <span class="sve-perf-tag">{{ row.tag }}</span>
            <span class="sve-perf-rowbody">
              <span class="sve-perf-title">{{ row.title }}</span>
              <span class="sve-perf-help">{{ row.help }}</span>
            </span>
          </button>
        </div>
      </div>
    </template>

    <div v-else class="sve-perf-wait">
      <span>{{ ui.hint }}</span>
      <button type="button" class="sve-perf-run" @click="ui.onRun?.()">{{ ui.runLabel }}</button>
    </div>
  </div>
</template>
