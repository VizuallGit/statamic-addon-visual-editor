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
  /**
   * The class typed text would write, or '' when it is none. With it, the
   * text is previewed while no row is marked and Enter writes it; without
   * it, Enter picks a row only.
   */
  free: { type: Function, default: null },
  /**
   * The own-value mode (with `free` and `labels`): the site's variables to
   * reach for (`{ name, color }`, tw-families.js `ownVariables`), the mode's
   * words (`ownValueLabels`), and the CSS a typed value comes to.
   */
  vars: { type: Array, default: () => [] },
  labels: { type: Object, default: null },
  cssOf: { type: Function, default: null },
});

/** The CSS functions a value is built with, in the order they are reached for. */
const FUNCTIONS = ['calc', 'clamp', 'min', 'max', 'var'];

const typed = ref('');
const input = ref(null);
const rowsEl = ref(null);

/**
 * Search the list, or write a value of one's own (the owner, 7 Nov 2026).
 * The second is the same field, lit, with the functions and the site's
 * variables to hand instead of the scale. Only where a typed value can be
 * written at all.
 */
const canCustom = computed(() => !!(props.free && props.labels));
const custom = ref(false);

/** Where the caret stands in the field: suggestions are for the word under it. */
const caret = ref(0);

/** Which row the arrows are on. -1 is none, and Enter then picks the only match, if there is one. */
const cursor = ref(-1);

/** Keyboard and mouse both move the marker, and they fight — see TwAddClass. */
const keys = ref(false);

const query = computed(() => typed.value.trim().toLowerCase());

const rows = computed(() =>
  query.value
    ? props.options.filter((option) => String(option.label).toLowerCase().includes(query.value))
    : props.options
);

const typedClass = computed(() => (props.free && typed.value.trim() ? props.free(typed.value.trim()) || '' : ''));

