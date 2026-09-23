<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

const props = defineProps({
  title: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  emptyText: { type: String, default: '' },
  noSectionText: { type: String, default: '' },
  loopText: { type: String, default: '' },
  tabs: { type: Array, required: true },
  /** { section: [row], page: [group], site: [group] } — groups hold `items`. */
  data: { type: Object, required: true },
  onPick: { type: Function, required: true },
});

const typed = ref('');
const input = ref(null);
const tab = ref(props.tabs[0]?.id || 'section');
const rowsEl = ref(null);

/** Which row the arrows are on. -1 is none — Enter then does nothing, on purpose. */
const cursor = ref(-1);

/**
 * Scrolling the list slides a new row under a still mouse, which fires
 * `mouseenter` and drags the marker back. Hover is ignored from the first
 * arrow key until the mouse actually moves — same fix as the class search.
 */
const keys = ref(false);

const query = computed(() => typed.value.trim().toLowerCase());

/** Typing searches every tab at once: the tabs stop mattering, and none is lit. */
const searching = computed(() => !!query.value);

/**
 * Section is a flat list; page and site arrive grouped. One shape from here
 * on. While searching, every tab's rows are here under that tab's name, so a
 * hit says where it lives — nobody should have to guess which tab holds
 * `svg` before they can look for it.
 */
const groups = computed(() => {
  const shape = (id, label) => {
    const raw = props.data[id] || [];

    if (Array.isArray(raw) && raw.length && raw[0]?.items) {
      return raw.map((group) => ({
        ...group,
        tab: id,
        label: searching.value ? (group.label ? `${label} · ${group.label}` : label) : group.label,
      }));
    }

    return [{ handle: id, tab: id, label: searching.value ? label : '', items: raw, bare: !searching.value }];
  };

  if (!searching.value) {
    return shape(tab.value, '');
  }

  return props.tabs.flatMap((item) => shape(item.id, item.label));
});

const shown = computed(() => {
  const text = query.value;

  return groups.value
    .map((group) => ({
      ...group,
      items: (group.items || []).filter(
        (row) =>
          !text ||
          row.var.toLowerCase().includes(text) ||
          String(row.label || '').toLowerCase().includes(text) ||
          String(row.parent || '').toLowerCase().includes(text)
      ),
    }))
    .filter((group) => group.items.length);
});

/** The same rows the eye sees, in order — what the arrow keys walk. */
const flat = computed(() => shown.value.flatMap((group) => group.items.map((row) => ({ row, group }))));

const empty = computed(() => !flat.value.length);

onMounted(() => nextTick(() => input.value?.focus()));

function move(step) {
  keys.value = true;

  const count = flat.value.length;

  if (!count) {
    cursor.value = -1;

    return;
  }

  const next = cursor.value + step;

  cursor.value = next < 0 ? -1 : Math.min(next, count - 1);

  void nextTick(() => keepInView());
}

/**
 * Nudge only the box the rows sit in. `scrollIntoView` walks every scrollable
 * ancestor and drags the dock behind the menu along with it.
 */
function keepInView() {
  const el = rowsEl.value?.querySelector('[data-cursor]');

  if (!el) {
    return;
  }

  let box = el.parentElement;

  while (box && box.scrollHeight <= box.clientHeight) {
    box = box.parentElement;
  }

  if (!box) {
    return;
  }

  const top = el.offsetTop;
  const bottom = top + el.offsetHeight;

  if (top < box.scrollTop) {
    box.scrollTop = top;
  } else if (bottom > box.scrollTop + box.clientHeight) {
    box.scrollTop = bottom - box.clientHeight;
  }
}

function indexOf(row) {
  return flat.value.findIndex((item) => item.row === row);
}

function hover(row) {
  if (!keys.value) {
    cursor.value = indexOf(row);
  }
}

function submit() {
  const picked = cursor.value >= 0 ? flat.value[cursor.value] : null;

  if (picked) {
    props.onPick(picked.row, picked.group);
  }
}

function switchTo(id) {
  tab.value = id;
  typed.value = '';
  cursor.value = -1;
}
</script>

<template>
  <div data-sve-data-search>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
    <input
      ref="input"
      data-sve-data-input
      v-model="typed"
      type="text"
      :placeholder="placeholder"
      :aria-label="title"
      @input="cursor = -1"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.enter.prevent="submit"
      @keydown.escape.stop
    >
  </div>

  <div data-sve-data-tabs>
    <button
      v-for="item in tabs"
      :key="item.id"
      type="button"
      data-sve-data-tab
      :data-active="!searching && tab === item.id ? '' : undefined"
      @click.prevent.stop="switchTo(item.id)"
    >{{ item.label }}</button>
  </div>

  <div v-if="empty" data-sve-data-empty>
    {{ tab === 'section' && !(data.section || []).length ? noSectionText : emptyText }}
  </div>

  <div ref="rowsEl" @mousemove="keys = false">
    <template v-for="group in shown" :key="group.tab + '::' + group.handle">
      <div v-if="!group.bare" data-sve-data-group>{{ group.label }}</div>
      <button
        v-for="row in group.items"
        :key="group.tab + '::' + group.handle + '::' + row.var + '::' + (row.parent || '')"
        type="button"
        data-sve-data-option
        :data-cursor="indexOf(row) === cursor ? '' : undefined"
        :title="row.label"
        @mouseenter="hover(row)"
        @click.prevent.stop="onPick(row, group)"
      >
        <span data-sve-data-name>{{ row.var }}</span>
        <span v-if="row.parent" data-sve-data-parent>{{ row.parent }}</span>
        <span v-if="row.loop" data-sve-data-loop>{{ loopText }}</span>
        <span v-else-if="row.value" data-sve-data-value>{{ row.value }}</span>
      </button>
    </template>
  </div>
</template>
