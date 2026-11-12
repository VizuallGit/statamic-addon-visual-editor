<script setup>
/**
 * The tag menu (tw-classes.js `tagMenuProps`): the tags this element may become
 * (lib/tag-choices.js), searched, and last Custom — a tag name typed by hand.
 * Enter in the search takes a row, never the typed words: what is not on the
 * list goes through Custom, where `check` may refuse it and says why.
 */
import { computed, nextTick, onMounted, ref } from 'vue';

const props = defineProps({
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  customLabel: { type: String, default: '' },
  customPlaceholder: { type: String, default: '' },
  current: { type: String, default: '' },
  tags: { type: Array, default: () => [] },
  /** A name typed under Custom → why it cannot be, or ''. No check, no Custom. */
  check: { type: Function, default: null },
  onPick: { type: Function, required: true },
});

const typed = ref('');
const input = ref(null);
const cursor = ref(-1);
const keys = ref(false);
const custom = ref(false);
const refused = ref('');

const query = computed(() => typed.value.trim().toLowerCase());
const rows = computed(() => {
  if (!query.value) {
    return props.tags;
  }

  const hits = props.tags.filter((tag) => tag.includes(query.value));

  hits.sort((a, b) => (a.startsWith(query.value) ? 0 : 1) - (b.startsWith(query.value) ? 0 : 1));

  return hits;
});
/** The rows the arrows walk: the tags, then Custom. */
const count = computed(() => rows.value.length + (props.check ? 1 : 0));

onMounted(() => nextTick(() => input.value?.focus()));

function move(step) {
  keys.value = true;
  cursor.value = !count.value ? -1 : Math.min(Math.max(cursor.value + step, -1), count.value - 1);
}

function openCustom() {
  custom.value = true;
  refused.value = '';
  cursor.value = -1;
  nextTick(() => input.value?.focus());
}

function pickCustom() {
  const name = typed.value.trim().toLowerCase();
  const why = props.check?.(name) ?? '';

  refused.value = why;

  if (!why) {
    props.onPick(name);
  }
}

function submit() {
  if (custom.value) {
    pickCustom();

    return;
  }

  if (cursor.value === rows.value.length && props.check) {
    openCustom();

    return;
  }

  const picked = cursor.value >= 0 ? rows.value[cursor.value] : query.value ? rows.value[0] : '';

  if (picked) {
    props.onPick(picked);
  }
}
</script>

<template>
  <div data-sve-tw-search>
    <svg
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
    <input
      ref="input"
      data-sve-tw-add-input
      v-model="typed"
      type="text"
      spellcheck="false"
      autocomplete="off"
      :placeholder="custom ? customPlaceholder : placeholder"
      :aria-label="custom ? customLabel : label"
      :data-sve-tw-custom-input="custom ? '' : undefined"
      @input="
        cursor = -1;
        refused = '';
      "
      @keydown.down.prevent="custom || move(1)"
      @keydown.up.prevent="custom || move(-1)"
      @keydown.enter.prevent="submit"
      @keydown.escape.stop
    />
  </div>
  <p v-if="refused" data-sve-tw-note>{{ refused }}</p>
  <div v-if="!custom" @mousemove="keys = false">
    <button
      v-for="(tag, index) in rows"
      :key="tag"
      type="button"
      data-sve-tw-option
      :data-active="index === cursor || (cursor === -1 && tag === current) ? '' : undefined"
      @mouseenter="keys ? null : (cursor = index)"
      @click.prevent.stop="onPick(tag)"
    >
      <span data-sve-tw-tick>{{ tag === current ? '✓' : '' }}</span>
      <span data-sve-tw-label>&lt;{{ tag }}&gt;</span>
    </button>
    <button
      v-if="check"
      type="button"
      data-sve-tw-option
      data-sve-tw-custom
      :data-active="cursor === rows.length ? '' : undefined"
      @mouseenter="keys ? null : (cursor = rows.length)"
      @click.prevent.stop="openCustom"
    >
      <span data-sve-tw-tick></span>
      <span data-sve-tw-label>{{ customLabel }}</span>
    </button>
  </div>
</template>