/** The text before the caret, and the word it ends in — `cl`, `--spa`. */
const before = computed(() => typed.value.slice(0, caret.value));
const word = computed(() => /[A-Za-z0-9_-]*$/.exec(before.value)[0]);
const inVar = computed(() => /var\(\s*[A-Za-z0-9_-]*$/.test(before.value));

function varRows(q) {
  const needle = String(q || '')
    .replace(/^-+/, '')
    .toLowerCase();

  return props.vars
    .filter((one) => !needle || one.name.slice(2).toLowerCase().includes(needle))
    .slice(0, 60)
    .map((one) => ({ hint: 'var', label: one.name, color: one.color }));
}

function fnRows(q) {
  const needle = String(q || '').toLowerCase();

  return needle && /^[a-z]/.test(needle)
    ? FUNCTIONS.filter((fn) => fn.startsWith(needle)).map((fn) => ({ hint: 'fn', fn, label: `${fn}()` }))
    : [];
}

/**
 * What the own-value mode offers under the field: inside `var(` or after
 * `--`, the site's variables; a word that begins a function, the function;
 * and where a value can start — empty, after `(`, `,` or a space — the
 * variables again, as the palette there is to build from.
 */
const hints = computed(() => {
  if (!custom.value) {
    return [];
  }

  if (inVar.value || word.value.startsWith('-')) {
    return varRows(word.value);
  }

  const fns = fnRows(word.value);

  if (fns.length) {
    return fns;
  }

  return !word.value && /(^|[(,\s*+/-])$/.test(before.value) ? varRows('') : [];
});

/**
 * The rows on screen. Searching, a word that begins a function comes first —
 * picking it turns to the own-value mode with the function written — then
 * the scale.
 */
const items = computed(() => {
  if (custom.value) {
    return hints.value;
  }

  const fns = canCustom.value && query.value.length >= 2 ? fnRows(query.value) : [];

  return [...fns, ...rows.value];
});

const previewed = computed(() => {
  if (custom.value) {
    return typedClass.value;
  }

  const row = cursor.value >= 0 ? items.value[cursor.value] : null;

  return row ? (row.hint ? '' : row.label || '') : typedClass.value;
});

/**
 * What the typed value writes, in CSS — or that it writes nothing. Not while
 * hints stand under the field: half a value (`--size-3`) is a word being
 * finished, not a mistake.
 */
const outcome = computed(() => {
  if (!custom.value || !typed.value.trim() || hints.value.length) {
    return null;
  }

  if (!typedClass.value) {
    return { bad: true, text: props.labels?.invalid || '' };
  }

  return { bad: false, text: props.cssOf?.(typedClass.value) || typedClass.value };
});

watch(previewed, (next, prev) => {
  if (next !== prev) {
    props.onPreview?.(next);
  }
});

// A `(` or a leading `--` is a value being written, not a search.
watch(typed, (text) => {
  if (!custom.value && canCustom.value && (text.includes('(') || text.trim().startsWith('--'))) {
    custom.value = true;
  }
});

watch(custom, () => {
  cursor.value = -1;
  void nextTick(() => input.value?.focus());
});

onUnmounted(() => props.onPreview?.(''));
onMounted(() => nextTick(() => input.value?.focus()));

function syncCaret() {
  caret.value = input.value?.selectionStart ?? typed.value.length;
}

function setCaret(at) {
  caret.value = at;
  void nextTick(() => {
    input.value?.focus();
    input.value?.setSelectionRange(at, at);
  });
}

function toggle() {
  custom.value = !custom.value;
  setCaret(typed.value.length);
}

/**
 * A hint into the field. A function replaces the word it was offered for
 * and leaves the caret between its brackets (`var(` goes straight to `--`);
 * a variable goes inside the `var(` it was typed in — closing it when
 * nothing does — or arrives as a whole `var(--…)`.
 */
function apply(hint) {
  if (!custom.value) {
    custom.value = true;
    typed.value = '';
    caret.value = 0;
  }

  const text = typed.value;
  const at = caret.value;
  const start = at - word.value.length;
  let insert;
  let land;

  if (hint.hint === 'fn') {
    insert = hint.fn === 'var' ? 'var(--)' : `${hint.fn}()`;
    land = start + (hint.fn === 'var' ? 6 : hint.fn.length + 1);
  } else if (inVar.value) {
    const closes = /^\s*\)/.test(text.slice(at));

    insert = closes ? hint.label : `${hint.label})`;
    land = start + insert.length;
  } else {
    insert = `var(${hint.label})`;
    land = start + insert.length;
  }

  typed.value = text.slice(0, start) + insert + text.slice(at);
  cursor.value = -1;
  setCaret(land);
}

/** A function from the row above the hints, written where the caret stands. */
function insertFunction(fn) {
  apply({ hint: 'fn', fn });
}

function move(step) {
  keys.value = true;

  const count = items.value.length;

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
  syncCaret();
}

function choose(item) {
  if (item.hint) {
    apply(item);
  } else {
    props.onPick(item.label);
  }
}

function submit() {
  const marked = cursor.value >= 0 ? items.value[cursor.value] : null;

  if (marked) {
    choose(marked);

    return;
  }

  if (custom.value) {
    if (typedClass.value) {
      props.onPick(typedClass.value);
    }

    return;
  }

  const only = !typedClass.value && rows.value.length === 1 ? rows.value[0] : null;

  if (only) {
    props.onPick(only.label);
  } else if (typedClass.value) {
    props.onPick(typedClass.value);
  }
}

/** Tab takes the marked hint, or the first one — the quick way through `cl` → `clamp(`. */
function tab(event) {
  if (!custom.value || !hints.value.length) {
    return;
  }

  event.preventDefault();
  apply(hints.value[cursor.value >= 0 ? cursor.value : 0]);
}
</script>

<template>
  <div v-if="title" data-sve-tw-menu-title>{{ title }}</div>
  <div
    v-if="searchPlaceholder"
    data-sve-tw-search
    :data-custom="custom ? '' : undefined"
    :style="custom ? { borderColor: '#3858e9', background: 'rgba(56,88,233,.16)' } : null"
  >
    <svg
      v-if="!custom"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.4"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
    <span v-else data-sve-tw-fx aria-hidden="true">ƒx</span>
    <input
      ref="input"
      data-sve-tw-filter-input
      v-model="typed"
      type="text"
      spellcheck="false"
      autocomplete="off"
      :placeholder="custom ? labels?.placeholder : searchPlaceholder"
      :aria-label="custom ? labels?.placeholder : searchPlaceholder"
      @input="reset"
      @click="syncCaret"
      @keyup="syncCaret"
      @select="syncCaret"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.enter.prevent="submit"
      @keydown.tab="tab"
      @keydown.escape.stop
    />
    <!-- Search the list, or write a value of one's own: lit while writing. -->
    <button
      v-if="canCustom"
      type="button"
      data-sve-tw-mode
      :aria-pressed="custom ? 'true' : 'false'"
      :title="custom ? labels.list : labels.custom"
      :aria-label="custom ? labels.list : labels.custom"
      @mousedown.prevent
      @click.prevent.stop="toggle"
      >ƒx</button
    >
  </div>
  <template v-if="custom">
    <div data-sve-tw-fns :aria-label="labels.functions">
      <button
        v-for="fn in FUNCTIONS"
        :key="fn"
        type="button"
        data-sve-tw-fn
        @mousedown.prevent
        @click.prevent.stop="insertFunction(fn)"
        >{{ fn }}()</button
      >
    </div>
    <div v-if="outcome" data-sve-tw-outcome :data-bad="outcome.bad ? '' : undefined">{{ outcome.text }}</div>
    <div v-if="hints.length && hints[0].hint === 'var'" data-sve-tw-hints-title>{{ labels.variables }}</div>
  </template>
  <div ref="rowsEl" data-sve-tw-menu-list @mousemove="keys = false">
    <button
      v-for="(item, index) in items"
      :key="(item.hint || 'row') + item.label"
      type="button"
      data-sve-tw-option
      :data-active="item.active ? '' : undefined"
      :data-cursor="index === cursor ? '' : undefined"
      :data-hint="item.hint || undefined"
      :title="item.css || item.label"
      @mouseenter="hover(index)"
      @mousedown="item.hint ? $event.preventDefault() : null"
      @click.prevent.stop="choose(item)"
    >
      <span data-sve-tw-tick>{{ item.active ? '✓' : item.hint === 'fn' ? 'ƒ' : '' }}</span>
      <span v-if="item.color" data-sve-tw-dot :style="{ background: item.color }"></span>
      <span data-sve-tw-label>{{ item.label }}</span>
    </button>
  </div>
  <button type="button" data-sve-tw-remove @click.prevent.stop="onRemove()">
    <span data-sve-tw-tick>✕</span>{{ removeLabel }}
  </button>
</template>

<style scoped>
/* The switch beside the field: quiet while searching, lit while writing. */
[data-sve-tw-mode] {
  all: unset;
  flex: none;
  box-sizing: border-box;
  display: inline-grid;
  place-items: center;
  min-width: 1.75rem;
  height: 1.5rem;
  padding: 0 0.35rem;
  border-radius: 0.35rem;
  cursor: pointer;
  font:
    italic 600 0.6875rem/1 ui-serif,
    Georgia,
    serif;
  opacity: 0.6;
}
[data-sve-tw-mode]:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}
[data-sve-tw-mode][aria-pressed='true'] {
  opacity: 1;
  background: #3858e9;
  color: #fff;
}
[data-sve-tw-fx] {
  flex: none;
  font:
    italic 600 0.6875rem/1 ui-serif,
    Georgia,
    serif;
  color: #93a8ff;
}
/* The functions a value is built with, one press each. */
[data-sve-tw-fns] {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin: 0 0 0.45rem;
}
[data-sve-tw-fn] {
  all: unset;
  box-sizing: border-box;
  padding: 0.25em 0.55em;
  border-radius: 0.35em;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  font:
    0.6875rem/1.4 ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    monospace;
}
[data-sve-tw-fn]:hover {
  background: #3858e9;
  color: #fff;
}
/* What the value comes to — or, in amber, that it comes to nothing. */
[data-sve-tw-outcome] {
  margin: 0 0 0.45rem;
  padding: 0.4em 0.55em;
  border-radius: 0.4em;
  background: rgba(255, 255, 255, 0.05);
  font:
    0.6875rem/1.4 ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    monospace;
  overflow-wrap: anywhere;
  opacity: 0.85;
}
[data-sve-tw-outcome][data-bad] {
  background: rgba(240, 179, 126, 0.12);
  color: #f0b37e;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
[data-sve-tw-hints-title] {
  padding: 0.1em 0.2em 0.35em;
  opacity: 0.55;
  font-size: 0.6875rem;
}
</style>
