<script setup>
/**
 * The snippet picker: a search, the site's snippets, and the way to make one.
 *
 * Same box as Insert data (the `data-sve-data-*` attributes are styled under
 * `[data-sve-data-menu]` in dock/layout.js), with no tabs — a snippet is one
 * list — and a button at the foot that saves what the pane holds. A row says
 * which panes it fills, so a CSS-only carousel is told apart from a nav that
 * brings markup along.
 */
import { computed, nextTick, onMounted, ref } from 'vue';

const props = defineProps({
  title: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  emptyText: { type: String, default: '' },
  loadingText: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  /** [{ name, hint, html, css, js }] — the three booleans say which panes it fills. */
  rows: { type: Array, required: true },
  saveLabel: { type: String, required: true },
  onPick: { type: Function, required: true },
  onSave: { type: Function, required: true },
});

const typed = ref('');
const input = ref(null);
const rowsEl = ref(null);

/** Which row the arrows are on. -1 is none — Enter then does nothing, on purpose. */
const cursor = ref(-1);

/**
 * Scrolling the list slides a new row under a still mouse, which fires
 * `mouseenter` and drags the marker back. Hover is ignored from the first
 * arrow key until the mouse actually moves — same fix as the data picker.
 */
const keys = ref(false);

const query = computed(() => typed.value.trim().toLowerCase());

const shown = computed(() => {
  const text = query.value;

  return props.rows.filter(
    (row) => !text || row.name.toLowerCase().includes(text) || String(row.hint || '').toLowerCase().includes(text)
  );
});

onMounted(() => nextTick(() => input.value?.focus()));

/** `HTML · CSS` — the panes a pick writes to. */
function flags(row) {
  return ['html', 'css', 'js'].filter((part) => row[part]).map((part) => part.toUpperCase()).join(' · ');
}

function move(step) {
  keys.value = true;

  const count = shown.value.length;

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
  const box = rowsEl.value;

  if (!el || !box) {
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

function hover(index) {
  if (!keys.value) {
    cursor.value = index;
  }
}

function submit() {
  const picked = cursor.value >= 0 ? shown.value[cursor.value] : null;

  if (picked) {
    props.onPick(picked);
  }
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

  <div v-if="loading" data-sve-data-empty>{{ loadingText }}</div>
  <div v-else-if="!shown.length" data-sve-data-empty>{{ emptyText }}</div>

  <div ref="rowsEl" data-sve-data-rows @mousemove="keys = false">
    <button
      v-for="(row, index) in shown"
      :key="row.name"
      type="button"
      data-sve-data-option
      :data-cursor="index === cursor ? '' : undefined"
      :title="row.hint || row.name"
      @mouseenter="hover(index)"
      @click.prevent.stop="onPick(row)"
    >
      <span data-sve-data-name>{{ row.name }}</span>
      <span data-sve-data-parent>{{ flags(row) }}</span>
      <span v-if="row.hint" data-sve-data-value>{{ row.hint }}</span>
    </button>
  </div>

  <button
    type="button"
    data-sve-snippet-save
    @mousedown.prevent
    @click.prevent.stop="onSave"
  >{{ saveLabel }}</button>
</template>
