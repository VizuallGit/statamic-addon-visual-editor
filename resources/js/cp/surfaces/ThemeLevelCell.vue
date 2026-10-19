<template>
  <span
    class="sve-theme__input sve-theme__cell"
    :class="{ 'is-inherited': !value && inherit !== null, 'is-own': overridable && !!value }"
    :title="!value && inherit !== null ? inheritLabel : ''"
  >
    <span class="sve-theme__cell-value">{{ shown }}</span>
    <select :value="value" :aria-label="label" @change="onChange($event.target.value)">
      <option v-if="inherit !== null" value="">{{ inheritLabel }}</option>
      <option v-for="o in list" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
  </span>
</template>

<script setup>
/**
 * One cell of the heading levels: the value as a short word over a native
 * select (the list keeps the long labels). An empty value follows the
 * headings and shows their value, dimmed; a value of its own is teal.
 */
import { computed } from 'vue';

const props = defineProps({
  /** The level's own value; '' follows the headings. */
  value: { type: String, default: '' },
  /** What an empty value follows (shown dimmed), or null when there is nothing to follow. */
  inherit: { type: String, default: null },
  inheritLabel: { type: String, default: '' },
  /** `{ value, label, short }` — `short` is what the cell shows. */
  options: { type: Array, required: true },
  overridable: { type: Boolean, default: false },
  label: { type: String, default: '' },
  onChange: { type: Function, required: true },
});

/** A value the list does not have (written by hand in site.css) is still a choice. */
const list = computed(() => (props.value && !props.options.some((o) => o.value === props.value)
  ? [{ value: props.value, label: props.value, short: props.value }, ...props.options]
  : props.options));

const shown = computed(() => (props.value ? list.value.find((o) => o.value === props.value)?.short || props.value : props.inherit ?? ''));
</script>
