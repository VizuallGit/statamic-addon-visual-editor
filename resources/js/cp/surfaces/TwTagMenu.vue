<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

const props = defineProps({
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  current: { type: String, default: '' },
  tags: { type: Array, default: () => [] },
  onPick: { type: Function, required: true },
});

const typed = ref('');
const input = ref(null);
const cursor = ref(-1);
const keys = ref(false);

const query = computed(() => typed.value.trim().toLowerCase());
const rows = computed(() => {
  if (!query.value) {
    return props.tags;
  }

  const hits = props.tags.filter((tag) => tag.includes(query.value));

  hits.sort((a, b) => (a.startsWith(query.value) ? 0 : 1) - (b.startsWith(query.value) ? 0 : 1));

  return hits;
});

onMounted(() => nextTick(() => input.value?.focus()));

function move(step) {
  keys.value = true;

  const count = rows.value.length;

  cursor.value = !count ? -1 : Math.min(Math.max(cursor.value + step, -1), count - 1);
}

function submit() {
  const picked = cursor.value >= 0 ? rows.value[cursor.value] : typed.value.trim().toLowerCase();

  if (picked) {
    props.onPick(picked);
  }
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
      :placeholder="placeholder"
      :aria-label="label"
      @input="cursor = -1"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.enter.prevent="submit"
      @keydown.escape.stop
    >
  </div>
  <div @mousemove="keys = false">
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
  </div>
</template>
