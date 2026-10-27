<script setup>
/**
 * Padding or margin the way Figma draws padding: two fields, across and
 * down, and a button that opens all four sides.
 *
 * Every field is one of the dock's own box tools (CSS_TOOLS `padding` /
 * `margin` children: `padding-inline`, `padding-block`, `padding-block-start`
 * …), so a side here is the same tool as in the Tailwind pane. A side shows
 * what reaches it from its axis or from all four (light) when it has nothing
 * of its own; the four open by themselves when the element already has a
 * single side set.
 */
import { computed, inject, ref } from 'vue';
import BuildField from './BuildField.vue';
import BuildValueInput from './BuildValueInput.vue';
import { kidsById } from '../../build-mode/catalog.js';
import { sideFallbackTools } from '../../build-mode/classes.js';
import { ic } from '../../build-mode/icons.js';

const props = defineProps({
  tool: { type: Object, required: true }, // CSS_TOOLS `padding` or `margin`
});

const port = inject('sveBuild');
const box = computed(() => props.tool.id);
const kids = computed(() => kidsById(props.tool));
const fallbacks = (id) => sideFallbackTools(box.value, id).map((other) => kids.value.get(other)?.css).filter(Boolean);

const SIDE_PROPS = ['block-start', 'block-end', 'inline-start', 'inline-end', 'top', 'bottom', 'left', 'right'];
const hasSide = computed(() => {
  port.rev.value;

  return port.pickedClasses().some((raw) => SIDE_PROPS.some((side) => port.propertyOf(raw.split(':').pop()) === `${box.value}-${side}`));
});
const opened = ref(null);
const four = computed(() => (opened.value === null ? hasSide.value : opened.value));

const TWO = [
  ['inline', 'padX'],
  ['block', 'padY'],
];
const FOUR = [
  ['block-start', 'padT'],
  ['block-end', 'padB'],
  ['inline-start', 'padL'],
  ['inline-end', 'padR'],
];
const rows = computed(() =>
  (four.value ? FOUR : TWO)
    .map(([side, icon]) => ({ id: `${box.value}-${side}`, icon, tool: kids.value.get(`${box.value}-${side}`) }))
    .filter((row) => row.tool)
);
</script>

<template>
  <div class="fg-box">
    <div class="fg-grid">
      <BuildField v-for="row in rows" :key="row.id" :icon="row.icon" :title="row.tool.css">
        <BuildValueInput :tool="row.tool" :fallbacks="fallbacks(row.id)" :label="row.tool.css" compact />
      </BuildField>
    </div>
    <button
      type="button"
      class="fg-ib"
      :aria-pressed="four"
      :title="port.t('link_each')"
      :aria-label="port.t('link_each')"
      :data-sve-build-sides="box"
      @click="opened = !four"
      v-html="ic('sides')"
    ></button>
  </div>
</template>
