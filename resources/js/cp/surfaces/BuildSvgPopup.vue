<script setup>
/**
 * Add's SVG tile: the site's SVGs (BuildSvgPicker.vue) in a popup beside the
 * Build panel, level with the tile — where Loop and If open theirs
 * (logic-popup.js, lib/beside.js). Nothing is written until a picture is
 * picked; Escape or a press outside closes it with nothing written.
 *
 * On the Control Panel's body, so no column's overflow or stacking clips it.
 * It wears the panel's root class for the panel's look (BuildPanel.vue).
 */
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import BuildSvgPicker from './BuildSvgPicker.vue';
import { bindTips, hideTip } from '../tip.js';
import { besideSpot } from '../../lib/beside.js';
import { ic } from '../../build-mode/icons.js';

const props = defineProps({
  /** The tile's box and the panel's (getBoundingClientRect) when the tile was pressed. */
  row: { type: Object, required: true },
  column: { type: Object, required: true },
});

const emit = defineEmits(['pick', 'close']);

const port = inject('sveBuild');
const el = ref(null);
const spot = ref({ left: 0, top: 0 });
let observer = null;
let stopTips = null;

function place() {
  if (!el.value) {
    return;
  }

  spot.value = besideSpot(
    props.row,
    props.column,
    { width: el.value.offsetWidth, height: el.value.offsetHeight },
    { width: window.innerWidth, height: window.innerHeight }
  );
}

const onDown = (event) => {
  if (!el.value?.contains(event.target)) {
    emit('close');
  }
};

// Ahead of Build's own Escape, which would let go of the pick.
const onKey = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    emit('close');
  }
};

onMounted(() => {
  // The list arriving makes it taller: placed again, so it never runs off the window.
  observer = new ResizeObserver(place);
  observer.observe(el.value);
  place();
  stopTips = bindTips(window, el.value);
  document.addEventListener('pointerdown', onDown, true);
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('resize', place);
});

onBeforeUnmount(() => {
  stopTips?.();
  hideTip(document);
  observer?.disconnect();
  document.removeEventListener('pointerdown', onDown, true);
  window.removeEventListener('keydown', onKey, true);
  window.removeEventListener('resize', place);
});
</script>

<template>
  <Teleport to="body">
    <div
      ref="el"
      class="sve-build bm-pop"
      role="dialog"
      :aria-label="port.t('svg_title')"
      data-sve-build-svg-pop
      :style="{ left: `${spot.left}px`, top: `${spot.top}px` }"
    >
      <h3 class="bm-pop-head">
        <span>{{ port.t('svg_title') }}</span>
        <button type="button" class="bm-ib sm" :title="port.t('close')" :aria-label="port.t('close')" @click="emit('close')" v-html="ic('x')"></button>
      </h3>
      <div class="bm-pop-body">
        <BuildSvgPicker @pick="(src) => emit('pick', src)" />
      </div>
    </div>
  </Teleport>
</template>
