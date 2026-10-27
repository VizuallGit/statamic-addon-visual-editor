<script setup>
/**
 * A segmented row of the dock's own buttons for one tool: its children from
 * CSS_TOOLS (`justify-*`, `align-*`, a border's sides, a radius's corners),
 * each with the icon and title the Tailwind pane gives it, lit and clicked
 * through `port.active` / `port.run` — `twToolActive` / `runTwTool`, the same
 * rule as the pane's own row. A child the row has no icon for yet wears the
 * sketch's glyph (`glyph`).
 *
 * Alignment is drawn for a row; in a `flex-col` the main axis runs down, so
 * the icons turn with it (`rotate`). The CSS value stays in the tooltip: the
 * icon says what it looks like, the tooltip what it is called.
 */
import { inject, ref } from 'vue';
import { ic } from '../../build-mode/icons.js';

defineProps({
  kids: { type: Array, required: true },
  rotate: { type: Boolean, default: false },
  align: { type: Boolean, default: true },
});

const port = inject('sveBuild');
const buttons = ref({});

const tip = (kid) => (kid.css && kid.value ? `${kid.css}: ${kid.value}` : kid.title);
const icon = (kid) => port.lists.toolIcons[kid.icon] || port.lists.toolIcons[kid.id] || (kid.glyph ? ic(kid.glyph) : '') || kid.title;

/** Lit from the file as it is now: the port's revision is read, so a write redraws it. */
function lit(kid) {
  port.rev.value;

  return !!port.active(kid);
}
</script>

<template>
  <div class="bm-seg" :class="{ 'bm-seg-al': align, 'is-col': rotate }">
    <button
      v-for="kid in kids"
      :key="kid.id"
      :ref="(el) => (buttons[kid.id] = el)"
      type="button"
      :aria-pressed="lit(kid)"
      :title="tip(kid)"
      :aria-label="tip(kid)"
      :data-sve-build-kid="kid.id"
      @click="port.run(kid, buttons[kid.id])"
      v-html="icon(kid)"
    ></button>
  </div>
</template>
