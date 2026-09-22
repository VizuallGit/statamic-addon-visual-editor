<script setup>
/**
 * A name for a class — and, when the caller hands in the site's classes, a
 * search among them: pick one that exists, or create one that does not. A
 * name the site already has is said so, in red, and Enter uses that one
 * rather than making a second.
 */
import { computed, nextTick, onMounted, ref } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  placeholder: { type: String, default: '' },
  initial: { type: String, default: '' },
  onAdd: { type: Function, required: true },
  // The site's classes: [{ name, detail }], detail = where it is defined.
  options: { type: Array, default: () => [] },
  onPick: { type: Function, default: null },
  // What to say when the typed name exists: (name) => '' | text.
  takenText: { type: Function, default: null },
  existingLabel: { type: String, default: '' },
  createLabel: { type: String, default: '' },
  // Escape: the caller closes the menu. Left out, Escape only stays in here.
  onClose: { type: Function, default: null },
});

const value = ref(props.initial || '');
const input = ref(null);

onMounted(() => nextTick(() => {
  input.value?.focus();
  input.value?.select();
}));

const typed = computed(() => value.value.trim().toLowerCase());
const matches = computed(() => {
  if (!props.options.length) {
    return [];
  }

  const q = typed.value;
  const starts = [];
  const contains = [];

  for (const option of props.options) {
    const name = option.name.toLowerCase();

    if (!q || name.startsWith(q)) {
      starts.push(option);
    } else if (name.includes(q)) {
      contains.push(option);
    }
  }

  return [...starts, ...contains].slice(0, 8);
});
const taken = computed(() => (props.takenText && typed.value ? props.takenText(value.value.trim()) : ''));

function submit() {
  const next = value.value.trim();

  if (!next) {
    input.value?.focus();

    return;
  }

  // A name the site already has is used, not made twice.
  if (taken.value && props.onPick) {
    props.onPick(next);

    return;
  }

  props.onAdd(next);
}
</script>

<template>
  <label data-sve-css-add-label>{{ label }}</label>
  <input
    ref="input"
    data-sve-css-add-input
    v-model="value"
    type="text"
    :placeholder="placeholder"
    @keydown.enter.prevent="submit"
    @keydown.escape.stop.prevent="onClose?.()"
  >
  <div v-if="taken" data-sve-css-add-hint>{{ taken }}</div>
  <template v-if="options.length">
    <div data-sve-css-add-existing>{{ existingLabel }}</div>
    <div data-sve-css-add-list>
      <button
        v-for="option in matches"
        :key="option.name"
        type="button"
        data-sve-css-add-option
        @mousedown.prevent
        @click.prevent.stop="onPick?.(option.name)"
      >
        <span data-sve-css-add-name>{{ option.name }}</span>
        <span data-sve-css-add-detail>{{ option.detail }}</span>
      </button>
      <div v-if="!matches.length" data-sve-css-add-none>—</div>
    </div>
    <button
      type="button"
      data-sve-css-add-create
      :disabled="!!taken || !typed"
      @mousedown.prevent
      @click.prevent.stop="submit"
    >{{ createLabel }}</button>
  </template>
</template>
