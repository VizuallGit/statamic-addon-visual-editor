<script setup>
defineProps({
  kind: { type: String, required: true },
  swatches: { type: Array, default: () => [] },
  choices: { type: Array, default: () => [] },
  onClear: { type: Function, default: null },
  onPick: { type: Function, required: true },
});
</script>

<template>
  <div v-if="kind === 'colors'" data-sve-css-swatches>
    <button type="button" data-sve-css-clear title="Clear" @click.prevent.stop="onClear">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 2l6 6M8 2L2 8"/></svg>
    </button>
    <button
      v-for="swatch in swatches"
      :key="swatch.name"
      type="button"
      data-sve-css-swatch
      :data-sve-css-token="swatch.name"
      :title="swatch.name"
      :data-active="swatch.active ? '' : undefined"
      :style="{ background: swatch.hex || 'transparent' }"
      @click.prevent.stop="onPick(swatch.name)"
    ></button>
  </div>
  <button
    v-else
    v-for="choice in choices"
    :key="choice.value"
    type="button"
    data-sve-css-choice
    :data-sve-css-token="choice.token || undefined"
    :data-active="choice.active ? '' : undefined"
    @click.prevent.stop="onPick(choice.value)"
  >
    {{ choice.label }}
  </button>
</template>
