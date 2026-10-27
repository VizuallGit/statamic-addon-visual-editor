<script setup>
/**
 * Margin and padding in one box, the way Bricks and Webflow draw it: a
 * switch for which, a trapezoid per side, the value typed where the side is.
 *
 * The sides are the dock's own box tools — CSS_TOOLS `padding` / `margin`
 * and their children (`padding-block-start`, `padding-block`,
 * `padding-all` …) — so a side here and a side in the Tailwind pane are the
 * same tool. The link decides which one a side writes: each on its own, all
 * four, or the two of one axis. A side that has its own value is tinted; the
 * top and bottom sit one step lighter than the sides, as in the sketch.
 */
import { computed, inject, reactive, ref } from 'vue';
import BuildValueInput from './BuildValueInput.vue';
import { SIDES, sideFallbackTools, sideTool } from '../../build-mode/classes.js';
import { kidsById } from '../../build-mode/catalog.js';
import { BUILD_ICONS } from '../../build-mode/icons.js';

const props = defineProps({
  tools: { type: Object, required: true }, // { padding, margin } CSS_TOOLS entries
});

const port = inject('sveBuild');
const box = ref('padding');
const link = ref('');
const owns = reactive({});

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
  ['', 'link_sides', 'link_each'],
  ['all', 'link_all', null],
  ['block', 'link_block', null],
  ['inline', 'link_inline', null],
];

function linkTitle(value, fallback) {
  if (fallback) {
    return port.t(fallback);
  }

  return value === 'all' ? box.value : `${box.value}-${value}`;
}
</script>

<template>
  <div class="sve-build-box">
    <div class="sve-build-box__top">
      <div class="sve-build-seg sve-build-box__mode">
        <button
          v-for="item in ['margin', 'padding']"
          :key="item"
          type="button"
          :data-active="box === item ? '' : null"
          :aria-pressed="box === item"
          @click="box = item"
        >{{ item }}</button>
      </div>
      <button
        type="button"
        class="sve-build-icon"
        :data-active="link === 'all' ? '' : null"
        :title="port.t('link_title')"
        :aria-label="port.t('link_title')"
        @click="link = link === 'all' ? '' : 'all'"
        v-html="BUILD_ICONS.link"
      ></button>
    </div>

    <div class="sve-build-box__frame" :data-box="box">
      <i
        v-for="row in sides"
        :key="`z-${row.pos}`"
        class="sve-build-box__zone"
        :class="[`is-${row.pos}`, { 'is-own': owns[`${box}-${row.side}-${link}`] }]"
      ></i>
      <span class="sve-build-box__core">{{ port.t(box === 'padding' ? 'box_content' : 'box_element') }}</span>
      <BuildValueInput
        v-for="row in sides"
        :key="`${box}-${row.side}-${link}`"
        :class="`sve-build-box__in is-${row.pos}`"
        :tool="row.tool"
        :fallbacks="row.fallbacks"
        :label="`${box}-${row.side}`"
        compact
        @own="(value) => (owns[`${box}-${row.side}-${link}`] = value)"
      />
    </div>

    <div class="sve-build-seg sve-build-box__link">
      <button
        v-for="[value, label, title] in LINKS"
        :key="value || 'sides'"
        type="button"
        :data-active="link === value ? '' : null"
        :aria-pressed="link === value"
        :title="linkTitle(value, title)"
        @click="link = value"
      >{{ port.t(label) }}</button>
    </div>
    <p class="sve-build-hint">{{ port.t('value_hint') }}</p>
  </div>
</template>

<style scoped>
.sve-build-box__top {
  display: flex;
  align-items: center;
  gap: 0.4em;
  margin: 0.35em 0 0.5em;
}
.sve-build-box__mode {
  flex: 1;
}
.sve-build-box__mode button,
.sve-build-box__link button {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
.sve-build-box__frame {
  position: relative;
  height: 9.5rem;
  border-radius: 0.45rem;
  overflow: hidden;
  border: 1px solid rgba(128, 128, 128, 0.3);
}
.sve-build-box__zone {
  position: absolute;
  inset: 0;
  /* The sides one step down from the top and bottom, from the panel's own greys. */
  background: rgba(128, 128, 128, 0.12);
  transition: background 0.12s;
}
.sve-build-box__zone.is-t,
.sve-build-box__zone.is-b {
  background: rgba(128, 128, 128, 0.2);
}
.sve-build-box__zone.is-t {
  clip-path: polygon(0 0, 100% 0, 72% 34%, 28% 34%);
}
.sve-build-box__zone.is-b {
  clip-path: polygon(28% 66%, 72% 66%, 100% 100%, 0 100%);
}
.sve-build-box__zone.is-l {
  clip-path: polygon(0 0, 28% 34%, 28% 66%, 0 100%);
}
.sve-build-box__zone.is-r {
  clip-path: polygon(100% 0, 100% 100%, 72% 66%, 72% 34%);
}
.sve-build-box__zone.is-own {
  background: var(--sve-build-accent-soft);
}
.sve-build-box__frame:has(.sve-build-box__in.is-t input:is(:hover, :focus)) .is-t,
.sve-build-box__frame:has(.sve-build-box__in.is-b input:is(:hover, :focus)) .is-b,
.sve-build-box__frame:has(.sve-build-box__in.is-l input:is(:hover, :focus)) .is-l,
.sve-build-box__frame:has(.sve-build-box__in.is-r input:is(:hover, :focus)) .is-r {
  background: var(--sve-build-accent-hover);
}
.sve-build-box__core {
  position: absolute;
  inset: 34% 28%;
  display: grid;
  place-items: center;
  border-radius: 0.2rem;
  border: 1px solid rgba(128, 128, 128, 0.3);
  background: rgba(128, 128, 128, 0.08);
  font: 500 0.5625rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  opacity: 0.6;
}
.sve-build-box__in {
  position: absolute;
  z-index: 1;
}
.sve-build-box__in.is-t {
  top: 7%;
  left: 50%;
  transform: translateX(-50%);
}
.sve-build-box__in.is-b {
  bottom: 7%;
  left: 50%;
  transform: translateX(-50%);
}
.sve-build-box__in.is-l {
  left: 1.5%;
  top: 50%;
  transform: translateY(-50%);
}
.sve-build-box__in.is-r {
  right: 1.5%;
  top: 50%;
  transform: translateY(-50%);
}
.sve-build-box__in.is-l :deep(input),
.sve-build-box__in.is-r :deep(input) {
  width: 4rem;
}
.sve-build-box__link {
  margin-top: 0.45em;
}
</style>
