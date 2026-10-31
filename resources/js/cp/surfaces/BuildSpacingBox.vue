<script setup>
/**
 * Padding or margin in one box, as the approved sketch drew it (Bricks), back
 * beside the Figma fields (BuildBoxFields.vue) — Spacing shows one of the two
 * (BuildStyle.vue). Padding | margin are tabs, so one box is shown at a time;
 * the button beside them goes round which sides move together: each alone,
 * top and bottom, left and right, all four (`nextLink`). Its icon is the four
 * sides, the ones moving together lit (`.bm-sp-sides`). A trapezoid per side
 * holds its value where the side is; top and bottom stay a step darker than the
 * sides, tinted or not, and a side with its own value is tinted (the input
 * holds a value, not a placeholder — the sketch's `:has()` rule, BuildPanel.vue
 * `.bm-spx`).
 *
 * The sides are the dock's own box tools — CSS_TOOLS `padding` / `margin` and
 * their children (`padding-block-start`, `padding-all` …) — so a side here,
 * a field in the Figma view and a side in the Tailwind pane are one tool.
 *
 * The unit beside the tabs (px, rem, em, %; kept in this browser) is what a
 * side is dragged in: up and down on a side writes `pt-[5rem]`
 * (BuildValueInput.vue `scrub`); a click on it still opens the menu.
 */
import { computed, inject, ref } from 'vue';
import BuildValueInput from './BuildValueInput.vue';
import { SIDES, nextLink, sideFallbackTools, sideTool } from '../../build-mode/classes.js';
import { kidsById } from '../../build-mode/catalog.js';

const props = defineProps({
  tools: { type: Object, required: true }, // { padding, margin } CSS_TOOLS entries
});

const port = inject('sveBuild');
const box = ref('padding');
const link = ref('');

const UNITS = ['px', 'rem', 'em', '%'];
const UNIT_KEY = 'sve-build-spacing-unit';

function readUnit() {
  try {
    const kept = window.localStorage.getItem(UNIT_KEY);

    return UNITS.includes(kept) ? kept : 'rem';
  } catch {
    return 'rem';
  }
}

const unit = ref(readUnit());

function setUnit(value) {
  unit.value = value;

  try {
    window.localStorage.setItem(UNIT_KEY, value);
  } catch {
    /* kept for this visit */
  }
}

const LINK_TITLE = { '': 'link_title_off', block: 'link_title_block', inline: 'link_title_inline', all: 'link_title_all' };
const linkTitle = computed(() => LINK_TITLE[link.value]);
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
    <div class="bm-seg bm-sp-unit" :title="port.t('spacing_unit')" :aria-label="port.t('spacing_unit')">
      <button
        v-for="item in UNITS"
        :key="item"
        type="button"
        :aria-pressed="unit === item"
        :data-sve-build-unit="item"
        @click="setUnit(item)"
      >{{ item }}</button>
    </div>
    <div class="bm-seg bm-sp-sides">
      <button
        type="button"
        :title="port.t(linkTitle)"
        :aria-label="port.t(linkTitle)"
        :data-sve-build-link="link || 'off'"
        @click="link = nextLink(link)"
      >
        <svg class="bm-ic" viewBox="0 0 24 24" aria-hidden="true">
          <path :class="{ 'is-lit': link === 'block' || link === 'all' }" d="M8 4h8M8 20h8" />
          <path :class="{ 'is-lit': link === 'inline' || link === 'all' }" d="M4 8v8M20 8v8" />
        </svg>
      </button>
    </div>
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
      :scrub="unit"
      :negative="box === 'margin'"
      compact
    />
  </div>
</template>
