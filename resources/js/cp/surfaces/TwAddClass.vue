<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { twUi } from '../tailwind/store.js';

const props = defineProps({
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  sitePlaceholder: { type: String, default: '' },
  emptyText: { type: String, default: '' },
  offText: { type: String, default: '' },
  siteLabel: { type: String, default: '' },
  tailwindLabel: { type: String, default: '' },
  search: { type: Function, required: true },
  onAdd: { type: Function, required: true },
});

const typed = ref('');
const input = ref(null);
const tab = ref('tailwind');
const rowsEl = ref(null);

/**
 * Which suggestion the arrows are on. -1 is none, and that is the state the
 * list starts in on purpose: Enter then adds exactly what was typed, which is
 * the way out when the class you want is not in either list.
 */
const cursor = ref(-1);

/**
 * Keyboard and mouse both move the marker, and they fight.
 *
 * Scrolling the list slides a new row under a mouse that has not moved, which
 * fires `mouseenter` and drags the marker back to wherever the pointer sits.
 * So hover is ignored from the moment an arrow is used until the mouse really
 * moves again.
 */
const keys = ref(false);

const query = computed(() => typed.value.trim().toLowerCase());

/** The site's own names, flat: the folder they live in is not the point here. */
const site = computed(() => (twUi.siteClasses || [])
  .flatMap((group) => group.items)
  .filter((item) => !query.value || item.name.toLowerCase().includes(query.value)));

const tailwind = computed(() => props.search(typed.value));

const rows = computed(() => (tab.value === 'site' ? site.value : tailwind.value));
const hint = computed(() => (tab.value === 'site' ? props.sitePlaceholder : props.placeholder));

onMounted(() => nextTick(() => input.value?.focus()));

function nameOf(row) {
  return row?.name || row?.label || '';
}

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

/**
 * Nudge the menu's own scroll just enough to show the marked row.
 *
 * `scrollIntoView` walks every scrollable ancestor, so it moved the panel
 * behind the menu as well and the list looked like it jumped back to the top.
 * This touches one element: the box the rows sit in.
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

function hover(index) {
  if (!keys.value) {
    cursor.value = index;
  }
}

function reset() {
  cursor.value = -1;
}

/**
 * A class that is added hands the field back empty and focused.
 *
 * The menu stays open on purpose, and the next class is usually typed right
 * after: leaving the old query behind means reaching for the field and
 * clearing it by hand before every single one. The tab stays where it is.
 */
function add(value) {
  const name = String(value || '').trim();

  if (!name) {
    return;
  }

  props.onAdd(name);

  typed.value = '';
  cursor.value = -1;
  keys.value = false;

  void nextTick(() => input.value?.focus());
}

function submit() {
  const picked = cursor.value >= 0 ? rows.value[cursor.value] : null;

  add(picked ? nameOf(picked) : typed.value);
}
</script>

<template>
  <div data-sve-tw-search>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
    <input
      ref="input"
      data-sve-tw-add-input
      v-model="typed"
      type="text"
      :placeholder="hint"
      :aria-label="label"
      @input="reset"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.enter.prevent="submit"
      @keydown.escape.stop
    >
  </div>

  <div data-sve-tw-tabs>
    <button
      type="button"
      data-sve-tw-tab
      :data-active="tab === 'tailwind' ? '' : undefined"
      @click.prevent.stop="tab = 'tailwind'; reset()"
    >{{ tailwindLabel }}</button>
    <button
      type="button"
      data-sve-tw-tab
      :data-active="tab === 'site' ? '' : undefined"
      @click.prevent.stop="tab = 'site'; reset()"
    >{{ siteLabel }}</button>
  </div>

  <div v-if="!rows.length" data-sve-tw-add-empty>{{ emptyText }}</div>
  <div ref="rowsEl" @mousemove="keys = false">
    <button
      v-for="(row, index) in rows"
      :key="row.name || row.label"
      type="button"
      data-sve-tw-option
      :data-cursor="index === cursor ? '' : undefined"
      :data-active="index === cursor ? '' : undefined"
      :data-sve-tw-off="row.loaded === false ? '' : undefined"
      :title="row.loaded === false ? offText : (row.file || row.css)"
      @mouseenter="hover(index)"
      @click.prevent.stop="add(nameOf(row))"
    >
      <span v-if="row.color" data-sve-tw-dot :style="{ background: row.color }"></span>
      <span data-sve-tw-label>{{ row.name || row.label }}</span>
    </button>
  </div>
</template>
