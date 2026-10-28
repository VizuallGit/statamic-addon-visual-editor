<script setup>
/**
 * The menu at a + on Build's canvas: Add's Layout and Basic tiles, opened at
 * the +, and what is picked goes in at that + — into the element when it
 * holds others, else after it, as Add's tab puts it (build-mode/add.js).
 * Grid opens its rows and columns here first (BuildGridPicker.vue). "All
 * elements" closes the menu onto Add's tab, which the + has already pointed
 * at the same place.
 *
 * Opened and closed by build-mode/quick-add.js, which also closes it on a
 * press outside, Esc, a scroll or a resize. It draws once hidden, reads its
 * own size, and stands under the + (over it when there is no room below).
 */
import { computed, nextTick, onMounted, provide, ref } from 'vue';
import BuildGridPicker from './BuildGridPicker.vue';
import { addGroups } from '../../build-mode/catalog.js';
import { tileLabel, tileMarkup, writeAt } from '../../build-mode/add.js';
import { ic, tileIcon } from '../../build-mode/icons.js';

const props = defineProps({
  port: { type: Object, required: true },
  path: { type: String, required: true },
  // The + in the Control Panel's coordinates: its centre and its top and bottom edges.
  at: { type: Object, required: true },
  onClose: { type: Function, required: true },
});

provide('sveBuild', props.port);

const port = props.port;
const QUICK = new Set(['layout', 'basic']);
const MARGIN = 8;
const GAP = 6;
const root = ref(null);
const grid = ref(false);
const pos = ref({ visibility: 'hidden', left: '0px', top: '0px' });

const groups = computed(() =>
  addGroups({ htmlTools: port.lists.htmlTools, divs: port.lists.divs, headings: port.lists.headings }).filter((group) => QUICK.has(group.id))
);
const gridEntry = computed(() => groups.value.flatMap((group) => group.items).find((item) => item.source === 'columns'));

function insert(markup) {
  writeAt(port, props.path, markup);
  props.onClose();
}

function pick(entry) {
  if (entry.source === 'columns') {
    grid.value = true;
    nextTick(place);

    return;
  }

  insert(tileMarkup(port, entry));
}

function back() {
  grid.value = false;
  nextTick(place);
}

/** Under the + when it fits, else over it; never past the window's edges. */
function place() {
  const el = root.value;

  if (!el) {
    return;
  }

  const win = el.ownerDocument.defaultView;
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  const left = Math.min(Math.max(MARGIN, props.at.x - width / 2), win.innerWidth - width - MARGIN);
  const below = props.at.bottom + GAP;
  const top = below + height <= win.innerHeight - MARGIN ? below : Math.max(MARGIN, props.at.top - GAP - height);

  pos.value = { left: `${left}px`, top: `${top}px` };
}

onMounted(place);
</script>

<template>
  <div ref="root" class="sve-build bm-quick" data-sve-build-quick :style="pos">
    <template v-if="!grid">
      <div v-for="group in groups" :key="group.id" class="bm-g">
        <h4>{{ port.t(`group_${group.id}`) }}</h4>
        <div class="bm-tiles">
          <button
            v-for="entry in group.items"
            :key="entry.id"
            type="button"
            class="bm-tile"
            :data-sve-build-quick-tile="entry.id"
            @click="pick(entry)"
          >
            <span v-html="tileIcon(entry, port.lists.htmlIcons, port.lists.toolIcons)"></span>
            <span>{{ tileLabel(port, entry) }}</span>
          </button>
        </div>
      </div>
      <button type="button" class="bm-quick-more" data-sve-build-quick-more @click="onClose()">{{ port.t('quick_more') }}</button>
    </template>

    <template v-else>
      <h3 class="bm-quick-head">
        <button type="button" class="bm-ib sm" :title="port.t('close')" :aria-label="port.t('close')" @click="back" v-html="ic('x')"></button>
        <span>{{ port.t('columns_title') }}</span>
      </h3>
      <BuildGridPicker @pick="(key, rows) => insert(tileMarkup(port, gridEntry, { structure: key, rows }))" />
    </template>
  </div>
</template>
