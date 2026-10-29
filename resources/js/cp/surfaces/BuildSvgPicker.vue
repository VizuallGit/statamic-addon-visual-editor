<script setup>
/**
 * The site's SVGs as pictures to pick from: the folder set under Visual
 * Editor → SVG folder, the Site files panel's own (`port.svgs()`), grouped by
 * the folder each sits in under it, with a search once there are many.
 *
 * Add's SVG tile shows it in a popup (BuildSvgPopup.vue), Content for the
 * SVG picked (BuildContent.vue). A picture clicked is `pick`ed with the `src`
 * Statamic's `{{ svg }}` tag finds its file by.
 *
 * A picture is an <img> of the file as a data URL: an <img> runs no script
 * and loads nothing an SVG may carry. `currentColor` draws black in it, so
 * each sits on a light ground.
 */
import { computed, inject, onMounted, ref } from 'vue';
import { ic } from '../../build-mode/icons.js';

defineProps({
  /** The file the SVG picked draws: its picture is marked. */
  current: { type: String, default: '' },
});

const emit = defineEmits(['pick']);

const SEARCH_FROM = 13;

const port = inject('sveBuild');
const list = ref(null);
const failed = ref(false);
const query = ref('');

onMounted(() => {
  port.svgs().then(
    (data) => (list.value = data),
    () => (failed.value = true)
  );
});

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const q = computed(() => query.value.trim().toLowerCase());

const groups = computed(() => {
  const byFolder = new Map();

  for (const icon of list.value?.icons || []) {
    if (q.value && !`${icon.folder}/${icon.name}`.toLowerCase().includes(q.value)) {
      continue;
    }

    if (!byFolder.has(icon.folder)) {
      byFolder.set(icon.folder, []);
    }

    byFolder.get(icon.folder).push(icon);
  }

  // The folder itself first, then the folders under it.
  return [...byFolder]
    .sort(([a], [b]) => (a === '' ? -1 : b === '' ? 1 : a.localeCompare(b)))
    .map(([folder, icons]) => ({ folder, icons }));
});

const picture = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
</script>

<template>
  <div class="bm-svgs" data-sve-build-svgs>
    <p v-if="failed" class="bm-muted" data-sve-build-svgs-failed>{{ port.t('svg_failed') }}</p>
    <p v-else-if="!list" class="bm-muted">{{ port.t('svg_loading') }}</p>
    <p v-else-if="!list.icons.length" class="bm-note is-top" data-sve-build-svgs-none v-html="port.t('svg_none', { root: `<code>${esc(list.root)}</code>` })"></p>

    <template v-else>
      <label v-if="list.icons.length >= SEARCH_FROM" class="bm-search">
        <span v-html="ic('search')"></span>
        <input v-model="query" type="text" autocomplete="off" :placeholder="port.t('svg_search')" :aria-label="port.t('svg_search')" />
      </label>

      <div v-for="group in groups" :key="group.folder" class="bm-svg-g">
        <h4 v-if="groups.length > 1 || group.folder">{{ group.folder || list.root }}</h4>
        <div class="bm-svg-grid">
          <button
            v-for="icon in group.icons"
            :key="icon.src"
            type="button"
            class="bm-svg"
            :class="{ 'is-on': icon.src === current }"
            :title="icon.src"
            :aria-pressed="icon.src === current"
            :data-sve-build-svg="icon.src"
            @click="emit('pick', icon.src)"
          >
            <img v-if="icon.svg" :src="picture(icon.svg)" alt="" />
            <span v-else class="bm-svg-big" v-html="ic('svg')"></span>
            <span>{{ icon.name }}</span>
          </button>
        </div>
      </div>

      <p v-if="!groups.length" class="bm-muted">{{ port.t('none_found', { q: query }) }}</p>
    </template>
  </div>
</template>
