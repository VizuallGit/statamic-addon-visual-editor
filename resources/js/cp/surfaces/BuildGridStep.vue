<script setup>
/**
 * One of a grid's numbers in Style — its columns or rows, a child's span or
 * start — as a field with − and +: typed, stepped, or reset to what a wider
 * size gives. `hit` is the class it reads at the size picked (grid.js
 * `readGrid`: `{ name, n, inherited }`), `seen` the number the canvas lays
 * out when no class says one. Every write is the port's `setGridAt` on
 * `path`, so it lands at the size and state picked.
 */
import { computed, inject } from 'vue';
import BuildFieldReset from './BuildFieldReset.vue';
import { ic } from '../../build-mode/icons.js';

const props = defineProps({
  path: { type: String, required: true },
  part: { type: String, required: true },
  label: { type: String, required: true },
  letter: { type: String, default: '' },
  hit: { type: Object, default: null },
  seen: { type: Number, default: null },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 0 },
  /** Nothing set is the browser's own placing: "auto", not the number it lands on. */
  auto: { type: Boolean, default: false },
});

const port = inject('sveBuild');
const own = computed(() => (props.hit && !props.hit.inherited ? props.hit : null));
const now = computed(() => props.hit?.n ?? props.seen ?? props.min);
const placeholder = computed(() => (props.auto ? 'auto' : props.seen != null ? String(props.seen) : ''));

function set(n) {
  port.setGridAt(props.path, { [props.part]: Math.max(props.min, props.max ? Math.min(props.max, Math.round(n)) : Math.round(n)) });
}

function typed(event) {
  const text = event.target.value.trim();
  const n = Number(text);

  if (!text && own.value) {
    port.setGridAt(props.path, { [props.part]: null });
  } else if (text && Number.isFinite(n)) {
    set(n);
  } else {
    event.target.value = props.hit?.n ?? '';
  }
}
</script>

<template>
  <label class="fg-field fg-step" :title="label">
    <span class="fg-pre is-letter">{{ letter }}</span>
    <input
      class="bm-vin"
      :class="{ inh: hit?.inherited }"
      type="text"
      inputmode="numeric"
      :value="hit?.n ?? ''"
      :placeholder="placeholder"
      :aria-label="label"
      :data-sve-build-grid="part"
      @change="typed"
      @keydown.enter.prevent="typed"
      @keydown.up.prevent="set(now + 1)"
      @keydown.down.prevent="set(now - 1)"
    />
    <button type="button" class="fg-step__b" :aria-label="`${label} −`" :disabled="now <= min" @click.prevent="set(now - 1)" v-html="ic('minus')"></button>
    <button type="button" class="fg-step__b" :aria-label="`${label} +`" :disabled="!!max && now >= max" @click.prevent="set(now + 1)" v-html="ic('plus')"></button>
    <BuildFieldReset :hit="own" :label="label" />
  </label>
</template>
