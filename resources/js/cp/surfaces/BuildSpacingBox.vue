<script setup>
/**
 * Margin and padding in one box, as the approved sketch draws it (Bricks):
 * margin | padding and the link above, a trapezoid per side with the value
 * typed where the side is, the link modes below. Top and bottom sit one step
 * lighter than the sides; a side with its own value is tinted (the input
 * holds a value, not a placeholder — the sketch's `:has()` rule).
 *
 * The sides are the dock's own box tools — CSS_TOOLS `padding` / `margin`
 * and their children (`padding-block-start`, `padding-block`, `padding-all`
 * …) — so a side here and a side in the Tailwind pane are the same tool.
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

const LINKS = [
  ['', 'link_sides'],
  ['all', 'link_all'],
  ['block', 'link_block'],
  ['inline', 'link_inline'],
];

const linkTitle = (value) => (value === '' ? port.t('link_each') : value === 'all' ? box.value : `${box.value}-${value}`);
</script>

<template>
  <div class="bm-sp-top">
    <div class="bm-seg bm-sp-mode">
      <button
        v-for="item in ['margin', 'padding']"
        :key="item"
        type="button"
        :aria-pressed="box === item"
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
      @click="link = link === 'all' ? '' : 'all'"
      v-html="ic('linkic')"
    ></button>
  </div>

  <div class="bm-spx" :data-mode="box === 'padding' ? 'p' : 'm'">
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

  <div class="bm-seg bm-sp-link">
    <button
      v-for="[value, label] in LINKS"
      :key="value || 'sides'"
      type="button"
      :aria-pressed="link === value"
      :title="linkTitle(value)"
      :data-sve-build-link="value || 'sides'"
      @click="link = value"
    ><span>{{ port.t(label) }}</span></button>
  </div>
  <p class="bm-st-hint" v-html="port.t('value_hint')"></p>
</template>
