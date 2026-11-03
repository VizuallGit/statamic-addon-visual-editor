<script setup>
/**
 * A Container's width, on top of its Content: the six the theme has
 * (lib/container-widths.js), each a class beside `wrapper` — Normal none.
 * One at a time and at every size, as the tag is: the size picked in Style
 * does not come into it. The widths' px are the page's own, read off the
 * canvas, so a width changed in the Theme panel shows here as it paints.
 */
import { computed, inject } from 'vue';
import { CONTAINER_WIDTHS, FULL_WIDTH, WIDTH_CLASSES, widthOf } from '../../lib/container-widths.js';

const port = inject('sveBuild');

const current = computed(() => widthOf(String(port.tagClasses() || '').split(/\s+/)));

const options = computed(() => [...CONTAINER_WIDTHS, FULL_WIDTH].map((w) => {
  const px = w.token ? port.themePx(w.token) : null;

  return { ...w, label: port.t(`width_${w.key.replace('-', '_')}`), px: px === null ? '' : `${Math.round(px)} px` };
}));

function pick(w) {
  port.setOneOf(WIDTH_CLASSES, w.cls);
}
</script>

<template>
  <div class="bm-widths-field" data-sve-build-widths>
    <div class="fg-lab">{{ port.t('content_width') }}</div>
    <div class="fg-seg bm-widths" role="radiogroup" :aria-label="port.t('content_width')">
      <button
        v-for="w in options"
        :key="w.key"
        type="button"
        role="radio"
        :aria-checked="current === w.key"
        :aria-pressed="current === w.key"
        :title="w.px ? `${w.label} · ${w.px}` : w.label"
        :data-sve-build-width="w.key"
        @click="pick(w)"
      >
        <span class="bm-widths__name">{{ w.label }}</span>
        <span class="bm-widths__px">{{ w.key === 'full' ? '100%' : w.px }}</span>
      </button>
    </div>
  </div>
</template>
