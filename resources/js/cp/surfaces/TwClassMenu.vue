<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  title: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  removeLabel: { type: String, default: '' },
  onPick: { type: Function, required: true },
  onRemove: { type: Function, required: true },
  /** Told the row under the marker, and '' when there is none or the menu closes. */
  onPreview: { type: Function, default: null },
  /** With a placeholder the list gets a search field; without, it is the plain list. */
  searchPlaceholder: { type: String, default: '' },
});

const typed = ref('');
const input = ref(null);
const rowsEl = ref(null);

/** Which row the arrows are on. -1 is none, and Enter then picks the only match, if there is one. */
const cursor = ref(-1);

/** Keyboard and mouse both move the marker, and they fight — see TwAddClass. */
const keys = ref(false);

const query = computed(() => typed.value.trim().toLowerCase());

const rows = computed(() => (query.value
  ? props.options.filter((option) => String(option.label).toLowerCase().includes(query.value))
  : props.options));

const previewed = computed(() => (cursor.value >= 0 ? rows.value[cursor.value]?.label || '' : ''));

watch(previewed, (next, prev) => {
  if (next !== prev) {
    props.onPreview?.(next);
  }
});

onUnmounted(() => props.onPreview?.(''));
onMounted(() => nextTick(() => input.value?.focus()));

function move(step) {
  keys.value = true;

  const count = rows.value.length;

  if (!count) {
    cursor.value = -1;

    return;
  }

  const next = cursor.value + step;

  cursor.value = next < 0 ? -1 : Math.min(next, count - 1);

  void nextTick(() => keepInView());
}

/** Nudge the menu's own scroll just enough to show the marked row — one element, not every ancestor. */
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

  const top = el.offsetTop - box.offsetTop;
  const bottom = top + el.offsetHeight;

  if (top < box.scrollTop) {
    box.scrollTop = top;
  } else if (bottom > box.scrollTop + box.clientHeight) {
    box.scrollTop = bottom - box.clientHeight;
  }
}

function hover(index) {
  if (!keys.value) {
    cursor.value = index;
  }
}

function reset() {
  cursor.value = -1;
}

function submit() {
  const picked = cursor.value >= 0 ? rows.value[cursor.value] : rows.value.length === 1 ? rows.value[0] : null;

  if (picked) {
    props.onPick(picked.label);
  }
}
</script>

<template>
  <div v-if="title" data-sve-tw-menu-title>{{ title }}</div>
  <div v-if="searchPlaceholder" data-sve-tw-search>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
    <input
      ref="input"
      data-sve-tw-filter-input
      v-model="typed"
      type="text"
      :placeholder="searchPlaceholder"
      :aria-label="searchPlaceholder"
      @input="reset"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.enter.prevent="submit"
      @keydown.escape.stop
    >
  </div>
  <div ref="rowsEl" data-sve-tw-menu-list @mousemove="keys = false">
    <button
      v-for="(option, index) in rows"
      :key="option.label"
      type="button"
      data-sve-tw-option
      :data-active="option.active ? '' : undefined"
      :data-cursor="index === cursor ? '' : undefined"
      :title="option.css"
      @mouseenter="hover(index)"
      @click.prevent.stop="onPick(option.label)"
    >
      <span data-sve-tw-tick>{{ option.active ? '✓' : '' }}</span>
      <span v-if="option.color" data-sve-tw-dot :style="{ background: option.color }"></span>
      <span data-sve-tw-label>{{ option.label }}</span>
    </button>
  </div>
  <button type="button" data-sve-tw-remove @click.prevent.stop="onRemove()">
    <span data-sve-tw-tick>✕</span>{{ removeLabel }}
  </button>
</template>
