<script setup>
/**
 * A row of the dock's own buttons for one tool: its children from CSS_TOOLS
 * (`justify-*`, `align-*`, `flex-row`, a border's sides, a radius's
 * corners), each with the icon and title the Tailwind pane gives it, lit and
 * clicked through `port.active` / `port.run` — `twToolActive` / `runTwTool`,
 * the same rule as the pane's own row.
 *
 * Alignment is drawn for a row; in a `flex-col` the main axis runs down, so
 * the icons turn with it (`rotate`). The CSS property stays in the tooltip:
 * the icon says what it looks like, the tooltip what it is called.
 */
import { inject, ref } from 'vue';

const props = defineProps({
  kids: { type: Array, required: true },
  rotate: { type: Boolean, default: false },
});

const port = inject('sveBuild');
const buttons = ref({});

function tip(kid) {
  return kid.css && kid.value ? `${kid.css}: ${kid.value}` : kid.title;
}

/** Lit from the file as it is now: the port's revision is read, so a write redraws it. */
function lit(kid) {
  port.rev.value;

  return port.active(kid);
}

function click(kid) {
  port.run(kid, buttons.value[kid.id]);
}
</script>

<template>
  <div class="sve-build-seg sve-build-align" :class="{ 'is-turned': rotate }">
    <button
      v-for="kid in kids"
      :key="kid.id"
      :ref="(el) => (buttons[kid.id] = el)"
      type="button"
      :data-active="lit(kid) ? '' : null"
      :title="tip(kid)"
      :aria-label="tip(kid)"
      :aria-pressed="lit(kid)"
      @click="click(kid)"
      v-html="port.lists.toolIcons[kid.icon] || port.lists.toolIcons[kid.id] || kid.title"
    ></button>
  </div>
</template>

<style scoped>
.sve-build-align :deep(svg) {
  width: 1rem;
  height: 1rem;
}
.sve-build-align.is-turned :deep(svg) {
  transform: rotate(90deg);
}
</style>
