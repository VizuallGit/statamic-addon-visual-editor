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
  <template v-else v-for="choice in choices" :key="choice.value">
    <!--
      A heading is not a thing you can pick, so it is not a button. It is here
      because a list of behaviours that all sound alike is a list nobody can
      sort: the heading says which of the three jobs the rows under it do.
    -->
    <span v-if="choice.heading" data-sve-css-head-row>{{ choice.label }}</span>
    <!--
      A sentence, not a heading and not a row you can press. It is here for the
      one menu that is deliberately short: without it, a list missing two thirds
      of itself looks broken rather than staged.
    -->
    <span v-else-if="choice.note" data-sve-css-note-row>{{ choice.label }}</span>
    <button
      v-else
      type="button"
      data-sve-css-choice
      :data-sve-css-token="choice.token || undefined"
      :data-active="choice.active ? '' : undefined"
      @click.prevent.stop="onPick(choice.value)"
    >
      <span data-sve-css-choice-label>{{ choice.label }}</span>
      <!-- The attribute it writes. The whole of "how would I know that". -->
      <span v-if="choice.hint" data-sve-css-choice-hint>{{ choice.hint }}</span>
    </button>
  </template>
</template>
