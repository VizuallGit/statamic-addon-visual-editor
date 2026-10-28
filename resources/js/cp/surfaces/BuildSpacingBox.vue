<script setup>
/**
 * Padding or margin in one box, as the approved sketch drew it (Bricks), back
 * beside the Figma fields (BuildBoxFields.vue) — Spacing shows one of the two
 * (BuildStyle.vue). Padding | margin are tabs, so one box is shown at a time;
 * the link beside them writes all four sides at once. A trapezoid per side
 * holds its value where the side is; top and bottom sit one step lighter than
 * the sides, and a side with its own value is tinted (the input holds a value,
 * not a placeholder — the sketch's `:has()` rule, BuildPanel.vue `.bm-spx`).
 *
 * The sides are the dock's own box tools — CSS_TOOLS `padding` / `margin` and
 * their children (`padding-block-start`, `padding-all` …) — so a side here,
 * a field in the Figma view and a side in the Tailwind pane are one tool.
 */
import { computed, inject, ref } from 'vue';
import BuildValueInput from './BuildValueInput.vue';
import { SIDES, sideFallbackTools, sideTool } from '../../build-mode/classes.js';
import { kidsById } from '../../build-mode/catalog.js';
import { ic } from '../../build-mode/icons.js';

const props = defineProps({
  tools: { type: Object, required: true }, // { padding, margin } CSS_TOOLS entries
});

const port = inject('sveBuild');
const box = ref('padding');
const link = ref('');

const kids = computed(() => kidsById(props.tools[box.value]));
const POS = { 'block-start': 't', 'inline-end': 'r', 'block-end': 'b', 'inline-start': 'l' };

const sides = computed(() =>
  SIDES.map((side) => {
    const id = sideTool(box.value, side, link.value);

    return {
      side,
      pos: POS[side],
      tool: kids.value.get(id),
      fallbacks: sideFallbackTools(box.value, id).map((other) => kids.value.get(other)?.css).filter(Boolean),
    };
  }).filter((row) => row.tool)
);
</script>

<template>
  <div class="bm-sp-top">
    <div class="bm-seg bm-sp-mode" role="tablist">
      <button
        v-for="item in ['padding', 'margin']"
        :key="item"
        type="button"
        role="tab"
        :aria-pressed="box === item"
        :aria-selected="box === item"
        :data-sve-build-box="item"
        @click="box = item"
      ><span>{{ item }}</span></button>
    </div>
    <button
      type="button"
      class="bm-ib sm"
      :class="{ 'is-on': link === 'all' }"
      :title="port.t('link_title')"
      :aria-label="port.t('link_title')"
      :aria-pressed="link === 'all'"
      data-sve-build-link="all"
      @click="link = link === 'all' ? '' : 'all'"
      v-html="ic('linkic')"
    ></button>
  </div>

  <div class="bm-spx" :data-mode="box === 'padding' ? 'p' : 'm'" data-sve-build-spacing-box>
    <i class="bm-tz bm-tz-t"></i>
    <i class="bm-tz bm-tz-r"></i>
    <i class="bm-tz bm-tz-b"></i>
    <i class="bm-tz bm-tz-l"></i>
    <span class="bm-spx-c">{{ port.t(box === 'padding' ? 'box_content' : 'box_element') }}</span>
    <BuildValueInput
      v-for="row in sides"
      :key="`${box}-${row.side}-${link}`"
      :class="`bm-sp-${row.pos}`"
      :tool="row.tool"
      :fallbacks="row.fallbacks"
      :label="`${box}-${row.side}`"
      compact
    />
  </div>
</template>
