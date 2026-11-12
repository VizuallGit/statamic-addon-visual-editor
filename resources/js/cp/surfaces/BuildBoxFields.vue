<script setup>
/**
 * Padding or margin as fields, one for each side or set of sides that moves
 * together. The button beside them is the box's (BuildLinkSides.vue): each alone,
 * top and bottom, left and right, all four.
 *
 * Every field is one of the dock's own box tools (CSS_TOOLS `padding` /
 * `margin` children: `padding-inline`, `padding-block`, `padding-block-start`
 * …), so a side here is the same tool as in the Tailwind pane. A side shows
 * what reaches it from its axis or from all four (grey) when it has nothing
 * of its own.
 */
import { computed, inject, ref } from 'vue';
import BuildField from './BuildField.vue';
import BuildLinkSides from './BuildLinkSides.vue';
import BuildValueInput from './BuildValueInput.vue';
import { kidsById } from '../../build-mode/catalog.js';
import { sideFallbackTools, sideTool } from '../../build-mode/classes.js';

const props = defineProps({
  tool: { type: Object, required: true }, // CSS_TOOLS `padding` or `margin`
});

const port = inject('sveBuild');
const box = computed(() => props.tool.id);
const kids = computed(() => kidsById(props.tool));
const fallbacks = (id) =>
  sideFallbackTools(box.value, id)
    .map((other) => kids.value.get(other)?.css)
    .filter(Boolean);

const link = ref('');
const ICONS = {
  'block-start': 'padT',
  'block-end': 'padB',
  'inline-start': 'padL',
  'inline-end': 'padR',
  block: 'padY',
  inline: 'padX',
  all: 'sides',
};
const ORDER = ['block-start', 'block-end', 'inline-start', 'inline-end'];

const rows = computed(() => {
  const ids = [...new Set(ORDER.map((side) => sideTool(box.value, side, link.value)))];

  return ids
    .map((id) => ({ id, icon: ICONS[id.slice(box.value.length + 1)], tool: kids.value.get(id) }))
    .filter((row) => row.tool);
});
</script>

<template>
  <div class="fg-box">
    <div class="fg-grid">
      <BuildField v-for="row in rows" :key="row.id" :icon="row.icon" :title="row.tool.css">
        <BuildValueInput :tool="row.tool" :fallbacks="fallbacks(row.id)" :label="row.tool.css" compact />
      </BuildField>
    </div>
    <BuildLinkSides v-model:link="link" :box="box" />
  </div>
</template>
