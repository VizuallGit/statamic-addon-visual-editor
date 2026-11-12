<script setup>
/**
 * A Container's width, on top of its Content: the six the theme has
 * (lib/container-widths.js), each a class beside `container` — Normal none —
 * or, on an older Container, beside `wrapper` under that name.
 * One select in a row of its own, as the tag below it: the panel's chevron
 * (`.fg-select`), the browser's list. One at a time and at every size, as
 * the tag is: the size picked in Style does not come into it. The widths' px
 * are the page's own, read off the canvas, so a width changed in the Theme
 * panel shows here as it paints.
 */
import { computed, inject } from 'vue';
import {
  CONTAINER_CLASS,
  CONTAINER_WIDTHS,
  FULL_WIDTH,
  WIDTH_CLASSES,
  containerBase,
  widthClass,
  widthOf,
} from '../../lib/container-widths.js';

const port = inject('sveBuild');

const classes = computed(() => String(port.tagClasses() || '').split(/\s+/));
const current = computed(() => widthOf(classes.value));

const options = computed(() =>
  [...CONTAINER_WIDTHS, FULL_WIDTH].map((w) => {
    const px = w.token ? port.themePx(w.token) : null;
    const label = port.t(`width_${w.key.replace('-', '_')}`);
    const size = w.key === 'full' ? '100%' : px === null ? '' : `${Math.round(px)} px`;

    return { ...w, label: size ? `${label} · ${size}` : label };
  })
);

function pick(key) {
  const w = options.value.find((item) => item.key === key);

  if (w) {
    port.setOneOf(WIDTH_CLASSES, widthClass(w, containerBase(classes.value) || CONTAINER_CLASS));
  }
}
</script>

<template>
  <div class="fg-row" data-sve-build-widths>
    <span class="fg-rlab">{{ port.t('content_width') }}</span>
    <label class="fg-field">
      <select
        class="fg-select"
        :aria-label="port.t('content_width')"
        :value="current"
        data-sve-build-width-select
        @change="pick($event.target.value)"
      >
        <option v-for="w in options" :key="w.key" :value="w.key">{{ w.label }}</option>
      </select>
    </label>
  </div>
</template>
